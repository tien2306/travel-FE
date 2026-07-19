import React from "react";
import { Button } from "antd";
import { SunOutlined, MoonOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../../../store/slices/themeSlice";

const DarkModeToggle = () => {
  const { theme } = useSelector((state) => state.themeReducer);
  const dispatch = useDispatch();

  return (
    <Button
      type="text"
      shape="circle"
      icon={theme === "dark" ? <SunOutlined /> : <MoonOutlined />}
      onClick={() => dispatch(toggleTheme())}
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
