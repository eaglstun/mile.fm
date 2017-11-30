<?php
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
}