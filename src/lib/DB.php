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
     *  @param string
     *  @param array
     *  @param 
     *  @return array
     */
    public function exec($sql, array $params = [], $index = '')
    {
        $return = [];
        
        $params = array_map('strval', $params); 
        $type = str_repeat('s', count($params));
        
        $stmt = mysqli_prepare($this->connection, $sql); 

        if( count($params) ){
            mysqli_stmt_bind_param($stmt, $type, ...$params);
        }

        if( is_bool($stmt) ){
            dd($sql);
        }

        mysqli_stmt_execute($stmt);
        $result = mysqli_stmt_get_result($stmt);

        if ($index == '') {
            while ($row = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
                $return[] = $row;
            }
        } else {
            while ($row = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
                
                $return[$row[$index]] = $row;
            }
        }

        return $return;
    }

    /**
     * insert, update
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
        
        if( is_bool($stmt) ){
            dd($sql);
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