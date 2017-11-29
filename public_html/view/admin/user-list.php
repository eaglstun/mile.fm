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
		<tr class="<? tableStripe();?>">
			<td><?= $v['id']?></td>
			<td><a href="/admin/users/view/id/<?= $v['id']?>"><?= $v['user']?></a></td>
			<td><?= $v['email']?></td>
			<td><?= $v['lastlogin'] > 0 ? date( "D M jS g:i:s a" , $v['lastlogin'] - 25200 ) : 'never'; ?></td>
			<td><?= $v['maillist'] == '1' ? 'yes' : ''; ?></td>
		</tr>
	<? endforeach ?>
</table>