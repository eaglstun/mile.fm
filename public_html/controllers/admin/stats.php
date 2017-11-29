<?
class statsMVC extends Action
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

	function indexAction()
	{
		$this->view = "admin/stats";
		
		//get the unique vistors(by ip)
		$sql = "SELECT ip, MAX(stamp) as last, count(page) as count FROM  eric_mile_misc.tracking 
				GROUP BY ip 
				ORDER BY last DESC ";
		$res = $this->db->exec($sql);
		$this->vars['byip'] = $res;
		
		//get the most viewed pages
		$sql = "SELECT COUNT(*) as count, page FROM eric_mile_misc.tracking 
				GROUP BY page ORDER BY count DESC";
		$res = $this->db->exec($sql);
		$this->vars['most'] = $res;
		
		//get entrance pages
		$sql = "SELECT `from`, `stamp`, COUNT(`from`) as count 
				FROM eric_mile_misc.tracking WHERE `from` LIKE 'http://%' 
				GROUP BY `from` ORDER BY `count` DESC, stamp DESC";
		$res = $this->db->exec($sql);
		$this->vars['enter'] = $res;
	}

	function detailAction()
	{
		$this->view = "admin/stats-detail";

		if (isset($_REQUEST['ip'])) {
			$ip = $_REQUEST['ip'];
		} else {
			$this->Redirect('admin/stats');
		}

		$sql = "SELECT * FROM tracking WHERE `ip`='$ip'
				ORDER BY stamp DESC";
		$res = $this->db->exec($sql);
		
		//no results?
		if (!count($res)) {
			$this->Redirect('admin/stats');
		};

		$this->vars['dets'] = $res;
	}
}