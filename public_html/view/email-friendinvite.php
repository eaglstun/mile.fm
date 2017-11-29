<p>
	Today is your lucky day, your friend <?php echo trim($friend) ? " ( ".$friend." ) " : ''; ?> has invited you to use MILE.fm! 
	It's a square mile of pictures to explore, you can put up your own, and vote on others pictures too.
</p>

<p>
	Follow this link <a href="<?php echo $link; ?>"><?php echo $link; ?></a> to get started.
	You can start exploring right away, but you'll need to create an account before you can add your own pictures.
	Check out the Help! section in your Control Panel if you need a few pointers.
</p>

<p>
	Remember, MILE.fm still has some bugs and rough edges.  
	We'd love to hear your feedback and and any suggestions!
</p>


<p>
	if this email was sent to you in error, you may remove yourself from our records from this link:
	<a href="<?php echo HTTPROOT."unsub/u/".$to['uniq'].'/e/'.urlencode($to['email']); ?>"><?php echo HTTPROOT."unsub/u/".$to['uniq'].'/e/'.urlencode($to['email']); ?></a>
</p>