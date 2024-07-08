import React from 'react';
import ReactDOM from 'react-dom/client';


import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'jquery/dist/jquery.min.js'
import 'bootstrap/dist/js/bootstrap.min.js'
import "bootstrap/dist/js/bootstrap";


import './index.css';
import './login.css';
// import "./estilo/bootstrap-icons.min.css"
// import "./estilo/feather-icons.css"
import "./estilo/simplebar.min.css"
// import "./estilo/slick-theme.css"
import "./estilo/slick.css"
import "./estilo/theme.min.css"
import "./estilo/tiny-slider.css"

// import "./js/theme.min.js"
// import "./js/jquery.min.js"
// import "./js/slick-slider.js"
// import "./js/slick-slider.js"

import { MarketApp } from './MarketApp';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
    <MarketApp/>
  // </React.StrictMode>
);

