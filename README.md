# 24cardgame

<p><u>LinkedIn</u>: <a class='link' href='https://www.linkedin.com/in/youngryan93/' target="_blank">linkedin.com/in/youngryan93/</a></p>
<p><u>Portfolio</u>: <a class='link' href='http://ryoung.netlify.com/' target="_blank">ryoung.netlify.com/</a></p>
		<p>Try it out: <a class='link' href="http://54.183.223.25/" target="_blank">http://54.183.223.25/</a></p>
		
<p><u>Technologies</u>:  Express.js, Node.js, Angular, Socket.io, Bootstrap </p>
<p><u>Role</u>: Worked independently, built the UI, game logic, and server to user connections.</p>
<p><u>Description</u>: This project was built in Javascript and uses Express.js, Node.js, Angular, Socket.io, and Bootstrap. The User Interface was built using Bootstrap and Angular, for displaying information and utilizing submit/click events. The back end uses a Node.js server component with an Express.js framework. Socket.io is used to update and transfer data in real-time between the server and multiple clients. The deck and user data are stored as objects that are transmitted using socket.io events. </p>
<p><u>Challenges</u>: One challenge was how to compile the answer on the user side. I used the eval() function to compile the user’s equation, but if the given input doesn’t follow the specific guidelines of the eval() function, it’ll throw an error. For this reason, the inputs are restricted to clicking the cards and arithmetic buttons. If a card is clicked, other cards are disabled from being clicked until an arithmetic button is clicked and vice versa. This prevents users from submitting unexpected equations, while making the game more interactive by clicking the cards.</p>
