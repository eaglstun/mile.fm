<?
class renderMVC extends Action{
	function init(){
		include('php/class_Mile.php' );
	}
	
	function indexAction(){
		$this->disableLayout();
		
		$mile = new Mile($this->db);
		$mile->footX = $_REQUEST['x'];
		$mile->footY = $_REQUEST['y'];
		$mile->scale = isset($_REQUEST['scale']) ? $_REQUEST['scale'] : 72;
		
		$mile->render();
	}
	
}
?>
