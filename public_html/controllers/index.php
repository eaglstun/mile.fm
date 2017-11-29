<?php

class indexMVC extends Action
{
	public function init()
	{
		$br = new Browser();

		if ($br->getBrowser() == 'MSIE' && intval($br->getVersion()) < 7) {
			$this->Redirect('bad/browser/ie' . intval($br['version']));
		}
		
		//tiny link
		if (trim($this->helper)) {
			$this->redir();
			return;
		}

		if (!isset($_SESSION['x'])) {
			$_SESSION['x'] = (864 * 2640);
			$_SESSION['y'] = (864 * 2640);
		}
	}

	public function indexAction()
	{

		$this->vars['cpanel'] = $this->Render('cpanel');

		$sql = "SELECT * FROM fm
				ORDER BY RAND() 
				LIMIT 1";

		$result = $this->db->exec($sql);
		$fm = $result[0]['fm'];

		$this->vars['fm'] = $fm;

		//tracking
		if ( (isset($_SESSION['userauth']) && $_SESSION['userauth'] & 64) == false) {
			$userip = $_SERVER['REMOTE_ADDR'];
			$userstamp = time();
			$userpage = $_SERVER['REQUEST_URI'];
			$userfrom = isset($_SERVER['HTTP_REFERER']) ? str_replace(HTTPROOT, '/', $_SERVER['HTTP_REFERER']) : '';
			$sql = "INSERT INTO tracking 
					(`ip`, `stamp`, `page`, `from`) 
					VALUES 
					( '$userip', '$userstamp', '$userpage', '$userfrom' )";
			$this->db->execute($sql);
		}
		
		//build initial mile load
		if (!isset($this->vars['mileContent'])) {

			include('php/class_Mile.php');

			$Mile = new Mile($this->db);
			
			//d(($_SESSION['x'] / 864));
			$x = intval($_SESSION['x'] / 864);

			$mileArray = array(
				$x => '2639, 2640, 2641, 2642', ($x + 1) => '2639, 2640, 2641, 2642'
			);

			$Mile->setFeet($mileArray);
			$Mile->setScale(36);

			$m = $Mile->build(false);

			$this->vars['mileContent'] = $m;
			
			//render word balloon as well
			if (isset($_SESSION['doSelect'])) {

				include('php/class_Comment.php');
				$Comment = new Comment($this->db);

				$objectid = $_SESSION['doSelect'];
				$Comment->setID($objectid);

				$userid = isset($_SESSION['userid']) ? $_SESSION['userid'] : 0;
				$Comment->setCurrentUser($userid);
				
				//get users vote
				$this->vars['vote'] = $Comment->loadUserVote();
		
				//render html for vote block
				$this->vars['objectid'] = $objectid;
				$this->vars['voteblock'] = $this->Render('wordballoon-vote');
		
				//get all comments
				$this->vars['comments'] = $Comment->loadAllComments();
		
				//get the tags
				$result = $Comment->loadAllTags();
				
				//merge and size for tag cloud
				$mergedTags = array();
				foreach ($result as $k => $v) {
					$mergedTags[$v['tag']] = $v['cnt'];
				}

				$this->vars['tags'] = $mergedTags;
				$this->vars['tagcloud'] = $this->Render('tagcloud');

				$this->vars['display'] = array(1, 2, 3, 4, 5, 6);
				$this->vars['wordBalloon'] = $this->Render('wordballoon');

				unset($_SESSION['doSelect']);
				//die($this->vars['wordBalloon']);
			}
		}

	}
	
	//tiny link
	function redir()
	{
		include_once('php/functions_redir.php');

		$tiny = $this->helper;

		$big = base_base2base($tiny, 59, 10);
		//$tiny = base_base2base($big, 10, 59);

		$sql = "SELECT * FROM content_history 
				WHERE `id` = '$big' 
				LIMIT 1";
		$res = $this->db->exec($sql);

		if (count($res) < 1) {
			$this->Redirect();
		}
		
		//set the helper to indexAction knows we found a pic
		$this->helper = true;

		$res = $res[0];

		$x = ($res['left'] + ( ($res['right'] - $res['left']) / 2)) * 72;
		$y = ($res['top'] + ( ($res['bottom'] - $res['top']) / 2)) * 72;

		$_SESSION['x'] = $x;
		$_SESSION['y'] = $y;
		
		//d( ($res['right'] - $res['left']) / 2);
		//show word balloon on redirect
		$_SESSION['doSelect'] = $big;

		$link = "#x=" . $x . "&y=" . $y . "&select=" . $big;

		$this->Redirect($link);
	}

	/**
	 * 
	 */
	public function infoAction()
	{
		phpinfo();
		die();
	}
}
