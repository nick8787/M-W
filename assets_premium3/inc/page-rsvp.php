<?php
/*
Version : 1.0
*/

if(isset($_POST['email'])) {

    // Edit these two lines with your email address and the subject that you want to receive
    $email_to = 'no-reply@flockthemes.com';
    $email_subject = "RSVP page email";
	
    $name = $_POST['name']; 
    $email = $_POST['email']; 
    $phone = $_POST['phone']; 
    $guests = $_POST['guests'];
    $events = $_POST['events'];
     
    $email_message = "Form details below.\n\n";
     
    function clean_string($string) {
      $bad = array("content-type","bcc:","to:","cc:","href");
      return str_replace($bad,"",$string);
    }
     
    $email_message .= "Name: ".clean_string($name)."\n";
    $email_message .= "Email id: ".clean_string($email)."\n";
    $email_message .= "Phone No: ".clean_string($phone)."\n";
    $email_message .= "No. of Guests: ".clean_string($guests)."\n";
    $email_message .= "Attending Event: ".clean_string($events);
     
	$headers = 'From: '.$email."\r\n".
	'Reply-To: '.$email."\r\n" .
	'X-Mailer: PHP/' . phpversion();
	mail($email_to, $email_subject, $email_message, $headers); 
	
}

?>