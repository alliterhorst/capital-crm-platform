import { JSX, useMemo, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { MESSAGES_HELPER } from '@/shared/lib/messages-helper';
import { Button } from '@/shared/ui/button';
import { ClientCard } from './components/client-card';
import {
  getListClientsQueryKey,
  useListClients,
  useUpdateClient,
  useUpdateAllSelections,
} from '@/shared/api/generated/clients/clients';
import {
  ListClientsParams,
  PaginatedClientsResultDto,
  UpdateSelectionDto,
} from '@/shared/api/generated/model';
import { ClientFormModal } from './components/client-form-modal';
import { DeleteConfirmationModal } from './components/delete-confirmation-modal';
import { queryClient } from '@/shared/lib/api-client';
import { Pagination } from './components/pagination';

type ClientReadDto = {
  id: string;
  name: string;
  salary: number;
  companyValue: number;
  isSelected: boolean;
};

const ROWS_PER_PAGE_OPTIONS: number[] = [8, 16, 32];

type ViewMode = 'all' | 'selected';

interface HeaderBarProps {
  totalClients: number;
  rowsPerPage: number;
  onRowsPerPageChange: (value: number) => void;
  viewMode: ViewMode;
}

function HeaderBar({
  totalClients,
  rowsPerPage,
  onRowsPerPageChange,
  viewMode,
}: HeaderBarProps): JSX.Element {
  const isSelectedMode: boolean = viewMode === 'selected';

  return (
    <div className="flex items-center justify-between gap-4">
      <h2 className="text-base text-foreground">
        {isSelectedMode ? (
          <span className="font-bold">{MESSAGES_HELPER.CLIENTS.TITLE_SELECTED_FIXED}</span>
        ) : (
          <span>
            <span className="font-bold"> {totalClients}</span>
            {MESSAGES_HELPER.CLIENTS.TITLE_LIST}
          </span>
        )}
      </h2>

      <div className="flex items-center gap-2 text-muted-foreground">
        <span className="text-base text-foreground">{MESSAGES_HELPER.CLIENTS.PER_PAGE}</span>
        <select
          value={rowsPerPage}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>): void =>
            onRowsPerPageChange(Number(e.target.value))
          }
          className="h-9 rounded-md border bg-background px-2 text-sm text-foreground"
        >
          {ROWS_PER_PAGE_OPTIONS.map((rows: number) => (
            <option key={rows} value={rows}>
              {rows}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

interface ClientsPageProps {
  currentPath: string;
}

export function ClientsPage({ currentPath }: ClientsPageProps): JSX.Element {
  const [page, setPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(ROWS_PER_PAGE_OPTIONS[1]);
  const [isFormModalOpen, setIsFormModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [editingClientId, setEditingClientId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const viewMode: ViewMode = useMemo((): ViewMode => {
    return currentPath.includes('/selected-clients') ? 'selected' : 'all';
  }, [currentPath]);

  const isSelectedMode: boolean = viewMode === 'selected';

  const params: ListClientsParams = useMemo((): ListClientsParams => {
    const baseParams: ListClientsParams = { page, limit: rowsPerPage } as ListClientsParams;
    if (isSelectedMode) {
      return { ...baseParams, selected: true };
    }
    return baseParams;
  }, [page, rowsPerPage, isSelectedMode]);

  const {
    data: listData,
    isLoading,
  }: { data: PaginatedClientsResultDto | undefined; isLoading: boolean } = useListClients(params);
  const { mutateAsync: updateClient } = useUpdateClient();
  const { mutateAsync: updateAllSelectionsMutation, isPending: isBulkUpdating } =
    useUpdateAllSelections();

  const clients: ClientReadDto[] = (
    ((listData as PaginatedClientsResultDto)?.data as ClientReadDto[]) || []
  ).map((c: ClientReadDto) => ({
    ...c,
    isSelected: Boolean(c.isSelected),
  }));

  const totalClients: number = listData?.meta?.total || 0;
  const totalPages: number = listData?.meta?.lastPage || 1;

  const hasSelectedClients: boolean = totalClients > 0;

  const selectedClient: ClientReadDto | undefined = clients.find(
    (c: ClientReadDto) => c.id === editingClientId,
  );

  const handleEdit = (id: string): void => {
    setEditingClientId(id);
    setIsFormModalOpen(true);
  };

  const handleCreate = (): void => {
    setEditingClientId(null);
    setIsFormModalOpen(true);
  };

  const handleDelete = (id: string): void => {
    setEditingClientId(id);
    setIsDeleteModalOpen(true);
  };

  const handleRowsPerPageChange = (value: number): void => {
    setRowsPerPage(value);
    setPage(1);
  };

  const handleSelectToggle = async (id: string, currentStatus: boolean): Promise<void> => {
    const currentClient: ClientReadDto | undefined = clients.find(
      (c: ClientReadDto) => c.id === id,
    );

    if (!currentClient) {
      toast.error(MESSAGES_HELPER.GLOBAL.GENERIC_ERROR);
      return;
    }

    try {
      setTogglingId(id);

      await updateClient({
        id,
        data: {
          isSelected: !currentStatus,
        },
      });

      queryClient.invalidateQueries({ queryKey: getListClientsQueryKey() });
    } catch {
      toast.error(MESSAGES_HELPER.GLOBAL.GENERIC_ERROR);
    } finally {
      setTogglingId(null);
    }
  };

  const handleBulkSelection = async (select: boolean): Promise<void> => {
    const payload: UpdateSelectionDto = { isSelected: select };

    try {
      await updateAllSelectionsMutation({ data: payload });

      const successMessage: string = select
        ? MESSAGES_HELPER.CLIENTS.FEEDBACK.SELECT_ALL_SUCCESS
        : MESSAGES_HELPER.CLIENTS.FEEDBACK.CLEAR_SUCCESS;

      toast.success(successMessage);
      queryClient.invalidateQueries({ queryKey: getListClientsQueryKey() });
      setPage(1);
    } catch {
      toast.error(MESSAGES_HELPER.GLOBAL.GENERIC_ERROR);
    }
  };

  const actionButton = useMemo((): JSX.Element => {
    if (!isSelectedMode) {
      return (
        <Button
          onClick={handleCreate}
          variant="outline"
          className="h-12 w-full bg-transparent border-primary text-primary hover:bg-primary/10"
        >
          {MESSAGES_HELPER.CLIENTS.ACTIONS.CREATE}
        </Button>
      );
    }

    if (hasSelectedClients) {
      return (
        <Button
          onClick={(): Promise<void> => handleBulkSelection(false)}
          disabled={isBulkUpdating}
          variant="outline"
          className="h-12 w-full bg-transparent border-primary text-primary hover:bg-primary/10"
        >
          {isBulkUpdating
            ? MESSAGES_HELPER.CLIENTS.ACTIONS.CLEARING
            : MESSAGES_HELPER.CLIENTS.ACTIONS.CLEAR_SELECTED}
        </Button>
      );
    }

    return (
      <Button
        onClick={(): Promise<void> => handleBulkSelection(true)}
        disabled={isBulkUpdating}
        variant="outline"
        className="h-12 w-full bg-transparent border-primary text-primary hover:bg-primary/10"
      >
        {isBulkUpdating
          ? MESSAGES_HELPER.CLIENTS.ACTIONS.SELECTING
          : MESSAGES_HELPER.CLIENTS.ACTIONS.SELECT_ALL}
      </Button>
    );
  }, [isSelectedMode, hasSelectedClients, isBulkUpdating]);

  return (
    <div className="space-y-6 p-2 lg:p-6 pt-0">
      <HeaderBar
        totalClients={totalClients}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleRowsPerPageChange}
        viewMode={viewMode}
      />

      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {clients.map((client: ClientReadDto) => (
            <ClientCard
              key={client.id}
              id={client.id}
              name={client.name}
              salary={client.salary}
              companyValue={client.companyValue}
              isSelected={client.isSelected}
              isSelectTogglePending={togglingId === client.id}
              onSelectToggle={handleSelectToggle}
              onEdit={handleEdit}
              onDelete={handleDelete}
              viewMode={viewMode}
            />
          ))}
        </div>
      )}

      {actionButton}

      <Pagination
        page={page}
        totalPages={totalPages}
        onSelectPage={(p: number): void => setPage(p)}
      />

      {isFormModalOpen && (
        <ClientFormModal
          isOpen={isFormModalOpen}
          onClose={(): void => setIsFormModalOpen(false)}
          clientId={editingClientId}
        />
      )}

      {isDeleteModalOpen && selectedClient && (
        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={(): void => setIsDeleteModalOpen(false)}
          clientId={editingClientId!}
          clientName={selectedClient.name}
        />
      )}
    </div>
  );
}
