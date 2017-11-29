<?
class DB
{
	protected $host = DBHOST;
	protected $username = DBUSER;
	protected $password = DBPASS;
	protected $dbName = DBNAME;

	var $tableName = "";
	var $lastid;
	protected $connection;
	var $c; //boolean is db connected

	function __construct()
	{

		$this->connection = mysqli_connect($this->host, $this->username, $this->password);

		if ($this->connection) {
			mysqli_select_db($this->connection, $this->dbName);
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

		$result = mysqli_query($this->connection, $sql);

		if ($index == '') {
			while ($row = mysqli_fetch_assoc($result)) {
				$return[] = $row;
			}
		} else {
			while ($row = mysqli_fetch_assoc($result)) {
				$return[$row[$index]] = $row;
			}
		}


		return ($return);
	}

	function execute($sql)
	{

		$return = array();

		$result = mysqli_query($sql, $this->connection);

		$this->lastid = mysqli_insert_id();

		return (true);
	}
}