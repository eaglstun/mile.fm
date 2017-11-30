<?php

class thumbsMVC extends Action
{
	public function popularAction()
	{
		if (isset($_POST['start'])) {
			//ajax request
			$start = (int) $_POST['start'];
			$limit = 65;
		} else if (isset($_REQUEST['start'])) {
			$start = (int) $_REQUEST['start'];
			$limit = 8;
		} else {
			$start = 0;
			$limit = 8;
		}

		$sql = "SELECT U.id as userid, 
					COUNT(V.userid) AS votes, 
					U.user, C.top, C.right, C.bottom, C.left, 
					C.id, 
					C.content, C.thumb, 
					C.stamp,
					SUM(V.vote) AS total
				FROM content_votes V, 
					user_list U, 
					content_history C
				WHERE V.vote = 1
					AND C.userid = U.id
					AND V.object = C.id
				GROUP BY `object`
				ORDER BY total DESC, stamp DESC
				LIMIT $start, $limit";

		$result = $this->db->exec($sql);

		$output = [];
		$output['thumbs'] = [];

		foreach ($result as $k => $v) {
			$array = [];

			$array['locX'] = ( ($v['left'] + $v['right']) / 2) * 72;
			$array['locY'] = ( ($v['top'] + $v['bottom']) / 2) * 72;
			$array['thumb'] = $v['thumb'];
			//$array['date'] = date("m/d/y",$v['stamp']);
			$array['id'] = 'pic' . $v['id'];
			$array['votes'] = $v['total'];

			array_push($output['thumbs'], $array);
		}

		if ($this->isAjax()) {
			$this->disableLayout();
			$this->json = count($output['thumbs']) ? $output : array(0);
		} else {
			$this->vars['thumbs'] = $output['thumbs'];
			$this->vars['menu2'] = [];

			$this->vars['menu2']['title'] = 'Most Popular ( ' . ($start + 1) . ' - ' . ($start + $limit) . ' )';
			$this->vars['menu2']['content'] = $this->Render('navigation/thumbs');
			$this->vars['menu2']['next'] = '/thumbs/popular/start/' . ($start + $limit);
			$this->vars['menu2']['prev'] = '/thumbs/popular/' . ($start - $limit > 0 ? 'start/' . ($start - $limit) : '');

			$this->parseURL('index');
		}

	}
	
	//delete a thumb from the waiting list
	function deleteAction()
	{
		$this->disableLayout();
		$src = $_POST['src'];
		$userid = $_SESSION['userid'];

		$sql = "DELETE FROM content_waiting
				WHERE loc='$src'
				AND userid='$userid'
				LIMIT 1";
		$this->db->execute($sql);
	}

	function recentAction()
	{

		if (isset($_POST['start'])) {
			//ajax request
			$start = intval($_POST['start']);
			$limit = 17;
		} else if (isset($_REQUEST['start'])) {
			$start = intval($_REQUEST['start']);
			$limit = 8;
		} else {
			$start = 0;
			$limit = 8;
		}

		$output = [];
		$output['thumbs'] = [];

		if (isset($_POST['stamp'])) {
			$stamp = intval($_POST['stamp']);
			$xsql = "WHERE `stamp` <= '$stamp'";
		} else {
			$sql = "SELECT MAX(stamp) as max 
					FROM content_history";
			$result = $this->db->exec($sql);
			$max = $result[0]['max'];
			$output['stamp'] = $max;

			$xsql = '';
		}

		$sql = "SELECT `id`, `thumb`, `top`, `right`, `bottom`, `left` 
				FROM content_history
				$xsql
				ORDER BY `stamp` DESC
				LIMIT $start, $limit";

		$result = $this->db->exec($sql);

		foreach ($result as $k => $v) {
			$locX = ( ($v['left'] + $v['right']) / 2) * 72;
			$locY = ( ($v['top'] + $v['bottom']) / 2) * 72;

			$output['thumbs'][] = array(
				'thumb' => $v['thumb'],
				'locX' => $locX,
				'locY' => $locY,
				'id' => 'pic' . $v['id']
			);
		}

		if ($this->isAjax()) {
			$this->disableLayout();
			$this->json = count($output['thumbs']) ? $output : array(0);
		} else {
			$this->vars['thumbs'] = $output['thumbs'];
			$this->vars['menu2'] = [];

			$this->vars['menu2']['title'] = 'Recently Added ( ' . ($start + 1) . ' - ' . ($start + $limit) . ' )';
			$this->vars['menu2']['content'] = $this->Render('navigation/thumbs');
			$this->vars['menu2']['next'] = '/thumbs/recent/start/' . ($start + $limit);
			$this->vars['menu2']['prev'] = '/thumbs/recent/' . ($start - $limit > 0 ? 'start/' . ($start - $limit) : '');

			$this->parseURL('index');
		}

		$this->json = count($output['thumbs']) ? $output : array(0);
	}

	function waitingAction()
	{
		$this->disableLayout();

		$output = [];
		$output['thumbs'] = [];

		$userid = $_SESSION['userid'];
		$start = isset($_POST['start']) ? intval($_POST['start']) : 0;

		$sql = "SELECT `id`, `loc`, `loc` as `thumb`, `width`, `height` FROM content_waiting
				WHERE `userid` = '$userid'
				ORDER BY `stamp` DESC
				LIMIT $start, 25";

		$output['thumbs'] = $this->db->exec($sql);

		$this->json = count($output['thumbs']) ? $output : array(0);
	}
	
	//your thumbs ups
	function favoritesAction()
	{
		$this->disableLayout();

		$id = $_SESSION['userid'];
		$start = intval($_POST['start']) ? intval($_POST['start']) : 0;

		$sql = "SELECT V.id,thumb,`left`,`right`,`top`,`bottom` FROM content_votes V
				LEFT JOIN content_history H
				ON V.object = H.id
				WHERE V.userid='$id' AND V.vote='1'
				ORDER BY V.stamp DESC 
				LIMIT $start, 17";
		$result = $this->db->exec($sql);

		$output = [];
		$output['thumbs'] = [];

		foreach ($result as $k => $v) {
			$locX = ($v['left'] + ( ($v['right'] - $v['left']) / 2)) * 72;
			$locY = ($v['top'] + ( ($v['bottom'] - $v['top']) / 2)) * 72;

			$output['thumbs'][] = array(
				'thumb' => $v['thumb'],
				'id' => $v['id'],
				'locX' => $locX,
				'locY' => $locY
			);
		}

		$this->json = count($output['thumbs']) ? $output : array(0);
	}
	
	//get a list of your friends for a thumbs menu 
	function friendsAction()
	{
		$this->disableLayout();

		$output = [];
		$output['thumbs'] = [];

		$id = (int) $_SESSION['userid'];
		$start = (int) filter_input(INPUT_POST, 'start');

		if ($start == 0) {
			//recalc friends
			
			//see whose pictures i like, and who likes mine
			$sql = "SELECT voter, adder, SUM(sum) as sum 
					FROM
						((  SELECT V.userid as voter, H.userid as adder, SUM(vote) as sum 
							FROM content_votes V
							LEFT JOIN content_history H
							ON V.object = H.id
							WHERE V.userid = '$id' AND H.userid != '$id'
							GROUP BY adder)

						UNION
						
						(	SELECT H.userid as adder, V.userid as voter, SUM(vote) as sum FROM content_votes V
							LEFT JOIN content_history H
							ON V.object = H.id
							WHERE H.userid = '$id' AND V.userid != '$id'
							GROUP BY voter) ) as A 
					WHERE sum > 0 
					GROUP BY adder ";

			$result = $this->db->exec($sql);

			foreach ($result as $k => $v) {
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
				       IF(P.pic = '' OR pic IS NULL, 'defaultFriend.gif' , P.pic) AS thumb
				FROM user_friends F
				LEFT JOIN user_list U
					ON F.friendid = U.id
				LEFT JOIN user_profile P
					ON U.id = P.userid
				WHERE F.userid = $id
					AND F.score > 0	
				ORDER BY score DESC
				LIMIT $start, 9";

		$result = $this->db->exec($sql);

		if (count($result)) {
			$output['thumbs'] = $result;
			$this->json = $output;
		} else {
			//no results
			$this->json['success'] = 'false';
			$this->json['html'] = "You don't have any friends yet!  <br/> Get friends by giving thumbs up to pictures, or when others like your pictures!";
		}

	}

	function searchAction()
	{
		$this->disableLayout();

		$term = trim($_REQUEST['query']);

		$start = $_REQUEST['start'];

		$sql = "SELECT A.object, COUNT(object) as cnt, H.* FROM (
		
					(SELECT object, comment, COUNT(object) as cnt FROM content_comments C 
					WHERE C.comment REGEXP '[^a-z]" . $term . "[^a-z]|^" . $term . "[[:punct:],\ ]|[ ]" . $term . "$|^" . $term . "$'
					GROUP BY object
					)
					
					UNION
					
					(SELECT object, tag, COUNT(object) as cnt FROM content_tags T
					WHERE T.tag LIKE '$term'
					GROUP BY object
					) 
					
				) AS A
				
				LEFT JOIN content_history H
				ON A.object =  H.id
				
				WHERE H.id IS NOT NULL
				
				GROUP BY object
				ORDER BY cnt DESC, H.stamp DESC
				LIMIT $start, 9";

		$result = $this->db->exec($sql);

		$output = [];
		$output['thumbs'] = [];

		foreach ($result as $k => $v) {
			$locX = ($v['left'] + ( ($v['right'] - $v['left']) / 2)) * 72;
			$locY = ($v['top'] + ( ($v['bottom'] - $v['top']) / 2)) * 72;

			$output['thumbs'][] = array(
				'thumb' => $v['thumb'],
				'id' => $v['id'],
				'locX' => $locX,
				'locY' => $locY
			);
		}

		$this->json = count($output['thumbs']) ? $output : array(0);
		//$this->json['sql'] = $sql;
	}

	function recentAddsAction()
	{
		$this->disableLayout();

		$output = [];
		$output['thumbs'] = [];
		
		//the first one to post from
		$start = $_POST['start'];
		
		//the id we are looking up
		$userid = $_POST['userid'];
		
		//intantiate user and set to who we are viewing
		$User = new User($this->db);
		$User->setID($userid);

		$output['thumbs'] = $User->loadAdds($start);

		$this->json = count($output['thumbs']) ? $output : array(0);
	}

	function recentCommentsAction()
	{
		$this->disableLayout();

		$output = [];
		$output['thumbs'] = [];
		
		//the first one to post from
		$start = $_POST['start'];
		
		//the id we are looking up
		$userid = $_POST['userid'];
		
		//intantiate user and set to who we are viewing
		$User = new User($this->db);
		$User->setID($userid);

		$output['thumbs'] = $User->loadComments($start);

		$this->json = count($output['thumbs']) ? $output : array(0);
	}
}