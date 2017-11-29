<div id="cpanel">
	
	<div id="cpaneltop">
		<a class="menuButton btnMM" onclick="menuToggle(this)">Minimize</a>
		
		<h5>MILE .fm</h5>
	
	</div>
	
	<div id="cpanelContent">
		<div id="cpanelHolder">
		
			<? 
				$auth = isset($_SESSION['userauth']) ? $_SESSION['userauth'] : 0;
				$which = $auth & 1 ? 'in' : 'out';
			?>
			<div id="control1" class="mainControl">
				<?= $this->Render( 'menu/menu-logged'.$which.'-left' ); ?>
			</div>
			
			<div id="control2" class="mainControl">
				<?= $this->Render( 'menu/menu-logged'.$which.'-right' ); ?>
			</div>
			
		</div>
		
		<!--end main control panel panes-->

<!--messages-->
		<div id="m1" class="cpanelMessage" style="display:none">
			
			<div class="menuHead">
				<a class="menuButton btnX" onclick="closeCpanel(1);">Close</a>
				<a class="menuButton btnMM" onclick="menuToggle(this);">Minimize</a>
				
				<div class="menuNav">
					<a id="m1prev">Prev</a>
					<a id="m1next">Next</a>
				</div>
				
				<span class="cTitle">Message 1</span>
			</div>
			
			<div id="m1main" class="menuMain"></div>
			<div id="m1err" class="cpanelErr"></div>
		</div>
		
		<div id="m2" class="cpanelMessage" style="<?= isset($menu2) ? '' : 'display:none'; ?>">
			
			<div class="menuHead">
				<a class="menuButton btnX" onclick="closeCpanel(2);">Close</a>
				<a class="menuButton btnMM" onclick="menuToggle(this);">Minimize</a>
				<a class="menuButton btnRSS">RSS Feed</a>
				
				<div class="menuNav">
					<a id="m2prev" href="<?= isset($menu2) ? $menu2['prev'] : '' ;?>" onclick="return false;">Prev</a>
					<a id="m2next" href="<?= isset($menu2) ? $menu2['next'] : '' ;?>" onclick="return false;">Next</a>
				</div>
				
				<span class="cTitle"><?= isset($menu2) ? $menu2['title'] : ''; ?></span>
			</div>
			
			<div id="m2main" class="menuMain">
				<?= isset($menu2) ? $menu2['content'] : ''; ?>
			</div>
			
			<div id="m2err" class="cpanelErr"></div>
		</div>
		
		<div id="m3" class="cpanelMessage" style="display:none">
			
			<h5>
				<a class="menuButton btnX" onclick="closeCpanel(3);"></a>
				<a class="menuButton btnMM" onclick="menuToggle(this);"></a>
					
				<div class="menuNav">
					<a id="m3prev">Prev</a>
					<a id="m3next">Next</a>
				</div>
				
				<span class="cTitle">Message 3</span>
			</h5>
			
			<div id="m3main"></div>
			<div id="m3err" class="cpanelErr"></div>
		</div>
		
		<div id="m4" class="cpanelMessage" style="<?= isset($menu4) ? '' : 'display:none'; ?>">
			
			<h5>
				<a class="menuButton btnX" onclick="closeCpanel(4);"></a>
				<a class="menuButton btnMM" onclick="menuToggle(this);"></a>
				
				<div class="menuNav">
					<a id="m4prev"><?= isset($menu4) ? $menu4['prev']['text'] : 'Prev' ;?></a>
					<a id="m4next"><?= isset($menu4) ? $menu4['next']['text'] : 'Next' ;?></a>
				</div>
				
				<span class="cTitle"><?= isset($menu4) ? $menu4['title'] : ''; ?></span>
			</h5>
			
			<div id="m4main">
				
				<div id="friendProfile">
					<div id="friendProfilemain">
						<?= isset($menu4) ? $menu4['content'] : ''; ?>
					</div>
				</div>
				
				<div id="friendAdd" class="cpanelMessage">
					<h5>
						<div class="menuNav">
							<a href="<?= isset($menu4) ? $menu4['friendAdds']['prev']['href'] : '/'; ?>" id="friendAddprev" onclick="return false;">Prev</a>
							<a href="<?= isset($menu4) ? $menu4['friendAdds']['next']['href'] : '/'; ?>" id="friendAddnext" onclick="return false;">Next</a>
						</div>
						<span id="friendAddtitle" class="cTitle"><?= isset($menu4) ? $menu4['friendAdds']['title'] : ''; ?></span>
					</h5>
					
					<div id="friendAddmain">
						<?= isset($menu4) ? $menu4['friendAdds']['content'] : ''; ?>
					</div>
					
					<div id="friendAdderr" class="cpanelErr"></div>
					
				</div>
			
			
			
				<div id="friendComment" class="cpanelMessage">
					<h5>
						<div class="menuNav">
							<a href="<?= isset($menu4) ? $menu4['friendComments']['prev']['href'] : '/'; ?>" id="friendCommentprev" onclick="return false;">Prev</a>
							<a href="<?= isset($menu4) ? $menu4['friendComments']['next']['href'] : '/'; ?>"  id="friendCommentnext" onclick="return false;">Next</a>
						</div>
						<span id="friendCommenttitle"  class="cTitle"><?= isset($menu4) ? $menu4['friendComments']['title'] : ''; ?></span>
					</h5>
					
					<div id="friendCommentmain">
						<?= isset($menu4) ? $menu4['friendComments']['content'] : ''; ?>
					</div>
					
					<div id="friendCommenterr" class="cpanelErr"> </div>
				</div>
	
			</div>
			
			<div id="m4err" class="cpanelErr"></div>
			
		</div>
		
		<div id="m5" class="cpanelMessage logIn" <?= isset( $_SESSION['userid'] ) || isset($hideLogin) ? 'style="display:none"' : ''; ?>>
			
			<h5>
				<a class="menuButton btnX" onclick="closeCpanel(5);"></a>
				<a class="menuButton btnMM" onclick="menuToggle(this);"></a>
				
				<span class="cTitle">Log In</span>
			</h5>
			
			<div id="m5main" class="menuMain">
			
				<form id="loginForm" name="loginForm" action="/profile/login" method="post">
					
					<div class="inputContainer">
						<label for="username">name : </label>
						<input name="user" class="stdInput" id="username" type="text"/>
					</div>
					
					<div class="inputContainer">
						<label for="password">password : </label>
						<input name="pass" class="stdInput" id="password" type="password" />
					</div>
					
					<div class="buttonContainer">
						<a href="" id="loginHelp" onclick="return false;">forget your password?</a>
						
						<input type="submit" class="stdButton" value="login"/>
					</div>
					
				</form>
				
				<div id="loginMessage" class="feedbackMessage"></div>
				
				<form action="/profile/reset" id="loginForgot" name="loginForgot" method="post">
					<div class="inputContainer">
						<label for="password">email : </label>
						<input name="email" class="stdInput" id="" type="text" />
					</div>
					
					<div class="buttonContainer">
						<input type="submit" class="stdButton" value="send"/>
					</div>
				</form>
				
				<div id="resetMessage" class="feedbackMessage"></div>
				
			</div>
		</div>
		
		<div id="m6" class="cpanelMessage logIn" style="<?= isset($_SESSION['userid']) || isset($hideLogin) ? 'display:none' : '' ?>">
			<h5>
				<a class="menuButton btnX" onclick="closeCpanel(6);">Close Signup</a>
				<a class="menuButton btnMM" onclick="menuToggle(this);">Minimize Signup</a>
				<span class="cTitle">Sign Up</span>
			</h5>
			
			<form action="/profile/signup" class="menuMain" name="signup" id="signup" method="post">
				<div class="inputContainer">
					<label for="username">name : </label>
					<input name="user" class="stdInput" id="" type="text"/>
				</div>
				
				<p class="loginHelperText">letters, numbers, and spaces ok</p>
				
				<div class="inputContainer">
					<label for="username">password : </label>
					<input name="pass" class="stdInput" id="" type="password"/>
				</div>
				
				<p class="loginHelperText">you know the drill</p>
				
				<div class="inputContainer">
					<label for="username">email : </label>
					<input name="email" class="stdInput" id="" type="text" value=""/>
				</div>
				
				<p class="loginHelperText">not required, but if you <br/>forget your password you're out of luck</p>
				
				<div class="buttonContainer">
					<input type="submit" class="stdButton" value="sign up!" id="signupbutton"/>
				</div>
				
				<div id="signupMsg" class="feedbackMessage"></div>
				
			</form>
		</div>
	</div>
		
	<div id="cpanelbottom"> </div>	
</div>
 

