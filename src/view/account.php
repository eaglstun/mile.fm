<form name="userAccount">
	<div class="inputContainer">
		<label for="">username</label>
		<input type="text" id="username" name="username" value="<? echo $result['user']; ?>" class="stdInput">
	</div>
	
	<div class="inputContainer">
		<label for="">email</label>
		<input type="text" id="useremail" name="useremail" value="<? echo $result['email']; ?>" class="stdInput">
	</div>
	
	<div class="inputContainer">
		<label for="">show nsfw?</label>
		<input type="checkbox" id="show_nudity" name="show_nudity" <? echo $result['show_nudity']; ?> />
	</div>
	
	<div class="inputContainer">
		<label for="">change password</label>
		<input type="password" size="14" id="userpass1" name="userpass1" value="" class="stdInput">
	</div>
	
	<div class="inputContainer">
		<label for="">confirm password change</label>
		<input type="password" size="14" id="userpass2" name="userpass2" value="" class="stdInput">
	</div>
	
	<div class="buttonContainer">
		<input type="button" class="stdButton" value="Update Account" onclick="UpdateProfile();">
	</div>
</form>