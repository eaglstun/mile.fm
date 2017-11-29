<? if (count($tags)): ?>
	<? 
		$maxcount = max(array_values($tags));
		$mincount = min(array_values($tags));
		$maxFont = 50;
		$minFont = 4;
		
		$spread = $maxFont - $minFont;
		
		$adj =  (($maxcount / $mincount) / count($tags)) * 2;
		
		if($adj > 1){
			$adj = 1;
		}
	?>
	
	<?php foreach( $tags as $k=>$v ): ?>
		<? 
			$size = ((($v / $maxcount) * $spread) + $minFont) * $adj;
			
			if ($size < 12) {
				$size = 12;
			}
			
			$pad = $size / 4;
		?>
		<span class="tag" onclick="sendSearchParms('<?= $k; ?>')" style="font-size:<?= $size?>px;padding:0px <?=$pad ?>px"><?= $k; ?></span>
	<? endforeach ?>
<? else : ?>
	<div class="defaultBal" onclick="addTag(<?= $objectid; ?>)">No tags yet!<br/>Add yours!</div>
<? endif ?>

<!--
<? if (count($tags)): ?>
	<?= '<br/>max'.$maxcount.'<br>' ?>
	<?= 'min'.$mincount.'<br>' ?>
	<?= 'adj'.$adj.'<br>' ?>
<? endif ?>
-->