import { theme, Typography } from "antd";
import React from "react";
import { ReactNode } from "react";
import "./index.css"

const LoginCard = (props: { children: ReactNode }) => {
  const {
    token: { colorTextBase },
  } = theme.useToken();
  return (
    <div
      className="loginCard"
      style={{
        padding: '0px 80px',
        width: '470px',
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          paddingBottom: "80px",
          paddingTop: "50px",
          position: "relative",
          left: "-20px",
          width: "100%",
          whiteSpace: "nowrap",
        }}
      >
        <img width={"80px"} src="/logo.png" />
        <Typography
          style={{
            fontSize: "38px",
            fontWeight: "bold",
            color: "#3a6bc4",
          }}
        >
          Aoblog Admin
        </Typography>
      </div>
      <div>
        <div
          style={{
            paddingBottom: "50px",
          }}
        >
          <Typography
            style={{
              fontSize: "32px",
              fontWeight: "bold",
              color: colorTextBase,
              paddingBottom: "20px",
            }}
          >
            Login
          </Typography>
          {/* 暂时注释掉 */}
          {/* <Typography>
            Don’t have an account?{" "}
            <Typography.Link>Get Started</Typography.Link>
          </Typography> */}
        </div>
        {props.children}
      </div>
    </div>
  )
}
export default LoginCard;