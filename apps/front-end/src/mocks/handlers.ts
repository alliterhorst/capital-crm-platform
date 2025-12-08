import { http, HttpResponse, delay, type HttpHandler, type StrictResponse } from 'msw';

import {
  type AuthResponseDto,
  type ClientDetailDto,
  type ClientMetricDto,
  type ClientResponseDto,
  type CreateClientDto,
  type DashboardResponseDto,
  type LoginDto,
  type MonthlyGrowthDto,
  type PaginatedClientsResultDto,
  type TopClientDto,
  type UpdateClientDto,
  type UpdateResultDto,
  type UpdateSelectionDto,
  type UpdateUserDto,
} from '@/shared/api/generated/model';

interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
}

type StoredClient = ClientDetailDto;

const STORAGE_KEYS = {
  CLIENTS: 'capital-crm-clients-db',
  USER: 'capital-crm-user-db',
  TOKEN: 'capital-crm-auth-token',
} as const;

const INITIAL_USER: User = {
  id: 'user-1',
  name: 'Admin User',
  email: 'admin@capital.com',
  avatarUrl: 'https://github.com/shadcn.png',
};

function createInitialClient(
  id: string,
  name: string,
  salary: number,
  companyValue: number,
  isSelected: boolean,
): StoredClient {
  const now: string = new Date().toISOString();

  const metric: ClientMetricDto = {
    clientId: id,
    views: 0,
    lastViewedAt: now,
  };

  return {
    id,
    name,
    salary,
    companyValue,
    isSelected,
    createdAt: now,
    updatedAt: now,
    metric,
  };
}

const INITIAL_CLIENTS: StoredClient[] = [
  createInitialClient('1', 'Eduardo', 3_500, 120_000, false),
  createInitialClient('2', 'Maria Silva', 8_500, 500_000, true),
  createInitialClient('3', 'Tech Solutions', 12_000, 1_500_000, false),
  createInitialClient('4', 'João Santos', 2_000, 10_000, false),
];

const MOCK_GROWTH_DATA: MonthlyGrowthDto[] = [
  { month: 'Jan', count: 10, totalCompanyValue: 500_000 },
  { month: 'Fev', count: 15, totalCompanyValue: 750_000 },
  { month: 'Mar', count: 20, totalCompanyValue: 900_000 },
  { month: 'Abr', count: 18, totalCompanyValue: 880_000 },
  { month: 'Mai', count: 25, totalCompanyValue: 1_200_000 },
  { month: 'Jun', count: 30, totalCompanyValue: 1_450_000 },
];

function getDbClients(): StoredClient[] {
  const data: string | null = localStorage.getItem(STORAGE_KEYS.CLIENTS);

  if (!data) {
    localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(INITIAL_CLIENTS));
    return INITIAL_CLIENTS;
  }

  return JSON.parse(data) as StoredClient[];
}

function setDbClients(clients: StoredClient[]): void {
  localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(clients));
}

function getDbUser(): User {
  const data: string | null = localStorage.getItem(STORAGE_KEYS.USER);

  if (!data) {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(INITIAL_USER));
    return INITIAL_USER;
  }

  return JSON.parse(data) as User;
}

function updateDbUser(updates: Partial<User>): User {
  const user: User = getDbUser();
  const updatedUser: User = { ...user, ...updates };

  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));

  return updatedUser;
}

function toClientResponse(client: StoredClient): ClientResponseDto {
  const { id, name, salary, companyValue, isSelected, createdAt, updatedAt } = client;

  return {
    id,
    name,
    salary,
    companyValue,
    isSelected,
    createdAt,
    updatedAt,
  };
}

const handlers: HttpHandler[] = [
  http.post(
    '*/api/auth/login',
    async ({ request }): Promise<StrictResponse<AuthResponseDto | null>> => {
      await delay(300);

      const body = (await request.json()) as LoginDto;

      if (!body.email || !body.password) {
        return new HttpResponse(null, { status: 401, statusText: 'Unauthorized' });
      }

      getDbUser();

      const token = `mock-jwt-token-${Date.now()}`;
      localStorage.setItem(STORAGE_KEYS.TOKEN, token);

      const response: AuthResponseDto = {
        accessToken: token,
      };

      return HttpResponse.json(response);
    },
  ),

  http.get('*/api/auth/profile', async (): Promise<StrictResponse<User | null>> => {
    await delay(400);

    const token: string | null = localStorage.getItem(STORAGE_KEYS.TOKEN);

    if (!token) {
      return new HttpResponse(null, { status: 401 });
    }

    const user: User = getDbUser();

    return HttpResponse.json(user);
  }),

  http.patch('*/api/users/profile', async ({ request }): Promise<HttpResponse<null>> => {
    await delay(200);

    const body = (await request.json()) as UpdateUserDto;

    if (!body.name) {
      return new HttpResponse(null, { status: 400 });
    }

    updateDbUser({ name: body.name });

    return new HttpResponse(null, { status: 200 });
  }),

  http.get(
    '*/api/clients',
    async ({ request }): Promise<StrictResponse<PaginatedClientsResultDto>> => {
      await delay(200);

      const url = new URL(request.url);

      const pageParam: string | null = url.searchParams.get('page');
      const limitParam: string | null = url.searchParams.get('limit');
      const selectedParam: string | null = url.searchParams.get('selected');

      const page: number = Number(pageParam) || 1;
      const limit: number = Number(limitParam) || 10;

      const selected: boolean | undefined =
        selectedParam === null ? undefined : selectedParam === 'true';

      let allClients: StoredClient[] = getDbClients();

      if (selected === true) {
        allClients = allClients.filter((client: StoredClient) => client.isSelected === true);
      } else if (selected === false) {
        allClients = allClients.filter((client: StoredClient) => client.isSelected === false);
      }

      const total: number = allClients.length;
      const lastPage: number = Math.ceil(total / limit) || 1;

      const start: number = (page - 1) * limit;
      const end: number = start + limit;

      const pageItems: StoredClient[] = allClients.slice(start, end);

      const data: ClientResponseDto[] = pageItems.map(toClientResponse);

      const response: PaginatedClientsResultDto = {
        data,
        meta: {
          total,
          page,
          lastPage,
          limit,
        },
      };

      return HttpResponse.json(response);
    },
  ),

  http.get(
    '*/api/clients/:id',
    async ({ params }): Promise<StrictResponse<ClientDetailDto | null>> => {
      await delay(300);

      const { id } = params as { id?: string };

      if (!id) {
        return new HttpResponse(null, { status: 400, statusText: 'Invalid client id' });
      }

      const clients: StoredClient[] = getDbClients();
      const index: number = clients.findIndex((client: StoredClient) => client.id === id);

      if (index === -1) {
        return new HttpResponse(null, { status: 404, statusText: 'Client not found' });
      }

      const client: StoredClient = clients[index];

      const updatedMetric: ClientMetricDto = {
        ...client.metric,
        views: client.metric.views + 1,
        lastViewedAt: new Date().toISOString(),
      };

      const updatedClient: StoredClient = {
        ...client,
        metric: updatedMetric,
      };

      clients[index] = updatedClient;
      setDbClients(clients);

      return HttpResponse.json(updatedClient);
    },
  ),

  http.post('*/api/clients', async ({ request }): Promise<StrictResponse<ClientResponseDto>> => {
    await delay(200);

    const body = (await request.json()) as CreateClientDto;

    const now: string = new Date().toISOString();
    const id: string = crypto.randomUUID();

    const metric: ClientMetricDto = {
      clientId: id,
      views: 0,
      lastViewedAt: now,
    };

    const storedClient: StoredClient = {
      id,
      name: body.name,
      salary: body.salary,
      companyValue: body.companyValue,
      isSelected: body.isSelected ?? false,
      createdAt: now,
      updatedAt: now,
      metric,
    };

    const clients: StoredClient[] = getDbClients();
    clients.unshift(storedClient);
    setDbClients(clients);

    const response: ClientResponseDto = toClientResponse(storedClient);

    return HttpResponse.json(response, { status: 201 });
  }),

  http.patch(
    '*/api/clients/:id',
    async ({ params, request }): Promise<StrictResponse<ClientDetailDto | null>> => {
      await delay(200);

      const { id } = params as { id?: string };

      if (!id) {
        return new HttpResponse(null, { status: 400, statusText: 'Invalid client id' });
      }

      const body = (await request.json()) as UpdateClientDto;

      const clients: StoredClient[] = getDbClients();
      const index: number = clients.findIndex((client: StoredClient) => client.id === id);

      if (index === -1) {
        return new HttpResponse(null, { status: 404, statusText: 'Client not found' });
      }

      const current: StoredClient = clients[index];

      const updatedClient: StoredClient = {
        ...current,
        ...body,
        updatedAt: new Date().toISOString(),
      };

      clients[index] = updatedClient;
      setDbClients(clients);

      return HttpResponse.json(updatedClient);
    },
  ),

  http.patch('*/api/clients', async ({ request }): Promise<StrictResponse<UpdateResultDto>> => {
    await delay(800);

    const body = (await request.json()) as UpdateSelectionDto;

    const clients: StoredClient[] = getDbClients();

    const updatedClients: StoredClient[] = clients.map((client: StoredClient) => ({
      ...client,
      isSelected: body.isSelected,
      updatedAt: new Date().toISOString(),
    }));

    setDbClients(updatedClients);

    const result: UpdateResultDto = {
      raw: {},
      affected: updatedClients.length,
      generatedMaps: [],
    };

    return HttpResponse.json(result);
  }),

  http.delete('*/api/clients/:id', async ({ params }): Promise<HttpResponse<null>> => {
    await delay(200);

    const { id } = params as { id?: string };

    if (!id) {
      return new HttpResponse(null, { status: 400 });
    }

    const clients: StoredClient[] = getDbClients();
    const filteredClients: StoredClient[] = clients.filter(
      (client: StoredClient) => client.id !== id,
    );

    if (filteredClients.length === clients.length) {
      return new HttpResponse(null, { status: 404 });
    }

    setDbClients(filteredClients);

    return new HttpResponse(null, { status: 204 });
  }),

  http.get('*/api/metrics/dashboard', async (): Promise<StrictResponse<DashboardResponseDto>> => {
    await delay(200);

    const clients: StoredClient[] = getDbClients();

    const totalClients: number = clients.length;
    const totalCompanyValue: number = clients.reduce(
      (acc: number, client: StoredClient) => acc + client.companyValue,
      0,
    );

    const averageSalary: number =
      totalClients === 0
        ? 0
        : clients.reduce((acc: number, client: StoredClient) => acc + client.salary, 0) /
          totalClients;

    const topViewed: TopClientDto[] = [...clients]
      .sort((a: StoredClient, b: StoredClient) => b.metric.views - a.metric.views)
      .slice(0, 5)
      .map((client: StoredClient) => {
        const topClient: TopClientDto = {
          id: client.id,
          name: client.name,
          views: client.metric.views,
          companyValue: client.companyValue,
          createdAt: client.createdAt,
          updatedAt: client.updatedAt,
        };

        return topClient;
      });

    const response: DashboardResponseDto = {
      totalClients,
      totalCompanyValue,
      averageSalary,
      topViewedClients: topViewed,
    };

    return HttpResponse.json(response);
  }),

  http.get('*/api/metrics/growth', async (): Promise<StrictResponse<MonthlyGrowthDto[]>> => {
    await delay(400);

    return HttpResponse.json(MOCK_GROWTH_DATA);
  }),
];

export { handlers };
