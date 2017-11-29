<?php
class imageMVC extends Action
{
	//render an image for the scaled mile
	function init()
	{
		include('php/class_Mile.php');
	}

	function indexAction()
	{
		$this->disableLayout();
		ob_end_clean();

		$mileX = $_REQUEST['mileX'];
		$mileY = $_REQUEST['mileY'];
		$scale = $_REQUEST['scale'];
		$mag = $_REQUEST['mag'];

		$path = 'mile/x' . ceil($mileX / 80) . 'y' . ceil($mileY / 80) . '/';
		$renderPath = 'renders/scale/' . ( (1 / $scale) * 72) . '/x' . $mileX . 'y' . $mileY . ".png";

		if (!is_dir($path)) {
			makedir($path);
		}

		$fileName = 'x' . $mileX . 'y' . $mileY . 'scale' . $scale . '.jpg';

		if (!is_file($path . $fileName)) {
			//pixel width of one block / image 
			$size = (864 / $scale) * $mag;

			$width = $size;
			$height = $size;
			
			//resize the image if will overflow bounds of the mile
			if ( ($mileX + $mag - 1) > 5280) {
				$width = ( (5280 - $mileX) / $mag) * $size;
			}

			if ( ($mileY + $mag - 1) > 5280) {
				$height = ( (5280 - $mileY) / $mag) * $size;
			}
			
			//dbug($width, 'w' );
			//dbug($height, 'h' );

			$tmp = imagecreatetruecolor($width, $height);
			$bkscale = 864 / $scale;
			//$source = imagecreatefromjpeg('static/pebbles.jpg' );
			$source = imagecreatefromjpeg('static/white.jpg');
			//$bkcolor = imagecolorallocate($tmp, 99, 88, 77); //rocks avg color
			$bkcolor = imagecolorallocate($tmp, 255, 255, 255); //white color
			imagefill($tmp, 0, 0, $bkcolor);

			if ($bkscale > 30) {
				for ($x = 0; $x < $size; $x += $bkscale) {
					for ($y = 0; $y < $size; $y += $bkscale) {
						imagecopyresampled($tmp, $source, $x, $y, 0, 0, $bkscale, $bkscale, 864, 864);
						//imagecopyresampled(resource dst_image, resource src_image, int dst_x, int dst_y, int src_x, int src_y, int dst_w, int dst_h, int src_w, int src_h)
					}
				}
			}

			if (!is_file($renderPath)) {
				//a scaled render of this foot does not exist. make one
				$mile = new Mile($this->db);
				$mile->footX = $mileX;
				$mile->footY = $mileY;
				$mile->scale = ( (1 / $scale) * 72);
				$mile->mag = $mag;

				$mile->render();
			}

			$render = imagecreatefrompng($renderPath);
			imagecopy($tmp, $render, 0, 0, 0, 0, ( (864 / $scale) * $mag), ( (864 / $scale) * $mag));

			imagejpeg($tmp, $path . $fileName, 60);
			//imagecopyresampled($tmp, $source , 0, 0, 0, 0, $bkscale, $bkscale, 864, 864);
		}
		
		//header("Cache-Control: no-cache, must-revalidate");
		header("Content-type: image/jpeg");
		header("Expires: Mon, 26 Jul 2009 05:00:00 GMT");
		header("Pragma: no-cache");

		echo file_get_contents($path . $fileName);

		die();
	}
}

//make directories recursively
function makedir($path)
{
	$npath = '';

	$explode = explode('/', $path);
	foreach ($explode as $k => $v) {
		$npath .= $v . '/';
		if (!is_dir($npath)) {
			mkdir($npath, 0777);
			//dbug($npath);
		}

	}

}