var grassTileSize = new V2(10,10);
var grassSheetSize = new V2(30,10);
var viewport = new V2(100,100);

class DemoScene extends Scene {
    constructor(options = {}) {
        
        options = assignDeep({}, { 
            start: () => {
                this.AI.initialize();
            }
        }, options);

        if(options.go === undefined)
            options.go = [];

        for(let x = 0; x < options.viewport.x/grassTileSize.x; x++) {
            for(let y = 0; y < options.viewport.y/grassTileSize.y; y++) {
                options.go.push(
                    new GrassTile(
                        {
                            position: new V2((x*grassTileSize.x)+grassTileSize.x/2, (y*grassTileSize.y)+grassTileSize.y/2),
                            shaking: {
                                enabled: false
                            }
                        }
                    )
                );
            }
        }

        super(options);

        this.AI = {
            initialize: () => { // just helper to init environment
                SCG.AI.initializeEnvironment({
                    space: {
                        width: options.viewport.x,
                        height: options.viewport.y
                    },
                    bunnies: {
                        items: [],
                        maxCount: 1
                    }
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
                                SCG.scenes.activeScene.go.unshift(instance);
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
                            self.createBunny = function(){
                                self.postMessage({command: 'create', message: 
                                    { 
                                        goType: 'BunnyGO', 
                                        position: { x: self.environment.space.width /2, y: self.environment.space.height/2 },
                                        path: [
                                            { x: 0, y: (self.environment.space.height/2)+1 }, 
                                            { x: self.environment.space.width /2, y: self.environment.space.height - 5 },
                                            { x: self.environment.space.width - 5, y: self.environment.space.height/2 }] 
                                    } 
                                });				
                            };
                            self.checkBunnies = function(){
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
    }

    backgroundRender(){
        // for(let i = 0; i < this.bgGo.length;i++) {
        //     this.bgGo[i].needRecalcRenderProperties = true;
        //     this.bgGo[i].update();
        //     this.bgGo[i].render();
        // }
        // SCG.contexts.background.beginPath();
        // SCG.contexts.background.rect(0, 0, SCG.viewport.real.width, SCG.viewport.real.height);
        // SCG.contexts.background.fillStyle ='lightgreen';
        // SCG.contexts.background.fill()
    }
}

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
                        preventBubbling: true
                    }
                }
            },
            // contextName: 'background',
            shaking: {
                enabled: false,
                step: 0,
                maxStep: 7
            },
            internalPreUpdate: (now) => {
                if(this.shaking.enabled)
                    doWorkByTimer(this.shaking.timer, now);
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
}

class BunnyGO extends MovingGO {
    constructor(options = {}) {
        options = assignDeep({}, {
            imgPropertyName: 'bunny_sheet',
            isAnimated: true,
            destSourcePosition: new V2,
            innerPath: [],
            animation: {
                totalFrameCount: 14,
                framesInRow: 14,
                framesRowsCount: 1,
                frameChangeDelay: 250,
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
                        this.setDead();
                    }
                }
            },
            size: new V2(10,10),
            speed: 0.5,
        }, options);

        super(options);

        this.isAnimated = false;
        if(this.innerPath.length > 0)
        this.setDestination(this.innerPath.shift());
    }

    destinationCompleteCallBack() {
        this.animation.currentFrame = 0;
        this.isAnimated = true;
    }

    positionChangedCallback() {
        for(let goi = 0; goi<SCG.scenes.activeScene.go.length;goi++){
            let _go = SCG.scenes.activeScene.go[goi];
            if(_go.type !== 'GrassTile')
                continue;

            if(!_go.shaking.enabled && _go.box.isPointInside(this.position))
            {
                _go.shaking.enabled = true;
                break;
            }    
        }
    }
}

document.addEventListener("DOMContentLoaded", function() {

    SCG.src = {
        tree_sprite_sheet: 'content/tree1.png',
        grass_sheet: 'content/grass_sheet.png',
        bunny_sheet: 'content/bunny_sheet.png'
	}

    debugger;
    SCG.scenes.selectScene(new DemoScene( 
        { 
            viewport: viewport.clone(),
            name: 'demo_s1',
            go: [
            ]
        }));
    
    SCG.main.start();
});