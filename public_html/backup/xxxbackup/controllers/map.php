<?
class mvc extends Action{
	
	//different functions to handle a comment , action=
	// - add
	function commentAction(){
		if(isset($_POST['action']) && $_POST['action'] == 'add'){
			//adding a comment
			$this->disableLayout();
			
			$postId = $_POST['id'];
			$postComment = $_POST['comment'];
			$userid = isset($_SESSION['userid']) ? $_SESSION['userid'] : 0;
			$stamp = time();
			$postComment = strip_tags($postComment);
			
			if ($userid){
				
				$sql = "INSERT INTO eric_mile_users.content_comments
						(userid, object, comment, stamp)
						VALUES
						('$userid', '$postId', '$postComment', '$stamp')";
				
				$result = $this->db->execute($sql);
				
				if ($result){
					$this->commentsAction();
				}
			} else {
				return false;
			}
		}
	}
	
	//tag the image
	function tagAction(){
		$this->disableLayout();
		
		$now = time();
		
		$user = isset($_SESSION['userid']) ? $_SESSION['userid'] : 0;
		$postid = $_POST['id'];
		/**
		*  Adapted from
 		*  Gordon Luk's Freetag - Generalized Open Source Tagging and Folksonomy.
		*  Copyright (C) 2004-2006 Gordon D. Luk <gluk AT getluky DOT net>
	    *
		*  Released under both BSD license and Lesser GPL library license.  Whenever
		*  there is any discrepancy between the two licenses, the BSD license will
		*  take precedence. See License.txt.  
		*
		*/
		
		//all the tags
		$tag = stripslashes($_POST['tag']);
		
		$normalized_valid_chars = 'a-zA-Z0-9';
		$tags = preg_split('/(")/', $tag, -1, PREG_SPLIT_NO_EMPTY|PREG_SPLIT_DELIM_CAPTURE);
		
		$newwords = array();
		$delim = 0;
		foreach ($tags as $key => $word){
			$word = str_replace(",", "", $word);
			
			if ($word == '"') {
				$delim++;
				continue;
			}
			if (($delim % 2 == 1) && $tags[$key - 1] == '"') {
				$newwords[] = $word;
				$word = preg_replace("/[^$normalized_valid_chars]/", "", $word);
				
			} else {
				
				$newwords = array_merge($newwords, preg_split('/\s+/', $word, -1, PREG_SPLIT_NO_EMPTY));
			}
		}
		
		//$this->json['tags'] = $newwords;
		//$this->json['count'] = count($newwords);
		
		foreach( $newwords as $v){
			$sql = "REPLACE INTO eric_mile_users.content_tags 
					(`object`, `tag`, `userid`, `stamp`)
					VALUES 
					('$postid', '$v', '$user', '$now')";
					
			$this->db->execute($sql);
		}
		
		$this->commentsAction(2);
	}
	
	//load the comments for the posted id 
	function commentsAction($showing = 1){
		$this->disableLayout();
		
		$postId = ($_POST['id']); 
		
		$userid = isset($_SESSION['userid']) ? $_SESSION['userid'] : 0;
		
		//get users vote
		if ($userid){
			$sql = "SELECT vote FROM eric_mile_users.content_votes
					WHERE object = '$postId' 
					AND userid = '$userid'
					LIMIT 1";
			$vote = $this->db->exec($sql);
		
			$this->vars['vote'] = isset ($vote[0]['vote']) ? $vote[0]['vote']: 0;
		} else {
			$this->vars['vote'] = 0;
		}
		
		$this->vars['objectid'] = $postId;
		$this->vars['voteblock'] = $this->Render('wordballoon-vote' );
		
		//get all comments
		$sql = "SELECT C.*, U.user AS userName
				FROM eric_mile_users.content_comments C, eric_mile_users.user_list U
				WHERE C.object = '$postId'
				AND U.id = C.userid
				ORDER BY C.id DESC";
		
		$this->vars['comment'] = $this->db->exec($sql);
		
		//get the tags
		$sql = "SELECT tag, COUNT(tag) as cnt FROM eric_mile_users.content_tags
				WHERE object = '$postId'
				GROUP BY tag
				ORDER BY RAND()";
		
		$result = $this->db->exec($sql);
		
		$tags = array();
		
		foreach( $result as $k=>$v){
			$tags[$v['tag']] = $v['cnt'];
		}
		
		$this->vars['tags'] = $tags;
		$this->vars['postId'] = $postId;
		
		$this->vars['tagcloud'] = $this->Render('tagcloud' );
		
		//which word balloon section is showing
		$this->vars['display'] = array();
		for($i = 1; $i < 6; $i++){
			$this->vars['display'][$i] = "display:none";
		}
		
		$this->vars['display'][$showing] = "";
		
		$sql = "SELECT * FROM content_history 
				WHERE `id` = '$postId' 
				LIMIT 1";
				
		$res = $this->db->exec($sql);
		
		$this->vars['orig_loc'] = $res[0]['orig_loc'];
		
		if (trim($res[0]['orig_page']) ){
			//we have the real url
		} else {
			$orig_page = parse_url($res[0]['orig_loc']); 
			
			//try to trim of the beginning
			if ( strpos($orig_page['host'], '.com') ){
				$host = explode('.', $orig_page['host']);
				$orig_page['host'] = $host[count($host)-2] . '.' . $host[count($host)-1];
			}
			
			$this->vars['orig_page'] = $orig_page['scheme'] . '://' . $orig_page['host'];
		}
		
		echo $this->Render('wordballoon' );
	}
	
	//called to load multiple feet at once, as clickable images
	function getAction(){
	
		include('php/class_Mile.php' );
		$Mile = new Mile($this->db);
		
		$this->disableLayout();
		
		//the array of feet we want to get
		$postArray = unserialize(stripslashes(stripslashes($_POST['array'])));
		ksort ($postArray);
		$scale = $_POST['scale'];
		
		//set the array of feet we want to render
		$Mile->setFeet($postArray);
		$Mile->setScale($scale);
		
		$m = $Mile->build();
		$empty = $Mile->empty;
		
		$this->json['empty'] = $empty;
		$this->json['feet'] = $m;
		
	}
	
	function flagAction(){
		$this->disableLayout();
		
		$objectid = $_POST['objectid'];
		$reason = $_POST['reason'];
		$user = isset($_SESSION['userid']) ? $_SESSION['userid'] : 0;
		
		$stamp = time();
		
		switch ($reason){
			case 'copyright':
				$success = true;
				$reasonid = 1;
				$msg = "Thanks, we will check the copyright information.";
				break;
			case 'image':
				$success = true;
				$reasonid = 2;
				$msg = "Thanks, we will review this image and remove if it is deemed inappropriate.";
				break;
			case 'comment':
				$success = true;
				$reasonid = 3;
				$msg = 'Thanks, we will review the comments for '.$objectid;
				break;
			default:
				$success = true;
				$reasonid = 0;
				$res = 'Autoflag for '.$objectid;
				$msg = '';
				$this->json['res'] = $res;
		}
		
		$sql = "INSERT INTO content_flag 
				(object, userid, stamp, reason) 
				VALUES
				('$objectid', '$user', '$stamp', '$reasonid')";
				
		$this->db->execute($sql);
		
		$this->json['success'] = $success;
		$this->json['msg'] = $msg;
	}
}
?>
