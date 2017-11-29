<?php

class refMVC extends Action
{
	function init()
	{
		$this->disableLayout();
		include_once('php/functions_redir.php');
	}

	function indexAction()
	{
		if (isset($this->helper)) {
			//generic refer, count
			$ref = $this->helper;
			$sql = "SELECT * FROM eric_mile_users.ref 
					WHERE `ref` = '$ref' 
					LIMIT 1";
			$res = $this->db->exec($sql);

			if (count($res) < 1) {
				echo "not found";
				session_destroy();
				die();
			}

			if ($res[0]['count'] < $res[0]['limit']) {
				//all good
				
				//increment views
				$sql = "UPDATE ref 
						SET view = (view + 1) 
						WHERE `id`='{$res[0]['id']}' 
						LIMIT 1";
				$this->db->execute($sql);

				$_SESSION['ref'] = $ref;

				$this->Redirect('');
			} else {
				//oh noes! too many peoples
				echo "so sorry";
				session_destroy();
				die();
			}
		} else {
			//specific ref, from invite

		}


	}
	
	//direct invite from friend
	function friendAction()
	{
		$uemail = $_REQUEST['email'];
		$id = $_REQUEST['id'];

		$uid = base_base2base($id, 59, 10);

		$sql = "SELECT * FROM list_invite 
				WHERE `friend` = '$uid' AND `email` = '$uemail' 
				LIMIT 1";

		$res = $this->db->exec($sql);
		
		//not found!
		if (!count($res)) {
			session_destroy();
			$this->Redirect('');
		}

		$_SESSION['ref'] = "friend";

		$this->Redirect('');
	}
	
	//invite from admin
	function inviteAction()
	{
		$i = $_REQUEST['i'];
		$email = $_REQUEST['e'];

		$date = base_base2base($i, 59, 10);

		$sql = "SELECT * FROM list_invite 
				WHERE `email` = '$email' AND
				`date` = '$date' AND
				`accept` = '0' 
				LIMIT 1";

		$res = $this->db->exec($sql);

		if (count($res) < 1) {
			$this->Redirect();
		}

		$_SESSION['ref'] = "inforequest";
		$_SESSION['email'] = $email;

		$this->Redirect('');
	}
}