<?php
class contentMVC extends Action
{
	function init()
	{
		if (isset($_SESSION['userauth']) && $_SESSION['userauth'] & 64) {
			//all good
		} else {
			$this->Redirect();
		}

		$this->theme = "admin";

	}

	public function indexAction()
	{

	}
	
	//viewing content by popularity
	function popAction()
	{
		$sort = (isset($_REQUEST['sort']) && $_REQUEST['sort'] == "DESC") ? "DESC" : "ASC";
		$page = (isset($_REQUEST['page'])) ? $_REQUEST['page'] : "0";

		$sql = "SELECT V.object, SUM(V.vote) as score, H.thumb, H.userid, U.user
				FROM content_votes V
				LEFT JOIN content_history H ON V.object = H.id
				LEFT JOIN user_list U ON H.userid = U.id
				GROUP BY object ORDER BY score $sort 
				LIMIT $page,40";

		$res = $this->db->exec($sql);

		$this->vars['list'] = $res;
		$this->vars['sort'] = $sort;
		$this->vars['sorto'] = ($sort == "ASC") ? "DESC" : "ASC";
		$this->vars['page'] = $page;

		$this->view = "admin/content-pop";
	}
	
	//viewing specific content details
	function detAction()
	{
		$id = $_REQUEST['id'];

		$sql = "SELECT H.*, U.user FROM content_history H 
				LEFT JOIN user_list U 
				ON H.userid = U.id
				WHERE H.id = '$id' LIMIT 1";
		$res = $this->db->exec($sql);
		$this->vars['det'] = $res[0];
		
		
		//get voting info
		$sql = "SELECT COUNT(*) as count, SUM(vote) as score 
				FROM content_votes WHERE object='$id'";
		$res = $this->db->exec($sql);
		$this->vars['votetotal'] = $res[0];
		
		//get flagged info 
		$sql = "SELECT COUNT(*) as flags FROM content_flag WHERE object = '$id'";
		$res = $this->db->exec($sql);
		$this->vars['flags'] = $res[0]['flags'];

		$this->view = "admin/content-detail";
	}
	
	//delete an image
	function removeAction()
	{
		$this->disableLayout();

		$id = $_REQUEST['id'];
		
		//load location of picture
		$sql = "SELECT * FROM content_history 
				WHERE `id` = '$id' LIMIT 1";
		$res = $this->db->exec($sql);
		$res = $res[0];
		
		//delete votes records
		$sql = "DELETE FROM content_votes 
				WHERE `object` = '$id'";

		$this->db->execute($sql);
		d($sql);
				
		//delete comments records
		$sql = "DELETE FROM content_comments 
				WHERE `object` = '$id'";

		$this->db->execute($sql);
		d($sql);
			
		//delete flags
		$sql = "DELETE FROM content_flag 
				WHERE `object` = '$id'";

		$this->db->execute($sql);
		d($sql);
				
		//delete location records
		for ($c = $res['tableCol']; $c <= $res['tableCol'] + 1; $c++) {
			for ($r = $res['tableRow']; $r <= $res['tableRow'] + 1; $r++) {
				$tableX = str_pad($c, 2, "0", STR_PAD_LEFT);
				$tableY = str_pad($r, 2, "0", STR_PAD_LEFT);

				$table = "c" . $tableX . "r" . $tableY;

				$sql = "DELETE FROM eric_mile_mile.$table 
						WHERE `historyId` = '$id'";

				$this->db->execute($sql);
				d($sql);
			}
		}
		
				
		//delete master history record
		$sql = "DELETE FROM content_history 
				WHERE `id` = '$id'";

		$this->db->execute($sql);
		d($sql);
	}
}