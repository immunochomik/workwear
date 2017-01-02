<template>
  <div class="container-fluid">
     <crud
           :model="model"
         ></crud>

  </div>

</template>

<script>
  import ReleaseHistory from '../data/ReleaseHistory.js'
  import Crud from './Crud.vue';

  export default {
    name: 'ReleaseHistory',
    data: function() {
      return {
        title: 'ReleaseHistory',
        model : ReleaseHistory.ReleaseHistory
      }
    },
    route: {
      data: function(to) {
        routerCall(this);
        setTimeout(function() {
          $( "#EmployeeReleaseHistory" ).autocomplete({
            source:  function(req, resp, next) {
              console.log(req, resp, next);
              resp(['Adma', 'Ada']);
            }
        });
        }, 800);
      }
    },
    methods: {
      callObject: function() {
        this.$broadcast('callObject');
      },
      refresh: function() {
        this.$broadcast('refresh');
      }
    },
    components: {
      crud : Crud,
    },
  }
</script>

