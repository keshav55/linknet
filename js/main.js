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
    .when("/post", {templateUrl: "partials/post.html", controller: "PostCtrl"})
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
  // download the data into a local object
  $scope.posts = posts;
  $scope.authObj = $firebaseAuth(ref);
  $scope.authObj.$onAuth(function(authData) {
    if (authData) {
      console.log("Logged in as:", authData.uid);
    } else {
      console.log("Logged out");
    }
  });

}]);