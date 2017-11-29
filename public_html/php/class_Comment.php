<?

class Comment
{

	private $db;
	private $id; //serial of image
	private $user = false; //serial of current user
	private $vote; //the users rating of selected image
	private $comments = []; //all comments for selected image
	private $tags = []; //all tags, unsorted and ungrouped;

	public function __construct(&$db)
	{
		$this->db = $db;
	}

	/**
	 * 
	 */
	public function setID($id)
	{
		$this->id = (int) $id;
	}

	public function setCurrentUser($user)
	{
		$this->user = $user;
	}

	public function loadUserVote()
	{
		if ($this->user) {
			//user logged in 
			$sql = "SELECT vote FROM content_votes
					WHERE object = '{$this->id}' 
					AND userid = '{$this->user}'
					LIMIT 1";
			$res = $this->db->exec($sql);
		} else {
			$res = [];
		}

		$vote = isset($res[0]['vote']) ? $res[0]['vote'] : 0;
		$this->vote = $vote;
		return $vote;
	}

	public function loadAllComments()
	{
		$sql = "SELECT C.*, U.user AS userName
				FROM content_comments C, user_list U
				WHERE C.object = '{$this->id}'
				AND U.id = C.userid
				ORDER BY C.id DESC";

		$res = $this->db->exec($sql);
		$this->comments = $res;

		return $res;
	}

	public function loadAllTags()
	{
		$sql = "SELECT tag, COUNT(tag) as cnt FROM content_tags
				WHERE object = '{$this->id}'
				GROUP BY tag
				ORDER BY RAND()";

		$res = $this->db->exec($sql);
		$this->tags = $res;

		return $res;
	}
}