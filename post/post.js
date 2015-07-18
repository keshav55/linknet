var ref = new Firebase("https://bridgecom.firebaseio.com");
function authDataCallback(authData) {
	var authData = ref.getAuth();
	if (authData) {
		ref.child("users").once('value', function(snapshot) {
		  if (snapshot.hasChild(authData.uid)) {
			  if (snapshot.child(authData.uid).hasChild("type")) {
			    if(snapshot.child(authData.uid).child("type").val()=="Volunteer") {
			    	window.location.replace("http://keshav55.github.io/linknet");
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
$('.datepicker').pickadate({
    selectMonths: true, // Creates a dropdown to control month
    selectYears: 15 // Creates a dropdown of 15 years to control year
});
$('#us').locationpicker({
	location: {latitude: 37.5482697, longitude: -121.98857190000001},	
	radius: 0,
	enableAutocomplete: true,
	inputBinding: {

        locationNameInput: $('#location')
    }
});
$("#post").click(function(){
	ref.child('users').child(ref.getAuth().uid).once('value', function(snapshot){
		var name = snapshot.val().name;
		ref.child("posts").push({
		  title: $("#title").val(),
		  author: name,
		  picture: $("#image").attr("src"),
		  location: $("#location").val(),
		  date: $("#startTime").val()+ " " +$("#startDate").val() + " to " + $("#endTime").val()+ " " +$("#endDate").val(),
		  needed: $("#number").val(),
		  volunteers: 'none',
		  affiliates: $("#affiliates").val(),
		  description: $("#description").val()
		});
	});
});
        