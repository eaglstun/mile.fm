<?
include('../config.php' );
include('../php/class_DB.php' );
include('../php/functions_debug.php' );

$db = new DB();

$sql = "SELECT * FROM queue_renderdel 
		ORDER BY `stamp` DESC 
		LIMIT 2";
		
$res = $db->exec($sql);

foreach( $res as $k=>$v){
	//do it 4 times, to handle any overlaps in feet
	for ($xx = 0; $xx <=1; $xx++){
		for ($yy = 0; $yy <=1; $yy++){
		
			$x = $v['x'] + $xx;
			$y = $v['y'] + $yy;
			
			echo "x: $x y: $y <br/>";
			//delete any renders
			for ($scale = 18; $scale > .008; $scale /= 2){
				$renderPath = "../renders/scale/".$scale."/x".$x."y".$y.".png";
			
				if(is_file($renderPath)){
					unlink($renderPath);
					echo "do unlink: ".$renderPath."<br/>";
				} else {
					//echo "no unlink: ".$renderPath."<br/>";
				}
			}
				
			//delete any rendered feet
			for ($scale = 8; $scale <= 8192; $scale *= 2){
			
				$offset = ($scale / 8) * 2;
				
				$fx = ceil ($x / 80);
				$fy = ceil ($y / 80);
				
				$delx = ((ceil($x / $offset) - 1) * $offset) + 1;
				$dely = ((ceil($y / $offset) - 1) * $offset) + 1;
				
				echo "fx: $fx <br/>";
				$folder = 'x'.$fx.'y'.$fy;
				$file = 'x'.$delx.'y'.$dely;
				$renderPath = "../mile/".$folder."/".$file."scale".$scale.".jpg";
				
				if(is_file($renderPath)){
					unlink($renderPath);
					echo "do unlink: ".$renderPath."<br/>";
				} else {
					//echo "no unlink: ".$renderPath."<br/>";
				}
				
			}
			
			//remove record from db
			$sql = "DELETE FROM queue_renderdel 
					WHERE `x` = '$x' 
					AND `y` = '$y'";
					
			$db->execute($sql);
		}
		
	}
}


?>