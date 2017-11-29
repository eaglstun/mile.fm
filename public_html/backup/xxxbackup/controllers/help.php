<?
class mvc extends Action{
	function indexAction(){
		
	}
	
	//main help launch pad 
	function mainAction(){
		$this->disableLayout();
		
		echo $this->Render('help' );
	}
	
	//terms / privacvy
	function termsAction(){
		$this->disableLayout();
		
		echo $this->Render('help-terms' );
	}
	
	//about
	function aboutAction(){
		$this->disableLayout();
		
		echo $this->Render('help-about' );
	}
	
	//about
	function APIAction(){
		$this->disableLayout();
		
		echo $this->Render('help-API' );
	}
	
	//process feedback
	function feedbackAction(){
		$this->disableLayout();
		
		$username = $_POST['username'];
		$browser = $_POST['browser'];
		$feedback = $_POST['feedback'];
		
		$now = time();
		
		$sql = "INSERT INTO feedback 
				(`id`, `from`, `browser`, `feedback`, `stamp`) 
				VALUES 
				('', '$username', '$browser', '$feedback', '$now')";
				
		$this->db->execute($sql);
		
		$this->json['success'] = true;
		$this->json['html'] = 'Thanks for the feedback!  We look over all responses, and may be in contact with you.';
	}
}
?>
