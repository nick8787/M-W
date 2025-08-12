/*
Version : 1.0
*/

jQuery(document).ready(function($){

    "use strict";

    /* Home RSVP Form */

	$('#wdp_home_form').ajaxForm(function() { // bind form using 'ajaxForm'

        // Form has been received; here we add 'show' class to target element
        $('.wdp_home_form_success').addClass('show animated fadeInUp');

	});

	/* Page RSVP Form */

	$('#wdp_page_form').ajaxForm(function() { // bind form using 'ajaxForm'
		
		// Form has been received; here we add 'show' class to target element
        $('.wdp_page_form_success').addClass('show animated fadeInUp');

	});

	/* FancySelect */
	
    $('select').fancySelect(); // Passing FancySelect classes to the element(s)
});