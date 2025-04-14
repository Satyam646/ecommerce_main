import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import  Path from './Routes';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ThemeProvider } from './Common/ThemeContext/ThemeContext'
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    
    <ThemeProvider>
    <GoogleOAuthProvider clientId="138079214967-krcqb0pamcehpenmqb6t7cjice8u2nrb.apps.googleusercontent.com">
    <Path/>
    </GoogleOAuthProvider>
    </ThemeProvider>
   
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
