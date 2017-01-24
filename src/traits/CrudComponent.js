"use strict";
var UserMessages = {
  warning: function(message) {
    this.$broadcast('userMessage', {
      type: 'warning',
      message : message,
    });
  },
  error: function(message) {
    this.$broadcast('userMessage', {
      type: 'error',
      message : message,
    });
  },
  success: function(message) {
    this.$broadcast('userMessage', {
      type: 'success',
      message : message,
    });
  },
};

export default {
  UserMessages
}