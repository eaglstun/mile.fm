<div id="container">
	
	<div id="squaremile">
		<div id="snarky">the fm stands for <?php echo $fm ?></div>
		<div id="offsetLeft"></div>
		<div id="offsetTop"></div>
		
		
		<?php if( isset($mileContent) ): ?>
			
			<?php foreach( $mileContent as $k=>$v ): ?>
				<?php $zIndex = (5280-$v['mileY']) + (5280-$v['mileX']); ?>
				
				<div miley="<?php echo $v['mileY']; ?>" milex="<?php echo $v['mileX']; ?>" style="left: <?php echo ($v['mileX'] % 4) * 432; ?>px; top: <?php echo ($v['mileY'] % 4) * 432; ?>px; z-index: <?php echo $zIndex; ?>; background-image: none; background-color: #fff;" forcereload="0" class="footBlock <?php echo $k; ?>" id="c<?php echo $v['mileX'] % 4; ?>r<?php echo $v['mileY'] % 4; ?>"><?php echo $v['img']; ?></div>
			<?php endforeach; ?>
		<?php endif; ?>
	</div>
	
	<!--Control Panel-->
	<?php echo $cpanel;?>
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
	
	<?php if( isset($lightboxContent)): ?>
		<div id="lightboxbk">
			<img class="lbshadow" src="/static/shadow.png">
			<div id="lightboxlight">
				<span class="lightboxTitle"><?php echo $lightboxTitle; ?></span>
				<div style="" id="lightboxcontent" class="">
					<?php echo ($lightboxContent);?>
				</div>
			</div>
			
			<a id="closeLB" href="/" onclick="closeLB();"></a>
		</div>
	<?php endif; ?>
</div>


<?php /*
<!--[if IE]>
<script type='text/javascript'  src='http://getfirebug.com/releases/lite/1.2/firebug-lite-compressed.js'></script>
<![endif]-->
*/ ?>
