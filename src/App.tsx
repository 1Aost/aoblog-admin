import React, { Suspense } from 'react';
import { useRoutes } from "react-router-dom";
import routes from './routes';
import "@/assets/font_style_cn.css";
import "./App.css";
import Loading from './components/Loading';

const App = () => {
  const element = useRoutes(routes);
  return (
    <Suspense fallback={<Loading />}>
      {element}
    </Suspense>
  )
}
export default App;