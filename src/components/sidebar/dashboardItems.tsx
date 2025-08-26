import { SidebarItemsType } from "../../types/sidebar";

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

const pagesSection = [
  {
    href: "/private",
    icon: Sliders,
    title: "DHB Dashboard",
  },
  {
    href: "/accounts",
    icon: CreditCard,
    title: "Accounts",
    children: [
      {
        href: "/accounts/saveonline",
        title: "SaveOnline Account",
      },
      {
        href: "/accounts/open",
        title: "Open Account",
      },
      {
        href: "/accounts/combispaar",
        title: "CombiSpaar Account",
      },
      {
        href: "/accounts/maxispaar",
        title: "MaxiSpaar Account",
      },
      {
        href: "/accounts/saveonline/statement",
        title: "Account Statement",
      },
    ],
  },
  {
    href: "/settings",
    icon: Sliders,
    title: "Settings",
    children: [
      {
        href: "/settings",
        title: "General Settings",
      },
      {
        href: "/settings/personal-details",
        title: "Personal Details",
      },
      {
        href: "/settings/change-password",
        title: "Change Password",
      },
      {
        href: "/settings/online-identification",
        title: "Online Identification",
      },
      {
        href: "/settings/devices/registered",
        title: "Registered Devices",
      },
      {
        href: "/settings/daily-limit",
        title: "Daily Limit",
      },
      {
        href: "/settings/sof-questions",
        title: "SOF Questions",
      },
      {
        href: "/settings/change-counter-account",
        title: "Change Counter Account",
      },
      {
        href: "/settings/documents",
        title: "Documents",
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

const navItems = [
  {
    title: "Pages",
    pages: pagesSection,
  },
  {
    title: "Elements",
    pages: elementsSection,
  },
  {
    title: "Mira Pro",
    pages: docsSection,
  },
];

export default navItems;
