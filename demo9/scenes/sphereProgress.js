class SphereProgressScene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            debug: {
                enabled: true,
                showFrameTimeLeft: true,
                additional: [],
            },
        }, options)
        super(options);
    }

    backgroundRender() {
        this.backgroundRenderDefault();
    }

    start(){
        this.textureHeight = 200;
        this.textureSize = new V2(this.textureHeight*2, this.textureHeight);
        this.sphereSize = new V2(100,100);

        sphereHelper.clearCache();

        this.textures = [];
        let fontSize = 60;
        for(let i = 0; i< 10; i++){
            this.textures[i] = createCanvas(this.textureSize, (ctx, size, hlp) => {
                hlp.setFillColor('white').rect(0,0,size.x, size.y);
                
                hlp.setFillColor('gray');
                ctx.font = fontSize + 'px Arial';

                let x1Shift = fontSize/2;
                let x2Shift = fontSize/2;
                let yShift = fontSize/3;
                if(i == 0){
                    x1Shift = fast.r(fontSize/4);
                }
                
                if(i == 9){
                    x2Shift = fast.r(fontSize*3/4)+3;
                }

                ctx.fillText(i*10, fast.r(size.x/4)-x1Shift, fast.r(size.y/2)+yShift)
                ctx.fillText((i+1)*10, fast.r(size.x*3/4)-x2Shift, fast.r(size.y/2)+yShift)
            })
        }

        this.textures[this.textures.length] = createCanvas(this.textureSize, (ctx, size, hlp) => {
            hlp.setFillColor('white').rect(0,0,size.x, size.y);
            hlp.setFillColor('gray');
            ctx.font = fontSize + 'px Arial';

            let x1Shift = fast.r(fontSize/4);
            let x2Shift = fast.r(fontSize*3/4)+3;
            let yShift = fontSize/3;

            ctx.fillText(0, fast.r(size.x/4)-x1Shift, fast.r(size.y/2)+yShift)
            ctx.fillText(100, fast.r(size.x*3/4)-x2Shift, fast.r(size.y/2)+yShift)
        })

        this.textureIndex = 0;

        this.diskSize = this.textureHeight;
        this.time = 0;
        this.speed =1;

        this.progressItem = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.sphereSize,
        }));

        this.demo = this.addGo(new GO({
            position: new V2(this.sceneCenter.x, 100),
            size: new V2(200, 100),
            isVisible: false,
            img: this.textures[this.textureIndex]
        }))

        this.light =this.addGo(new GO({
            position: new V2(this.sceneCenter.x, this.sceneCenter.y + 100),
            size: new V2(200, 10),
            img: createCanvas(new V2(200, 10), (ctx, size, hlp) => {
                hlp.setFillColor('#EAEAEA').elipsis(new V2(size.x/2, size.y/2).toInt(), new V2(size.x/2, size.y/2).toInt())
            })
        }))

        this.setSphereImg();

        this.timer = this.regTimerDefault(30, () => {
            easing.commonProcess({
                context: this, 
                propsName: 'timeChange',
                targetpropertyName: 'time'
            })
        })

        this.rotation1 = [0, 260];
        this.rotation2 = [260, 190];
        this.rotation3 = [190, 200];
        this.rotationFramesCount = 16;

        this.delayTimer = this.registerTimer(createTimer(2000, () => {
            this.unregTimer(this.delayTimer);
            this.delayTimer = undefined;
            this.rotateSphere()
        }, this, false));
        
    }

    setSphereImg() {
        if(!this.shadowImg){
            this.shadowImg = createCanvas(new V2(this.diskSize, this.diskSize), (ctx, size, hlp) => {
                hlp.setFillColor('#E0E0E0');
                for(let i = 0; i < 5;i++){
                    hlp.strokeEllipsis(20 + (i*3),80-(i*3), 0.1, new V2(size.x/2,size.y/2), size.x/2-5 - i, size.y/2-5 - i )
                }
            });
        }
        this.sphereImg = sphereHelper.createPlanetTexure(this.textures[this.textureIndex], 'sphereProgress_' + this.textureIndex, this.textureSize, this.diskSize, this.speed, this.time,false);

        this.progressItem.img = createCanvas(new V2(this.diskSize, this.diskSize), (ctx, size, hlp) => {
            ctx.drawImage(this.sphereImg, 0,0);
            //ctx.globalCompositeOperation = 'source-atop';

            ctx.drawImage(this.shadowImg, 0,0);
            

        }) //this.sphereImg;
        this.demo.img = this.textures[this.textureIndex];
    }

    rotateSphere(){
        this.timeChange = easing.createProps(this.rotationFramesCount, this.rotation1[0], this.rotation1[1], 'quad', 'inOut');
        this.timeChange.onChange = () => this.setSphereImg()
        this.timeChange.onComplete = () => {
            this.timeChange = easing.createProps(fast.r(this.rotationFramesCount/2), this.rotation2[0], this.rotation2[1], 'quad', 'inOut');
            this.timeChange.onChange = () => this.setSphereImg()
            this.timeChange.onComplete = () => {
                this.timeChange = easing.createProps(fast.r(this.rotationFramesCount/4), this.rotation3[0], this.rotation3[1], 'quad', 'inOut');
                this.timeChange.onChange = () => this.setSphereImg()
                this.timeChange.onComplete = () => {
                    this.textureIndex++;
                    if(this.textureIndex == this.textures.length-1){
                        this.rotation1 = [200, -60];
                        this.rotation2 = [-60, 10];
                        this.rotation3 = [10, 0];
                    }
                    else {
                        if(this.textureIndex == this.textures.length){
                            this.textureIndex = 0;
                            this.rotation1 = [0, 260];
                            this.rotation2 = [260, 190];
                            this.rotation3 = [190, 200];
                        }

                        this.time = 0;
                    }
                    
                    this.setSphereImg();
                    this.delayTimer = this.registerTimer(createTimer(this.textureIndex == 0 ? 1000 : 150, () => {
                        this.unregTimer(this.delayTimer);
                        this.delayTimer = undefined;
                        this.rotateSphere()
                    }, this, false));
                    
                }
            }
        }
    }
}