import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Users, Activity, CreditCard, DollarSign } from 'lucide-react';
import { MESSAGES_HELPER } from '@/shared/lib/messages-helper';
import { JSX } from 'react';

export function DashboardPage(): JSX.Element {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold tracking-tight">{MESSAGES_HELPER.DASHBOARD.TITLE}</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {MESSAGES_HELPER.DASHBOARD.METRICS.TOTAL_CLIENTS}
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,240</div>
            <p className="text-xs text-muted-foreground">
              +12% {MESSAGES_HELPER.DASHBOARD.COMPARISONS.VS_LAST_MONTH}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {MESSAGES_HELPER.DASHBOARD.METRICS.VIEWS}
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+573</div>
            <p className="text-xs text-muted-foreground">
              +201 {MESSAGES_HELPER.DASHBOARD.COMPARISONS.SINCE_LAST_HOUR}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {MESSAGES_HELPER.DASHBOARD.METRICS.REVENUE}
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 45.231,89</div>
            <p className="text-xs text-muted-foreground">
              +19% {MESSAGES_HELPER.DASHBOARD.COMPARISONS.VS_LAST_MONTH}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {MESSAGES_HELPER.DASHBOARD.METRICS.ACTIVE_SUBS}
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+12</div>
            <p className="text-xs text-muted-foreground">
              +2 {MESSAGES_HELPER.DASHBOARD.COMPARISONS.SINCE_YESTERDAY}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
