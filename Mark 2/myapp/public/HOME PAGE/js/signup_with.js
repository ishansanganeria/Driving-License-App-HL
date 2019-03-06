
var script = document.createElement('script');
script.src = 'http://code.jquery.com/jquery-1.11.0.min.js';
script.type = 'text/javascript';
document.getElementsByTagName('head')[0].appendChild(script);


$("#search").click(function(){
$.getJSON('f1.json', function(data) {
    for (var i in data) {
        $('input[name="'+i+'"]').val(data[i]);
    }
		document.getElementsByClassName("fname")[0].value =  data.fname;
		document.getElementsByClassName("lname")[0].value =  data.lname;
		document.getElementsByClassName("UID")[0].value = data.uid;
		document.getElementsByClassName("gender")[0].value = 'male';
		document.getElementsByClassName("contact")[0].value =  data.contact_number;
		document.getElementsByClassName("emailid")[0].value =  data.email_id;
		document.getElementsByClassName("dob")[0].value = data.dob;
		document.getElementsByClassName("nationality")[0].value = "indian";
		document.getElementsByClassName("bloodGroup")[0].value = data.bloodGroup;
		document.getElementsByClassName("RelFirstName")[0].value = data.RelFirstName;
		document.getElementsByClassName("RelLastName")[0].value = data.RelLastName;
		document.getElementsByClassName("RelFirstName")[0].value = data.RelFirstName;
		document.getElementsByClassName("EmergencyNumber")[0].value = data.EmergencyNumber;

});
});
