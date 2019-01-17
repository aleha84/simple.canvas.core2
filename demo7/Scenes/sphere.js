class SphereScene extends Scene {
    constructor(options = {}){
        options = assignDeep({}, {

        }, options)

        super(options);

        this.textureSize = new V2(100, 50).mul(2);
        this.texture = createCanvas(this.textureSize, (ctx, size) => {
            ctx.fillStyle = 'gray';
            ctx.fillRect(0,0, size.x, size.y);
            ctx.fillStyle = 'white';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';

            ctx.fillText('!!!!hello!!!!!hello world!!!', size.x/2, size.y/3);
            ctx.fillText('???how????how are you???', size.x/2, size.y*2/3);
        });

        this.addGo(new GO({
            size: new V2(100, 50),
            position: this.sceneCenter,
            img: this.texture
        }));

        this.diskSize = 50;
        this.time = 0;
        this.speed = 1;
        this.sphereImg = this.createSphere(this.texture, this.textureSize, this.diskSize*2, this.speed,this.time);
        
        this.sphere = this.addGo(new GO({
            size: new V2(50, 50),
            position: this.sceneCenter.add(new V2(0, -75)),
            img: this.sphereImg
        }));

        this.rotationTimer = createTimer(50, () => {
            this.sphereImg = this.createSphere(this.texture, this.textureSize, this.diskSize*2, this.speed,this.time);
            this.sphere.img = this.sphereImg;
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
                u %= (2*originSize.y*2);

                let colorData = this.getPixel(imgPixelsData, u, v);
                this.setPixel(resultImageData, x, y, colorData[0], colorData[1], colorData[2], colorData[3]);
            }
        }

        resultImg.getContext('2d').putImageData(resultImageData, 0,0);

        return resultImg;
    }
}