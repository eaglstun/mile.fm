<h2>Invitations</h2>

<p>
	MILE.fm <del>is in <strong>private</strong> alpha beta mode.</del> has opened up to the public 
	but you can still use this to invite any friends who might find this interesting! 
</p>

<?php if($invites > count($invited)): ?>
<h3><a href="" onclick="getInviteForm();return false">Send an invitation</a></h3>
<?php endif; ?>

<h3>Sent invitations:</h3>

<table style="width:100%;">
	<tr class="head">
		<td>email</td>
		<td>accepted?</td>
		<td>sent</td>
		<td>action</td>
	</tr>
<?php foreach( $invited as $k=>$v ): ?>
	<tr>
		<td><?php echo $v['email']; ?></td>
		
		<td>
			<?php if($v['accept'] != 1): ?>
				no
			<?php else: ?>
				<?php echo date("M j Y", $v['date_accept']); ?>
			<?php endif; ?>
		</td>
		
		<td>
			<?php echo date("M j Y", $v['last_sent']); ?>
		</td>
		
		<td>
			<?php if($v['accept'] != 1): ?>
				<a href="" onclick="getInviteForm(<?php echo $v['id']; ?>);return false">resend</a>
			<?php else: ?>
				-
			<?php endif; ?>
		</td>
	</tr>
<?php endforeach; ?>
</table>