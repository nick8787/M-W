/*
Version : 1.0
*/

jQuery(document).ready(function($){

    "use strict";

    /* Photo Album Swiper */

    var albumSwiper = new Swiper('.wdp_photo_album_swiper', {
        autoplay: 2500, // Delay between transitions (in ms)
        autoplayDisableOnInteraction: false, // Autoplay will not be disabled after user interactions
        speed: 800, // Duration of transition between slides (in ms) 
        roundLengths: true, // Prevent blurry texts on usual resolution screens
        grabCursor: true, // User will see the "grab" cursor when hover on Swiper
        keyboardControl: true, // Enable navigation through slides using keyboard arrows 
        slidesPerView: 3, // Number of slides per view
        spaceBetween: 5, // Distance between slides in px. 
        loop: true, // Enable continuous loop mode
        // Responsive breakpoints
        breakpoints: {
            375: {
                slidesPerView: 1
            }
        },
        effect: 'coverflow', // Swiper effect
        // Coverflow effect parameters
        coverflow: { 
            rotate: 50,
            stretch: 0,
            depth: 100,
            modifier: 1, 
            slideShadows : false // Disable shadows for better performance.
        }
    });

    /* Carousel Swiper */
    
    var carouselSwiper = new Swiper('.wdp_carousel_swiper', {
        //pagination: '.wdp_carousel_swiper_pagination', // CSS selector of the container with pagination
        nextButton: '.wdp_carousel_swiper_next', // CSS selector of the element that will work like "next" button after click on it
        prevButton: '.wdp_carousel_swiper_prev', //  CSS selector of the element that will work like "prev" button after click on it
        //paginationClickable: true, // Clickable pagination for bullets pagination type
        speed: 800, // Duration of transition between slides (in ms)
        roundLengths: true, // Prevent blurry texts on usual resolution screens
        grabCursor: true, // User will see the "grab" cursor when hover on Swiper
        keyboardControl: true, // Enable navigation through slides using keyboard arrows
        slidesPerView: 4, // Number of slides per view
        spaceBetween: 50, // Distance between slides in px. 
        loop: true, // Enable continuous loop mode
        // Responsive breakpoints
        breakpoints: {
            1024: {
                slidesPerView: 3,
                spaceBetween: 40
            },
            768: {
                slidesPerView: 2,
                spaceBetween: 30
            },
            480: {
                slidesPerView: 1,
                spaceBetween: 20
            }
        }
    });  
});