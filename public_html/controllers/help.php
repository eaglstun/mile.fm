<?
class helpMVC extends Action
{

	function init()
	{
		if ($this->isAjax()) {
			$this->disableLayout();
		}
	}

	function indexAction()
	{
		$this->Redirect('help/main');
	}
	
	//main help launch pad 
	function mainAction()
	{

		$lightboxContent = $this->Render('help');

		if ($this->isAjax()) {
			$this->json['html'] = $lightboxContent;
		} else {
			$this->vars['lightboxContent'] = $lightboxContent;
			$this->vars['lightboxTitle'] = 'Help!';

			$this->parseURL('index');
		}

	}
	
	//terms / privacvy
	function termsAction()
	{

		$lightboxContent = $this->Render('help/terms');

		if ($this->isAjax()) {
			$this->json['html'] = $lightboxContent;
		} else {
			$this->vars['lightboxContent'] = $lightboxContent;
			$this->vars['lightboxTitle'] = 'Terms and Conditions / Privacy Policy';

			$this->parseURL('index');
		}
	}
	
	//about
	function aboutAction()
	{

		$lightboxContent = $this->Render('help/about');

		if ($this->isAjax()) {
			$this->json['html'] = $lightboxContent;
		} else {
			$this->vars['lightboxContent'] = $lightboxContent;
			$this->vars['lightboxTitle'] = 'About MILE.fm';

			$this->parseURL('index');
		}
	}
	
	//about
	function APIAction()
	{

		$lightboxContent = $this->Render('help/API');

		if ($this->isAjax()) {
			$this->json['html'] = $lightboxContent;
		} else {
			$this->vars['lightboxContent'] = $lightboxContent;
			$this->vars['lightboxTitle'] = 'API for Developers';

			$this->parseURL('index');
		}
	}
	
	
	//content to go into ajax lightbox 
	function feedbackAction()
	{

		$lightboxContent = $this->Render('help/feedback');

		if ($this->isAjax()) {
			$this->json['html'] = $lightboxContent;
		} else {
			$this->vars['lightboxContent'] = $lightboxContent;
			$this->vars['lightboxTitle'] = 'Send Feedback';

			$this->parseURL('index');
		}

	}
	/*
	//process feedback
	function feedbackAction(){
		
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
	 */
}