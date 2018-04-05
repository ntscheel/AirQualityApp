
var mainApp = angular.module('mainApp', ['ngRoute']);

mainApp.config(function($routeProvider){
   $routeProvider
       .when('/', {
          templateUrl: 'pages/home.html',
           controller: 'mainController'
       })
       .when('/about',{
           templateUrl: 'pages/about.html',
           controller: 'aboutController'
       });
});


mainApp.controller('mainController', function($scope) {
   $scope.message = 'Main page';
   $scope.test = "test";
});

mainApp.controller('aboutController', function($scope) {
    $scope.message = 'About page';
});