var app = angular.module("todos.controllers", []);

app.controller('AppCtrl', function($scope, $mdDialog, $mdToast, $mdMedia, Todos){
	// window function
	$scope.closeApp = function(){chrome.app.window.current().close()};
	$scope.minimizeApp = function(){chrome.app.window.current().minimize()};
	$scope.todos;
	$scope.tempTodos;

	// get todos from Todos service
	Todos.all().then(function(data){
		$scope.todos = data;
	});

	$scope.openMenu = function($mdOpenMenu, ev) {
      originatorEv = ev;
      $mdOpenMenu(ev);
    };

    $scope.updateTodos = function(){
    	Todos.update($scope.todos);
    }

    $scope.clearTodos = function(ev){
	    var confirm = $mdDialog.confirm()
	          .title('Are you sure?')
	          .textContent('You are about to clear all tasks.')
	          .ariaLabel('Clear Todos')
	          .targetEvent(ev)
	          .clickOutsideToClose(true)
	          .ok('Yes')
	          .cancel('No');
	    $mdDialog.show(confirm).then(function() {
	    	$scope.tempTodos = $scope.todos;
			$scope.todos = [];
	    	$scope.showActionToast("Tasks emptied.");
	    }, function() {
	    	$scope.status = 'Pheew! you cancelled.';
	    });
    }

    $scope.showToast = function(message) {
	    var toast = $mdToast.simple()
	      .textContent(message)
	      .highlightClass('md-accent')// Accent is used by default, this just demonstrates the usage.
	      .position('bottom right');

	    $mdToast.show(toast);
	};

	$scope.showActionToast = function(message) {
	    var toast = $mdToast.simple()
	      .textContent(message)
	      .action('UNDO')
	      .highlightAction(true)
	      .highlightClass('md-accent')// Accent is used by default, this just demonstrates the usage.
	      .position('top right');

	    $mdToast.show(toast).then(function(response) {
	      if ( response == 'ok' ) {
	        console.log('Rolling Back....');
	        $scope.todos = $scope.tempTodos;
	      }else{
	      	$scope.tempTodos = [];
	      	Todos.update($scope.todos);
	      }
	    });
	};

	$scope.showNewTodoForm = function(ev) {
	    $mdDialog.show({
	      templateUrl: 'templates/newTodo.html',
	      controller: NewTodoCtrl,
	      targetEvent: ev,
	      clickOutsideToClose:true,
	      fullscreen: false
	    })
	    .then(function(updatedTodos) {
	    	$scope.todos = updatedTodos;
	    	$scope.showToast("Item added");
	    }, function() {
	      console.log("New task cancelled.");
	    });
	};

	$scope.cancelNewTodo = function(){
		$mdDialog.cancel();
	}

	$scope.deleteTask = function(todo){
		$scope.indexToDelete = $scope.todos.indexOf(todo);
		$scope.todos[$scope.indexToDelete].isTemp = true;
		$scope.showTaskDeletedToast("Task deleted");
	}

	$scope.showTaskDeletedToast = function(message) {
	    var toast = $mdToast.simple()
	      .textContent(message)
	      .action('UNDO')
	      .highlightAction(true)
	      .highlightClass('md-accent')// Accent is used by default, this just demonstrates the usage.
	      .position('top right');

	    $mdToast.show(toast).then(function(response) {
	      if ( response == 'ok' ) {
	        console.log('Rolling Back....');
	        $scope.todos[$scope.indexToDelete].isTemp = false;
	      }else{
	      	$scope.todos.splice($scope.indexToDelete, 1);
	      	$scope.updateTodos();
	      }
	    });
	};
	
	var notID = 0;
	var delay = null;

	$scope.notify = function(todo){
		var message = todo.title;
		if(todo.content)
			message += ": "+todo.content;

		var path = chrome.runtime.getURL("icons/icon-128x128.png");
		var options = { type : "basic", title: "Pending task", message: message, iconUrl : path }

		setTimeout(function(){
			chrome.notifications.create("id"+notID++, options, creationCallback);
		},3000);
	}

	function creationCallback(notID) {
		console.log("Succesfully created " + notID + " notification");
	}
});

function NewTodoCtrl($scope, Todos, $mdDialog){
	$scope.addTodo = function(){
		$scope.newTodo.done = false;
		$scope.updatedTodos;

		Todos.add($scope.newTodo).then(function(updatedTodos){
			$scope.updatedTodos = updatedTodos;
			console.log("todos updated!");
			$mdDialog.hide(updatedTodos);
		});
	}
}