angular.module('todos.services', [])

.factory('Todos', ['$http', '$q', function($http, $q) {
    return {
        all: function() {
            var def = $q.defer();
            var todos;

            // load local todos
            // chrome.storage.sync.remove('Todos');
            chrome.storage.sync.get('Todos', function(localTodos){
              //if there is no Todos field in storage initialize it with an empty array
              // console.log(localTodos.length);
              var todos = [];
              if(!localTodos['Todos']){
                chrome.storage.sync.set({'Todos' : todos});
                console.log(todos);
              }else{
                var todos = angular.fromJson(localTodos.Todos);
                console.log(todos);
              }

              def.resolve(todos);
            });

            return def.promise;
        },
        add: function(newTodo) {
            var def = $q.defer();
            chrome.storage.sync.get('Todos', function(data){
              var todos = angular.fromJson(data.Todos);
              console.log(todos);
              todos.push(newTodo);
              
              chrome.storage.sync.set({'Todos': todos}, function(){
                chrome.storage.sync.get('Todos', function(data){
                  console.log(data);
                });
                def.resolve(todos);
              });
            });
            return def.promise;
        },
        update: function(todos){
            chrome.storage.sync.set({'Todos': todos});
        },
        clear: function(group){
          var def = $q.defer();
          if(!group){
            chrome.storage.sync.remove('Todos', function(){
              var empty = [];
              def.resolve(empty);
            });
          }
          return def.promise;
        }
    }
}]);