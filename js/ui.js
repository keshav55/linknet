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
    var offset = 300,
		//browser window scroll (in pixels) after which the "back to top" link opacity is reduced
		offset_opacity = 1200,
		//duration of the top scrolling animation (in ms)
		scroll_top_duration = 700,
		//grab the "back to top" link
		$back_to_top = $('.cd-top');

	//hide or show the "back to top" link
	$(window).scroll(function(){
		( $(this).scrollTop() > offset ) ? $back_to_top.addClass('cd-is-visible') : $back_to_top.removeClass('cd-is-visible cd-fade-out');
		if( $(this).scrollTop() > offset_opacity ) { 
			$back_to_top.addClass('cd-fade-out');
		}
	});

	//smooth scroll to top
	$back_to_top.on('click', function(event){
		event.preventDefault();
		$('body,html').animate({
			scrollTop: 0 ,
		}, scroll_top_duration
		);
	});
});