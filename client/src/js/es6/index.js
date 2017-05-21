'use strict';

// import 'jquery'
import 'jquery-ui'
import 'bootstrap/dist/js/bootstrap.min.js'
import 'admin-lte/dist/js/app.min.js'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'admin-lte/dist/css/AdminLTE.min.css'
import 'admin-lte/dist/css/skins/skin-green.min.css'
import 'ladda/dist/ladda-themeless.min.css'

import '../../styles/loader.css'
import '../../styles/alert.css'
import '../../styles/auth.css'
import '../../styles/style.css'
import '../../styles/skin-green.css'

import App from './app'


document.addEventListener("DOMContentLoaded", function () {
  new App().run();
});

