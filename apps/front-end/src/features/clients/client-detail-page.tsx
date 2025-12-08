import { JSX, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Copy, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { MESSAGES_HELPER } from '@/shared/lib/messages-helper';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import {
  getGetClientByIdQueryKey,
  getListClientsQueryKey,
  useGetClientById,
  useUpdateClient,
} from '@/shared/api/generated/clients/clients';
import { queryClient } from '@/shared/lib/api-client';
import { ClientForm, ClientFormPayload } from './components/client-form';

function formatDateTime(value?: string | null): string {
  if (!value) return MESSAGES_HELPER.GLOBAL.NOT_AVAILABLE;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return MESSAGES_HELPER.GLOBAL.NOT_AVAILABLE;
  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(date);
}

async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export function ClientDetailPage(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const clientId = id ?? '';

  const { data, isLoading } = useGetClientById(clientId, {
    query: {
      enabled: Boolean(clientId),
      queryKey: getGetClientByIdQueryKey(clientId),
    },
  });

  const { mutateAsync: updateClient, isPending } = useUpdateClient();

  const initialValues = useMemo(() => {
    if (!data) return undefined;
    return {
      name: data.name,
      salary: Number(data.salary),
      companyValue: Number(data.companyValue),
    };
  }, [data]);

  const handleCopyId = async (): Promise<void> => {
    if (!clientId) return;
    const ok = await copyToClipboard(clientId);
    if (ok) toast.success(MESSAGES_HELPER.CLIENTS.DETAILS.COPY_SUCCESS);
    else toast.error(MESSAGES_HELPER.GLOBAL.GENERIC_ERROR);
  };

  const handleSubmit = async (payload: ClientFormPayload): Promise<void> => {
    try {
      await updateClient({ id: clientId, data: payload });

      queryClient.invalidateQueries({ queryKey: getGetClientByIdQueryKey(clientId) });
      queryClient.invalidateQueries({ queryKey: getListClientsQueryKey() });

      toast.success(MESSAGES_HELPER.CLIENTS.FEEDBACK.UPDATE_SUCCESS);
    } catch {
      toast.error(MESSAGES_HELPER.GLOBAL.GENERIC_ERROR);
    }
  };

  if (isLoading || !data) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-2 lg:p-6 pt-0">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">
            {MESSAGES_HELPER.CLIENTS.DETAILS.TITLE}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <span className="text-sm text-muted-foreground">
                {MESSAGES_HELPER.CLIENTS.DETAILS.ID_LABEL}
              </span>

              <div className="flex items-center gap-2">
                <Input value={data.id} readOnly className="h-12 font-mono" />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-12 w-12"
                  onClick={handleCopyId}
                  aria-label={MESSAGES_HELPER.CLIENTS.DETAILS.COPY_ACTION}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className="text-sm text-muted-foreground">
                  {MESSAGES_HELPER.CLIENTS.DETAILS.CREATED_AT}
                </span>
                <div className="text-sm font-medium">{formatDateTime(data.createdAt)}</div>
              </div>

              <div className="space-y-1">
                <span className="text-sm text-muted-foreground">
                  {MESSAGES_HELPER.CLIENTS.DETAILS.UPDATED_AT}
                </span>
                <div className="text-sm font-medium">{formatDateTime(data.updatedAt)}</div>
              </div>

              <div className="space-y-1">
                <span className="text-sm text-muted-foreground">
                  {MESSAGES_HELPER.CLIENTS.DETAILS.VIEWS}
                </span>
                <div className="text-sm font-medium">{data.metric?.views ?? 0}</div>
              </div>

              <div className="space-y-1">
                <span className="text-sm text-muted-foreground">
                  {MESSAGES_HELPER.CLIENTS.DETAILS.LAST_VIEWED_AT}
                </span>
                <div className="text-sm font-medium">
                  {formatDateTime(data.metric?.lastViewedAt)}
                </div>
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <ClientForm
              initialValues={initialValues}
              submitLabel={MESSAGES_HELPER.CLIENTS.DETAILS.SAVE_ACTION}
              pendingLabel={MESSAGES_HELPER.CLIENTS.DETAILS.SAVE_PENDING}
              isPending={isPending}
              onSubmit={handleSubmit}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
