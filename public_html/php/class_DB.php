<?
class DB
{

	var $host = "localhost";
	var $username = DBUSER;
	var $password = DBPASS;
	var $dbName = DBNAME;
	var $tableName = "";
	var $lastid;
	var $connection;
	var $c; //boolean is db connected

	function __construct()
	{

		$this->connection = mysql_connect($this->host, $this->username, $this->password);

		if ($this->connection) {
			mysql_select_db($this->dbName, $this->connection);
			$this->c = true;
			return true;
		} else {
			$this->c = false;
			//echo "I cannot connect to the database because: ".mysql_error();
			return false;
		}
	}

	function exec($sql, $index = '')
	{

		$return = array();

		$result = mysql_query($sql, $this->connection);

		if ($index == '') {
			while ($row = mysql_fetch_assoc($result)) {
				$return[] = $row;
			}
		} else {
			while ($row = mysql_fetch_assoc($result)) {
				$return[$row[$index]] = $row;
			}
		}


		return ($return);
	}

	function execute($sql)
	{

		$return = array();

		$result = mysql_query($sql, $this->connection);

		$this->lastid = mysql_insert_id();

		return (true);
	}
}