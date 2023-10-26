import React from "react";
// Admin Imports
import MainDashboard from "views/admin/default";
import NFTMarketplace from "views/admin/marketplace";
import Profile from "views/admin/profile";
import DataTables from "views/admin/tables";
import RTLDefault from "views/rtl/default";
// Auth Imports
import SignIn from "views/auth/SignIn";
// Icon Imports
import {
  MdHome,
  MdOutlineShoppingCart,
  MdBarChart,
  MdPerson,
  MdLock,
} from "react-icons/md";
import TransactionClient from "views/admin/tables/components/TransactionCliente";
import TransactionPending from "views/admin/tables/components/TransactionPending";

const routes = [
  {
    name: "Clientes",
    layout: "/admin",
    icon: <MdBarChart className="h-6 w-6" />,
    path: "clientes",
    component: <DataTables />,
  },
  {
    name: "Movimientos",
    icon: <MdBarChart className="h-6 w-6" />,
    layout: "/admin",
    path: "clientes/:id",
    component: <TransactionClient />,
  },
  {
    name: "Pendientes",
    icon: <MdBarChart className="h-6 w-6" />,
    layout: "/admin",
    path: "clientes/pendientes/:id",
    component: <TransactionPending />,
  }
]

export default routes;
