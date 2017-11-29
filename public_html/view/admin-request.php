<h3>user list</h3>

<ul class="crumbs">
	<li><a href="admin/home">admin home</a></li>
	<li>beta requests</li>
</ul>

<table class="stdTable">
	<tr>
		<td>id</td>
		<td>email</td>
		<td>stamp</td>
		<td>action</td>
	</tr>
	
	<? foreach( $info as $k=>$v ): ?>
		<tr class="<? tableStripe();?>">
			<td><?= $v['id']?></td>
			<td><?= $v['email']?></td>
			<td><?= date( "D M jS Y g:i:s a" , $v['stamp'] - 25200 ); ?></td>
			<td><a href="admin/users/sendinvite/to/<?= $v['id']; ?>">send invite</a> | <a onclick="inviteRemove(<? $v['id']; ?>);">remove</a></td>
		</tr>
	<? endforeach ?>
</table>

