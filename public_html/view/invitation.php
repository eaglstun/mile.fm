<h2>Invitations</h2>

<p>
	MILE.fm <del>is in <strong>private</strong> alpha beta mode.</del> has opened up to the public 
	but you can still use this to invite any friends who might find this interesting! 
</p>

<? if($invites > count($invited)): ?>
<h3><a href="" onclick="getInviteForm();return false">Send an invitation</a></h3>
<? endif; ?>

<h3>Sent invitations:</h3>

<table style="width:100%;">
	<tr class="head">
		<td>email</td>
		<td>accepted?</td>
		<td>sent</td>
		<td>action</td>
	</tr>
<? foreach( $invited as $k=>$v ): ?>
	<tr>
		<td><?= $v['email']; ?></td>
		
		<td>
			<? if($v['accept'] != 1): ?>
				no
			<? else: ?>
				<?= date("M j Y", $v['date_accept']); ?>
			<? endif; ?>
		</td>
		
		<td>
			<?= date("M j Y", $v['last_sent']); ?>
		</td>
		
		<td>
			<? if($v['accept'] != 1): ?>
				<a href="" onclick="getInviteForm(<?= $v['id']; ?>);return false">resend</a>
			<? else: ?>
				-
			<? endif; ?>
		</td>
	</tr>
<? endforeach; ?>
</table>