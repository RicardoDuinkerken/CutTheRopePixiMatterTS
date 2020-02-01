import * as PIXI from 'pixi.js';
import * as Matter from 'matter-js';
import {Ball} from './ball';
import {Boundary} from './boundary';
import {Chain} from './chain';
import {Pickup} from './pickup';

window.PIXI = PIXI;
var Engine = Matter.Engine;
var Events = Matter.Events;
    
var engine: Matter.Engine;
var graphics: PIXI.Graphics;
var ball: Ball;
var boundaries: Boundary[] = [];
var chains: Chain[] = [];
var pickups: Pickup[] = [];
var score = 0;

const screenWidth = 800;
const screenHeight = 600;
const boxThickness = 20;
const app = new PIXI.Application({width: screenWidth, height: screenHeight, backgroundColor: 0x1099bb, resolution: window.devicePixelRatio || 1,});
const style = new PIXI.TextStyle({
    fontFamily: 'Arial',
    fontSize: 36,
    fontStyle: 'italic',
    fontWeight: 'bold',
    fill: ['#ffffff', '#9C3737'], // gradient
    stroke: '#4a1850',
    strokeThickness: 5,
    dropShadow: true,
    dropShadowColor: '#000000',
    dropShadowBlur: 4,
    dropShadowAngle: Math.PI / 6,
    dropShadowDistance: 6,
    wordWrap: true,
    wordWrapWidth: 440,
	});
const richText = new PIXI.Text('score = ' + score, style);

app.stage.interactive = true;
document.getElementById("display")!.appendChild(app.view);

graphics = new PIXI.Graphics();
app.stage.addChild(graphics);

richText.x = 550;
richText.y = 500;
app.stage.addChild(richText);

app.renderer.plugins.interaction.on('pointerdown', onPointerDown);
//window.app = app;
engine = Engine.create();
Events.on(engine, 'collisionStart', collision);

createWorld();
window.requestAnimationFrame(gameLoop);

function createWorld(){
    ball = new Ball(engine, graphics, 50, 50, 20, 0x9C3737)
    
    //create all bounding boxes and platforms
    boundaries.push(new Boundary(engine, graphics,400, 0, screenWidth, boxThickness, 0));
    boundaries.push(new Boundary(engine, graphics,400, 600, screenWidth, boxThickness, 0));
    boundaries.push(new Boundary(engine, graphics,0, 300, boxThickness, screenHeight, 0));
    boundaries.push(new Boundary(engine, graphics,800, 300, boxThickness, screenHeight, 0));
    boundaries.push(new Boundary(engine, graphics,100, 140, 200, boxThickness, 0.361799));
    boundaries.push(new Boundary(engine, graphics,250, 187, 100, boxThickness, 0.181799));
    boundaries.push(new Boundary(engine, graphics,350, 193, 100, boxThickness, -0.1));
    boundaries.push(new Boundary(engine, graphics,520, 195, 150, boxThickness, 0.1));
    boundaries.push(new Boundary(engine, graphics,750, 200, 125, boxThickness, -0.283972));
    boundaries.push(new Boundary(engine, graphics,530, 300, 150, boxThickness, -0.283972));
    boundaries.push(new Boundary(engine, graphics,330, 350, 150, boxThickness, -0.203972));
    boundaries.push(new Boundary(engine, graphics,500, 450, 800, boxThickness, -0.383972));
    boundaries.push(new Boundary(engine, graphics,300, 525, 100, boxThickness, -0.283972));
    boundaries.push(new Boundary(engine, graphics,278, 529, 100, boxThickness, -0.103972));

    chains.push(new Chain(engine, graphics, 400, 67, 7, 10, 10, 0.001, 0.9));
    chains.push(new Chain(engine, graphics, 620, 69, 8, 10, 10, 0.001, 0.5));
    chains.push(new Chain(engine, graphics, 200, 400, 8, 10, 10, 0.001, 0.8));
    chains.push(new Chain(engine, graphics, 450, 220, 5, 10, 10, 0.001, 0.8));
    chains.push(new Chain(engine, graphics, 225, 222, 9, 10, 10, 0.001, 0.9));
    chains.push(new Chain(engine, graphics, 134, 260, 9, 10, 10, 0.001, 0.9));

    pickups.push(new Pickup(engine, graphics, 500,160,5,10, 0xffffff));
    pickups.push(new Pickup(engine, graphics, 560,260,5,10, 0xffffff));
    pickups.push(new Pickup(engine, graphics, 110,400,5,10, 0xffffff));
    pickups.push(new Pickup(engine, graphics, 110,550,5,10, 0xffffff)); 
}

function gameLoop(){
    draw();

    // Keep requesting new frames
    window.requestAnimationFrame(gameLoop);
}

function draw(){
    Engine.update(engine);
    graphics.clear();
    for(var i = 0; i < boundaries.length; i++){
        boundaries[i].show();
    }
    for(var i = 0; i <chains.length; i++){
        chains[i].show();
    }
    for(var i = 0; i <pickups.length; i++){
        pickups[i].show();
    }
    ball.show();	
    richText.text = "score = " + score;
}

function onPointerDown(){
    for(var i = 0; i <chains.length; i++){
        chains[i].removeConstraint();
    }
}

function collision(event: any){
    var pairs = event.pairs;
    for(var i = 0; i < pairs.length; i++){
        var bodyA = pairs[i].bodyA;
        var bodyB = pairs[i].bodyB;
        
        if(bodyA.label == 'ball' && bodyB.label == 'lastLink'){
            for(var i = 0; i < chains.length; i++){
                if(chains[i].bodies[chains[i].links].id == bodyB.id )
                chains[i].addConstraint(bodyA);
            }
        }
        if(bodyB.label == 'ball' && bodyA.label == 'lastLink'){
            for(var i = 0; i < chains.length; i++){
                if(chains[i].bodies[chains[i].links].id == bodyA.id )
                chains[i].addConstraint(bodyB);
            }
        }
        if(bodyA.label == 'pickUp' && bodyB.label == 'ball'){
            for(var i = 0; i < pickups.length; i++){
                if(pickups[i].body.id == bodyA.id ){
                pickups[i].removePickup();
                pickups.splice(i,1);
                score+= 1;
                }
            }
        }
        if(bodyB.label == 'pickUp' && bodyA.label == 'ball'){
            for(var i = 0; i < pickups.length; i++){
                if(pickups[i].body.id == bodyB.id ){
                pickups[i].removePickup();
                pickups.splice(i,1);
                score += 1;
                }
            }
            
        }
    }
}


	