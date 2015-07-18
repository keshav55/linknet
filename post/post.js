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
$('#startDate').datetimepicker({
	onClose: function(dateText, inst) {
		var endDateTextBox = $('#endDate');
		if (endDateTextBox.val() != '') {
			var testStartDate = new Date(dateText);
			var testEndDate = new Date(endDateTextBox.val());
			if (testStartDate > testEndDate)
				endDateTextBox.val(dateText);
		}
		else {
			endDateTextBox.val(dateText);
		}
	},
	onSelect: function (selectedDateTime){
		var start = $(this).datetimepicker('getDate');
		$('#endDate').datetimepicker('option', 'minDate', new Date(start.getTime()));
	}
});
$('#endDate').datetimepicker({
	onClose: function(dateText, inst) {
		var startDateTextBox = $('#startDate');
		if (startDateTextBox.val() != '') {
			var testStartDate = new Date(startDateTextBox.val());
			var testEndDate = new Date(dateText);
			if (testStartDate > testEndDate)
				startDateTextBox.val(dateText);
		}
		else {
			startDateTextBox.val(dateText);
		}
	},
	onSelect: function (selectedDateTime){
		var end = $(this).datetimepicker('getDate');
		$('#startDate').datetimepicker('option', 'maxDate', new Date(end.getTime()) );
	}
});