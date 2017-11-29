<div id="commentTabs">
	<div onclick="showComment('1')" id="commentTab1" class="commentTab <?php echo trim($display[1]) ? 'deSelected' : '' ?>">Tags</div>
	<div onclick="showComment('2')" id="commentTab2" class="commentTab <?php echo trim($display[2]) ? 'deSelected' : '' ?>">Comments</div>
	<div onclick="showComment('5')" id="commentTab5" class="commentTab <?php echo trim($display[3]) ? 'deSelected' : '' ?>">More</div>
	
	<div id="voteBlock">
		<?php echo $voteblock; ?>
	</div>
</div>

<div id="commentSection1" style="<?php echo $display[1]; ?>" class="commentSection">
	<div class="commentBlock" id="tagBlock">
		<?php echo $tagcloud ?>
	</div>
	
	<?php if (count($tags)): ?>
		<a class="commentAction" onclick="addTag(<?php echo $objectid ?>);">Tag this image</a>
	<?php endif ?>
</div>

<div id="commentSection2" class="commentSection" style="<?php echo $display[2]; ?>">
	<div class="commentBlock" id="commentBlock" >
		<?php if (count($comments) > 0){
			foreach ($comments as $k=>$v){ 
				//dbug($v, '$v' );
				$userid = $v['userid'];
				$userName = $v['userName'];
				$comment = stripslashes($v['comment']); ?>
				
				<div class="comment">
					<a href="/profile/<?php echo $userName; ?>" onclick="getFriendInfo('<?php echo $userid; ?>', this);return false" user="<?php echo $userName; ?>" class="commentUser"><?php echo $userName; ?></a>
					 : <?php echo $comment; ?>
				</div>
		<?php }
		} else { ?>
			<div class="defaultBal" onclick="addComment(<?php echo $objectid ?>);">No comments yet! Add yours!</div>
		<?php } ?>
	</div>
	
	<?php if (count($comments)): ?>
		<a class="commentAction" onclick="addComment(<?php echo $objectid ?>);">Add A Comment</a>
	<?php endif ?>
</div>



<div id="commentSection3" style="<?php echo $display[3]; ?>" class="commentSection">
	<div class="commentBlock" id="tagBlock">
		Add a comment
		<form name="commentForm" id="commentForm" action="/map/comment">
			<textarea class="squareComment" id="squareComment" name="squareComment" ></textarea>
			
			<div class="buttonContainer">
				<input type="submit" class="stdButton" value="Add a Comment" />
			</div>
		</form>
	</div>
	
	<a class="commentAction" onclick="showComment('1')">Cancel</a>
	
</div>

<div id="commentSection4" style="<?php echo $display[4]; ?>" class="commentSection">
	<div class="commentBlock" id="tagBlock">
	
		<span class="balHelp">comma or space seperated, double quotes ok</span>
		
		<form name="tagForm" id="tagForm" onsubmit="submitTag();return false">
			<textarea class="squareComment" id="squareTag" name="squareTag"></textarea>
			
			<div class="buttonContainer">
				<input type="button" class="stdButton" value="Add Tags" onclick="submitTag();"/>
			</div>
		</form>
	</div>
	
	<a class="commentAction" onclick="showComment('2')">Cancel</a>
	
</div>

<div id="commentSection5" style="<?php echo $display[5]; ?>" class="commentSection">
	<div class="commentBlock" id="tagBlock">
		
		<ul>
			<li><a href="" onclick="move(<?php echo $objectid ?>);return false">Move</a></li>
			<li><a href="<?php echo $shortlink; ?>">link here</a></li>
		</ul>

		<p>
			this image is from <a href="<?php echo $orig_page ?>" target="_blank" ><?php echo $orig_page ?></a>
		</p>
		
		<hr/>
		
		<p>
			it's original location is <a href="<?php echo $orig_loc ?>" target="_blank" ><?php echo $orig_loc ?></a>
		</p>
		
	</div>
	
</div>

<div id="balloonFooter">
	<a href="/" onclick="startReport('<?php echo $objectid; ?>' );return false;" class="reportBad">Report Bad Content?</a>
	<a href="/profile/<?php echo $user; ?>" class="imageBy" onclick="getFriendInfo('<?php echo $userid; ?>', this);return false" user="<?php echo $user; ?>">image by <?php echo $user; ?></a>
</div>

<input type="hidden" id="squareID" value="<?php echo $objectid; ?>"/>