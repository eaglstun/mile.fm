<?
class mvc extends Action{

	function init(){
		include('php/class_Image.php' );
	}

	//called via ajax to insert content from external link 
	function addAction(){
		$this->disableLayout();
		
		$content = str_replace(" ", "%20", $_POST['content']);
		$userid = $_SESSION['userid'];
		
		$Image = new Image($this->db);
		
		//load the file into the image object and determine file type 
		if (!$this->json['exif'] = $Image->load($content)){
			$this->json['success'] = false;
			$this->json['errors'] = 'File type not supported';
			$this->json['content'] = $content;
			return false;
		};
		
		//resize the image to 1 foot max 
		$Image->resize(864);
		
		$this->json['name'] = $Image->giveUniqueName();
		
		if($this->json['dims'] = $Image->insert()){
			$this->json['success'] = true;
		} else {
			$this->json['success'] = false;
		}
	}
	
	//voting on an image
	function voteAction(){
		$start = microtime();
		
		$ok = true;
		
		$this->disableLayout();
		
		//get posted variables
		$vote = $_POST['direction']; //direction -1= down, 1 = up
		$objectid = $_POST['objectid'];

		$userid = $_SESSION['userid'];
		
		if($userid < 1){
			$ok = false; 
		} else {		
			$now = time();
			
			$sql = "REPLACE INTO mile_users.content_votes 
					(`userid`, `object`, `vote`, `stamp`) 
					VALUES 
					('$userid', '$objectid', '$vote', '$now')";
					
			$this->db->execute($sql);
			
			$this->vars['vote'] = $vote;
			$this->vars['objectid'] = $objectid;
			
			$this->json['vote'] = $this->Render('wordballoon-vote' );
		}
		
		$this->json['success'] = $ok;
		
		$end = microtime();
		
		if($end - $start < .25){
			usleep(250000);
		}
	}
}
?>
