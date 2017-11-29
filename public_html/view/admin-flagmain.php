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
	
	<? foreach( $flags as $k=>$v ): ?>
		<tr class="<? tableStripe();?>">
			<td><?= $v['object']?></td>
			<td><?= $v['userid']?></td>
		</tr>
	<? endforeach ?>
</table>