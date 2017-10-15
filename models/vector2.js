class Vector2 {
    constructor(x, y) {
        if(typeof x == 'object' && x.x !== undefined && x.y !== undefined){
            y = x.y;
            x = x.x;
        }
        else{
            if(x == undefined){
                x = 0;
            }
            if(y == undefined){
                y = 0;
            }	
        }
        
        this.x = x;
        this.y = y;
    }

    distance(to) {
        if(!to || !(to instanceof Vector2)){
			return undefined;
		}

		return new Vector2(to.x-this.x,to.y - this.y).module();
    }

    directionNonNormal(to){
		if(!to || !(to instanceof Vector2)){
			return new Vector2()
		}

		return new Vector2(to.x-this.x,to.y - this.y);
    }
    
    direction(to){
		if(!to || !(to instanceof Vector2)){
			return new Vector2()
		}

		return new Vector2(to.x-this.x,to.y - this.y).normalize();
    }
    
    normalize(){
		var module = this.module();
		this.x /= module;
		this.y /= module;
		return this;
    }
    
    module(){
		return Math.sqrt(Math.pow(this.x,2) + Math.pow(this.y,2));
    }
    
    add(summand = new Vector2, inner = false){
        if(!inner)
            return new Vector2(this.x + summand.x,this.y + summand.y);
        else{
            this.x +=summand.x;
            this.y +=summand.y;	

            return this;
        }
    }
    
    substract(subtrahend = new Vector2, inner = false){
        if(!inner)
            return new Vector2(this.x - subtrahend.x,this.y - subtrahend.y);
        else{
            this.x -=subtrahend.x;
            this.y -=subtrahend.y;	

            return this;
        }
    }
    
    mul(coef = 1, inner = false){
        if(inner)
        {
            this.x*=coef;
            this.y*=coef;

            return this;
        }
		return new Vector2(this.x*coef,this.y*coef);
    }
    
    division(coef = 1, inner = false){
        if(coef == 0)
            coef = 1;

        if(inner) {
            this.x/=coef;
            this.y/=coef;

            return this;
        }

		return new Vector2(this.x/coef,this.y/coef);
    }
    
    dot(to)
	{
        if(!to || !(to instanceof Vector2)){
			return new Vector2()
        }
        
		return this.mulVector(to);
    }
    
    cross(to){
		if(!to || !(to instanceof Vector2)){
			return 0;
		}

		return this.x*to.y - this.y*to.x;
    }
    
    mulVector(to){
		if(!to || !(to instanceof Vector2)){
			return 0;
		}

		return this.x*to.x + this.y*to.y;
    }
    
    rotate(angle = 0, inRad = false, inner = false){
		var result = new Vector2(this.x*Math.cos(inRad?angle:angle*Math.PI/180) - this.y* Math.sin(inRad?angle:angle*Math.PI/180),
						   this.x*Math.sin(inRad?angle:angle*Math.PI/180) + this.y* Math.cos(inRad?angle:angle*Math.PI/180) );

		if(inner)
		{
			this.x = result.x;
			this.y = result.y;

			return this;
		}
		else{
			return result;
		}
    }
    
    clone(){
		return new Vector2(this.x,this.y);
    }
    
    equal(to){
		if(!to || !(to instanceof Vector2)){
			return false;
		}

		return this.x === to.x && this.y === to.y;
    }
    
    toString(){
		return 'x: ' + this.x + ', y: ' + this.y;
    }
    
    angleTo(to, inRad  = false){
        if(!to || !(to instanceof Vector2))
            return 0;

		var result = Math.atan2(this.cross(to), this.dot(to));

		if(inRad){
			return result;
		}

		return result * 180/Math.PI;
    }
    
    static average(vectors){
        if(!isArray(vectors) || isEmpty(vectors)){
            throw 'Param is not defined';
        }
    
        var result = new Vector2;
    
        for(var i = 0; i < vectors.length; i++){
            result.add(vectors[i], true);
        }
    
        return result.division(vectors.length);
    }

    static get left(){
        return new Vector2(-1,0);
    }

    static get right(){
        return new Vector2(1,0);
    }

    static get up(){
        return new Vector2(0,-1);
    }

    static get down(){
        return new Vector2(0,1);
    }
}

var V2 = Vector2;