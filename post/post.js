var ref = new Firebase("https://bridgecom.firebaseio.com");
function authDataCallback(authData) {
	var authData = ref.getAuth();
	if (authData) {
		ref.once('value', function(snapshot) {
		  if (snapshot.child("users").hasChild(authData.uid)) {
			  if (snapshot.child("users").child(authData.uid).hasChild("type")) {
			    jQuery.noop();
			  } else {
			  	window.location.replace("http://keshav55.github.io/linknet/verify");
			  }		
		  } else {
		    ref.child("users").child(authData.uid).set({
		      provider: authData.provider,
		      name: getName(authData), 
		      email: getEmail(authData),
		      image: getImage(authData)
		    },function(){
		    	window.location.replace("http://keshav55.github.io/linknet/verify");
		    });
		  }		  
		});
		$(".l_i").fadeIn();
	} else {
		window.location.replace("http://keshav55.github.io/linknet");
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

$(".logout").click(function(){
	ref.unauth(function(){
		location.reload();
	});
});