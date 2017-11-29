<div style="clear:both;">
<? foreach( $thumbs as $k=>$v ): ?>
	<? //dbug($v); ?>
	<div class="panelThumbs" id="" coords="">
		<img class="panelThumb" src="/static/72spacer.gif" style="background-image: url(/content/thumbs/<?= $v['thumb']; ?>);"/>
		<? if ( isset($v['votes']) ): ?>
		<span class="addedDate"><?= plural($v['votes'], 'vote' ); ?></span>
		<? endif ?>
	</div>
<? endforeach; ?>
</div>
