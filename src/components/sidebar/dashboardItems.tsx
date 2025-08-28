import { SidebarItemsType } from "../../types/sidebar";
import { useTranslation } from "react-i18next";

import {
  BookOpen,
  Briefcase,
  Calendar,
  CheckSquare,
  CreditCard,
  Grid,
  Heart,
  Layout,
  List,
  Map,
  ShoppingCart,
  PieChart,
  Sliders,
  Users,
} from "react-feather";

const pagesSection = (t: any) => [
  {
    href: "/private",
    icon: Sliders,
    title: t('dashboard'),
  },
  {
    href: "/accounts",
    icon: CreditCard,
    title: t('accounts.title'),
    children: [
      {
        href: "/accounts/saveonline",
        title: t('saveOnline'),
      },
      {
        href: "/accounts/open",
        title: t('new-account'),
      },
      {
        href: "/accounts/combispaar",
        title: t('combiSpaar'),
      },
      {
        href: "/accounts/maxispaar",
        title: t('maxiSpaar'),
      },
      {
        href: "/accounts/saveonline/statement",
        title: t('account-statement'),
      },
    ],
  },
  {
    href: "/settings",
    icon: Sliders,
    title: t('settings'),
    children: [
      {
        href: "/settings",
        title: t('settings.nav.application_settings'),
      },
      {
        href: "/settings/personal-details",
        title: t('personal-details'),
      },
      {
        href: "/settings/change-password",
        title: t('personal-detail.password.title'),
      },
      {
        href: "/settings/online-identification",
        title: t('update-id'),
      },
      {
        href: "/settings/devices/registered",
        title: t('settings.nav.registered_devices'),
      },
      {
        href: "/settings/daily-limit",
        title: t('settings.nav.daily_limit'),
      },
      {
        href: "/settings/sof-questions",
        title: t('settings.nav.sof_questions'),
      },
      {
        href: "/settings/change-counter-account",
        title: t('settings.nav.change_counter_account'),
      },
      {
        href: "/settings/documents",
        title: t('settings.nav.documents'),
      },
    ],
  },
  {
    href: "/pages",
    icon: Layout,
    title: "Pages",
    children: [
      {
        href: "/pages/profile",
        title: "Profile",
      },
      {
        href: "/pages/settings",
        title: "Settings",
      },
      {
        href: "/pages/pricing",
        title: "Pricing",
      },
      {
        href: "/pages/chat",
        title: "Chat",
      },
      {
        href: "/pages/blank",
        title: "Blank Page",
      },
    ],
  },
  {
    href: "/projects",
    icon: Briefcase,
    title: "Projects",
    badge: "8",
  },
  {
    href: "/orders",
    icon: ShoppingCart,
    title: "Orders",
  },
  {
    href: "/invoices",
    icon: CreditCard,
    title: "Invoices",
    children: [
      {
        href: "/invoices",
        title: "List",
      },
      {
        href: "/invoices/detail",
        title: "Detail",
      },
    ],
  },
  {
    href: "/tasks",
    icon: CheckSquare,
    title: "Tasks",
    badge: "17",
  },
  {
    href: "/calendar",
    icon: Calendar,
    title: "Calendar",
  },
  {
    href: "/auth",
    icon: Users,
    title: "Auth",
    children: [
      {
        href: "/auth/sign-in",
        title: "Sign In",
      },
      {
        href: "/auth/sign-up",
        title: "Sign Up",
      },
      {
        href: "/auth/reset-password",
        title: "Reset Password",
      },
      {
        href: "/auth/404",
        title: "404 Page",
      },
      {
        href: "/auth/500",
        title: "500 Page",
      },
    ],
  },
] as SidebarItemsType[];

const elementsSection = [
  {
    href: "/components",
    icon: Grid,
    title: "Components",
    children: [
      {
        href: "/components/alerts",
        title: "Alerts",
      },
      {
        href: "/components/accordion",
        title: "Accordion",
      },
      {
        href: "/components/avatars",
        title: "Avatars",
      },
      {
        href: "/components/badges",
        title: "Badges",
      },
      {
        href: "/components/buttons",
        title: "Buttons",
      },
      {
        href: "/components/cards",
        title: "Cards",
      },
      {
        href: "/components/chips",
        title: "Chips",
      },
      {
        href: "/components/dialogs",
        title: "Dialogs",
      },
      {
        href: "/components/lists",
        title: "Lists",
      },
      {
        href: "/components/menus",
        title: "Menus",
      },
      {
        href: "/components/pagination",
        title: "Pagination",
      },
      {
        href: "/components/progress",
        title: "Progress",
      },
      {
        href: "/components/snackbars",
        title: "Snackbars",
      },
      {
        href: "/components/tooltips",
        title: "Tooltips",
      },
    ],
  },
  {
    href: "/charts",
    icon: PieChart,
    title: "Charts",
    children: [
      {
        href: "/charts/chartjs",
        title: "Chart.js",
      },
      {
        href: "/charts/apexcharts",
        title: "ApexCharts",
      },
    ],
  },
  {
    href: "/forms",
    icon: CheckSquare,
    title: "Forms",
    children: [
      {
        href: "/forms/pickers",
        title: "Pickers",
      },
      {
        href: "/forms/selection-controls",
        title: "Selection Controls",
      },
      {
        href: "/forms/selects",
        title: "Selects",
      },
      {
        href: "/forms/text-fields",
        title: "Text Fields",
      },
      {
        href: "/forms/editors",
        title: "Editors",
      },
      {
        href: "/forms/formik",
        title: "Formik",
      },
    ],
  },
  {
    href: "/tables",
    icon: List,
    title: "Tables",
    children: [
      {
        href: "/tables/simple-table",
        title: "Simple Table",
      },
      {
        href: "/tables/advanced-table",
        title: "Advanced Table",
      },
      {
        href: "/tables/data-grid",
        title: "Data Grid",
      },
    ],
  },
  {
    href: "/icons",
    icon: Heart,
    title: "Icons",
    children: [
      {
        href: "/icons/material-icons",
        title: "Material Icons",
      },
      {
        href: "/icons/feather-icons",
        title: "Feather Icons",
      },
    ],
  },
  {
    href: "/maps",
    icon: Map,
    title: "Maps",
    children: [
      {
        href: "/maps/google-maps",
        title: "Google Maps",
      },
      {
        href: "/maps/vector-maps",
        title: "Vector Maps",
      },
    ],
  },
] as SidebarItemsType[];

const docsSection = [
  {
    href: "/documentation/welcome",
    icon: BookOpen,
    title: "Documentation",
  },
  {
    href: "/changelog",
    icon: List,
    title: "Changelog",
    badge: "v4.5.0",
  },
] as SidebarItemsType[];

const navItems = (t: any) => [
  {
    title: t('pages'),
    pages: pagesSection(t),
  },
  {
    title: t('elements'),
    pages: elementsSection,
  },
  {
    title: t('mira_pro'),
    pages: docsSection,
  },
];

export default navItems;
