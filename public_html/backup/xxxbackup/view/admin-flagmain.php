<h3>flagged content</h3>

<ul class="crumbs">
	<li><a href="admin/home">admin home</a></li>
	<li>flagged content</li>
</ul>

<table class="stdTable">
	<tr>
		<td>object id</td>
		<td>user id</td>
	</tr>
	
	<?php foreach( $flags as $k=>$v): ?>
		<tr class="<?php tableStripe();?>">
			<td><?php echo $v['object']?></td>
			<td><?php echo $v['userid']?></td>
		</tr>
	<?php endforeach ?>
</table>