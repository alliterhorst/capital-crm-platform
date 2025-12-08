import { JSX } from 'react';
import { toast } from 'sonner';
import { MESSAGES_HELPER } from '@/shared/lib/messages-helper';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/ui/dialog';
import {
  getGetClientByIdQueryKey,
  getListClientsQueryKey,
  useCreateClient,
  useGetClientById,
  useUpdateClient,
} from '@/shared/api/generated/clients/clients';
import { queryClient } from '@/shared/lib/api-client';
import { ClientForm, ClientFormPayload } from './client-form';

interface ClientFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientId: string | null;
}

export function ClientFormModal({ isOpen, onClose, clientId }: ClientFormModalProps): JSX.Element {
  const isEditing = Boolean(clientId);
  const resolvedClientId = clientId ?? '';

  const title = isEditing
    ? MESSAGES_HELPER.CLIENTS.MODAL.TITLE_EDIT
    : MESSAGES_HELPER.CLIENTS.MODAL.TITLE_CREATE;

  const submitLabel = isEditing
    ? MESSAGES_HELPER.CLIENTS.ACTIONS.EDIT
    : MESSAGES_HELPER.CLIENTS.ACTIONS.CREATE;

  const { data: clientToEdit } = useGetClientById(resolvedClientId, {
    query: {
      enabled: isEditing && isOpen,
      queryKey: getGetClientByIdQueryKey(resolvedClientId),
    },
  });

  const { mutateAsync: createClientMutation, isPending: isCreating } = useCreateClient();
  const { mutateAsync: updateClientMutation, isPending: isUpdating } = useUpdateClient();

  const isPending = isCreating || isUpdating;

  const handleSubmit = async (payload: ClientFormPayload): Promise<void> => {
    try {
      if (isEditing) {
        if (!clientId) throw new Error('clientId is required for editing');
        await updateClientMutation({ id: clientId, data: payload });
        toast.success(MESSAGES_HELPER.CLIENTS.FEEDBACK.UPDATE_SUCCESS);
      } else {
        await createClientMutation({ data: payload });
        toast.success(MESSAGES_HELPER.CLIENTS.FEEDBACK.CREATE_SUCCESS);
      }

      queryClient.invalidateQueries({ queryKey: getListClientsQueryKey() });

      if (isEditing && clientId) {
        queryClient.invalidateQueries({ queryKey: getGetClientByIdQueryKey(clientId) });
      }

      onClose();
    } catch {
      toast.error(MESSAGES_HELPER.GLOBAL.GENERIC_ERROR);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader className="space-y-1">
          <DialogTitle className="text-xl font-bold">{title}</DialogTitle>
        </DialogHeader>

        <ClientForm
          initialValues={
            clientToEdit
              ? {
                  name: clientToEdit.name,
                  salary: Number(clientToEdit.salary),
                  companyValue: Number(clientToEdit.companyValue),
                }
              : undefined
          }
          submitLabel={submitLabel}
          pendingLabel={MESSAGES_HELPER.CLIENTS.MODAL.PENDING_SAVE}
          isPending={isPending}
          onSubmit={handleSubmit}
        />
      </DialogContent>
    </Dialog>
  );
}
