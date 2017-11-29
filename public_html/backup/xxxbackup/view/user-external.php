
<?php foreach( $site as $k=> $v): ?>

	<a href="<?php echo str_replace('%username%', $v['username'], $v['url']) ; ?>" title="I'm <?php echo $v['username']; ?> at <?php echo $v['site']; ?>" target="_blank" ><img src="static/siteicons/<?php echo $v['icon']; ?>" /></a>

<?php endforeach; ?>
