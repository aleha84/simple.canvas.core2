class ThreeInARowScene extends Scene {
    constructor(options = {}){
        options = assignDeep({}, {
            addZombieDefender: true
        }, options);

        super(options);

        this.statusBarSize = new V2(this.space.x, 10);
        this.boardSize = new V2(300,this.space.y - this.statusBarSize.y);
        this.zombieDefenderSize = new V2(this.space.x-this.boardSize.x,this.space.y - this.statusBarSize.y);
        
        this.board = new Board({
            size: this.boardSize.clone(),
            position: this.addZombieDefender ? new V2(this.space.x - this.boardSize.x/2, this.space.y/2+this.statusBarSize.y/2) : new V2(this.space.x/2, this.space.y/2),
            preventNonResultingSwaps: false,
        });

        this.points = {
            
            pistol: 0, 
            submachinegun: 0, 
            rifle: 0, 
            sniper: 0, 
            machinegun: 0,
            rpg: 0,
            addPoint(type) {
                console.log(`ThreeInARowScene.points.addPoint. Type: ${type}`);
                this[type]++;
                SCG.UI.invalidate();
                //trigger render UI
                //trigger soldier add if score completed
            },
            
        }

        this.addGo(this.board);

        if(this.addZombieDefender){
            this.zombieDefender = new ZombieDefender({
                position: new V2(200/2, this.space.y/2),
                size: this.zombieDefenderSize.clone(),
            });

            this.addGo(this.zombieDefender);
        }

        window.board = this.board;
    }

    backgroundRender(){
        SCG.contexts.background.fillStyle = 'black';
        SCG.contexts.background.fillRect(0,0,SCG.viewport.real.width,SCG.viewport.real.height);
    }
}