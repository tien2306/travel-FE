import PrivateRoutes from "../components/PrivateRoutes";
import AdminLayout from "../components/admin/AdminLayout";
import LayoutDefault from "../layout/LayoutDefault";
import About from "../page/About";
import Blog from "../page/Blog";
import BlogDetail from "../page/Blog/BlogDetail";
import BlogPosts from "../page/Blog/BlogPosts";
import Contact from "../page/Contact";
import Error404 from "../page/Error404";
import Home from "../page/Home";
import Login from "../page/Login";
import Logout from "../page/Logout";

import Register from "../page/Register";
import Dashboard from "../page/admin/Dashboard";
import TourManagement from "../page/admin/TourManagement";

export const routes = [
  {
    element: <PrivateRoutes allowedRoles={["ADMIN"]} />,
    children: [
      {
        path: "/admin",
        element: <AdminLayout />,
        children: [
          {
            index: true,
            element: <Dashboard
            />,
          },
          {
            path: "tours",
            element: <TourManagement
            />,
          },
          {
            path: "bookings",
            element: <Dashboard />,
          },
          {
            path: "users",
            element: <Dashboard />,
          },
          {
            path: "settings",
            element: <Dashboard />,
          },
        ],
      },
    ],
  },
  {
    path: "/",
    element: <LayoutDefault />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "about",
        element: <About />,
      },
      {
        path: "contact",
        element: <Contact />,
      },
      {
        path: "blog",
        element: <Blog />,
        children: [
          {
            index: true,
            element: <BlogPosts />,
          },
          {
            path: "blogdetail",
            element: <BlogDetail />,
          },
        ],
      },

      {
        element: <PrivateRoutes />,
        children: [
          // {
          //   path: "info-user",
          //   element: <InfoUser />,
          // },
        ],
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "logout",
        element: <Logout />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "*",
        element: <Error404 />,
      },
    ],
  },
];
