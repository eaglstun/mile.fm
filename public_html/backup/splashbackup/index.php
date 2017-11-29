<?
session_start();

ini_set('include_path', './' );
ini_set('magic_quotes_gpc', 'off' );
ini_set('max_execution_time', 60);
ini_set('memory_limit', '128M' );
ini_set('upload_max_filesize', '32M' );

$starttime = microtime();

//sanitize
foreach( $_POST as $k=>$v){
	$_POST[$k] = addslashes($v);
}

ob_start();
	
	include 'config.php';
	
	//include all the classes we may need.  the controller will extend the generic action class.
	include 'php/class_Action.php';
	include 'php/class_DB.php';
	
	include 'php/functions_debug.php';
	include 'php/functions_filesystem.php';
	include 'php/functions_html.php';
	
	$path = $_GET['cPath'];
	$explode = explode('/', $path);
	
	
	//pos will keep track of where in the url we are in, for parsing m's and v's and c's
	$pos = 0;
	//the controller is the first part of the url.  default to index if the controller is not found
	if(isset($explode[$pos]) && file_exists('controllers/'.$explode[$pos].'.php') ){
		$controller = $explode[$pos];
		$pos++;
	} else {
		$controller = 'index';
	}
	
	
	
	//instantiate the mvc - class Action
	include('controllers/'.$controller.'.php' );
	$db = new DB();
	$action = new mvc($db);

	//set up the model - the function inside of the controller.php that is called
	//start refers to the posiition in the url where we start parsing GET variables
	$model = isset($explode[$pos]) ? $explode[$pos].'Action' : '';
	
	
	if (isset($explode[$pos]) && method_exists($action, $model) ){
		$pos++;
	} else {
		$model = 'indexAction';
	}
	
	dbug($pos, '$pos' );
	dbug($model, '$model' );
	dbug($explode, '$explode' );
	
	//parse the remaining varaibles and make available to REQUEST
	$count = count($explode);
	
	for($i = $pos; $i <= $count; $i += 2){
		
		if (isset($explode[$i+1]) ){
		
			$k = $explode[$i];
			$v = @$explode[$i+1];
		
			$_REQUEST[$k] = $v;
		} else if(!isset($explode[$i+1]) && isset($explode[$i])) {
			$action->helper = $explode[$i];
		}
	}
	
	//and do the logic
	if (method_exists($action, 'init') ){
		$action->init();
	}
	
	$action->$model();

	//set up the view - which html to render inside of the template

	dbug ($action->helper, '$helper' );
	dbug ($model, '$model' );


	if (DEBUG){
		$debug = '<h4 style="clear:both">debug: </h4>'.ob_get_contents();
	} else {
		$debug = '';
	}
	
ob_end_clean();

if (isset($_SESSION['userid']) ){
	//logged in 
	$menuHtml = $action->Render('menu1' );
} else {
	//not logged in
	$menuHtml = '';
	//$menuHtml = $action->Render('menu1' );
}

//set the page title
if (!isset($action->vars['pagetitle']) ){
	$pagetitle = '';
} else {
	$pagetitle = $action->vars['pagetitle'];
}


$viewHtml = $action->Render();

$template = $action->template;

//autoload any scripts related to this page
$scripts = '';

$view = $action->getView();

if (file_exists('js/'.$view.'.js') ){
	$scripts .= "<script src=\"js/$view.js\" type=\"text/javascript\"></script>\n";
}

foreach( $action->scripts as $k=>$v){
	$scripts .= "<script src=\"js/$v.js\" type=\"text/javascript\"></script>\n";	
}


$endtime = microtime();
$rendertime = $endtime-$starttime;
if($action->useLayout){
	include ('template/'.THEME.'/'.$template.'.htm' );
} else if($action->json){
	$json = json_encode($action->json);
	echo $json;
} else if ($action->download){
	echo $action->download;
}

?>