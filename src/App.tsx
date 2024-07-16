import React, { Suspense } from 'react'
import { useRoutes } from "react-router-dom"
import { Spin } from 'antd';
import routes from './routes';
import "@/assets/font_style_cn.css"
import "./App.css";

const App = () => {
  const element = useRoutes(routes);
  return (
    <Suspense fallback={<Spin />}>
      {element}
    </Suspense>
  )
}
export default App;