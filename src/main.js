import Vue from 'vue';
import App from './App.vue';
import Router from 'vue-router';
import Data from './components/Data.vue';
import Inventory from './components/Inventory.vue';
import Workers from './components/Workers.vue';
import WorkPositions from './components/WorkPositions.vue';
import WorkwearTypes from './components/WorkwearTypes.vue';
import ReleaseHistory from './components/ReleaseHistory.vue';
require('expose?$!expose?jQuery!jquery');
require('bootstrap-webpack');
require('bootstrap/dist/css/bootstrap-theme.min.css');

var $ = require( 'jquery');
require( 'datatables.net/js/jquery.dataTables.js' );
require( 'datatables.net-dt/css/jquery.dataTables.css' );
require( 'jquery-datetimepicker/build/jquery.datetimepicker.full.min.js' );
require( 'jquery-datetimepicker/build/jquery.datetimepicker.min.css' );

require( 'jquery-ui/ui/widgets/autocomplete.js' );
//require( 'jquery-ui/themes/base/autocomplete.css' );
require( 'jquery-ui/themes/base/all.css' );
//require( 'jquery-autocomplete/jquery.autocomplete.css' );



var _ = require('lodash');
import helpers from './helpers/helpers.js';
_.extend(window, helpers);

// install router
Vue.use(Router);

Vue.config.debug = true;

// routing
var router = new Router();


router.map({
  '/release-history' : {
    component: ReleaseHistory
  },
  '/workers' : {
    component: Workers
  },
  '/inventory' : {
    component: Inventory
  },
  '/workweartypes' : {
    component: WorkwearTypes
  },
  '/workpositions' : {
    component: WorkPositions
  },
  '/data' : {
    component: Data
  }
});

router.beforeEach(function () {
  window.scrollTo(0, 0)
});

router.redirect({
  '*': '/workers'
});


router.start(App, 'app');
