class Demo9Exp3Scene extends Scene {
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
        this.playerGo = this.addGo(new Demo9Exp3Scene.PlayerGO({
            position: this.sceneCenter.clone(),
        }), 20);

        this.addGo(new GO({
            position: this.sceneCenter,
            size: this.viewport,
            init() {
                this.points = [];
                this.pgCount = 1;

                this.timer = this.regTimerDefault(30, () => {
                    this.points.push(...this.pointGenerator());
                    this.updatePoints();
                })
            },
            pointGenerator() {
                let result = [];

                for(let i = 0; i < this.pgCount; i++){
                    let isLeft = getRandomBool();
                    let positionX =  isLeft ? 0 : this.size.y;
                    let p = {
                        currentX: positionX,
                        currentY: getRandomInt(0, this.size.y),
                        color: 'white',
                        xChanges: [ easing.createProps(40, positionX, this.size.x/2, 'quad', 'out'), easing.createProps(10, this.size.x/2, positionX, 'quad', 'in') ],
                        alive: true
                    }

                    result.push(p);
                }

                return result;
            },
            updatePoints() {

                for(let i = 0; i < this.points.length; i++){
                    let point = this.points[i];

                    if(point.xChange == undefined && point.xChanges.length == 0){
                        point.alive =false;
                        continue;
                    }

                    if(!point.xChange){
                        point.xChange = point.xChanges.shift();
                    }

                    easing.commonProcess({context: point, targetpropertyName: 'currentX', propsName: 'xChange', round: true, removePropsOnComplete: true});

                }

                this.points = this.points.filter(p => p.alive);

                this.createImage();
            },
            createImage() {
                this.img = createCanvas(this.size, (ctx, size, hlp) => {
                    for(let i = 0; i < this.points.length; i++){
                        let point = this.points[i];
                        
                        hlp.setFillColor(point.color).dot(point.currentX, point.currentY);
                    }
                })
            }
        }), 1)
    }

}

Demo9Exp3Scene.PlayerGO = class extends GO {
    constructor(options = {}) {
        options = assignDeep({}, {
            size: new V2(20,30)
        }, options)

        super(options);
    }

    init() {
        this.staticImg = PP.createImage(Demo9Exp3Scene.models.mainCraft)
        this.img = this.staticImg;
    }
}