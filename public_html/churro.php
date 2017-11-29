<?

/* phpchurro */

session_start();

ini_set('include_path', './' );
ini_set('magic_quotes_gpc', 'off' );
ini_set('max_execution_time', 60);
ini_set('memory_limit', '128M' );
ini_set('upload_max_filesize', '32M' );
ini_set('error_reporting', E_ALL);

$starttime = microtime();

//sanitize
foreach( $_POST as $k=>$v){
	$_POST[$k] = addslashes($v);
}

//base settings
include 'config.php';

//include all the classes we may need.  the controller will extend the generic action class.
include 'php/class_Action.php';
include 'php/class_DB.php';

include 'php/functions_debug.php';
include 'php/functions_filesystem.php';
include 'php/functions_html.php';
  
//figure out how to route the url
$path = $_GET['cPath'];
$explode = explode('/', $path);

//pos will keep track of where in the url we are in, for parsing m's and v's and c's
$pos = 0;

//the controller is the first part of the url.  default to index if the controller is not found
if(isset($explode[$pos]) && file_exists('controllers/'.$explode[$pos].'.php') ){
	$controller = $explode[$pos];
	$pos++;
	
	$className = $controller.'MVC';
} else if(isset($explode[$pos]) && is_dir('controllers/'.$explode[$pos]) ){
	$dir = $explode[$pos];
	
	if(isset($explode[$pos+1]) ){
		$testController = 'controllers/'.$dir.'/'.$explode[$pos+1].'.php';
	} else {
		$testController = 'controllers/'.$dir.'/'.$explode[$pos].'.php';
	}
	
	if(isset($explode[$pos+1]) && file_exists($testController) ){
		$controller = $dir.'/'.$explode[$pos+1];
		$className = $explode[$pos+1].'MVC';
		
		$pos+=2;
		
		
	} else {
		$controller = $dir.'/'.'index';
		$pos++;
		
		$className = 'indexMVC';
	}
} else {
	$className = 'indexMVC';
	$controller = 'index';
}

//instantiate the mvc - class Action
include('controllers/'.$controller.'.php' );
$db = new DB();

$action = new $className($db);

if( isset($_SERVER['HTTP_X_REQUESTED_WITH']) ){
	$action->isAjax( true );
}

//set up the model - the function inside of the controller.php that is called
//start refers to the posiition in the url where we start parsing GET variables

if (isset($explode[$pos]) ){
	$name = camelCase($explode[$pos]);
} else {
	$name = 'index';
};

if (method_exists($action, $name.'Action') ){
	$model = $name.'Action';
	$pos++;
} else {
	$model = 'indexAction';
}

$action->helper = isset($explode[$pos]) ? $explode[$pos] : '';

//parse the remaining varaibles and make available to REQUEST
$count = count($explode);
for($i = $pos; $i < $count; $i += 2){
	
	if (isset($explode[$i+1]) ){
	
		$k = $explode[$i];
		$v = @$explode[$i+1];

		$_REQUEST[$k] = $v;
	} else if(!isset($explode[$i+1]) && $i > 0) {
		$action->helper = $explode[$i];
	}
}

//and do the logic
if (method_exists($action, 'init') ){
	$action->init();
}

$action->$model();

$viewHtml = $action->Render();

$template = $action->template;

//autoload any scripts related to this page
$scripts = '';

$view = $action->getView();

if (file_exists('js/'.$view.'.js') ){
	$scripts .= "<script src=\"/js/$view.js\" type=\"text/javascript\"></script>\n";
}

foreach( $action->scripts as $k=>$v){
	$scripts .= "<script src=\"/js/$v.js\" type=\"text/javascript\"></script>\n";	
}

$endtime = microtime();

$rendertime = round( $endtime-$starttime, 4);

if($action->useLayout){
	include ('template/'.$action->theme.'/'.$template.'.phtml' );
} else if($action->json){
	$json = json_encode($action->json);
	
	$json = str_replace('\t', '', $json);
	$json = str_replace('\n', " ", $json);
	
	//echo count($action->json);
	
	if (count($action->json) < 2 && isset($action->json[0]) && $action->json[0] == ''){
		echo "[]";
	} else {
		echo $json;
	}
	
} else if($action->outputRSS){
	echo $action->outputRSS;
} else if ($action->download){
	echo $action->download;
}

?>