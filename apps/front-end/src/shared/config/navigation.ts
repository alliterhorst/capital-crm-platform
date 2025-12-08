import { LayoutDashboard, Users, CheckSquare, LucideIcon, LogIn } from 'lucide-react';
import { MESSAGES_HELPER } from '@/shared/lib/messages-helper';

export enum RouteEnum {
  DASHBOARD = 'DASHBOARD',
  CLIENTS = 'CLIENTS',
  SELECTED_CLIENTS = 'SELECTED_CLIENTS',
  LOGIN = 'LOGIN',
  WELCOME = 'WELCOME',
}

export interface NavigationItem {
  key: RouteEnum;
  path: string;
  label: string;
  icon: LucideIcon;
  headerMenuVisible?: boolean;
  sideMenuVisible?: boolean;
}

export const NAVIGATION_MAP: Record<RouteEnum, NavigationItem> = {
  [RouteEnum.DASHBOARD]: {
    key: RouteEnum.DASHBOARD,
    path: '/',
    label: MESSAGES_HELPER.MENU.HOME,
    icon: LayoutDashboard,
    headerMenuVisible: false,
    sideMenuVisible: true,
  },
  [RouteEnum.CLIENTS]: {
    key: RouteEnum.CLIENTS,
    path: '/clients',
    label: MESSAGES_HELPER.MENU.CLIENTS,
    icon: Users,
    headerMenuVisible: true,
    sideMenuVisible: true,
  },
  [RouteEnum.SELECTED_CLIENTS]: {
    key: RouteEnum.SELECTED_CLIENTS,
    path: '/selected-clients',
    label: MESSAGES_HELPER.MENU.SELECTED_CLIENTS,
    icon: CheckSquare,
    headerMenuVisible: true,
    sideMenuVisible: true,
  },
  [RouteEnum.LOGIN]: {
    key: RouteEnum.LOGIN,
    path: '/login',
    label: MESSAGES_HELPER.AUTH.BUTTON_LOGIN,
    icon: LogIn,
    headerMenuVisible: false,
    sideMenuVisible: false,
  },
  [RouteEnum.WELCOME]: {
    key: RouteEnum.WELCOME,
    path: '/welcome',
    label: MESSAGES_HELPER.WELCOME_SCREEN.TITLE,
    icon: LogIn,
    headerMenuVisible: false,
    sideMenuVisible: false,
  },
};

export const NAVIGATION_ITEMS: NavigationItem[] = Object.values(NAVIGATION_MAP);
