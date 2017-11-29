<?
class usersMVC extends Action{
	function init(){
		if(isset($_SESSION['userauth']) && $_SESSION['userauth'] & 64){
			//all good
		} else {
			$this->Redirect();
		}
		
		$this->theme = "admin";
		
	}
	
	function indexAction(){
	
		$sql = "SELECT * FROM user_list U 
				LEFT JOIN user_prefs P 
				ON U.id = P.userid
				ORDER BY lastlogin DESC,
				id DESC";
		
		$result = $this->db->exec($sql);
		
		$this->vars['users'] = $result; 
			
		$this->view = "admin/user-list";
	}
	
	/*
	//temp - to populate user_prefs
	function fixAction(){
		$sql = "SELECT `id` FROM user_list";
		$res = $this->db->exec($sql);
		
		foreach( $res as $k=>$v){
			$id = $v['id'];
			
			$sql = "REPLACE INTO user_prefs 
					(`userid`, `maillist`, `showmap`) 
					VALUES 
					('$id', '1', '1')";
			$this->db->execute($sql);
		}
		
		$this->Redirect('admin/users' );
	}
	*/
	
	//list people wanting beta access
	function requestAction(){
		$sql = "SELECT I.id,  I.email, I.stamp FROM eric_mile_users.info_request I
				LEFT JOIN eric_mile_users.user_list U ON I.email = U.email
				WHERE U.email IS NULL
				ORDER BY stamp DESC";
		
		
		$sql = "SELECT * FROM list_invite 
				WHERE `friend` = 0
				ORDER BY `date` DESC";
				
		$result = $this->db->exec($sql);
		
		$this->vars['info'] = $result; 
		
		$this->view = 'admin/user-request';
	}
	
	//temp - to remove info_request
	function fixreqAction(){
		$this->disableLayout();
		
		$sql = "SELECT * FROM info_request I";
		$res = $this->db->exec($sql);
		
		foreach( $res as $k=>$v){
			$email = $v['email'];
			$stamp = $v['stamp'];
			
			$sql = "INSERT INTO list_invite 
					(`email`, `friend`, `accept`, `date`) 
					VALUES
					('$email', '0', '0', '$stamp')";
					
			dbug($sql);
			
			$this->db->execute($sql);
		}
		
		
		
	}
	
	//get an email ready to send to invitee
	function sendinviteAction(){
		include('php/functions_redir.php' );
		$to = $_REQUEST['to'];
		
		$sql = "SELECT * FROM eric_mile_users.list_invite
				WHERE `id` = '$to'
				LIMIT 1";
				
		$res = $this->db->exec($sql);
		if( count($res) < 1 ){
			$this->Redirect('admin/users/request' );
		}
		
		$this->vars['to'] = $res[0];
		$this->vars['to']['uniq'] = base_base2base($res[0]['id'], 10, 59);
		$this->vars['uid'] = base_base2base($res[0]['date'], 10, 59);
		$this->vars['email']['subject'] = 'Your invitation to MILE.fm';
		$this->vars['email']['message'] = $this->Render('email-invite' );
		
		$this->view = 'admin/write-invite';
	}
	
	//send the inviation
	function dosendAction(){
		$this->disableLayout();
		
		include_once('php/class_Email.php' );
		
		$now = time();
		$email = $_POST['to'];
		$body = stripslashes($_POST['body']);
		
		$oEmail = new Email();
		$oEmail->addTo($email);
		$oEmail->addBcc('eeaglstun@yahoo.com' );
		$oEmail->setSubject('You have been invited to MILE.fm' );
		$oEmail->setBody($body);
		$oEmail->sendMail();
		
		$sql = "UPDATE list_invite 
				SET last_sent = '$now' 
				WHERE `email` = '$email'
				LIMIT 1";
		
		$this->db->execute($sql);
			
		$this->Redirect('admin/users/request' );
	}
	
	//view/edit individaul user
	function viewAction(){
		$this->view = 'admin/user-view';
		
		$id = $_REQUEST['id'];
		
		$sql = "SELECT * FROM user_list U 
				LEFT JOIN user_prefs P ON U.id = P.userid 
				WHERE U.id = '$id'
				LIMIT 1";
		$res = $this->db->exec($sql);
		
		$this->vars['user'] = $res[0];
		
		//number of invites sent 
		$sql = "SELECT * FROM list_invite WHERE `friend` = '$id'";
		
		$this->vars['invite'] = $this->db->exec($sql);
		
		$sql = "SELECT * FROM list_invite WHERE `friend` = '$id' AND date_accept > 0";
		$this->vars['accept'] = $this->db->exec($sql);
		
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
	function saveuserAction(){
	
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
		$this->Redirect('admin/users' );
	}
	
	function viewcontentAction(){
		$show = $_REQUEST['show'];
		$userid = $_REQUEST['userid'];
		
		switch($show){
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
		
		$this->vars['list'] = $this->Render('admin/content-list' );
		
		$this->view = "admin/user-contentlist";
		
	}
	
}
?>
