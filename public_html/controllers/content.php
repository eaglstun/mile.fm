<?
class contentMVC extends Action
{

	function init()
	{
		include('php/class_Image.php');
	}

	//called via ajax to insert content from external link 
	function addAction()
	{
		$this->disableLayout();


		$userid = isset($_SESSION['userid']) ? $_SESSION['userid'] : false;
		if (!$userid) {
			$this->json['success'] = false;
			return;
		}

		$content = str_replace(" ", "%20", $_POST['content']);
		//check for http://
		if (stripos($content, 'http://') !== 0) {
			$content = 'http://' . $content;
		}

		$Image = new Image($this->db);
		
		//load the file into the image object and determine file type 
		if (!$this->json['exif'] = $Image->load($content)) {
			$this->json['success'] = false;
			$this->json['errors'] = 'File type not supported';
			$this->json['content'] = $content;
			return false;
		};
		
		//resize the image to 1 foot max 
		$Image->resize(864);

		$this->json['name'] = $Image->giveUniqueName();

		if ($this->json['dims'] = $Image->insert()) {
			$this->json['success'] = true;
		} else {
			$this->json['success'] = false;
		}
	}
	
	//voting on an image
	function voteAction()
	{
		$start = microtime();

		$ok = true;

		$this->disableLayout();
		
		//get posted variables
		$vote = $_POST['direction']; //direction -1= down, 1 = up
		$objectid = $_POST['objectid'];

		$userid = isset($_SESSION['userid']) ? $_SESSION['userid'] : false;

		if (!$userid) {
			$ok = false;
			$this->json['errormsg'] = 'Log in or Create your acount';
		} else {
			$now = time();

			$sql = "REPLACE INTO eric_mile_users.content_votes 
					(`userid`, `object`, `vote`, `stamp`) 
					VALUES 
					('$userid', '$objectid', '$vote', '$now')";

			$this->db->execute($sql);

			$this->vars['vote'] = $vote;
			$this->vars['objectid'] = $objectid;

			$this->json['vote'] = $this->Render('wordballoon-vote');
		}

		$this->json['success'] = $ok;

		if (microtime() - $start < .25) {
			usleep(250000);
		}
	}
}