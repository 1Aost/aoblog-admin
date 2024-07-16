import React from "react";
import { Spin } from "antd";

const Loading = () => {
  return (
    <div style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
    }}>
      <Spin />
    </div>
  )
}
export default Loading;