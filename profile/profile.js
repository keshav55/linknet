var ref = new Firebase("https://bridgecom.firebaseio.com");
$("a[href='../post']").hide();
function authDataCallback(authData) {
	var authData = ref.getAuth();
	if (authData) {
		ref.child("users").on('value', function(snapshot) {
		  if (snapshot.hasChild(authData.uid)) {
			  if (snapshot.child(authData.uid).hasChild("type")) {
			    if(snapshot.child(authData.uid).child("type").val() == "Volunteer") {
			    	$("a[href='../post']").remove();
			    } else(snapshot.child(authData.uid).child("type").val() == "Organization") {
			    	$("a[href='../post']").show();
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
			$(".l_i").fadeIn();
			$("#image").attr("src", snapshot.child(authData.uid).child("image").val());
			$("#type").text(snapshot.child(authData.uid).child("type").val());
			$("#name").val(snapshot.child(authData.uid).child("name").val());
			$("#email").val(snapshot.child(authData.uid).child("email").val());
			$("#description").val(snapshot.child(authData.uid).child("description").val());
			$("#phone").val(snapshot.child(authData.uid).child("phone").val());
			$("#email").next().addClass("active");
			$("#name").next().addClass("active");
			$("#description").next().addClass("active");
			$("#phone").next().addClass("active");

		});

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
function readURL(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                $('#image').attr('src', e.target.result);
            }

            reader.readAsDataURL(input.files[0]);
        }
}
$("#imgInp").change(function(){
    readURL(this);
});
$(".logout").click(function(){
	ref.unauth(function(){
		location.reload();
	});
});
$("#save").click(function(){
		    ref.child("users").child(ref.getAuth().uid).update({
		      name: $("#name").val(), 
		      image: $("#image").attr("src"),
		      email: $("#email").val(), 
		      description: $("#description").val(), 
		      phone: $("#phone").val()
		    });
});