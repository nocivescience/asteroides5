const fps=30;
const friction=0.7;
const gravity=0.3;
const canvasGame=document.getElementById("game");
const ctx=canvasGame.getContext("2d");
const colors=["#f5c270","#ffa91f","#ff7f00","#ff5f00","#ff3f00","#ff1f00","#ff0000","#e60000","#cc0000","#b20000"];
var level, roids, trust,driving, rotatingAnti,rotating;
var trusting;
const randoms=[];
for (let i=0;i<10;i++){
    const random=Math.random()<.5?-1:1;
    randoms.push(random);
}
const ship=newShip()
newGame();
document.addEventListener("keydown",keyDown);
document.addEventListener("keyup",keyUp);
setInterval(()=>{update()},10);
function newShip(){
    return {
        x:canvasGame.width/2,
        y:canvasGame.height/2,
        lasers:[],
        a:Math.PI*2,
    }
}
function shootLaser(){
    ship.lasers.push({
        x:ship.x+10,
        y:ship.y-10,
    });
    return ship.lasers;
}
function createAsteroidBelt(){
    roids=[];
    roidsTotal=(1+level)*7;
    roidsLeft=roidsTotal;

    var x,y;
    for(let i=0;i<roidsTotal;i++){
        do{
            x=Math.floor(Math.random()*canvasGame.width);
            y=Math.floor(Math.random()*canvasGame.height);
        }while(distanceBetweenPoints(ship.x,ship.y,x,y)<100);
        roids.push(newAsteroid(x,y));
    }
}
function distanceBetweenPoints(x1,y1,x2,y2){
    return Math.sqrt(Math.pow(x2-x1,2)+Math.pow(y2-y1,2));
};
function newGame(){
    level=0;
    createAsteroidBelt();
};
function drawShip(x,y,a,color='white'){
    ctx.strokeStyle=color;
    ctx.fillStyle=color;
    ctx.lineWidth=1;
    ctx.beginPath();
    ctx.moveTo(
        x+12*Math.cos(a),
        y+12*Math.sin(a)
    );
    ctx.lineTo(
        x-12*Math.cos(a+Math.PI/4),
        y-12*Math.sin(a+Math.PI/4)
    );
    ctx.lineTo(
        x-12*Math.cos(a-Math.PI/4),
        y-12*Math.sin(a-Math.PI/4)
    );
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
    if(trust){
        ctx.lineTo(
            x-ship.r*Math.cos(a+Math.PI/4),
            y-ship.r*Math.sin(a+Math.PI/4)
        );
        ctx.lineTo(
            x-ship.r*Math.cos(a-Math.PI/4),
            y-ship.r*Math.sin(a-Math.PI/4)
        );
        ctx.lineTo(
            x-ship.r*Math.cos(a+Math.PI/4),
            y-ship.r*Math.sin(a+Math.PI/4)
        );
    };
    trusting=3;
    if(driving){
        ship.x+=Math.cos(ship.a)*trusting;
        ship.y+=Math.sin(ship.a)*trusting;
    }
    if(rotatingAnti){
        ship.a+=Math.PI/180;
    }else{
        ship.a+=0;
    }
    if(rotating){
        ship.a-=Math.PI/180;
    }else{
        ship.a-=0;
    }
}
function newAsteroid(x,y,r=60){
    var levelMult=1+level;
    var roid={
        x,
        y,
        xv:Math.random()*levelMult/2,
        yv:Math.random()*levelMult/2,
        r:Math.floor(Math.random()*levelMult*2)+r,
        a:Math.random()*Math.PI*2,
        vert:Math.floor(Math.random()*7)+3,
        offs:[],
    }
    for(let i=0;i<roid.vert;i++){
        roid.offs.push(Math.random()*levelMult/2+1-levelMult/4);
    }
    return roid;
};
function keyDown(/** @type {KeyboardEvent} */ ev){
    ev.preventDefault();
    switch(ev.key){
        case "ArrowUp":
            driving=true;
            break;
        case "ArrowLeft":
            rotatingAnti=true;
            break;
        case "ArrowRight":
            rotating=true;
            break;
    };
};
function keyUp(/** @type {KeyboardEvent} */ ev){
    switch(ev.key){
        case "ArrowUp":
            driving=false;
            break;
        case "ArrowLeft":
            rotatingAnti=false;
            break;
        case "ArrowRight":
            rotating=false;
            break;
    };
}
function update(){
    ctx.clearRect(0,0,canvasGame.width,canvasGame.height);
    for(let i=0;i<roids.length;i++){
        // ctx.strokeStyle=colors[i%colors.length];
        ctx.fillStyle=colors[i%colors.length];
        ctx.strokeStyle='white';
        ctx.lineWidth=2;
        ctx.beginPath();
        ctx.moveTo(
            roids[i].x+roids[i].r*Math.cos(roids[i].a),
            roids[i].y+roids[i].r*Math.sin(roids[i].a)
        );
        for(let j=0;j<roids[i].vert;j++){
            ctx.lineTo(
                roids[i].x+roids[i].r*roids[i].offs[j]*Math.cos(roids[i].a+Math.PI*2/roids[i].vert*j),
                roids[i].y+roids[i].r*roids[i].offs[j]*Math.sin(roids[i].a+Math.PI*2/roids[i].vert*j)
            );
        }
        for (let i=0;i<roids.length;i++){
            if(roids[i].x>canvasGame.width+roids[i].r) roids[i].x=-roids[i].r;
            if(roids[i].x<-roids[i].r) roids[i].x=canvasGame.width+roids[i].r;
            if(roids[i].y>canvasGame.height+roids[i].r) roids[i].y=-roids[i].r;
            if(roids[i].y<-roids[i].r) roids[i].y=canvasGame.height+roids[i].r;
            roids[i].x+=roids[i].xv*randoms[i%randoms.length];
            roids[i].y+=roids[i].yv*randoms[i%randoms.length];
        }
        ctx.closePath();
        ctx.stroke();
        ctx.fill();
    }
    drawShip(ship.x,ship.y,ship.a);
};