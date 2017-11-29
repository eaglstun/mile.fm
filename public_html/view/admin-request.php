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
	
	<?php foreach( $info as $k=>$v ): ?>
		<tr class="<?php tableStripe();?>">
			<td><?php echo $v['id']?></td>
			<td><?php echo $v['email']?></td>
			<td><?php echo date( "D M jS Y g:i:s a" , $v['stamp'] - 25200 ); ?></td>
			<td><a href="admin/users/sendinvite/to/<?php echo $v['id']; ?>">send invite</a> | <a onclick="inviteRemove(<?php $v['id']; ?>);">remove</a></td>
		</tr>
	<?php endforeach ?>
</table>

