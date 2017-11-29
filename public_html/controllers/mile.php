<?
class mileMVC extends Action
{
	function indexAction()
	{
		$this->disableLayout();
	}
	
	//check overlap to see if we can add picture here 
	function addAction()
	{
		$start = microtime(true);
		$stamp = time();

		$this->disableLayout();

		$userid = isset($_SESSION['userid']) ? $_SESSION['userid'] : false;
		if (!$userid) {
			$this->json['success'] = false;
			return;
		}
		
		//the sql statements to insert the pic into the mile tables
		$sqlInsert = array();

		$delTables = array();
				
		//image dimensions, in inches
		$width = $_POST['width'];
		$height = $_POST['height'];
		
		//image position, in inches from top left, (0,0)
		$inchX = $_POST['inchX'];
		$inchY = $_POST['inchY'];
		
		//the image we have been posted
		$fileLoc = $_POST['fileLoc'];
		$fileLoc = str_replace('http://localhost/newsquare/beta/content/original/', '', $fileLoc); //bad

		$fileLoc = str_replace('http://mile.fm/', '', $fileLoc); //bad
		$fileLoc = str_replace('http://www.mile.fm/', '', $fileLoc); //bad

		$fileLoc = str_replace('/content/original/', '', $fileLoc);
		
		//lets see if we can do it 
		$success = false;
		
		//the table this goes into, based on 80 feet square, 1-66 (960 inches)
		$tableCol = floor( ($inchX / 960) + 1);
		$tableRow = floor( ($inchY / 960) + 1);
		
		//we are moving, not adding an image
		if (isset($_POST['id'])) {
			$moveid = $_POST['id'];
			$historyId = str_replace('pic', '', $moveid);
			
			//moving a picture, the tables the picture is in at start
			//select the table where this picture is
			$histSql = "SELECT * FROM content_history
			            WHERE `id` = '$historyId' 
			        	LIMIT 1";
			//$this->json['histSql'] = $histSql;

			$res = $this->db->exec($histSql);
			$histResult = $res[0];
			//$this->json['histResultLeft'] = $histResult['left'] / 960;

			$top = str_pad(floor( ($histResult['top'] / 960)) + 1, 2, '0', STR_PAD_LEFT);
			$right = str_pad(floor( ($histResult['right'] / 960) + 1), 2, '0', STR_PAD_LEFT);
			$bottom = str_pad(floor( ($histResult['bottom'] / 960) + 1), 2, '0', STR_PAD_LEFT);
			$left = str_pad(floor( ($histResult['left'] / 960) + 1), 2, '0', STR_PAD_LEFT);
			
			//top left
			$table = "c" . $left . "r" . $top;
			$delTables['topleft'] = $table;
			
			//top right
			$table = "c" . $right . "r" . $top;
			$delTables['topright'] = $table;
			
			//bottom right
			$table = "c" . $right . "r" . $bottom;
			$delTables['bottomright'] = $table;
			
			//bottom left			
			$table = "c" . $left . "r" . $bottom;
			$delTables['bottomleft'] = $table;

			$movingX = floor($histResult['left'] / 12) + 1;
			$movingY = floor($histResult['top'] / 12) + 1;

			$moving = true;
		} else {
			$moving = false;
		}
		
		//an array of all the tables we are updateing
		$tables = array();
		
		/*
		//the relative inch within the 80 foot block, for the top left corner of the image 
		$relX = ($inchX % 960) + 1;
		$relY = ($inchY % 960) + 1;
		 */

		$overlap = array();
		$check = array();
		
		//the bounderies coordinates for the image in inches, top left is 1,1
		$top = $inchY;
		$right = $inchX + $width;
		$bottom = $inchY + $height;
		$left = $inchX;
		
		
		
		
		
		//figure out all inches we are inserting 
		for ($x = $inchX; $x < ($inchX + $width); $x++) {
			for ($y = $inchY; $y < ($inchY + $height); $y++) {

				$tableX = str_pad(floor( ($x / 960) + 1), 2, 0, STR_PAD_LEFT);
				$tableY = str_pad(floor( ($y / 960) + 1), 2, 0, STR_PAD_LEFT);

				if (!isset($check[$tableX])) {
					$check[$tableX] = array();
				}
				
				//the col and row within the 80 foot block, 1-960
				$relX = ($x % 960) + 1;
				$relY = ($y % 960) + 1;

				if (!isset($check[$tableX][$tableY])) {
					$check[$tableX][$tableY] = array(
						'minX' => $relX,
						'minY' => $relY,
						'maxX' => $relX,
						'maxY' => $relY
					);
				}

				if ($x >= $check[$tableX][$tableY]['maxX']) {
					$check[$tableX][$tableY]['maxX'] = $relX;
				}

				if ($y >= $check[$tableX][$tableY]['maxY']) {
					$check[$tableX][$tableY]['maxY'] = $relY;
				}

				$table = "c" . $tableX . "r" . $tableY;

				$histSql = isset($historyId) ? $historyId : '';
				$sql = "INSERT INTO eric_mile_mile.$table 
						(col, row, userid, stamp ,historyId, type) 
						VALUES 
						('$relX', '$relY', '$userid', '$stamp', '$histSql', '1')";
				
				//adding the record into _squaremile
				array_push($sqlInsert, $sql);

			}
		}

		$result = array();

		$sqlA = array();

		foreach ($check as $c => $col) {
			foreach ($col as $r => $row) {
				$table = "c" . $c . "r" . $r;
				array_push($tables, $table);

				$sql = "SELECT col, row, historyId FROM eric_mile_mile.$table T 
						LEFT JOIN content_history H 
						ON T.historyId = H.id
						WHERE H.id IS NOT NULL AND
						T.col >= '{$row['minX']}' AND 
						T.col <= '{$row['maxX']}' AND 
						T.row >= '{$row['minY']}' AND 
						T.row <= '{$row['maxY']}' ";
				
				//$this->json['sql'] = $sql;
				//return;

				if ($moving) {
					$sql .= "AND T.historyId != '$historyId'";
				}

				$res = $this->db->exec($sql);

				array_push($sqlA, $sql);

				if (count($res) > 0) {
					foreach ($res as $k => $v) {
						array_push($result, array(
							'x' => ( ($c - 1) * 960) + $v['col'],
							'y' => ( ($r - 1) * 960) + $v['row'],
							'id' => $v['historyId']
						));
											/*'table' => $table,*/
					}
					
					//$this->json['sql'] = $sql;
				}
			}
		}

		$tables = array_unique($tables);

		$end = microtime(true);

		if ($end - $start < 1) {
			sleep(1);
		}
		
		//$this->json['sqlA'] = $sqlA;
		//if $result has elements, we have found overlaps.  send these back to the mile 
		if (count($result) > 0) {
			$this->json['success'] = false;
			$this->json['overlap'] = $result;

			return;
		}
		
		//all good. write the records 

		$this->json['success'] = true;


		if (count($delTables)) {
			$this->json['deltables'] = $delTables;
			$this->json['delSql'] = array();
			
			//delete the old mile records so we can update
			foreach ($delTables as $k => $v) {
				$delSql = "DELETE FROM eric_mile_mile.$v 
						   WHERE `historyId` = '$historyId'";

				$this->db->execute($delSql);

				array_push($this->json['delSql'], $delSql);

			}
		}
		
		//insert into the mile records 
		foreach ($sqlInsert as $k => $v) {
			$this->db->execute($v);
		}
		
		//if we are moving a picture, delete the orginal
		if ($moving) {

			$tableCol = floor( ($left / 960) + 1);
			$tableRow = floor( ($top / 960) + 1);

			$updateSql = "UPDATE content_history SET 
						 `tableCol` = '$tableCol',
						 `tableRow` = '$tableRow',
						 `top` = '$top',
						 `right` = '$right',
					 	 `bottom` = '$bottom',
					  	 `left` = '$left'
						 WHERE `id` = '$historyId' 
						 LIMIT 1";

			$this->db->execute($updateSql);
			
			
			//$this->json['updateSql'] = $updateSql;

		} else {
			//this is an addition from the waiting list.  
			//get the file information from the waiting list 

			$fileLoc = str_replace('/content/original/', '', $fileLoc);

			$sql = "SELECT orig_loc, orig_page FROM content_waiting 
					WHERE `userid` = '$userid' 
					AND `loc` = '$fileLoc' 
					LIMIT 1";

			$result = $this->db->exec($sql);
			if (!isset($result[0])) {
				$this->json['success'] = false;
				return false;
			}

			$orig_loc = $result[0]['orig_loc'];

			$sql = "";
			
			//write the history record
			$sql = "INSERT INTO content_history
					(`userid`, `content`, `thumb`, `stamp`, 
					 `tableCol`, `tableRow`, `top`, `right`, `bottom`, `left`, `orig_loc`) 
					VALUES 
					('$userid', '$fileLoc', '$fileLoc', '$stamp', 
					 '$tableCol', '$tableRow', '$top', '$right', '$bottom', '$left', '$orig_loc')";

			$this->db->execute($sql);

			$insertid = $this->db->getLastID();
			
			//update the mile records with the insert id
			foreach ($tables as $k => $v) {
				$sql = "UPDATE eric_mile_mile.$v
						SET `historyId` = '$insertid'
						WHERE `historyId` = '0'
						AND `userid` = '$userid'
						AND `stamp` = '$stamp' ";

				$this->db->execute($sql);
				
				//array_push($this->json['sql'], $sql);
			}
			
			//delete from waiting list
			$sql = "DELETE FROM content_waiting 
					WHERE `userid` = '$userid' 
					AND `loc` = '$fileLoc' 
					LIMIT 1";

			$this->db->execute($sql);
		};
		
		
		//which foot the top left corner is in.
		$footX = floor( ($left) / 12) + 1;
		$footY = floor( ($top) / 12) + 1;
		
		
		//remove the rendered source image for this foot (transparent png)
		$sql = "INSERT INTO queue_renderdel 
				(stamp, x, y)
				VALUES 
				('$stamp', '$footX', '$footY')";

		$this->db->execute($sql);
		
		//if moving, remove the original foot 
		if ($moving) {
			$sql = "INSERT INTO queue_renderdel 
				(stamp, x, y)
				VALUES 
				('$stamp', '$movingX', '$movingY')";

			$this->db->execute($sql);
		}

		$this->json['foot'] = array(
			"x" => $footX,
			"y" => $footY
		);

		$this->json['result'] = $result;

	}
	
	//make this bad boy
	function createAction()
	{

		$this->disableLayout();

		for ($x = 1; $x < 67; $x++) {
			for ($y = 1; $y < 67; $y++) {
				$c = str_pad($x, 2, 0, STR_PAD_LEFT);
				$r = str_pad($y, 2, 0, STR_PAD_LEFT);

				$table = "c" . $c . "r" . $r;
				$sql = "CREATE TABLE `$table` (
					  `col` int(2) NOT NULL default '0',
					  `row` int(2) NOT NULL default '0',
					  `userid` int(7) NOT NULL default '0',
					  `stamp` int(20) NOT NULL default '0',
					  `historyId` int(15) NOT NULL default '0',
					  `type` int(3) default NULL,
					  PRIMARY KEY  (`col`,`row`),
					  KEY `col` (`col`),
					  KEY `row` (`row`)
					) ENGINE=MyISAM DEFAULT CHARSET=latin1";
				$this->db->execute($sql);

				echo $sql;
			}
		}
	}
}
