import React from "react";
import { Button } from "antd";
import { SunOutlined, MoonOutlined } from "@ant-design/icons";
import { useTheme } from "../../../context/ThemeContext";

const DarkModeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      type="text"
      shape="circle"
      icon={theme === "dark" ? <SunOutlined /> : <MoonOutlined />}
      onClick={toggleTheme}
      style={{
        fontSize: "18px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "none",
        background: "transparent",
      }}
      className="header__dark-mode-toggle"
    />
  );
};

export default DarkModeToggle;
