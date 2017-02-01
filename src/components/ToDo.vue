<template>
  <div class="container-fluid">
    <messages
        :messages.sync="messages"
        ></messages>
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
            <th>Position</th>
            <th>Workwear</th>
            <th>Needed</th>
            <th></th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="item in todos">
            <td>{{item.worker}}</td>
            <td>{{item.position}}</td>
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
  import ReleaseHistory from '../data/ReleaseHistory.js';
  var workers = Workers.Workers;
  var workPositions = WorkPositions.WorkPositions;
  var rHistory = ReleaseHistory.ReleaseHistory;

  var positions = {};
  var sizes = {};

  var privates = (function() {
    function p(context) {
      this.context = context;
    }
    // for each get hers position
    // for item in position check release history for that worker
    p.prototype.processWorker = function(worker) {
      var self = this;
      rHistory.list(function(rHistory) {
        var received = {};
        _.each(rHistory.rows, function(item) {
          // get name from workwear description
          var workweare = item.doc.Workwear.split('_')[0];
          if(! received[workweare]) {
            received[workweare] = []
          }
          //save what and when was given to the worker
          received[workweare].push(item.doc.DateTime);
        });
        self.toDosForWorker(worker, received);
      }, worker.doc.Name);
    };

    p.prototype.toDosForWorker = function(worker, received) {
      // we know what she received and
      // for each item in position get the date from last received and calculate nex data
      var position = positions[worker.doc.Position];
      for(var item in position) {
        var last = received[item] ? received[item][0] : false;
        if(!last) {
          this.context.addToDo(worker.doc, item)
        }
      }
    };
    return p;
  })();


  export default {
    name: 'ToDo',
    data: function() {
      return {
        title: 'ToDo',
        todos: [
          {worker: 'Anna Myk', workwear : 'Bluza polarowa_U_52', needed: now(), position:'Magaznier'},
          {worker: 'Anna Myk', workwear : 'Bluza polarowa_U_52', needed: now(), position:'Magaznier'},
          {worker: 'Anna Myk', workwear : 'Bluza polarowa_U_52', needed: now(), position:'Magaznier'},
        ],
        //positions : {},
        messages : {
          warning : '',
          success : '',
          error : '',
        },
      }
    },
    route: {
      data: function(to) {
        document.title = 'To Do';
        toggleTopNavActive('topNavLiToDo');
      }
    },
    created: function() {
      this.privates = new privates(this);
      workPositions.generateOptions({
        oKey : ['Description'],
        oValue : ['WorkweareTypes'],
        callback : function(options) {
          for(var position in options) {
            positions[position] = preparePosition(options[position].split('\n').filter(
                function(x) {return x;}));
          }
        }
      })
    },
    methods: {
      addToDo: function(worker, item) {
        if(!sizes[worker.Name]) {
          sizes[worker.Name] = workers.workerSizes(worker.Sizes);
        }
        var self = this;
        _.each(sizes[worker.Name][item], function(wokweare) {
          self.todos.push({
            worker: worker.Name,
            workwear: wokweare,
            needed: now(),
            position: worker.Position
          })
        });
      },
      release: function(item) {
        pp(item);
      },
      calculate: function() {
        // Take all workers
        var self = this;
        this.todos = [];
        workers.list(function(data ) {
          _.each(data.rows, function(worker) {
            self.privates.processWorker(worker);
          });
        });

      },
    },
  };

  // build an object from storage format
  // "Kalesony => 12;"  =  {Kalesony : 12}
  function preparePosition(list) {
    var out = {};
    _.each(list, function(row) {
      row = row.split('=>').map(function(x) {
        return x.replace(/^ | $/g, '').replace(';', '');});
      out[row[0]] = parseInt(row[1]);
    });
    return out;
  }


</script>

