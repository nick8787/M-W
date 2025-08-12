/*
Version : 1.0
*/

jQuery(window).load(function($){

    "use strict";

    /* Scroll Reveal Animation for SPLASH element(s) */

    // Default Configuration
    var wdp_scrollreveal_splash_config = {
        origin   : "top", // 'bottom', 'left', 'top', 'right'
        distance : "2vw", // Can be any valid CSS distance, e.g. '5rem', '10%', '20vw', etc.
        duration : 800, // Time in milliseconds
        delay    : 0, // No Time Delay
        reset    : false, // Reveals occur once as elements become visible
        easing   : 'cubic-bezier( .63,.77,.61,1.19 )' // Accepts any valid CSS easing, e.g. 'ease', 'ease-in-out', 'linear', etc.
      };

      
    // Setting Reveal Time Delay of .wdp_splash_hearts Class
    var wdp_scrollreveal_splash_hearts = {
      delay    : 400 // Time in milliseconds
    };

    // Set reveal .wdp_splash_date class
    var wdp_scrollreveal_splash_date = { 
      delay    : 800 // Time in milliseconds
    };

    // Step to reveal .wdp_splash_text class
    var wdp_scrollreveal_splash_text = { 
      delay    : 1200 // Time in milliseconds
    };

    // Passing ScrollReveal() along with Configuration to Window Object
    window.sr = ScrollReveal( wdp_scrollreveal_splash_config ) 
      .reveal( ".wdp_splash_inner" ) // Sequence One
      .reveal( ".wdp_splash_hearts", wdp_scrollreveal_splash_hearts) // Sequence Two
      .reveal( ".wdp_splash_date", wdp_scrollreveal_splash_date) // Sequence Three
      .reveal( ".wdp_splash_text", wdp_scrollreveal_splash_text); // Sequence Four
});