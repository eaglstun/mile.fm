<h3>Site Statistics</h3>

<ul class="crumbs">
	<li><a href="admin/home">admin home</a></li>
	<li>stats main</li>
</ul>

<?php 
	$root = substr(HTTPROOT, 0, -7); 
?>



<h3>Unique Visitors: <?php echo count($byip); ?></h3>

<table class="stdTable">
	<tr>
		<td>IP</td>
		<td>Last Visit</td>
		<td>Pages Viewed</td>
	</tr>
	<?php foreach( $byip as $k=>$v ): ?>
		<tr class="<?php tableStripe();?>">
			<td><a href="admin/stats/detail/ip/<?php echo urlencode($v['ip']); ?>"><?php echo $v['ip']; ?></a></td>
			<td><?php echo date("D M jS g:i a", $v['last'] - 3600); ?></td>
			<td><?php echo $v['count']; ?></td>
		</tr>
	<?php endforeach; ?>
</table>

<h3>Most Visited Pages</h3>

<table class="stdTable">
	<tr>
		<td>count</td>
		<td>page</td>
	</tr>
	<?php foreach( $most as $k=>$v ): ?>
		<tr class="<?php tableStripe();?>">
			<td><?php echo $v['count']; ?></td>
			<td><a href="<?php echo $root.$v['page'];?>"><?php echo $root.$v['page'];?></a></td>
		</tr>
	<?php endforeach; ?>
</table>

<h3>Entrance Pages</h3>

<table class="stdTable">
	<tr>
		<td>count</td>
		<td>page</td>
	</tr>
	<?php foreach( $enter as $k=>$v ): ?>
		<tr class="<?php tableStripe();?>">
			<td><?php echo $v['count']; ?></td>
			<td><a href="<?php echo $v['from'];?>"><?php echo $v['from'];?></a></td>
		</tr>
	<?php endforeach; ?>
</table>
