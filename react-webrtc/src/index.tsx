import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import 'antd/dist/antd.css';
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './reducers/index';
import { Provider } from 'react-redux';

const store = configureStore({
  reducer: rootReducer,
});

ReactDOM.render(
  <Provider store={store}>
    <App />,
  </Provider>,
  document.getElementById('root'),
);
