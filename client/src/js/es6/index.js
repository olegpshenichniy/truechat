'use strict';

import 'jquery'
import 'bootstrap/dist/js/bootstrap.min.js'
import 'bootswatch/darkly/bootstrap.min.css'
import '../../styles/loader.css'
import '../../styles/style.css'

import App from './app'


document.addEventListener("DOMContentLoaded", function () {
  new App().run();
});

