import React, { Suspense } from 'react'
import { useRoutes } from "react-router-dom"
import routes from './routes';
import Loading from "./components/Loading"
import "@/assets/font_style_cn.css"
import "./App.css";
const App: React.FC = () => {
  const element = useRoutes(routes);
  return (
    <Suspense fallback={<Loading />}>
      {element}
    </Suspense>
  )
}
export default App;