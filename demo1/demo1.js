var grassTileSize = new V2(10,10);
var grassSheetSize = new V2(30,10);
var viewport = new V2(100,100);

class GameScene extends Scene {
    constructor(options = {}) {
        
        options = assignDeep({}, { 
            
        }, options);

        super(options);

        for(let x = 0; x < options.viewport.x/grassTileSize.x; x++) {
            for(let y = 0; y < options.viewport.y/grassTileSize.y; y++) {
                this.addGo(
                    new GrassTile(
                        {
                            position: new V2((x*grassTileSize.x)+grassTileSize.x/2, (y*grassTileSize.y)+grassTileSize.y/2),
                            shaking: {
                                enabled: false
                            }
                        }
                    ), 0
                );
            }
        }

        this.AI = {
            initialize: (level) => { // just helper to init environment
                let bunniesMaxCount = 2;
                if(level == 'medium')
                    bunniesMaxCount = 4;
                else if(level == 'hard')
                    bunniesMaxCount = 6;

                SCG.AI.initializeEnvironment({
                    space: {
                        width: options.viewport.x,
                        height: options.viewport.y
                    },
                    bunnies: {
                        items: [],
                        maxCount: bunniesMaxCount
                    },
                    level: level
                });
            },
            messagesProcesser: function(wm){ // proccess messages from AI
                if(wm == undefined){
                    return;
                }

                if(wm.command){
                    switch(wm.command){
                        case 'log':
                            console.log(wm);
                            break;
                        case 'create':
                            if(!wm.message || !wm.message.position || !wm.message.path)
                                return;
                               
                            var instance = GO.createInstanceByName(wm.message.goType, 
                                { 
                                    position: new V2(wm.message.position),
                                    innerPath: wm.message.path.map((item) => new V2(item))
                                });

                            if(instance)
                                SCG.scenes.activeScene.addGo(instance, 2, true);
                            break;
                        default:
                            break;
                    }	
                }
            },
            queueProcesser: function queueProcesser(){ // queue processer (on AI side)
                while(queue.length){
                    var task = queue.pop();
                    switch(task.type){
                        case 'start':
                            self.getRandom = function getRandom(min, max){
                                return Math.random() * (max - min) + min;
                            };
                            self.checkIsClose = function(p1, p2, delta){
                                return Math.sqrt(Math.pow(p1.x - p2.x,2) + Math.pow(p1.y - p2.y,2)) < delta;
                            };
                            self.createBunny = function(){
                                let pathPointsCount = 9;
                                let pathParts = [3,6,9];
                                let closeDelta = 15;
                                switch(self.environment.level){
                                    case 'medium':
                                        pathPointsCount = 6;
                                        pathParts = [2,4,6];
                                        closeDelta = 25;
                                        break;
                                    case 'hard':
                                        pathPointsCount = 3;
                                        pathParts = [1,2,3];
                                        closeDelta = 35;
                                        break;
                                }
                                let path = [];
                                let topMargin = 20;
                                let topY = self.environment.space.height-topMargin;
                                for(let i = 0; i < pathPointsCount; i++){
                                    let yClamps = [];
                                    if(i < pathParts[0]) {
                                        yClamps = [(2*topY/3)+topMargin, self.environment.space.height - 5 ];
                                    }
                                    else if(i >= pathParts[0] && i < pathParts[1]) {
                                        yClamps = [(topY/3)+topMargin, (2*topY/3)+topMargin];
                                    }
                                    else if(i >= pathParts[1] && i < pathParts[2]) {
                                        yClamps = [topMargin+5, (topY/3)+topMargin];
                                    }

                                    let nextPathPoint = {
                                        x: self.getRandom(5, self.environment.space.width-5), 
                                        y: self.getRandom(yClamps[0]+5, yClamps[1]-5) 
                                    };
                                    let retryCount = 10;
                                    while(--retryCount > 0){
                                        if(!path.length)
                                            break;
                                        
                                        let isNotClose = true;

                                        for(let pi = 0; pi < path.length; pi++){
                                            if(self.checkIsClose(nextPathPoint, path[pi], closeDelta)){
                                                isNotClose = false;
                                                break;
                                            }
                                        }

                                        if(isNotClose)
                                            break;
                                        
                                        nextPathPoint = {
                                            x: self.getRandom(5, self.environment.space.width), 
                                            y: self.getRandom(yClamps[0], yClamps[1]) 
                                        };

                                        if(retryCount == 1){
                                            console.log(`Failed to find available position in 10 retryies; between: ${yClamps[0]} - ${yClamps[1]}; with delta: ${closeDelta.x},${closeDelta.y}`);
                                        }
                                    }

                                    path.push(nextPathPoint);
                                }

                                console.log(path);
                                self.postMessage({command: 'create', message: 
                                    { 
                                        goType: 'BunnyGO', 
                                        position: { 
                                            x: self.getRandom(5, self.environment.space.width), 
                                            y: self.getRandom(self.environment.space.height/2, self.environment.space.height - 5) },
                                        path: path
                                        // [
                                        //     { x: 10, y: (self.environment.space.height/2)+1 }, 
                                        //     { x: self.environment.space.width /2, y: self.environment.space.height - 5 },
                                        //     { x: self.environment.space.width - 5, y: self.environment.space.height/2 }] 
                                    } 
                                });	
                                
                            };
                            self.checkBunnies = function(){
                                //debugger;
                                if(self.environment.bunnies.items.length < self.environment.bunnies.maxCount){
                                    self.createBunny();
                                }
                            };

                            self.checkBunnies();
                            break;
                        case 'created':
                            if(task.message.goType == 'BunnyGO'){
                                self.environment.bunnies.items.push({id: task.message.id, position: task.message.position });
                                self.checkBunnies();
                            }
                            break;
                        case 'removed':
                            if(task.message.goType == 'BunnyGO'){
                                var index = self.environment.bunnies.items.map(function(item) { return item.id ;}).indexOf(task.message.id);
                                if(index > -1){
                                    self.environment.bunnies.items.splice(index, 1);
                                    self.checkBunnies();
                                }
                            }
                            break;
                        default:
                            break;
                    }
                }
                
            }
        }

        this.game = {
            randomShaking: {
                maxCount: 1,
                setShaking() {
                    let count = 0;
                    while(count < this.game.randomShaking.maxCount){
                        let shakingPoint = new V2(getRandomInt(0, this.viewport.x), getRandomInt(0, this.viewport.y));
                        for(let i = 0; i < this.goLayers[0].length; i++){
                            let go = this.goLayers[0][i];
                            
                            if(go.type !== 'GrassTile')
                                continue;

                            if(go.box === undefined)
                            {
                                //debugger;
                                //continue;
                                count++;
                                break;
                            }

                            if(go.box.isPointInside(shakingPoint))
                            {
                                if(go.shaking.enabled){
                                    break;
                                }

                                go.shaking.enabled = true;
                                count++;
                                break;
                            }
                            
                        }
                    }
                }
            },
            __score: 0,
            set score (value){
                this.__score = value;
                SCG.UI.invalidate();
            },
            get score () {
                return this.__score;
            }
        }

        this.game.randomShaking.timer = {
            lastTimeWork: new Date,
            delta : 0,
            currentDelay: 100,
            originDelay: 500,
            doWorkInternal : this.game.randomShaking.setShaking,
            context: this
        }
    }

    start (sceneProperties) {
        this.game.level = sceneProperties.level;
        //console.log(sceneProperties);
        this.AI.initialize(sceneProperties.level);
        this.game.lives = 9;
        this.game.ui = {
            scoreLabel: this.addUIGo(new UILabel(
                { 
                    position: new V2(15,10), 
                    text: {
                        size: 6,
                        color: 'gold'
                    },
                    format: {
                        format: "Score: {0}",
                        argsRetriever: () => { return [this.game.score]; }
                    }
                }))
        };

        // чем сложнее - тем больше зайцев, тем меньше жизней.
        // зайцы быстрее, реже появляются на верху
        // больше ветра на большей сложности (ложной тряски кустов)

        switch(this.game.level){
            case 'easy':
                this.game.lives = 9;
                break;
            case 'medium':
                this.game.lives = 6;
                break;
            case 'hard':
                this.game.lives = 3;
                break;
        }

        let startX = this.viewport.x/2 - this.game.lives*10/2; 
        for(let i = 0; i < this.game.lives;i++){
            this.addGo(new Carrot({position: new V2(startX + i*10,10)}),1)
        }

        SCG.UI.invalidate();
    }

    backgroundRender(){
    }

    preMainWork(now){
        doWorkByTimer(this.game.randomShaking.timer ,now);
    }
}

// -------------------------------------------------------------------------------------------------------------------------------------------------------------
// ----------------- models ------------------------------------------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------------------------------------------------------------------

class DemoGO extends GO {
    constructor(options = {}) {
        options = assignDeep({}, {
            imgPropertyName: 'tree_sprite_sheet',
            size: new V2(20,20),
            destSourceSize: new V2(45,45),
            destSourcePosition: new V2
        }, options);

        super(options);
    }
}

class Carrot extends GO {
    constructor(options = {}) {
        options = assignDeep({}, {
            imgPropertyName: 'carrot',
            size: new V2(10,10),
            destSourcePosition: new V2,
            eaten: {
                eaten: false,
                minYShift: -10,
                currentYShift: 0
            }
        }, options);
        
        super(options);

        this.eaten.timer = {
            lastTimeWork: new Date,
            delta : 0,
            currentDelay: 100,
            originDelay: 100,
            context: this,
            doWorkInternal : () => { 
                if(this.eaten.currentYShift <= this.eaten.minYShift){
                    this.eaten.eaten = false;
                    this.setDead();
                } 

                this.eaten.currentYShift-=0.5;
                this.destSourcePosition.y = this.eaten.currentYShift;
            }
        }
    }

    beforeDead(){
        // lives--
    }

    internalPreUpdate(now){
        if(this.eaten.eaten)
            doWorkByTimer(this.eaten.timer, now);
    }
}

class Star extends MovingGO {
    constructor(options = {}) {
        options = assignDeep({}, {
            setDeadOnDestinationComplete: true,
            imgPropertyName: 'star_sheet',
            destSourcePosition: new V2,
            size: new V2(10,10),
            finalSize: new V2(3,3),
            isAnimated: true,
            speed: 1,
            animation: {
                totalFrameCount: 4,
                framesInRow: 4,
                framesRowsCount: 1,
                frameChangeDelay: 75,
                destinationFrameSize: new Vector2(10,10),
                sourceFrameSize: new Vector2(10,10),
                loop: true
            }
        }, options);
        
        super(options);
    }

    beforePositionChange(now){
        if(this.distanceToDestination === undefined)
            this.distanceToDestination = this.position.distance(this.destination);

        let currentDistance = this.position.distance(this.destination);
        let share = currentDistance/this.distanceToDestination;

        this.customScale.x = ((this.size.x - this.finalSize.x)*share + this.finalSize.x)/this.size.x;
        this.customScale.y = ((this.size.y - this.finalSize.y)*share + this.finalSize.y)/this.size.y;
    }

    beforeDead() {
        SCG.scenes.activeScene.game.score++;
    }
}

class GrassTile extends GO {
    constructor(options = {}) {
        options = assignDeep({}, {
            imgPropertyName: 'grass_sheet',
            destSourcePosition: new V2((getRandomInt(0,(grassSheetSize.x/grassTileSize.x)-1))*grassTileSize.x,0),//new V2(getRandomInt(0,20), getRandomInt(0,10)),
            destSourceSize: grassTileSize.clone(),
            size: grassTileSize.clone(),
            handlers: {
                click: () => {
                    this.shaking.enabled = true;
                    return {
                        preventDiving: true
                    }
                }
            },
            // contextName: 'background',
            shaking: {
                enabled: false,
                step: 0,
                maxStep: 7
            }
        }, options);

        super(options);

        this.shaking.timer = {
            lastTimeWork: new Date,
            delta : 0,
            currentDelay: 200,
            originDelay: 200,
            doWorkInternal: () => {
                let sh = this.shaking;
                sh.step++;
                if(sh.step > sh.maxStep)
                    {
                        sh.enabled = false;
                        sh.step = 0;
                        sh.timer.originDelay = 200;
                        sh.timer.currentDelay = 200;
                    }

                switch(sh.step){
                    case 0:
                    case 2:
                    case 6:
                    default:
                        this.destSourcePosition.y = 0;
                        break;
                    case 1: 
                    case 5: 
                        this.destSourcePosition.y = 10;
                        break;
                    case 3: 
                    case 7: 
                        this.destSourcePosition.y = 20;
                        break;
                    case 4: 
                        this.destSourcePosition.y = 0;  
                        sh.timer.originDelay = 400;
                        sh.timer.currentDelay = 400;
                        break;
                }

            },
            content: this
        };
    }

    internalPreUpdate(now){
        if(this.shaking.enabled)
            doWorkByTimer(this.shaking.timer, now);
    }

    internalUpdate(now) {
        //this.renderPosition = new V2(Math.round(this.renderPosition.x), Math.round(this.renderPosition.y));
    }
}

class BunnyGO extends MovingGO {
    constructor(options = {}) {
        options = assignDeep({}, {
            imgPropertyName: 'bunny_sheet',
            isAnimated: true,
            destSourcePosition: new V2,
            innerPath: [],
            catched: false,
            uncatchable: false,
            targetedToCarrot: false,
            getCarrot: function(){
                let carrotIndexes = [];
                for(let i = 0;i<SCG.scenes.activeScene.goLayers[1].length;i++){
                    if(SCG.scenes.activeScene.goLayers[1][i] instanceof Carrot && !SCG.scenes.activeScene.goLayers[1][i].eaten.eaten){
                        carrotIndexes.push(i);
                    }
                }

                if(!carrotIndexes.length)
                    return undefined;

                return SCG.scenes.activeScene.goLayers[1][getRandomInt(0, carrotIndexes.length-1)];
            },
            handlers: {
                click: () => {
                    if(this.catched || this.uncatchable)
                        return;

                    this.isAnimated = false;
                    this.catched = true;
                    this.destSourcePosition = new V2(14*this.size.x,0);
                    this.catchedTimer.lastTimeWork = new Date; 
                    this.setDestination();

                    return {
                        preventDiving: true
                    }
                }
            },
            animation: {
                totalFrameCount: 14,
                framesInRow: 14,
                framesRowsCount: 1,
                frameChangeDelay: 100,
                destinationFrameSize: new Vector2(10,10),
                sourceFrameSize: new Vector2(10,10),
                loop: false,
                animationEndCallback: () => {
                    if(this.innerPath.length > 0)
                    {
                        this.isAnimated = false;
                        this.setDestination(this.innerPath.shift());
                    }
                    else{
                        if(this.targetedToCarrot){
                            this.setDead();
                            if(this.targetedToCarrot.eaten.eaten){
                                this.targetedToCarrot = this.getCarrot();
                            }

                            this.targetedToCarrot.eaten.eaten = true;
                        }
                        else {
                            this.isAnimated = false;
                            this.targetedToCarrot = this.getCarrot();

                            if(this.targetedToCarrot===undefined)
                                this.setDead();
                            else 
                                this.setDestination(this.targetedToCarrot.position.clone());
                        }
                    }
                }
            },
            size: new V2(10,10),
            speed: 0.5,
        }, options);

        super(options);

        this.catchedTimer = {
            lastTimeWork: new Date,
            delta : 0,
            currentDelay: 1000,
            originDelay: 1000,
            doWorkInternal : () => { 
                this.setDead();
                let star = new Star({
                    position: this.position.clone()
                });
                star.setDestination(new V2(25,10));
                SCG.scenes.activeScene.addGo(star, 2, false);

            },
            context: this};

        this.isAnimated = false;
        if(this.innerPath.length > 0)
            this.setDestination(this.innerPath.shift());
    }

    destinationCompleteCallBack() {
        if(!this.catched) {
            this.animation.currentFrame = 0;
            this.isAnimated = true;

            if(this.targetedToCarrot)
                this.uncatchable = true;
        }
    }

    positionChangedCallback() {
        let as = SCG.scenes.activeScene;
        for(let goi = 0; goi< as.goLayers[0].length;goi++){
            let _go = as.goLayers[0][goi];
            if(_go.type !== 'GrassTile')
                continue;

            if(!_go.shaking.enabled && _go.box.isPointInside(this.position))
            {
                _go.shaking.enabled = true;
                break;
            }    
        }
    }

    beforePositionChange(now) {
        if(this.catched) {
            doWorkByTimer(this.catchedTimer, now)
        }
    }
}

document.addEventListener("DOMContentLoaded", function() {

    SCG.globals.version = 0.2;

    SCG.src = {
        tree_sprite_sheet: 'content/tree1.png',
        grass_sheet: 'content/grass_sheet.png',
        bunny_sheet: 'content/bunny_sheet.png',
        star_sheet: 'content/star_sheet.png',
        splash_screen: 'content/splash_screen.png',
        splash_screen_title: 'content/splash_screen_title.png',
        splash_screen_start_button: 'content/splash_screen_start_button.png',
        carrot: 'content/carrot.png'
	}

    debugger;
    // SCG.scenes.selectScene(new DemoScene( 
    //     { 
    //         viewport: viewport.clone(),
    //         name: 'demo_s1'
    //     }));

    SCG.scenes.cacheScene(new IntroScene({
        name:'intro',
        viewport: new V2(500,300)
    }));
    SCG.scenes.selectScene('intro');
    
    SCG.main.start();
});