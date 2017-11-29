<?php dbug($user); ?>

<h3>user info</h3>

<ul class="crumbs">
	<li><a href="/admin/home">admin home</a></li>
	<li><a href="/admin/users">user list</a></li>
	<li>user</li>
</ul>

<h3><?php echo $user['user']; ?> (id #<?php echo $user['id']; ?>)</h3>

<form action="/admin/users/saveuser" method="post">
	<div class="inputContainer">
		<label>User ID:</label>
		<input type="text" class="stdInput" name="userid" id="" value="<?php echo $user['id']; ?>" />
	</div>
	
	<div class="inputContainer">
		<label>Email Address:</label>
		<input type="text" class="stdInput" name="email" id="" value="<?php echo $user['email']; ?>"/>
	</div>
	
	<div class="inputContainer">
		<label>Invitations</label>
		<input type="" class="stdInput" name="invites" id="" value="<?php echo $user['invites']; ?>"/>
		
		(<?php echo count($invite) ?> sent, <?php echo count($accept) ?> accepted)
		
		<?php //dbug($invite) ?>
	</div>
	
	<div class="inputContainer">
		<label>On Mailing list:</label>
		<input type="checkbox" class="" name="maillist" id="" <?php echo $user['maillist'] == 1 ? 'checked="true"' : ''; ?>/>
	</div>
	
	<div class="inputContainer">
		<label>Show Map</label>
		<input type="checkbox" class="" name="showmap" id="" <?php echo $user['showmap'] == 1 ? 'checked="true"' : ''; ?>/>
	</div>
	
	<div class="buttonContainer">
		<input type="submit" class="stdButton" name="" id="" value="Save"/>
	</div>
</form>

<p>Has made <a href="/admin/users/viewcontent/userid/<?php echo $user['id']; ?>/show/comments"><?php echo $comments; ?> comments</a></p>

<p>Has made <?php echo $tags; ?> tags</p>

<p>Has made <?php echo $votepos+$voteneg; ?> votes, <?php echo $votepos; ?> positive and  <?php echo $voteneg; ?> negative</p>

<p> Has added <?php echo $added; ?> images</p>