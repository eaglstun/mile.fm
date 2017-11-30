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
		<tr class="<? tableStripe();?>">
			<td><?= $v['object']?></td>
			<td><img src="/content/thumbs/<?= $v['thumb'];?>"/></td>
			<td><?= $v['count']?></td>
			<td>
				<a href="/admin/content/det/id/<?= $v['object']?>">details</a>
				<a class="remove" href="/admin/content/remove/id/<?= $v['object']?>">remove</a>
			</td>
		</tr>
	<? endforeach ?>
</table>