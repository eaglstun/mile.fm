//step one of retrieving password
function forgot1(){
	$j('#passwordAssist').slideDown();
};

//step two of retreiving password
function doRetrieve(){
	$j('forgetResult').html('Please Wait... <img src="static/loading.gif"/>').slideDown();
	
	var params = prepForQuery(getFormVars('forgot'));
	
	$j.ajax({
		url: "user/forgot",
		type: 'post',
		data: params,
		success: returnForgot
	});
}

function returnForgot(json){
	eval( 'result = ' + json);
	
	if(result.success == true){
		$j('#emailforg').val('Check your email' );
	};
	
	$j('#forgetResult').html(result.message);
}

function dologin(){
	
	$j('#loginResult').html('Please Wait... <img src="static/loading.gif"/>' );
	$j('#loginResult').slideDown();
	
	var params = prepForQuery(getFormVars('login'));
	
	$j.ajax({
		url: "user/login",
		type: 'post',
		data: params,
		success: returnLogin
	});
	
}

function returnLogin(json){
	eval('var result = '+(json));
	
	if (result.success == true){
		document.location = "gamma/";
	} else {
		$j('#loginResult').html('Sorry - check your username and password' );
	}
}

function emailRequest(){

	var email = $j('#email').val();
	
	if (!emailValidate(email)){
		$j('#requestResult').html('Your email does not appear valid.  Please check and try again.').slideDown();
		return false;
	};
	
	var params = prepForQuery(getFormVars('request'));
	
	$j.ajax({
		url: "user/request",
		type: 'post',
		data: params,
		success: returnRequest
	});
};

function returnRequest(json){
	eval('var result = '+json);
	$j('#requestResult').html(result.msg).slideDown();
};

function doSelect(x){
	var txt = x.value;
	if (txt=="username" || txt=="password" || txt=="Enter your email address" || txt=="Your email address"){
		x.value="";
	};
};