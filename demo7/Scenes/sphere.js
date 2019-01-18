class SphereScene extends Scene {
    constructor(options = {}){
        options = assignDeep({}, {

        }, options)

        super(options);

        this.textureSize = new V2(800, 400);
        // this.texture = createCanvas(this.textureSize, (ctx, size) => {
        //     ctx.fillStyle = 'gray';
        //     ctx.fillRect(0,0, size.x, size.y);
        //     ctx.fillStyle = 'white';
        //     ctx.font = '12px Arial';
        //     ctx.textAlign = 'center';

        //     ctx.fillText('!!!!hello!!!!!hello world!!!', size.x/2, size.y/3);
        //     ctx.fillText('???how????how are you???', size.x/2, size.y*2/3);
        // });

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

        this.addGo(new GO({
            size: new V2(200, 100),
            position: this.sceneCenter.add(new V2(0, 50)),
            img: this.texture
        }));

        this.diskSize = 200;
        this.time = 0;
        this.speed =1;
        this.cloudsSpeed = -0.5
        this.sphereImg = this.createPlanetTexure(this.texture, this.textureSize, this.diskSize, this.speed);
        this.cloudsSphereImg = this.createPlanetTexure(this.cloudsTexture, this.textureSize, this.diskSize, this.cloudsSpeed);
        
        this.sphere = this.addGo(new GO({
            size: new V2(50, 50),
            position: this.sceneCenter.add(new V2(0, -75)),
            img: this.sphereImg
        }), 1);

        this.cloudsSphere = this.addGo(new GO({
            size: new V2(50, 50),
            position: this.sceneCenter.add(new V2(0, -75)),
            img: this.cloudsSphereImg 
        }),2);

        this.rotationTimer = createTimer(50, () => {
            this.sphereImg = this.createPlanetTexure(this.texture, this.textureSize, this.diskSize, this.speed);
            this.sphere.img = this.sphereImg;

            this.cloudsSphereImg = this.createPlanetTexure(this.cloudsTexture, this.textureSize, this.diskSize, this.cloudsSpeed)
            this.cloudsSphere.img = this.cloudsSphereImg;

            this.time++;
        }, this, false);
    }

    afterMainWork(now){
        if(this.rotationTimer)
            doWorkByTimer(this.rotationTimer, now);
    }

    backgroundRender(){
        SCG.contexts.background.fillStyle = 'black';
        SCG.contexts.background.fillRect(0,0,SCG.viewport.real.width,SCG.viewport.real.height);
    }

    setPixel(imageData, x, y, r, g, b, a) {
        let index = (x + y * imageData.width) * 4;
        imageData.data[index+0] = r;
        imageData.data[index+1] = g;
        imageData.data[index+2] = b;
        imageData.data[index+3] = a;
    }

    getPixel(imageData, x, y){
        let index = (x + y * imageData.width) * 4;
        return [imageData.data[index], imageData.data[index+1], imageData.data[index+2], imageData.data[index+3]];
    }

    createPlanetTexure(baseTexture, baseTextureSize, diskSize, speed) {
        return createCanvas(new V2(this.diskSize,this.diskSize), (ctx, size) => {
            let sphereImg = this.createSphere(baseTexture, baseTextureSize, diskSize, speed,this.time);
            ctx.drawImage(sphereImg, 0,0, size.x, size.y);
            
            ctx.save();
            ctx.arc(size.x/2,size.x/2, size.x/2 + 1, 0, Math.PI*2, false );
            ctx.clip();
            
            let grd =ctx.createRadialGradient(size.x/4, size.x/4, 0, 0, 0, 1.2*size.x); //main shadow
            grd.addColorStop(0.5, 'rgba(0,0,0,0)');grd.addColorStop(1, 'rgba(0,0,0,1)');
            ctx.fillStyle = grd;
            ctx.fillRect(0,0, size.x, size.y);

            grd =ctx.createRadialGradient(size.x/2, size.y/2, 0.85*size.x/2, size.x/2, size.y/2, size.x/2); // sphere effect
            grd.addColorStop(0, 'rgba(0,0,0,0)');grd.addColorStop(1, 'rgba(0,0,0,1)');
            ctx.fillStyle = grd;
            ctx.fillRect(0,0, size.x, size.y);

            ctx.restore();
        })
    }

    createSphere(originTextureImg, originSize, diskSize, rotationSpeed = 0, time = 0){
        let imgPixelsData = originTextureImg.getContext('2d').getImageData(0,0,originSize.x, originSize.y);
        let resultImg = createCanvas(new V2(diskSize,diskSize), (ctx, size) => { ctx.fillStyle = 'rgba(255,255,255,0)';ctx.fillRect(0,0,size.x, size.y); });
        let resultImageData = resultImg.getContext('2d').getImageData(0,0,diskSize, diskSize);
        for(let x = 0; x < diskSize; x++){
            for(let y = 0; y < diskSize; y++){
                let px = x*2/diskSize - 1;
                let py = y*2/diskSize - 1;

                let magSq = px*px + py*py;

                if(magSq > 1){
                    this.setPixel(resultImageData, x, y, 255,255,255,0);
                    continue;
                }

                let widthAtHeight =Math.sqrt(1 - py * py);
                px = Math.asin(px / widthAtHeight) * 2/Math.PI
                py = Math.asin(py) * 2/Math.PI

                let u = fastRoundWithPrecision(rotationSpeed*time+(px+1)*(originSize.y/2),0);
                let v = fastRoundWithPrecision((py + 1)*(originSize.y/2),0);
                u %= (2*originSize.y);

                let colorData = this.getPixel(imgPixelsData, u, v);
                this.setPixel(resultImageData, x, y, colorData[0], colorData[1], colorData[2], colorData[3]);
            }
        }

        resultImg.getContext('2d').putImageData(resultImageData, 0,0);

        return resultImg;
    }
}