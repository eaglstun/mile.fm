<img src="/static/<?php echo ($vote == 1) ? 'thumbshadow': 'blankthumb';?>.png" class="voteThumb <?php 

if ($vote == -1 ){ 
	echo 'up';
} else if ($vote == 0){
	echo 'on';
}

?>" for="<?php echo $objectid; ?>" value="-1" alt="thumbs down" id="thDown"/>
	
<img src="/static/<?php echo ($vote == -1) ? 'thumbshadow': 'blankthumb';?>.png" class="voteThumb <?php 

if ($vote == 1 ){ 
	echo 'up';
} else if ($vote == 0){
	echo 'on';
}

?>" for="<?php echo $objectid; ?>" value="1" alt="thumbs up" id="thUp"/>