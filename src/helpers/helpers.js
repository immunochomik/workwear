var d3 = require('d3');

String.prototype.format = String.prototype.f =  function() {
  var args;
  args = arguments;
  if (args.length === 1 && args[0] !== null && typeof args[0] === 'object') {
    args = args[0];
  }
  return this.replace(/{([^}]*)}/g, function(match, key) {
    return (typeof args[key] !== "undefined" ? args[key] : match);
  });
};
String.prototype.capitalizeFirstLetter = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

function printIt(x) {
  var cache = [];
  x = JSON.stringify(x, function (key, value) {
    if (typeof value === 'object' && value !== null) {
      if (cache.indexOf(value) !== -1) {
        // Circular reference found, discard key
        return;
      }
      // Store value in our collection
      cache.push(value);
    }
    return value;
  }, 2);
  cache = null; // Enable garbage collection
  console.log(x);
}

var dFormat = d3.time.format('%Y-%m-%d');

var dayFrom = function(count, date) {
  date = date ? date : new Date();
  var result = d3.time.day.offset(date, count);
  return dFormat(result);
};

export default {
  dFormat : dFormat,

  dayFrom : dayFrom,

  toggleTopNavActive : function(id) {
    $('.nav-li').removeClass('active');
    $('#' + id).addClass('active');
  },

  daysPeriod : function(from, to, sanity) {
    sanity = sanity ? sanity : 10;
    if(from > to) {
      var temp = to; to = from; from = temp;
    }
    var start = new Date(from),
      period = [dFormat(start)];
    for(var i = 1; i < sanity; i++) {
      period.push(dayFrom(i, start));
      if(period[period.length -1] == to) {
        return period
      }
    }
    return period
  },

  sortObject: function(obj) {
    return Object.keys(obj).sort().reduce(function (result, key) {
      result[key] = obj[key];
      return result;
    }, {});
  },

  pp : function(){
    for(var i in arguments) {
      printIt(arguments[i]);
    }
  },

  el : function (id) {
    return document.getElementById(id);
  },

  getParam: function(key, def) {
    var resp = def;
    if(window.location.href) {
      var href = window.location.href.split('?');
      if (href.length === 2) {
        href[1].split('&').forEach(function (pair) {
          pair = pair.split('=');
          if (pair[0] === key) {
            resp = pair[1];
          }
        });
      }
    }
    return resp;
  },

  today : function(day) {
    day = day ? day : new Date();
    var dd = day.getDate();
    var mm = day.getMonth()+1; //January is 0!
    var yyyy = day.getFullYear();
    if(dd < 10) {
      dd = '0' + dd
    }
    if(mm < 10) {
      mm = '0' + mm
    }
    return yyyy +'-' + mm + '-' + dd;
  }
}
