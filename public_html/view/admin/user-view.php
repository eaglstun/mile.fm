<? d($user); ?>

<h3>user info</h3>

<ul class="crumbs">
	<li><a href="/admin/home">admin home</a></li>
	<li><a href="/admin/users">user list</a></li>
	<li>user</li>
</ul>

<h3><?= $user['user']; ?> (id #<?= $user['id']; ?>)</h3>

<form action="/admin/users/saveuser" method="post">
	<div class="inputContainer">
		<label>User ID:</label>
		<input type="text" class="stdInput" name="userid" id="" value="<?= $user['id']; ?>" />
	</div>
	
	<div class="inputContainer">
		<label>Email Address:</label>
		<input type="text" class="stdInput" name="email" id="" value="<?= $user['email']; ?>"/>
	</div>
	
	<div class="inputContainer">
		<label>Invitations</label>
		<input type="" class="stdInput" name="invites" id="" value="<?= $user['invites']; ?>"/>
		
		(<?= count($invite) ?> sent, <?= count($accept) ?> accepted)
		
		<? //d($invite) ?>
	</div>
	
	<div class="inputContainer">
		<label>On Mailing list:</label>
		<input type="checkbox" class="" name="maillist" id="" <?= $user['maillist'] == 1 ? 'checked="true"' : ''; ?>/>
	</div>
	
	<div class="inputContainer">
		<label>Show Map</label>
		<input type="checkbox" class="" name="showmap" id="" <?= $user['showmap'] == 1 ? 'checked="true"' : ''; ?>/>
	</div>
	
	<div class="buttonContainer">
		<input type="submit" class="stdButton" name="" id="" value="Save"/>
	</div>
</form>

<p>Has made <a href="/admin/users/viewcontent/userid/<?= $user['id']; ?>/show/comments"><?= $comments; ?> comments</a></p>

<p>Has made <?= $tags; ?> tags</p>

<p>Has made <?= $votepos+$voteneg; ?> votes, <?= $votepos; ?> positive and  <?= $voteneg; ?> negative</p>

<p> Has added <?= $added; ?> images</p>