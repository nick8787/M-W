/*---------------------------------------------"
// Template Name: SweetVows
// Description:  SweetVows Html Template
// Version: 1.0.0

--------------------------------------------*/
(function (window, document, $, undefined) {
  "use strict";

  var MyScroll = "";
  var Init = {
    i: function (e) {
      Init.s();
      Init.methods();
    },
    s: function (e) {
      (this._window = $(window)),
        (this._document = $(document)),
        (this._body = $("body")),
        (this._html = $("html"));
    },
    methods: function (e) {
      Init.w();
      Init.BackToTop();
      Init.cusBtn();
      Init.uiHeader();
      Init.niceSelect();
      Init.slick();
      Init.countdownInit(".countdown", "2026/04/24");
      Init.wow();
      Init.formValidation();
      Init.contactForm();
    },

    w: function (e) {
      this._window.on("load", Init.l).on("scroll", Init.res);
    },
   
    // =================
    // Bak to top
    // =================
    BackToTop: function () {
      let scrollTop = $(".scroll-top path");
      if (scrollTop.length) {
        var e = document.querySelector(".scroll-top path"),
          t = e.getTotalLength();
        (e.style.transition = e.style.WebkitTransition = "none"),
          (e.style.strokeDasharray = t + " " + t),
          (e.style.strokeDashoffset = t),
          e.getBoundingClientRect(),
          (e.style.transition = e.style.WebkitTransition =
            "stroke-dashoffset 10ms linear");
        var o = function () {
          var o = $(window).scrollTop(),
            r = $(document).height() - $(window).height(),
            i = t - (o * t) / r;
          e.style.strokeDashoffset = i;
        };
        o(), $(window).scroll(o);
        var back = $(".scroll-top"),
          body = $("body, html");
        $(window).on("scroll", function () {
          if ($(window).scrollTop() > $(window).height()) {
            back.addClass("scroll-top--active");
          } else {
            back.removeClass("scroll-top--active");
          }
        });
      }
    },
    // =======================
    //  Button Style
    // =======================
    cusBtn: function () {
      $(".cus-btn")
        .on("mouseenter", function (e) {
          var parentOffset = $(this).offset(),
            relX = e.pageX - parentOffset.left,
            relY = e.pageY - parentOffset.top;
          $(this).find("span").css({ top: relY, left: relX });
        })
        .on("mouseout", function (e) {
          var parentOffset = $(this).offset(),
            relX = e.pageX - parentOffset.left,
            relY = e.pageY - parentOffset.top;
          $(this).find("span").css({ top: relY, left: relX });
        });
    },
   
    // =======================
    //  UI Header
    // =======================
    uiHeader: function () {
      function dynamicCurrentMenuClass(selector) {
        let FileName = window.location.href.split("/").reverse()[0];

        selector.find("li").each(function () {
          let anchor = $(this).find("a");
          if ($(anchor).attr("href") == FileName) {
            $(this).addClass("current");
          }
        });
        selector.children("li").each(function () {
          if ($(this).find(".current").length) {
            $(this).addClass("current");
          }
        });
        if ("" == FileName) {
          selector.find("li").eq(0).addClass("current");
        }
      }

      if ($(".main-menu__list").length) {
        let mainNavUL = $(".main-menu__list");
        dynamicCurrentMenuClass(mainNavUL);
      }

      if ($(".main-menu__nav").length && $(".mobile-nav__container").length) {
        let navContent = document.querySelector(".main-menu__nav").innerHTML;
        let mobileNavContainer = document.querySelector(".mobile-nav__container");
        mobileNavContainer.innerHTML = navContent;
      }
      if ($(".sticky-header__content").length) {
        let navContent = document.querySelector(".main-menu").innerHTML;
        let mobileNavContainer = document.querySelector(".sticky-header__content");
        mobileNavContainer.innerHTML = navContent;
      }

      if ($(".mobile-nav__container .main-menu__list").length) {
        let dropdownAnchor = $(
          ".mobile-nav__container .main-menu__list .dropdown > a"
        );
        dropdownAnchor.each(function () {
          let self = $(this);
          let toggleBtn = document.createElement("BUTTON");
          toggleBtn.setAttribute("aria-label", "dropdown toggler");
          toggleBtn.innerHTML = "<i class='fa fa-angle-down'></i>";
          self.append(function () {
            return toggleBtn;
          });
          self.find("button").on("click", function (e) {
            e.preventDefault();
            let self = $(this);
            self.toggleClass("expanded");
            self.parent().toggleClass("expanded");
            self.parent().parent().children("ul").slideToggle();
          });
        });
      }

      if ($(".mobile-nav__toggler").length) {
        $(".mobile-nav__toggler").on("click", function (e) {
          e.preventDefault();
          $(".mobile-nav__wrapper").toggleClass("expanded");
          $("body").toggleClass("locked");
        });
      }

      $(window).on("scroll", function () {
        if ($(".stricked-menu").length) {
          var headerScrollPos = 130;
          var stricky = $(".stricked-menu");
          if ($(window).scrollTop() > headerScrollPos) {
            stricky.addClass("stricky-fixed");
          } else if ($(this).scrollTop() <= headerScrollPos) {
            stricky.removeClass("stricky-fixed");
          }
        }
      });
    },

    // =======================
    //  Nice Select
    // =======================
    niceSelect: function () {
      if ($(".has-nice-select").length) {
        $('.has-nice-select, .contact-form select').niceSelect();
      }
    },

    // =======================
    //  Slick Slider
    // =======================
    slick: function () {
      if ($(".team-slider").length) {
        $('.team-slider').slick({
          slidesToShow: 4,
          slidesToScroll: 1,
          infinite: true,
          autoplay: false,
          dots: false,
          arrows: true,
          lazyLoad: 'progressive',
          speed: 800,
          responsive: [
            {
              breakpoint: 1399,
              settings: {
                slidesToShow: 3,
              },
            },
            {
              breakpoint: 991,
              settings: {
                slidesToShow: 2,
              },
            },
            {
              breakpoint: 490,
              settings: {
                slidesToShow: 1,
              },
            },
          ],
        });
      }
      if ($(".blogs-slider").length) {
        $('.blogs-slider').slick({
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
          autoplay: false,
          dots: false,
          arrows: true,
          lazyLoad: 'progressive',
          speed: 800,
          responsive: [
            {
              breakpoint: 1399,
              settings: {
                slidesToShow: 3,
              },
            },
            {
              breakpoint: 1199,
              settings: {
                slidesToShow: 2,
              },
            },
            {
              breakpoint: 575,
              settings: {
                slidesToShow: 1,
              },
            },
          ],
        });
      }
      if ($(".testimonial-slick-slider").length) {
        $('.testimonial-slick-slider').slick({
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          autoplay: false,
          dots: false,
          arrows: true,
          lazyLoad: 'progressive',
          speed: 800,
          responsive: [
            {
              breakpoint: 991,
              settings: {
                slidesToShow: 1,
              },
            },
          ],
        });
      }
      if ($(".preview-slider").length) {
        $(".preview-slider").slick({
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false,
          fade: true,
          asNavFor: ".preview-slider-nav",
        });
      }
      if ($(".preview-slider-nav").length) {
        $(".preview-slider-nav").slick({
          slidesToShow: 4,
          slidesToScroll: 1,
          asNavFor: ".preview-slider",
          dots: false,
          arrows: true,
          centerMode: false,
          focusOnSelect: true,
          vertical: true,
          verticalSwiping: true,
          responsive: [
            {
              breakpoint: 1399,
              settings: {
                slidesToShow: 3,
              },
            },
            {
              breakpoint: 990,
              settings: {
                slidesToShow: 3,
              },
            },
            {
              breakpoint: 768,
              settings: {
                slidesToShow: 3,
              },
            },
            {
              breakpoint: 575,
              settings: {
                vertical: false,
                slidesToShow: 2,
                variableWidth: true,
                verticalSwiping: false,
              },
            },
          ],
        });
      }
      $(".prev-btn").click(function () {
        var $this = $(this).attr("data-slide");
        $('.' + $this).slick("slickPrev");
      });

      $(".next-btn").click(function () {
        var $this = $(this).attr("data-slide");
        $('.' + $this).slick("slickNext");
      });
    },

    // =======================
    //  Coming Soon Countdown
    // =======================
    // countdownInit: function (countdownSelector, countdownTime) {
    //   var eventCounter = $(countdownSelector);
    //   if (eventCounter.length) {
    //     eventCounter.countdown(countdownTime, function (e) {
    //       $(this).html(
    //         e.strftime(
    //           '<li><h2>%D</h2><h6>Днів</h6></li>\
    //           <li><h2>%H</h2><h6>Годин</h6></li>\
    //           <li><h2>%M</h2><h6>Хвилин</h6></li>\
    //           <li><h2>%S</h2><h6>Секунд</h6></li>'
    //         )
    //       );
    //     });
    //   }
    // },

    // =======================
    //  Wow
    // =======================
    wow: function () {
      if ($(".wow").length) {
        var wow = new WOW({
          boxClass: "wow", // animated element css class (default is wow)
          animateClass: "animated", // animation css class (default is animated)
          mobile: true, // trigger animations on mobile devices (default is true)
          live: true, // act on asynchronously loaded content (default is true)
        });
        wow.init();
      }
    },


    // =======================
    // Form Validation
    // =======================
    formValidation: function () {
      if ($(".form-validation").length) {
        $(".form-validation").validate();
      }
    },

     // =======================
    //  Contact Form
    // =======================
    contactForm: function () {
      $(".contact-form").on("submit", function (e) {
        e.preventDefault();
        if ($(".contact-form")) {
          var _self = $(this);
          _self
            .closest("div")
            .find('button[type="submit"]')
            .attr("disabled", "disabled");
          var data = $(this).serialize();
          $.ajax({
            url: "./assets/mail/contact.php",
            type: "post",
            dataType: "json",
            data: data,
            success: function (data) {
              $(".contact-form").trigger("reset");
              _self.find('button[type="submit"]').removeAttr("disabled");
              if (data.success) {
                document.getElementById("message").innerHTML =
                  "<h5 class='color-primary'>Email Sent Successfully</h5>";
              } else {
                document.getElementById("message").innerHTML =
                  "<h5 class='text-danger'>There is an error</h5>";
              }
              $("#message").show("slow");
              $("#message").slideDown("slow");
              setTimeout(function () {
                $("#message").slideUp("hide");
                $("#message").hide("slow");
              }, 3000);
            },
          });
        } else {
          return false;
        }
      });
    },
  };

  Init.i();
})(window, document, jQuery);