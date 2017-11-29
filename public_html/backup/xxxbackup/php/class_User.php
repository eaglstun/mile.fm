<?

class User{
	var $name; //login name
	var $pass; //login password in md5 format
	var $id; //the primary key of this user
	var $email; //the email address of the user
	var $maillist; //1 if the user recieves updates
	var $refer; // the referrer who let this jerk in 
	
	var $db; //database object
	
	function User($db){
		$this->db = $db;
	}
	
	//set in the login username
	function setName($name){
		$this->name = $name;
	}
	
	//set the login password (pass in md5 value)
	function setPass($pass){
		$this->pass = $pass;
	}
	
	//commit the password to the database
	function updatePassword(){
		$pass = $this->pass;
		$id = $this->getID();
		
		$sql = "UPDATE eric_mile_users.user_list
				SET 
				pass='$pass',
				passTemp = ''
				WHERE id = '$id'
				LIMIT 1";
				
		$this->db->execute($sql);
	}
	
	//set the email address
	function setEmail($email){
		$this->email = $email;
	}
	
	//set if they receive newsletters/updates
	//1 if yes
	function setEmailList($val){
		if ($val == 'off' || $val == 0 || $val == false){
			$val = 0;
		} else {
			$val = 1;
		}
		
		$this->maillist = $val;
	}
	
	//set the referrer of this user 
	function setRefer($refer){
		$this->refer = $refer;
	}
	
	//perform a login
	function doLogin(){
		$name = $this->name;
		$pass = $this->pass;
		
		$sql = "SELECT `user`, `pass`, `id`, `priv` 
				FROM eric_mile_users.user_list 
				WHERE `user` = '$name' 
				AND (`pass` = '$pass' OR `passTemp` = '$pass')";
				
		$result = $this->db->exec($sql);
		
		//if there is not exactly 1 reusult, something went wrong
		if (count($result) != 1){
			session_destroy();
			return false;
		}
		
		//set the userauth level to bitwise value
		//standard user = 1
		//advertiser = 4
		$this->setAuth($result[0]['priv']);
		
		//set the userid to their primary key value
		$this->setID($result[0]['id']);
		$_SESSION['userid'] = $result[0]['id'];
		
		//set their username
		$this->setName($result[0]['user']);
		$this->setNameSession($result[0]['user']);
		
		//update last login time
		$this->updateLogin();
		
		$_SESSION['pngs'] = 1;
		
		return true;
	}
	
	//finds a user by their username
	//returns 1 if found and 0 if not found
	function findUserName(){
		$name = $this->name;
		
		$sql = "SELECT * FROM eric_mile_users.user_list
				WHERE user = '$name'
				LIMIT 1";
		
		$result = $this->db->exec($sql);
		return count($result);
	}
	
	//log the user out
	function doLogout(){
		unset($_SESSION['userauth']);
		unset($_SESSION['userid']);
		unset($_SESSION['refer']);
		//unset();
		//unset();
	}
	
	//create a new user with variables of object
	function createNew(){
		$user = $this->name;
		$pass = $this->pass;
		$email = $this->email;
		$maillist = $this->maillist;
		$refer = $this->refer;
		$now = time();
		$browser = $_SERVER['HTTP_USER_AGENT'];
		
		//create the user record
		$sql = "INSERT INTO eric_mile_users.user_list
				(user, pass, email, login, maillist, priv, invites, ref, browser)
				VALUES
				('$user', '$pass', '$email', '$now', '$maillist', '1', '5', '$refer', '$browser')";
				
		$this->db->execute($sql);
		
		//echo $sql;
		
		//set session vars 
		//user id
		$this->id = $this->db->lastid;
		$this->setID($this->id);
		$_SESSION['userid'] = $id;
		
		//user auth 
		$this->setAuth(1);
		//user name
		$this->setNameSession($user);
		
		//update the invite list
		$sql = "UPDATE eric_mile_users.list_invite
				SET accept='1',
				date_accept='$now'
				WHERE email LIKE '$refer'
				OR email LIKE '$email'";
		
		$this->db->execute($sql);
	}
	
	//sets the userauth session amount.
	//1 is standard user
	function setAuth($privlevel){
		$_SESSION['userauth'] = $privlevel;
	}
	//returns the user priv level
	function getAuth(){
		return $_SESSION['userauth'];
	}
	
	
	//sets the userid value
	function setID($id){
		$this->id = $id;
	}
	
	//returns the userid value
	function getID(){
		$this->id = $_SESSION['userid'];
		return $_SESSION['userid'];
	}
	
	//sets the username value
	function setNameSession($user){
		$_SESSION['username'] = $user;
	}
	//returns username value
	function getName(){
		return $_SESSION['username'];
	}
	
	//sets the last login timestamp, browser info, etc
	function updateLogin(){
		$browser = $_SERVER['HTTP_USER_AGENT'];
		$id = $_SESSION['userid'];
		$now = time();
		
		$sql = "UPDATE eric_mile_users.user_list
				SET 
				lastlogin = '$now',
				browser = '$browser'
				WHERE id = '$id'
				LIMIT 1";
					
		$result = $this->db->execute($sql);
	}
	
	//sees if a user with a certain name exists
	//string insensitve
	//returns true if taken, false if available
	function checkUserName($name){
		$sql = "SELECT * FROM eric_mile_users.user_list 
				WHERE user LIKE '$name' LIMIT 1";
		
		$result = $this->db->exec($sql);
		
		if (count($result) ){
			return true;
		} else {
			return false;
		}
	}
	
	//changes the users name
	function changeNameTo($name){
		$this->setNameSession($name);
		
		$id = $this->getID();
		
		$sql = "UPDATE eric_mile_users.user_list
				SET user = '$name'
				WHERE id = '$id'
				LIMIT 1";
				
		$this->db->execute($sql);
	}
	
	//update the users email status
	function updateEmailRec(){
		$maillist = $this->maillist;
		
		$id = $this->getID();
		
		$sql = "UPDATE eric_mile_users.user_list
				SET maillist = '$maillist'
				WHERE id = '$id'
				LIMIT 1";
		//echo $sql;	
		$this->db->execute($sql);
	}
	
	function searchForUserName($name){
		$sql = "SELECT id,user,email 
				FROM eric_mile_users.user_list
				WHERE user = '$info'";
				
		$result = $this->db->exec($sql);
		
		if (count($result) !=1 ){
			return false;
		}
		
		return true;
	}
	
	function searchForUserEmail(){
	
	}
	
	function loadProfile(){
		$sql = "SELECT U.user, P.profile, IF(P.pic, P.pic, P.pic) as pic
				FROM user_list U
				LEFT JOIN 
				user_profile P
				ON U.id = P.userid
				WHERE U.id = '{$this->id}'
				LIMIT 1";
				
		$result = $this->db->exec($sql);
		
		return $result[0];
	}
	
	//return list of external logins for user 
	function loadExternal(){
		$sql = "SELECT * 
				FROM external_sites E 
				LEFT JOIN user_external U 
				ON E.id = U.siteid 
				WHERE U.userid = '{$this->id}' 
				AND E.active = '1'
				AND U.username != '' 
				ORDER BY site ASC";
				
		$result = $this->db->exec($sql);
		
		foreach( $result as $k=>$v){
			$link = str_replace('%uname%', $v['username'], $v['url']) ;
			$link = str_replace('%uid%', $v['uid'], $link) ;
			
			$result[$k]['url'] = $link;
		}
		
		return $result;
	}
	
	//loadAdds
	function loadAdds($start = 0){
	
		$output = array();
		
		$sql = "SELECT * FROM content_history H 
				WHERE `userid` = '{$this->id}'
				ORDER BY `stamp` DESC
				LIMIT $start, 17";
		
		$result = $this->db->exec($sql);
		
		foreach( $result as $k=>$v){
			
			$locX = ($v['left'] + (($v['right'] - $v['left']) / 2)) * 72;
			$locY = ($v['top'] + (($v['bottom'] - $v['top']) / 2)) * 72;
			
			array_push($output, array('thumb' => $v['thumb'],
									  'locX' => $locX, 
									  'locY' => $locY,
									  'id' => $v['id']));
		}
				
		return $output;
	}
	
	//loadComments
	function loadComments($start = 0){
	
		$output = array();
		
		$sql = "SELECT H.* FROM content_comments C 
				LEFT JOIN 
				content_history H 
				ON C.object = H.id
				WHERE C.userid = '{$this->id}'
				ORDER BY C.stamp DESC
				LIMIT $start, 17";
			
		$result = $this->db->exec($sql);
		
		foreach( $result as $k=>$v){
			
			$locX = ($v['left'] + (($v['right'] - $v['left']) / 2)) * 72;
			$locY = ($v['top'] + (($v['bottom'] - $v['top']) / 2)) * 72;
			
			array_push($output, array('thumb' => $v['thumb'],
									  'locX' => $locX, 
									  'locY' => $locY,
									  'id' => $v['id']));
		}
			
		return $output;		
	}
	
	function setLoc($x, $y){
		$userid = $this->getID();
		
		if(!intval($userid) ){
			return false;
		}
		
		$now = time();
		
		$sql = "REPLACE INTO user_currentActive
				(userid, user_x, user_y, stamp)
				VALUES
				('$userid', '$x', '$y', '$now')";
				
		$this->db->execute($sql);
		return true;
	}
}
?>