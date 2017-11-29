<?php if (trim($friend['pic'])): ?>
	<img src="/content/profile/<?php echo $friend['pic'];?>" class="friendPic"/>
<?php else: ?>
	<img src="/content/thumbs/defaultFriend.gif" class="friendPic"/>
<?php endif; ?>


<div class="friendProfile">
	<?php if (trim($friend['profile'])): ?>
		<?php echo $friend['profile']; ?>
	<?php else : ?>
		<?php echo $friend['user']; ?> has not created a profile yet!
	<?php endif; ?>
</div>

<div class="friendExternalSites">
	<?php echo $externalSites; ?>
</div>