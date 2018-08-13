class ChildrenGOScene extends Scene {
    constructor(options = {}){
        options = assignDeep({}, {
        }, options);

        super(options);

        let star = new Star({
            position: new V2(100,100),
            size: new V2(5,5),
            //destination: new V2(200, 100),
            //speed: 0.5
            satellite: true,
            colors: [255,255,255],
            radius: 50,
            speed: 1,
            angle: 0
        });
        
        star.addChild(new Star({
            position: new V2(0, -10),
            angle: 0,
            radius: 10,
            colors: [255,0,0],
            speed: 1,
            satellite: true
        }));

        star.addChild(new Star({
            position: new V2(0, -10),
            angle: 45,
            radius: 20,
            colors: [0,255,0],
            speed: 1.5,
            satellite: true
        }));

        star.addChild(new Star({
            position: new V2(0, -10),
            angle: 90,
            radius: 30,
            colors: [0,0,255],
            speed: 2,
            satellite: true
        }));

        let centralStar = new Star({
            position: new V2(this.viewport.x/2,this.viewport.y/2),
            size: new V2(10,10),
        });

        centralStar.addChild(star)

        this.addGo(centralStar, 1);
    }

    backgroundRender(){
        SCG.contexts.background.fillStyle = 'black';
        SCG.contexts.background.fillRect(0,0,SCG.viewport.real.width,SCG.viewport.real.height);
    }
}

class Fadeavay extends GO {
    constructor(options = {}) {
        options = assignDeep({}, {
            opacity: 0.2,
            colors: [255,255,255],
            opacityDeltaSpeed: 0.008,
            isCustomRender: true
        }, options);

        super(options);

        this.timerProcesser = function(){
            this.opacity-=this.opacityDeltaSpeed;
            this.fillStyle = `rgba(${this.colors[0]},${this.colors[1]},${this.colors[2]},${this.opacity})`;
            if(this.opacity <= 0)
            {
                this.opacity = 0;
                this.setDead();
            }
        }

        this.timer = createTimer(33, this.timerProcesser, this, false);
    }

    internalPreUpdate(now){
        doWorkByTimer(this.timer, now);
    }

    customRender(){
        sceneCustomRender(this)
    }
}

class Star extends MovingGO {
    constructor(options = {}) {
        options = assignDeep({}, {
            position: new V2(),
            opacity: 1,
            speed: 0,
            direction: new V2(),
            isCustomRender: true,
            size: new V2(1,1),
            colors: [255,255,255]
        }, options);

        super(options);
        
        this.fillStyle = `rgba(${this.colors[0]},${this.colors[1]},${this.colors[2]},${this.opacity})`;

        if(this.destination)
            this.setDestination(this.destination);
    }

    customRender(){
        sceneCustomRender(this)
    }

    beforePositionChange(now){
        if(this.satellite){
            this.position.x = this.parent.position.x + Math.cos(degreeToRadians(this.angle))*this.radius;
            this.position.y = this.parent.position.y + Math.sin(degreeToRadians(this.angle))*this.radius;

            this.position.substract(this.parent.position, true);
            this.angle+=this.speed;
            this.needRecalcRenderProperties = true;
        }
    }

    internalUpdate(now){
        SCG.scenes.activeScene.addGo(new Fadeavay({
            position: (this.parent ? this.absolutePosition : this.position).clone(),
            size: this.size.clone(),
            colors: this.colors
        }), 1);
    }
}

function sceneCustomRender(go) {
    let _fillStyle = go.context.fillStyle;
    let _strokeStyle = go.context.strokeStyle;

    go.context.fillStyle = go.fillStyle;
    if(go.renderSize.x > 3){
        let center = go.renderPosition;
        let diameter = go.renderSize.x;
        go.context.beginPath();
        go.context.arc(center.x, center.y, diameter/2, 0, 2 * Math.PI, false);
        go.context.fill();
        go.context.strokeStyle = go.fillStyle;
        go.context.stroke();
    }
    else 
    {
        let rp = go.renderPosition;
        let rsx = go.renderSize.x;
        let rsy = go.renderSize.y;
        go.context.fillRect(rp.x - rsx/2, rp.y - rsy/2, rsx,rsy);
    }

    go.context.fillStyle = _fillStyle;
    go.context.strokeStyle = _strokeStyle;
}