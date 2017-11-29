<h3>content detail</h3>
<ul class="crumbs">
	<li><a href="/admin/home">admin home</a></li>
	<li>content details</li>
</ul>

<?php //dbug ($det) ?>
<img src="/content/original/<?php echo $det['content']; ?>"/>

<ul>
	<li>added by: <a href="/admin/users/view/id/<?php echo $det['userid']; ?>"><?php echo $det['user']; ?></a></li>
	<li>added on: <?php echo date("D M jS Y, g:i a", $det['stamp']); ?></li>
	<li>original location: <a href="<?php echo $det['orig_loc']; ?>" target="_blank"><?php echo $det['orig_loc']; ?></a></li>
	<li>total votes: <?php echo $votetotal['count']; ?></li>
	<li>total score: <?php echo $votetotal['score']; ?></li>
	<li>positive votes:</li>
	<li>negative votes:</li>
	<li>total flags: <?php echo $flags; ?></li>
	<li>comments:</li>
	<li>tags:</li>
</ul>

<ul>
	<li>action:</li>
	<li>remove</li>
</ul>