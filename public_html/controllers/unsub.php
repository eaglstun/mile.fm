<?php
class unsubMVC extends Action
{
	function init()
	{
		include('php/functions_redir.php');
	}

	function indexAction()
	{
		$this->template = 'static';
		$this->view = 'unsub';
		
		//tiny code
		$code = $_REQUEST['u'];
		$email = $_REQUEST['e'];

		$id = base_base2base($code, 59, 10);

		$message = array();
		
		//see if they requested beta
		$sql = "SELECT * FROM list_invite 
				WHERE `id` = '$id' 
				AND `email` LIKE '$email' 
				LIMIT 1";
		$res = $this->db->exec($sql);

		if (count($res) > 0) {
			array_push($message, "Removed $email from the information request list.");

			$sql = "DELETE FROM list_invite WHERE `email` LIKE '$email' AND `id` = '$id' LIMIT 1";
			$this->db->execute($sql);
		} else {
			array_push($message, "$email was not found on the information request list.");
		}

		$this->vars['message'] = $message;
	}
}