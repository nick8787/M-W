/*------------------------------------------------------------------
* Project:        Royal Love
* Author:         CN InfoTech
* URL:            https://themeforest.net/user/cn-infotech/portfolio
* Created:        01/01/2019
-------------------------------------------------------------------*/

(function ($) {
	'use strict';

	jQuery(document).ready(function ($) {

		// Video Init
		$(document).ready(function() {
		    if (!($("html").hasClass("mobile"))) {
		        $(".player").mb_YTPlayer();
		    }
		});

	});

})(jQuery);