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
        <table @click="tableClick($event)" id="listTableToDo" class="display" width="100%"></table>
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
  import AffectsInventory from '../traits/AffectsInventory.js';
  import Messages from '../traits/Messages.js';

  var positions = {};
  var sizes = {};

  var privates = (function() {
    function p(context) {
      this.context = context;
    }
    // for each worker get hers position
    // for item in position check release history for that worker
    p.prototype.processWorker = function(worker) {
      var self = this;
      // get goods out history for that worker
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
        self.context.renderTable();
      }, worker.doc.Name);
    };

    p.prototype.toDosForWorker = function(worker, received) {
      // we know what she received and
      // for each item in position get the date from last received and calculate nex data
      var position = positions[worker.doc.Position];
      for(var item in position) {
        var last = received[item] ? received[item][0] : false;
        this.context.addToDo(worker.doc, item, whenNeeded(last, position[item]));
      }
    };

    function whenNeeded(lastReceived, monthsAllowed) {
      if(!lastReceived) {
        return now();
      }
      var last = new Date(lastReceived);
      last = last.setMonth(last.getMonth() + parseInt(monthsAllowed))
      return new Date(last).toISOString().replace('T', ' ').replace('.000Z', '');
    }

    return p;
  })();

  var TODO = {
    name: 'ToDo',
    data: function() {
      return {
        title: 'ToDo',
        todos: [],
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
      // I need positions cache so will not call pouch to get positions
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
      renderTable: function() {
        var data = {
          data: this.todos,
          columns: [
            {title:'Employee'},
            {title:'Workwear'},
            {title:'Needed'},
            {title:'Position'},
            {title:''},
          ],
          destroy:true,
          order : [[2,'asc']]
        };
        var table = $('#listTableToDo');
        table.destroy && table.destroy();
        table.DataTable(data);
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
      // args example :  Adma Pentla, Hat, '2017-01-01 12:00:00'
      addToDo: function(worker, itemClass, whenToAdd) {
        if(!sizes[worker.Name]) {
          sizes[worker.Name] = workers.workerSizes(worker.Sizes);
        }
        var self = this;
        // we can have more than one sizes per workware type in sizes so we need
        // for each
        if(sizes[worker.Name][itemClass]) {
          _.each(sizes[worker.Name][itemClass], function (wokweare) {
            self.todos.push([worker.Name, wokweare, whenToAdd || now(), worker.Position,
              self.releaseButton(worker.Name, wokweare)])
          });
        } else {
          // there are items with out sizes like a hat
          self.todos.push([worker.Name, itemClass, whenToAdd || now(), worker.Position,
            self.releaseButton(worker.Name, itemClass)])
        }
      },
      releaseButton: function(name, workwear) {
        return "<button class='btn btn-default btn-sm release-button' data-n='{0}' data-w='{1}'>Release</button>"
            .f([name,  workwear]);
      },
      tableClick: function(e) {
        var elClass = e.target.getAttribute('class') || '';
        if(elClass.indexOf('release-button') != -1) {
          this.release(e.target.getAttribute('data-n'), e.target.getAttribute('data-w'));
        }
      },
      release: function(name, workwear) {
        console.log(name, workwear);
        workwear += '_new';
        rHistory.put({
          DateTime: now(),
          Employee : name,
          Workwear: workwear,
          Qty: 1
        });
        this.updateInventoryQty(workwear, -1, 'decreased');
        this.calculate();
      },
    },
  };

  _.extend(TODO.methods, AffectsInventory.AffectsInventory);
  _.extend(TODO.methods, Messages.UserMessages);

  export default TODO;

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

