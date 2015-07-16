var ref = new Firebase("https://bridgecom.firebaseio.com");
function authDataCallback(authData) {
	var authData = ref.getAuth();
	if (authData) {
		ref.once('value', function(snapshot) {
		  if (snapshot.child("users").hasChild(authData.uid)) {
			  if (snapshot.child("users").child(authData.uid).hasChild("type")) {
			    window.location.replace("http://keshav55.github.io/linknet");
			  } else {
			  	$("#submit").removeClass("disabled");
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
		    ref.child("users").child(ref.getAuth().uid).push('type': $("input[name=group1]:checked").val()),
		    function(){
		    	window.location.replace("http://keshav55.github.io/linknet");
		    });	
});