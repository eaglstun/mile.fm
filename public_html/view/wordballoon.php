<div id="commentTabs">
	<div onclick="showComment('1')" id="commentTab1" class="commentTab <?= trim($display[1]) ? 'deSelected' : '' ?>">Tags</div>
	<div onclick="showComment('2')" id="commentTab2" class="commentTab <?= trim($display[2]) ? 'deSelected' : '' ?>">Comments</div>
	<div onclick="showComment('5')" id="commentTab5" class="commentTab <?= trim($display[3]) ? 'deSelected' : '' ?>">More</div>
	
	<div id="voteBlock">
		<?= $voteblock; ?>
	</div>
</div>

<div id="commentSection1" style="<?= $display[1]; ?>" class="commentSection">
	<div class="commentBlock" id="tagBlock">
		<?= $tagcloud ?>
	</div>
	
	<? if (count($tags)): ?>
		<a class="commentAction" onclick="addTag(<?= $objectid ?>);">Tag this image</a>
	<? endif ?>
</div>

<div id="commentSection2" class="commentSection" style="<?= $display[2]; ?>">
	<div class="commentBlock" id="commentBlock" >
		<? if (count($comments) > 0){
			foreach ($comments as $k=>$v){ 
				//dbug($v, '$v' );
				$userid = $v['userid'];
				$userName = $v['userName'];
				$comment = stripslashes($v['comment']); ?>
				
				<div class="comment">
					<a href="/profile/<?= $userName; ?>" onclick="getFriendInfo('<?= $userid; ?>', this);return false" user="<?= $userName; ?>" class="commentUser"><?= $userName; ?></a>
					 : <?= $comment; ?>
				</div>
		<? }
		} else { ?>
			<div class="defaultBal" onclick="addComment(<?= $objectid ?>);">No comments yet! Add yours!</div>
		<? } ?>
	</div>
	
	<? if (count($comments)): ?>
		<a class="commentAction" onclick="addComment(<?= $objectid ?>);">Add A Comment</a>
	<? endif ?>
</div>



<div id="commentSection3" style="<?= $display[3]; ?>" class="commentSection">
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

<div id="commentSection4" style="<?= $display[4]; ?>" class="commentSection">
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

<div id="commentSection5" style="<?= $display[5]; ?>" class="commentSection">
	<div class="commentBlock" id="tagBlock">
		
		<ul>
			<li><a href="" onclick="move(<?= $objectid ?>);return false">Move</a></li>
			<li><a href="<?= $shortlink; ?>">link here</a></li>
		</ul>

		<p>
			this image is from <a href="<?= $orig_page ?>" target="_blank" ><?= $orig_page ?></a>
		</p>
		
		<hr/>
		
		<p>
			it's original location is <a href="<?= $orig_loc ?>" target="_blank" ><?= $orig_loc ?></a>
		</p>
		
	</div>
	
</div>

<div id="balloonFooter">
	<a href="/" onclick="startReport('<?= $objectid; ?>' );return false;" class="reportBad">Report Bad Content?</a>
	<a href="/profile/<?= $user; ?>" class="imageBy" onclick="getFriendInfo('<?= $userid; ?>', this);return false" user="<?= $user; ?>">image by <?= $user; ?></a>
</div>

<input type="hidden" id="squareID" value="<?= $objectid; ?>"/>