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
app.controller("PageCtrl", ["$scope", "$firebaseAuth", "$firebaseObject", "posts", function($scope, $firebaseAuth, $firebaseObject, posts) {
  var ref = new Firebase("https://bridgecom.firebaseio.com");
  $scope.posts = posts;
  $scope.error = false;
  $scope.authObj = $firebaseAuth(ref);
  $scope.authObj.$onAuth(function(authData) {
    if (authData) {
      $scope.authData = true;
      var user = new Firebase("https://bridgecom.firebaseio.com/users/"+authData.uid);
      $scope.data = $firebaseObject(user);
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
      location.reload();
    }).catch(function(error) {
      $("#logtitle").show();
    });
  };
  $scope.register = function(){
    $scope.authObj.$createUser({
      email: $scope.regemail,
      password: $scope.regpass
    }).then(function(userData) {
      return $scope.authObj.$authWithPassword({
        email: $scope.regemail,
        password: $scope.regpass
      });
    }).then(function(authData) {
        ref.child("users").child(authData.uid).set({
          name: authData.password.email, 
          email: authData.password.email,
          image: "http://keshav55.github.io/linknet/img/user.png",
          phone: "None",
          verified: false,
          description: "None"
        }, function(){
          location.reload();
        });
      
    }).catch(function(error) {
      $("#regtitle").show();
    });  
  };
}])
.controller("ProfileCtrl", ["$scope", "$firebaseAuth", "$location", "$firebaseObject", function($scope, $firebaseAuth, $location, $firebaseObject) {
  var ref = new Firebase("https://bridgecom.firebaseio.com");
  $scope.authObj = $firebaseAuth(ref);
  $scope.authData = true;
  $scope.authObj.$onAuth(function(authData) {
    if (authData) {
      var user = new Firebase("https://bridgecom.firebaseio.com/users/"+authData.uid);
      $scope.data = $firebaseObject(user);
    } else {
      $location.path('/');
    }
  });
  function readURL(input) {
          if (input.files && input.files[0]) {
              var reader = new FileReader();

              reader.onload = function (e) {
                  $('#image').attr('src', e.target.result);
              }

              reader.readAsDataURL(input.files[0]);
          }
  }
  $("#imgInp").change(function(){
      readURL(this);
  });
  $scope.save = function(){
        ref.child("users").child(ref.getAuth().uid).update({
          name: $scope.data.name, 
          image: $("#image").attr("src"),
          description: $scope.data.description, 
          phone: $scope.data.phone
        });      
  }


}])
.controller("PostCtrl", ["$scope", "$firebaseAuth", "$location", "$firebaseObject", function($scope, $firebaseAuth, $location, $firebaseObject) {
  var ref = new Firebase("https://bridgecom.firebaseio.com");
  $scope.authObj = $firebaseAuth(ref);
  $scope.authData = true;
  $scope.authObj.$onAuth(function(authData) {
    if (authData) {
      var user = new Firebase("https://bridgecom.firebaseio.com/users/"+authData.uid);
      user.child("verified").once("value", function(snapshot) {
        if(snapshot.val()== false) {
          $location.path('/');
        }
      }, function (errorObject) {
        $location.path('/');
      });
      $scope.post = function(){
        user.child("verified").once("value", function(snapshot) {
          ref.child("posts").push({
            title: $scope.title,
            author: snapshot.child("name").val(),
            authorid: authData.uid,
            picture: $("#image").attr("src"),
            location: $scope.location,
            date: $scope.startTime + " " + $scope.startDate + " to " + $scope.endTime + " " + $scope.endDate,
            description: $scope.description
          }); 
        });  
      };

    } else {
      $location.path('/');
    }
  });
  $('.datepicker').pickadate({
      selectMonths: true, // Creates a dropdown to control month
      selectYears: 15,
      format: 'mmmm dd, yyyy' // Creates a dropdown of 15 years to control year
  });
  $('#us').locationpicker({
    location: {latitude: 37.5482697, longitude: -121.98857190000001}, 
    radius: 0,
    enableAutocomplete: true,
    inputBinding: {

          locationNameInput: $('#location')
      }
  });
  function readURL(input) {
          if (input.files && input.files[0]) {
              var reader = new FileReader();

              reader.onload = function (e) {
                  $('#image').attr('src', e.target.result);
              }

              reader.readAsDataURL(input.files[0]);
          }
  }
  $("#imgInp").change(function(){
      readURL(this);
  });



}]);