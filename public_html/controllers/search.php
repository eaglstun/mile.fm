<?

class searchMVC extends Action
{
	function init()
	{

	}

	function indexAction()
	{

		$menu2 = array();
		$menu2['content'] = $this->Render('search');
		$menu2['title'] = 'Search For an Image';
		$menu2['prev'] = '';
		$menu2['next'] = '';

		if ($this->isAjax()) {
			//lolwut
		} else {
			$this->vars['menu2'] = $menu2;
			$this->parseURL('index');
		}
	}
}