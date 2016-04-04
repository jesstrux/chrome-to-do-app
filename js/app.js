var app = angular.module("todos", ['ngMaterial', 'ui.router', 'angular-nicescroll', 'todos.controllers', 'todos.services']);

app.config(function($mdThemingProvider, $stateProvider, $urlRouterProvider) {
  	$mdThemingProvider.theme('default')
		.primaryPalette('grey', {
	      'default': '600',
	      'hue-1': '300',
	      'hue-2': '200',
	      'hue-3': '50'
	    })
		.accentPalette('grey', {
	      'default': '600',
	    })

	// $localForageProvider.setNotify(true, true); // itemSet, itemRemove

    $stateProvider.state('main', {
		url: "/",
		templateUrl: "templates/main-view.html",
		controller: 'AppCtrl'
    });

    $stateProvider.state('detail', {
		url: "/detail",
		templateUrl: "templates/color-detail.html",
		controller: 'DetailCtrl',
		params: { colorId: null}
    });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/');
});