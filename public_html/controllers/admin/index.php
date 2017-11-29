<?
class indexMVC extends Action
{
	function init()
	{
		if (isset($_SESSION['userauth']) && $_SESSION['userauth'] & 64) {
			//all good
		} else {
			$this->Redirect();
		}

		$this->theme = "admin";

	}

	function indexAction()
	{
		$this->view = "admin-main";
	}

	function dologinAction()
	{
		$User = new User($this->db);

		$User->setName($_POST['name']);
		$User->setPass(md5($_POST['pass']));

		$User->doLogin();

		if ($_SESSION['userauth'] & 64) {
			$this->Redirect('admin/home');
		} else {
			$this->Redirect('admin');
		}
	}

	function homeAction()
	{
		$this->view = "admin/home";
	}
}