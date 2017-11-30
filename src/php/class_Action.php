<?php

class Action
{
	var $view;
	public $db;
	var $template = 'mainpage'; //the default template we are using
	var $vars = []; //all the variables that will be passed in to any rendered views
	var $refer = []; //populated after parseRefer() - varaibles from prev page 
	var $json = []; //ususally used in conjunction with disableLayout() 
	var $download = ''; //raw data to be echoed out for downloading
	var $theme = THEME;
	public $outputRSS; // final output from bootstrap to output

	var $scripts = []; // any additional scripts we need to use;
	var $useLayout = true;

	private $isAjax = false;

	public $helper;

	function __construct($db)
	{
		$this->db = $db;
	}

	function getView()
	{
		return $this->view;
	}

	/**
	 * 
	 *	@param string file in src/view
	 */
	public function Render($html = '')
	{
		
		if (trim($html) && file_exists(PATH_ROOT.'/src/view/' . ($html) . '.php')) {
			//if we pass in a different view, use it. all good 
		} else if (file_exists(PATH_ROOT.'/src/view/' . ($this->view) . '.php')) {
			//if there is a file for the view we are looking at, use it
			$html = $this->view;
		} else {
			//default to to index
			$html = 'index';
		}
		
		

		//make mvc object variables available to the template

		foreach ($this->vars as $k => $v) {
			if (!is_object($v)) {
				$ $k = $v;
			}
		}

		ob_start();
		include PATH_ROOT.'/src/view/' . $html . '.php';
		$view = ob_get_contents();
		ob_end_clean();

		return $view;
	}

	public function isAjax($bool = '')
	{
		if ($bool == true) {
			$this->isAjax = true;
		} else if ($bool === false) {
			$this->isAjax = false;
		} else {
			return $this->isAjax;
		}
	}
	
	//
	public function parseURL($url)
	{
		$explode = explode('/', $url);

		$pos = 0;

		if (isset($explode[$pos]) && file_exists('controllers/' . $explode[$pos] . '.php')) {
			$controller = $explode[$pos];
			$pos++;
		} else if (isset($explode[$pos]) && is_dir('controllers/' . $explode[$pos])) {
			$dir = $explode[$pos] . '/';

			if (isset($explode[$pos + 1]) && file_exists('controllers/' . $dir . $explode[$pos + 1] . '.php')) {
				$controller = $dir . $explode[$pos + 1];
				$pos += 2;
			} else {
				$controller = $dir . 'index';
				$pos++;
			}
		} else {
			$controller = 'index';
		}

		include_once('controllers/' . $controller . '.php');

		$className = $controller . 'MVC';
		$mvc = new $className($this->db);

		if (isset($explode[$pos]) && method_exists($model, $explode[$pos] . 'Action')) {
			$model = $explode[$pos] . 'Action';
			$pos++;
		} else {
			$model = 'indexAction';
		}
		
		
		//d($controller,'controller' );
		//d($model ,'model' );

		$mvc->vars = $this->vars;

		$mvc->init();
		$mvc->$model();

		$this->vars = $mvc->vars;
	}

	function parseRefer()
	{
		//parse the varaibles from the referrer and make available.
		$refer = $_SERVER['HTTP_REFERER'];

		$explode = explode('/', $refer);
		$count = count($explode) - 1;

		for ($i = $count; $i > 1; $i -= 2) {
			$k = $explode[$i - 1];
			$v = $explode[$i];
			$this->refer[$k] = $v;
		}
	}

	function Forward($controller)
	{
		$this->$controller();
	}
	
	//disable the rendering , useful for ajax
	function disableLayout()
	{
		$this->useLayout = false;
	}
	
	//add an additional script
	function addscript($script)
	{
		if (!in_array($script, $this->scripts)) {
			array_push($this->scripts, $script);
		}
	}

	function Redirect($loc = '')
	{
		header('Location: ' . HTTPROOT . $loc);
		die();
		return false;
	}
}