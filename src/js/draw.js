const canvas = document.querySelector(".canvas");
const ctx = canvas.getContext("2d");

var bubbles =new Bubbles();

var mousex,mousey;
const KEY_SPACE=32;
var p;
var area=0;
var score=0;
var store=false;
var highScoreTimer=0
var gauntletUsed=false;
var pausePower=false;
var powerup=true;
var powerFlag=false;
var burstSound=new Audio();
var powerPush=false;
var pushEnabled=false;
var gameOverTimer=0

burstSound.src='public/assets/export_ofoct.com.mp3';
store=window.localStorage.getItem('cond');
const requestAnimationFrame = window.requestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.msRequestAnimationFrame;



canvas.width  = window.innerWidth;
canvas.height = window.innerHeight;

const particlesPerExplosion = 20;
const particlesMinSpeed     = 1;
const particlesMaxSpeed     = 5;
const particlesMinSize      = 1;
const particlesMaxSize      = 7;
const explosions            = [];

let  fps       = 70;
const interval = 1000 / fps;

let now, delta;
let then = Date.now();



function draw() {
  requestAnimationFrame(draw);

  // Set NOW and DELTA
  now   = Date.now();
  delta = now - then;

  // New frame
  if (delta > interval) {

    // Update THEN
    then = now - (delta % interval);

    // Our animation
    // drawBackground();
    drawExplosion();

  }

}

// Draw explosion(s)
function drawExplosion() {

  if (explosions.length === 0) {
    return;
  }

  for (let i = 0; i < explosions.length; i++) {

    const explosion = explosions[i];
    const particles = explosion.particles;

    if (particles.length === 0) {
      explosions.splice(i, 1);
      return;
    }

    const particlesAfterRemoval = particles.slice();
    for (let ii = 0; ii < particles.length; ii++) {

      const particle = particles[ii];

      // Check particle size
      // If 0, remove
      if (particle.size <= 0) {
        particlesAfterRemoval.splice(ii, 1);
        continue;
      }

      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, Math.PI * 2, 0, false);
      ctx.closePath();
      ctx.fillStyle = 'rgb(' + particle.r + ',' + particle.g + ',' + particle.b + ')';
      ctx.fill();

      // Update
      particle.x += particle.xv;
      particle.y += particle.yv;
      particle.size -= .1;
    }

    explosion.particles = particlesAfterRemoval;

  }

}

// Draw the background
function drawBackground() {
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Clicked
function clicked(e) {

  let xPos, yPos;

  if (e.offsetX) {
    xPos = e.offsetX;
    yPos = e.offsetY;
  } else if (e.layerX) {
    xPos = e.layerX;
    yPos = e.layerY;
  }

  explosions.push(
    new explosion(xPos, yPos)
  );

}

// Explosion
function explosion(x, y) {

  this.particles = [];

  for (let i = 0; i < particlesPerExplosion; i++) {
    this.particles.push(
      new particle(x, y)
    );
  }

}

// Particle
function particle(x, y) {
  this.x    = x;
  this.y    = y;
  this.xv   = randInt(particlesMinSpeed, particlesMaxSpeed, false);
  this.yv   = randInt(particlesMinSpeed, particlesMaxSpeed, false);
  this.size = randInt(particlesMinSize, particlesMaxSize, true);
  this.r    = 66;
  this.g    = 72;
  this.b    = 116;
}

// Returns an random integer, positive or negative
// between the given value
function randInt(min, max, positive) {

  let num;
  if (positive === false) {
    num = Math.floor(Math.random() * max) - min;
    num *= Math.floor(Math.random() * 2) === 1 ? 1 : -1;
  } else {
    num = Math.floor(Math.random() * max) + min;
  }

  return num;

}

// On-click
//burst animation after clicked is executed
draw();

//scoreboard
function scoreDisplay(userScore){
  ctx.globalAlpha=1;
  ctx.font = "30px Comic Sans MS";
  ctx.fillStyle = "black";
  ctx.textAlign = "center";
  ctx.fillText("score: " + userScore, canvas.width-90, 50);
}
//dynamic change in highscore
function highScoreDisplay(){
  if(score>parseInt(bubbles.scores[bubbles.scores.length-1])){
    console.log('new');

    highScoreTimer++;
    
    if(highScoreTimer<10 && highScoreTimer>0){
        
    displayHighscores();
    }
    bubbles.newHighscore=score;
    console.log(bubbles.newHighscore);
    
}   
  ctx.font = "30px Comic Sans MS";
  ctx.fillStyle = "black";
  ctx.textAlign = "center";
  if(bubbles.scores.length===0){
    ctx.fillText("High Score: 0" , 90, 50); 
  }
  else{
    ctx.fillText("High Score: " + bubbles.newHighscore,120, 50); 
  }
  
}

var t=0;
//main function 
(function setup(){
var timer=setInterval(()=>{
  bubbles.newHighscore=bubbles.scores[bubbles.scores.length-1]
  if(store){
    bubbles.scores=localStorage.getItem('userScores').split(',');

  }
  
    if(!bubbles.paused){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    bubbles.draw();
    if(!powerFlag){
    bubbles.update();
    }
    bubbles.checkCollision();
    t++;
    }
    if(bubbles.paused){
      document.addEventListener('click',function(evt){
        if(evt.clientX>686 && evt.clientX<747 && evt.clientY>440 && evt.clientY<503){
          window.location.reload();
        }
      })
    }
},100)
}());
//pause when space bar is pressed
addEventListener('keydown',keypressed);
function keypressed(evt){
  
  if(evt.keyCode==KEY_SPACE){
    if(bubbles.paused){
        bubbles.paused=false;
    }
    else{
    bubbles.paused=true;
    ctx.globalAlpha=1;
    ctx.font = "80px Comic Sans MS";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.fillText("PAUSED", canvas.width/2, canvas.height/2); 
    ctx.fillText("⟳", canvas.width/2, canvas.height/2+100); 

    }

  }
}
//bursting bubbles when clicked
document.getElementById('canvas').addEventListener('click',function(e){
  if(!bubbles.paused){
    mousex=e.clientX;
    mousey=e.clientY;
    for(var i=0;i<bubbles.bubbles.length;i++){
        if(disPoint(mousex,mousey,bubbles.bubbles[i].x,bubbles.bubbles[i].y)<bubbles.bubbles[i].rad+1){
          if(bubbles.bubbles[i].type==='rock'){
            if(bubbles.bubbles[i].clicks<=1){
              burstSound.play();
              bubbles.bubbles.splice(i,1)
              clicked(e);
              score=score+5;
              mousex=-1
              mousey=-1
            }
            else{
              burstSound.play();
              bubbles.bubbles[i].clicks-=1;
              clicked(e);
              score=score+5;
              mousex=-1
              mousey=-1
            }
          }
          else{
            burstSound.play();
            bubbles.bubbles.splice(i,1)
            clicked(e);
            score=score+5;
            mousex=-1
            mousey=-1
          }
        }
        }
      }

})