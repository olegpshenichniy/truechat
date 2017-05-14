'use strict';

import 'jquery'
import 'jquery-ui'
import 'bootstrap/dist/js/bootstrap.min.js'
import 'bootstrap/dist/css/bootstrap.min.css'

// admin lte css
import 'admin-lte/dist/css/AdminLTE.min.css'
import 'admin-lte/dist/css/skins/skin-green.min.css'
// import 'admin-lte/plugins/iCheck/flat/green.css'

// admin lte js
import 'admin-lte/dist/js/app.min.js'

import '../../styles/loader.css'
import '../../styles/alert.css'
import '../../styles/auth.css'
import '../../styles/skin-green.css'
import '../../styles/style.css'

import App from './app'


document.addEventListener("DOMContentLoaded", function () {
  new App().run();
});

