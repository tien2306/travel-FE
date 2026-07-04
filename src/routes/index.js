import PrivateRoutes from "../components/Common/PrivateRoutes";
import LayoutAdmin from "../layout/LayoutAdmin";
import LayoutDefault from "../layout/LayoutDefault";
import About from "../page/Client/About";
import Blog from "../page/Client/Blog";
import BlogDetail from "../page/Client/Blog/BlogDetail";
import BlogPosts from "../page/Client/Blog/BlogPosts";
import Contact from "../page/Client/Contact";
import Error404 from "../page/Auth/Error404";
import Home from "../page/Client/Home";
import Login from "../page/Auth/Login";
import Register from "../page/Auth/Register";
import DashBoard from "../page/Admin/DashBoard";
import BookRoom from "../page/Admin/BookTour";
import CreateRoom from "../page/Admin/CreateTour";
import Logout from "../page/Auth/Logout";
import CreateCarousel from "../page/Admin/CreateCarousel";
import ListCarousel from "../page/Admin/ListCarousel";

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
  {
    path: "/admin",
    element: <PrivateRoutes allowedRoles={["ADMIN"]} />,
    children: [
      {
        element: <LayoutAdmin />,
        children: [
          {
            index: true,
            element: <DashBoard />,
          },
          {
            path: "book-tour",
            element: <BookRoom />,
          },
          {
            path: "create-tour",
            element: <CreateRoom />,
          },
          {
            path: "list-tour",
            element: <ListCarousel />,
          },
          {
            path: "create-carousel",
            element: <CreateCarousel />,
          },
          {
            path: "list-carousel",
            element: <ListCarousel />,
          },
        ],
      },
    ],
  },
];
