<?

class Action{
	
	var $view;
	var $db;
	var $template = 'mainpage'; //the default template we are using
	var $vars = array(); //all the variables that will be passed in to any rendered views
	var $refer = array(); //populated after parseRefer() - varaibles from prev page 
	var $json = array(); //ususally used in conjunction with disableLayout() 
	var $download = ''; //raw data to be echoed out for downloading
	var $theme = THEME;
	
	var $scripts = array(); // any additional scripts we need to use;
	var $useLayout = true;
	
	function __construct($db){
		$this->db = $db;
	}
	
	function getView(){
		return $this->view;
	}
	
	function Render($html = ''){
		 
		if ( trim($html) && file_exists('view/'.($html).'.php') ){
			//if we pass in a different view, use it. all good 
		} else if (file_exists('view/'.($this->view).'.php')) {
			//if there is a file for the view we are looking at, use it
			$html = $this->view;
		} else {
			//default to to index
			$html = 'index';
		}
		
		//make mvc object variables available to the template
		
		foreach( $this->vars as $k=>$v){
			if (!is_object($v) ){
				$$k = $v;
			}
		}

		ob_start();
			include('view/'.$html.'.php' );
			$view = ob_get_contents();
		ob_end_clean();
		
		return $view;
	}
	
	function goBack(){
		//go back to the last page (HTTP REFERER);
		$refer = $_SERVER['HTTP_REFERER'];
		header('Location:'.$refer);
		die();
	}
	
	function parseRefer(){
		//parse the varaibles from the referrer and make available.
		$refer = $_SERVER['HTTP_REFERER'];
		
		$explode = explode('/', $refer);
		$count = count($explode)-1;
		
		for($i = $count; $i > 1; $i-=2){
			$k = $explode[$i-1];
			$v = $explode[$i];
			$this->refer[$k] = $v;
		}
	}
	
	function Forward($controller){
		$this->$controller();
	}
	
	//disable the rendering , useful for ajax
	function disableLayout(){
		$this->useLayout = false;
	}
	
	//add an additional script
	function addscript($script){
		if (!in_array($script, $this->scripts ) ){
			array_push($this->scripts, $script);
		}
	}
	
	function Redirect($loc = ''){
		header('Location: '.HTTPROOT.$loc);
		die();
		return false;
	}
}

?>