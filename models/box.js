class Box {
    constructor(topleft = new V2, size = new V2, renderProps = new RenderProperties){
        if(!(size instanceof V2) || size.equal(new V2))
            throw 'Wrong box size';

        if(!(renderProps instanceof RenderProperties))
            renderProps = new RenderProperties;

        this.renderProps = renderProps;

        this.update(topleft, size);
    }

    update(topleft = new V2, size = new V2){
        if(!(topleft instanceof V2) || !(size instanceof V2))
            return;

        if(!size.equal(new V2)){
            this.size = size.clone();
            this.width = this.size.x;
            this.height = this.size.y;
        }
        
        if(!topleft.equal(new V2)){
            this.topLeft = topLeft.clone();
            this.center = new V2(this.topLeft.x + (this.width/2), this.topLeft.y + (this.height/2));
            this.bottomRight = new V2(this.topLeft.x + this.width,this.topLeft.y+this.height);
            this.topRight = new V2(this.bottomRight.x, this.topLeft.y);
            this.bottomLeft = new V2(this.topLeft.x, this.bottomRight.y);
        }
    }

    isPointInside(point){
		return point instanceof Vector2 &&
			   this.topLeft.x <= point.x && point.x <= this.bottomRight.x && 
			   this.topLeft.y <= point.y && point.y <= this.bottomRight.y;

    }
    
    isIntersectsWithBox(box)
	{
        if(!(box instanceof Box))
            return false;

		return boxIntersectsBox(this,box);
    }
    
    render(){
        var rp = this.renderProps;

        rp.context.beginPath();	
		rp.context.rect(this.topLeft.x, this.topLeft.y, this.size.x, this.size.y);
		if(rp.fill){
			rp.context.fillStyle = prop.fillStyle;
			rp.context.fill();	
		}
		rp.context.lineWidth = rp.lineWidth;
		rp.context.strokeStyle = rp.strokeStyle;
		rp.context.closePath();
		rp.context.stroke();
    }

}

