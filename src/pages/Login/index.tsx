import React from "react";
import "./index.css"
import LoginCard from "./LoginCard";
import LoginForm from "./LoginForm";
import { Fit, Layout } from "@rive-app/react-canvas";
import { RiveAni } from "../../plugin/plugin-rive/riveAni/index";

const Login = () => {
  return (
    <div className='login'>
      <LoginCard>
        <LoginForm />
      </LoginCard>
      <div
        style={{
          flex: 1,
        }}
      >
        <RiveAni
          options={{
            // This is optional.Provides additional layout control.
            layout: new Layout({
              fit: Fit.Cover, // Change to: rive.Fit.Contain, or Cover
            }),
            autoplay: true,
            automaticallyHandleEvents: true,
          }}
          url="/beach_icon.riv"
        />
      </div>
    </div>
  )
}
export default Login;