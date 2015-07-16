var ref = new Firebase("https://bridgecom.firebaseio.com");
function authDataCallback(authData) {
	var authData = ref.getAuth();
	console.log("authData");
	if($(".l_o").length == 0 || $(".l_i").length == 0) {
		location.reload();
	}
	if (authData) {
		$(".l_o").remove();
		$(".l_i").fadeIn();
	} else {
		$(".l_o").fadeIn();
		$(".l_i").remove();
	}
}
ref.onAuth(authDataCallback);


$("#org #register").click(function(){
	$(this).addClass('disabled');
	$(this).html('<i class="material-icons">query_builder</i>');
	var regemail = $("#org #regemail").val();
	var regpass = $("#org #regpass").val();
	ref.createUser({
		email    : regemail,
		password : regpass
	}, function(error, userData) {
		if (error) {
			$("#org #regtitle").fadeIn();
			$("#org #register").removeClass('disabled');
			$("#org #register").html("Register");
		} else {
			ref.authWithPassword({
				email    : regemail,
				password : regpass
			}, function(error, authData) {
				ref.child("users").child(authData.uid).set({
				  type: "org",
				  email: authData.email
				}, function(){
					location.reload();
				});				
				
			});
		}
	});
});
$("#vol #register").click(function(){
	$(this).addClass('disabled');
	$(this).html('<i class="material-icons">query_builder</i>');
	var regemail = $("#vol #regemail").val();
	var regpass = $("#vol #regpass").val();
	ref.createUser({
		email    : regemail,
		password : regpass
	}, function(error, userData) {
		if (error) {
			$("#vol #regtitle").fadeIn();
			$("#vol #register").removeClass('disabled');
			$("#vol #register").html("Register");
		} else {
			ref.authWithPassword({
				email    : regemail,
				password : regpass
			}, function(error, authData) {
				ref.child("users").child(authData.uid).set({
				  type: "vol",
				  email: authData.email
				}, function(){
					location.reload();
				});				
				
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
$(".fb_org").click(function(){
	$(this).addClass('disabled');
	$(this).html('<i class="material-icons">query_builder</i>');

	ref.authWithOAuthPopup("facebook", function(error, authData) {
		if (error) {
			$("#org .fb_title").fadeIn();
			$("#org .fb").removeClass('disabled');
			$("#org .fb").html('<i class="fa fa-facebook"></i>Log in with Facebook');	    
		} else if(authData && isNewUser) {
				ref.child("users").child(authData.uid).set({
				  type: "org",
				  email: authData.email
				}, function(){
					location.reload();
				});	
		} else {
			location.reload();
		}
	});
});
$(".fb_vol").click(function(){
	$(this).addClass('disabled');
	$(this).html('<i class="material-icons">query_builder</i>');

	ref.authWithOAuthPopup("facebook", function(error, authData) {
		if (error) {
			$("#vol .fb_title").fadeIn();
			$("#vol .fb").removeClass('disabled');
			$("#vol .fb").html('<i class="fa fa-facebook"></i>Log in with Facebook');	    
		} else if(authData && isNewUser) {
				ref.child("users").child(authData.uid).set({
				  type: "vol",
				  email: authData.email
				}, function(){
					location.reload();
				});	
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