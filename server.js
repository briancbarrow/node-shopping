var express = require('express');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

var Storage = {
  add: function(user, name) {
    var item = {name: name, id: this.setItemId, userId: user.userId};
    this.setItemId += 1;
    this.users[user.userId].items.push(item);
    return item;
  }, 
  delete: function(userId, id) {
      var removedItem;
      for(var i = 0; i < this.users[userId].items.length; i++) {
          if(id == this.users[userId].items[i].id) {
              var item = this.users[userId].items[i];
              removedItem = this.users[userId].items.splice(i, 1);
              return removedItem;
          }
      }
      return "error";
  },
  update: function(userId, id, name) {
      var updatedItem;
    for(var i = 0; i < this.users[userId].items.length; i++) {
        if(id == this.users[userId].items[i].id) {
            this.users[userId].items[i].name = name;
            updatedItem = updatedItem = this.items[i];
            return updatedItem;
        }
    }
    storage.add(this.users[userId], name);
  },
  addUser: function(name) {
    var user = {name: name, userId: this.setId, items: []};
    this.users[this.setId] = user;
    this.setId += 1;
    return user;
  },
  getUserItems: function(id) {
      return this.users[id].items;
  },
  getUser: function(name) {
      var len = Object.keys(this.users).length;
      for(var i = 0; i < len; i++) {
          if(name == this.users[i].name) {
              return this.users[i];
          }
      }
      return "error";
  },
  getAllItems: function() {
      var array = [];
      var len = Object.keys(this.users).length;
      for(var i = 0; i < len; i++) {
          var subLen = this.users[i].items.length;
          for(var j = 0; j < subLen; j++) {
              array.push(this.users[i].items[j]);
          }
      }
      this.items = array;
      return array;
  }
};

var createStorage = function() {
  var storage = Object.create(Storage);
  storage.users = {};
  storage.setId = 0;
  storage.setItemId = 1;
  storage.items = [];
  return storage;
};

var storage = createStorage();

storage.addUser("Brian");
storage.addUser("Erin");

storage.add(storage.users[0], 'Broad beans');
storage.add(storage.users[0], 'Peppers');
storage.add(storage.users[0], 'Tomatoes');
storage.add(storage.users[1], 'Cheese');

var app = express();
app.use(express.static('public'));

app.get('/items', function(request, response) {
    
    var items = storage.getAllItems();
    response.json(items);
});

app.get('/items/:userId', function(request, response) {
    response.json(storage.getUserItems(request.params.userId));
});

app.get('/:user', function(request, response) {
    var user = storage.getUser(request.params.user);
    if(user == 'error') {
        response.sendStatus(400);
    } else {
        response.status(200).json(user);
    }
    // response.json(storage.users);
});

app.post('/items', jsonParser, function(request, response) {
    if(!('name' in request.body)) {
        return response.sendStatus(400);
    }
    var item = storage.add(storage.users[0], request.body.name);
    response.status(201).json(item);
});

app.delete('/items/:userId/:id', function(request, response) {
    var item = storage.delete(request.params.userId, request.params.id);
    console.log(item);
    if(item === "error") {
        response.sendStatus(404);
    } else {
        response.status(200).json(item);
    }
    
});

app.put('/items/:userId/:id', jsonParser, function(request, response) {
    if (!request.body) {
        return response.sendStatus(400);
    }
    var item = storage.update(request.params.userId, request.params.id, request.body.name);
    response.status(200).json(item);
});

app.listen(process.env.PORT || 8080, process.env.IP);

exports.app = app;
exports.storage = storage;