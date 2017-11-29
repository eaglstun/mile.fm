<div id="commentTabs">
	<div onclick="showComment('1')" id="commentTab1" class="commentTab <?php echo trim($display[1]) ? 'deSelected' : '' ?>">Comments</div>
	<div onclick="showComment('2')" id="commentTab2" class="commentTab <?php echo trim($display[2]) ? 'deSelected' : '' ?>">Tags</div>
	<div id="voteBlock">
		<?php echo $voteblock; ?>
	</div>
</div>
	<div onclick="showComment('5')" id="commentTab5" class="commentTab <?php echo trim($display[3]) ? 'deSelected' : '' ?>">More</div>
</div>



<div id="commentSection1" class="commentSection" style="<?php echo $display[1]; ?>">
	<div class="commentBlock noDrag" id="commentBlock" >
		<?php if (count($comment) > 0){
			foreach ($comment as $k=>$v){ 
				//dbug($v, '$v' );
				$userid = $v['userid'];
				$userName = $v['userName'];
				$comment = stripslashes($v['comment']); ?>
				
				<div class="comment" class="noDrag">
					<a onclick="getFriendInfo('<?php echo $userid; ?>', this)" user="<?php echo $userName; ?>" class="commentUser"><?php echo $userName; ?></a>
					 : <?php echo $comment; ?>
				</div>
		<?php }
		} else { ?>
			<div class="defaultBal" onclick="addComment(<?php echo $postId ?>);">No comments yet! Add yours!</div>
		<?php } ?>
	</div>
	
	<?php if (count($comment)): ?>
		<a class="commentAction" onclick="addComment(<?php echo $postId ?>);">Add A Comment</a>
	<?php endif ?>
</div>

<div id="commentSection2" style="<?php echo $display[2]; ?>" class="commentSection">
	<div class="commentBlock noDrag" id="tagBlock">
		<?php echo $tagcloud ?>
	</div>
	
	<?php if (count($tags)): ?>
		<a class="commentAction" onclick="addTag(<?php echo $postId ?>);">Tag this image</a>
	<?php endif ?>
</div>

<div id="commentSection3" style="<?php echo $display[3]; ?>" class="commentSection">
	<div class="commentBlock noDrag" id="tagBlock">
		Add a comment
		<form name="commentForm" id="commentForm" onsubmit="submitComment();return false">
			<textarea class="squareComment noDrag" id="squareComment" name="squareComment" ></textarea>
			
			<div class="buttonContainer">
				<input type="submit" class="stdButton" value="Add Comment" />
			</div>
		</form>
	</div>
	
	<a class="commentAction" onclick="showComment('1')">Cancel</a>
	
</div>

<div id="commentSection4" style="<?php echo $display[4]; ?>" class="commentSection">
	<div class="commentBlock noDrag" id="tagBlock">
		Add tags (comma separated)
		<form name="tagForm" id="tagForm" onsubmit="submitTag();return false">
			<textarea class="squareComment noDrag" id="squareTag" name="squareTag"></textarea>
			
			<div class="buttonContainer">
				<input type="button" class="stdButton" value="Add Tags" onclick="submitTag();"/>
			</div>
		</form>
	</div>
	
	<a class="commentAction" onclick="showComment('2')">Cancel</a>
	
</div>

<div id="commentSection5" style="<?php echo $display[5]; ?>" class="commentSection">
	<div class="commentBlock noDrag" id="tagBlock">
		
		<ul>
			<li><a href="" onclick="move(<?php echo $postId ?>);return false">Move</a></li>
		</ul>

		<p>
			this image is from <a href="<?php echo $orig_page ?>" target="_blank" ><?php echo $orig_page ?></a>
			<hr/>
			it's original location is <a href="<?php echo $orig_loc ?>" target="_blank" ><?php echo $orig_loc ?></a>
		</p>
		
	</div>
	
	<a class="commentAction" onclick="showComment('1')">Cancel</a>
	
</div>

<a href="" onclick="startReport('<?php echo $postId; ?>' );return false;" class="reportBad">Report Bad Content?</a>

<input type="hidden" id="squareID" class="noDrag" value="<?php echo $postId; ?>"/>