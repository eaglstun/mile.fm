content list

<table class="stdTable">
	<tr>
		<td>thumb</td>
		<td>comment</td>
		<td>action</td>
	</tr>
	<? foreach( $images as $k=>$v ):?>
		<tr class="<? tableStripe();?>">
			<td><img src="/content/thumbs/<?= $v['thumb'];?>"/></td>
			<td><?= $v['comment'];?></td>
			<td><a href="/admin/content/det/id/<?= $v['id'];?>">details</a></td>
		</tr>
	<? endforeach; ?>
</table>

<? //dbug($sql);?>
<? //dbug ($images); ?>