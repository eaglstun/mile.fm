<?php
class DB
{
    protected $host = DBHOST;
    protected $username = DBUSER;
    protected $password = DBPASS;
    protected $dbName = DBNAME;

    protected $tableName = "";
    protected $lastid;
    protected $connection;
    protected $c; //boolean is db connected

    public function __construct()
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

    /**
     * 
     * @param string
     * @param 
     * @return array
     */
    public function exec($sql, $index = '')
    {

        $return = [];

        $result = mysqli_query($this->connection, $sql);

        if (!$result)
            dd($sql);

        if ($index == '') {
            while ($row = mysqli_fetch_assoc($result)) {
                $return[] = $row;
            }
        } else {
            while ($row = mysqli_fetch_assoc($result)) {
                $return[$row[$index]] = $row;
            }
        }

        return $return;
    }

    /**
     * 
     * @param string
     * @param array
     * @return bool
     */
    public function execute($sql, array $params = [])
    {
        $return = [];

        $params = array_map('strval', $params); 
        $type = str_repeat('s', count($params));

        $stmt = mysqli_prepare($this->connection, $sql); 
        
        if( count($params) ){
            mysqli_stmt_bind_param($stmt, $type, ...$params);
        }
        
        mysqli_stmt_execute($stmt);

        $this->lastid = mysqli_stmt_insert_id($stmt);
         
        mysqli_stmt_close( $stmt );

        return true;
    }

    /**
     * 
     * @return int
     */
    public function getLastID()
    {
        return $this->lastid;
    }
}