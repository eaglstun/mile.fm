<div id="commentTabs">
	<div onclick="showComment('1')" id="commentTab1" class="commentTab <?= trim($display[1]) ? 'deSelected' : '' ?>">Comments</div>
	<div onclick="showComment('2')" id="commentTab2" class="commentTab <?= trim($display[2]) ? 'deSelected' : '' ?>">Tags</div>
	<div id="voteBlock">
		<?= $voteblock; ?>
	</div>
</div>
	<div onclick="showComment('5')" id="commentTab5" class="commentTab <?= trim($display[3]) ? 'deSelected' : '' ?>">More</div>
</div>



<div id="commentSection1" class="commentSection" style="<?= $display[1]; ?>">
	<div class="commentBlock noDrag" id="commentBlock" >
		<? if (count($comment) > 0){
			foreach ($comment as $k=>$v){ 
				//dbug($v, '$v' );
				$userid = $v['userid'];
				$userName = $v['userName'];
				$comment = stripslashes($v['comment']); ?>
				
				<div class="comment" class="noDrag">
					<a onclick="getFriendInfo('<? echo $userid; ?>', this)" user="<? echo $userName; ?>" class="commentUser"><? echo $userName; ?></a>
					 : <? echo $comment; ?>
				</div>
		<? }
		} else { ?>
			<div class="defaultBal" onclick="addComment(<?= $postId ?>);">No comments yet! Add yours!</div>
		<? } ?>
	</div>
	
	<? if (count($comment)): ?>
		<a class="commentAction" onclick="addComment(<?= $postId ?>);">Add A Comment</a>
	<? endif ?>
</div>

<div id="commentSection2" style="<?= $display[2]; ?>" class="commentSection">
	<div class="commentBlock noDrag" id="tagBlock">
		<?= $tagcloud ?>
	</div>
	
	<? if (count($tags)): ?>
		<a class="commentAction" onclick="addTag(<?= $postId ?>);">Tag this image</a>
	<? endif ?>
</div>

<div id="commentSection3" style="<?= $display[3]; ?>" class="commentSection">
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

<div id="commentSection4" style="<?= $display[4]; ?>" class="commentSection">
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

<div id="commentSection5" style="<?= $display[5]; ?>" class="commentSection">
	<div class="commentBlock noDrag" id="tagBlock">
		
		<ul>
			<li><a href="" onclick="move(<?= $postId ?>);return false">Move</a></li>
		</ul>

		<p>
			this image is from <a href="<?= $orig_page ?>" target="_blank" ><?= $orig_page ?></a>
			<hr/>
			it's original location is <a href="<?= $orig_loc ?>" target="_blank" ><?= $orig_loc ?></a>
		</p>
		
	</div>
	
	<a class="commentAction" onclick="showComment('1')">Cancel</a>
	
</div>

<a href="" onclick="startReport('<? echo $postId; ?>' );return false;" class="reportBad">Report Bad Content?</a>

<input type="hidden" id="squareID" class="noDrag" value="<? echo $postId; ?>"/>