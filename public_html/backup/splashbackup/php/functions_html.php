<?
	//build a list of <options> for galleries with $sel selected
	function buildGalleryOptions($db, $sel = 0){
		$sql = "SELECT * FROM galleries
				ORDER BY laststamp DESC";
		
		$result = $db->exec($sql);
		
		$block = '';
		foreach( $result as $k=>$v){
			$selected = ($v['id'] == $sel) ? 'selected="selected"' : ''; 
			$block .= '<option value="'.$v['id'].'" '.$selected.'>'.$v['title'].'</option>';
		}
		
		return $block;
	}
?>