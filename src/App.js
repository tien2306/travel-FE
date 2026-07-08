import React from "react";
import { ConfigProvider, theme as antdTheme } from "antd";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import AllRoutes from "./components/Common/Allroute";

function AppContent() {
  const { theme } = useTheme();

  return (
    <ConfigProvider
      theme={{
        algorithm:
          theme === "dark"
            ? antdTheme.darkAlgorithm
            : antdTheme.defaultAlgorithm,
      }}
    >
      <AllRoutes />
    </ConfigProvider>
  );
}

function App() {
  // truyền props ngầm định
  // Cách  viết:
  // <ThemeProvider> <AppContent /> </ThemeProvider>

  // Cách React tự động hiểu và chuyển đổi ở bên dưới hệ thống:
  // <ThemeProvider props={{ children: <AppContent /> }} />
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
