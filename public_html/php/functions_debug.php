<?php 

function dbug($v = '', $k = 'DEBUG', $trace = TRUE)
{

    $bt = debug_backtrace();
    debug_value_print($k, $v, 5);

    if ($trace) {
        $called_from = $bt[0]['file'] . " line " . $bt[0]['line'];
        debug_value_print("called from: ", $called_from, 5);
    }

    print("<br/><br/>\n\n");
}

function debug_value_print($k, $v, $indent)
{
    debug_indent_print($indent);

    if (trim($k) || $k === 0) {
        $k = $k . " = ";
    }

    if (is_array($v)) {
        print($k . "[ Array containing " . count($v) . " elements ]<br/>\n\n");
        foreach ($v as $k1 => $v1) {
            debug_value_print($k1, $v1, ($indent + 5));
        }

    } else if (is_bool($v) or is_null($v)) {
        print($k . "[ " . ($v == true ? 'true' : 'false') . " ]<br/>\n\n");
    } else if (is_string($v) || is_int($v) || is_float($v)) {
        print($k . "[ " . htmlentities($v) . " ]<br/>\n\n");
    } else {
        	//is object
        $vars = get_object_vars($v);
        $count = count($vars);

        print($k . "[ Object with $count elements ]<br/>\n\n");

        if (is_array($vars)) {
            foreach ($vars as $k1 => $v1) {
                debug_value_print($k1, $v1, ($indent + 5));
            }
        } else {
            debug_value_print($k, $vars, ($indent + 5));
        }

    }
}

function debug_indent_print($indent)
{
    if ($indent > 0) {
        for ($x = 0; $x < $indent; $x++) {
            print("&nbsp");
        }
        print(";");
    }
}