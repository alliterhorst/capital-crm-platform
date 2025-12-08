import { MESSAGES_HELPER } from '@/shared/lib/messages-helper';
import { JSX } from 'react';
import { TooltipProps } from 'recharts';

export const CustomTooltip = ({
  active,
  // @ts-expect-error - payload pode ser indefinido
  payload,
  // @ts-expect-error -  label pode ser indefinido
  label,
}: TooltipProps<number, string>): JSX.Element | null => {
  if (active && payload && payload.length) {
    const dateLabel = label || '';
    const date = new Date(`${dateLabel}-01T00:00:00`);

    const formattedDate = !isNaN(date.getTime())
      ? new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' }).format(date)
      : dateLabel;

    return (
      <div className="rounded-lg border bg-background p-3 shadow-lg ring-1 ring-black/5">
        <p className="mb-2 text-sm font-medium text-foreground capitalize">{formattedDate}</p>
        <div className="flex flex-col gap-1">
          {/* @ts-expect-error - ignorando erro de tipagem do payload */}
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center gap-2 text-xs">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="text-muted-foreground">
                {entry.dataKey === 'count'
                  ? MESSAGES_HELPER.DASHBOARD.METRICS.NEW_CLIENTS
                  : MESSAGES_HELPER.DASHBOARD.METRICS.VALUATION}
              </span>
              <span className="font-bold tabular-nums">
                {entry.dataKey === 'totalCompanyValue'
                  ? new Intl.NumberFormat(MESSAGES_HELPER.CLIENTS.CURRENCY.LOCALE, {
                      style: 'currency',
                      currency: MESSAGES_HELPER.CLIENTS.CURRENCY.CURRENCY,
                    }).format(Number(entry.value))
                  : entry.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};
