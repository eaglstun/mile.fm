<ul class="profileEdit">
	<li id="profileLink1" style="display:none"><a onclick="toggleProfile(1);" >view your profile</a> </li>
	<li id="profileLink2"><a onclick="toggleProfile(2);">edit your profile</a> </li>
	<li id="profileLink3"><a onclick="toggleProfile(3);">change your picture</a> </li>
	<li id="profileLink4"><a onclick="toggleProfile(4);">edit your links</a> </li>
</ul>

<div id="profile1" class="profileTab">
	<img src="content/profile/<? echo $profile['pic']; ?>" class="profilePic"/>
	
	<h2 class="username"><? echo $profile['user']; ?></h2>
	
	<div id="profileHTML" class="noDrag"><? echo $profile['profile']; ?></div>  
	
	<div id="userExternal">
	<?= $externalSites; ?>
	</div>
	
	<br style="clear:both"/>
</div>

<div id="profile2" style="display:none" class="profileTab">
	<p class="helperText">You can put in a little bit that people will see.  Keep it short!</p>
	<form name="cp_prof" action="" method="POST">
		<textarea class="noDrag" name="profile" id="profileEdit"><? echo $profile['profile']; ?></textarea>
		
		<a class="fakeButton" onclick="sendProfile();return false">Submit</a>
	</form>
</div>

<div id="profile3" style="display:none" class="profileTab">

	<p class="helperText">You can add a picture to your profile, will crop to 72 x 72.</p>
	
	<form name="">
		<input type="file" name=""/>
		
		<div class="buttonContainer">
			<input type="button" name="" value="Send" class="stdButton"/>
		</div>	
	</form>
</div>

<div id="profile4" style="display:none" class="profileTab">
	
	<p class="helperText">Edit the links to other sites you are on.</p>
	
	<form name="cp_ext" action="" method="POST">
		<select class="noDrag" id="profileNewLink" onchange="updateExt()" name="extid">
			<option value="">select</option>
			<? foreach( $allsites as $k=>$v): ?>
				<option value="<?= $v['id'] ?>" url="<?= $v['url'] ?>" username="<?= $v['username'] ?>" uid="<?= $v['uid'] ?>"><?= $v['site'] ?></option>
			<? endforeach ?>
		</select>
		
		<div class="inputContainer">
			<label for="extLink" id="xlinklabel"></label>
			<input id="extLink" name="extusername" value="" type="text" class="stdInput noDrag"/>
		</div>
		
		<div class="buttonContainer">
			<button id="" name="" type="text" class="stdButton" onclick="sendExt();return false">Save</button>
		</div>
	</form>
</div>


