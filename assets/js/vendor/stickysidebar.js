$(document).ready(function () {
  $(window).on("scroll resize", function () {
    var scrollTop = $(this).scrollTop();
    var sidebar = $(".sidebar");
    var container = $(".content");
    var topSpacing = 120;
    var bottomSpacing = 20;
    var isMobile = $(window).width() <= 940;

    if (!container.length || !sidebar.length) {
      console.error(
        "Error: Required elements (.sidebar or .content) not found."
      );
      return;
    }

    if (isMobile) {
      sidebar.css({
        position: "static",
      });
      return;
    }

    var containerOffsetTop = container.offset().top;
    var containerHeight = container.outerHeight();
    var sidebarHeight = sidebar.outerHeight();

    var maxScroll =
      containerOffsetTop + containerHeight - sidebarHeight - bottomSpacing;

    if (
      scrollTop >= containerOffsetTop - topSpacing &&
      scrollTop <= maxScroll
    ) {
      sidebar.css({
        position: "fixed",
        top: topSpacing,
      });
    } else if (scrollTop > maxScroll) {
      sidebar.css({
        position: "absolute",
        top: containerHeight - sidebarHeight - bottomSpacing + "px",
      });
    } else {
      sidebar.css({
        position: "static",
      });
    }
  });

  $(".menu li").eq(0).addClass("cur");
  $(".menu li").on("click", function () {
    $(this).addClass("cur").siblings().removeClass("cur");
    var index = $(this).attr("data-href");
    var targetElement = $(index);

    if (!targetElement.length) {
      console.error(`Error: Target element ${index} not found.`);
      return;
    }

    var elOffset = targetElement.offset().top;
    $("html, body").animate({ scrollTop: elOffset }, 800);
  });

  $(window).on("scroll", function () {
    var scrollTop = $(this).scrollTop();
    $(".item").each(function () {
      var elOffset = $(this).offset().top;

      if (scrollTop >= elOffset - 10) {
        var index = $(this).index();
        $(".menu li").eq(index).addClass("cur").siblings().removeClass("cur");
      }
    });
  });
});
