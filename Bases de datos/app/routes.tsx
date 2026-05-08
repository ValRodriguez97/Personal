import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Teams from "./pages/Teams";
import Players from "./pages/Players";
import Matches from "./pages/Matches";
import Stadiums from "./pages/Stadiums";
import Queries from "./pages/Queries";
import Reports from "./pages/Reports";
import Users from "./pages/Users";
import AuditLog from "./pages/AuditLog";

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: "teams", Component: Teams },
      { path: "players", Component: Players },
      { path: "matches", Component: Matches },
      { path: "stadiums", Component: Stadiums },
      { path: "queries", Component: Queries },
      { path: "reports", Component: Reports },
      { path: "users", Component: Users },
      { path: "audit-log", Component: AuditLog },
    ],
  },
]);
