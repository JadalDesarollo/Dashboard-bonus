import React from "react";
// Admin Imports

//import NFTMarketplace from "views/admin/marketplace";
//import Profile from "views/admin/profile";
import DataTables from "views/admin/tables";

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
import ClientsTable from "views/admin/tables/components/ClientsTable";
import ClientsTable2 from "views/admin/tables/components/ClientsTable2";

const routes = [
  {
    name: "Clientes",
    layout: "/admin",
    icon: <MdBarChart className="h-6 w-6" />,
    path: "clientes",
    component: <DataTables />,
  },
  {
    name: "Reportes",
    layout: "/admin",
    icon: <MdBarChart className="h-6 w-6" />,
    path: "reportes",
    component: <ClientsTable2 />,
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
  }, {
    name: "Sign In",
    layout: "/auth",
    path: "sign-in",
    icon: <MdLock className="h-6 w-6" />,
    component: <SignIn />,
  },
]

export default routes;
