import * as PIXI from 'pixi.js';
import * as Matter from 'matter-js'

export class Chain{
    bodies: Matter.Body[] = [];
    constraints: Matter.Constraint[] = [];
    linkHeight: number;
    density: number;
    stiffness: number;
    links: number;
    base: Matter.Body;
    graphics: PIXI.Graphics;
    engine: Matter.Engine;
    options= {
		isStatic: true
    }

    constructor(engine: Matter.Engine, graphics: PIXI.Graphics ,x: number, y: number, links: number, linkWidth: number, linkHeight: number, density: number, stiffness: number){
        this.base = Matter.Bodies.rectangle(x, y, linkWidth, linkHeight, this.options);
        this.bodies.push(this.base);
        this.links = links -1;
        this.linkHeight = linkHeight;
        this.stiffness = stiffness;
        this.density = density;
        this.engine = engine;
        this.graphics = graphics;

        for (let index = 0; index < this.links; index++) {
            var body = Matter.Bodies.rectangle(x, this.bodies[index].position.y + linkHeight + linkHeight, linkWidth, linkHeight);
		    var options ={
			bodyA: this.bodies[index],
			bodyB: body,
			length: linkHeight+2,
			stiffness:stiffness, 
			density: density
            } 
            
            var constraint = Matter.Constraint.create(options);
            this.bodies.push(body);
            this.constraints.push(constraint);
            Matter.World.add(engine.world, constraint);
            
        }
        Matter.World.add(engine.world, this.bodies);
        this.bodies[this.links].label = 'lastLink';      
    }

    show(){ 
		for(var j = 0; j < this.bodies.length; j++){
		// draw a shape
		this.graphics.beginFill(0xffd900);
		this.graphics.lineStyle(1 ,  0xFFFFFF, 1);
		this.graphics.moveTo(this.bodies[j].vertices[0].x, this.bodies[j].vertices[0].y);
		this.graphics.lineTo(this.bodies[j].vertices[1].x, this.bodies[j].vertices[1].y);
		this.graphics.lineTo(this.bodies[j].vertices[2].x, this.bodies[j].vertices[2].y);
		this.graphics.lineTo(this.bodies[j].vertices[3].x, this.bodies[j].vertices[3].y);
		this.graphics.lineTo(this.bodies[j].vertices[0].x, this.bodies[j].vertices[0].y);
		this.graphics.closePath();
		this.graphics.endFill();
		}
    }

    addConstraint(body: Matter.Body){
		if(body != null){
            this.base.position.y -= 42;
            
			var options ={
			bodyA: this.bodies[this.bodies.length-1],
			bodyB: body,
			length: this.linkHeight*3,
			stiffness:this.stiffness
            } 
            
			this.bodies.push(body);
			var constraint = Matter.Constraint.create(options);
			this.constraints.push(constraint);
			Matter.World.add(this.engine.world, constraint);
			
			for( var i = 0; i<this.constraints.length; i++){
				this.constraints[i].length -=2
			}
		}
    }
    
    removeConstraint(){
		if(this.bodies[this.links+1] != undefined){
			this.bodies.splice(this.links+1, 1);
			Matter.Composite.remove(this.engine.world, this.constraints[this.links], true);
            this.base.position.y += 42;
            
            for( var i = 0; i<this.constraints.length; i++){
				this.constraints[i].length +=2
			}
		}
			
	}

}