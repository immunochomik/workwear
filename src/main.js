import Vue from 'vue';
import App from './App.vue';
import Router from 'vue-router';
import Data from './components/Data.vue';
require('expose?$!expose?jQuery!jquery');
require('bootstrap-webpack');
require('bootstrap/dist/css/bootstrap-theme.min.css');

var _ = require('lodash');
import helpers from './helpers/helpers.js';
_.extend(window, helpers);

// install router
Vue.use(Router);

Vue.config.debug = true;

// routing
var router = new Router();


router.map({
  '/data' : {
    component: Data
  }
});

router.beforeEach(function () {
  window.scrollTo(0, 0)
});

router.redirect({
  '*': '/data'
});

router.start(App, 'app');
