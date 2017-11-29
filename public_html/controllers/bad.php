<?php
class badMVC extends Action
{
	function init()
	{
		$this->br = new browser();
		$this->template = 'static';
	}

	function indexAction()
	{
		$browser = $_REQUEST['browser'];

		$this->vars['browser'] = $browser;
		$this->vars['br'] = $this->br->get();

		$this->view = 'badbrowser';
	}
}