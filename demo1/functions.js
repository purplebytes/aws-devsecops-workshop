// Get the serviceendpoint of your service from the cloudformation.
// Go to the output tab and copy the link
// It will look like this 
//var URL = "https://anfc79aa6d.execute-api.eu-west-1.amazonaws.com/dev"

var URL = "https://<your-service-endpoint/dev"

function submitBot(){
var honeyURL = URL + "/v1/get-pass"
 var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", honeyURL, true); // true for asynchronous 
    xmlHttp.send(null);
}

function submit(){

			
			var email = ""+document.getElementById("email").value;
			
			$.ajax(URL + "/subscribe", {
    				method: 'POST',
    				contentType: 'application/json',
                    data: JSON.stringify({
        				
        				email: email
                     }),
				    beforeSend: function(xmlHttpRequest) {
     					 xmlHttpRequest.withCredentials = true;
   				    }
				
			})
			.then(
    				function success(data) {
        				
					var result = data;
					
					if(result.code == "NotAuthorizedException" || result.code == "UserNotFoundException"){
						window.alert("Please enter a valid email!");
						window.location = "index.html";
					}
					else{
						   
						    window.alert("Thank you. We have registered your email " + email);
						    window.location = "index.html";
						}
   			 	},

				function fail(data, status){
					
                    window.alert("Error connecting to server. Please try again");
	            window.location = "index.html";
				}
			);
}

        
