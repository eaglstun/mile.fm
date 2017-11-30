<h2>API For Developers</h2>

<p>
	The API for the Square Mile is in a very eraly stage, expect changes for the final release!  It currently only supports JSON output.  http://localhost/newsquare/beta/api/
</p>

<p>Methods:</p>

<span class="methodName" onclick="expandMethod(this);">getUserID</span>
<div class="methodDesc">
	<p class="description">
		Gets the user id, nased on the user name passed in.
	</p>
		
	<ul>
		<li>Required Params:</li>
		<li>for</li>
		<li>the user name you want to retrieve an id for</li>
	</ul>
	
	<ul>
		<li>Returns on success:</li>
		<li>userid</li>
		<li>the id of the user</li>
		
		<li>username</li>
		<li>the user name you passed in</li>
		
		<li>success</li>
		<li>true</li>
	</ul>
	
	<ul>
		<li>Returns on failure:</li>
		<li>success</li>
		<li>false</li>
	</ul>
</div>

<span class="methodName" onclick="expandMethod(this);">getUserAdds</span>
<div class="methodDesc">
	<p class="description">
		Gets the added pictures, based on the user id passed in.
	</p>
		
	<ul>
		<li>Required Params:</li>
		<li>for</li>
		<li>the user id you want to retrieve additions for</li>
	</ul>
	
	<ul>
		<li>Optional Params:</li>
		<li>limit</li>
		<li>number of items to return, maximum 50, defaults to 10</li>
	</ul>
	
	<ul>
		<li>Returns on success:</li>
		
		<li>additions</li>
		<li>a multidimensional array, with an entry for each result : </li>
		
		<li>content</li>
		<li>the url of the image</li>
		
		<li>top, right, bottom, and left:</li>
		<li>the location of the image on the mile, in inches from the top left corner</li>
		
		<li>NEEDS ID</li>
		
		<li>success</li>
		<li>true</li>
	</ul>
	
	<ul>
		<li>Returns on failure:</li>
		<li>success</li>
		<li>false</li>
	</ul>
</div>


<span class="methodName" onclick="expandMethod(this);">getContentAtInch</span>
<div class="methodDesc">
	<p class="description">
		Gets the content at a specified location, in inches.
	</p>
		
	<ul>
		<li>Required Params:</li>
		<li>top, right, bottom, left:</li>
		<li>the coordinates, in inches from the top left.</li>
	</ul>
	
	<ul>
		<li>Returns on success:</li>
		
		<li>count</li>
		<li>the number of images in the coordinates specified</li>
		
		<li>content</li>
		<li>if count is greater than 0, an array of each image in the coodinantes.</li>
		
		<li>success</li>
		<li>true</li>
	</ul>
	
	<ul>
		<li>Returns on failure:</li>
		<li>success</li>
		<li>false</li>
	</ul>
</div>