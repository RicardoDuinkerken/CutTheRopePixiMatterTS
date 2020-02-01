import * as PIXI from 'pixi.js';
import * as Matter from 'matter-js'

export class Pickup{
      
    body:Matter.Body;
    r: number;
    p: number;
    rot: number;
    color: number;
    graphics: PIXI.Graphics;
    engine: Matter.Engine;

    
	constructor(engine: Matter.Engine, graphics: PIXI.Graphics ,x: number, y: number, p: number, r: number, color: number){
        this.body = Matter.Bodies.circle(x, y, r, {isStatic: true});
        this.body.label = 'pickUp';
        this.r = r;
        this.p = p;
        this.rot = 0;
        this.color = color;
        this.graphics = graphics;
        this.engine = engine;

        Matter.World.add(engine.world, this.body);
    }

    show(){
		var pos = this.body.position;
	
		this.graphics.beginFill(this.color);
		this.graphics.lineStyle(1 ,  0x000000, 1);
		this.graphics.drawStar(pos.x, pos.y,this.p, this.r, this.rot);
		this.graphics.endFill();
    }
    
    removePickup (){
		Matter.World.remove(this.engine.world, this.body);
	}
}