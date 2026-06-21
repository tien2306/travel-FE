import PrivateRoutes from "../components/PrivateRoutes";
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

export const routes = [
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
