<?
class mvc extends Action{

	function init(){
		require_once('php/class_User.php' );	
	}
	
	function indexAction(){
	
	}
	
	//get a user's profile
	function profileAction(){
		$this->disableLayout();
		$User = new User($this->db);
		
		//if there is no id in POST, assume we want to edit our own 
		//of course validate 
		if(!isset($_POST['userid']) ){
			$userid = $User->getID();
			
			$this->vars['profile'] = $User->loadProfile();
			
			$this->vars['site'] = $User->loadExternal();
			$this->vars['externalSites'] = $this->Render('user-external' );
			
			//get all the sites
			$sql = "SELECT * FROM external_sites E
					LEFT JOIN user_external U
					ON  E.id = U.siteid
					WHERE (U.userid = '$userid' OR U.userid IS NULL)
					AND E.active = '1'
					ORDER BY site ASC";
					
			$this->vars['allsites'] = $this->db->exec($sql);
			
			echo $this->Render('user-profile' );
		} else if (isset($_POST['userid'])) {
			//or else get the profile for this person
		
		} else {
			//??
		}
	}
	
	//update a users profile 
	function updateProfAction(){
		$this->disableLayout();
		$User = new User($this->db);
		
		$userid = $User->getID();
		$profile = strip_tags($_POST['profile']);
		
		//get the pic
		$sql = "SELECT pic FROM user_profile 
				WHERE `userid` = '$userid' 
				LIMIT 1";
				
		$res = $this->db->exec($sql);
		$pic = count($res) ? $res[0]['pic'] : '';
		
		$sql = "REPLACE INTO user_profile 
				(userid, profile, pic)
				VALUES 
				('$userid', '$profile', '$pic') ";
				
		$this->db->execute($sql);
		
		$this->json['success'] = true;
		$this->json['profile'] = stripslashes($profile);
	}
	
	//update a users external link
	function updateExtAction(){
		$this->disableLayout();
		$User = new User($this->db);
		
		$userid = $User->getID();
		
		$extid = intval($_POST['extid']);
		$extusername = trim($_POST['extusername']);
		
		if( !$extid ){
			$this->json['success'] = false;
			return;
		}
		
		$sql = "REPLACE INTO mile_users.user_external 
				(userid, siteid, username) 
				VALUES 
				('$userid', '$extid', '$extusername')";
				
		$this->db->execute($sql);
		
		$this->json['success'] = true;
		
		//render links
		$this->vars['site'] = $User->loadExternal();
		$this->json['links'] = $this->Render('user-external' );
	}
	
	//build the public profile, for friend viewing 
	function publicAction(){
		
		$this->disableLayout();
		
		$userid = $_POST['userid'];
		
		//intantiate user and set to who we are viewing
		$User = new User($this->db);
		$User->setID($userid);
		
		
		$sql = "SELECT L.id, L.user, U.*  
				FROM user_list L
				LEFT JOIN  user_profile U
				ON L.id = U.userid
				WHERE L.id = '$userid'
				LIMIT 1";
				
		$result = $this->db->exec($sql);
		$this->vars['friend'] = $result[0];
		
		//get external sites
		//$this->vars['profile'] = $User->loadProfile();
		$this->vars['site'] = $User->loadExternal();
		$this->vars['externalSites'] = $this->Render('user-external' );
		
		$this->json['profile'] = $this->Render('user-public' );	
		$this->json['adds'] = $User->loadAdds();
		$this->json['comments'] = $User->loadComments();

	}
	
	//load the users account to change their info
	function accountAction(){
		$this->disableLayout();
		
		$user = new User($this->db);
		$id = $user->getID();
		
		$sql = "SELECT * FROM mile_users.user_list U 
				LEFT JOIN mile_users.user_prefs P
				ON U.id = P.userid 
				WHERE U.id = '$id' 
				LIMIT 1";

		$result = $this->db->exec($sql);

		$result[0]['maillist'] = $result[0]['maillist'] == 1 ? 'checked="true"' : "asd";
		
		$this->vars['result'] = $result[0];
		echo $this->Render('account' );
	}
	
	//update a users account
	function updateAction(){
		$this->disableLayout();
		
		$success = array();
		$errors = array();
		
		$user = new User($this->db);
		$userid = $user->getID();
		
		$argsU = array();
		$argsP = array();
		
		//change username?
		if( isset($_POST['username']) && trim($_POST['username']) ){
			$user = trim($_POST['username']);
			
			//make sure user is not taken
			$sql = "SELECT * FROM user_list 
					WHERE `user` = '$user' LIMIT 1";
					
			$result = $this->db->exec($sql);
			
			if (!count($result)){
				//let user change their name
				array_push($argsU, " `user` = '$user' ");
				array_push($success, 'You changed your user name to '.$user.'. ' );
			} else if ($result[0]['id'] == $userid){
				//do nothing. same user same user name
			} else {
				//someone already has this name
				array_push($errors, 'That user name is already taken. ' );
			}
			
		} else {
			
		}
		
		//change email address?
		if( isset($_POST['useremail']) && trim($_POST['useremail']) ){
			array_push($argsU, " `email` = '".trim($_POST['useremail'])."' ");
		} else {
			
		}
		
		//email list? 
		if( isset($_POST['emailrec']) && $_POST['emailrec'] == 'true' ){
			array_push($argsP, " `maillist` = '1' ");
			array_push($success, 'You are subscribed to receive occational updates' );
		} else {
			array_push($argsP, " `maillist` = '0' ");
			array_push($success, 'You will not receive email newsletters. ' );
		}
		
		//change password?
		if( isset($_POST['userpass1']) && isset($_POST['userpass2']) && $_POST['userpass1'] != 'd41d8cd98f00b204e9800998ecf8427e' && $_POST['userpass1'] == $_POST['userpass2'] ){
			array_push($argsU, " `pass` = '".trim($_POST['userpass1'])."' ");
			array_push($argsU, " `passTemp` = '' ");
			
			array_push($success, 'You have changed your password. ' );
		} else {
			
		}
		
		//execute user_list
		$xsql = implode(',' , $argsU);
		
		$sql = "UPDATE mile_users.user_list SET $xsql
				WHERE `id` = '$userid' LIMIT 1";
		$this->db->execute($sql);
		
		//execute user_prefs
		$xsql = implode(',' , $argsP);
		
		$sql = "UPDATE mile_users.user_prefs SET $xsql
				WHERE `userid` = '$userid' LIMIT 1";
		$this->db->execute($sql);
		
		//
		$this->json['success'] = $success;
		$this->json['errors'] = $errors;
	}
	
	function forgotAction(){
		$start = microtime();
		$this->disableLayout();
		
		$end = microtime();
		
		if($end-$start < 1){
			sleep(1);
		}
	}
	
	function loginAction(){
		$start = microtime();
		$this->disableLayout();
		
		$success = false;
		$user = new User($this->db);
		
		$user->setName($_POST['user']);
		$user->setPass($_POST['pass']);
		
		if($user->doLogin()){
			$success = true;
		} else {
			$this->json['message'] = 'Please check your user name and password.';
		}
		
		$this->json['success'] = $success;
		$end = microtime();
		
		if($end-$start < 1){
			sleep(1);
		}
	}
	
	function logoutAction(){
		$this->disableLayout();
		
		session_destroy();
		
		$this->json['success'] = true;
	}
	
	//request access to alpha
	function requestAction(){
		$start = microtime();
		$this->disableLayout();
		
		$stamp = time();
		$email = $_POST['email'];
		
		$sql = "SELECT * 
				FROM info_request
				WHERE email = '$email'";
				
		$result = $this->db->exec($sql);
		
		if (count($result)){
			$this->json['msg'] = "You have already requested information!";
		} else {
			$sql = "INSERT INTO info_request
			(email, action, stamp)
			VALUES
			('$email', '1', $stamp)";
			
			$result = $this->db->execute($sql);
			
			$this->json['msg'] = "Thank you! We will send you an email soon!";
		}
		
		$end = microtime();
		if($end-$start < 1){
			sleep(1);
		}
	}
	
	//persistant tracking
	function keepaliveAction(){
		$this->disableLayout();
		$User = new User($this->db);
		$success = $User->setLoc($_POST['x'], $_POST['y']);
		
		$this->json['success'] = $success;
	}
	
	function getpanelAction(){
		$this->disableLayout();
		
		$outputScript = '';
		$outputHTML = '';
		
		$auth = isset($_SESSION['userauth']) ? $_SESSION['userauth'] : 0;
		
		//popular spots
		$outputScript .= 'cpanelControls.navs.push("Highest Voted");';
		$outputScript .= 'cpanelControls.navs.push("onclick=\"hliteSub(this);getPopular(0);return false\"");';
		$outputHTML .= '<li><a href="" id="menu_navs" onclick="getControl(\'navs\' );return false;">Navigation</a></li>';
		
		//build navigation text
		if ($auth & 1){
			$outputHTML .= '<li><a href="" id="menu_content" onclick="getControl(\'content\' );return false;">Add Content</a></li>';
			$outputHTML .= '<li><a href="" id="menu_prefs" onclick="getControl(\'prefs\' );return false;">Preferences</a></li>';
		}
		
		//build cpanel javascript functions
		if ($auth & 1){
			
			//recent spots
			$outputScript .= 'cpanelControls.navs.push("Recently Added");';
			$outputScript .= 'cpanelControls.navs.push("onclick=\"hliteSub(this);getRecent(0);return false\"");';
			//freinds
			$outputScript .= 'cpanelControls.navs.push("Your Friends");';
			$outputScript .= 'cpanelControls.navs.push("onclick=\"hliteSub(this);getFriends();return false\"");';
			
			//upload image
			$outputScript .= 'cpanelControls.content.push("Upload an Image");';
			$outputScript .= 'cpanelControls.content.push("onclick=\"hliteSub(this);startUpload();return false\"");';
			//link image
			$outputScript .= 'cpanelControls.content.push("Link an Image");';
			$outputScript .= 'cpanelControls.content.push("onclick=\"hliteSub(this);addImage();return false\"");';
			//sent in images
			$outputScript .= 'cpanelControls.content.push("Your Waiting List");';
			$outputScript .= 'cpanelControls.content.push("onclick=\"hliteSub(this);getWaitingList(0);return false\"");';
			
			
			//prefs
			$outputScript .= 'cpanelControls.prefs.push("Your Account");';
			$outputScript .= 'cpanelControls.prefs.push("onclick=\"hliteSub(this);getAccount();return false\"");';
			
			$outputScript .= 'cpanelControls.prefs.push("Your Profile");';
			$outputScript .= 'cpanelControls.prefs.push("onclick=\"hliteSub(this);getProfile();return false\"");';
			
			$outputScript .= 'cpanelControls.prefs.push("Invite A Friend");';
			$outputScript .= 'cpanelControls.prefs.push("onclick=\"hliteSub(this);startInvite();return false\"");';
			
		}
		
		$outputScript .= 'cpanelControls.navs.push ("Search");';
		$outputScript .= 'cpanelControls.navs.push ("onclick=\"hliteSub(this);openSearch();return false\"");';
		
		$outputHTML .= '<li><a href="" id="menu_help" onclick="getControl(\'help\' );return false";>Help!</a></li>';
	
		$outputScript .= 'cpanelControls.help.push ("How To Use");';
		$outputScript .= 'cpanelControls.help.push ("onclick=\"hliteSub(this);getHelp();return false\"");';
		
		$outputScript .= 'cpanelControls.help.push ("Feedback");';
		$outputScript .= 'cpanelControls.help.push ("onclick=\"hliteSub(this);startFeedback();return false\"");';
		
		$outputScript .= 'cpanelControls.help.push ("Terms / Privacy");';
		$outputScript .= 'cpanelControls.help.push ("onclick=\"hliteSub(this);getTerms();return false\"");';
	
		$outputScript .= 'cpanelControls.help.push ("About");';
		$outputScript .= 'cpanelControls.help.push ("onclick=\"hliteSub(this);getAbout();return false\"");';
		
		//$outputScript .= 'cpanelControls.help.push ("API");';
		//$outputScript .= 'cpanelControls.help.push ("onclick=\"hliteSub(this);getAPI();return false\"");';
		
		//login / out 
		if ($auth & 1){
			$outputHTML .= '<li><a href="" onclick="doLogout();return false;">Log Out</a></li>';
		} else if(!isset($_SESSION['refer'])){
			$outputHTML .= '<li><a href="" onclick="startLogin();return false;">Log In</a></li>';
		}
	
		$this->json['script'] = $outputScript;
		$this->json['html'] = $outputHTML;
	}
	
	//content to go into ajax lightbox 
	function feedbackAction(){
		$this->disableLayout();
		echo $this->Render('feedback' );
	}
	
	//into ajax lightbox, invite a friend
	function inviteAction(){
		$this->disableLayout();
		echo $this->Render('invitation' );
	}
}
?>