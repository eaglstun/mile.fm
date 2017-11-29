<p>
	Hello <?= $to['email'] ?>!  A while back you signed up for the private beta to MILE.fm (formerly squaremileweb.com).
	Today is your lucky day, here is your invitation!
</p>

<p>
	Follow this link <a href="<?= HTTPROOT ?>ref/invite/i/<?= $uid; ?>/e/<?= urlencode($to['email']); ?>"><?= HTTPROOT ?>ref/invite/i/<?= $uid; ?>/e/<?= urlencode($to['email']); ?></a> to get started.
	You can start exploring right away, but you'll need to log in before you can add your own pictures.
	Check out the Help! section in your Control Panel if you need a few pointers.
</p>

<p>
	Remember, MILE.fm still has some bugs and rough edges.  
	We'd love to hear your feedback and and any suggestions!
</p>

<p>
	Thanks,<br/>
	Eric<br/>
	eric@mile.fm
</p>


<p>
	if this email was sent to you in error, you may remove yourself from our records from this link:
	<a href="<?= HTTPROOT."unsub/u/".$to['uniq'].'/e/'.urlencode($to['email']); ?>"><?= HTTPROOT."unsub/u/".$to['uniq'].'/e/'.urlencode($to['email']); ?></a>
</p>