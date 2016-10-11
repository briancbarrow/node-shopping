var express = require('express');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

var Storage = {
  add: function(user, name) {
    var item = {name: name, id: this.setItemId};
    user.items.push(item);
    this.setItemId += 1;
    this.items.push(item);
    return item;
  }, 
  delete: function(id) {
      var index = 0;
      var removedItem;
      for(var i = 0; i < this.items.length; i++) {
          if(id == this.items[i].id) {
              index = i;
              removedItem = this.items[i];
            //   this.items.splice(i, 1);
            //   return removedItem;
          }
      }
      for(var i = 0; i < this.users.length; i++) {
          for(var j = 0; j < this.users[i].items.length; j ++) {
              if(id == this.users[i].items[j].id) {
                  var userItemRemoved = this.users[i].items[j];
                  if(userItemRemoved === removedItem) {
                      this.users[i].items.splice(j, 1);
                      this.items.splice(index, 1);
                      return removedItem;
                  } else {
                      return "error";
                  }
                  
              }
          }
      }
      
      return "error";
  },
  update: function(id, name) {
      var index = 0;
      var updatedItem;
    for(var i = 0; i < this.items.length; i++) {
        if(id == this.items[i].id) {
            index = i;
            
            updatedItem = this.items[i];
            // return updatedItem;
        }
    }
    for(var i = 0; i < this.users.length; i++) {
          for(var j = 0; j < this.users[i].items.length; j ++) {
              if(id == this.users[i].items[j].id) {
                  var userItemUpdated = this.users[i].items[j];
                  if(userItemUpdated === updatedItem) {
                      this.users[i].items[j].name = name
                      this.items[index].name = name;
                      return updatedItem;
                  } else {
                      return "error";
                  }
                  
              }
          }
      }
    storage.add(name);
  },
  addUser: function(name) {
    var user = {name: name, id: this.setId};
    this.users.push(user);
    user.items = [];
    this.setId += 1;
    return user;
  }
};

var createStorage = function() {
  var storage = Object.create(Storage);
  storage.users = [];
  storage.setId = 1;
  storage.setItemId = 1;
  storage.items = [];
  return storage;
};

var storage = createStorage();

storage.addUser("Brian");
storage.addUser("Erin");

storage.add(storage.users[0], 'Broad beans');
storage.add(storage.users[1], 'Tomatoes');
storage.add(storage.users[0], 'Peppers');

var app = express();
app.use(express.static('public'));

app.get('/items', function(request, response) {
    response.json(storage.items);
});

app.get('/users/:user', function(request, response) {
    for(var i = 0; i < storage.users.length; i++) {
        if(request.params.user === storage.users[i].name) {
           return response.json(storage.users[i]);
        }
    }
});

app.post('/items', jsonParser, function(request, response) {
    if(!('name' in request.body)) {
        return response.sendStatus(400);
    }
    
    var item = storage.add(storage.users[0], request.body.name);
    response.status(201).json(item);
});

app.delete('/items/:id', function(request, response) {
    var item = storage.delete(request.params.id);
    if(item === "error") {
        response.sendStatus(404);
    } else {
        response.status(200).json(item);
    }
});

app.put('/items/:id', jsonParser, function(request, response) {
    if (!request.body) {
        return response.sendStatus(400);
    }
    var item = storage.update(request.params.id, request.body.name)
    response.status(200).json(item);
});

app.listen(process.env.PORT || 8080, process.env.IP);