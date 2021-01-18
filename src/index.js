import React from 'react';
import ReactDOM from 'react-dom';
import { ToastProvider } from 'react-toast-notifications';
import App from './App';

ReactDOM.render(
  // eslint-disable-next-line react/jsx-filename-extension
  <React.StrictMode>
    <ToastProvider>
      <App />
    </ToastProvider>

  </React.StrictMode>,
  // eslint-disable-next-line no-undef
  document.getElementById('root'),
);
