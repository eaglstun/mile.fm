content list

<table class="stdTable">
	<tr>
		<td>thumb</td>
		<td>added by</td>
		<td>action</td>
	</tr>
	<? foreach( $images as $k=>$v ):?>
		<tr class="<? tableStripe();?>">
			<td><img src="/content/thumbs/<?= $v['thumb'];?>"/></td>
			<td><a href="/admin/users/view/id/<?= $v['userid'];?>"><?= $v['user'];?></a></td>
			<td><a href="/admin/content/det/id/<?= $v['object'];?>">details</a> remove</td>
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

<? //dbug($sql);?>
<? //dbug ($images); ?>