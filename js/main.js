var app = angular.module('bridge', ['ngRoute', "firebase"]);
app.config(['$routeProvider', function ($routeProvider) {
  $routeProvider
    // Home
    .when("/", {templateUrl: "partials/home.html", controller: "PageCtrl"})
    // Pages
    .when("/about", {templateUrl: "partials/about.html", controller: "PageCtrl"})

    .when("/contact", {templateUrl: "partials/contact.html", controller: "PageCtrl"})
    // Blog
    .when("/post", {templateUrl: "partials/post.html", controller: "PostCtrl"})
    .when("/posts/:postId", {templateUrl: "partials/detail.html", controller: "Detail"})
    .when("/organizations/:userId", {templateUrl: "partials/user.html", controller: "User"})
    .when("/profile", {templateUrl: "partials/profile.html", controller: "ProfileCtrl"})

    .otherwise("/404", {templateUrl: "partials/404.html", controller: "PageCtrl"});
}]);
app.directive("scroll", function ($window) {
    return function(scope, element, attrs) {
        angular.element($window).bind("scroll", function() {
             if (this.pageYOffset >= 200) {
                 scope.buttonshow = true;
             } else {
                 scope.buttonshow = false;
             }
            scope.$apply();
        });
    };
});
app.filter('reverse', function() {
  return function(items) {
    return items.slice().reverse();
  };
});
app.factory("posts", ["$firebaseArray",
  function($firebaseArray) {
    // create a reference to the database where we will store our data
    var ref = new Firebase("https://bridgecom.firebaseio.com/posts");

    return $firebaseArray(ref);
  }
]);
app.factory("login", ["$firebaseAuth", "$scope"
  function($firebaseAuth, $scope) {
    return function(){
      var ref = new Firebase("https://bridgecom.firebaseio.com/posts");
      $scope.authObj = $firebaseAuth(ref);
        $scope.authObj.$authWithPassword({
          email: $scope.logemail,
          password: $scope.logpass
        }).then(function(authData) {
          location.reload();
        }).catch(function(error) {
          $("#logtitle").show();
        });
    };

  }
]);
app.controller("PageCtrl", ["$scope", "$filter", "$firebaseAuth", "$firebaseObject", "posts", "login", 
  function($scope, $filter, $firebaseAuth, $firebaseObject, posts, login) {
    var ref = new Firebase("https://bridgecom.firebaseio.com");
    $scope.posts = posts;
    $scope.loading = true;
    $scope.error = false;
    $(".button-collapse").sideNav();
    $('.button-collapse').sideNav('hide');
    $scope.posts.$loaded(
      function(data) {
        $scope.loading = false;

      },
      function(error) {
        $scope.loading = false;
      }    
    );
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
      login();
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
            website: "None",
            verified: false,
            description: "None"
          }, function(){
            location.reload();
          });
        
      }).catch(function(error) {
        $("#regtitle").show();
      });  
    };
    $scope.searchtop = function(){
      $("html, body").animate({ scrollTop: 0 }, 100);
      $( "#searchinput" ).focus();
        return false;
    };
  }
])
.controller("ProfileCtrl", ["$scope", "$firebaseAuth", "$location", "$firebaseObject", function($scope, $firebaseAuth, $location, $firebaseObject) {
  var ref = new Firebase("https://bridgecom.firebaseio.com");
  $(".button-collapse").sideNav();
  $("#sidenav-overlay").hide();
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
  };
}])
.controller("PostCtrl", ["$scope", "$firebaseAuth", "$location", "$firebaseObject", function($scope, $firebaseAuth, $location, $firebaseObject) {
  var ref = new Firebase("https://bridgecom.firebaseio.com");
  $(".button-collapse").sideNav();
  $('.button-collapse').sideNav('hide');
  $scope.authObj = $firebaseAuth(ref);
  $scope.authData = true;
  $scope.tags = "Animals";
  $scope.type = "Volunteering";
  $scope.startTime = "2 PM";
  $scope.endTime = "3 PM";
  $scope.authObj.$onAuth(function(authData) {
    if (authData) {
      var user = new Firebase("https://bridgecom.firebaseio.com/users/"+authData.uid);
      user.once("value", function(snapshot) {
        if(snapshot.child("verified").val()== false) {
          $location.path('/');
        }
        $scope.post = function(){
          $scope.posting = true;
            ref.child("posts").push({
              title: $scope.title,
              author: snapshot.child("name").val(),
              authorid: snapshot.key(),
              picture: $("#image").attr("src"),
              location: $scope.location,
              tags: $scope.tags,
              link: $scope.link,
              endTime: $scope.endTime,
              endDate: document.getElementById("endDate").value,
              startDate: document.getElementById("startDate").value,
              startTime: $scope.startTime,
              type: $scope.type,
              description: $scope.description
            }, function(error) {
                window.location.replace("#/");
            }); 
        };

      }, function (errorObject) {
        $location.path('/');
      });

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
}])
.controller("Detail", ["$scope", "$firebaseAuth", "$route","$location", "$routeParams", "$firebaseObject", function($scope, $firebaseAuth, $route, $location, $routeParams, $firebaseObject) {
  $scope.params = $routeParams;
  $scope.loading = true;
  $(".button-collapse").sideNav();
  $('.button-collapse').sideNav('hide');
  var ref = new Firebase("https://bridgecom.firebaseio.com");
  var data = new Firebase("https://bridgecom.firebaseio.com/posts/"+$route.current.params.postId);
  $scope.post = $firebaseObject(data);
  $scope.post.$loaded(
    function(data) {
      if(data.author) {
        $scope.show = true;
        $scope.loading = false;
       
      } else {
        console.log("")
        $scope.none = true;
        $scope.loading = false;        
      }
    },
    function(error) {
      $scope.none = true;
      $scope.loading = false;
    }  
  );
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
          website: "None",
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
.controller("User", ["$scope", "$firebaseAuth", "$route","$location", "$routeParams", "$firebaseObject", function($scope, $firebaseAuth, $route, $location, $routeParams, $firebaseObject) {
  $scope.params = $routeParams;
  $scope.loading = true;
  $(".button-collapse").sideNav();
  $('.button-collapse').sideNav('hide');
  var ref = new Firebase("https://bridgecom.firebaseio.com");
  var data = new Firebase("https://bridgecom.firebaseio.com/users/"+$route.current.params.userId);
  $scope.user = $firebaseObject(data);
  $scope.user.$loaded(
    function(d) {

          if(d.image) {
            $scope.show = true;
            $scope.loading = false;
           
          } else {
            $scope.none = true;
            $scope.loading = false;        
          }
    },
    function(error) {
          $scope.none = true;
          $scope.loading = false;
    }  
  );
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
          website: "None",
          verified: false,
          description: "None"
        }, function(){
          location.reload();
        });
      
    }).catch(function(error) {
      $("#regtitle").show();
    });  
  }; 
}]);