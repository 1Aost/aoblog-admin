import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import {Provider} from "react-redux"
import store from './store';
import App from './App';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <HashRouter>
    {/* 将store加载到全局 */}
    <Provider store={store}>
      <App />
    </Provider>
  </HashRouter>
);
