sent in mail

<?
$user = 'sendin-mile';
$pass = 'mile123';

$mbox = imap_open  ( "{localhost:143/imap/notls}INBOX" , $user , $pass );
echo "mbox\n";
print_r($mbox);

echo "<h1>Mailboxes</h1>\n";
$folders = imap_listmailbox($mbox, "{imap.example.org:110}", "*");

if ($folders == false) {
    echo "Call failed<br />\n";
} else {
    foreach ($folders as $val) {
        echo $val . "<br />\n";
    }
}

echo "<h1>Headers in INBOX</h1>\n";
$headers = imap_headers($mbox);

if ($headers == false) {
    echo "Call failed<br />\n";
} else {
    foreach ($headers as $val) {
        echo $val . "<hr/>";
    }
}

$numEmails = sizeof($headers);

echo "You have $numEmails in your mailbox<hr/>";

for($i = 1; $i < $numEmails+1; $i++){
	
	
	$mailHeader = @imap_headerinfo($mbox, $i);
	$from = $mailHeader->fromaddress;
	
	$subject = strip_tags($mailHeader->subject);
	$to = strip_tags($mailHeader->toaddress);
	$date = $mailHeader->date;
	
	echo "Email from $from, subject $subject, date $date, to $to<br>";
	
	$body = nl2br(strip_tags(imap_body($mbox, $i)));
	
	//echo $body."<hr>";
	
	echo "struct: ";
	$info = imap_fetchstructure($mbox, $i);
	
	$numparts = count($info->parts);

	if ($numparts > 1) {

		echo "More then one part<BR>";
		
		foreach ($info->parts as $key=>$part) {
			echo "part:<br>&nbsp;&nbsp;&nbsp;";
			print_r($part);
			
			$filename = $part->dparameters[0]->value;
			echo "<br/>filename: $filename <br/>";
			
			echo "<hr>";
			$content = imap_fetchbody($mbox, $i, ($key + 1));
       	 	//print_r($content);
       	 	
       	 	$raw = base64_decode($content);
       	 	
       	 	file_put_contents('email_in/'.$filename, $raw);
       	 	
       	 	//echo $raw;
       	 	
        	echo "\n\n\n";
		}
   
	} else {
	   // only one part so get some useful info
	   echo "Only one part<hr/>";
	}

}

imap_close($mbox);
?>