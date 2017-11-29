<h3>content by popularity</h3>
<ul class="crumbs">
	<li><a href="/admin/home">admin home</a></li>
	<li>content by popularity</li>
</ul>

<table class="stdTable">
	<tr>
		<td><a href="/admin/content/pop/sort/<?php echo $sorto; ?>">score</a></td>
		<td>thumb</td>
		<td>added by</td>
		<td>action</td>
	</tr>
	<?php foreach( $list as $k=>$v ):?>
		<tr class="<?php tableStripe();?>">
			<td><?php echo $v['score'];?></td>
			<td><img src="/content/thumbs/<?php echo $v['thumb'];?>"/></td>
			<td><a href="/admin/users/view/id/<?php echo $v['userid'];?>"><?php echo $v['user'];?></a></td>
			<td>
				<a href="/admin/content/det/id/<?php echo $v['object'];?>">details</a>
				<a class="remove" href="/admin/content/remove/id/<?php echo $v['object']?>">remove</a>
			</td>
		</tr>
	<?php endforeach; ?>

	<tr>
		<td colspan="2">
			<?php if ($page-40 > -1):?>
				<a href="/admin/content/pop/sort/<?php echo $sort; ?>/page/<?php echo $page - 40;?>">prev page</a>
			<?php endif; ?>
		</td>
		<td colspan="2">
				<a href="/admin/content/pop/sort/<?php echo $sort; ?>/page/<?php echo $page + 40;?>">next page</a>
		</td>
	</tr>




</table>