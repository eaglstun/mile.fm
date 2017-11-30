<?php
class mvc extends Action
{

	function init()
	{
		$this->disableLayout();
	}

	function indexAction()
	{
		$this->json['success'] = false;
		$this->json['error'] = 'no action specified';
	}
	
	//pass in user name, return userid
	function getUserIDAction()
	{
		$uname = $_REQUEST['for'];

		$sql = "SELECT `id` FROM user_list 
				WHERE `user` = '$uname' 
				LIMIT 1";

		$result = $this->db->exec($sql);

		if (count($result) != 1) {
			$this->json['success'] = false;
			return;
		}

		$this->json['userid'] = $result[0]['id'];
		$this->json['username'] = $_REQUEST['for'];
		$this->json['success'] = true;

		return $result[0]['id'];
	}
	
	//pass in userid, get recently added
	function getAddsAction()
	{
		$for = $_REQUEST['for'];
		$limit = (isset($_REQUEST['limit']) && $_REQUEST['limit'] < 51) ? $_REQUEST['limit'] : 10;

		$sql = "SELECT `content`, `top`, `right`, `bottom`, `left` FROM content_history 
				WHERE `userid` = '$for'
				ORDER BY `stamp` DESC 
				LIMIT $limit";
		$result = $this->db->exec($sql);

		if (count($result) < 1) {
			$this->json['success'] = false;
			return;
		}

		$this->json['additions'] = $result;

		$this->json['success'] = true;
	}
	
	//returns content at any given location, in inches
	function getContentAtLocAction()
	{
		$top = $_REQUEST['top'];
		$right = $_REQUEST['right'];
		$bottom = $_REQUEST['bottom'];
		$left = $_REQUEST['left'];

		if ( ($right - $left > 48) || ($bottom - $top > 48)) {
			$this->json['success'] = false;
			return;
		}

		$sql = "SELECT id FROM content_history WHERE 
				((`left` >= '$left'  AND `left` <= '$right' ) OR (`right` <= '$left'  AND `right` >= '$right' )) 
				AND 
				((`top` >= '$top'  AND `top` <= '$bottom' ) OR (`bottom` <= '$top'  AND `bottom` >= '$bottom' )) 
				ORDER BY `left` ASC";

		$result = $this->db->exec($sql);

		$this->json['count'] = count($result);
		//$this->json['sql'] = $sql;


		if (count($result) > 0) {
			$this->json['content'] = $result;
		}

		$this->json['success'] = true;
	}
	
	//adds an external picture to waiting list, probably from js bookmarklet.
	//requires auth 
	function addExternalPictureAction()
	{
		$return = $_REQUEST['return'] == 'image' ? 'image' : 'json'; //return image output or success?

		$for = $_REQUEST['for']; //userid of who this goes to
		$apicode = $_REQUEST['apicode'];
		
		//get the query string parsed.
		$uri = $_SERVER['REQUEST_URI'];
		$explode = explode('?', $uri);
		$vars = $explode[1];
		$vars = explode('&', $vars);

		foreach ($vars as $k => $v) {

			$explode = explode('=', $v);
			
			//dbug($explode);

			$ $explode[0] = $explode[1];
		}

		d($src, 'src'); //src of image
		d($page, 'page'); //page image is on
	}

}