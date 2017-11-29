<h3>Site Statistics</h3>

<ul class="crumbs">
	<li><a href="admin/home">admin home</a></li>
	<li>stats main</li>
</ul>

<? 
	$root = substr(HTTPROOT, 0, -7); 
?>



<h3>Unique Visitors: <?= count($byip); ?></h3>

<table class="stdTable">
	<tr>
		<td>IP</td>
		<td>Last Visit</td>
		<td>Pages Viewed</td>
	</tr>
	<? foreach( $byip as $k=>$v ): ?>
		<tr class="<? tableStripe();?>">
			<td><a href="admin/stats/detail/ip/<?= urlencode($v['ip']); ?>"><?= $v['ip']; ?></a></td>
			<td><?= date("D M jS g:i a", $v['last'] - 3600); ?></td>
			<td><?= $v['count']; ?></td>
		</tr>
	<? endforeach; ?>
</table>

<h3>Most Visited Pages</h3>

<table class="stdTable">
	<tr>
		<td>count</td>
		<td>page</td>
	</tr>
	<? foreach( $most as $k=>$v ): ?>
		<tr class="<? tableStripe();?>">
			<td><?= $v['count']; ?></td>
			<td><a href="<?= $root.$v['page'];?>"><?= $root.$v['page'];?></a></td>
		</tr>
	<? endforeach; ?>
</table>

<h3>Entrance Pages</h3>

<table class="stdTable">
	<tr>
		<td>count</td>
		<td>page</td>
	</tr>
	<? foreach( $enter as $k=>$v ): ?>
		<tr class="<? tableStripe();?>">
			<td><?= $v['count']; ?></td>
			<td><a href="<?= $v['from'];?>"><?= $v['from'];?></a></td>
		</tr>
	<? endforeach; ?>
</table>
