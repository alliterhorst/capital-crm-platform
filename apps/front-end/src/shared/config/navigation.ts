import { LayoutDashboard, Users, CheckSquare, LucideIcon } from 'lucide-react';
import { MESSAGES_HELPER } from '@/shared/lib/messages-helper';

export enum RouteEnum {
  DASHBOARD = 'DASHBOARD',
  CLIENTS = 'CLIENTS',
  SELECTED_CLIENTS = 'SELECTED_CLIENTS',
}

export interface NavigationItem {
  key: RouteEnum;
  path: string;
  label: string;
  icon: LucideIcon;
}

export const NAVIGATION_MAP: Record<RouteEnum, NavigationItem> = {
  [RouteEnum.DASHBOARD]: {
    key: RouteEnum.DASHBOARD,
    path: '/',
    label: MESSAGES_HELPER.MENU.HOME,
    icon: LayoutDashboard,
  },
  [RouteEnum.CLIENTS]: {
    key: RouteEnum.CLIENTS,
    path: '/clients',
    label: MESSAGES_HELPER.MENU.CLIENTS,
    icon: Users,
  },
  [RouteEnum.SELECTED_CLIENTS]: {
    key: RouteEnum.SELECTED_CLIENTS,
    path: '/selected-clients',
    label: MESSAGES_HELPER.MENU.SELECTED_CLIENTS,
    icon: CheckSquare,
  },
};

export const NAVIGATION_ITEMS: NavigationItem[] = Object.values(NAVIGATION_MAP);
