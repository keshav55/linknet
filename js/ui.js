var ref = new Firebase("https://bridgecom.firebaseio.com");
function authDataCallback(authData) {
	var authData = ref.getAuth();

	if($(".l_o").length == 0 || $(".l_i").length == 0) {
		location.reload();
	}
	console.log(authData.facebook);
	if (authData) {
	    // save the user's profile into the database so we can list users,
	    // use them in Security and Firebase Rules, and show profiles
	    ref.child("users").child(authData.uid).set({
	      provider: authData.provider,
	      name: getName(authData), 
	      email: authData.facebook.email,
	      image: getImage(authData)
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

});