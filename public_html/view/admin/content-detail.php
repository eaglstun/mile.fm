<h3>content detail</h3>
<ul class="crumbs">
	<li><a href="/admin/home">admin home</a></li>
	<li>content details</li>
</ul>

<? //dbug ($det) ?>
<img src="/content/original/<?= $det['content']; ?>"/>

<ul>
	<li>added by: <a href="/admin/users/view/id/<?= $det['userid']; ?>"><?= $det['user']; ?></a></li>
	<li>added on: <?= date("D M jS Y, g:i a", $det['stamp']); ?></li>
	<li>original location: <a href="<?= $det['orig_loc']; ?>" target="_blank"><?= $det['orig_loc']; ?></a></li>
	<li>total votes: <?= $votetotal['count']; ?></li>
	<li>total score: <?= $votetotal['score']; ?></li>
	<li>positive votes:</li>
	<li>negative votes:</li>
	<li>total flags: <?= $flags; ?></li>
	<li>comments:</li>
	<li>tags:</li>
</ul>

<ul>
	<li>action:</li>
	<li>remove</li>
</ul>