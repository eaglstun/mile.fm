<?
class Email{
	var $subject = '';
	var $to = array();
	var $cc = array();
	var $bcc = array();
	var $attachments = array();
	var $body = array('text', 'html' );
	var $boundary = 'b1_ad6134701969402843dbdd701c17c17e';
	
	function __construct(){
	
	}
	
	public function addTo($address, $name = ''){
		if (strpos($address, "@") === false){
			$address .= EMAILS;
		}
		
		if (!trim($name) ){
			$name = $address;
		}
		array_push($this->to, array('address' => $address, 'name' => $name));
		
		//dbug($address, '$address' );
	}
	
	public function addBcc($address, $name = ''){
		array_push($this->bcc, array('address' => $address, 'name' => $name));
	}
	
	public function setSubject($subject){
		$this->subject = $subject;
	}
	
	public function setBody($body){
		$this->body['html'] = $body;
		$this->body['text'] = strip_tags($body);
	}
	
	public function sendMail(){
		$to = $this->buildTo($this->to, 0);
		unset($this->to[0]);
		
		$body = $this->buildBody();
		$headers = $this->buildHeaders();
		
		mail($to, $this->subject, $body, $headers);
	}
	
	private function buildBody(){
		//text
		$body  = '--'.$this->boundary . "\r\n";
		$body .= 'Content-type: text/plain; charset = "iso-8859-1"' . "\r\n" .
			     'Content-Transfer-Encoding: 7bit' . "\r\n\r\n";
		$body .= $this->body['text'] . "\r\n";
		
		//html
		$body .= '--'.$this->boundary . "\r\n";
		$body .= 'Content-type: text/html; charset = "iso-8859-1"' . "\r\n" .
			     'Content-Transfer-Encoding: 7bit' . "\r\n\r\n";
		$body .= $this->body['html'] . "\r\n";
		
		//end
		$body .= '--'.$this->boundary.'--';
		
		return $body;
	}
	
	private function buildHeaders(){
		$headers  = 'MIME-Version: 1.0' . "\r\n";
		$headers .= 'Content-Type: multipart/alternative; ';
		$headers .= 'boundary="'.$this->boundary.'"' . "\r\n";
		
		$to = $this->buildTo($this->to);
		
		$headers .= trim($to) ? 'To: '. $to . "\r\n" : '';
		$headers .= 'From: MILE.fm <noreply@MILE.fm>' . "\r\n";
		$headers .= 'Cc: ' . "\r\n";
		
		$bcc = $this->buildTo($this->bcc);
		$headers .= 'Bcc: ' .$bcc. "\r\n";
		
		return $headers;
	}
	
	private function buildTo($ary, $which = ''){
		$to = array();
		if(is_numeric($which) ){
			$to = $ary[$which]['name']. ' <'.$ary[$which]['address'].'>';
		} else {
			foreach( $ary as $k=>$v){
				array_push($to, $v['name']. ' <'.$v['address'].'>' );
			}
			
			$to = implode(' , ', $to);
		}
		return $to;
	}
}

?>