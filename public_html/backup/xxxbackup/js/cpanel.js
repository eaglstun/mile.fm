//switch action/apperance of menu button
function mButtonToggle(object, whattoshrink, speed, bound){
	
	if (object.action == "maximize"){
		object.action = "minimize";
		object.style.backgroundPosition = "center top";
		new Grow(whattoshrink, '', speed, bound);
	} else {
		object.action = "maximize";
		object.style.backgroundPosition = "center bottom";
		new Shrink(whattoshrink, '', speed);
	};
};

//toggles the cpanel button w the next node
function menuToggle(obj){

	//togglee = obj.parentNode.nextSibling;
	togglee = getNext(obj.parentNode);
	//togglee = $('cpanelContent' );
	
	h = togglee.offsetHeight;
	dbug(h, 'h' );
	
	if(h > 0){
		obj.style.backgroundPosition = "center bottom";
		new Shrink(togglee);
	} else {
		obj.style.backgroundPosition = "center top";
		new Grow(togglee);
	};
};

//swich between panes on profile
function toggleProfile(which){
	for(i = 1; i < 5; i++){
		$('profile'+i).style.display='none';
		$('profileLink'+i).style.display='inline';
	};
	
	$('profile'+which).style.display='block';
	$('profileLink'+which).style.display='none';
	
	unDragElements('profile'+which);
	
	new sizeItem('m2' );
};

//send in user profile
function sendProfile(){
	query = prepForQuery(getFormVars('cp_prof'));
	
	ext = new XHConn();
	ext.connect('user/updateProf', "POST", query, recProf);
};

function recProf(json){
	eval ( 'response = ' + json.responseText);
	
	$('profileHTML').innerHTML = response.profile;
	
	toggleProfile(1);
};

//send in external info
function sendExt(){
	query = prepForQuery(getFormVars('cp_ext'));
	
	ext = new XHConn();
	ext.connect('user/updateExt', "POST", query, recExt);
	
	p = $('profileNewLink' );
	p[p.selectedIndex].setAttribute('username', $('extLink').value);
};

function recExt(json){
	eval ( 'response = ' + json.responseText);
	$('userExternal').innerHTML = response.links;
};

//for changing values for exernal sites
function updateExt(){
	s = $('profileNewLink' );
	
	v = s.selectedIndex;
	console.log(v);
	
	url = s[v].getAttribute('url' );
	
	if(!url) {
		$('extLink').value = '';
		$('xlinklabel').innerHTML = '';
		return;
	};
	
	b = url.substr(0, url.indexOf('%') );
	len = (url.indexOf('%' , url.indexOf('%') + 1 ) - 2) - url.indexOf('%') + 1;
	
	u = url.substr(url.indexOf('%') + 1, len);
	v = s[v].getAttribute(u);
	
	if (v == 'null'){
	
 	} else {
 		$('extLink').value = v;
 	};
 	
	$('xlinklabel').innerHTML = (b);
	
};