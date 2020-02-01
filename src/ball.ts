import * as PIXI from 'pixi.js';
import * as Matter from 'matter-js'

export class Ball{
    body: Matter.Body;
    r: number;
    color: number;
    graphics: PIXI.Graphics;
    options= {
		friction: 0,
		restitution: 0.2,
		density: 0.01
    }

    constructor(engine: Matter.Engine, graphics: PIXI.Graphics ,x: number, y: number, r: number, color: number){
        this.body = Matter.Bodies.circle(x, y, r, this.options);
        this.body.label = 'ball';
        this.r = r;
        this.color = color;
        this.graphics = graphics;
        Matter.World.add(engine.world, this.body);
    }

    show(){
        var pos = this.body.position;

        this.graphics.beginFill(this.color);
		this.graphics.lineStyle(1 ,  0x000000, 1);
		this.graphics.drawCircle(pos.x, pos.y, this.r );
		this.graphics.endFill();
    }

}