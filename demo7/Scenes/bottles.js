class BottlesScene extends Scene {
    constructor(options = {}){
        options = assignDeep({}, {}, options);

        super(options);
    }

    start() {
        this.bottleImg = createCanvas(new V2(10, 25), (ctx, size) => {
            
        })
    }
}