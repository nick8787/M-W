var MyScroll = "";
(function (window, document, $, undefined) {
  "use strict";
  var isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Nokia|Opera Mini/i.test(
      navigator.userAgent
    )
      ? !0
      : !1;
  var Scrollbar = window.Scrollbar;
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
      Init.preloader();
      Init.header();
      Init.slick();
      Init.achivementCountdown();
      Init.wow();
      Init.timepicker();
      Init.formValidation();
      Init.contactForm();
      Init.checkBoxes();
      Init.dropdown();
    },

    BackToTop: function () {
      var scrollToTopBtn = document.querySelector(".scrollToTopBtn");
      var rootElement = document.documentElement;
      function handleScroll() {
        var scrollTotal = rootElement.scrollHeight - rootElement.clientHeight;
        if (rootElement.scrollTop / scrollTotal > 0.05) {
          scrollToTopBtn.classList.add("showBtn");
        } else {
          scrollToTopBtn.classList.remove("showBtn");
        }
      }
      function scrollToTop() {
        rootElement.scrollTo({ top: 0, behavior: "smooth" });
      }
      scrollToTopBtn.addEventListener("click", scrollToTop);
      document.addEventListener("scroll", handleScroll);
    },
    preloader: function () {
      setTimeout(function () {
        $("#preloader").fadeOut("slow");
      }, 2800);
    },

    w: function (e) {
      if (isMobile) {
        $("body").addClass("is-mobile");
      }
    },

    header: function () {
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
        let mobileNavContainer = document.querySelector(
          ".mobile-nav__container"
        );
        mobileNavContainer.innerHTML = navContent;
      }
      if ($(".sticky-header__content").length) {
        let navContent = document.querySelector(".main-menu").innerHTML;
        let mobileNavContainer = document.querySelector(
          ".sticky-header__content"
        );
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

      $("#menu-main-menu").append('<div id="menu-slider"></div>');

      var current = $(".current-menu-item").text();
      if (current != "") {
        var left = $(".current-menu-item").position().left;
        var width = $(".current-menu-item").width();
        $("#menu-slider").css({ left: left, width: width });
      } else {
        var left = -4000;
        var width = 0;
        $("#menu-slider").css({ left: left, width: width });
      }

      $(".main-menu__nav #menu-main-menu > li").hover(
        function () {
          var t = $(this);
          var left = $(this).position().left;
          var width = $(this).width();
          $(this).children("a").css("color", "white");

          $("#menu-slider")
            .stop()
            .animate(
              {
                left: left,
                width: width,
              },
              400,
              "swing",
              function () {
                t.children(".dropdown").slideDown("");
              }
            );
        },
        function () {
          if (current != "") {
            var left = $(".current-menu-item").position().left;
            var width = $(".current-menu-item").width();
          } else {
            var left = 50;
            var width = 0;
          }

          $(this).children(".dropdown").slideUp("");
          $(this).children("a").css("color", "black");

          $("#menu-slider").stop().animate({
            left: left,
            width: width,
          });
        }
      );
    },

    slick: function () {
      // Function to apply the slider effect to sticky header menu
      function applyStickyMenuSlider() {
          const menuSelector = ".sticky-header__content #menu-main-menu";
          
          if (!$(menuSelector).length) return;
  
          // Add slider div if not already present
          if (!$(menuSelector).find('.sticky-menu-slider').length) {
              $(menuSelector).append('<div class="sticky-menu-slider"></div>');
          }
  
          // Get current active menu item
          const currentItem = $(menuSelector).find('.current-menu-item, .current');
          let left = -4000;
          let width = 0;
  
          if (currentItem.length) {
              left = currentItem.position().left;
              width = currentItem.width();
          }
  
          // Initialize slider position
          $(menuSelector + ' .sticky-menu-slider').css({ left, width });
  
          // Hover effect for menu items
          $(menuSelector + ' > li').hover(
              function () {
                  const $this = $(this);
                  left = $this.position().left;
                  width = $this.width();
  
                  $this.children("a").css("color", "white");
                  $(menuSelector + ' .sticky-menu-slider')
                      .stop()
                      .animate({ left, width }, 400, "swing");
              },
              function () {
                  const $this = $(this);
                  $this.children("a").css("color", "black");
  
                  // Reset to current item position
                  if (currentItem.length) {
                      left = currentItem.position().left;
                      width = currentItem.width();
                  } else {
                      left = -4000;
                      width = 0;
                  }
  
                  $(menuSelector + ' .sticky-menu-slider')
                      .stop()
                      .animate({ left, width }, 400);
              }
          );
      }
  
      // Only apply to desktop/laptop (window width > 992px)
      function handleStickySlider() {
          if ($(window).width() > 992) {
              if ($(".stricked-menu").hasClass("stricky-fixed")) {
                  applyStickyMenuSlider();
              }
          }
      }
  
      // On scroll, check if sticky header is active
      $(window).on("scroll", function () {
          if ($(".stricked-menu").length) {
              const headerScrollPos = 130;
              const $stricky = $(".stricked-menu");
  
              if ($(window).scrollTop() > headerScrollPos) {
                  $stricky.addClass("stricky-fixed");
                  handleStickySlider();
              } else {
                  $stricky.removeClass("stricky-fixed");
              }
          }
      });
  
      // Also check on resize
      $(window).on("resize", function() {
          handleStickySlider();
      });
  
      // Initialize on load
      handleStickySlider();
      if ($(".brand-slider").length) {
        $(".brand-slider").slick({
          autoplay: !0,
          autoplaySpeed: 0,
          speed: 10000,
          arrows: !1,
          swipe: !0,
          slidesToShow: 6,
          cssEase: "linear",
          pauseOnFocus: !1,
          pauseOnHover: !1,
          responsive: [
            { breakpoint: 1499, settings: { slidesToShow: 4 } },
            { breakpoint: 999, settings: { slidesToShow: 3 } },
            { breakpoint: 490, settings: { slidesToShow: 2 } },
          ],
        });
      }
      if ($(".testimonial-slider").length) {
        $(".testimonial-slider").slick({
          slidesToShow: 2,
          slidesToScroll: 1,
          autoplay: true,
          autoplaySpeed: 3000,
          speed: 900,
          infinite: !0,
          autoplay: true,
          dots: false,
          draggable: !0,
          arrows: !1,
          lazyLoad: "progressive",
          responsive: [{ breakpoint: 1025, settings: { slidesToShow: 1 } }],
        });
      }
      $(".btn-prev").click(function () {
        var $this = $(this).attr("data-slide");
        $("." + $this).slick("slickPrev");
      });
      $(".btn-next").click(function () {
        var $this = $(this).attr("data-slide");
        $("." + $this).slick("slickNext");
      });
    },
    wow: function () {
      if ($(".wow").length) {
        var wow = new WOW({
          boxClass: "wow",
          animateClass: "animated",
          mobile: !0,
          live: !0,
        });
        wow.init();
      }
    },

    timepicker: function () {
      $("#numberInput").on("input", function () {
        $(this).val(
          $(this)
            .val()
            .replace(/[^0-9]/g, "")
        );
      });
    },

    achivementCountdown: function () {
      var section = $(".counter-section");
      var hasEntered = false;

      if (section.length === 0) return;

      var initAnimate =
        $(window).scrollTop() + $(window).height() >= section.offset().top;
      if (initAnimate && !hasEntered) {
        hasEntered = true;
        this.counterActivate();
      }

      $(window).on(
        "scroll",
        function () {
          var shouldAnimate =
            $(window).scrollTop() + $(window).height() >= section.offset().top;

          if (shouldAnimate && !hasEntered) {
            hasEntered = true;
            this.counterActivate();
          }
        }.bind(this)
      );
    },

    counterActivate: function () {
      $(".counter-count .count").each(function () {
        var $this = $(this);
        $this.prop("Counter", 0).animate(
          {
            Counter: $this.text(),
          },
          {
            duration: 3000,
            easing: "swing",
            step: function (now) {
              $this.text(Math.ceil(now));
            },
          }
        );
      });
    },
    checkBoxes: function () {
      $(".sub-checkboxes").hide();
      $(".arrow-block").click(function () {
        var subCheckboxes = $(this).next(".sub-checkboxes");
        var chevronIcon = $(this).find("i");
        subCheckboxes.slideToggle("fast");
        chevronIcon.toggleClass("fa-chevron-down fa-chevron-up");
      });
      $(".check-block, .sub-check-box").click(function (event) {
        event.stopPropagation();
      });

      if ($(".customer-container").length) {
        $(".signin-button").click(function () {
          $(".sign-form").slideToggle();
        });
      }
      $(document).ready(function () {
        $(".custom-price").on("click", function () {
          const popup = $(".popup");
          const customPrice = $(".custom-price");

          if (popup.hasClass("show")) {
            popup.removeClass("show");
            setTimeout(() => popup.hide(), 500); // Ensure popup is hidden after animation
            customPrice.removeClass("active"); // Remove the active class to reset font size
          } else {
            popup.show();
            setTimeout(() => popup.addClass("show"), 10); // Add class to trigger animation
            customPrice.addClass("active"); // Add the active class to increase font size
          }
        });
      });
    },
    dropdown: function () {
      $(document).ready(function () {
        $(".wrapper-dropdown").each(function () {
          let $dropdown = $(this);
          let $arrow = $dropdown.find("svg");
          let $options = $dropdown.find(".topbar-dropdown");
          let $display = $dropdown.find(".selected-display");

          $dropdown.on("click", function (event) {
            event.stopPropagation();
            $(".wrapper-dropdown").not($dropdown).removeClass("active");
            $(".wrapper-dropdown svg").not($arrow).removeClass("rotated");

            $dropdown.toggleClass("active");
            $arrow.toggleClass("rotated");
          });

          $options.find("li").on("click", function (event) {
            event.stopPropagation();
            $display.text($(this).text());
            closeAllDropdowns();
          });
        });

        $(document).on("click", function () {
          closeAllDropdowns();
        });

        function closeAllDropdowns() {
          $(".wrapper-dropdown").removeClass("active");
          $(".wrapper-dropdown svg").removeClass("rotated");
        }
      });

      $(document).ready(function () {
        $(".card-icon").on("click", function (e) {
          e.stopPropagation();

          let menu = $(this).find(".sm-menu");
          $(".sm-menu").not(menu).removeClass("active");
          menu.toggleClass("active");
        });

        $(document).on("click", function () {
          $(".sm-menu").removeClass("active");
        });
        $(".sm-menu").on("click", function (e) {
          e.stopPropagation();
        });
      });
    },
    formValidation: function () {
      if ($(".contact-form").length) {
        $(".contact-form").validate();
      }
      if ($(".login-form").length) {
        $(".login-form").validate();
      }
    },
    contactForm: function () {
      $(".contact-form").on("submit", function (e) {
        e.preventDefault();
        if ($(".contact-form").valid()) {
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
                  "<h5 class='color-primary'>There is an error</h5>";
              }
              $("#messages").show("slow");
              $("#messages").slideDown("slow");
              setTimeout(function () {
                $("#messages").slideUp("hide");
                $("#messages").hide("slow");
              }, 4000);
            },
          });
        } else {
          return !1;
        }
      });
    },
  };
  Init.i();
})(window, document, jQuery);
