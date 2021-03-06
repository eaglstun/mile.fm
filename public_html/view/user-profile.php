<ul class="profileEdit">
	<li id="profileLink1" style="display:none"><a onclick="toggleProfile(1);" >view your profile</a> </li>
	<li id="profileLink2"><a onclick="toggleProfile(2);">edit your profile</a> </li>
	<li id="profileLink3"><a onclick="toggleProfile(3);">change your picture</a> </li>
	<li id="profileLink4"><a onclick="toggleProfile(4);">edit your links</a> </li>
</ul>

<div id="profile1" class="profileTab">
	<img src="/content/profile/<?= trim( $profile['pic']) ? $profile['pic'] : 'defaultFriend.gif'; ?>" id="currentUserPic" class="profilePic"/>
	
	<h2 class="username"><?= $profile['user']; ?></h2>
	
	<div id="profileHTML"><?= $profile['profile']; ?></div>  
	
	<div id="userExternal">
	<?= $externalSites; ?>
	</div>
	
	<div class="spacer"></div>
</div>

<div id="profile2" style="display:none" class="profileTab">
	<p class="helperText">The text in your profile that the public will see. <nobr>Keep it short!</nobr></p>
	<form name="cp_prof" action="" method="POST">
		<textarea name="profile" id="profileEdit"><?= $profile['profile']; ?></textarea>
		
		<div class="buttonContainer">
			<a class="fakeButton" onclick="sendProfile();return false">Submit</a>
		</div>
	</form>
	
	<div class="spacer"></div>
</div>

<div id="profile3" style="display:none" class="profileTab">

	<p class="helperText">You can add a picture to your profile, will crop to 72 x 72.</p>
	
	<form name="" action="/profile/update-pic" target="uploadTarget" method="post" enctype="multipart/form-data">
		<input type="file" id="profilePicInput" name="profilePic"/>
		
		<div class="buttonContainer">
			<input type="submit" value="Upload" class="stdButton"/>
		</div>	
	</form>
	
	<iframe name="uploadTarget" id="uploadTarget" src="/profile/update-pic-holder"></iframe>
	
	<div class="spacer"></div>
</div>

<div id="profile4" style="display:none" class="profileTab">
	
	<p class="helperText">Edit the links to other sites you are on.</p>
	
	<form name="cp_ext" action="" method="POST">
		<div>
			<select id="profileNewLink" onchange="updateExt()" name="extid" class="stdInput">
				<option value="">select</option>
				<? foreach( $allsites as $k=>$v ): ?>
					<option value="<?= $v['id'] ?>" url="<?= $v['url'] ?>" username="<?= $v['username'] ?>" uid="<?= $v['uid'] ?>"><?= $v['site'] ?></option>
				<? endforeach ?>
			</select>
		</div>
		
		<div class="inputContainer">
			<label for="extLink" id="xlinklabel">&nbsp;</label>
			<input id="extLink" name="extusername" value="" type="text" class="stdInput" value="hello"/>
		</div>
		
		<div class="buttonContainer">
			<button id="" name="" type="text" class="stdButton" onclick="sendExt();return false">Save</button>
		</div>
	</form>
	
	<div class="spacer"></div>
</div>


