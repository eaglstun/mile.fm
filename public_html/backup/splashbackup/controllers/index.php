<?
class mvc extends Action{
	function indexAction(){
	
		if(trim($this->helper)){
			$this->redir();
		}
		
		//load twits
		
		$sql = "SELECT * FROM twitter_rec 
				ORDER BY `stamp` DESC";
		
		$result = $this->db->exec($sql);
		
		
		//include('gamma/php/class_Twitter.php' );

		//$twitter = new Twitter();
		
		//$json = $twitter->getRecent();
		
		//$php = json_decode($json);
		
		
		$sql = "SELECT * FROM fm
				ORDER BY RAND() 
				LIMIT 1";
				
		$result = $this->db->exec($sql);
		$fm = $result[0]['fm'];
		
		$this->vars['fm'] = $fm;
		//$this->vars['twits'] = ($php) ;
		
	}
	
	//tiny link
	function redir(){
		include('php/functions_redir.php' );
		$this->disableLayout();
		
		$tiny = $this->helper;
		
		echo "tiny: ".$tiny;
		$big = base_base2base($tiny, 59, 10);
		echo "<br/>big: ".$big;
		
		$tiny = base_base2base($big, 10, 59);
		echo "<br/>tiny: ".$tiny;
		
		$sql = "SELECT * FROM content_history 
				WHERE `id` = '$big' 
				LIMIT 1";
		$res = $this->db->exec($sql);
		
		echo "<br/>$sql";
		
		if(count($res) < 1){
			$this->Redirect();
		}
		
		$res = $res[0];
		dbug($res);
		
		$link = "#";
		
		$x = ($res['left'] + (($res['right'] - $res['left']) / 2)) * 72;
		$y = ($res['top'] + (($res['bottom'] - $res['top']) / 2)) * 72;
		
		$link .= "x=".$x."&y=".$y."&select=".$big;
		
		dbug($link);
		
		$this->Redirect('gamma/'.$link);
		exit();
	}
}
?>
