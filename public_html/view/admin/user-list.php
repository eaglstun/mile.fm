<h3>user list</h3>

<ul class="crumbs">
	<li><a href="admin/home">admin home</a></li>
	<li>user list</li>
</ul>

<table class="stdTable">
	<tr>
		<td>id</td>
		<td>username</td>
		<td>email</td>
		<td>last login</td>
		<td>on mailing list</td>
	</tr>
	
	<?php foreach( $users as $k=>$v ): ?>
		<tr class="<?php tableStripe();?>">
			<td><?php echo $v['id']?></td>
			<td><a href="/admin/users/view/id/<?php echo $v['id']?>"><?php echo $v['user']?></a></td>
			<td><?php echo $v['email']?></td>
			<td><?php echo $v['lastlogin'] > 0 ? date( "D M jS g:i:s a" , $v['lastlogin'] - 25200 ) : 'never'; ?></td>
			<td><?php echo $v['maillist'] == '1' ? 'yes' : ''; ?></td>
		</tr>
	<?php endforeach ?>
</table>