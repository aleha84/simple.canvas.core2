class Experiments2Scene extends Scene {
    //78D5E1
    constructor(options = {}) {
        options = assignDeep({}, {
            debug: {
                enabled: false,
                additional: []
            },
            rows: 10,
            columns: 10,
            angle: 40,
            sHeight: 8,
            rHeight: 30,
            baseColorHSV: [202,14,76]
        }, options)

        super(options);
    }

    backgroundRender(){
        this.backgroundRenderDefault();
        SCG.contexts.background.drawImage(this.bgImg, 0,0, SCG.viewport.real.width,SCG.viewport.real.height)
    }

    createTopImage(hsv) {
        return createCanvas(this.sSize, (ctx, size) => {

            ctx.fillStyle = hsvToHex({hsv});
            let pp = new PerfectPixel({context: ctx});
            for(let i = this.shift; i < size.x;i++){
                pp.lineV2(new V2(i, 0), new V2(i - this.shift, size.y-1));
            }
        });
    }

    start() {
        this.bgImg = createCanvas(this.viewport, (ctx, size) => {
            let baseColorHSV = [186, 18, 30];
            for(let i = 0; i < 300; i++){
                let width = getRandomInt(10, size.x);
                let height = getRandomInt(1, 5);

                let x = getRandomInt(-size.x, size.x);
                let y = fastRoundWithPrecision(getRandomInt(0, size.y));

                let bc = baseColorHSV;
                if(getRandomInt(0,10) == 10){
                    bc = [60, 68, 88];
                }

                ctx.fillStyle = hsvToHex({hsv: [bc[0], bc[1] + getRandomInt(-10, 10), bc[2] + + getRandomInt(-10, 10)]});
                ctx.fillRect(x, y, width, height);
            }
        })


        this.sWidth = this.sHeight;
        this.shift = fastRoundWithPrecision(this.sHeight*Math.tan(degreeToRadians(this.angle)));
        this.sSize = new V2(this.sWidth+ 2*this.shift, this.sHeight);
        this.rSize = new V2(this.shift, this.rHeight)
        this.topImg = this.createTopImage(this.baseColorHSV);
        // this.addGo(new GO({
        //     img: this.topImg, 
        //     position: this.sceneCenter,
        //     size: this.sSize.mul(5)
        // }), 200)

        let hsvGrayLighter = [...this.baseColorHSV];
        hsvGrayLighter[2]+=4;
        this.topImgElevated = this.createTopImage(hsvGrayLighter);

        this.rightImg = createCanvas(this.rSize, (ctx, size) => {
            ctx.fillStyle = '#CDDBF6'; 
            //ctx.fillRect(0,0,1,1);
            let pp = new PerfectPixel({context: ctx});
            for(let i = this.sSize.y; i < size.y; i++){
                pp.lineV2(new V2(0, i), new V2(size.x+1, i - this.sSize.y));
            }
        });

        this.rustTopImg = this.createTopImage([15,97,49]);
        this.rustTopLighterImg = this.createTopImage([15,97,55]);

        this.rustTop2Img = this.createTopImage([15,63,77]);
        this.rustTop2LighterImg = this.createTopImage([15,63,82]);

        // this.addGo(new GO({
        //     img: this.rightImg, 
        //     position: this.sceneCenter,
        //     size: this.rSize.mul(5)
        // }), 200)

        this.frontImg = createCanvas(new V2(1,1), ctx => {
            ctx.fillStyle = '#8A98A0'; ctx.fillRect(0,0,1,1);
        })

        this.segments = [];

        for(let r = 0; r < this.rows; r++){ //
            this.segments[r] = [];
            for(let c = this.columns-1; c >=0 ; c--){ //
                this.segments[r][c] = this.addGo(new ProjectedCube({
                    position: this.sceneCenter.add(
                        new V2(
                            -0.0*r -this.sSize.x *this.columns/2 + (this.sSize.x - this.shift)*c +  (this.rows - r - 1)*this.sHeight*Math.tan(degreeToRadians(this.angle)), 
                            -this.rows*this.sHeight/2 + this.sHeight*r)),
                    size: this.sSize,
                    topImg: this.topImg, 
                    rightImg: this.rightImg,
                    frontImg: this.frontImg,
                    topImgElevated: this.topImgElevated,
                    sWidth: this.sWidth,
                    rSize: new V2(this.shift, this.rHeight),
                    index: new V2(c,r),
                    // shift: this.shift,
                    // tHeight: this.tHeight
                  }), 100 + r)
            }
        }

        //this.segments[5][5].elevate(-10);
        // this.segments[5][5].initCompleted = function() {

        //     this.elevation = { time: 0, duration: 30, change: -10, type: 'quad', method: 'out', startValue: this.position.y }
        //     this.elevateTimer = this.registerTimer(createTimer(30, function(){
        //         this.position.y = easing.process(this.elevation);
        //         this.needRecalcRenderProperties = true;

        //         this.elevation.time++
        //         if(this.elevation.time == 1){
        //             this.top.img = this.topImgElevated;
        //         }

        //         if(this.elevation.time > this.elevation.duration){
        //             this.unregTimer(this.elevateTimer );
        //         }
        //     }, this, true))
        // }

        
        let mapping = [
            [],
            ['l',,'l'],
            ['l'],
            ['d','l',,'l'],
            ['l',,'l',,'l',,],
            ['d','l',,'l',,'l',,'l'],
            ['d','l', 'd',,'l'],
            ['d','d', 'l','d',,'l',,,'l'],
            ['d','d','d', 'l','l',,'l'],
            ['d','d','d','d','d', 'l', 'd', ,'l','l']
        ];

        
        mapping.forEach((row, r) => row.forEach((type,c) => {
            switch(type){
                case 'd':
                    this.segments[r][c].topImg = this.rustTopImg;
                    this.segments[r][c].topImgElevated = this.rustTopLighterImg;
                    break;
                case 'l':
                    this.segments[r][c].topImg = this.rustTop2Img;
                    this.segments[r][c].topImgElevated = this.rustTop2LighterImg;
                    break;
            }
        }));
        
        

        this.segments[9][0].topImg = this.rustTopImg;
        this.segments[9][0].topImgElevated = this.rustTopLighterImg;
        this.segments[9][1].topImg = this.rustTopImg;
        this.segments[9][1].topImgElevated = this.rustTopLighterImg;

        this.sceneManager = this.addGo(new GO({
            position: new V2(),
            size: new V2(1,1),
           init() {
               let scene = this.parentScene;
                let that = this;
               this.script.items = [
                    function(){
                        this.delayTimer = this.registerTimer(createTimer(4000, () => {
                            this.unregTimer(this.delayTimer);
                            that.processScript();
                        }, this, false))
                    },
                    function(){
                        let count = 1;
                        let elevateTask = function(index){
                            for(let r = 0; r < scene.segments.length;r++){
                                let s = scene.segments[r][index];

                                s.elevate({changeX:-10, duration: 7, elevateCallBack: (function() {
                                    if(this.index.y == 0){
                                        if(this.index.x > 0){
                                            elevateTask(this.index.x - 1);
                                        }
                                        else {
                                            count--;
                                            if(count == 0){
                                                that.processScript();
                                            }
                                            else {
                                                elevateTask(scene.segments[0].length-1);
                                            }
                                        }
                                    }  
                                    
      
                                  })});
                            }
                            
                        };

                        elevateTask(scene.segments[0].length-1);                            
                    },
                    function(){
                        this.delayTimer = this.registerTimer(createTimer(500, () => {
                            this.unregTimer(this.delayTimer);
                            that.processScript();
                        }, this, false))
                    },
                    function(){
                        let count = 1;
                        let elevateTask = function(index){
                            for(let c = 0; c < scene.segments[index].length;c++){
                                let s = scene.segments[index][c];

                                s.elevate({changeX:-10, duration: 7, elevateCallBack: (function() {
                                    if(this.index.x == 0){
                                        if(this.index.y < scene.segments.length-1){
                                            elevateTask(this.index.y + 1);
                                        }
                                        else {
                                            count--;
                                            if(count == 0){
                                                that.processScript();
                                            }
                                            else {
                                                elevateTask(0);
                                            }
                                        }
                                    }  
                                    
      
                                  })});
                            }
                            
                        };

                        elevateTask(0);                            
                    },
                    function(){
                        this.delayTimer = this.registerTimer(createTimer(500, () => {
                            this.unregTimer(this.delayTimer);
                            that.processScript();
                        }, this, false))
                    },
                    function(){
                        let elevateTask = function(index){
                            let currentY = index.y;
                            for(let x = index.x; x < scene.segments[0].length; x++){
                                let s = scene.segments[x][currentY];

                                s.elevate({changeX:-10, duration: 7, elevateCallBack: (function() {
                                    if(this.index.x == index.x){
                                        if(this.index.x > 0){
                                            elevateTask(new V2(index.x-1, index.y));
                                        }
                                        else {
                                            //that.processScript();
                                            elevateTask2(new V2(index.x, index.y-1))
                                        }
                                    }
                                })});

                                currentY-=1;
                            }
                        }

                        let elevateTask2 = function(index){
                            let currentX = index.x;
                            for(let y = index.y; y>=0; y--){
                                let s = scene.segments[y][currentX];

                                s.elevate({changeX:-10, duration: 7, elevateCallBack: (function() {
                                    if(this.index.x == index.x){
                                        if(this.index.y > 0){
                                            elevateTask2(new V2(index.x, index.y-1));
                                        }
                                        else {
                                            that.processScript();
                                        }
                                    }
                                })});

                                currentX+=1;
                            }
                        }

                        elevateTask(new V2(scene.segments[0].length-1, scene.segments.length-1));
                    },
                    function(){
                        let center = new V2(scene.segments[0].length/2, scene.segments.length/2);
                        let elevateTask = function(radius){
                            for(let x  = center.x - radius; x <= center.x+radius;x++ ){
                                let s = scene.segments[center.y-radius][x];
                                if(s != undefined){
                                    s.elevate({changeX:-10, duration: 7, elevateCallBack: (function() {
                                        if(this.index.x == center.x - radius && this.index.y == center.y- radius){
                                            if(this.index.x > 0){
                                                elevateTask(radius+1);
                                            }
                                            else {
                                                that.processScript();
                                            }
                                        }
                                    })});
                                }
                                

                                if(radius > 0){
                                    if(scene.segments[center.y+radius] != undefined){
                                        s = scene.segments[center.y+radius][x];
                                        s.elevate({changeX:-10, duration: 7, elevateCallBack: (function() {
                                        })});
                                    }
                                    
                                }
                            }

                            if(radius > 0){
                                for(let y  = center.y - radius + 1; y <= center.y+radius-1;y++ ){
                                    if(scene.segments[y][center.x-radius])
                                        scene.segments[y][center.x-radius].elevate({changeX:-10, duration: 7, elevateCallBack: (function() {
                                        })});

                                    if(scene.segments[y][center.x+radius])
                                        scene.segments[y][center.x+radius].elevate({changeX:-10, duration: 7, elevateCallBack: (function() {
                                        })});
                                }
                            }
                            
                        }
                        elevateTask(0);
                    },
                    function(){
                        this.delayTimer = this.registerTimer(createTimer(500, () => {
                            this.unregTimer(this.delayTimer);
                            that.processScript();
                        }, this, false))
                    },
                    function() {
                        for(let r = 0; r < scene.segments.length; r++){
                            for(let c = 0; c < scene.segments[r].length; c++){
                                let change = -10;
                                if(r%2 == 0){
                                    change*=-1;
                                }

                                scene.segments[r][c].elevate({changeX: (c%2 == 0 ? -1 : 1)*change, duration: 15, fallBackCallBack: (function() {
                                    if(this.index.x == 0 & this.index.y == 0){
                                        that.processScript();
                                    }    
                                })});   
                            }
                        }
                    },
                    function(){
                        this.delayTimer = this.registerTimer(createTimer(10, () => {
                            this.unregTimer(this.delayTimer);
                            that.processScript();
                        }, this, false))
                    },
                    function() {
                        for(let r = 0; r < scene.segments.length; r++){
                            for(let c = 0; c < scene.segments[r].length; c++){
                                let change = 10;
                                if(r%2 == 0){
                                    change*=-1;
                                }

                                scene.segments[r][c].elevate({changeX: (c%2 == 0 ? -1 : 1)*change, duration: 15, fallBackCallBack: (function() {
                                    if(this.index.x == 0 & this.index.y == 0){
                                        that.processScript();
                                    }    
                                })});   
                            }
                        }
                    },
                    function(){
                        this.delayTimer = this.registerTimer(createTimer(500, () => {
                            this.unregTimer(this.delayTimer);
                            that.processScript();
                        }, this, false))
                    },
                    function() {
                        let stopElevating = false;
                        let elevateTask = function(s){
                            s.elevate({changeX: getRandomInt(-20, 20), duration: getRandomInt(5,20), fallBackCallBack: (function() {
                                if(!stopElevating)
                                    elevateTask(this);   
                            })});  
                        }
                        for(let r = 0; r < scene.segments.length; r++){
                            for(let c = 0; c < scene.segments[r].length; c++){

                                elevateTask(scene.segments[r][c]);
                            }
                        }

                        this.randomElevationTimer = this.registerTimer(createTimer(5000, () => {
                            stopElevating = true;
                            this.unregTimer(this.randomElevationTimer);
                        }, this, false))
                    },
                    // function() {
                    //     alert('!')
                    //     that.processScript();
                    // }
               ]

               this.processScript();
           } 
        }))
    }

    
}

class ProjectedCube extends GO {
    constructor(options = {}) {
        options = assignDeep({}, {
            renderValuesRound: false,
            
        }, options)

        super(options);
    }
    elevate({changeX, duration =30, elevateCallBack = () => {}, fallBackCallBack = () => {}}) {
        this.elevation = { time: 0, duration: duration, change: changeX, type: 'quad', method: 'out', startValue: this.position.y, direction: -1 }
        this.elevateTimer = this.registerTimer(createTimer(30, function(){
            let e = this.elevation;
            this.position.y = easing.process(e);
            this.needRecalcRenderProperties = true;

            e.time++
            if(e.direction == -1 && e.time == 1){
                this.top.img = this.topImgElevated;
            }
            else if(e.direction == 1 && e.time == e.duration){
                this.top.img = this.topImg;
            }


            if(e.time > e.duration){
                //
                if(e.direction > 0){
                    this.unregTimer(this.elevateTimer );
                    fallBackCallBack.call(this);
                }
                else if(e.direction < 0){
                    elevateCallBack.call(this);
                    e.time = 0;
                    e.method = 'in';
                    e.direction = 1;
                    e.startValue = this.position.y;
                    e.change = -e.change;
                }
            }
        }, this, true))
    }
    init() {
        this.right = this.addChild(new GO({
            position: new V2(this.sWidth/2 + this.rSize.x/2, -this.size.y/2 + this.rSize.y/2 -1),
            size: this.rSize,//new V2(this.shift, this.tHeight + this.size.y),
            img: this.rightImg,
            renderValuesRound: false
        }))
        this.top = this.addChild(new GO({
            position: new V2(),
            size: this.size,
            img: this.topImg,
            renderValuesRound: false
        }))

        let fSize = new V2(this.size.x - this.rSize.x, this.rSize.y - this.size.y);
        this.front = this.addChild(new GO({
            position: new V2(-this.rSize.x/2, this.size.y/2 + fSize.y/2),
            size: fSize,
            img: this.frontImg,
            renderValuesRound: false
        }))
    }
}