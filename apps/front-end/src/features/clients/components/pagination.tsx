import { JSX } from 'react';
import { Button } from '@/shared/ui/button';

type PaginationItem = number | 'dots';

function createPaginationRange(currentPage: number, totalPages: number): PaginationItem[] {
  if (totalPages <= 1) return [1];

  const range: PaginationItem[] = [];
  const delta = 1;

  const firstPage = 1;
  const lastPage = totalPages;

  const left = Math.max(firstPage + 1, currentPage - delta);
  const right = Math.min(lastPage - 1, currentPage + delta);

  range.push(firstPage);

  if (left > firstPage + 1) range.push('dots');

  for (let p = left; p <= right; p++) range.push(p);

  if (right < lastPage - 1) range.push('dots');

  if (lastPage > firstPage) range.push(lastPage);

  return range;
}

export function Pagination({
  page,
  totalPages,
  onPrev,
  onNext,
  onSelectPage,
}: {
  page: number;
  totalPages: number;
  onPrev?: () => void;
  onNext?: () => void;
  onSelectPage: (p: number) => void;
}): JSX.Element | null {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2">
      {onPrev && (
        <Button variant="outline" size="icon" onClick={onPrev} disabled={page <= 1}>
          {'<'}
        </Button>
      )}

      <div className="flex items-center gap-2">
        {createPaginationRange(page, totalPages).map((item, index) =>
          item === 'dots' ? (
            <span key={`dots-${index}`} className="px-1 text-sm text-muted-foreground select-none">
              ...
            </span>
          ) : (
            <Button
              key={item}
              size="icon"
              variant={item === page ? 'default' : 'ghost'}
              className={
                item === page
                  ? 'h-8 w-8 rounded-md bg-primary text-primary-foreground'
                  : 'h-8 w-8 rounded-md'
              }
              onClick={() => onSelectPage(item)}
            >
              <span className="text-sm font-medium">{item}</span>
            </Button>
          ),
        )}
      </div>

      {onNext && (
        <Button variant="outline" size="icon" onClick={onNext} disabled={page >= totalPages}>
          {'>'}
        </Button>
      )}
    </div>
  );
}
