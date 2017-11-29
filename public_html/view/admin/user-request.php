<h3>user list</h3>

<ul class="crumbs">
	<li><a href="admin/home">admin home</a></li>
	<li>beta requests</li>
</ul>

<table class="stdTable">
	<tr>
		<td>id</td>
		<td>email</td>
		<td>requested</td>
		<td>last sent</td>
		<td>accepted?</td>
		<td>action</td>
	</tr>
	
	<? foreach( $info as $k=>$v ): ?>
		<tr class="<? tableStripe();?>">
			<td><?= $v['id']?></td>
			<td><?= $v['email']?></td>
			<td><?= date( "D M jS Y g:i:s a" , $v['date'] - 25200 ); ?></td>
			<td><?= $v['last_sent'] > 0 ? date( "D M jS Y g:i:s a" , $v['last_sent'] - 25200 ) : ''; ?></td>
			<td><?= $v['accept'] == 1 ? "yes" : ""; ?></td>
			<td><a href="admin/users/sendinvite/to/<?= $v['id']; ?>">send invite</a> | <a onclick="inviteRemove(<? $v['id']; ?>);">remove</a></td>
		</tr>
	<? endforeach ?>
</table>

