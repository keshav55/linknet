var ref = new Firebase("https://bridgecom.firebaseio.com");
function authDataCallback(authData) {
	var authData = ref.getAuth();
	if (authData) {
		ref.once('value', function(snapshot) {
		  if (snapshot.hasChild(authData.uid)) {
			  if (snapshot.child(authData.uid).hasChild("type")) {
			    window.location.replace("http://keshav55.github.io/linknet");
			  } else {
			  	jQuery.noop();
			  }		
		  } else {
		    window.location.replace("http://keshav55.github.io/linknet");
		  }		  
		});

	} else {
		window.location.replace("http://keshav55.github.io/linknet");
	}
}

ref.onAuth(authDataCallback);
$("#submit").click(function(){
		    ref.child("users").child(authData.uid).set({
		      type: $("input[name=group1]:checked").val()
		    },function(){
		    	window.location.replace("http://keshav55.github.io/linknet");
		    });	
});