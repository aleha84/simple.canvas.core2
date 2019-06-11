class WaterfallScene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            debug: {
                enabled: true,
                additional: [],
            },

        }, options)

        super(options);
    }

    backgroundRender() {
        this.backgroundRenderDefault('#404040');
    }

    start() {
        this.data = [
            [[140, 160]],[[140, 160]],[[140, 160]],[[150,151]],
            [[130, 170]],[[130, 170]],[[130, 170]],[[150,151]],
            [[120, 180]],[[120, 180]],[[120, 180]],[[150,151]],
            [[110, 190]],[[110, 190]],[[110, 190]],[[150,151]],
            [[100, 200]],[[100, 200]],[[100, 200]],[[150,151]],
            [[90, 210]],[[90, 210]],[[90, 210]],[[150,151]],
            [[80, 220]],[[80, 220]],[[80, 220]],[[150,151]],
            [[70, 230]],[[70, 230]],[[70, 230]],[[150,151]],
            [[60, 240]],[[60, 240]],[[60, 240]],[[150,151]],
            [[50, 250]],[[50, 250]],[[50, 250]],[[150,151]],
            [[60, 240]],[[60, 240]],[[60, 240]],[[150,151]],
            [[70, 230]],[[70, 230]],[[70, 230]],[[150,151]],
            [[80, 220]],[[80, 220]],[[80, 220]],[[150,151]],
            [[90, 210]],[[90, 210]],[[90, 210]],[[150,151]],
            [[100, 200]],[[100, 200]],[[100, 200]],[[150,151]],
            [[110, 190]],[[110, 190]],[[110, 190]],[[150,151]],
            [[120, 180]],[[120, 180]],[[120, 180]],[[150,151]],
            [[130, 170]],[[130, 170]],[[130, 170]],[[150,151]],
            [[140, 160]],[[140, 160]],[[140, 160]],[[150,151]],
            [[150,151]],[[150,151]],[[150,151]],[[150,151]],
        ]
        this.imgCache = [];
        this.items = [];
        this.itemsCount = 3000;
        this.targetSizeY = 10;
        this.durationClamps = [70, 80];
        this.layersCount = 4;
        this.baseColorHSV = [205, 50, 70];

        this.whiteColorHSV = []

        this.scale = 4;

        this.blockedXClamps = undefined;//[100, 200];

        this.itemsGeneratorTimer = this.registerTimer(createTimer(20, () => {
            if(this.items.length >= this.itemsCount){
                this.unregTimer(this.itemsGeneratorTimer);
                //this.startSequence();
                return;
            }

            for(let l = 0; l < this.layersCount; l++){
                let baseColorHSV = [
                    this.baseColorHSV[0], //+ getRandomInt(-5,5),
                    this.baseColorHSV[1] + fastRoundWithPrecision(((l+1)/this.layersCount)*40),// + getRandomInt(0,10),
                    this.baseColorHSV[2] + fastRoundWithPrecision(((l+1)/this.layersCount)*25) //+ getRandomInt(0,5)
                ];

                this.items.push(this.addGo(new WaterFallItem({
                    size: new V2(this.width, this.width),
                    position: new V2(getRandomInt(0, this.viewport.x), -getRandomInt(0, 30)*2),
                    targetY: this.viewport.y+this.targetSizeY*2,
                    targetSizeY: this.targetSizeY,
                    imgCache: this.imgCache,
                    duration: this.durationClamps[1] - ( (this.durationClamps[1] - this.durationClamps[0])*(l+1)/this.layersCount )  + getRandomInt(-5, 5) ,
                    baseColorHSV,
                    scale: this.scale
                }), 20 + l))
            }
            
        }, this, true));

        this.whiteTimer = this.registerTimer(createTimer(1000, () => {
            this.enableWhite = true;
            this.disableWhiteTimer = this.registerTimer(createTimer(200, () => {
                
                this.enableWhite = false;
                this.unregTimer(this.disableWhiteTimer);
                this.disableWhiteTimer = undefined;

            }, this, false));
        }, this, true));

        // this.sceneManager = this.addGo(new GO({
        //     position: new V2(),
        //     size: new V2(1,1),
        //     init() {
        //         this.startSequence();
        //     },
        //     startSequence() {
        //         this.script.items = [...(this.parentScene.data.map(d => {
        //             return [function(){
        //                 //console.log(d[0], d[1]);
        //                 this.parentScene.blockedXClamps = d;
        //                 this.processScript();
        //             }, 
        //             function(){
        //                 this.delayTimer = this.registerTimer(createTimer(50, () => {
        //                     this.unregTimer(this.delayTimer);
        //                     this.processScript();
        //                 }, this, false))
        //             }]
        //         })).flat(),
                
        //         function(){
        //             this.delayTimer = this.registerTimer(createTimer(5000, () => {
        //                 this.unregTimer(this.delayTimer);
        //                 this.processScript();
        //             }, this, false))
        //         },
        //         function() {
        //             this.startSequence();
        //         }
        //         ];
        
        //         this.processScript();
        //     }
        // }))
    }

    
}

class WaterFallItem extends GO {
    constructor(options = {}) {
        options = assignDeep({}, {
            renderValuesRound: true,
            duration: 50,
            baseSize: new V2(1,1),
            size: new V2(1,1),
            baseColorHSV: [205, 100, 100],
            scale: 1,
            //currentColorHSV: [205, 100, 100]
        }, options)

        super(options);
    }

    init() {
        this.originY = this.position.y;
        this.originSizeY = this.baseSize.y;
        this.currentColorHSV = [...this.baseColorHSV];
        this.currentColorHEX = hsvToHex({hsv: this.currentColorHSV});
        this.currentColorRGB = hsvToRgb(this.currentColorHSV[0], this.currentColorHSV[1], this.currentColorHSV[2], false, true);

        this.retry = false;

        this.reset();

        this.timer = this.registerTimer(createTimer(30, () => {
            if(this.retry){
                if(this.reset())    
                    return;
            }
            this.position.y = easing.process(this.yChange);
            
            let prevSizeY = this.baseSize.y;

            this.baseSize.y = fastRoundWithPrecision( easing.process(this.sizeYChange));
            if(prevSizeY != this.baseSize.y){
                this.getImage();
                this.size = this.baseSize.mul(this.scale);
            }


            this.yChange.time++;
            this.sizeYChange.time++;
            this.needRecalcRenderProperties = true;

            if(this.yChange.time > this.yChange.duration){
                this.reset();
            }
        }, this, true));
    }

    reset() {
        



        this.position.y = this.originY;
        this.baseSize.y = this.originSizeY;
        this.yChange = easing.createProps(this.duration, this.position.y, this.targetY, "cubic", "in");
        this.sizeYChange = easing.createProps(this.duration, this.baseSize.y, this.targetSizeY, "cubic", "in");
        this.size = this.baseSize.mul(this.scale);

        if(this.parentScene.blockedXClamps){
            this.position.x = getRandomInt(0, this.parentScene.viewport.x);

            for(let i = 0;i<this.parentScene.blockedXClamps.length;i++){
                if(this.position.x >= this.parentScene.blockedXClamps[i][0] && this.position.x <= this.parentScene.blockedXClamps[i][1]){
                    this.retry = true;
                    return false;
                }
            }
            
        }

        this.retry = false;

        this.currentColorHSV = [...this.baseColorHSV];
        if(this.parentScene.enableWhite){
        
            this.currentColorHSV[1]-=60;
            if(this.currentColorHSV[1] < 0)
                this.currentColorHSV[1] = 0

            this.currentColorHSV[2] = 100;
        }
        
        this.currentColorHEX = hsvToHex({hsv: this.currentColorHSV});
        this.currentColorRGB = hsvToRgb(this.currentColorHSV[0], this.currentColorHSV[1], this.currentColorHSV[2], false, true);
        
        this.getImage();
    }

    getImage() {
        let key = this.currentColorHSV[0]*1000000 + this.currentColorHSV[1]*1000 + this.currentColorHSV[2] 
        if(!this.imgCache[this.baseSize.y]){
            this.imgCache[this.baseSize.y] = [];
        }

        let cBySize = this.imgCache[this.baseSize.y];
        if(!cBySize[key]){
            cBySize[key] = createCanvas(this.baseSize, (ctx, size, hlp) => {
                if(size.y == 1)
                    hlp.setFillColor(this.currentColorHEX).rect(0,0, size.x, size.y);
                else {
                    let opacity = 0;
                    for(let y = 0; y < size.y; y++){
                        opacity = fastFloorWithPrecision(((y+1)/size.y), 1)*10;
                        opacity = Math.floor(opacity/2)*2;
                        opacity=fastFloorWithPrecision(opacity/10,1);
                        hlp.setFillColor(colors.rgbToString({value: this.currentColorRGB, isObject: true, opacity})).rect(0,y, size.x, 1);
                    }
                }
            })
        }

        this.img = cBySize[key];

        return cBySize[key];
    }

    
}