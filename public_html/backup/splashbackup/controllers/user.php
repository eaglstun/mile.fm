<?
class mvc extends Action{

	function init(){
		require_once('php/class_User.php' );	
		$this->db = new DB();
	}
	
	function indexAction(){
	
	} 
	
	function forgotAction(){
		$start = microtime();
		$this->disableLayout();
		
		$email = trim($_POST['email']);
		
		if(!$email){
			$this->json['success'] = false;
			$this->json['message'] = 'Please enter an email.';
			return false;
		}
		
		$sql = "SELECT * FROM user_list 
				WHERE `email` LIKE '$email' AND 
				`email` != '' 
				LIMIT 1";
				
		$result = $this->db->exec($sql);
		
		if(!count($result)){
			$this->json['success'] = false;
			$this->json['message'] = 'That email was not found.';
			return false;
		}
		
		$id = $result[0]['id'];
		$username = $result[0]['user'];
		
		//assemble a new email
		include('php/class_Email.php' );
		$e = new Email();
		
		//get a new password
		$sql = "SELECT * FROM randomwords ORDER BY RAND() LIMIT 2";
		$result = $this->db->exec($sql);
		$temppass = $result[0]['word'].$result[1]['word'].rand(10, 99);
		
		$this->vars['username'] = $username;
		$this->vars['temppass'] = $temppass;
		
		$body = $this->render('user-resetpassword' );
		
		$e->addTo($email);
		$e->setSubject('Reset password for MILE.fm' );
		$e->setBody($body);
		$e->sendMail();
		
		$this->json['success'] = true;
		$this->json['message'] = 'You have been sent a temporary password.';
		
		$mtemppass = md5($temppass);
		
		$sql = "UPDATE user_list
				SET `passTemp` = '$mtemppass' 
				WHERE `id` = '$id' 
				LIMIT 1";
				
		$this->db->execute($sql);		
			
		$end = microtime();
		
		if($end - $start < 1){
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
		}
		
		$this->json['sql'] = $user->sql;
		
		$this->json['success'] = $success;
		$end = microtime();
		
		if($end-$start < 1){
			sleep(1);
		}
	}
	
	//request access to alpha
	function requestAction(){
		$start = microtime();
		$this->disableLayout();
		
		$stamp = time();
		$email = $_POST['email'];
		
		$sql = "SELECT * 
				FROM list_invite
				WHERE email = '$email'";
				
		$result = $this->db->exec($sql);
		
		if (count($result)){
			$this->json['msg'] = "You have already requested information!";
		} else {
			$sql = "INSERT INTO list_invite
			(`email`, `friend`, `date`)
			VALUES
			('$email', '0', $stamp)";
			
			$result = $this->db->execute($sql);
			
			$this->json['msg'] = "Thank you! We will send you an email soon!";
		}
		
		$end = microtime();
		if($end-$start < 1){
			sleep(1);
		}
	}
}
?>