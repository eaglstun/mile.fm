content list

<table class="stdTable">
	<tr>
		<td>thumb</td>
		<td>added by</td>
		<td>action</td>
	</tr>
	<?php foreach( $images as $k=>$v ):?>
		<tr class="<?php tableStripe();?>">
			<td><img src="/content/thumbs/<?php echo $v['thumb'];?>"/></td>
			<td><a href="/admin/users/view/id/<?php echo $v['userid'];?>"><?php echo $v['user'];?></a></td>
			<td><a href="/admin/content/det/id/<?php echo $v['object'];?>">details</a> remove</td>
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

<?php //dbug($sql);?>
<?php //dbug ($images); ?>