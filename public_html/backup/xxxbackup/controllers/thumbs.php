<?
class mvc extends Action{
	
	function init(){
		require_once('php/class_User.php' );	
	}
	
	function popularAction(){
		$this->disableLayout();
		
		$start = $_POST['start'];

		$sql = "SELECT U.id as userid, 
					COUNT(V.userid) AS votes, 
					U.user, C.top, C.right, C.bottom, C.left, 
					C.id, 
					C.content, C.thumb, 
					C.stamp,
					SUM(V.vote) AS total
		
				FROM eric_mile_users.content_votes V, 
				mile_users.user_list U, 
				mile_users.content_history C
				WHERE
				V.vote = '1'
				AND C.userid = U.id
				AND V.object = C.id
				GROUP BY object
				ORDER BY total DESC, stamp DESC
				LIMIT $start, 65";
						
		$result = $this->db->exec($sql);
		
		$output = array();
		
		foreach( $result as $k=>$v){
			$array = array();
			
			$array['locX'] = (($v['left'] + $v['right']) / 2) * 72;
			$array['locY'] = (($v['top'] + $v['bottom']) / 2) * 72;
			$array['thumb'] = $v['thumb'];
			//$array['date'] = date("m/d/y",$v['stamp']);
			$array['id'] = 'pic'.$v['id'];
			$array['votes'] = $v['total']; 
			
			array_push($output, $array);
		}
		
		$this->json = count($output) ? $output : array(0);
	}
	
	//delete a thumb from the waiting list
	function deleteAction(){
		$this->disableLayout();
		$src = $_POST['src'];
		$userid = $_SESSION['userid'];
		
		$sql = "DELETE FROM eric_mile_users.content_waiting
				WHERE loc='$src'
				AND userid='$userid'
				LIMIT 1";
		$this->db->execute($sql);
	}
	
	function recentAction(){
		$this->disableLayout();
		
		$start = isset($_POST['start']) ? intval($_POST['start']) : 0;
		
		$sql = "SELECT `id`, `thumb`, `top`, `right`, `bottom`, `left` FROM eric_mile_users.content_history
				
				ORDER BY `stamp` DESC
				LIMIT $start, 9";
				
		$result = $this->db->exec($sql);
		
		$output = array();
		
		foreach( $result as $k=>$v){
			$locX = (($v['left'] + $v['right']) / 2) * 72;
			$locY = (($v['top'] + $v['bottom']) / 2) * 72;
			
			//$array['locX'] = (($v['left'] + $v['right']) / 2) * 72;
			//$array['locY'] = (($v['top'] + $v['bottom']) / 2) * 72;
			
			$output[] = array('thumb' => $v['thumb'],
							  'locX' => $locX,
							  'locY' => $locY,
							  'id' => 'pic'.$v['id']);
		}
		
		$this->json = count($output) ? $output : array(0);
	}
	
	function waitingAction(){
		$this->disableLayout();
		
		$userid = $_SESSION['userid'];
		$start = isset($_POST['start']) ? intval($_POST['start']) : 0;
		
		$sql = "SELECT `id`, `loc`, `loc` as `thumb`, `width`, `height` FROM eric_mile_users.content_waiting
				WHERE `userid` = '$userid'
				ORDER BY `stamp` DESC
				LIMIT $start, 25";
				
		$result = $this->db->exec($sql);
		
		$this->json = count($result) ? $result : array(0);
	}
	
	//get a list of your friends for a thumbs menu 
	function friendsAction(){
		$this->disableLayout();
		
		$id = $_SESSION['userid'];
		$start = intval($_POST['start']) ? intval($_POST['start']) : 0;
		
		if ($start == 0){
			//recalc friends
			
			//see whose pictures i like, and who likes mine
			$sql = "SELECT voter, adder, SUM(sum) as sum 
					FROM
						((  SELECT V.userid as voter, H.userid as adder, SUM(vote) as sum 
							FROM content_votes V
							LEFT JOIN content_history H
							ON V.object = H.id
							WHERE V.userid = '1' AND H.userid != '1'
							GROUP BY adder)

						UNION
						
						(	SELECT H.userid as adder, V.userid as voter, SUM(vote) as sum FROM content_votes V
							LEFT JOIN content_history H
							ON V.object = H.id
							WHERE H.userid = '1' AND V.userid != '1'
							GROUP BY voter) ) as A 
					WHERE sum > 0 
					GROUP BY adder ";
					
			$result = $this->db->exec($sql);
			
			foreach( $result as $k=>$v){
				$voter = $v['voter'];
				$adder = $v['adder'];
				$score = $v['sum'];
				
				$sql = "REPLACE INTO user_friends 
						(`userid`, `friendid`, `score`) 
						VALUES 
						('$voter', '$adder', '$score')";
				$this->db->execute($sql);
			}
		}
		
		$now = time();
		$online = $now - 300;
		
		
		$sql = "SELECT U.user,
				       U.id AS userid,
				       IF(P.pic IS NULL , 'defaultFriend.gif' , '') AS thumb
				FROM eric_mile_users.user_friends F
				LEFT JOIN
				mile_users.user_list U
				ON F.friendid = U.id
				LEFT JOIN
				mile_users.user_profile P
				ON U.id = P.userid
				WHERE F.userid = '$id'
				AND F.score > 0	
				ORDER BY score DESC
				LIMIT $start, 9";
				
		$result = $this->db->exec($sql);
		
		if(count($result) ){
			$this->json = $result;
		} else {
			//no results
			$this->json['success'] = 'false';
			$this->json['html'] = "You don't have any friends yet!";
		}
		
	}
	
	function searchAction(){
		$this->disableLayout();
		
		$term = trim($_REQUEST['query']);
		$start = $_POST['start'];
		
		$sql = "SELECT A.object, COUNT(object) as cnt, H.*  FROM

				(
				SELECT object, tag FROM content_tags T
				WHERE T.tag LIKE '$term'  
				
				UNION
				
				SELECT object, comment FROM content_comments C
				WHERE C.comment LIKE '%$term%' 
				) AS A
				
				LEFT JOIN content_history H
				ON A.object =  H.id

				GROUP BY object
				ORDER BY cnt DESC
				LIMIT $start, 5";
		
		$result = $this->db->exec($sql);
		
		$output = array();
		
		foreach( $result as $k=>$v){
			$locX = ($v['left'] + (($v['right'] - $v['left']) / 2)) * 72;
			$locY = ($v['top'] + (($v['bottom'] - $v['top']) / 2)) * 72;
			
			$output[] = array('thumb' => $v['thumb'],
							  'id' => $v['id'],
							  'locX' => $locX,
							  'locY' => $locY);
		}
		
		$this->json = count($output) ? $output : array(0);
		
	}
	
	function recentAddsAction(){
		$this->disableLayout();
		
		//the first one to post from
		$start = $_POST['start'];
		
		//the id we are looking up
		$userid = $_POST['userid'];
		
		//intantiate user and set to who we are viewing
		$User = new User($this->db);
		$User->setID($userid);
		
		$result = $User->loadAdds($start);
		
		$this->json = count($result) ? $result : array(0);
	}
	
	function recentCommentsAction(){
		$this->disableLayout();
		
		//the first one to post from
		$start = $_POST['start'];
		
		//the id we are looking up
		$userid = $_POST['userid'];
		
		//intantiate user and set to who we are viewing
		$User = new User($this->db);
		$User->setID($userid);
		
		$result = $User->loadComments($start);
		
		$this->json = count($result) ? $result : array(0);
	}
}
?>