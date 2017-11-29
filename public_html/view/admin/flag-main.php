<h3>flagged content</h3>

<ul class="crumbs">
	<li><a href="admin/home">admin home</a></li>
	<li>flagged content</li>
</ul>

<table class="stdTable">
	<tr>
		<td>object id</td>
		<td>thumb</td>
		<td>flags</td>
		<td>action</td>
	</tr>
	
	<?php foreach( $flags as $k=>$v ): ?>
		<tr class="<?php tableStripe();?>">
			<td><?php echo $v['object']?></td>
			<td><img src="/content/thumbs/<?php echo $v['thumb'];?>"/></td>
			<td><?php echo $v['count']?></td>
			<td>
				<a href="/admin/content/det/id/<?php echo $v['object']?>">details</a>
				<a class="remove" href="/admin/content/remove/id/<?php echo $v['object']?>">remove</a>
			</td>
		</tr>
	<?php endforeach ?>
</table>