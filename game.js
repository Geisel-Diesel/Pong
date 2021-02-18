var canvas;
var canvasContext;
var ballX = 50;
var ballY = 50;
var ballSpeedX = 5;
var ballSpeedY = 5;

var player1Score = 0;
var player2Score = 0;
const WINSCORE = 5;

var showWinScreen = false; 

var paddle1Y = 250;
var paddle2Y = 250;
const paddleHeight = 100;

function calculateMousePos(evt)
{
	var rect = canvas.getBoundingClientRect();
	var root = document.documentElement;
	var mouseX = evt.clientX - rect.left - root.scrollLeft;
	var mouseY = evt.clientY - rect.top - root.scrollTop;
	return{
		x:mouseX,
		y:mouseY
	};
}

function handleMouseClick(evt)
{
	if(showWinScreen)
	{
		player1Score = 0;
		player2Score = 0;
		(showWinScreen) = false;
	}
}

window.onload = function() 
{
	canvas = document.getElementById('gameCanvas');
	canvasContext = canvas.getContext('2d');
	
	var framesPerSecond = 60;
	
	setInterval(callEverything, 1000/framesPerSecond);
	
	canvas.addEventListener('mousedown', handleMouseClick);
	
	canvas.addEventListener('mousemove', function(evt)
	{
		var mousePos = calculateMousePos(evt);
		paddle1Y = mousePos.y-(paddleHeight/2);
	});
}

function callEverything()
{
	moveEverything();
	drawEverything(); 
}

function ballReset()
{
	if(player1Score >= WINSCORE || player2Score >= WINSCORE)
	{
		showWinScreen = true;
	}
	
	ballSpeedX = -ballSpeedX;
	ballX = canvas.width/2;
	ballY = canvas.height/2;
}

function computerMovement()
{
	var paddle2YCenter = paddle2Y + (paddleHeight/2);
	if(paddle2YCenter < ballY-35)
	{
		paddle2Y += 6;
	}
	else if(paddle2YCenter > ballY+35)
	{
		paddle2Y -= 6;
	}
}

function moveEverything()
{
	if(showWinScreen)
	{
		return;
	}
	
	computerMovement();
	
	ballX = ballX + ballSpeedX;
	ballY = ballY + ballSpeedY;
	
	if(ballX < 0)
	{
		if(ballY > paddle1Y && ballY < paddle1Y+paddleHeight)
		{
			ballSpeedX = -ballSpeedX;
			var deltaY = ballY
			-(paddle1Y+paddleHeight/2);
			ballSpeedY = deltaY * 0.20;
		}
		else
		{
			player2Score += 1;
			ballReset();
		}
	}
	
	if(ballX > canvas.width)
	{
		if(ballY > paddle2Y && ballY < paddle2Y+paddleHeight)
		{
			ballSpeedX = -ballSpeedX;
			var deltaY = ballY
			-(paddle2Y+paddleHeight/2);
			ballSpeedY = deltaY * 0.20;
		}
		else
		{
			player1Score += 1;
			ballReset();
		}	
	}
	
	if(ballY < 0)
	{
		ballSpeedY = -ballSpeedY;
	}
	
	if(ballY > canvas.height)
	{
		ballSpeedY = -ballSpeedY;
	}
}

function drawNet()
{
	for(var i = 0; i < canvas.width; i+=40)
	{
		colorRect(canvas.width/2-1, i, 2, 20, 'white');
	}
}
function drawEverything()
{
	//background
	colorRect(0,0, canvas.width, canvas.height, 'black');
	
	if(showWinScreen)
	{
		if(player1Score >= WINSCORE)
		{
			canvasContext.fillStyle = 'white';
			canvasContext.fillText("YOU WON!", 353, 200);
		}
		else if(player2Score >= WINSCORE)
		{
			canvasContext.fillStyle = 'white';
			canvasContext.fillText("COMPUTER WON!", 351.5, 200);
		}

		canvasContext.fillText("Click to Continue", 350, 500);
		
		return;
	}
	//ball
	canvasContext.fillStyle = 'white';
	canvasContext.beginPath();
	canvasContext.arc(ballX, ballY, 10, 0, Math.PI*2, true);
	canvasContext.fill();
	drawNet();
	//left paddle
	colorRect(0, paddle1Y, 10, paddleHeight, 'white');
	//right paddle
	colorRect(790, paddle2Y, 10, paddleHeight,'white');
	
	canvasContext.fillText(player1Score, 100, 100);
	canvasContext.fillText(player2Score, canvas.width-100, 100);
}

function colorRect(leftX, topY, width, height, drawColor)
{
	canvasContext.fillStyle = drawColor;
	canvasContext.fillRect(leftX, topY, width, height);
}