/*------------------------------------------------------------------
* Project:        Royal Love
* Author:         CN InfoTech
* URL:            https://themeforest.net/user/cn-infotech/portfolio
* Created:        01/01/2019
-------------------------------------------------------------------*/


(function ($) {
	'use strict';

	/* -- Preloader Js -- */
      $(window).on("load", function () {
            $('.spinner').fadeOut();
            $('.preloader-area').delay(350).fadeOut('slow');
        });

	jQuery(document).ready(function ($) {

		/* -- Sticky Menu -- */


		$(window).on('scroll', function () {
			if ($(window).scrollTop() > 50) {
				$('.navbar-fixed-top').addClass('sticky');
			} else {
				$('.navbar-fixed-top').removeClass('sticky');
			}
		});

		/* -- Wow -- */

		var wow = new WOW({
			mobile: false
		});
		wow.init();

		/* -- Slider Carousel -- */


		$(".slider-active").owlCarousel({
			items: 1,
			dots: true,
			autoplay: true,
			loop: true,
			mouseDrag: false,
			touchDrag: false,
			navText: ["<i class='fa fa-angle-left'></i>", "<i class='fa fa-angle-right'></i>"],
			responsive: {
				0: {
					items: 1
				},
				600: {
					items: 1
				},
				1000: {
					items: 1,
					nav: true,
				}
			}
		});


		$('.wishes-owl').owlCarousel({
			items:1,
		    loop:true,
		    margin:10,
		    navigation:false,
		    responsiveClass:true,
		    responsive:{
		        0:{
		            items:1,
		            nav:false
		        },
		        600:{
		            items:1,
		            nav:false
		        },
		        1000:{
		            items:1,
		            nav:true,
		            loop:false
		        }
		    }
		})

		$('.wishes-owl1').owlCarousel({
			items:2,
		    loop:true,
		    margin:10,
		    navigation:false,
		    responsiveClass:true,
		    responsive:{
		        0:{
		            items:1,
		            nav:false
		        },
		        600:{
		            items:1,
		            nav:false
		        },
		        1000:{
		            items:2,
		            nav:true,
		            loop:false
		        }
		    }
		})

		$('.wishes-owl2').owlCarousel({
			items:2,
		    loop:true,
		    margin:10,
		    navigation:false,
		    responsiveClass:true,
		    responsive:{
		        0:{
		            items:1,
		            nav:false
		        },
		        600:{
		            items:1,
		            nav:false
		        },
		        1000:{
		            items:2,
		            nav:true,
		            loop:false
		        }
		    }
		})


	/* -- testimonial Carousel -- */
	$("#testimonial-slider").owlCarousel({
        items:1,
        pagination:true,
        navigationText:["",""],
        slideSpeed:1000,
        autoPlay:true,
		responsive:{
				0:{
					items:1
				},
				600:{
					items:1
				},
				1000:{
					items:1
				}
			}			
    });

    // partner & registry
	 $('.owl-registry').owlCarousel({
		    loop:true,
		    margin:10,
		    dots:false,
		    navText: ["<i class='fa fa-angle-left'></i>", "<i class='fa fa-angle-right'></i>"],
		    autoplay:true,
		    slideSpeed:2000,
		    responsiveClass:true,
		    responsive:{
		        0:{
		            items:1,
		            nav:true
		        },
		        500:{
		            items:2,
		            nav:true
		        },
		        600:{
		            items:3,
		            nav:true
		        },
		        1000:{
		            items:4,
		            nav:true,
		            loop:false
		        }
		    }
		});

    $('.store-slider').slick({
    infinite: true,
    autoplay: false,
    arrows: true,
    dots: false,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 991,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
        }
      },
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
        }
      },
      {
        breakpoint: 479,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
        }
      }
    ]
  });

    $('.services-slider').slick({
    infinite: true,
    autoplay: true,
    arrows: true,
    dots: false,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 991,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
        }
      },
      {
        breakpoint: 479,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
        }
      }
    ]
  });


    $('.store-slider1').slick({
    infinite: true,
    autoplay: false,
    arrows: true,
    dots: false,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 991,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
        }
      },
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
        }
      },
      {
        breakpoint: 479,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
        }
      }
    ]
  });

     $('.slider-for').slick({
	  slidesToShow: 1,
	  slidesToScroll: 1,
	  autoplay:true,
	  arrows: false,
	  dots: false,
	  fade: true,
	  asNavFor: '.slider-nav'
	});
	$('.slider-nav').slick({
	  slidesToShow: 3,
	  slidesToScroll: 1,
	  asNavFor: '.slider-for',
	  dots: false,
	  centerMode: true,
	  focusOnSelect: true
	});

		/* -- Smoth Scrool Js -- */

		$(".navbar-nav").on('click', 'a', function(e){
			var anchor = $(this);
			$('html, body').stop().animate({
				scrollTop: $(anchor.attr('href')).offset().top - 5
			}, 1000);
			e.preventDefault();
		});
		
		// Mobile Menu hiddin on click  
		
		$(".navbar-nav").on('click', 'a', function(){
			$(".navbar-collapse").removeClass("in");
		})			

		/* -- Bottom to Top -- */

		$('body').append('<div id="scrollup"><i class="fa fa-angle-up"></i></div>');
	
		
		 $(window).on("scroll", function () {
            if ($(this).scrollTop() > 250) {
                $('#scrollup').fadeIn();
            } else {
                $('#scrollup').fadeOut();
            }
        });
        $('#scrollup').on("click", function () {
            $("html, body").animate({
                scrollTop: 0
            }, 800);
            return false;
        });
	


		/* -- Skill -- */
		
		$('.skillsection').bind('inview', function (event, visible, visiblePartX, visiblePartY) {
			if (visible) {
				$('.chart').easyPieChart({
					//your configuration goes here
					easing: 'easeOut',
					delay: 3000,
					lineCap: "square",
					lineWidth: "10",
					barColor: '#fff',
					trackColor: 'transparent',
					scaleColor: false,
					lineWidth: 2,
					size: 110,
					animate: 2000,
					onStep: function (from, to, percent) {
						this.el.children[0].innerHTML = Math.round(percent);
					}

				});
				$(this).unbind('inview');
			}
		});

		// progress-bar

		$('.progress .progress-bar').css("width",
                function() {
                    return $(this).attr("aria-valuenow") + "%";
                }
        )

		/* -- Portfolio mixitup Js -- */
		

		$('.portfolio-inner').mixItUp();

		

		 /* -- Counter Down Js -- */
			$('.coundown_res').countdown('2018/01/02', function(event) {
				var $this = $(this);
				$this.find('#day').html(event.strftime('<span>%D</span>'));
				$this.find('#hour').html(event.strftime('<span>%H</span>'));
				$this.find('#month').html(event.strftime('<span>%M</span>'));
				$this.find('#second').html(event.strftime('<span>%S</span>'));
			});
		 /* -- End Counter Down Js -- */	
		
		/* -- Counter Up Js -- */
		$('.counter').counterUp();

		/*========= Fun and Facts Script ======== */

	    try {
	        $(".fun-facts_wrapper").appear(function () {
	            $(".timer").countTo();
	        });
	    } catch (err) {

	        console.log(err.message);
	    }
		
		/* -- Magnific PopUp Js -- */
		$(".video-play-btn").magnificPopup({
            type:'video',
        });

		/* -- Magnific PopUp Js -- */

		$('.project-hover').magnificPopup({
		  delegate: 'a', // child items selector, by clicking on it popup will open
		  type: 'image'
		  // other options
		});

		var magnifPopup = function () {
			$('.port-popup').magnificPopup({
				delegate: 'a',
				type: 'image',
				removalDelay: 300,
				mainClass: 'mfp-with-zoom',
				gallery: {
					enabled: true
				},
				zoom: {
					enabled: true, // By default it's false, so don't forget to enable it

					duration: 300, // duration of the effect, in milliseconds
					easing: 'ease-in-out', // CSS transition easing function

					// The "opener" function should return the element from which popup will be zoomed in
					// and to which popup will be scaled down
					// By defailt it looks for an image tag:
					opener: function (openerElement) {
						// openerElement is the element on which popup was initialized, in this case its <a> tag
						// you don't need to add "opener" option if this code matches your needs, it's defailt one.
						return openerElement.is('img') ? openerElement : openerElement.find('img');
					}
				}
			});
		};
		// Call the functions 
		magnifPopup();
		/*----- End ------------*/

	});

/*======= Main Slider Init =========*/

    var interleaveOffset = 0.5;
    var swiperOptions = {
        loop: true,
        speed: 3000,
        autoplay: true,
        grabCursor: true,
        watchSlidesProgress: true,
        mousewheelControl: true,
        keyboardControl: true,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        pagination: {
        el: '.swiper-pagination',
        dynamicBullets: true,
      },
        on: {
            progress: function() {
              var swiper = this;
              for (var i = 0; i < swiper.slides.length; i++) {
                var slideProgress = swiper.slides[i].progress;
                var innerOffset = swiper.width * interleaveOffset;
                var innerTranslate = slideProgress * innerOffset;
                swiper.slides[i].querySelector(".slide-inner").style.transform =
                  "translate3d(" + innerTranslate + "px, 0, 0)";
              }
            },
            touchStart: function() {
              var swiper = this;
              for (var i = 0; i < swiper.slides.length; i++) {
                swiper.slides[i].style.transition = "";
              }
            },
            setTransition: function(speed) {
                var swiper = this;
                for (var i = 0; i < swiper.slides.length; i++) {
                    swiper.slides[i].style.transition = speed + "ms";
                    swiper.slides[i].querySelector(".slide-inner").style.transition =
                    speed + "ms";
                }
            },
        }
    };
    var swiper = new Swiper(".swiper-container", swiperOptions);

    /*======= Banner Resize with window size =========*/

    $(window).on( 'resize', function () {
        var bodyheight = $(this).height();
        $("#mt_banner").height(bodyheight);
    }).resize();

})(jQuery);

