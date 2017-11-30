<?php

class rssMVC extends Action
{
	function init()
	{
		include('php/class_RSS.php');

		$this->RSS = new RSS($this->db);

		$this->disableLayout();
	}

	function indexAction()
	{
		$this->disableLayout();

		$sql = "SELECT H.*, U.user FROM content_history H 
				LEFT JOIN user_list U 
				ON H.userid = U.id
				ORDER BY H.stamp DESC LIMIT 20";
		$res = $this->db->exec($sql);

		$this->RSS->SetChannel(
			HTTPROOT . 'rss',
			'MILE.fm Recently Added', //title
			'MILE.fm recently added pictures', //description
			'en-us', //language
			'2009',
			'MILE.fm', //dc:creator
			'Recently Added'
		); //dc:subject

		$this->RSS->SetImage(HTTPROOT . 'static/logo144.png');

		foreach ($res as $k => $v) {
			//$link = base_base2base($v['id'], 10, 59);
			$x = ($v['left'] + ( ($v['right'] - $v['left']) / 2)) * 72;
			$y = ($v['top'] + ( ($v['bottom'] - $v['top']) / 2)) * 72;

			$link = "#x=" . $x . "&y=" . $y . "&select=" . $v['id'];
			$link = htmlentities($link);

			$desc = '<img src="' . HTTPROOT . 'content/original/' . $v['content'] . '"/>';
			$desc = htmlentities($desc);

			$this->RSS->SetItem(
				HTTPROOT . $link,
				$v['user'] . ' added on ' . date("M jS, g:i a", $v['stamp']),
				$desc, //desc
				date("M jS, g:i a", $v['stamp'])
			); //date
		}

		$this->outputRSS = $this->RSS->output();
	}

	function friendsAction()
	{


		$userid = isset($_REQUEST['userid']) ? (int)$_REQUEST['userid'] : false;

		$sql = "SELECT H.id, H.content, H.stamp, L.user FROM user_friends F
				LEFT JOIN content_history H
				ON F.friendid = H.userid
				LEFT JOIN user_list L
				ON F.friendid = L.id
				WHERE F.userid = '$userid'
				ORDER BY H.stamp DESC
				LIMIT 20";

		$res = $this->db->exec($sql);

		$this->RSS->SetChannel(
			HTTPROOT . 'rss',
			'MILE.fm Friends Added', //title
			'MILE.fm friends recently added pictures', //description
			'en-us', //language
			'2009',
			'MILE.fm', //dc:creator
			'Recently Added'
		); //dc:subject

		$this->RSS->SetImage(HTTPROOT . 'static/logo144.png');

		foreach ($res as $k => $v) {
			//dbug($v);
			$link = base_base2base($v['id'], 10, 59);
			/*
			$x = ($v['left'] + (($v['right'] - $v['left']) / 2)) * 72;
			$y = ($v['top'] + (($v['bottom'] - $v['top']) / 2)) * 72;
			
			$link = "#x=".$x."&y=".$y."&select=".$v['id'];
			$link = htmlentities($link);
			 */
			$desc = '<img src="' . HTTPROOT . 'content/original/' . $v['content'] . '"/>';
			$desc = htmlentities($desc);

			$this->RSS->SetItem(
				HTTPROOT . $link,
				$v['user'] . ' added on ' . date("M jS, g:i a", $v['stamp']),
				$desc, //desc
				date("M jS, g:i a", $v['stamp'])
			); //date
		}

		$this->outputRSS = $this->RSS->output();
	}
}