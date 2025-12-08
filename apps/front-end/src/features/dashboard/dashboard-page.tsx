import { JSX, useMemo } from 'react';
import { Users, DollarSign, Activity, TrendingUp, Star } from 'lucide-react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  TooltipProps,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { MESSAGES_HELPER } from '@/shared/lib/messages-helper';
import {
  useGetDashboardMetrics,
  useGetGrowthMetrics,
} from '@/shared/api/generated/metrics/metrics';
import { MetricCard } from './components/metric-card';
import { CustomTooltip } from './components/custom-tooltip';

export function DashboardPage(): JSX.Element {
  const { data: metrics, isLoading: isLoadingDashboard } = useGetDashboardMetrics();
  const { data: growthMetrics, isLoading: isLoadingGrowth } = useGetGrowthMetrics();

  const chartData = useMemo(() => {
    return [...(growthMetrics || [])].reverse().map((item) => ({
      ...item,
      month: item.month,
    }));
  }, [growthMetrics]);

  const newCustomersCount = useMemo(() => {
    if (!chartData.length) return 0;
    const lastMonth = chartData[chartData.length - 1];
    return lastMonth ? lastMonth.count : 0;
  }, [chartData]);

  function formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(value);
  }

  function formatXAxis(tickItem: string): string {
    if (!tickItem) return '';
    const date = new Date(`${tickItem}-01T00:00:00`);
    if (isNaN(date.getTime())) return tickItem;
    const formatted = new Intl.DateTimeFormat('pt-BR', { month: 'short', year: '2-digit' }).format(
      date,
    );
    return formatted.replace('.', '').replace(' de ', '/');
  }

  const recentClients = metrics?.topViewedClients?.slice(0, 5) || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">{MESSAGES_HELPER.DASHBOARD.TITLE}</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          title={MESSAGES_HELPER.DASHBOARD.METRICS.TOTAL_REVENUE}
          value={formatCurrency(metrics?.totalCompanyValue || 0)}
          description={MESSAGES_HELPER.DASHBOARD.METRICS.CONTEXT_TOTAL}
          icon={DollarSign}
          isLoading={isLoadingDashboard}
        />

        <MetricCard
          title={MESSAGES_HELPER.DASHBOARD.METRICS.NEW_CUSTOMERS}
          value={`+${newCustomersCount}`}
          description={MESSAGES_HELPER.DASHBOARD.METRICS.CONTEXT_MONTH}
          icon={Activity}
          isLoading={isLoadingGrowth}
        />

        <MetricCard
          title={MESSAGES_HELPER.DASHBOARD.METRICS.ACTIVE_ACCOUNTS}
          value={metrics?.totalClients || 0}
          description={MESSAGES_HELPER.DASHBOARD.METRICS.CONTEXT_TOTAL}
          icon={Users}
          isLoading={isLoadingDashboard}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-1">
        <Card className="col-span-7 lg:col-span-4 p-2 lg:p-8">
          <CardHeader>
            <CardTitle>{MESSAGES_HELPER.DASHBOARD.METRICS.GROWTH_AND_VALUATION}</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {isLoadingGrowth ? (
              <div className="flex h-[350px] items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              </div>
            ) : (
              <div className="h-[350px] w-full select-none [&_.recharts-surface]:outline-none [&_.recharts-wrapper]:outline-none [&_*:focus]:outline-none">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#005F73" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#005F73" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorValuation" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#EC6724" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#EC6724" stopOpacity={0} />
                      </linearGradient>
                    </defs>

                    <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#E5E7EB" />

                    <XAxis
                      dataKey="month"
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickMargin={10}
                      tickFormatter={formatXAxis}
                    />

                    <YAxis yAxisId="left" hide />
                    <YAxis yAxisId="right" orientation="right" hide />

                    <Tooltip content={<CustomTooltip />} cursor={false} />

                    <Area
                      yAxisId="right"
                      type="monotone"
                      dataKey="totalCompanyValue"
                      stroke="#EC6724"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorValuation)"
                      activeDot={{ r: 4, fill: '#EC6724', strokeWidth: 0 }}
                    />

                    <Area
                      yAxisId="left"
                      type="monotone"
                      dataKey="count"
                      stroke="#005F73"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorCount)"
                      activeDot={{ r: 6, stroke: '#005F73', strokeWidth: 2, fill: 'white' }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="p-6 pb-0">{MESSAGES_HELPER.DASHBOARD.RECENT_CLIENTS}</CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <div className="overflow-x-auto">
            {isLoadingDashboard ? (
              <div className="p-4 text-sm text-muted-foreground">
                {MESSAGES_HELPER.DASHBOARD.RECENT_CLIENTS_LOADING}
              </div>
            ) : (
              <div className="space-y-1">
                <div className="grid grid-cols-4 border-b px-4 py-2 text-xs font-medium text-muted-foreground">
                  <div className="col-span-2">{MESSAGES_HELPER.DASHBOARD.NAME}</div>
                  <div> {MESSAGES_HELPER.DASHBOARD.VIEWS}</div>
                  <div className="text-right"> {MESSAGES_HELPER.DASHBOARD.COMPANY_VALUE}</div>
                </div>

                {recentClients.map((client) => (
                  <div
                    key={client.id}
                    className="grid grid-cols-4 px-4 py-3 text-sm transition-colors hover:bg-muted/50"
                  >
                    <div className="col-span-2 font-medium">{client.name}</div>
                    <div className="text-muted-foreground">{client.views}</div>
                    <div className="text-right font-medium">
                      {formatCurrency(client.companyValue)}
                    </div>
                  </div>
                ))}

                {recentClients.length === 0 && (
                  <div className="p-4 text-sm text-muted-foreground">
                    {MESSAGES_HELPER.DASHBOARD.NO_RECENT_CLIENTS}
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
