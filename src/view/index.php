<div id="container">
	
	<div id="squaremile">
		<div id="snarky">the fm stands for <?= $fm ?></div>
		<div id="offsetLeft"></div>
		<div id="offsetTop"></div>
		
		
		<? if( isset($mileContent) ): ?>
			
			<? foreach( $mileContent as $k=>$v ): ?>
				<? $zIndex = (5280-$v['mileY']) + (5280-$v['mileX']); ?>
				
				<div miley="<?= $v['mileY']; ?>" milex="<?= $v['mileX']; ?>" style="left: <?= ($v['mileX'] % 4) * 432; ?>px; top: <?= ($v['mileY'] % 4) * 432; ?>px; z-index: <?= $zIndex; ?>; background-image: none; background-color: #fff;" forcereload="0" class="footBlock <?= $k; ?>" id="c<?= $v['mileX'] % 4; ?>r<?= $v['mileY'] % 4; ?>"><?= $v['img']; ?></div>
			<? endforeach; ?>
		<? endif; ?>
	</div>
	
	<!--Control Panel-->
	<?= $cpanel;?>
	<!--End Control Panel-->
	
	<!-- the zoom -->
	<div id="zoomContainer">
		<a onclick="zoom('in')" id="zoomIn"></a>
		<a onclick="zoom('out')" id="zoomOut"></a>
		
		<div id="zoomscale">
			<div id="mags" style="left:126px"></div>
		</div>
	</div>
	<!-- end zoom -->
	
	<!--The scaled map -->
	<div id="map" ondblclick="mapCoord(event);return false;">
		<img src="/static/marker.png" width="15" height="15" id="marker" style="left:95px;top:95px;" />
	</div>
	<!--end scaled map -->
	
	<? if( isset($lightboxContent)): ?>
		<div id="lightboxbk">
			<img class="lbshadow" src="/static/shadow.png">
			<div id="lightboxlight">
				<span class="lightboxTitle"><?= $lightboxTitle; ?></span>
				<div style="" id="lightboxcontent" class="">
					<?= ($lightboxContent);?>
				</div>
			</div>
			
			<a id="closeLB" href="/" onclick="closeLB();"></a>
		</div>
	<? endif; ?>
</div>


<? /*
<!--[if IE]>
<script type='text/javascript'  src='http://getfirebug.com/releases/lite/1.2/firebug-lite-compressed.js'></script>
<![endif]-->
*/ ?>
