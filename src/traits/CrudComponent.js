"use strict";
/**
 * This messages trait is to be used to when we are using messages in
 * the crud component that is a child of the component that is using
 * that trait
 */
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