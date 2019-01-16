class ItemsScene extends Scene {
    constructor(options = {}){
        options = assignDeep({}, {

        }, options);

        super(options);

        this.player = this.addGo(new Player({
            position: this.sceneCenter.clone(),
            size: new V2(100, 50),
        }));

        this.table = this.addGo(new GO({
            position: this.sceneCenter.clone().add(new V2(0, 90)),
            size: new V2(140,130),
            img: createCanvas(new V2(70, 65),function(ctx, size){
                let c = ['#9E9E92', '#DBDED7', '#34372C', '#8D8F8A', '#F1F4ED', '#EBEEE7', '#D6D6CE', '#E4E7E0',
            '#EEEDE9', '#EDECE7','#ECEBE6','#F1F0EB','#EEEDE8','#EBEAE5','#DEDED6','#E5E4DF','#EFEEE9','#F0EFEA','#F3F2ED','#E7E6E1','#E3E2DD','#E2E1DC','#E4E3DE','#E8E7E2','#F0EFEB','#DCDBD6','#CFCEC9','#EDEEE8','#EBECE7','#F0F1EC',
'#E6E7E2','#DDDED9','#E5E6E1','#E7E8E3','#D6D7D1','#CDCEC8','#D9D8D4','#E1E0DC','#AEB1A8','#93968F','#C9CBC6','#DFDFDD','#B7BAB3','#8D8F8A','#CACCC7','#E2E2E0','#D6D8D3','#B9BBB6','#CDCFCC'];

                ctx.fillStyle = '#DEE1DA';
                ctx.fillRect(0,0, size.x, size.y);
                for(let i = 0; i < 2000; i++){
                    ctx.fillStyle = c[getRandomInt(0, c.length-1)];
                    ctx.fillRect(getRandomInt(0, size.x), getRandomInt(0, size.y),1,1);
                }

                ctx.fillStyle = '#FCFFF9';
                ctx.fillRect(0,0, 1, size.y);
                ctx.fillStyle = '#9C9E9A';
                ctx.fillRect(size.x-1,0, 1, size.y);

                let grd = ctx.createLinearGradient(size.x/2, 0, size.x/2, size.y/15); grd.addColorStop(0, 'rgba(0,0,0,0.5)');grd.addColorStop(1, 'rgba(0,0,0,0)');
                ctx.fillStyle = grd;ctx.fillRect(0,0, size.x, size.y/15);

                let clearLeftDots = [6,5, 5,5,5,4,4,3,3,3,3,1,1,1, 1,1,0, 0,0];
                //ctx.fillStyle = '#FCFFF9';
                for(let i = 0; i < clearLeftDots.length; i++){
                    ctx.clearRect(0, i, clearLeftDots[i]+1,1);
                    let w = clearLeftDots[i] == 0 ? getRandomInt(1,2) : getRandomInt(3,5);
                    grd = ctx.createLinearGradient(clearLeftDots[i]+1, i, clearLeftDots[i]+w, i);
                    grd.addColorStop(0, '#DEE1DA');grd.addColorStop(1, '#FCFFF9');
                    ctx.fillStyle = grd;
                    ctx.fillRect(clearLeftDots[i]+1,i, w, 1);
                }
            })
        }))

    }

    backgroundRender(){

        SCG.contexts.background.drawImage(
            createCanvas(new V2(284,177), (ctx, size) => {
                ctx.drawImage(SCG.images.itemsBg1, 0,0, size.x, size.y);
            })
            , 
            0,0, SCG.viewport.real.width,SCG.viewport.real.height);
    }
}

class Player extends GO {
    constructor(options = {}){
        options = assignDeep({}, {
            speakerColor: '#FF80AD',
            buttonsColor: '#FF80AD',
            eqBarsCount: 10,
            eqItemsCount: 8
        }, options);

        super(options);

        this.body = this.addChild(new GO({
            size: this.size.clone(),
            position: new V2(),
            img: createCanvas(this.size.mul(1), (ctx, size) => {
                ctx.fillStyle = '#AD0000';
                ctx.strokeStyle = '#720000';
                ctx.beginPath();
                ctx.moveTo(size.x*0.2, 0);ctx.lineTo(size.x*0.8, 0);
                ctx.bezierCurveTo(size.x*0.9, 0, size.x, size.y*0.2, size.x, size.y*0.3);ctx.lineTo(size.x, size.y*0.7);
                ctx.bezierCurveTo(size.x, size.y*0.8, size.x*0.9, size.y, size.x*0.8, size.y);ctx.lineTo(size.x*0.2, size.y);
                ctx.bezierCurveTo(size.x*0.1, size.y, 0, size.y*0.8, 0, size.y*0.7);ctx.lineTo(0, size.y*0.3);
                ctx.bezierCurveTo(0, size.y*0.2, size.x*0.1, 0, size.x*0.2, 0);
                ctx.fill();ctx.closePath();

                ctx.save();
                ctx.clip();
                let grd = ctx.createRadialGradient(30, 0, 0, 20, 5, 80);
                grd.addColorStop(0, 'rgba(255,255,255,0.6');grd.addColorStop(1, 'rgba(255,255,255, 0');//grd.addColorStop(1, 'rgba(0,0,0, 0.5');
                ctx.scale(1,0.75)
                ctx.fillStyle = grd;ctx.fill();//ctx.fillRect(0,0, size.x, size.y);
                ctx.lineWidth = 4;ctx.stroke();ctx.closePath();
                ctx.restore();

                grd = ctx.createLinearGradient(size.x, size.y, size.x/2, size.y/2);
                grd.addColorStop(0, 'rgba(255,255,255, 0.5')
                grd.addColorStop(1, 'rgba(255,255,255, 0');
                ctx.fillStyle = grd;
                ctx.save();
                ctx.translate(-2.5,-2.5)
                ctx.beginPath();
                ctx.moveTo(size.x, size.y*0.55);ctx.lineTo(size.x*0.99, size.y*0.7);ctx.bezierCurveTo(size.x, size.y*0.8, size.x*0.95, size.y*0.975, size.x*0.8, size.y);
                ctx.lineTo(size.x*0.75, size.y*0.99);ctx.bezierCurveTo(size.x*0.85, size.y*0.95, size.x*0.975, size.y*0.95, size.x, size.y*0.55);ctx.closePath();
                ctx.fill();
                ctx.translate(2.5,2.5)
                ctx.restore();

                ctx.save();
                ctx.translate(3,3)
                grd = ctx.createLinearGradient(0, 0, size.x/2, size.y/2);
                grd.addColorStop(0, 'rgba(255,255,255, 0.7');grd.addColorStop(1, 'rgba(255,255,255, 0');
                ctx.fillStyle = grd;
                ctx.beginPath();
                ctx.moveTo(0, size.y*0.35); ctx.bezierCurveTo(0, size.y*0.1, size.x*0.1, 0, size.x*0.2, 0); ctx.lineTo(size.x*0.3, 0);
                ctx.bezierCurveTo(size.x*0.2, size.y*0.015, size.x*0.08, size.y*0.0, 0, size.y*0.3);
                ctx.closePath();
                ctx.fill();ctx.closePath();
                ctx.restore();

                ctx.beginPath();
                ctx.moveTo(size.x/3, size.y*0.68); ctx.lineTo(size.x/8.5, size.y*0.68); ctx.bezierCurveTo(size.x*0.1, size.y*0.8, size.x*0.15, size.y*0.9, size.x*0.3, size.y*0.875)
                ctx.lineTo(size.x*0.64, size.y*0.875); ctx.bezierCurveTo(size.x*0.62, size.y*0.875, size.x*0.58, size.y*0.8, size.x*0.56, size.y*0.68);
                ctx.closePath();ctx.fillStyle = 'rgba(0,0,0, 0.15)';ctx.fill();
                // ctx.lineWidth = 0.5;ctx.strokeStyle = 'white';
                // ctx.stroke();
                
            })
        }))

        this.speaker = this.body.addChild(new GO({
            position: new V2(this.size.x/4, 0),
            size: new V2(this.size.x/4, this.size.y/2).mul(1.4),
            img: createCanvas(new V2(40, 40), (ctx, size) => {
                ctx.beginPath(); ctx.arc(size.x/2, size.y/2, size.x/2 , 0, 2 * Math.PI, false);
                ctx.fillStyle = this.speakerColor; ctx.fill();
                let grd = ctx.createLinearGradient(size.x-1, size.y-1 ,0,0);grd.addColorStop(1, 'rgba(255,255,255,0.2)');grd.addColorStop(0, 'rgba(0,0,0,0.2)');
                ctx.fillStyle = grd; ctx.fill();ctx.closePath();
                
                grd = ctx.createLinearGradient(size.x *0.8 *5/6, size.y*0.8 ,size.x*0.2,size.y*0.2);grd.addColorStop(0, 'rgba(255,255,255,0.5)');grd.addColorStop(1, 'rgba(0,0,0,0.4)');
                ctx.beginPath(); ctx.arc(size.x/2, size.y/2, size.x/2*0.8 , 0, 2 * Math.PI, false);
                ctx.fillStyle = this.speakerColor; ctx.fill();ctx.fillStyle = grd; ctx.fill();ctx.closePath();
                
                ctx.beginPath(); ctx.arc(size.x/2, size.y/2, size.x/2*0.65 , 0, 2 * Math.PI, false);
                ctx.fillStyle = '#CCE2E0'; ctx.fill();ctx.closePath();
                
                ctx.beginPath(); ctx.arc(size.x/2, size.y/2, size.x/2*0.5 , 0, 2 * Math.PI, false);
                ctx.fillStyle = this.speakerColor; ctx.fill();
                grd = ctx.createRadialGradient(size.x*8.5/20,size.y*8.5/20,0,size.x/2,size.y/2, size.x/2*0.5);grd.addColorStop(0, 'rgba(255,255,255,0.4)');grd.addColorStop(1, 'rgba(0,0,0,0.4)');
                ctx.fillStyle = grd; ctx.fill();
                // ctx.lineWidth = 2;
                // ctx.strokeStyle = '#003300';
                // ctx.stroke();
            })
        }));

        this.speaker.addEffect(new SizeInOutEffect({min:0.975, effectTime:100, updateDelay: 50, dimension: 'both'}))

        this.screen = this.body.addChild(new GO({
            position: new V2(-this.size.x*1.5/10, -this.size.y/10),
            size: new V2(this.size.x/2*1.1, this.size.y/2),
            img: createCanvas(new V2(30, 10).mul(2), (ctx, size) => {
                ctx.fillStyle = '#393A3F';
                ctx.beginPath();
                ctx.moveTo(0, size.y/2);ctx.bezierCurveTo(size.x*0, size.y*0.15, size.x*0.1, 0, size.x*0.3, 0);
                ctx.lineTo(size.x*0.9, 0);ctx.bezierCurveTo(size.x*1, size.y*0.1, size.x*0.925, size.y*0.2, size.x*0.875, size.y*0.55);
                ctx.bezierCurveTo(size.x*0.85, size.y*0.75, size.x*0.9, size.y*1, size.x*0.65, size.y); ctx.lineTo(size.x*0.2, size.y);
                ctx.bezierCurveTo(size.x*0.05, size.y*0.95, size.x*0, size.y*0.8, 0, size.y/2);
                ctx.closePath(); ctx.fill();
                ctx.strokeStyle = '#CCE2E0';
                ctx.lineWidth = 2;
                ctx.stroke();

                ctx.fillStyle = 'green';
                ctx.fillRect(size.x*0.25, size.y*4/5, size.x*0.5, 1);
                ctx.fillStyle = '#4800FF';
                ctx.fillRect(size.x*0.8, size.y*0.2, 3,1);
                ctx.fillStyle = '#00FF21';ctx.fillRect(size.x*0.17, size.y*0.3, 2,1);ctx.fillRect(size.x*0.17, size.y*0.4, 2,1);
                ctx.fillRect(size.x*0.17, size.y*0.5, 2,1);ctx.fillRect(size.x*0.17, size.y*0.6, 2,1);ctx.fillRect(size.x*0.17, size.y*0.7, 2,1);
                //ctx.fillRect(size.x*0.3, size.y*0.1, 5,2);
            })
        }));

        this.screen.equalizer = this.screen.addChild(new GO({
            position: new V2(0,1),
            size: new V2(this.screen.size.x*0.5, this.screen.size.y*0.5),
            // img: createCanvas(this.screen.size,(ctx, size) => {
            //     ctx.strokeStyle = 'red';
            //     ctx.strokeRect(0,0, size.x-1, size.y-1);
            // })
        }));

        this.screen.equalizer.bars = [];
        let barSize = new V2(this.screen.equalizer.size.x/this.eqBarsCount, this.screen.equalizer.size.y)
        let left = -this.screen.equalizer.size.x/2 + barSize.x/2;

        for(let i = 0;i < this.eqBarsCount;i++){
            this.screen.equalizer.bars.push(this.screen.equalizer.addChild(new EqualizerBar({
                itemsCount: this.eqItemsCount,
                position: new V2(left + barSize.x*i, 0),
                size: new V2(barSize.x*0.75, barSize.y),
            })))
        }
        
        this.screen.runningInfo = this.screen.addChild(new RunningInfo({
            position: new V2(0, -this.screen.size.y*0.3),
            size: new V2(this.screen.size.x*0.5, this.screen.size.y*0.15),
            // img: createCanvas(new V2(1,1), (ctx, size) => {
            //     ctx.fillStyle = 'red';ctx.fillRect(0,0, size.x, size.y);
            // })
        }));

        let drawButton = function(ctx, size){
            ctx.fill();
            let grd = ctx.createRadialGradient(size.x*8.5/20,size.y*3/20, 0, size.x/2, size.y/2, size.x/2);
            grd.addColorStop(1, 'rgba(0,0,0,0.3)');grd.addColorStop(0, 'rgba(255,255,255,0.4)');ctx.fillStyle = grd;ctx.fill();
            grd = ctx.createLinearGradient(size.x/2, size.y, size.x/2, 0); grd.addColorStop(0, 'rgba(0,0,0,0.3)');grd.addColorStop(1, 'rgba(255,255,255,0.3)');
            //ctx.strokeStyle = grd;ctx.lineWidth = 1;ctx.stroke();
        }
        this.buttons = [
            this.addChild(new GO({
               position: new V2(-this.size.x*7/24 - 2.5, this.size.y*4.5/16),
               size: new V2(this.size.x*0.1, this.size.y*0.15),
               img: createCanvas(new V2(20, 20), (ctx, size) => {
                   ctx.fillStyle = this.buttonsColor;
                   ctx.beginPath();ctx.moveTo(size.x/2, 0);
                   ctx.bezierCurveTo(0, 0, size.x*0.1, size.y*0.5, size.x*0.4, size.y*0.75);
                   ctx.bezierCurveTo(size.x*0.7, size.y, size.x, size.y*0.9, size.x*0.95, size.y*0.7);ctx.lineTo(size.x*0.9, size.y*0.3);
                   ctx.bezierCurveTo(size.x*0.85, size.y*0.0, size.x*0.7, size.y*0, size.x*0.5, 0);
                   ctx.closePath();
                drawButton(ctx, size);
               }) 
            })),
            this.addChild(new GO({
                position: new V2(-this.size.x*5/24 - 2, this.size.y*4.5/16),
                size: new V2(this.size.x*0.1, this.size.y*0.15),
                img: createCanvas(new V2(20, 20), (ctx, size) => {
                    ctx.fillStyle = this.buttonsColor;
                    ctx.beginPath();ctx.moveTo(size.x/2, 0);
                    ctx.bezierCurveTo(size.x*0.0, 0, size.x*0.125, size.y*0.2, size.x*0.2, size.y*0.85);
                    ctx.bezierCurveTo(size.x*0.3, size.y*0.95, size.x*0.6, size.y*0.9, size.x*0.85, size.y*0.9);
                    ctx.bezierCurveTo(size.x, size.y*0.8, size.x*0.85, size.y*0.7, size.x*0.8, size.y*0.1);
                    ctx.bezierCurveTo(size.x*0.75, size.y*0.05, size.x*0.7, size.y*0, size.x*0.5, 0);
                    ctx.closePath();
                    drawButton(ctx, size);
                }) 
             })),
            this.addChild(new GO({
                position: new V2(-this.size.x*3/24 - 2, this.size.y*4.5/16),
                size: new V2(this.size.x*0.1, this.size.y*0.15),
                img: createCanvas(new V2(20, 20), (ctx, size) => {
                    ctx.fillStyle = this.buttonsColor;
                    ctx.beginPath();ctx.moveTo(size.x/2, 0);
                    ctx.bezierCurveTo(size.x*0.0, 0, size.x*0.125, size.y*0.2, size.x*0.2, size.y*0.85);
                    ctx.bezierCurveTo(size.x*0.3, size.y*0.95, size.x*0.6, size.y*0.9, size.x*0.85, size.y*0.9);
                    ctx.bezierCurveTo(size.x, size.y*0.8, size.x*0.85, size.y*0.7, size.x*0.8, size.y*0.1);
                    ctx.bezierCurveTo(size.x*0.75, size.y*0.05, size.x*0.7, size.y*0, size.x*0.5, 0);
                    ctx.closePath();
                    drawButton(ctx, size);
                }) 
             })),
             this.addChild(new GO({
                 position: new V2(-this.size.x*1/24 - 2, this.size.y*4.5/16),
                 size: new V2(this.size.x*0.1, this.size.y*0.15),
                 img: createCanvas(new V2(20, 20), (ctx, size) => {
                     ctx.fillStyle = this.buttonsColor;
                     ctx.beginPath();ctx.moveTo(size.x/2, 0);
                     ctx.bezierCurveTo(size.x*0.0, 0, size.x*0.125, size.y*0.2, size.x*0.2, size.y*0.85);
                     ctx.bezierCurveTo(size.x*0.3, size.y*0.95, size.x*0.6, size.y*0.9, size.x*0.85, size.y*0.9);
                     ctx.bezierCurveTo(size.x, size.y*0.8, size.x*0.85, size.y*0.7, size.x*0.8, size.y*0.1);
                     ctx.bezierCurveTo(size.x*0.75, size.y*0.05, size.x*0.7, size.y*0, size.x*0.5, 0);
                     ctx.closePath();
                     drawButton(ctx, size);
                 }) 
              })),
              this.addChild(new GO({
                position: new V2(this.size.x*1.1/24 - 1.5, this.size.y*4.5/16),
                size: new V2(this.size.x*0.12, this.size.y*0.15),
                img: createCanvas(new V2(20, 20), (ctx, size) => {
                    ctx.fillStyle = this.buttonsColor;
                    ctx.beginPath();ctx.moveTo(size.x*0.4, 0);
                    ctx.bezierCurveTo(size.x*0.0, 0, size.x*0.125, size.y*0.2, size.x*0.2, size.y*0.85);
                    ctx.bezierCurveTo(size.x*0.3, size.y*0.95, size.x*0.6, size.y*0.9, size.x*0.85, size.y*0.9);
                    ctx.bezierCurveTo(size.x, size.y*0.8, size.x*0.8, size.y*0.7, size.x*0.65, size.y*0.1);
                    ctx.bezierCurveTo(size.x*0.55, size.y*0, size.x*0.5, size.y*0, size.x*0.4, 0);
                    
                    ctx.closePath();
                    drawButton(ctx, size);
                }) 
             }))
        ]

        this.mainButton = this.addChild(new GO({
            position: new V2(this.size.x/4, -this.size.x/4 - 2),
            size: new V2(this.size.x*0.1, this.size.y*0.08),
            img: createCanvas(new V2(20, 10), (ctx, size) => {
                ctx.fillStyle = '#A8BBB9';
                //ctx.fillRect(0,0, size.x, size.y);
                ctx.beginPath();ctx.moveTo(size.x/2, 0); ctx.bezierCurveTo(size.x, 0, size.x, 0, size.x, size.y/2);ctx.lineTo(size.x, size.y);
                ctx.lineTo(0, size.y);ctx.lineTo(0, size.y/2);ctx.bezierCurveTo(0, 0, 0, 0, size.x/2, 0);
                ctx.closePath();ctx.fill();
                let grd = ctx.createLinearGradient(0,0,size.x/2, 0);grd.addColorStop(0, 'rgba(255,255,255,0.75)');grd.addColorStop(0.75, 'rgba(255,255,255,0)');
                ctx.fillStyle= grd;ctx.fill();
                grd = ctx.createLinearGradient(size.x/2,0,size.x, 0);grd.addColorStop(0.5, 'rgba(0,0,0,0)');grd.addColorStop(1, 'rgba(0,0,0,0.5)');
                ctx.fillStyle= grd;ctx.fill();

            })
        }));

        this.antenna = this.addChild(new GO({
            position: new V2(-this.size.x/3, -this.size.y-5),
            size: new V2(3, 60),
            img: createCanvas(new V2(12, 60), (ctx, size) => {
                ctx.fillStyle = 'black';
                ctx.fillRect(0,size.y-3, 12, 3);
                ctx.fillRect(1.5,3, 9, size.y-6);
                //ctx.arc(6,6,6,0,Math.PI*2, false);
                ctx.beginPath();
                ctx.moveTo(0,0);ctx.lineTo(size.x,0);ctx.lineTo(size.x*2/3+0.5,3);ctx.lineTo(size.x*1/3,3);
                ctx.closePath();ctx.fill();
                let grd = ctx.createLinearGradient(1.5,0,9, 0);grd.addColorStop(0, 'rgba(255,255,255,0.75)');grd.addColorStop(0.75, 'rgba(255,255,255,0)');
                ctx.fillStyle= grd;ctx.fillRect(1.5,3, 9, size.y-6);
                grd = ctx.createLinearGradient(0,0,12, 0);grd.addColorStop(0, 'rgba(255,255,255,0.5)');grd.addColorStop(0.75, 'rgba(255,255,255,0)');
                ctx.fillStyle= grd;ctx.fillRect(0,size.y-3, 12, 3);

                
            })
        }))
    }
}

class RunningInfo extends GO {
    constructor(options = {}){
        options = assignDeep({}, {
            
        }, options);

        super(options);

        this.infoGeneratorTimer = createTimer(100, () => {
            let p = new V2(this.size.x/2, -this.size.y/2 + this.size.y/6 + (getRandomInt(0,2)*this.size.y/3));
            this.addChild(new MovingGO({
                position: p,
                size: new V2(this.size.x/20, this.size.y/3),
                img: createCanvas(new V2(1,1), (ctx, size) => {
                    ctx.fillStyle = 'green';ctx.fillRect(0,0, size.x, size.y);
                }),
                setDestinationOnInit: true,
                destination: new V2(-this.size.x/2, p.y),
                speed: 0.125,
                setDeadOnDestinationComplete: true
            }))
    
        }, this, true)
    }

    internalUpdate(now){
        if(this.infoGeneratorTimer)
            doWorkByTimer(this.infoGeneratorTimer, now);
    }
}

class EqualizerBar extends GO {
    constructor(options = {}){
        options = assignDeep({}, {
            itemsCount: 5
        }, options);

        super(options);

        let itemsColorsCtx = createCanvas(new V2(1, this.itemsCount), (ctx, size) => {
            let grd = ctx.createLinearGradient(0,0,0, size.y);
            grd.addColorStop(1, '#FF0000'); grd.addColorStop(0.5, '#FFD800'); grd.addColorStop(0, '#00FF00');
            ctx.fillStyle = grd;
            ctx.fillRect(0,0,size.x, size.y);
        }).getContext('2d');

        this.itemSize = new V2(this.size.x, this.size.y/this.itemsCount);
        this.items = [];
        let bottom = this.size.y/2 - this.itemSize.y/2;

        for(let i = 0;i< this.itemsCount;i++){
            let colorData = itemsColorsCtx.getImageData(0,i,1,1).data;
            this.items[i] = this.addChild(new GO({
                size: new V2(this.itemSize.x, this.itemSize.y*0.9),
                position: new V2(0,bottom - this.itemSize.y*i),
                img: createCanvas(new V2(1,1), (ctx, size) => {
                    ctx.fillStyle = `rgb(${colorData[0]},${colorData[1]},${colorData[2]})`;ctx.fillRect(0,0, size.x, size.y);
                })
            }))
        }

        this.itemsSwitchTimer = createTimer(100, () => {
            let visibleCount = getRandomInt(1, this.itemsCount);

            for(let i = 0; i < this.itemsCount;i++){
                this.items[i].isVisible = (i < visibleCount);
            }

        }, this, true)
    }

    internalUpdate(now){
        if(this.itemsSwitchTimer)
        doWorkByTimer(this.itemsSwitchTimer, now)
    }
}

var mul_table = [512, 512, 456, 512, 328, 456, 335, 512, 405, 328, 271, 456, 388, 335, 292, 512, 454, 405, 364, 328, 298, 271, 496, 456, 420, 388, 360, 335, 312, 292, 273, 512, 482, 454, 428, 405, 383, 364, 345, 328, 312, 298, 284, 271, 259, 496, 475, 456, 437, 420, 404, 388, 374, 360, 347, 335, 323, 312, 302, 292, 282, 273, 265, 512, 497, 482, 468, 454, 441, 428, 417, 405, 394, 383, 373, 364, 354, 345, 337, 328, 320, 312, 305, 298, 291, 284, 278, 271, 265, 259, 507, 496, 485, 475, 465, 456, 446, 437, 428, 420, 412, 404, 396, 388, 381, 374, 367, 360, 354, 347, 341, 335, 329, 323, 318, 312, 307, 302, 297, 292, 287, 282, 278, 273, 269, 265, 261, 512, 505, 497, 489, 482, 475, 468, 461, 454, 447, 441, 435, 428, 422, 417, 411, 405, 399, 394, 389, 383, 378, 373, 368, 364, 359, 354, 350, 345, 341, 337, 332, 328, 324, 320, 316, 312, 309, 305, 301, 298, 294, 291, 287, 284, 281, 278, 274, 271, 268, 265, 262, 259, 257, 507, 501, 496, 491, 485, 480, 475, 470, 465, 460, 456, 451, 446, 442, 437, 433, 428, 424, 420, 416, 412, 408, 404, 400, 396, 392, 388, 385, 381, 377, 374, 370, 367, 363, 360, 357, 354, 350, 347, 344, 341, 338, 335, 332, 329, 326, 323, 320, 318, 315, 312, 310, 307, 304, 302, 299, 297, 294, 292, 289, 287, 285, 282, 280, 278, 275, 273, 271, 269, 267, 265, 263, 261, 259];
var shg_table = [9, 11, 12, 13, 13, 14, 14, 15, 15, 15, 15, 16, 16, 16, 16, 17, 17, 17, 17, 17, 17, 17, 18, 18, 18, 18, 18, 18, 18, 18, 18, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24];

function stackBlurCanvasRGB(canvas, top_x, top_y, width, height, radius) {
    if (isNaN(radius) || radius < 1)
        return;
    radius |= 0;
    let context = canvas.getContext("2d");
    let imageData;
    try {
        try {
            imageData = context.getImageData(top_x, top_y, width, height)
        } catch (e) {
            try {
                netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead");
                imageData = context.getImageData(top_x, top_y, width, height)
            } catch (e) {
                alert("Cannot access local image");
                throw new Error("unable to access local image data: " + e);
                return
            }
        }
    } catch (e) {
        alert("Cannot access image");
        throw new Error("unable to access image data: " + e)
    }
    let pixels = imageData.data;
    let x, y, i, p, yp, yi, yw, r_sum, g_sum, b_sum, r_out_sum, g_out_sum, b_out_sum, r_in_sum, g_in_sum, b_in_sum, pr, pg, pb, rbs;
    let div = radius + radius + 1;
    let w4 = width << 2;
    let widthMinus1 = width - 1;
    let heightMinus1 = height - 1;
    let radiusPlus1 = radius + 1;
    let sumFactor = radiusPlus1 * (radiusPlus1 + 1) / 2;
    let stackStart = new BlurStack;
    let stack = stackStart;
    for (i = 1; i < div; i++) {
        stack = stack.next = new BlurStack;
        if (i == radiusPlus1)
            var stackEnd = stack
    }
    stack.next = stackStart;
    let stackIn = null;
    let stackOut = null;
    yw = yi = 0;
    let mul_sum = mul_table[radius];
    let shg_sum = shg_table[radius];
    for (y = 0; y < height; y++) {
        r_in_sum = g_in_sum = b_in_sum = r_sum = g_sum = b_sum = 0;
        r_out_sum = radiusPlus1 * (pr = pixels[yi]);
        g_out_sum = radiusPlus1 * (pg = pixels[yi + 1]);
        b_out_sum = radiusPlus1 * (pb = pixels[yi + 2]);
        r_sum += sumFactor * pr;
        g_sum += sumFactor * pg;
        b_sum += sumFactor * pb;
        stack = stackStart;
        for (i = 0; i < radiusPlus1; i++) {
            stack.r = pr;
            stack.g = pg;
            stack.b = pb;
            stack = stack.next
        }
        for (i = 1; i < radiusPlus1; i++) {
            p = yi + ((widthMinus1 < i ? widthMinus1 : i) << 2);
            r_sum += (stack.r = pr = pixels[p]) * (rbs = radiusPlus1 - i);
            g_sum += (stack.g = pg = pixels[p + 1]) * rbs;
            b_sum += (stack.b = pb = pixels[p + 2]) * rbs;
            r_in_sum += pr;
            g_in_sum += pg;
            b_in_sum += pb;
            stack = stack.next
        }
        stackIn = stackStart;
        stackOut = stackEnd;
        for (x = 0; x < width; x++) {
            pixels[yi] = r_sum * mul_sum >> shg_sum;
            pixels[yi + 1] = g_sum * mul_sum >> shg_sum;
            pixels[yi + 2] = b_sum * mul_sum >> shg_sum;
            r_sum -= r_out_sum;
            g_sum -= g_out_sum;
            b_sum -= b_out_sum;
            r_out_sum -= stackIn.r;
            g_out_sum -= stackIn.g;
            b_out_sum -= stackIn.b;
            p = yw + ((p = x + radius + 1) < widthMinus1 ? p : widthMinus1) << 2;
            r_in_sum += stackIn.r = pixels[p];
            g_in_sum += stackIn.g = pixels[p + 1];
            b_in_sum += stackIn.b = pixels[p + 2];
            r_sum += r_in_sum;
            g_sum += g_in_sum;
            b_sum += b_in_sum;
            stackIn = stackIn.next;
            r_out_sum += pr = stackOut.r;
            g_out_sum += pg = stackOut.g;
            b_out_sum += pb = stackOut.b;
            r_in_sum -= pr;
            g_in_sum -= pg;
            b_in_sum -= pb;
            stackOut = stackOut.next;
            yi += 4
        }
        yw += width
    }
    for (x = 0; x < width; x++) {
        g_in_sum = b_in_sum = r_in_sum = g_sum = b_sum = r_sum = 0;
        yi = x << 2;
        r_out_sum = radiusPlus1 * (pr = pixels[yi]);
        g_out_sum = radiusPlus1 * (pg = pixels[yi + 1]);
        b_out_sum = radiusPlus1 * (pb = pixels[yi + 2]);
        r_sum += sumFactor * pr;
        g_sum += sumFactor * pg;
        b_sum += sumFactor * pb;
        stack = stackStart;
        for (i = 0; i < radiusPlus1; i++) {
            stack.r = pr;
            stack.g = pg;
            stack.b = pb;
            stack = stack.next
        }
        yp = width;
        for (i = 1; i <= radius; i++) {
            yi = yp + x << 2;
            r_sum += (stack.r = pr = pixels[yi]) * (rbs = radiusPlus1 - i);
            g_sum += (stack.g = pg = pixels[yi + 1]) * rbs;
            b_sum += (stack.b = pb = pixels[yi + 2]) * rbs;
            r_in_sum += pr;
            g_in_sum += pg;
            b_in_sum += pb;
            stack = stack.next;
            if (i < heightMinus1) {
                yp += width
            }
        }
        yi = x;
        stackIn = stackStart;
        stackOut = stackEnd;
        for (y = 0; y < height; y++) {
            p = yi << 2;
            pixels[p] = r_sum * mul_sum >> shg_sum;
            pixels[p + 1] = g_sum * mul_sum >> shg_sum;
            pixels[p + 2] = b_sum * mul_sum >> shg_sum;
            r_sum -= r_out_sum;
            g_sum -= g_out_sum;
            b_sum -= b_out_sum;
            r_out_sum -= stackIn.r;
            g_out_sum -= stackIn.g;
            b_out_sum -= stackIn.b;
            p = x + ((p = y + radiusPlus1) < heightMinus1 ? p : heightMinus1) * width << 2;
            r_sum += r_in_sum += stackIn.r = pixels[p];
            g_sum += g_in_sum += stackIn.g = pixels[p + 1];
            b_sum += b_in_sum += stackIn.b = pixels[p + 2];
            stackIn = stackIn.next;
            r_out_sum += pr = stackOut.r;
            g_out_sum += pg = stackOut.g;
            b_out_sum += pb = stackOut.b;
            r_in_sum -= pr;
            g_in_sum -= pg;
            b_in_sum -= pb;
            stackOut = stackOut.next;
            yi += width
        }
    }
    context.putImageData(imageData, top_x, top_y);

    return canvas;
}
function BlurStack() {
    this.r = 0;
    this.g = 0;
    this.b = 0;
    this.a = 0;
    this.next = null
}


