<?php if (count($tags)): ?>
	<?php 
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
		<?php 
			$size = ((($v / $maxcount) * $spread) + $minFont) * $adj;
			
			if ($size < 12) {
				$size = 12;
			}
			
			$pad = $size / 4;
		?>
		<span class="tag" onclick="sendSearchParms('<?php echo $k; ?>')" style="font-size:<?php echo $size?>px;padding:0px <?php echo$pad ?>px"><?php echo $k; ?></span>
	<?php endforeach ?>
<?php else : ?>
	<div class="defaultBal" onclick="addTag(<?php echo $objectid; ?>)">No tags yet!<br/>Add yours!</div>
<?php endif ?>

<!--
<?php if (count($tags)): ?>
	<?php echo '<br/>max'.$maxcount.'<br>' ?>
	<?php echo 'min'.$mincount.'<br>' ?>
	<?php echo 'adj'.$adj.'<br>' ?>
<?php endif ?>
-->