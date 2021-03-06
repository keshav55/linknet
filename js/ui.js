var ref = new Firebase("https://bridgecom.firebaseio.com");
function authDataCallback(authData) {
	var authData = ref.getAuth();

	if($(".l_o").length == 0 || $(".l_i").length == 0) {
		location.reload();
	}
	if (authData) {
		ref.child("users").once('value', function(snapshot) {
		  if (snapshot.hasChild(authData.uid)) {
			  if (snapshot.child(authData.uid).hasChild("type")) {
			    if(snapshot.child(authData.uid).child("type").val() == "Volunteer") {
			    	$("a[href='../post']").remove();
			    	$("a[href='post']").remove();
			    } else {
			    	$("a[href='../post']").show();
			    	$("a[href='post']").show();			    	
			    }
			  } else {
			  	window.location.replace("http://keshav55.github.io/linknet/verify");
			  }		
		  } else {
		    ref.child("users").child(authData.uid).set({
		      name: getName(authData), 
		      email: getEmail(authData),
		      image: getImage(authData),
		      phone: "None",
		  	  description: "None"

		    },function(){
		    	window.location.replace("http://keshav55.github.io/linknet/verify");
		    });
		  }		  
		});
		$(".l_o").remove();
		$(".l_i").fadeIn();
	} else {
		$(".l_o").fadeIn();
		$(".l_i").remove();
	}

}
function getName(authData) {
  switch(authData.provider) {
     case 'password':
       return authData.password.email.replace(/@.*/, '');

     case 'facebook':
       return authData.facebook.displayName;
  }
}
function getEmail(authData) {
  switch(authData.provider) {
     case 'password':
       return authData.password.email;

     case 'facebook':
       return authData.facebook.email;
  }
}
function getImage(authData) {
  switch(authData.provider) {
     case 'password':
       return "http://keshav55.github.io/linknet/img/user.png";

     case 'facebook':
       return authData.facebook.profileImageURL;
  }
}
ref.onAuth(authDataCallback);

$("#register").click(function(){
	$(this).addClass('disabled');
	$(this).html('<i class="material-icons">query_builder</i>');
	var regemail = $("#regemail").val();
	var regpass = $("#regpass").val();
	ref.createUser({
		email    : regemail,
		password : regpass
	}, function(error, userData) {
		if (error) {
			$("#regtitle").fadeIn();
			$("#register").removeClass('disabled');
			$("#register").html("Register");
		} else {
			ref.authWithPassword({
				email    : regemail,
				password : regpass
			}, function(error, authData) {
				location.reload();
			});
		}
	});
});
$("#login").click(function(){
	$(this).addClass('disabled');
	$(this).html('<i class="material-icons">query_builder</i>');
	var logemail = $("#logemail").val();
	var logpass = $("#logpass").val();
	ref.authWithPassword({
		email    : logemail,
		password : logpass
	}, function(error, userData) {
		if (error) {
			$("#logtitle").fadeIn();
			$("#login").removeClass('disabled');
			$("#login").html("Log In");	    
		} else {
			location.reload();
		}
	});
});
$(".fb").click(function(){
	$(this).addClass('disabled');
	$(this).html('<i class="material-icons">query_builder</i>');

	ref.authWithOAuthPopup("facebook", function(error, authData) {
		if (error) {
			$(".fb_title").fadeIn();
			$(".fb").removeClass('disabled');
			$(".fb").html('<i class="fa fa-facebook"></i>Log in with Facebook');	    
		} else {
			location.reload();
		}
	}, {
	  remember: "sessionOnly",
	  scope: "email"
	});
});

$(".logout").click(function(){
	ref.unauth(function(){
		location.reload();
	});
});

$(document).ready(function(){
    // the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
    $('.modal-trigger').leanModal();
    $("a[href='post']").hide();
    $("a[href='../post']").hide();

	ref.child("posts").on("child_added", function(snapshot, prevChildKey) {
	  var childData = snapshot.val();
	  var key = snapshot.key();
	  $("#feed").append('<div id="'+key+'" class="col s12 m6"><div class="card"><div class="card-image"><img src="'+childData.picture+'"><span class="card-title">'+childData.title+'</span></div><div class="card-content"><ul class="collection"><li class="collection-item"><div>By <b>'+childData.author+'</b><span class="secondary-content"><i class="material-icons">account_circle</i></a></div></li><li class="collection-item"><div>'+childData.date+'<span class="secondary-content"><i class="material-icons">today</i></a></div></li><li class="collection-item"><div><a target="_blank" href="https://www.google.com/maps/place/'+childData.location+'">'+childData.location+'</a><span class="secondary-content"><i class="material-icons">location_on</i></a></div></li><li class="collection-item"><div>Volunteers needed: '+childData.needed+'<span class="secondary-content"><i class="material-icons">insert_chart</i></a></div></li><li class="collection-item"><div>'+childData.description+'<span class="secondary-content"><i class="material-icons">subject</i></a></div></li></ul></div><div class="card-action"><a href="#">Join</a></div></div></div>');

	});
	ref.on("child_changed", function(snapshot) {
	  var childData = snapshot.val();
	  var key = snapshot.key();	  
	  $("#feed #"+ key).replaceWith('<div id="'+key+'" class="col s12 m6"><div class="card"><div class="card-image"><img src="'+childData.picture+'"><span class="card-title">'+childData.title+'</span></div><div class="card-content"><ul class="collection"><li class="collection-item"><div>By <b>'+childData.author+'</b><span class="secondary-content"><i class="material-icons">account_circle</i></a></div></li><li class="collection-item"><div>'+childData.date+'<span class="secondary-content"><i class="material-icons">today</i></a></div></li><li class="collection-item"><div><a target="_blank" href="https://www.google.com/maps/place/'+childData.location+'">'+childData.location+'</a><span class="secondary-content"><i class="material-icons">location_on</i></a></div></li><li class="collection-item"><div>Volunteers needed: '+childData.needed+'<span class="secondary-content"><i class="material-icons">insert_chart</i></a></div></li><li class="collection-item"><div>'+childData.description+'<span class="secondary-content"><i class="material-icons">subject</i></a></div></li></ul></div><div class="card-action"><a href="#">Join</a></div></div></div>');
	});
	ref.on("child_removed", function(snapshot) {
	  $("#feed #" + snapshot.key()).remove();
	});
});
