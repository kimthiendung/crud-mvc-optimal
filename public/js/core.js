var CORE = (function () {

	// locally scoped Object
	var my = {};
	
	my.Sidebar = function(id, classActive, idMenu){
		var menu = document.getElementById(idMenu) || document.getElementById("sidebar-menu");
		if(!menu){return false;}
	
		var sidebar = document.getElementById(id) || document.getElementById("sidebar");
		if(sidebar){
			return {
				active: classActive || "sidebar-active",
				menu: menu
			};
		}
		
		menu.style.display = "none";
		
		return false;
	}

	my.Responsive = function(sizeShow){
		var sb = my.Sidebar();
		if(!sb){
			return false;
		}
	
		var sizeForShowSidebar = sizeShow || 992
		
		if(window.innerWidth < sizeForShowSidebar){
			sb.menu.style.display = "initial";
			document.body.classList.remove(sb.active);
		}
		else{
			sb.menu.style.display = "none";
			document.body.classList.add(sb.active);
		}
	}

	my.BodyToggle= function(){
		var sb = my.Sidebar();
		if(!sb){
			return false;
		}
	
		var toggle = function () {
			if(document.body.classList.contains(sb.active)){
				document.body.classList.remove(sb.active);
			}
			else{
				document.body.classList.add(sb.active);
			}
			return false;
		}
	
		sb.menu.onclick = toggle;
	
		window.onresize = function(event) {
			my.Responsive();
		};
	}

	my.OverlayToggle = function(menuWrap, menu, on, off){
		var that = this;
		that.menuWrap = document.getElementById(menuWrap) || document.getElementById("menuWrap");
		that.menu = document.getElementById(menu) || document.getElementById("menu");
		that.on = document.querySelectorAll(on) || document.querySelectorAll(".menu-on");
		that.off = document.querySelectorAll(off) || document.querySelectorAll(".menu-off");
	
		if(!that.menuWrap || !that.menu || that.on.length <= 0 || that.off.length <= 0){
			return false;
		}
	
		var show = function () {
			document.querySelector("html").style.overflow = "hidden";
			that.menuWrap.classList.add('menu-active');
			that.menu.className = 'menu-overlay';
			return false;
		}
	
		var hide = function () {
			document.querySelector("html").style.overflow = "auto";
			that.menuWrap.classList.remove('menu-active');
			that.menu.className = 'menu-hor';
			return false;
		}
	
		for (var i = 0; i < that.on.length; i++) {
			that.on[i].onclick = show;
		}
		
		for (var i = 0; i < that.off.length; i++) {
			that.off[i].onclick = hide;
		}
	
		return that;
	}

	my.Collapsible = function(el) {
		this.el = document.querySelectorAll(el) || document.querySelectorAll(".collapsible");
	
		if(this.el.length <= 0){
			return false;
		}
	
		var collToogle = function () {
			var that = this;
			var nextEl = that.nextElementSibling;
			if(nextEl.classList.contains('hidden')){
				that.classList.add('collapsible-active');
				nextEl.classList.remove('hidden');
			}
			else{
				that.classList.remove('collapsible-active');
				nextEl.classList.add('hidden');
			}
			return false;
		}
	
		for (var i = 0; i < this.el.length; i++) {
			if(this.el[i].classList.contains('collapsible-active')){
				this.el[i].nextElementSibling.classList.remove('hidden');
			}
			else{
				this.el[i].nextElementSibling.classList.add('hidden');
			}
			this.el[i].style.cursor = "pointer";
			this.el[i].onclick = collToogle;
		};
	
		return this;
	
	}

	return my;
})();

window.onload = function () {
	//CORE run
	CORE.Responsive();
	CORE.BodyToggle();
	CORE.OverlayToggle("menu-main", "menu", ".menu-on" , ".menu-off");
}


/**
 * Function utils
 */

var UTILS = (function () {
	
	// locally scoped Object
	var my = {};
		
	my.parseInt = function (data){
		try{
			return JSON.parse(data, function(k, v) { 
				return (typeof v === "object" || isNaN(v)) ? v : parseInt(v, 10); 
			});
		}
		catch(err){
			return null;
		}
	}
	
	my.compareInput = function (input, input2) {
		if (input.value != input2.value) {
			input.setCustomValidity("Passwords Don't Match.");
		} else {
			// input is valid -- reset the error message
			input.setCustomValidity('');
		}
	};

	return my;
	
})();