import React, { useEffect } from "react";
import { ConfigProvider, theme as antdTheme, FloatButton } from "antd";
import AllRoutes from "./components/Common/Allroute";
import { useDispatch, useSelector } from "react-redux";
import { initTheme } from "./store/slices/themeSlice";
import ScrollToTop from "./components/Common/ScrollToTop";

function AppContent() {
  const { theme } = useSelector((state) => state.themeReducer);
  // console.log(theme);

  return (
    <ConfigProvider
      theme={{
        algorithm:
          theme === "dark"
            ? antdTheme.darkAlgorithm
            : antdTheme.defaultAlgorithm,
      }}
    >
      <ScrollToTop />
      <AllRoutes />
      <FloatButton.BackTop 
        shape="circle" 
        type="primary" 
        style={{ right: 24, bottom: 24 }} 
      />
    </ConfigProvider>
  );
}

function App() {
  const dispatch = useDispatch();
  // Khởi chạy để set attribute data-theme vào thẻ html ngay khi app load
  useEffect(() => {
    dispatch(initTheme());
  }, [dispatch]);

  return <AppContent />;
}

export default App;
