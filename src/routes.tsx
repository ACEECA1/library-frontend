import { createBrowserRouter } from "react-router";
import { Layout } from "./layout/Layout";
import { Home } from "./features/books/pages/Home";
import { Browse } from "./features/books/pages/Browse";
import { BookDetails } from "./features/books/pages/BookDetails";
import { Reader } from "./features/books/pages/Reader";
import { Login } from "./features/auth/pages/Login";
import { Register } from "./features/auth/pages/Register";
import { MyCollection } from "./features/books/pages/MyCollection";
import { AdminDashboard } from "./features/dashboard/pages/AdminDashboard";
import { Settings } from "./features/dashboard/Settings";
export const router = createBrowserRouter([
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/register",
    Component: Register,
  },
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "browse", Component: Browse },
      { path: "book/:id", Component: BookDetails },
      { path: "read/:id", Component: Reader },
      { path: "collection", Component: MyCollection },
      { path: "admin", Component: AdminDashboard },
      { path: "settings", Component: Settings },
    ],
  },
]);
