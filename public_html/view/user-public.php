<? if (trim($friend['pic'])): ?>
	<img src="/content/profile/<?= $friend['pic'];?>" class="friendPic"/>
<? else: ?>
	<img src="/content/thumbs/defaultFriend.gif" class="friendPic"/>
<? endif; ?>


<div class="friendProfile">
	<? if (trim($friend['profile'])): ?>
		<?= $friend['profile']; ?>
	<? else : ?>
		<?= $friend['user']; ?> has not created a profile yet!
	<? endif; ?>
</div>

<div class="friendExternalSites">
	<?= $externalSites; ?>
</div>