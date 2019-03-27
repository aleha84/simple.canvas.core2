class DistantFlyer extends GO {
    constructor(options = {}){
        options = assignDeep({}, {
            size: new V2(1,1),
            renderValuesRound: true,
            baseColor: '#CCA394'
        }, options)

        super(options);

        if(this.inverted)
            this.script.items = [
                function(){
                    let goRight = { time: 0, duration: getRandomInt(50,70), change: getRandomInt(430,470), type: 'cubic', method: 'out', startValue: this.position.x };
                    let currentSizeX = 1;
                    this.scriptTimer = this.createScriptTimer(
                        function() { 
                            let next = easing.process(goRight);
                            let delta = next - this.position.x;
                            if(delta < 1)
                                delta = 1;

                            this.position.x = next;
                            this.size.x = delta > 1 ? fastRoundWithPrecision(delta*2) : delta;
                            if(currentSizeX != this.size.x){
                                currentSizeX = this.size.x;
                                console.log(delta, currentSizeX);
                                this.regenImg();
                            }
                            goRight.time++; },
                        function() {return goRight.time > goRight.duration; }, true, 30)
                },function(){
                    //debugger;
                    this.scriptTimer = this.createScriptTimer(
                        function() {  },
                        function() {return true }, true, getRandomInt(300, 700))
                }, function(){
                    let fall = { time: 0, duration: getRandomInt(120, 160), change: 250 - this.position.y, type: 'quad', method: 'in', startValue: this.position.y };
                    this.size.x = 1;
                    this.regenImg();
                    this.scriptTimer = this.createScriptTimer(
                        function() { this.position.y = easing.process(fall); fall.time++; },
                        function() {return fall.time > fall.duration; })
                }, function() {
                    this.setDead();
                }
            ]
        else 
            this.script.items = [
                function(){
                    this.img = createCanvas(new V2(1,1), (ctx) => { ctx.fillStyle = '#CCA394', ctx.fillRect(0,0,1,1)});
                    let rise = { time: 0, duration: getRandomInt(120, 160), change: -getRandomInt(20,40), type: 'quad', method: 'out', startValue: this.position.y };
                    this.scriptTimer = this.createScriptTimer(
                        function() { this.position.y = easing.process(rise); rise.time++; },
                        function() {return rise.time > rise.duration; })
                },
                function(){
                    this.scriptTimer = this.createScriptTimer(
                        function() {  },
                        function() {return true }, true, getRandomInt(300, 700))
                },
                function(){
                    let goLeft = { time: 0, duration: getRandomInt(30,50), change: -500, type: 'cubic', method: 'in', startValue: this.position.x };
                    let currentSizeX = 1;
                    this.scriptTimer = this.createScriptTimer(
                        function() { 
                            let next = fastRoundWithPrecision(easing.process(goLeft));
                            let delta = this.position.x - next;
                            if(delta == 0)
                                delta = 1;

                            this.position.x = next;
                            this.size.x = fastRoundWithPrecision(delta*2);
                            if(currentSizeX != this.size.x){
                                currentSizeX = this.size.x;
                                this.regenImg();
                            }
                            goLeft.time++; },
                        function() {return goLeft.time > goLeft.duration; }, true, 30)
                }, function() {
                    this.setDead();
                }
            ];

    }

    regenImg(){
        let currentSizeX = this.size.x;
        this.img = createCanvas(new V2(currentSizeX,1), (ctx) => { 
            let rgb = hexToRgb(this.baseColor, true);
            // if(currentSizeX == 40)
            //     debugger;

            for(let i = 0; i < currentSizeX;i++){
                let opacity = this.inverted ? (i+1)/currentSizeX : 1 - (i/currentSizeX);
                ctx.fillStyle = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${opacity})`;
                ctx.fillRect(i,0,1,1);
            }
        });
    }

    init() {
        this.processScript();
    }
}