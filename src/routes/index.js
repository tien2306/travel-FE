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
import MapQuizWrapper from "../page/Client/MapQuiz";
import Topic from "../page/Client/MapQuiz/Topic";
import MapQuizGame from "../page/Client/MapQuiz/MapQuizGame";
import Quiz from "../page/Client/MapQuiz/Quiz";
import Result from "../page/Client/MapQuiz/Result";
import DashBoard from "../page/Admin/DashBoard";
import ListTour from "../page/Admin/Tour/LisTour";
import ListCarousel from "../page/Admin/Carousel/ListCarousel";
import ListUser from "../page/Admin/User/ListUser";
import Tours from "../page/Client/Tours";
import ToursAll from "../page/Client/Tours/ToursAll";
import ToursDetail from "../page/Client/Tours/ToursDetail";
import ToursRelated from "../page/Client/Tours/ToursRelated";
import ProfileLayout from "../page/Client/Profile";
import ProfileInfo from "../page/Client/Profile/ProfileInfo";
import Favorites from "../page/Client/Favorites";
import Orders from "../page/Client/Profile/Orders";
import OrderDetail from "../page/Client/Profile/Orders/OrderDetail";
import { Navigate } from "react-router-dom";
import OrderBooking from "../page/Client/OrderBooking";
import Team from "../page/Client/Team";
import Pages from "../page/Client/pages";
import Reviews from "../page/Client/Profile/Review";

export const routes = [
  // 1. CỤM GIAO DIỆN CLIENT CHUNG (PUBLIC ROUTES)
  {
    path: "/",
    element: <LayoutDefault />,
    children: [
      {
        index: true,
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
        path: "pages",
        children: [
          {
            index: true,
            element: <Pages />,
          },
          {
            path: "team",
            element: <Team />,
          },
        ],
      },
      {
        path: "contact",
        element: <Contact />,
      },
      {
        path: "map",
        element: <MapQuizWrapper />,
        children: [
          {
            index: true,
            element: <Topic />,
          },
          {
            path: "play",
            element: <MapQuizGame />,
          },
          {
            path: "quiz/:id",
            element: <Quiz />,
          },
          {
            path: "result/:id",
            element: <Result />,
          },
        ],
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

      // 2. CỤM GIAO DIỆN PHẢI ĐĂNG NHẬP (PRIVATE ROUTES FOR CLIENT)
      {
        element: <PrivateRoutes />,
        children: [
          {
            path: "order-booking/:id",
            element: <OrderBooking />,
          },
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
              },
              {
                path: "orders",
                element: <Orders />,
              },
              {
                path: "orders/:id",
                element: <OrderDetail />,
              },
              {
                path: "reviews",
                element: <Reviews />,
              },
            ],
          },
        ],
      },

      // 3. CỤM XÁC THỰC
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

  // 4. CỤM GIAO DIỆN ADMIN
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
          {
            path: "list-user",
            element: <ListUser />,
          },
        ],
      },
    ],
  },
];
