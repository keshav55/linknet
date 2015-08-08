/**
 * AngularJS Tutorial 1
 * @author Nick Kaye <nick.c.kaye@gmail.com>
 */

/**
 * Main AngularJS Web Application
 */
var app = angular.module('tutorialWebApp', ['ngRoute', "firebase"]);

/**
 * Configure the Routes
 */
app.config(['$routeProvider', function ($routeProvider) {
  $routeProvider
    // Home
    .when("/", {templateUrl: "partials/home.html", controller: "PageCtrl"})
    // Pages
    .when("/about", {templateUrl: "partials/about.html", controller: "PageCtrl"})

    .when("/contact", {templateUrl: "partials/contact.html", controller: "PageCtrl"})
    // Blog
    .when("/post", {templateUrl: "partials/post.html", controller: "ProfileCtrl"})
    .when("/profile", {templateUrl: "partials/profile.html", controller: "ProfileCtrl"})

    .otherwise("/404", {templateUrl: "partials/404.html", controller: "PageCtrl"});
}]);
app.factory("posts", ["$firebaseArray",
  function($firebaseArray) {
    // create a reference to the database where we will store our data
    var ref = new Firebase("https://bridgecom.firebaseio.com/posts");

    return $firebaseArray(ref);
  }
]);

/**
 * Controls all other Pages
 */
app.controller("PageCtrl", ["$scope", "$firebaseAuth", "posts", function($scope, $firebaseAuth, posts) {
  var ref = new Firebase("https://bridgecom.firebaseio.com");
  $scope.posts = posts;
  $scope.error = false;
  $scope.authObj = $firebaseAuth(ref);
  $scope.authObj.$onAuth(function(authData) {
    if (authData) {
      $scope.authData = true;
    } else {
      $scope.authData = false;
    }
    $('.modal-trigger').leanModal();
  });
  $scope.login = function(){
    $scope.authObj.$authWithPassword({
      email: $scope.logemail,
      password: $scope.logpass
    }).then(function(authData) {
      $route.reload();
    }).catch(function(error) {
      console.error("Authentication failed:", error);
      $scope.error = true;
    });
  };
}])
.controller("ProfileCtrl", ["$scope", "$firebaseAuth", "$location", function($scope, $firebaseAuth, $location) {
  var ref = new Firebase("https://bridgecom.firebaseio.com");
  $scope.authObj = $firebaseAuth(ref);
  $scope.authObj.$onAuth(function(authData) {
    if (!authData) {
      $location.path('/');
    }
  });

}]);