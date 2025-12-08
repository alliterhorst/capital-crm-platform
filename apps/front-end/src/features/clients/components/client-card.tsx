import { JSX } from 'react';
import { Plus, Minus, Trash2, Pencil } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { MESSAGES_HELPER } from '@/shared/lib/messages-helper';
import { cn } from '@/shared/lib/utils';

type ViewMode = 'all' | 'selected';

interface ClientCardProps {
  id: string;
  name: string;
  salary: number;
  companyValue: number;
  isSelected: boolean;
  isSelectTogglePending?: boolean;
  onSelectToggle: (id: string, currentStatus: boolean) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  viewMode?: ViewMode;
}

export function ClientCard({
  id,
  name,
  salary,
  companyValue,
  isSelected,
  isSelectTogglePending = false,
  onSelectToggle,
  onEdit,
  onDelete,
  viewMode = 'all',
}: ClientCardProps): JSX.Element {
  const navigate = useNavigate();
  const isSelectedMode: boolean = viewMode === 'selected';

  function formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  }

  const handleGoToDetails = (): void => {
    navigate(`/clients/${id}`);
  };

  return (
    <Card className="flex flex-col justify-between overflow-hidden">
      <CardHeader className="p-4 pb-1">
        <CardTitle
          className="text-sm font-semibold text-center cursor-pointer hover:underline"
          onClick={handleGoToDetails}
          role="link"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') handleGoToDetails();
          }}
        >
          {name}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-1 p-4 pt-0 text-center pb-1">
        <p className="text-sm text-muted-foreground">
          {MESSAGES_HELPER.CLIENTS.FIELDS.SALARY}{' '}
          <span className="font-medium">{formatCurrency(salary)}</span>
        </p>
        <p className="text-sm text-muted-foreground">
          {MESSAGES_HELPER.CLIENTS.FIELDS.COMPANY}{' '}
          <span className="font-medium">{formatCurrency(companyValue)}</span>
        </p>
      </CardContent>

      <CardFooter
        className={cn(
          'flex items-center px-4 pt-1 pb-4',
          isSelectedMode ? 'justify-end' : 'justify-between',
        )}
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={(): void => onSelectToggle(id, isSelected)}
          disabled={isSelectTogglePending}
          className={cn('hover:bg-primary/10 hover:text-primary', isSelectedMode && 'text-primary')}
          aria-label={isSelected ? 'Remover seleção' : 'Adicionar seleção'}
        >
          {isSelected ? <Minus className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
        </Button>

        {!isSelectedMode && (
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={(): void => onEdit(id)}
              className="text-muted-foreground hover:bg-muted"
              aria-label="Editar cliente"
            >
              <Pencil className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={(): void => onDelete(id)}
              className="text-destructive hover:bg-destructive/10"
              aria-label="Excluir cliente"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
}
