
<? foreach( $site as $k=> $v ): ?>

	<a href="<?= str_replace('%username%', $v['username'], $v['url']) ; ?>" title="I'm <?= $v['username']; ?> at <?= $v['site']; ?>" target="_blank" ><img src="/static/siteicons/<?= $v['icon']; ?>" /></a>

<? endforeach; ?>
