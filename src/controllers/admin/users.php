<?php
class usersMVC extends Action
{
	function init()
	{
		if (isset($_SESSION['userauth']) && $_SESSION['userauth'] & 64) {
			//all good
		} else {
			$this->Redirect();
		}

		$this->theme = "admin";

	}

	function indexAction()
	{

		$sql = "SELECT * FROM user_list U 
				LEFT JOIN user_prefs P 
				ON U.id = P.userid
				ORDER BY lastlogin DESC,
				id DESC";

		$result = $this->db->exec($sql);

		$this->vars['users'] = $result;

		$this->view = "admin/user-list";
	}
	
	//view/edit individaul user
	function viewAction()
	{
		$this->view = 'admin/user-view';

		$id = $_REQUEST['id'];

		$sql = "SELECT * FROM user_list U 
				LEFT JOIN user_prefs P ON U.id = P.userid 
				WHERE U.id = '$id'
				LIMIT 1";
		$res = $this->db->exec($sql);

		$this->vars['user'] = $res[0];
		
		//get user stats
		$sql = "SELECT COUNT(*) as comments FROM content_comments WHERE `userid` = '$id'";
		$res = $this->db->exec($sql);
		$this->vars['comments'] = $res[0]['comments'];

		$sql = "SELECT COUNT(*) as tags FROM content_tags WHERE `userid` = '$id'";
		$res = $this->db->exec($sql);
		$this->vars['tags'] = $res[0]['tags'];

		$sql = "SELECT COUNT(*) as votepos FROM content_votes WHERE `userid` = '$id' AND `vote` = '1'";
		$res = $this->db->exec($sql);
		$this->vars['votepos'] = $res[0]['votepos'];

		$sql = "SELECT COUNT(*) as voteneg FROM content_votes WHERE `userid` = '$id' AND `vote` = '-1'";
		$res = $this->db->exec($sql);
		$this->vars['voteneg'] = $res[0]['voteneg'];
		
		//get user stats
		$sql = "SELECT COUNT(*) as added FROM content_history WHERE `userid` = '$id'";
		$res = $this->db->exec($sql);
		$this->vars['added'] = $res[0]['added'];
	}
	
	//update an individual user
	function saveuserAction()
	{

		$this->disableLayout();

		$id = $_POST['userid'];
		
		//update prefs table
		$maillist = $_POST['maillist'] == "on" ? 1 : 0;
		$showmap = $_POST['showmap'] == "on" ? 1 : 0;

		$sql = "REPLACE INTO user_prefs 
				(`userid`, `maillist`, `showmap`) 
				VALUES 
				('$id', '$maillist', '$showmap')";
		$this->db->execute($sql);
		
		//update main user list
		$email = $_POST['email'];
		$invites = $_POST['invites'];

		$sql = "UPDATE user_list 
				SET 
				`email` = '$email',
				`invites` = '$invites'
				WHERE `id`='$id' 
				LIMIT 1";

		$this->db->execute($sql);
		//dbug($sql);
		$this->Redirect('admin/users');
	}

	function viewcontentAction()
	{
		$show = $_REQUEST['show'];
		$userid = $_REQUEST['userid'];

		switch ($show) {
			case 'comments':
				$sql = "SELECT C.comment, H.* FROM content_comments C 
						LEFT JOIN content_history H ON C.object = H.id
						WHERE C.userid = '$userid' ORDER BY C.stamp DESC ";
				break;

			case 'all':
				$sql = "SELECT * FROM content_history WHERE `userid` = '$userid' ORDER BY `stamp` DESC";
				break;
		}

		$res = $this->db->exec($sql);
		$this->vars['images'] = $res;
		$this->vars['sql'] = $sql;

		$this->vars['list'] = $this->Render('admin/content-list');

		$this->view = "admin/user-contentlist";

	}

}