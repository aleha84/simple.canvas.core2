class ViewportMovementScene extends Scene {
    constructor(options = {}){
        options = assignDeep({}, {
            space: new V2(1000, 500),
            scrollOptions: {
                enabled: true,
                updatePositionsCallBack: () => SCG.UI.invalidate()
            }
            // events: {
            //     move: () => console.log('!!!')
            // }
        }, options);

        super(options);
        this.gos = [];

        // this.gos.push(this.addGo(new ViewportMovementSampleCircle({
        //         position: new V2(100, 50)
        //     }),1, true));
        for(let y = 0; y < this.space.y/100; y++){
            for(let x = 1; x < this.space.x/100; x++){
                this.gos.push(this.addGo(new ViewportMovementSampleCircle({
                    position: new V2(x*100, y*100+50)
                }),1, true));
            }
        }

        for(let y =1; y < this.space.y/50; y++){
            this.gos.push(this.addGo(new ViewportMovementSampleLine({
                line: new Line(new V2(0, y*50), new V2(1000, y*50))
            }),1));
        }

        for(let x =1;x < this.space.x/50; x++){
            this.gos.push(this.addGo(new ViewportMovementSampleLine({
                line: new Line(new V2(x*50, 0), new V2(x*50, 500))
            }),1));
        }

        // this.gos.push(this.addGo(new ViewportMovementSampleLine({
        //     line: new Line(new V2(450, 0), new V2(450, 500))
        // }),1));
        

        this.cameraShiftDelta = new V2(0.25,0);
        this.cameraShiftDeltaDirection = 1;

        this.cameraMovementTimer = createTimer(50, this.cameraMovementProcesser, this, false);

        this.visibleObjectLabel = this.addUIGo(new UILabel(
            { 
                position: new V2(25,10), 
                text: {
                    size: 6,
                    color: 'black'
                },
                format: {
                    format: "Visible objects: {0}",
                    argsRetriever: () => { 
                        return [this.gos.filter((item) => item.renderPosition !== undefined ).length]; }
                }
            }))
    }

    cameraMovementProcesser(){
        let currentShift = SCG.viewport.shift;
        if(currentShift.x+this.viewport.x >= this.space.x){
            this.cameraShiftDeltaDirection = -1;
        }
        else if(currentShift.x <= 0)
        {
            this.cameraShiftDeltaDirection = 1;
        }

        SCG.viewport.camera.updatePosition(SCG.viewport.shift.add(this.cameraShiftDelta.mul(this.cameraShiftDeltaDirection)));
        SCG.UI.invalidate();
    }

    backgroundRender(){
        SCG.contexts.background.fillStyle = 'lightgray';
        SCG.contexts.background.fillRect(0,0,SCG.viewport.real.width,SCG.viewport.real.height);
    }

    preMainWork(now){
        //doWorkByTimer(this.cameraMovementTimer, now);
    }
}

class ViewportMovementSampleLine extends GO {
    constructor(options = {}){
        options = assignDeep({}, {
            size: new V2(10,10),
            position: new V2(1,1),
            isCustomRender: true,
        }, options);
        
        super(options);
        
        let width = Math.max(options.line.begin.x, options.line.end.x) - Math.min(options.line.begin.x, options.line.end.x);
        let height = Math.max(options.line.begin.y, options.line.end.y) - Math.min(options.line.begin.y, options.line.end.y);
        if(width === 0)
            width = 1;
        
        if(height === 0)
            height = 1;

        this.size = new V2(width, height);
        this.position = new V2(options.line.begin.x + width/2, options.line.begin.y + height/2);
        
    }

    internalUpdate(){
        if(this.renderPosition === undefined)
            return;

        this.line.beginRender = this.line.begin.add(SCG.viewport.shift.mul(-1)).mul(SCG.viewport.scale);
        this.line.endRender = this.line.end.add(SCG.viewport.shift.mul(-1)).mul(SCG.viewport.scale);
    }

    customRender(){
        this.context.lineWidth = 1;
        this.context.strokeStyle = 'blue';
        this.context.beginPath();
        this.context.moveTo(this.line.beginRender.x, this.line.beginRender.y);
        this.context.lineTo(this.line.endRender.x, this.line.endRender.y);
        this.context.stroke();
    }
}

class ViewportMovementSampleCircle extends MovingGO {
    constructor(options = {}){
        options = assignDeep({}, {
            size: new V2(60,60),
            isCustomRender: true,
            handlers: {
                click: function(){
                    this.selected = !this.selected;
                }
            }
            //speed: 0.2
        }, options);

        super(options);

        this.text = GO.getTextPropertyDefaults(this.position.toString())
        this.text.autoCenter = true;
        this.text.size = 9;

        this.setDestination(new V2(this.position.x, this.position.y + 100));
    }

    customRender(){
        this.context.fillStyle = this.fillStyle;
        let center = this.renderPosition;
        let radius = this.renderSize.x;
        this.context.beginPath();
        this.context.arc(center.x, center.y, radius/2, 0, 2 * Math.PI, false);
        this.context.lineWidth = 2;
        if(this.selected){
            this.context.fillStyle = 'green';
            this.context.fill();
        }
        this.context.strokeStyle = 'red';
        this.context.stroke();

        this.renderText();
        this.renderBox.render();
    }
}