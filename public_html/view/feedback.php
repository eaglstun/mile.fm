<? /*
<h2>Send us a bug report / feedback / anything!</h2>

<div class="min">
	<p>All fields are optional</p>
	
	<form id="formFeedback" name="formFeedback">
		<div class="inputContainer">
			<label>Your user name:</label>
			<input type="text" name="username" value="<? echo isset( $_SESSION['username'] ) ? $_SESSION['username'] : ''; ?>" class="stdInput"/>
		</div>
		
		<div class="inputContainer">
			<label>Your web browser / OS:</label>
			<input type="text" name="browser" value="<? echo $_SERVER['HTTP_USER_AGENT']; ?>" class="stdInput"/>
		</div>
		
		<div class="inputContainer">
			<label>Feedback:</label>
			<textarea class="stdText" id="feedback" name="feedback"></textarea>
		</div>
		
		<div class="buttonContainer">
			<input type="button" class="stdButton" value="Send" onClick="sendFeedback()"/>
		</div>
	</form>
	
	<p>
		Or, you can share an idea or report a problem on <a href="http://getsatisfaction.com/milefm" target="_blank">Get Satisfaction</a>!
	</p>
</div>
*/ ?>

<iframe id="fdbk_iframe_inline" allowTransparency="true" width="95%" height="90%" style="margin-left:2%" scrolling="no" frameborder="0" src="http://getsatisfaction.com/milefm/feedback/topics/new?display=inline&amp;style=idea"></iframe>
