<img src="/static/<?= ($vote == 1) ? 'thumbshadow': 'blankthumb';?>.png" class="voteThumb <? 

if ($vote == -1 ){ 
	echo 'up';
} else if ($vote == 0){
	echo 'on';
}

?>" for="<?= $objectid; ?>" value="-1" alt="thumbs down" id="thDown"/>
	
<img src="/static/<?= ($vote == -1) ? 'thumbshadow': 'blankthumb';?>.png" class="voteThumb <? 

if ($vote == 1 ){ 
	echo 'up';
} else if ($vote == 0){
	echo 'on';
}

?>" for="<?= $objectid; ?>" value="1" alt="thumbs up" id="thUp"/>