<?php

class User
{
    protected $name; //login name
    protected $pass; //login password in md5 format
    protected $id; //the primary key of this user
    protected $email; //the email address of the user
    protected $maillist; //1 if the user recieves updates
    protected $refer; // the referrer who let this jerk in 

    protected $db; //database object

    public function __construct($db)
    {
        $this->db = $db;
    }
	
    /**
     * set the login username
     * @param string
     * @return 
     */
    function setName($name)
    {
        $this->name = trim(str_replace("  ", " ", $name));
    }
	
    /**
     * set the login password (pass in md5 value)
     * @TODO pass in raw
     * @param string
     * @return 
     */
    function setPass($pass)
    {
        $this->pass = trim($pass);
    }
	
	//set the email address
    function setEmail($email)
    {
        $this->email = trim($email);
    }
	
	//set the referrer of this user 
    function setRefer($refer)
    {
        $this->refer = trim($refer);
    }
	
	//make temp password
    public function resetPass()
    {

        $email = $this->email;

        if (!trim($email)) {
            return false;
        }

        $sql = "SELECT * FROM user_list 
				WHERE email LIKE '$email' 
				LIMIT 1";

        $res = $this->db->exec($sql);

        if (!count($res)) {
            return false;
        }

        $id = $res[0]['id'];
        $user = $res[0]['user'];

        $sql = "SELECT * FROM randomwords ORDER BY RAND() LIMIT 2";
        $res = $this->db->exec($sql);

        $passTemp = ($res[0]['word'] . $res[1]['word']);
        $md5Temp = md5($passTemp);

        $sql = "UPDATE user_list 
				SET `passTemp` = '$md5Temp'
				WHERE `id` = '$id' LIMIT 1";
        $this->db->execute($sql);
		
		//then send out the email
        global $action;
        $action->vars['user'] = $user;
        $action->vars['passTemp'] = $passTemp;

        $body = $action->Render('email/password-reset');

        include('php/class_Email.php');
        $Email = new Email();
        $Email->addTo($email);
        $Email->setSubject('Password Reset for MILE.fm');
        $Email->setBody($body);
        $Email->sendMail();

        return true;
    }
	
	//commit the password to the database
    function updatePassword()
    {
        $pass = $this->pass;
        $id = $this->getID();

        $sql = "UPDATE user_list
				SET 
				pass='$pass',
				passTemp = ''
				WHERE id = '$id'
				LIMIT 1";

        $this->db->execute($sql);
    }
	
	//set if they receive newsletters/updates
	//1 if yes
    function setEmailList($val)
    {
        if ($val == 'off' || $val == 0 || $val == false) {
            $val = 0;
        } else {
            $val = 1;
        }

        $this->maillist = $val;
    }
	
	//perform a login
    function doLogin()
    {
        $name = $this->name;
        $pass = $this->pass;

        $sql = "SELECT `user`, `pass`, `id`, `priv`, `show_nudity`
				FROM user_list U
				LEFT JOIN user_prefs P
				    ON U.id = P.userid
				WHERE `user` = '$name' 
				AND (`pass` = '$pass' OR `passTemp` = '$pass')";

        $result = $this->db->exec($sql);
		
		//if there is not exactly 1 reusult, something went wrong
        if (count($result) != 1) {
            session_destroy();
            return false;
        }
		
		//if they are reffered, unset that
        unset($_SESSION['ref']);
		
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
		
		//show nudity or not
        $_SESSION['show_nudity'] = $result[0]['show_nudity'];

        $_SESSION['pngs'] = 1;

        return true;
    }
	
	//finds a user by their username
	//returns 1 if found and 0 if not found
    function findUserName()
    {
        $name = $this->name;

        $sql = "SELECT * FROM user_list
				WHERE user LIKE '$name'
				LIMIT 1";

        $result = $this->db->exec($sql);
        return count($result);
    }
	
	//log the user out
    function doLogout()
    {
        unset($_SESSION['userauth']);
        unset($_SESSION['userid']);
        unset($_SESSION['ref']);
    }
	
	//create a new user with variables of object
    public function createNew()
    {
        $user = $this->name;
        $pass = $this->pass;
        $email = $this->email;
        $maillist = $this->maillist;
        $refer = $this->refer;
        $now = time();
        $browser = $_SERVER['HTTP_USER_AGENT'];
		
		//create the user record
        $sql = "INSERT INTO user_list
				(user, pass, email, lastlogin, priv, invites, ref, browser)
				VALUES
				(?, ?, ?, ?, 1, 5, ?, ?)";

        $this->db->execute($sql, [$user, $pass, $email, $now, $refer, $browser]);
        
		//set session vars 
		//user id
        $id = $this->db->getLastID();
        $this->setID($id);

        $_SESSION['userid'] = $id;
		
		//if from refer, increment count 
        if (isset($_SESSION['ref'])) {
            $sql = "UPDATE eric_mile_users.ref 
					SET `count` = (`count` + 1) 
					WHERE `ref` = '$refer' LIMIT 1";

            $this->db->execute($sql);
			
			//if they are reffered, unset that
            unset($_SESSION['ref']);
        }
		
		//user auth 
        $this->setAuth(1);
		
		//user name
        $this->setNameSession($user);
		
		//update the invite list
        $sql = "UPDATE list_invite
				SET accept='1',
				date_accept='$now'
				WHERE email LIKE '$refer'
				OR email LIKE '$email'";

        $this->db->execute($sql);
		
		//create profile record
        $sql = "INSERT INTO user_profile 
				(userid, profile, pic) 
				VALUES 
				('$id', '', '')
				ON DUPLICATE KEY UPDATE userid = '$id'";

        $this->db->execute($sql);
    }
	
	//sets the userauth session amount.
	//1 is standard user
    function setAuth($privlevel)
    {
        $_SESSION['userauth'] = $privlevel;
    }
	//returns the user priv level
    function getAuth()
    {
        return $_SESSION['userauth'];
    }
	
	
	//sets the userid value
    function setID($id)
    {
        $this->id = $id;
    }
	
	//returns the userid value
    function getID()
    {
        $this->id = isset($_SESSION['userid']) ? $_SESSION['userid'] : false;
        return $this->id;
    }
	
	//sets the username value
    function setNameSession($user)
    {
        $_SESSION['username'] = $user;
    }
	//returns username value
    function getName()
    {
        return $_SESSION['username'];
    }
	
	//sets the last login timestamp, browser info, etc
    function updateLogin()
    {
        $browser = $_SERVER['HTTP_USER_AGENT'];
        $id = $_SESSION['userid'];
        $now = time();

        $sql = "UPDATE user_list
				SET 
				lastlogin = '$now',
				browser = '$browser'
				WHERE id = '$id'
				LIMIT 1";

        $result = $this->db->execute($sql);
    }
	
	
	
	//changes the users name
    function changeNameTo($name)
    {
        $this->setNameSession($name);

        $id = $this->getID();

        $sql = "UPDATE user_list
				SET user = '$name'
				WHERE id = '$id'
				LIMIT 1";

        $this->db->execute($sql);
    }
	
	//update the users email status
    function updateEmailRec()
    {
        $maillist = $this->maillist;

        $id = $this->getID();

        $sql = "UPDATE user_list
				SET maillist = '$maillist'
				WHERE id = '$id'
				LIMIT 1";
		//echo $sql;	
        $this->db->execute($sql);
    }

    function searchForUserName($name)
    {
        $sql = "SELECT id,user,email 
				FROM user_list
				WHERE user = '$info'";

        $result = $this->db->exec($sql);

        if (count($result) != 1) {
            return false;
        }

        return true;
    }

    function searchForUserEmail()
    {

    }

    function loadProfile()
    {
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
    function loadExternal()
    {
        $sql = "SELECT * 
				FROM external_sites E 
				LEFT JOIN user_external U 
				ON E.id = U.siteid 
				WHERE U.userid = '{$this->id}' 
				AND E.active = '1'
				AND U.username != '' 
				ORDER BY site ASC";

        $result = $this->db->exec($sql);

        foreach ($result as $k => $v) {
            $link = str_replace('%uname%', $v['username'], $v['url']);
            $link = str_replace('%uid%', $v['uid'], $link);

            $result[$k]['url'] = $link;
        }

        return $result;
    }
	
	//loadAdds
    function loadAdds($start = 0, $limit = 17)
    {

        $output = array();

        $sql = "SELECT * FROM content_history H 
				WHERE `userid` = '{$this->id}'
				ORDER BY `stamp` DESC
				LIMIT $start, $limit";

        $result = $this->db->exec($sql);

        foreach ($result as $k => $v) {

            $locX = ($v['left'] + ( ($v['right'] - $v['left']) / 2)) * 72;
            $locY = ($v['top'] + ( ($v['bottom'] - $v['top']) / 2)) * 72;

            array_push($output, array(
                'thumb' => $v['thumb'],
                'locX' => $locX,
                'locY' => $locY,
                'id' => 'pic' . $v['id']
            ));
        }

        return $output;
    }
	
	//loadComments
    function loadComments($start = 0, $limit = 17)
    {

        $output = array();

        $sql = "SELECT H.* FROM content_comments C 
				LEFT JOIN 
				content_history H 
				ON C.object = H.id
				WHERE C.userid = '{$this->id}'
				ORDER BY C.stamp DESC
				LIMIT $start, $limit";

        $result = $this->db->exec($sql);

        foreach ($result as $k => $v) {

            $locX = ($v['left'] + ( ($v['right'] - $v['left']) / 2)) * 72;
            $locY = ($v['top'] + ( ($v['bottom'] - $v['top']) / 2)) * 72;

            array_push($output, array(
                'thumb' => $v['thumb'],
                'locX' => $locX,
                'locY' => $locY,
                'id' => 'pic' . $v['id']
            ));
        }

        return $output;
    }

    function setLoc($x, $y)
    {
        $userid = $this->getID();

        if (!intval($userid)) {
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