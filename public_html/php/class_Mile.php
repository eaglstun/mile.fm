<?
class Mile
{

	var $db; //database connection 
	
	//dimensions
	var $footX = 1;
	var $footY = 1;
	var $scale = 72;
	var $mag = 1; //multiple feet in one block, kicks in at scale = 9
	var $feet = array(); // each foot has an entry 

	var $rendered = array(); //passed back to js to build the foot, has series of images assigned to footblock
	var $empty = array();

	function __construct(&$db)
	{
		$this->db = $db;
		include_once 'php/functions_redir.php';
	}
	
	//called to get the contents and echo as clickable images
	public function build($ajax = TRUE)
	{

		$empty = $this->feet;
		$emptyarr = array();

		foreach ($empty as $k => $v) {
			foreach ($v as $key => $val) {
				$emptyarr[$k . $val] = "";
			}
		}

		$empty = $emptyarr;

		$rendered = array();

		foreach ($this->feet as $col => $v) {

			foreach ($v as $k => $row) {
				
				//all the feet that do not have any content

				$tableX = str_pad(ceil($col / 80), 2, "0", STR_PAD_LEFT);
				$tableY = str_pad(ceil($row / 80), 2, "0", STR_PAD_LEFT);
				$table = "c" . $tableX . "r" . $tableY;

				$maxInchX = ($col * 12);
				$minInchX = $maxInchX - 12;

				$maxInchY = ($row * 12);
				$minInchY = $maxInchY - 12;

				$sql = "SELECT * FROM content_history H WHERE 
						`top` >= $minInchY AND
						`top` < $maxInchY AND
						`left` >= $minInchX AND 
						`left` < $maxInchX ";


				$result = $this->db->exec($sql);

				foreach ($result as $k => $v) {
						
					//this is where we will actually render the block with the pictures positioned
					$footblock = ceil( ($v['left'] + 1) / 12) . ceil( ($v['top'] + 1) / 12);

					if (!isset($rendered[$footblock])) {
						if ($ajax) {
							$rendered[$footblock] = "";
						} else {
							$rendered[$footblock] = array(
								'img' => '',
								'mileX' => $row,
								'mileY' => $col
							);
						}
					}

					if (isset($empty[$footblock])) {
						unset($empty[$footblock]);
					}


					$width = ($v['right'] - $v['left']) * $this->scale;
					$height = ($v['bottom'] - $v['top']) * $this->scale;
					$left = ( ($v['left'] * $this->scale) % ($this->scale * 12)) . "px";
					$top = ( ($v['top'] * $this->scale) % ($this->scale * 12)) . "px";
					$id = $v['id'];

					if ($v['has_nudity'] == 0 || (isset($_SESSION['show_nudity']) && $_SESSION['show_nudity'] == 1)) {
						//show nudey picture or normal picture
						$loc = '/content/thumbs/' . $v['thumb'];

						$link = '<a href="/' . base_base2base($id, 10, 59) . '">';

						$img = "<img id=\"pic$id\" from=\"$k\" src=\"$loc\" width=\"$width\" height=\"$height\" class=\"milePic\" style=\"top:$top;left:$left;\"/>";
					} else {
						//show nudity warning
						$loc = '/content/thumbs/nudity.png';

						$img = "<img id=\"pic$id\" from=\"$k\" src=\"$loc\" width=\"$width\" height=\"$height\" class=\"milePic\" style=\"top:$top;left:$left;\"/>";
					}

					$img = $link . $img . '</a>';

					if ($ajax) {
						//send back an array of images
						$rendered[$footblock] .= $img;
					} else {
						//send back array with extra info to build html
						$rendered[$footblock]['img'] .= $img;
					}

				}
			}
		}

		$this->empty = $empty;
		$this->rendered = $rendered;

		return $rendered;
	}
	
	//called to build a static image with the contents, at a scale
	function render()
	{
		//the boundaries of the foot
		$minX = ($this->footX * 12) - 12;
		$maxX = $minX + (12 * $this->mag);
		$minY = ($this->footY * 12) - 12;
		$maxY = $minY + (12 * $this->mag);

		$sql = "SELECT * FROM content_history WHERE
				`right` >= '$minX' AND 
				`left` <= '$maxX' AND
				`bottom`>= '$minY' AND
				`top` <= '$maxY'";

		$result = $this->db->exec($sql);
		
		//create the new image
		$dim = ($this->scale * 12) * $this->mag; // 0 - 864, this needs to change to accomodate mag
		$image = imagecreatetruecolor($dim, $dim);		
		
		//transparent image
		imagesavealpha($image, true);
		$trans_colour = imagecolorallocatealpha($image, 255, 0, 0, 127);
		imagefill($image, 0, 0, $trans_colour);

		foreach ($result as $k => $v) {
			//dbug($v);
			$relLeft = ($v['left'] - $minX) * $this->scale;
			$relTop = ($v['top'] - $minY) * $this->scale;

			$width = ceil( ($v['right'] - $v['left']) * $this->scale);
			$height = ceil( ($v['bottom'] - $v['top']) * $this->scale);

			$path = 'content/original/' . $v['content'];
			$filetype = exif_imagetype($path);

			switch ($filetype) {
				case 1:
					$source = imagecreatefromgif($path);
					$this->extension = "gif";
					break;
				case 2:
					$source = imagecreatefromjpeg($path);
					$this->extension = "jpg";
					break;
				case 3:
					$source = imagecreatefrompng($path);
					$this->extension = "png";
					break;
			}

			list($oWidth, $oHeight) = getimagesize($path);
			
			//imagecopyresampled($image, $source, int dst_x, int dst_y, int src_x, int src_y, int dst_w, int dst_h, int src_w, int src_h);
			imagecopyresampled($image, $source, $relLeft, $relTop, 0, 0, $width, $height, $oWidth, $oHeight);
		}
		
		//write the image
		$filepath = "renders/scale/" . $this->scale;
		$filename = "x" . $this->footX . "y" . $this->footY . ".png";

		if (!is_dir($filepath)) {
			mkdir($filepath, 0777);
		}

		imagepng($image, $filepath . '/' . $filename);
	}
	
	//takes posted array and sets to internal array
	function setFeet($postArray)
	{
		foreach ($postArray as $k => $v) {
			$a = explode(",", $v);
			$a = array_unique($a);
			sort($a);

			$this->feet[$k] = $a;
		}
		
		//dbug($this->feet, 'feet' );
	}
	
	//sets the scale 72 - down;
	function setScale($scale = 72)
	{
		$this->scale = $scale;
	}
	
	//bye bye
	function __destruct()
	{

	}
}