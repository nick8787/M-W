<?php
/*
Version : 1.0
*/

if(isset($_POST['name'])) {

    // Edit these two lines with your email address and the subject that you want to receive
    $email_to = 'no-reply@flockthemes.com';
    $email_subject = "RSVP home page email";
     
    $name = $_POST['name']; 
    $guests = $_POST['guests'];
    $events = $_POST['events'];
     
    $email_message = "Form details below.\n\n";
     
    function clean_string($string) {
      $bad = array("content-type","bcc:","to:","cc:","href");
      return str_replace($bad,"",$string);
    }
     
    $email_message .= "Name: ".clean_string($name)."\n";
    $email_message .= "Guests: ".clean_string($guests)."\n";
    $email_message .= "Events: ".clean_string($events);
     
	$headers = 'X-Mailer: PHP/' . phpversion();
	mail($email_to, $email_subject, $email_message, $headers); 
	
}

?>