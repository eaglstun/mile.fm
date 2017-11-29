content list

<table class="stdTable">
	<tr>
		<td>thumb</td>
		<td>comment</td>
		<td>action</td>
	</tr>
	<?php foreach( $images as $k=>$v ):?>
		<tr class="<?php tableStripe();?>">
			<td><img src="/content/thumbs/<?php echo $v['thumb'];?>"/></td>
			<td><?php echo $v['comment'];?></td>
			<td><a href="/admin/content/det/id/<?php echo $v['id'];?>">details</a></td>
		</tr>
	<?php endforeach; ?>
</table>

<?php //dbug($sql);?>
<?php //dbug ($images); ?>