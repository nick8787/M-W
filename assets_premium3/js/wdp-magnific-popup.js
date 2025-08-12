/*
Version : 1.0
*/

jQuery(document).ready(function($){

    "use strict";

    /* Single image MagnificPopup */ 

    $('.wdp_single_magnificPopup').magnificPopup({
      type:'image',
      removalDelay: 300,
      mainClass: 'mfp-with-zoom', // this class is for CSS animation below
      zoom: {
        enabled: true, // By default it's false, so don't forget to enable i
        duration: 300, // duration of the effect, in milliseconds
        easing: 'ease-in-out', // CSS transition easing function
        // The "opener" function should return the element from which popup will be zoomed in
        // and to which popup will be scaled down
        // By defailt it looks for an image tag:
        opener: function(openerElement) {
          // openerElement is the element on which popup was initialized, in this case its <a> tag
          // you don't need to add "opener" option if this code matches your needs, it's defailt one.
          return openerElement.is('img') ? openerElement : openerElement.find('img');
        }
      }
    });

    /* Gallery MagnificPopup */
    
    $('.wdp_gallery_magnificPopup').each(function() { // the containers for all your galleries
        $(this).magnificPopup({
            delegate: 'a',
            type: 'image',
            removalDelay: 300,
            gallery: {
              enabled:true
            },
            mainClass: 'mfp-with-zoom', // this class is for CSS animation below
              zoom: {
                enabled: true, // By default it's false, so don't forget to enable i
                duration: 300, // duration of the effect, in milliseconds
                easing: 'ease-in-out', // CSS transition easing function
                // The "opener" function should return the element from which popup will be zoomed in
                // and to which popup will be scaled down
                // By defailt it looks for an image tag:
                opener: function(openerElement) {
                  // openerElement is the element on which popup was initialized, in this case its <a> tag
                  // you don't need to add "opener" option if this code matches your needs, it's defailt one.
                  return openerElement.is('img') ? openerElement : openerElement.find('img');
                }
              }
        });
    });
});