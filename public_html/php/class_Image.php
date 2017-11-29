<?
class Image
{

	var $now = ''; //time stamp
	var $path = ''; //the path to the original image we are inserting

	var $basename = ''; // the new filename without extension 
	var $exiftype = 2; // see php.net/exif_imagetype
	var $extension = 'jpg'; //gif, png etc 
	var $newname = ''; //the full name of the new image - with extension 
	var $dims = array(
		'width' => 0,
		'height' => 0
	);
	var $resized = false; //flag if resized
	var $source = ''; //raw data of the image 

	var $userid = 0; //user id of the inserter 

	var $from = 1; // 0 - upload, 1 - external link

	var $db = '';

	function __construct(&$db)
	{
		$this->now = time();
		$this->userid = $_SESSION['userid'];
		$this->db = $db;
	}
	
	//load image 
	public function load($path)
	{

		$this->path = $path;
		
		//load the raw data into $source 
		$this->exiftype = @exif_imagetype($path);

		switch ($this->exiftype) {
			case 1:
				$this->source = imagecreatefromgif($path);
				$this->extension = "gif";
				break;
			case 2:
				$this->source = imagecreatefromjpeg($path);
				$this->extension = "jpg";
				break;
			case 3:
				$this->source = imagecreatefrompng($path);
				$this->extension = "png";
				break;
			case 6:
				/*
				$this->source = imagecreatefrombmp($path);
				$this->extension = "png";
				 */
				return false;
				break;
		}

		$explode = explode('/', $path);
		$basename = $explode[count($explode) - 1];
		$explode = explode('.', $basename);
		
		//rid of any funky characters
		$this->basename = preg_replace('/[^0-9a-z ]+/i', '', $explode[0]);
		
		//image dimensions
		list($this->dims['width'], $this->dims['height']) = getimagesize($path);

		return $this->exiftype;
	}
	
	//resize and crop image for user thumbnail
	public function userThumb()
	{

		$tmp = imagecreatetruecolor(72, 72);
		
		//resize to 72 in the smaller direction 
		if ($this->dims['height'] < $this->dims['width']) {
			$width = (72 / $this->dims['height']) * $this->dims['width'];
			$height = 72;
			//wider than tall
			$offset_left = ($width - 72) / -2;
			$offset_top = 0;
		} else {
			$height = (72 / $this->dims['width']) * $this->dims['height'];
			$width = 72;
			//taller than wide
			$offset_top = ($height - 72) / -2;
			$offset_left = 0;
		}

		imagecopyresampled($tmp, $this->source, $offset_left, $offset_top, 0, 0, $width, $height, $this->dims['width'], $this->dims['height']);

		$path = "content/profile/" . $this->newname;

		switch ($this->exiftype) {
			case 1:
				imagegif($tmp, $path);
				break;
			case 2:
				imagejpeg($tmp, $path, 60);
				break;
			case 3:
				imagepng($tmp, $path);
				break;
		}
		
		//imagecopyresampled(resource dst_image, $this->source, int dst_x, int dst_y, int src_x, int src_y, int dst_w, int dst_h, int src_w, int src_h);

	}
	
	//resize image to maximum dimension - do not write. 
	public function resize($max)
	{
		if ($this->dims['width'] > $this->dims['height']) {
			//wider than tall
			$width = $max;
			$height = round( ($width / $this->dims['width']) * $this->dims['height']);
		} else {
			//taller than wide
			$height = $max;
			$width = round( ($height / $this->dims['height']) * $this->dims['width']);
		}

		if ($width < $this->dims['width'] || $this->exiftype == 6) {
			//if the resized dims are smaller than original
			//always resample bmp

			$this->resized = true;
			
			//the new temporaqry image
			$tmp = imagecreatetruecolor($width, $height);
			
			//do the resizeing and merge into $tmp
			imagecopyresampled($tmp, $this->source, 0, 0, 0, 0, $width, $height, $this->dims['width'], $this->dims['height']);
		
			//put the new, resized image into as the source 
			$this->source = $tmp;

			$this->dims['width'] = $width;
			$this->dims['height'] = $height;

			return $this->dims;
		} else {
			//the image is already an appropriate size
			$height = $this->dims['height'];
			$width = $this->dims['width'];

			$this->source = file_get_contents($this->path);

			return false;
		}
	}

	public function giveUniqueName()
	{
		//make a name for the image - 
		//first 4 characters - substr 4,4 of md5 of current timestamp
		//next up to 12 chars - first 12 characters of original file name
		//next is userid
		//lowercase extension 

		$this->newname = substr(md5($this->now), 4, 4) . substr($this->basename, 0, 12) . $this->userid . "." . $this->extension;


		return $this->newname;
	}
	
	//resize and write thumbnail 
	private function makeThumb()
	{
		$path = "content/thumbs/" . $this->newname;
		
		//resize to 72 in the smaller direction 
		if ($this->dims['height'] < $this->dims['width']) {
			$width = (72 / $this->dims['height']) * $this->dims['width'];
			$height = 72;
			//wider than tall
			$offset_left = ($width - 72) / -2;
			$offset_top = 0;
		} else {
			$height = (72 / $this->dims['width']) * $this->dims['height'];
			$width = 72;
			//taller than wide
			$offset_top = ($height - 72) / -2;
			$offset_left = 0;
		}

		$tmp = imagecreatetruecolor(72, 72);
		
		//we may need to read source back into the object , if the image was not resized 

		if (!$this->resized) {
			$orgpath = "content/original/" . $this->newname;
			switch ($this->exiftype) {
				case 1:
					$this->source = imagecreatefromgif($orgpath);
					break;
				case 2:
					$this->source = imagecreatefromjpeg($orgpath);
					break;
				case 3:
					$this->source = imagecreatefrompng($orgpath);
					break;
				case 6:
					$this->source = imagecreatefrombmp($orgpath);
					break;
			}
		}

		imagecopyresampled($tmp, $this->source, $offset_left, $offset_top, 0, 0, $width, $height, $this->dims['width'], $this->dims['height']);

		switch ($this->exiftype) {
			case 1:
				imagegif($tmp, $path);
				break;
			case 2:
				imagejpeg($tmp, $path, 60);
				break;
			case 3:
				imagepng($tmp, $path);
				break;
			case 6:
				imagebmp($tmp, $path);
				break;
		}
	}

	public function insert()
	{
		$sql = "INSERT INTO eric_mile_users.content_waiting
				(`userid`, `stamp`, `loc`, `orig_loc`, `from`, `width`, `height`)
				VALUES
				('{$this->userid}', '{$this->now}', '{$this->newname}', '{$this->path}', '{$this->from}', '{$this->dims['width']}', '{$this->dims['height']}')";
		
		//write original file 
		$path = "content/original/" . $this->newname;
		if ($this->resized) {
			//need to resave - the image has been resized
			switch ($this->exiftype) {
				case 1:
					//gif
					imagegif($this->source, $path);
					break;
				case 2:
					//jpg
					imagejpeg($this->source, $path, 85);
					break;
				case 3:
					//png
					imagepng($this->source, $path);
					break;
			}
		} else {
			//move file to location, do not recompress
			file_put_contents($path, $this->source);
			//
		}

		$this->db->execute($sql);
		
		//make a thumbnail 
		$this->makeThumb();

		return array(
			'width' => $this->dims['width'],
			'height' => $this->dims['height']
		);
	}
}