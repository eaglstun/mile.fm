<?
class fixMVC extends Action{
	function indexAction(){
		
	}
	
	//clear all history and mile entries ! oh noes 
	function eraseAction(){
		/*
		ob_end_clean();
		
		$this->disableLayout();
		
		//delete the history
		$sql = "DELETE FROM history";
		$this->db->execute($sql);
		
		//delete the current active
		$sql = "DELETE FROM user_currentActive";
		$this->db->execute($sql);
		
		//delete the friends
		$sql = "DELETE FROM user_friends";
		$this->db->execute($sql);
		
		for($c=0; $c<63; $c++){
			for($r=0; $r<63; $r++){
				$col = str_pad($c, 2, '0', STR_PAD_LEFT);
				$row = str_pad($r, 2, '0', STR_PAD_LEFT);
				
				$sql = "DELETE FROM mile_mile.c".$col."r".$row;
				echo $sql."<br>";
				$this->db->execute($sql);
			}
		}
		
		die();
		*/
	}	
}