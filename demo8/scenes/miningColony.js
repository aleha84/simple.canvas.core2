class MiningColonyScene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            debug: {
                enabled: false,
                
            },
            asteroidBaseColor: '#484151'
        }, options)

        super(options);
    }

    start() {
        this.layeredStars = []
        this.layersCount = 5;
        this.itemsCountPerLayer = 3;

        this.stars = this.addGo(new Stars({
            size: this.viewport.clone(),
            position: this.sceneCenter.clone()
        }), 0)

        let defaultAsteroidProps = {
        
        }

        

        let asteroidsProps = [
            {asteroids: []}, // 0
            {
                default: {
                    noise: {
                        min: -5, max: 0
                    },
                    baseColor: colors.changeHSV({initialValue: this.asteroidBaseColor, parameter: 'v', amount: -10}),
                },
                asteroids: [
                    { position: new V2(325, this.sceneCenter.y), size: new V2(25 + getRandomInt(-2,2), 30 + getRandomInt(-2,2)), vDelta: -15 }
                ]}, // 1
            {asteroids: []}, // 2
            {
                default: {
                    noise: {
                        min: -10, max: -5
                    },
                    baseColor: this.asteroidBaseColor,
                    vDelta: -20
                },
                asteroids: [
                    { position: new V2(300, this.sceneCenter.y + getRandomInt(-2,2)), size: new V2(20 + getRandomInt(-2,2), 30 + getRandomInt(-2,2)) },
                    { position: new V2(350, this.sceneCenter.y + getRandomInt(-2,2)), size: new V2(20 + getRandomInt(-2,2), 30 + getRandomInt(-2,2)) },
                    { position: new V2(425, this.sceneCenter.y + getRandomInt(-2,2)), size: new V2(20 + getRandomInt(-2,2), 35 + getRandomInt(-2,2)) }
                ]
            }
        ]

        for(let l = 0; l < asteroidsProps.length; l++){
            for(let i = 0; i < asteroidsProps[l].asteroids.length; i++){
                this.addGo(new AsteroidModel(
                    assignDeep({}, defaultAsteroidProps, asteroidsProps[l].default, asteroidsProps[l].asteroids[i])
                ), l);
            }
            
        }

        // this.test = this.addGo(new AsteroidModel({
        //         position:this.sceneCenter.clone(),
        //         size: new V2(20,30),
        //         noise: {
        //             min: -15, max: -5
        //         }
        //     }), 10);

        // for(let i = 0; i < 10; i++){
        //     this.test = this.addGo(new AsteroidModel({
        //         position: new V2(300 + getRandomInt(-100, 100), this.sceneCenter.y + getRandomInt(-5,5))
        //     }), 10);
        // }
        
    }

    backgroundRender() {
        let size = SCG.viewport.real.size;
        SCG.contexts.background.fillStyle = 'black';
        SCG.contexts.background.fillRect(0,0, size.x, size.x);
        
        let grd = SCG.contexts.background.createLinearGradient(size.x/2,0, size.x/2, size.y);
        grd.addColorStop(0, 'rgba(255,255,255,0)');grd.addColorStop(0.2, 'rgba(255,255,255,0)');grd.addColorStop(0.35, 'rgba(255,255,255,0.005)');
        grd.addColorStop(0.5, 'rgba(255,255,255,0.04)');
        grd.addColorStop(0.65, 'rgba(255,255,255,0.005)');grd.addColorStop(0.8, 'rgba(255,255,255,0)');grd.addColorStop(1, 'rgba(255,255,255,0)');

        SCG.contexts.background.fillStyle = grd;
        SCG.contexts.background.fillRect(0,0, size.x, size.x);

        //SCG.contexts.background.drawImage(this.bgImage, 0,0, SCG.viewport.real.width, SCG.viewport.real.height)
    }
}

class Stars extends MovingGO {
    constructor(options = {}){
        options = assignDeep({}, {
            starsColor: [255,255,255],
            vClamps: [0.1, 0.8],
            startCountClamps: [200, 4000],
            renderValuesRound: true,
            itemsCountPerLayer: 1,
            layersCount: 5,
            layeredStars: []
        }, options);

        options.destination = new V2(options.position.x, options.position.y - options.size.y/2)

        super(options);
    }

    init() {
        for(let layer = 0; layer < this.layersCount; layer++){
            this.layeredStars[layer] = [];
            for(let i = 0;i<this.itemsCountPerLayer;i++){
                this.layeredStars[layer][i] = [
                    this.addChild(new MovingGO({
                        size: this.size,
                        position: new V2().add(new V2(0,this.size.y*i)),
                        img: this.starsLayerGeneratr(layer, this.layersCount-1),
                        // setDestinationOnInit: true,
                        // destination: new V2().add(new V2(0, -this.size.y)),
                        // speed: 0.1 + (0.01*layer),
                        renderValuesRound: true,
                        // destinationCompleteCallBack: function(){
                        //     this.position = new V2().add(new V2(0, this.size.y*(this.parent.itemsCountPerLayer-1)));
                        //     this.setDestination( new V2().add(new V2(0, -this.size.y)))
                        // }
                    }), layer),
                    
                ]
            }
        }
    }

    starsLayerGeneratr(layer, layersMax) {
        let that = this;
        return createCanvas(this.size, (ctx, size)=> {
            let sc = that.starsColor;
            let hsv = rgbToHsv(sc[0], sc[1], sc[2]);
            hsv.v = this.vClamps[0] + (this.vClamps[1]-this.vClamps[0])*(layer/layersMax);
            ctx.fillStyle = '#' + rgbToHex( hsvToRgb(hsv.h, hsv.s, hsv.v, true));
            let count =  fastRoundWithPrecision(this.startCountClamps[1] - (this.startCountClamps[1] - this.startCountClamps[0])*(layer/layersMax));
            for(let i = 0; i < count; i++){
                ctx.fillRect(getRandomInt(0, size.x), fastRoundWithPrecision(getRandomGaussian(-size.y*0.25, 1.25*size.y)), 1, 1)
            }
        })
    }
}