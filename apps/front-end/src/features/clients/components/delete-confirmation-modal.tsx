import { JSX } from 'react';
import { toast } from 'sonner';
import { MESSAGES_HELPER } from '@/shared/lib/messages-helper';
import { Button } from '@/shared/ui/button';
import { useDeleteClient, getListClientsQueryKey } from '@/shared/api/generated/clients/clients';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog';
import { queryClient } from '@/shared/lib/api-client';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientId: string;
  clientName: string;
}

export function DeleteConfirmationModal({
  isOpen,
  onClose,
  clientId,
  clientName,
}: DeleteConfirmationModalProps): JSX.Element {
  const { mutateAsync: deleteClientMutation, isPending } = useDeleteClient();

  const handleDelete = async (): Promise<void> => {
    try {
      await deleteClientMutation({ id: clientId });
      queryClient.invalidateQueries({ queryKey: getListClientsQueryKey() });
      toast.success(MESSAGES_HELPER.CLIENTS.FEEDBACK.DELETE_SUCCESS);
      onClose();
    } catch {
      toast.error(MESSAGES_HELPER.GLOBAL.GENERIC_ERROR);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-xl font-bold">
            {MESSAGES_HELPER.CLIENTS.MODAL.TITLE_DELETE}
          </DialogTitle>
          <DialogDescription className="text-base text-foreground">
            {MESSAGES_HELPER.CLIENTS.ACTIONS.DELETE_CONFIRMATION}{' '}
            <span className="font-semibold">{clientName}</span>
          </DialogDescription>
        </DialogHeader>

        <Button
          onClick={handleDelete}
          disabled={isPending}
          className="h-12 w-full text-lg font-bold"
        >
          {isPending
            ? MESSAGES_HELPER.CLIENTS.ACTIONS.DELETING
            : MESSAGES_HELPER.CLIENTS.ACTIONS.CONFIRM_DELETE_BUTTON}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
