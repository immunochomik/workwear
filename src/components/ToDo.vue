<template>
  <div class="container-fluid">
    <div class="panel panel-default">
      <div class="panel-heading">
        <div class="row">
          <div class="col-sm-6">
            <h4>To Do</h4>
          </div>
          <div class="col-sm-6 text-right">
            <button class="btn btn-danger" @click="calculate">Calculate</button>
          </div>
        </div>
      </div>
      <div class="panel-body">
        <!-- Table -->
        <table class="table table-responsive table-hover table-condensed">
          <thead>
          <tr>
            <th>Employee</th>
            <th>Workwear</th>
            <th>Needed</th>
            <th></th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="item in todos">
            <td>{{item.worker}}</td>
            <td>{{item.workwear}}</td>
            <td>{{item.needed}}</td>
            <td class="text-right">
              <button class="btn btn-default" @click="release(item)">Go</button></td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
  import Workers from '../data/Workers.js'
  import WorkPositions from '../data/WorkPositions.js';
  var workPositions = WorkPositions.WorkPositions;
  export default {
    name: 'ToDo',
    data: function() {
      return {
        title: 'ToDo',
        todos: [
          {worker: 'Anna Myk', workwear : 'Bluza polarowa_U_52', needed: now()},
          {worker: 'Anna Myk', workwear : 'Bluza polarowa_U_52', needed: now()},
          {worker: 'Anna Myk', workwear : 'Bluza polarowa_U_52', needed: now()},
        ],
      }
    },
    route: {
      data: function(to) {
        document.title = 'To Do';
        toggleTopNavActive('topNavLiToDo');
      }
    },
    methods: {
      release: function(item) {
        pp(item);
      },
      calculate: function() {
        // Take all workers
        // for each get hers position
        // for item sin position
        // check release history for that worker
        //
      },
    },
  }
</script>

