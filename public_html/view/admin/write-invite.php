<h3>send invite</h3>

<ul class="crumbs">
	<li><a href="admin/home">admin home</a></li>
	<li><a href="admin/users/request">beta requests</a></li>
	<li>send an invite</li>
</ul>

<form action="admin/users/dosend" method="post">
	<div class="inputContainer">
		<label for="to">to:</label>
		<input type="text" id="to" name="to" value="<?= $to['email']; ?>" class="stdInput"/>
	</div>
	
	<div class="inputContainer">
		<label for="subject">subject:</label>
		<input type="text" id="subject" name="subject" value="<?= $email['subject'];?>" class="stdInput"/>
	</div>
	
	<div class="inputContainer">
		<label for="body">body:</label>
		<textarea name="body" id="body" class="stdText"><?= $email['message'];?></textarea>
	</div>
	
	<div class="buttonContainer">
		<input type="submit" value="send"  class="stdButton"/>
	</div>
</form>

<script src="js/nicEdit.js" type="text/javascript"></script>
<script type="text/javascript">bkLib.onDomLoaded(nicEditors.allTextAreas);</script>
						