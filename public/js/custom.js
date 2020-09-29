/**
 * Plugin extend
 */
;(function($){
	// oauthpopup inspired by DISQUS
	$.oauthpopup = function(options)
	{
		if (!options || !options.path) {
			throw new Error('options.path must not be empty');
		}
		options = $.extend({
			windowName: 'ConnectWithOAuth' // should not include space for IE
		, windowOptions: 'location=0,status=0,width=480,height=560'
		, callback: function(){ window.location.reload(); }
		}, options);

		var oauthWindow   = window.open(options.path, options.windowName, options.windowOptions);
		var oauthInterval = window.setInterval(function(){
			if (oauthWindow.closed) {
				window.clearInterval(oauthInterval);
				options.callback();
			}
		}, 1000);
	};

	//bind to element and pop oauth when clicked
	$.fn.oauthpopup = function(options) {
		$this = $(this);
		$this.click($.oauthpopup.bind(this, options));
	};
})(jQuery);

// run jquery plugin
$(function() {

	if($('#sidebar').length){
		var urlParent = ""; //default select

		$('#sidebar a').each(function() {
			var that = $(this);
			if (window.location.pathname.indexOf(that.attr('href')) > -1) {
				that.addClass('active');
				that.parents('ul').prev().addClass('collapsible-active');
				urlParent = that.parents('[data-menu-parent]').attr('data-menu-parent');
				$('#menu a[href="'+urlParent+'"]').addClass('active');
				return true;
			}
		});
		
		$('[data-menu-parent]').each(function() {
			var value = $(this).attr('data-menu-parent');
			if(value == urlParent){
				$(this).fadeIn(400);
			}
		});

		CORE.Collapsible('#sidebar .collapsible');
	}
	else{
		$('#menu a').each(function() {
			var pathname = window.location.pathname;
			var link = $(this).attr('href');
			if ( (link === '/' && link === pathname) || (link !== '/' && pathname.indexOf(link) !== -1) ) {
				$(this).addClass('active');
				return true;
			}
		});
	}

	$('.ui.dropdown').dropdown();
	$('.ui.checkbox').checkbox();
	$('.ui.radio.checkbox').checkbox();
	$('.ui.embed').embed();
});