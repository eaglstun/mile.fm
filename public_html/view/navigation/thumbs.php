<div style="clear:both;">
<?php foreach( $thumbs as $k=>$v ): ?>
	<?php //dbug($v); ?>
	<div class="panelThumbs" id="" coords="">
		<img class="panelThumb" src="/static/72spacer.gif" style="background-image: url(/content/thumbs/<?php echo $v['thumb']; ?>);"/>
		<?php if ( isset($v['votes']) ): ?>
		<span class="addedDate"><?php echo plural($v['votes'], 'vote' ); ?></span>
		<?php endif ?>
	</div>
<?php endforeach; ?>
</div>
