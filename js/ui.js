var ref = new Firebase("https://bridgecom.firebaseio.com");
function authDataCallback(authData) {
	var authData = ref.getAuth();
	if (authData) {
		$(".l_o").remove();
		$(".l_i").fadeIn();
	} else {
		$(".l_o").fadeIn();
		$(".l_i").remove();
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