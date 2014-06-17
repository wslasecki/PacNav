from boto.mturk.connection import MTurkConnection
from boto.mturk.question import ExternalQuestion


######  CONFIGURATION PARAMETRS  ######

VIDEO_URL = "5ybc6Z15Q2Q"

SANDBOX = False  # Select whether to post to the sandbox (using fake money), or live MTurk site (using REAL money)
#HIT_URL = "https://roc.cs.rochester.edu/walter/PacNav/?video=" + VIDEO_URL;  # Provide the URL that you want workers to sent sent to complete you task
HIT_URL = "https://eecs.wsu.edu/~gdelacru/PacNav/?video=" + VIDEO_URL;

NUMBER_OF_HITS = 1  # Number of different HITs posted for this task
NUMBER_OF_ASSIGNMENTS = 10  # Number of tasks that DIFFERENT workers will be able to take for each HIT
LIFETIME = 60 * 60 * 168  # How long that the task will stay visible if not taken by a worker (in seconds)
REWARD = 0.10  # Base payment value for completing the task (in dollars)
DURATION = 60*10  # How long the worker will be able to work on a single task (in seconds)
APPROVAL_DELAY = 60*60*168  # How long after the task is completed will the worker be automatically paid if not manually approved (in seconds)


# HIT title (as it will appear on the public listing)
TITLE = 'Watch someone play PacMan and give suggestions'
# Description of the HIT that workers will see when deciding to accept it or not
DESCRIPTION = 'You will be shown a video of a game of PacMan. Your goal is to determine when the player could have made a better move and indicate what you think would have worked better.'
# Search terms for the HIT posting
KEYWORDS = ['video', 'games', 'pacman', 'advice']


# Your Amazon Web Services Access Key (private)
AWS_ACCESS_KEY = 'AKIAITZGO3AKYBUQL7RQ' # <-- TODO: Enter your access key here
# Your Amazon Web Services Secret Key (private)
AWS_SECRET_KEY = 'mTSLWsqJrK7mNOIu1799WyBq+xW0Y+fcQzDHgmtw' # <-- TODO: Enter your private key here

#######################################


def create_hits():
	if SANDBOX:
		mturk_url = 'mechanicalturk.sandbox.amazonaws.com'
		preview_url = 'https://workersandbox.mturk.com/mturk/preview?groupId='
	else:
		mturk_url = 'mechanicalturk.amazonaws.com'
		preview_url = 'https://mturk.com/mturk/preview?groupId='

	q = ExternalQuestion(external_url=HIT_URL, frame_height=800)
	conn = MTurkConnection(aws_access_key_id=AWS_ACCESS_KEY, aws_secret_access_key=AWS_SECRET_KEY, host=mturk_url)
	for i in range(0, NUMBER_OF_HITS):
		create_hit_rs = conn.create_hit(question=q, lifetime=LIFETIME, max_assignments=NUMBER_OF_ASSIGNMENTS, title=TITLE, keywords=KEYWORDS, reward=REWARD, duration=DURATION, approval_delay=APPROVAL_DELAY, annotation=DESCRIPTION)
		print(preview_url + create_hit_rs[0].HITTypeId)
		print("HIT ID: " + create_hit_rs[0].HITId)
    
if __name__ == "__main__":
	create_hits()

