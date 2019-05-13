class PixelForestScene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            debug: {
                enabled: true,
                
            }
        }, options)

        super(options);
    }

    start() {
        this.defaultTreeSize = new V2(12, 28);
        this.colorsHSV = [
            [32,81,86], 
            [31,92,57],
            [109,39,90],
            [109, 83, 81],
            [109, 89, 52],
            [109, 89, 52]
        ]

        this.vChangeMax = -40;
        
        // this.demoTree1 = this.addGo(new Tree({
        //     size: this.defaultTreeSize.clone(),
        //     position: new V2(this.sceneCenter.x - this.viewport.x/4, this.sceneCenter.y),
        //     img: this.treeImgGenerator({size: this.defaultTreeSize})
        // }));

        let yClamps = [this.viewport.y/2.2, this.viewport.y/2];
        for(let i = 0; i < 100; i++){
            let y = getRandomInt(yClamps[0], yClamps[1]);
            let layer = yClamps[1] - y;
            let value = layer/(yClamps[1] - yClamps[0]);

            this.addGo(new Tree({
                size: this.defaultTreeSize,//.mul(0.25 + 0.75*y/yClamps[1]),
                position: new V2(getRandomInt(0, this.viewport.x), y),
                images: this.treeImgGenerator(value)
            }), y);

        }

        // this.demoTree2 = this.addGo(new Tree({
        //     size: this.defaultTreeSize,//.mul(1.5),
        //     position: this.sceneCenter,
        //     images: this.treeImgGenerator()
        // }));

        // this.demoTree3 = this.addGo(new Tree({
        //     size: this.defaultTreeSize.mul(2),
        //     position: new V2(this.sceneCenter.x + this.viewport.x/4, this.sceneCenter.y),
        //     img: this.treeImgGenerator({size: this.defaultTreeSize.mul(2)})
        // }));

        // this.demoTree1 = this.addGo(new Tree({
        //     size: this.defaultTreeSize.clone(),
        //     position: new V2(this.sceneCenter.x, this.sceneCenter.y),
        //     img: PP.createImage(forestImages.treeTemplate())
        // }));

        // for(let i = 0; i < 20; i++){
        //     this.addGo(new Tree({
        //         size: this.defaultTreeSize.clone(),
        //         position: new V2(this.defaultTreeSize.x*i, this.sceneCenter.y),
        //         img: this.treeImgGenerator()//PP.createImage(forestImages.treeTemplate())
        //     }));
        // }
    }

    backgroundRender() {
        this.backgroundRenderDefault('#27C5DD');
    }

    treeImgGenerator(value){
        let template = forestImages.treeTemplate();

        for(let i = 0; i < template.main.layers.length;i++){
            template.main.layers[i].strokeColor = hsvToHex({hsv:[this.colorsHSV[i][0], this.colorsHSV[i][1], this.colorsHSV[i][2] + fastRoundWithPrecision(this.vChangeMax*value) ]})
            template.main.layers[i].fillColor = template.main.layers[i].strokeColor;
        }
        
        let l0p = template.main.layers[0].points;
        let l1p = template.main.layers[1].points;
        let l2p = template.main.layers[2].points;
        let l3p = template.main.layers[3].points;
        let l4p = template.main.layers[4].points;
        let l5p = template.main.layers[5].points;

        if(getRandomBool()){ // shift lower
            l2p[0].point.y++;
            l2p[23].point.y++;

            l3p[0].point.y++;
            l3p[27].point.y++;

            l4p[0].point.y++; l4p[2].point.y++; l4p[3].point.y++; l4p[5].point.y++; l4p[7].point.y++; l4p[8].point.y++;l4p[9].point.y++;

        }

        // if(getRandomBool()){
        //     let shift = getRandomInt(-2,-1);
        //     l0p[0].point.y+=shift;
        //     l0p[3].point.y+=shift;
        //     l1p[0].point.y+=shift;
        // }

        if(getRandomBool()){
            l2p[2].point.y++;
        }

        if(getRandomBool()){
            l2p[4].point.y++;
        }

        if(getRandomBool()){
            l2p[6].point.y++;
        }

        if(getRandomBool()){
            l2p[8].point.y++;
        }

        if(getRandomBool()){
            l2p[10].point.y++;
        }

        if(getRandomBool()){
            l2p[11].point.x--;
        }

        if(getRandomBool()){
            l2p[13].point.y++;
        }

        if(getRandomBool()){
            l2p[15].point.y++;
        }

        if(getRandomBool()){
            l2p[19].point.y++;
            l3p[23].point.y++;
        }

        if(getRandomBool()){
            l2p[19].point.y++;
            l3p[23].point.y++;
        }

        if(getRandomBool()){
            l2p[21].point.y++;
            l3p[25].point.y++;
            l4p[12].point.y++;
        }

        if(getRandomBool()){
            l3p[3].point.y+=getRandomInt(-1,1);
            l3p[3].point.x+=getRandomInt(-1,1);
        }

        if(getRandomBool()){
            l3p[5].point.y+=getRandomInt(-1,1);
            l3p[5].point.x+=getRandomInt(-1,1);
        }

        if(getRandomBool()){
            l3p[7].point.y+=getRandomInt(-1,1);
            l3p[7].point.x+=getRandomInt(-1,1);
        }

        if(getRandomBool()){
            l3p[12].point.y+=getRandomInt(-1,1);
            l3p[12].point.x+=getRandomInt(-1,1);
        }

        if(getRandomBool()){
            l3p[16].point.y+=getRandomInt(-1,1);
            l3p[16].point.x+=getRandomInt(-1,1);
        }

        if(getRandomBool()){
            l3p[19].point.y+=getRandomInt(-1,1);
            l3p[19].point.x+=getRandomInt(-1,1);
        }

        if(getRandomBool()){
            l4p[1].point.y+=getRandomInt(-1,1);
            l4p[1].point.x+=getRandomInt(-1,1);
        }

        if(getRandomBool()){
            l4p[4].point.y+=getRandomInt(-1,1);
            l4p[4].point.x+=getRandomInt(-1,1);
        }

        if(getRandomBool()){
            l4p[6].point.y+=getRandomInt(-1,1);
            l4p[4].point.x+=getRandomInt(-1,1);
        }

        if(getRandomBool()){
            l4p[10].point.y+=getRandomInt(-1,1);
            l4p[10].point.x+=getRandomInt(-1,1);
        }

        if(getRandomBool()){
            l4p[16].point.y+=getRandomInt(-1,1);
            l4p[16].point.x+=getRandomInt(-1,1);
        }

        if(getRandomBool()){
            l4p[17].point.y+=getRandomInt(-1,1);
            l4p[17].point.x+=getRandomInt(-1,1);
        }

        if(getRandomBool()){
            l4p[18].point.y+=getRandomInt(-1,1);
            l4p[18].point.x+=getRandomInt(-1,1);
        }

        if(getRandomBool()){
            l4p[21].point.y+=getRandomInt(-1,1);
            l4p[21].point.x+=getRandomInt(-1,1);
        }

        if(getRandomBool()){
            l4p[22].point.y+=getRandomInt(-1,1);
            l4p[22].point.x+=getRandomInt(-1,1);
        }

        if(getRandomBool()){
            l5p[0].point.y+=getRandomInt(-1,1);
            l5p[0].point.x+=getRandomInt(-1,1);
        }

        if(getRandomBool()){
            l5p[2].point.x+=getRandomInt(-1,1);
        }

        let result = [PP.createImage(template)];

        //frame1
        for(let i = 9; i <=15;i++)
            l2p[i].point.x--;

        l2p[10].point.y++;
        l2p[17].point.x--;
        
        l3p[8].point.x--;
        l3p[11].point.x--;
        l3p[17].point.x--;
        l3p[19].point.x--;
        l3p[20].point.x--;

        l4p[16].point.x--;
        l4p[22].point.x--;

        l5p[0].point.x--;
        l5p[5].point.x--;
        l5p[6].point.x--;
        
        let frame1 = PP.createImage(template);
        result[1] = frame1;
        result[2] = frame1;

        // // frame2
        // for(let i = 7; i <=11;i++)
        //     l2p[i].point.x--;

        //result[2] = PP.createImage(template);

        return result;
    }
}

class Tree extends GO {
    constructor(options = {}) {
        options = assignDeep({}, {
            size: new V2(12, 28),
            renderValuesRound: true
        }, options)

        super(options);
    }

    init() {
        this.imgIndex = 0;
        this.img = this.images[this.imgIndex];

        this.startDelayTimer = this.registerTimer(createTimer(getRandomInt(0, 2000), () => {
            this.unregTimer(this.startDelayTimer);

            this.registerTimer(createTimer(getRandomInt(1000, 2000), () => {
                this.imgIndex++;
                if(this.imgIndex >= this.images.length)
                    this.imgIndex = 0;
    
                this.img = this.images[this.imgIndex];
            }, this, true));

        }, this, true))
    }
}

