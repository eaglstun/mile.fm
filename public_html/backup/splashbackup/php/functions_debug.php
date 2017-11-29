<?
	function dbug($v, $k = 'DEBUG'){
        debug_value_print($k, $v, 5);
    }
    
    function debug_value_print($k, $v, $indent){
        if (!is_array($v) ){
            debug_indent_print($indent);
            print($k . "=[" . $v . "]<br>\n\n");
        }else{
            debug_indent_print($indent);
            print($k . " = [Array containing " . count($v) . " elements]<br>\n\n");
            foreach( $v as $k1=>$v1){
                debug_value_print($k1, $v1, ($indent + 5));
            }
        }
    }
    
    function debug_indent_print($indent){
        if($indent > 0){
            for ($x = 0; $x < $indent; $x++){print("&nbsp");}
            print(";");
        }
    }
?>