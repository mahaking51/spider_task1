//draw circles with specified color and radius
function drawCircles(x,y,r,clr){

    ctx.globalAlpha=0.2;
    ctx.beginPath();
    // ctx.strokeStyle='#888888'
    ctx.fillStyle=clr;
    ctx.arc(x,y, r, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fill();
    ctx.closePath();
    
}
//rock bubble generator
function drawRocks(x,y,r,n){
    ctx.globalAlpha=0.2*n;
    ctx.beginPath();
    ctx.fillStyle='#888888';
    ctx.arc(x,y, r, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fill();
    ctx.closePath();
}
//displaying gameover
function displayGameover(){
    ctx.globalAlpha=1;
    ctx.font = "80px Comic Sans MS";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER", canvas.width/2, canvas.height/2);    
    ctx.fillText("⟳", canvas.width/2, canvas.height/2+100); 

}

//gauntlet display and tracking click
var gauntlet=new Image();
gauntlet.src="public/assets/PinClipart.com_infinity-clipart_3607914.png";
function displayGauntlet(){
    canvas.addEventListener('click',function(evt){
    if(evt.clientX>146 && evt.clientX<192 && evt.clientY >150 && evt.clientY<202){
        bubbles.bubbles.splice(0,bubbles.bubbles.length/2);
        gauntletUsed=true;
        gameOverTimer=0;
    }        
    })
    ctx.drawImage(gauntlet,150,150,50,50)
}
//freezer img display and tracking click
var freeze=new Image();
freeze.src='public/assets/icons8-fridge-64.png';
function displayFreeze(){
    canvas.addEventListener('click',function(evt){
        console.log(evt.clientX,evt.clientY);
        if(evt.clientX>1349 && evt.clientX<1378 && evt.clientY >144 && evt.clientY<202){
            pausePower=true;
            powerFlag=true;
        }        
        })
        if(!powerPush){
        ctx.drawImage(freeze,canvas.width-100,150,50,50)
        }
}
var spirit=new Image();
spirit.src='public/assets/icons8-whiskey-64.png'
function displayWhiskey(){
    canvas.addEventListener('click',function(evt){
        console.log(evt.clientX,evt.clientY);
        if(evt.clientX>718 && evt.clientX<769 && evt.clientY >150 && evt.clientY<204){
            powerPush=true;

        }        
    })
    if(!powerFlag){
    ctx.drawImage(spirit,canvas.width/2,150,50,50)
    }
}
//display highscore when new highscore is displayed
function displayHighscores(){
    ctx.globalAlpha=1;
    ctx.font = "80px Comic Sans MS";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.fillText("NEW HIGHSCORE!!!", canvas.width/2, canvas.height/2);    
}
//powerup display
function displayPowerUp(){
    ctx.globalAlpha=1;
    ctx.font = "60px Comic Sans MS";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.fillText("POWER UP", canvas.width/2, canvas.height/2-100);    
}
function displayHurry(){
    ctx.globalAlpha=1;
    ctx.font = "60px Comic Sans MS";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.fillText("HURRY UP", canvas.width/2, canvas.height/2-100); 
}
function displayMagic(){
    ctx.globalAlpha=1;
    ctx.font = "40px Comic Sans MS";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.fillText("LIQUID MAGIC ENABLED", canvas.width/2+60, canvas.height/2-100);  
}
//timer before gameover and for powerup
function timer(time){
    ctx.globalAlpha=1;
    ctx.font = "70px Comic Sans MS";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.fillText(10-Math.round(time/10), canvas.width/2, 90); 
    if(powerFlag && powerPush){

    }
    if(powerFlag){
        displayPowerUp();
    }
    if(powerPush){
        displayMagic();
    }
    
}
//calculating the distance of two points
function disPoint(x1,y1,x2,y2){
    var distanceX=Math.pow((x1-x2),2)
    var distanceY=Math.pow((y1-y2),2)
    return Math.sqrt(distanceX+distanceY);
    
}
//collision 
function rotate(velocity, angle) {
    const rotatedVelocities = {
        x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
        y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle)
    };

    return rotatedVelocities;

}



function resolveCollision(particle, otherParticle) {
    const xVelocityDiff = particle.velocity.x - otherParticle.velocity.x;
    const yVelocityDiff = particle.velocity.y - otherParticle.velocity.y;

    const xDist = otherParticle.x - particle.x;
    const yDist = otherParticle.y - particle.y;

    // Prevent accidental overlap of particles
    if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {

        // Grab angle between the two colliding particles
        const angle = -Math.atan2(otherParticle.y - particle.y, otherParticle.x - particle.x);

        // Store mass in var for better readability in collision equation
        const m1 = particle.mass;
        const m2 = otherParticle.mass;

        // Velocity before equation
        const u1 = rotate(particle.velocity, angle);
        const u2 = rotate(otherParticle.velocity, angle);

        // Velocity after 1d collision equation
        const v1 = { x: u1.x * (m1 - m2) / (m1 + m2) + u2.x * 2 * m2 / (m1 + m2), y: u1.y };
        const v2 = { x: u2.x * (m1 - m2) / (m1 + m2) + u1.x * 2 * m2 / (m1 + m2), y: u2.y };

        // Final velocity after rotating axis back to original location
        const vFinal1 = rotate(v1, -angle);
        const vFinal2 = rotate(v2, -angle);

        // Swap particle velocities for realistic bounce effect
        particle.velocity.x = vFinal1.x;
        particle.velocity.y = vFinal1.y;

        otherParticle.velocity.x = vFinal2.x;
        otherParticle.velocity.y = vFinal2.y;
    }
}

//
function Bubbles(){
    this.x=Math.round(Math.random()*(1245)+90);
    this.y=Math.round(Math.random()*(595)+90);
    this.bubbles=[];
    this.pause=false;
    gameOverTimer=0
    var powerTimer=0;
    var pushTimer=0;
    timerInit=false;
    this.scores=[0]
    this.newHighscore;
    this.gauntletTimer=0;
    var gameoverSound=new Audio();
    gameoverSound.src='public/assets/beep-03.mp3'
    this.draw=function(){
        scoreDisplay(score);
        highScoreDisplay();
        if(score<5){
            p=40
        }
        if(score>5 && score<10){
            p=30
        }
        if(score<30 && score>10){
            p=15
        }
        if(score<50&& score>30){
            p=8
        }
        if(score>50 &&score<100){
            p=5
        }
        if(score>100){
            p=3;
        }
        if(score>30){
            if(!gauntletUsed){
            displayGauntlet();

            }
        }
        if(score>20 && powerup){

            displayFreeze();
        }
        if(score>20 && !pushEnabled){
            displayWhiskey();
        }
        if(t%p==0 && !powerFlag && !powerPush){
            flag=true;
            area=0;
            while(1){
            xpos=Math.round(Math.random()*(1245)+90);
            ypos=Math.round(Math.random()*(595)+90);
            radius=Math.round(Math.random()*(90)+30);
            for (var i =0;i<this.bubbles.length;i++){
                if(disPoint(xpos,ypos,this.bubbles[i].x,this.bubbles[i].y)<this.bubbles[i].rad+radius){
                    flag=false;
                    break;
                }
                else{
                    flag=true;
                }
            }
                if(flag){
                    break;
                }
            }
            this.speedX=Math.round(Math.random()*20-10);
            this.speedY=Math.round(Math.random()*20-10);
            colors=['#e8f044','#a6b1e1','#9dc6a7','#f67575']
            color=colors[Math.round(Math.random()*4)]
            if(this.bubbles.length%10===0){
                this.bubbles.push({x:xpos,y:ypos,velocity:{x:this.speedX,y:this.speedY},mass:1,rad:radius,clr:color,type:'rock',clicks:5});

            }
            else{
            this.bubbles.push({x:xpos,y:ypos,velocity:{x:this.speedX,y:this.speedY},mass:1,rad:radius,clr:color,type:'bubble'});
            }
            for(var i =0;i<this.bubbles.length;i++){
                area=area+Math.PI*this.bubbles[i].rad*this.bubbles[i].rad;
                }
                if(area>0.4*1438*775){
                    timerInit=true
                    }
                else{
                    timerInit=false;
                    gameOverTimer=0;
                }
                
            }
            if(pausePower &&powerup){
                timer(powerTimer);
                powerTimer++;
                if(powerTimer==100){
                    powerup=false;
                    powerFlag=false;
                    gameOverTimer=0;
                }
            }
            if(timerInit && !powerFlag && !powerPush){
                timer(gameOverTimer);
                gameOverTimer++;

                if(gameOverTimer==100){
                this.paused=true;
                displayGameover();
                gameoverSound.play();
                this.scores.push(score);
                this.scores.sort(function(a, b){return a-b});
                window.localStorage.setItem('userScores',this.scores);
                store=true
                window.localStorage.setItem('cond',store)
                }
                else{
                    displayHurry();
                }
            }
            if(powerPush){
                timer(pushTimer)
                pushTimer++;
                if(pushTimer==100){
                    powerPush=false;
                    pushEnabled=true;
                    gameOverTimer=0;
                }
            }
            
        for(var i=0;i<this.bubbles.length;i++){
        if(this.bubbles[i].type==='bubble'){
        drawCircles(this.bubbles[i].x,this.bubbles[i].y,this.bubbles[i].rad,this.bubbles[i].clr)
        }
        else{
        drawRocks(this.bubbles[i].x,this.bubbles[i].y,this.bubbles[i].rad,this.bubbles[i].clicks);
        }
        }
        

    }
    
    
    
    
    this.update=function(){
        for(var i=0;i<this.bubbles.length;i++){
            this.bubbles[i].x+=this.bubbles[i].velocity.x;
            this.bubbles[i].y+=this.bubbles[i].velocity.y;
            if(this.bubbles[i].x<=this.bubbles[i].rad || this.bubbles[i].x>=canvas.width-this.bubbles[i].rad){
                this.bubbles[i].velocity.x*=-1;
            }
            if(this.bubbles[i].y<=this.bubbles[i].rad || this.bubbles[i].y>=canvas.height-this.bubbles[i].rad){
                this.bubbles[i].velocity.y*=-1;
            }
        }
        // this.bubbles[1].x=mousex;
        // this.bubbles[1].y=mousey;


    }
    this.checkCollision=function(){
        for(var j=0;j<this.bubbles.length;j++){
            for(var k=0;k<this.bubbles.length;k++){
                if(k!=j){
                
                if(disPoint(this.bubbles[j].x,this.bubbles[j].y,this.bubbles[k].x,this.bubbles[k].y)-this.bubbles[j].rad-this.bubbles[k].rad-4<0){
                    resolveCollision(this.bubbles[j],this.bubbles[k])
                    
                }
                }
            }
        }
        
        // console.log(this.bubbles[0].x,this.bubbles[0].y,this.bubbles[1].x,this.bubbles[1].y);
        
    }
}