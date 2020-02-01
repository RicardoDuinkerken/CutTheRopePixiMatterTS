import * as PIXI from 'pixi.js';
import * as Matter from 'matter-js'

export class Boundary{
    body: Matter.Body;
    w: number;
    h: number;
    a: number;
    graphics: PIXI.Graphics;
    options= {
        isStatic: true,
		friction: 0.3,
		restitution: 1,
		angle: this.a
    }

    constructor(engine: Matter.Engine, graphics: PIXI.Graphics ,x: number, y: number, w: number, h: number, a: number){
        this.options.angle = a;
        this.body = Matter.Bodies.rectangle(x, y, w, h, this.options);
        this.body.friction = 0;
        this.body.restitution = 0.1;
        this.w = w;
        this.h = h;
        this.a = a;
        this.graphics = graphics;
        Matter.World.add(engine.world, this.body);
    }

    show(){
        var vertices = this.body.vertices;

        		// draw a shape
		this.graphics.beginFill(0xffd900);
		this.graphics.lineStyle(1 ,  0xFFFFFF, 1);
		this.graphics.moveTo(vertices[0].x, vertices[0].y);
		this.graphics.lineTo(vertices[1].x, vertices[1].y);
		this.graphics.lineTo(vertices[2].x, vertices[2].y);
		this.graphics.lineTo(vertices[3].x, vertices[3].y);
		this.graphics.lineTo(vertices[0].x, vertices[0].y);
		this.graphics.closePath();
		this.graphics.endFill();
    }
}