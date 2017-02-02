"use strict";
var UserMessages = {
  warning: function(message) {
    var self = this;
    self.messages.warning = message;
    setTimeout(function() {
      self.messages.warning = ''
    }, 15000)
  },
  error: function(message) {
    var self = this;
    self.messages.error = message;
    setTimeout(function() {
      self.messages.error = ''
    }, 15000)
  },
  success: function(message) {
    var self = this;
    self.messages.success = message;
    setTimeout(function() {
      self.messages.success = ''
    }, 15000)
  }
};

export default {
  UserMessages
}