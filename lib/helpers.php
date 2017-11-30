<?php 

/**
 * 
 *  @param string
 *  @return string
 */
function camelCase($str)
{
	$cc = preg_replace_callback('/-(\w)/', function(array $matches){
        return ucfirst($matches[1]);
    }, $str);

	return $cc;
}

/**
 * 
 *  @param string
 *  @return string absolute path to temp file
 */
function get_remote_file($url)
{
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    if (curl_exec($ch) === FALSE) {
        return FALSE;
    }

    $data = curl_exec($ch);

    curl_close($ch);

    $temp = tempnam(PATH_PUBLIC . '/content/src', '');
    file_put_contents($temp, $data);

    return $temp;
}
