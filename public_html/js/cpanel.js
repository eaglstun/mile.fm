//generic get log in text - called to hide and show divs
function menuShow(n){
	$j('#m'+n).slideDown('fast', function(){
		$j('#m'+n+'main').slideDown('fast' );
	});
	
	$j('#m'+n+' h5 div.btnMM').css({ backgroundPosition: 'center top' });
};

//a sub menu is selected 
function hliteSub(obj){
	l = $j(obj).parent();
	p = l.parent();
	
	p.children().each(function(){
		$j(this).children().removeClass('selected' );
	});
	
	
};

//toggles the cpanel button w the next node
function menuToggle(obj){
	
	//console.log(obj);
	
	togglee = $j(obj.parentNode).next();
	//console.log(togglee);
	
	togglee.slideToggle("normal", function(){
		h = (this.offsetHeight);
		if(h > 0){
			$j(obj).css({ backgroundPosition: 'center top' });
		} else {
			$j(obj).css({ backgroundPosition: 'center bottom' });
		};
	});
};

function closeCpanel(x){
	$j('#m'+x).slideUp();
};

//swich between panes on profile
function toggleProfile(which){

	//show all the tabs
	$j('ul.profileEdit li').each(function(){
		$j(this).css({ display:"inline"});
	});
	
	//hide the selected tab
	$j('#profileLink'+which).css({ display:"none"});
	
	
	//hide all content tabs
	$j('div.profileTab').each(function(){
		$j(this).css({ display:"none"});
	});
	
	//show the right profile tab
	$j('#profile'+which).css({ display:"block"});		

};

//send in user profile
function sendProfile(){
	query = prepForQuery(getFormVars('cp_prof'));
	
	$j.ajax({
		data: query,
		success: recProf,
		type: 'POST',
		url: 'profile/update'
	});
};

function recProf(json){
	eval ( 'response = ' + json);
	
	$j('#profileHTML').html(response.profile);
	
	toggleProfile(1);
};

//send in external info
function sendExt(){
	query = prepForQuery(getFormVars('cp_ext'));
	
	$j.ajax({
		url: 'profile/update-ext',
		type: 'POST',
		data: query,
		success: recExt
	});
	
	p = $j('#profileNewLink').get(0);
	p[p.selectedIndex].setAttribute('username', $j('#extLink').val());
	
};

function recExt(json){
	eval ( 'response = ' + json);
	$j('#userExternal').html(response.links);
};

//for changing values for exernal sites
function updateExt(){
	s = $j('#profileNewLink').get(0);
	
	v = s.selectedIndex;
	
	url = s[v].getAttribute('url' );
	
	if(!url) {
		$j('#extLink').val('' );
		$j('#xlinklabel').html('&nbsp;' );
		return;
	};
	
	b = url.substr(0, url.indexOf('%') );
	len = (url.indexOf('%' , url.indexOf('%') + 1 ) - 2) - url.indexOf('%') + 1;
	
	u = url.substr(url.indexOf('%') + 1, len);
	v = s[v].getAttribute(u);
	
	if (v == 'null'){
	
 	} else {
 		$j('#extLink').val(v);
 	};
 	
	$j('#xlinklabel').html(b);
	
};