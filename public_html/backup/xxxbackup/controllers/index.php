<?
class mvc extends Action{
	function init(){
		if(!isset($_SESSION['userid'])){
			$this->Redirect('../' );
		}
	}
	
	function indexAction(){
		$this->vars['cpanel'] = $this->Render('cpanel' );
	}
}
?>
