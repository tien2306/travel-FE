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
import Logout from "../page/Auth/Logout";
import DashBoard from "../page/Admin/DashBoard";
import ListTour from "../page/Admin/Tour/LisTour";
import ListCarousel from "../page/Admin/Carousel/ListCarousel";
import Tours from "../page/Client/Tours";
import ToursAll from "../page/Client/Tours/ToursAll";
import ToursDetail from "../page/Client/Tours/ToursDetail";
import ToursRelated from "../page/Client/Tours/ToursRelated";
import ProfileLayout from "../page/Client/Profile";
import ProfileInfo from "../page/Client/Profile/ProfileInfo";
import Favorites from "../page/Client/Favorites";
import { Navigate } from "react-router-dom";

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
        path: "tours",
        element: <Tours />,
        children: [
          {
            index: true,
            element: <ToursAll />,
          },
          {
            path: "related",
            element: <ToursRelated />,
          },
          {
            path: ":id",
            element: <ToursDetail />,
          },
        ],
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
        path: "favorites",
        element: <Navigate to="/profile/favorites" replace />,
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
          {
            path: "profile",
            element: <ProfileLayout />,
            children: [
              {
                index: true,
                element: <ProfileInfo />,
              },
              {
                path: "favorites",
                element: <Favorites />,
              }
            ]
          },
        ],
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "logout",
        element: <Logout />,
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
            path: "list-tour",
            element: <ListTour />,
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
