import React, { useEffect } from "react";
import { ConfigProvider, theme as antdTheme, FloatButton } from "antd";
import viVN from "antd/locale/vi_VN";
import enUS from "antd/locale/en_US";
import AllRoutes from "./components/Common/Allroute";
import { useDispatch, useSelector } from "react-redux";
import { initTheme } from "./store/slices/themeSlice";
import ScrollToTop from "./components/Common/ScrollToTop";
import i18n from "./utils/i18n";

function AppContent() {
  const { theme } = useSelector((state) => state.themeReducer);
  const { currentLanguage } = useSelector((state) => state.languageReducer);
  // console.log(theme);

  useEffect(() => {
    // changeLanguage hàm có sẵn trong i18next
    i18n.changeLanguage(currentLanguage);
  }, [currentLanguage]);

  return (
    <ConfigProvider
      locale={currentLanguage === "vi" ? viVN : enUS}
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
