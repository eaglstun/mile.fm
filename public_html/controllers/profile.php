<?php
class profileMVC extends Action
{

	public function init()
	{
		if ($this->isAjax()) {
			$this->disableLayout();
		} else {

		}
	}

	public function indexAction()
	{
		if (isset($this->helper) || isset($_REQUEST['name'])) {
			$username = isset($_REQUEST['name']) ? $_REQUEST['name'] : $this->helper;

			$sql = "SELECT * FROM user_list 
					WHERE `user` = '$username' 
					LIMIT 1";

			$res = $this->db->exec($sql);

			if (!count($res)) {
				$this->Redirect();
			}
		} else {
			$this->Redirect();
		}

		$userid = $res[0]['id'];

		$User = new User($this->db);
		$User->setID($userid);
		
		//consolodate this and publicAction into User.php
		$sql = "SELECT L.id, L.user, U.*  
				FROM user_list L
				LEFT JOIN  user_profile U
				ON L.id = U.userid
				WHERE L.id = '$userid'
				LIMIT 1";

		$result = $this->db->exec($sql);
		$this->vars['friend'] = $result[0];

		$this->vars['site'] = $User->loadExternal();
		$this->vars['externalSites'] = $this->Render('user-external');




		$menu4 = [];
		$menu4['content'] = $this->Render('user-public');
		$menu4['title'] = $username;
		$menu4['prev']['text'] = '';
		$menu4['next']['text'] = '';
		
		//load recent additions
		$start = isset($_REQUEST['added']) ? intval($_REQUEST['added']) : 0;
		$prev = ($start - 4) < 0 ? 0 : ($start - 4);
		$this->vars['thumbs'] = $User->loadAdds($start, 4);

		$menu4['friendAdds']['content'] = $this->Render('navigation/thumbs');
		$menu4['friendAdds']['title'] = 'Recently Added ( ' . ($start + 1) . ' - ' . ($start + 4) . ' )';
		$menu4['friendAdds']['next']['href'] = '/profile/name/' . $username . '/added/' . ($start + 4);
		$menu4['friendAdds']['prev']['href'] = '/profile/name/' . $username . '/added/' . $prev;

		$addholder = '/added/' . $start;
		
		//load recent comments
		$start = isset($_REQUEST['comments']) ? intval($_REQUEST['comments']) : 0;
		$prev = ($start - 4) < 0 ? 0 : ($start - 4);
		$this->vars['thumbs'] = $User->loadComments($start, 4);

		$menu4['friendComments']['content'] = $this->Render('navigation/thumbs');
		$menu4['friendComments']['title'] = 'Recent Comments ( ' . ($start + 1) . ' - ' . ($start + 4) . ' )';
		$menu4['friendComments']['next']['href'] = '/profile/name/' . $username . '/comments/' . ($start + 4) . $addholder;
		$menu4['friendComments']['prev']['href'] = '/profile/name/' . $username . '/comments/' . $prev . $addholder;
		
		//build back links for added
		$comholder = '/comments/' . $start;
		$menu4['friendAdds']['prev']['href'] .= $comholder;
		$menu4['friendAdds']['next']['href'] .= $comholder;

		if ($this->isAjax()) {
			$this->disableLayout();
		} else {
			$this->vars['menu4'] = $menu4;
			//$this->disableLayout();
			//dbug($menu4);
			$this->vars['hideLogin'] = true;
			$this->parseURL('index');
		}



	}
	
	//build the public profile, for friend viewing 
	function publicAction()
	{

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
		$this->vars['site'] = $User->loadExternal();
		$this->vars['externalSites'] = $this->Render('user-external');

		$this->json['profile'] = $this->Render('user-public');
		$this->json['adds'] = $User->loadAdds();
		$this->json['comments'] = $User->loadComments();

	}
	
	//reset user's password
	function resetAction()
	{
		$this->disableLayout();

		$User = new User($this->db);
		$User->setEmail($_POST['email']);

		if ($User->resetPass()) {
			$this->json['success'] = true;
			$this->json['message'] = 'Your new password has been sent to ' . $_POST['email'];
		} else {
			$this->json['success'] = false;
			$this->json['message'] = 'That email is not found.  Please check and try again.';
		}

	}
	
	//get a user's profile
	function getAction()
	{
		$this->disableLayout();
		$User = new User($this->db);
		
		//if there is no id in POST, assume we want to edit our own 
		//of course validate 
		if (!isset($_POST['userid'])) {
			$userid = $User->getID();

			$this->vars['profile'] = $User->loadProfile();

			$this->vars['site'] = $User->loadExternal();
			$this->vars['externalSites'] = $this->Render('user-external');
			
			// get all the sites
			$sql = "SELECT *, '' as username, '' as uid FROM external_sites E
					WHERE E.active = 1
					ORDER BY site ASC";

			$allsites = $this->db->exec($sql, 'id');

			$sql = "SELECT * FROM user_external U 
					WHERE U.userid = '$userid' ";

			$usersites = $this->db->exec($sql, 'siteid');
			
			//merge em
			foreach ($usersites as $k => $v) {
				if (isset($allsites[$k])) {
					$allsites[$k]['username'] = $v['username'];
					$allsites[$k]['uid'] = $v['uid'];
				}
			}

			$this->vars['allsites'] = $allsites;

			echo $this->Render('user-profile');
		} else if (isset($_POST['userid'])) {
			//or else get the profile for this person

		} else {
			//??
		}
	}
	
	//update a users profile 
	function updateAction()
	{
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
	function updateExtAction()
	{
		$this->disableLayout();
		$User = new User($this->db);

		$userid = $User->getID();

		$extid = intval($_POST['extid']);
		$extusername = trim($_POST['extusername']);

		if (!$extid) {
			$this->json['success'] = false;
			return;
		}

		$sql = "REPLACE INTO user_external 
				(userid, siteid, username) 
				VALUES 
				('$userid', '$extid', '$extusername')";

		$this->db->execute($sql);

		$this->json['success'] = true;
		
		//render links
		$this->vars['site'] = $User->loadExternal();
		$this->json['links'] = $this->Render('user-external');
	}
	
	//load the users account to change their info
	function accountAction()
	{
		$this->disableLayout();

		$user = new User($this->db);
		$id = $user->getID();

		$sql = "SELECT * FROM user_list U 
				LEFT JOIN user_prefs P
				ON U.id = P.userid 
				WHERE U.id = '$id' 
				LIMIT 1";

		$result = $this->db->exec($sql);

		$result[0]['maillist'] = $result[0]['maillist'] == 1 ? 'checked="true"' : "";
		$result[0]['show_nudity'] = $result[0]['show_nudity'] == 1 ? 'checked="true"' : "";

		$this->vars['result'] = $result[0];
		echo $this->Render('account');
	}

	function updatePicHolderAction()
	{
		$this->disableLayout();
	}
	
	//update a users profile pic
	function updatePicAction()
	{
		$this->disableLayout();

		$path = $_FILES['profilePic']['tmp_name'];

		$pic = new Image($this->db);
		$pic->load($path);
		$newname = $pic->giveUniqueName();
		$pic->userThumb();

		$user = new User($this->db);
		$userid = $user->getID();
		$info = $user->loadProfile();
		$profile = $info['profile'];

		$sql = "REPLACE INTO user_profile 
				(userid, profile, pic)
				VALUES 
				('$userid', '$profile', '$newname')";

		$this->db->execute($sql);

		echo "<script>
			par = window.parent.document;
			pic = par.getElementById('currentUserPic' );
			pic.src = 'content/profile/$newname';
			inp = par.getElementById('profilePicInput' );
			inp.value = '';
			window.parent.toggleProfile(1);
			</script>";

	}
	
	//update a users account
	function updateAccountAction()
	{
		$this->disableLayout();

		$success = [];
		$errors = [];

		$user = new User($this->db);
		$userid = $user->getID();

		$argsU = [];
		$argsP = [];
		
		//change username?
		if (isset($_POST['username']) && trim($_POST['username'])) {
			$user = trim($_POST['username']);
			
			//make sure user is not taken
			$sql = "SELECT * FROM user_list 
					WHERE `user` = '$user' LIMIT 1";

			$result = $this->db->exec($sql);

			if (!count($result)) {
				//let user change their name
				array_push($argsU, " `user` = '$user' ");
				array_push($success, 'You changed your user name to ' . $user . '. ');
			} else if ($result[0]['id'] == $userid) {
				//do nothing. same user same user name
			} else {
				//someone already has this name
				array_push($errors, 'That user name is already taken. ');
			}

		} else {

		}
		
		//change email address?
		if (isset($_POST['useremail']) && trim($_POST['useremail'])) {
			array_push($argsU, " `email` = '" . trim($_POST['useremail']) . "' ");
		} else {

		}
		
		//show nudity?
		if (isset($_POST['show_nudity']) && $_POST['show_nudity'] == 'true') {
			array_push($argsP, " `show_nudity` = '1' ");
			array_push($success, 'You will see images with nudity.');
			$_SESSION['show_nudity'] = 1;
		} else {
			array_push($argsP, " `show_nudity` = '0' ");
			array_push($success, 'You will not see images with nudity.');
			$_SESSION['show_nudity'] = 0;
		}
		
		//email list? 
		if (isset($_POST['emailrec']) && $_POST['emailrec'] == 'true') {
			array_push($argsP, " `maillist` = '1' ");
			array_push($success, 'You are subscribed to receive occational updates');
		} else {
			array_push($argsP, " `maillist` = '0' ");
			array_push($success, 'You will not receive email newsletters. ');
		}
		
		//change password?
		if (isset($_POST['userpass1']) && isset($_POST['userpass2']) && $_POST['userpass1'] != 'd41d8cd98f00b204e9800998ecf8427e' && $_POST['userpass1'] == $_POST['userpass2']) {
			array_push($argsU, " `pass` = '" . trim($_POST['userpass1']) . "' ");
			array_push($argsU, " `passTemp` = '' ");

			array_push($success, 'You have changed your password. ');
		} else {

		}
		
		//execute user_list
		$xsql = implode(',', $argsU);

		$sql = "UPDATE user_list SET $xsql
				WHERE `id` = '$userid' LIMIT 1";
		$this->db->execute($sql);
		
		//execute user_prefs
		$xsql = implode(',', $argsP);

		$sql = "UPDATE user_prefs SET $xsql
				WHERE `userid` = '$userid' LIMIT 1";
		$this->db->execute($sql);
		
		//spit it out
		$this->json['success'] = $success;
		$this->json['errors'] = $errors;
	}

	function forgotAction()
	{
		$start = microtime(true);
		$this->disableLayout();

		$end = microtime(true);

		if ($end - $start < 1) {
			sleep(1);
		}
	}

	/**
	 * POST profile/logout
	 */
	public function loginAction()
	{
		$start = microtime(true);

		$success = false;
		$user = new User($this->db);

		if (!$this->isAjax()) {
			$_POST['pass'] = md5($_POST['pass']);
		}

		$user->setName($_POST['user']);
		$user->setPass($_POST['pass']);

		if ($user->doLogin()) {
			$success = true;
			$this->json['panelLeft'] = $this->Render('menu/menu-loggedin-left');
			$this->json['panelRight'] = $this->Render('menu/menu-loggedin-right');
		} else {
			$this->json['message'] = 'Please check your user name and password.';
		}

		$this->json['success'] = $success;

		if (!$this->isAjax()) {
			$this->Redirect('');
		}

		if (microtime(true) - $start < 1) {
			sleep(1);
		}
	}

	function logoutAction()
	{
		$this->disableLayout();

		session_destroy();

		$this->json['success'] = true;
		$this->json['panelLeft'] = $this->Render('menu/menu-loggedout-left');
		$this->json['panelRight'] = $this->Render('menu/menu-loggedout-right');

		if (!$this->isAjax()) {
			$this->Redirect('');
		}
	}
	
	//request access to alpha
	function requestAction()
	{
		$start = microtime(true);
		$this->disableLayout();

		$stamp = time();
		$email = $_POST['email'];

		$sql = "SELECT * 
				FROM info_request
				WHERE email = '$email'";

		$result = $this->db->exec($sql);

		if (count($result)) {
			$this->json['msg'] = "You have already requested information!";
		} else {
			$sql = "INSERT INTO info_request
			(email, action, stamp)
			VALUES
			('$email', '1', $stamp)";

			$result = $this->db->execute($sql);

			$this->json['msg'] = "Thank you! We will send you an email soon!";
		}

		$end = microtime(true);
		if ($end - $start < 1) {
			sleep(1);
		}
	}
	
	//persistant tracking
	function keepaliveAction()
	{
		$this->disableLayout();
		$User = new User($this->db);
		$success = $User->setLoc($_POST['x'], $_POST['y']);

		$this->json['success'] = $success;
	}

	function loadPanelAction()
	{

	}

	function getpanelAction()
	{
		$this->disableLayout();

		$outputScript = '';
		$outputHTML = '';
		
		
		
		//popular spots
		$outputScript .= 'cpanelControls.navs.push("Highest Voted");';
		$outputScript .= 'cpanelControls.navs.push("onclick=\"hliteSub(this);getPopular(0);\"");';
		$outputHTML .= '<li><a id="menu_navs" onclick="getControl(\'navs\' );">Navigation</a></li>';
		
		
		//build cpanel javascript functions
		if ($auth & 1) {
			
			
			//prefs

		}

		$outputScript .= 'cpanelControls.navs.push ("Search");';
		$outputScript .= 'cpanelControls.navs.push ("onclick=\"hliteSub(this);openSearch();\"");';

		$outputHTML .= '<li><a id="menu_help" onclick="getControl(\'help\' );";>Help!</a></li>';

		$outputScript .= 'cpanelControls.help.push ("How To Use");';
		$outputScript .= 'cpanelControls.help.push ("onclick=\"hliteSub(this);getHelp();\"");';

		$outputScript .= 'cpanelControls.help.push ("Feedback");';
		$outputScript .= 'cpanelControls.help.push ("onclick=\"hliteSub(this);startFeedback();\"");';

		$outputScript .= 'cpanelControls.help.push ("Terms / Privacy");';
		$outputScript .= 'cpanelControls.help.push ("onclick=\"hliteSub(this);getTerms();\"");';

		$outputScript .= 'cpanelControls.help.push ("About");';
		$outputScript .= 'cpanelControls.help.push ("onclick=\"hliteSub(this);getAbout();\"");';
		
		//$outputScript .= 'cpanelControls.help.push ("API");';
		//$outputScript .= 'cpanelControls.help.push ("onclick=\"hliteSub(this);getAPI();\"");';

		$this->json['script'] = $outputScript;
		$this->json['html'] = $outputHTML;
	}
	
	/**
	 *	get html to send invitation
	 *
	 */
	public function getinviteAction()
	{
		$this->disableLayout();

		$this->json['html'] = $this->render('invitation-form');
	}

	/**
	 * 
	 */
	public function signupAction()
	{
		$this->disableLayout();

		$errors = [];
		$success = false;

		$email = filter_input(INPUT_POST, 'email');
		$pass = filter_input(INPUT_POST, 'pass');
		$user = filter_input(INPUT_POST, 'user');

		//strip double spaces
		$user = trim(preg_replace('/\s\s+/', ' ', $user));

		$User = new User($this->db);

		$User->setName($user);
		$User->setEmail($email);
		$User->setPass($pass);

		if ($User->findUserName()) {
			array_push($errors, 'That user name is already taken!');
		}

		if (count($errors) < 1) {
			//all good
			$User->createNew();

			$success = true;
			$this->json['panelLeft'] = $this->Render('menu/menu-loggedin-left');
			$this->json['panelRight'] = $this->Render('menu/menu-loggedin-right');
		}

		$this->json['errors'] = $errors;
		$this->json['success'] = $success;
	}
}