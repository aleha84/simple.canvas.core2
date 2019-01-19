class SphereScene extends Scene {
    constructor(options = {}){
        options = assignDeep({}, {
            debugging: {
                enabled: true,
                font: (25*SCG.viewport.scale) + 'px Arial',
                textAlign: 'left',
                fillStyle: 'red',
                position: new V2(20*SCG.viewport.scale, 20*SCG.viewport.scale),
            }
        }, options)

        super(options);

        this.textureSize = new V2(800, 400);
        this.sphereSize = new V2(100,100);

        this.texture = textureGenerator.textureGenerator({
            size: this.textureSize,
            backgroundColor: '#094D74', //water
            surfaces: [
                textureGenerator.getSurfaceProperties({ colors: ['#759CD8'], fillSize: new V2(10,10), opacity: [0.01, 0.05], type:'rect', density: 0.1, indents: { h: new V2(-10, -10), v: new V2(-1, -1) } }), //water
                textureGenerator.getSurfaceProperties({ colors: ['#000000'], fillSize: new V2(2,2), opacity: [0.01, 0.05], type:'rect', density: 0.01, indents: { h: new V2(-2, -2), v: new V2(-1, -1) } }), //water
                textureGenerator.getSurfaceProperties({ //ground
                    colors: ['#543B0E', '#674107', '#87421C'], fillSize: new V2(10,10), opacity: [0.5, 1], 
                    type:'blot', blot: { ttl: 10, density: 1, decreaseSize: true }, density: 0.0001 }),
                textureGenerator.getSurfaceProperties({ //trees
                    colors: ['#4D784E', '#6EA171'], fillSize: new V2(10,10), opacity: [0.1, 0.5], 
                    type:'blot', blot: { ttl: 10, density: 0.75, decreaseSize: true }, density: 0.0001, 
                    indents: { v: new V2(this.textureSize.y*1/3, this.textureSize.y*1/3) } }),

                textureGenerator.getSurfaceProperties({ //desert north
                    colors: ['#FFDD75', '#EAAE53'], fillSize: new V2(10,10), opacity: [0.1, 0.2], 
                    type:'blot', blot: { ttl: 10, density: 1, decreaseSize: true }, density: 0.00001, indents: { v: new V2(this.textureSize.y*1/3, this.textureSize.y*6/10) } }),

                textureGenerator.getSurfaceProperties({ //desert south
                    colors: ['#FFDD75', '#EAAE53'], fillSize: new V2(10,10), opacity: [0.1, 0.2], 
                    type:'blot', blot: { ttl: 10, density: 1, decreaseSize: true }, density: 0.00001, indents: { v: new V2(this.textureSize.y*6/10, this.textureSize.y*1/3) } }),                    
                
                textureGenerator.getSurfaceProperties({ //ice cap north
                    colors: ['#FFFFFF', '#ECFFFD', '#D0ECEB','#EEF0F6'], fillSize: new V2(10,10), opacity: [0.1, 0.5], 
                    type:'blot', blot: { ttl: 10, density: 0.25, decreaseSize: true }, density: 0.001, indents: { v: new V2(-10, this.textureSize.y*4/5) } }),
                textureGenerator.getSurfaceProperties({ colors: ['#FFFFFF', '#ECFFFD', '#D0ECEB','#EEF0F6'], fillSize: new V2(5,5), opacity: [0.1, 0.5], type:'rect', density: 0.015, indents: { v: new V2(-5, this.textureSize.y*6/7) } }),

                textureGenerator.getSurfaceProperties({ //ice cap south
                    colors: ['#FFFFFF', '#ECFFFD', '#D0ECEB','#EEF0F6'], fillSize: new V2(10,10), opacity: [0.1, 0.5], 
                    type:'blot', blot: { ttl: 10, density: 0.25, decreaseSize: true }, density: 0.001, indents: { v: new V2(this.textureSize.y*4/5, -10) } }),
                textureGenerator.getSurfaceProperties({ colors: ['#FFFFFF', '#ECFFFD', '#D0ECEB','#EEF0F6'], fillSize: new V2(5,5), opacity: [0.1, 0.5], type:'rect', density: 0.015, indents: { v: new V2(this.textureSize.y*6/7, -5) } }),
            ]
        });

        this.cloudsTexture = textureGenerator.textureGenerator({
            size: this.textureSize,
            backgroundColor: 'rgba(255,255,255,0)', //clouds
            surfaces: [
                textureGenerator.getSurfaceProperties({ 
                    colors: ['#FFFFFF'], fillSize: new V2(10,10), opacity: [0.1, 0.5],  type:'blot', blot: { ttl: 10, density: 0.75, decreaseSize: true }, density: 0.0001 }),
            ]});

        this.diskSize = 200;
        this.time = 0;
        this.speed =0.5;
        this.cloudsSpeed = -0.5
        this.sphereImg = this.createPlanetTexure(this.texture, 'sphere', this.textureSize, this.diskSize, this.speed, false);
        this.cloudsSphereImg = this.createPlanetTexure(this.cloudsTexture, 'clouds', this.textureSize, this.diskSize, this.cloudsSpeed, true);
        

        this.planet = this.addGo(new GO({
            size: this.sphereSize,
            position: this.sceneCenter
        }), 21);

        this.planet.sphere = this.planet.addChild(new GO({
            size: this.sphereSize,
            position: new V2(),
            img: this.sphereImg
        }));

        this.planet.cloudsSphere = this.planet.addChild(new GO({
            size: this.sphereSize,
            position: new V2(),
            img: this.cloudsSphereImg 
        }));

        this.rotationTimer = createTimer(35, () => {
            this.sphereImg = this.createPlanetTexure(this.texture, 'sphere',this.textureSize, this.diskSize, this.speed, false);
            this.planet.sphere.img = this.sphereImg;

            this.cloudsSphereImg = this.createPlanetTexure(this.cloudsTexture, 'clouds',this.textureSize, this.diskSize, this.cloudsSpeed, true)
            this.planet.cloudsSphere.img = this.cloudsSphereImg;

            this.time++;
        }, this, false);

        this.zoomInOutDirection = 1;
        this.zoomInOutStep = 0.05;
        this.zoomInTimer = createTimer(50, () => {
            if(this.sphereSize.x > 100){
                this.zoomInOutDirection = -1;
                this.sphereSize.x = 100;
            }
            else if(this.sphereSize.x < 50){
                this.zoomInOutDirection = 1;
                this.sphereSize.x = 50;
            }

            //this.sphereSize.mul(this.zoomInOutMultiplier, true);
            this.sphereSize.x+=this.zoomInOutDirection*this.zoomInOutStep;
            this.sphereSize.y+=this.zoomInOutDirection*this.zoomInOutStep;
            this.planet.needRecalcRenderProperties = true;
        }, this. true)

        this.layeredStars = []

        this.itemsCountPerLayer = 3;
        for(let layer = 0; layer < 5; layer++){
            this.layeredStars[layer] = [];
            for(let i = 0;i<this.itemsCountPerLayer;i++){
                this.layeredStars[layer][i] = [
                    this.addGo(new MovingGO({
                        size: this.viewport,
                        position: this.sceneCenter.add(new V2(this.viewport.x*i,0)),
                        img: this.starsLayerGeneratr(this.viewport, 0.0075*(Math.pow(0.1,(layer))), 0.1 + (0.1*layer)),
                        setDestinationOnInit: true,
                        destination: this.sceneCenter.add(new V2(-this.viewport.x,0)),
                        speed: 0.1 + (0.01*layer),
                        destinationCompleteCallBack: function(){
                            this.position = this.parentScene.sceneCenter.add(new V2(this.parentScene.viewport.x*(this.parentScene.itemsCountPerLayer-1),0));
                            this.setDestination( this.parentScene.sceneCenter.add(new V2(-this.parentScene.viewport.x,0)))
                        }
                    }), layer),
                    
                ]
            }
        }
        
        
    }

    starsLayerGeneratr(size, density, opacity) {
        return textureGenerator.textureGenerator({
            size: size,
            backgroundColor: 'rgba(255,255,255,0)', 
            surfaces: [
                textureGenerator.getSurfaceProperties({ colors: ['#FFFFFF'], fillSize: new V2(1,1), opacity: [opacity],  type:'rect', density: density }),
                textureGenerator.getSurfaceProperties({ colors: ['#FFFFFF'], fillSize: new V2(1,1), opacity: [opacity],  type:'rect', density: density*0.9, indents: { v: new V2(size.y/5, size.y/5) } }),
                textureGenerator.getSurfaceProperties({ colors: ['#FFFFFF'], fillSize: new V2(1,1), opacity: [opacity],  type:'rect', density: density*0.8, indents: { v: new V2(size.y/3, size.y/3) } }),
                textureGenerator.getSurfaceProperties({ colors: ['#FFFFFF'], fillSize: new V2(1,1), opacity: [opacity],  type:'rect', density: density*0.7, indents: { v: new V2(size.y*4/10, size.y*4/10) } }),
                textureGenerator.getSurfaceProperties({ colors: ['#FFFFFF'], fillSize: new V2(1,1), opacity: [opacity],  type:'rect', density: density*0.5, indents: { v: new V2(size.y*9/20, size.y*9/20) } }),
        ]})
    }

    afterMainWork(now){
        if(this.rotationTimer)
            doWorkByTimer(this.rotationTimer, now);

        // if(this.zoomInTimer)
        //     doWorkByTimer(this.zoomInTimer, now);

        if(this.debugging.enabled){

            let ctx = SCG.contexts.main;

            ctx.font = this.debugging.font;
            ctx.textAlign = this.debugging.textAlign;
            ctx.fillStyle = this.debugging.fillStyle;
            
            ctx.fillText(SCG.main.performance.fps, this.debugging.position.x, this.debugging.position.y);
        }
    }

    backgroundRender(){
        SCG.contexts.background.fillStyle = 'black';
        SCG.contexts.background.fillRect(0,0,SCG.viewport.real.width,SCG.viewport.real.height);

        let grd = SCG.contexts.background.createLinearGradient(SCG.viewport.real.width/2, 0, SCG.viewport.real.width/2, SCG.viewport.real.height);
        grd.addColorStop(0, 'rgba(255,255,255,0)');grd.addColorStop(0.1, 'rgba(255,255,255,0)');grd.addColorStop(0.5, 'rgba(255,255,255,0.04)');
        grd.addColorStop(0.9, 'rgba(255,255,255,0)');grd.addColorStop(1, 'rgba(255,255,255,0)');

        SCG.contexts.background.fillStyle = grd;
        SCG.contexts.background.fillRect(0,0,SCG.viewport.real.width,SCG.viewport.real.height);
    }

    setPixel(imageData, x, y, r, g, b, a, width) {
        let index = (x + y * width) * 4;
        imageData.data[index+0] = r;
        imageData.data[index+1] = g;
        imageData.data[index+2] = b;
        imageData.data[index+3] = a;
    }

    getPixel(imageData, x, y, width){
        let index = (x + y * width) * 4;
        return [imageData.data[index], imageData.data[index+1], imageData.data[index+2], imageData.data[index+3]];
    }

    createPlanetTexure(baseTexture, textureName, baseTextureSize, diskSize, speed, addShadows) {
        return createCanvas(new V2(this.diskSize,this.diskSize), (ctx, size) => {
            let sphereImg = this.createSphere(baseTexture, textureName, baseTextureSize, diskSize, speed,this.time);
            ctx.drawImage(sphereImg, 0,0, size.x, size.y);
            
            if(addShadows) {
                ctx.save();
                ctx.arc(size.x/2,size.x/2, size.x/2 + 1, 0, Math.PI*2, false );
                ctx.clip();
                
                let grd =ctx.createRadialGradient(size.x/4, size.x/4, 0, 0, 0, 1.2*size.x); //main shadow
                grd.addColorStop(0.5, 'rgba(0,0,0,0)');grd.addColorStop(1, 'rgba(0,0,0,1)');
                ctx.fillStyle = grd;
                ctx.fillRect(0,0, size.x, size.y);

                grd =ctx.createRadialGradient(size.x/2, size.y/2, 0.85*size.x/2, size.x/2, size.y/2, size.x/2); // sphere effect
                grd.addColorStop(0, 'rgba(0,0,0,0)');grd.addColorStop(1, 'rgba(0,0,0,0.75)');
                ctx.fillStyle = grd;
                ctx.fillRect(0,0, size.x, size.y);

                ctx.restore();
            }
            

            
        })
    }

    

    createSphere(originTextureImg, originTextureName, originSize, diskSize, rotationSpeed = 0, time = 0){
        if(!this.createSphereCalcCache)
            this.createSphereCalcCache = [];

        if(!this.originTexturesDataCache)
            this.originTexturesDataCache = {};

        let imgPixelsData 
        let imgPixelsDataCacheItem = this.originTexturesDataCache[originTextureName];
        if(imgPixelsDataCacheItem === undefined){
            imgPixelsData = originTextureImg.getContext('2d').getImageData(0,0,originSize.x, originSize.y);
            this.originTexturesDataCache[originTextureName] = imgPixelsData;
        }
        else {
            imgPixelsData = imgPixelsDataCacheItem;
        }
        
        let resultImg = createCanvas(new V2(diskSize,diskSize), (ctx, size) => { ctx.fillStyle = 'rgba(255,255,255,0)';ctx.fillRect(0,0,size.x, size.y); });
        let resultImageData = resultImg.getContext('2d').getImageData(0,0,diskSize, diskSize);
        for(let x = 0; x < diskSize; x++){
            if(this.createSphereCalcCache[x] == undefined)
                this.createSphereCalcCache[x] = [];

            for(let y = 0; y < diskSize; y++){

                //with usage vectors cache
                let px, py;
                let cacheItem = this.createSphereCalcCache[x][y];
                if(cacheItem === undefined){
                    px = x*2/diskSize - 1;
                    py = y*2/diskSize - 1;
    
                    let magSq = px*px + py*py;
    
                    if(magSq > 1){
                        this.createSphereCalcCache[x][y] = null;
                        //this.setPixel(resultImageData, x, y, 255,255,255,0);
                        continue;
                    }
    
                    let widthAtHeight =Math.sqrt(1 - py * py);
                    px = Math.asin(px / widthAtHeight) * 2/Math.PI
                    py = Math.asin(py) * 2/Math.PI

                    this.createSphereCalcCache[x][y] = {px, py};
                }
                else if(cacheItem === null)
                    continue;
                else if(cacheItem){
                    px = cacheItem.px;
                    py = cacheItem.py;
                }
                //without usage vectors cache
/* 
                let px = x*2/diskSize - 1;
                let py = y*2/diskSize - 1;

                let magSq = px*px + py*py;

                if(magSq > 1){
                    //this.setPixel(resultImageData, x, y, 255,255,255,0);
                    continue;
                }

                let widthAtHeight =Math.sqrt(1 - py * py);
                px = Math.asin(px / widthAtHeight) * 2/Math.PI
                py = Math.asin(py) * 2/Math.PI
*/
                let u = fastRoundWithPrecision(rotationSpeed*time+(px+1)*(originSize.y/2),0);
                let v = fastRoundWithPrecision((py + 1)*(originSize.y/2),0);
                u %= (2*originSize.y);

                let colorData = this.getPixel(imgPixelsData, u, v, originSize.x);
                this.setPixel(resultImageData, x, y, colorData[0], colorData[1], colorData[2], colorData[3], diskSize);
            }
        }

        resultImg.getContext('2d').putImageData(resultImageData, 0,0);

        return resultImg;
    }
}