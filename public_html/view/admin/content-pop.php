<h3>content by popularity</h3>
<ul class="crumbs">
	<li><a href="/admin/home">admin home</a></li>
	<li>content by popularity</li>
</ul>

<table class="stdTable">
	<tr>
		<td><a href="/admin/content/pop/sort/<?= $sorto; ?>">score</a></td>
		<td>thumb</td>
		<td>added by</td>
		<td>action</td>
	</tr>
	<?php foreach( $list as $k=>$v ):?>
		<tr class="<? tableStripe();?>">
			<td><?= $v['score'];?></td>
			<td><img src="/content/thumbs/<?= $v['thumb'];?>"/></td>
			<td><a href="/admin/users/view/id/<?= $v['userid'];?>"><?= $v['user'];?></a></td>
			<td>
				<a href="/admin/content/det/id/<?= $v['object'];?>">details</a>
				<a class="remove" href="/admin/content/remove/id/<?= $v['object']?>">remove</a>
			</td>
		</tr>
	<? endforeach; ?>

	<tr>
		<td colspan="2">
			<? if ($page-40 > -1):?>
				<a href="/admin/content/pop/sort/<?= $sort; ?>/page/<?= $page - 40;?>">prev page</a>
			<? endif; ?>
		</td>
		<td colspan="2">
				<a href="/admin/content/pop/sort/<?= $sort; ?>/page/<?= $page + 40;?>">next page</a>
		</td>
	</tr>




</table>