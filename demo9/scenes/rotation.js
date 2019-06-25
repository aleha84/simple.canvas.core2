class RotationScene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            debug: {
                enabled: true,
                showFrameTimeLeft: true,
                additional: [],
            },
            imgCache: []
        }, options)

        super(options);

    }

    backgroundRender() {
        this.backgroundRenderDefault('#34B2A4');
    }

    getModel() {
        return {"general":{"originalSize":{"x":40,"y":40},"size":{"x":40,"y":40},"zoom":6,"showGrid":true},"main":{"layers":[{"order":0,"type":"lines","strokeColor":"#FF0000","fillColor":"#00ff00","closePath":true,"fill":true,"visible":true,"clear":false,"points":[{"point":{"x":19,"y":13}},{"point":{"x":28,"y":28}},{"point":{"x":11,"y":28}}]}]}}
    }

    createCargo() {
        
        return new GO({
            //position: new V2(319.5, 151),
            position: new V2( this.viewport.x+20, 151),
            size: new V2(30,30),
            angle: 0,
            rotationOrigin: new V2(),
            rotateCompleteCallback: () => {},
            init() {
                this.imgCenter = this.size.mul(0.5).toInt();
                this.createImage();

                this.timer = this.regTimerDefault(30, () => {
                    if(this.xChange) {
                        this.position.x = easing.process(this.xChange);
                        this.xChange.time++;
                        this.needRecalcRenderProperties = true;

                        if(this.xChange.time > this.xChange.duration){
                            this.xChange = undefined;
                            this.xChangeCallback();
                            this.xChangeCallback = undefined;
                        }
                    }

                    if(this.yChange) {
                        this.position.y = easing.process(this.yChange);
                        this.yChange.time++;
                        this.needRecalcRenderProperties = true;

                        if(this.yChange.time > this.yChange.duration){
                            this.yChange = undefined;
                            this.yChangeCallback();
                            this.yChangeCallback = undefined;
                        }
                    }

                    if(this.aChange){
                        this.angle = easing.process(this.aChange);
                        this.aChange.time++
                        this.createImage();
    
                        if(this.aChange.time > this.aChange.duration){
                            this.aChange = undefined;
                            this.rotateCompleteCallback();
                            this.rotateCompleteCallback = undefined;
                        }
                    }
                    
                })
            },
            moveIn(callback) {
                this.xChange = easing.createProps(10, this.position.x, 319.25, 'quad', 'out');
                this.xChangeCallback = callback;
            },
            moveOut(callback) {
                this.xChange = easing.createProps(400, this.position.x,-20, 'linear', 'base');
                this.xChangeCallback = callback;
            },
            fall(callback) {
                this.yChange = easing.createProps(5, this.position.y, this.position.y+10, 'quad', 'in');
                this.yChangeCallback = callback;
            },
            rotate(angle, duration = 100, rotateChild = true, callback = () => {}){
                this.aChange = easing.createProps(duration, this.angle, this.angle + angle, 'quad', 'inOut');
                console.log('Cargo rotation created', this.aChange);
                this.rotateCompleteCallback = callback;
            },
            createImage() {
                let model = rotationSceneModels.demoCargo1();
                model.general.size = this.size;
                model.main.layers.forEach(l => {
                    l.points.forEach(p => {
                        let v2 = new V2(p.point);
                        v2.substract(this.rotationOrigin, true).rotate(this.angle, false, true).add(this.imgCenter, true).toInt(true);
                        p.point.x = v2.x;
                        p.point.y = v2.y;
                    })
                })

                this.img = PP.createImage(model);
            }
        });
    }

    drawCircle(ctx, center, radius){
        
        for(let y = center.y-radius-1;y < center.y+radius+1;y++){
            for(let x = center.x-radius-1;x < center.x+radius+1;x++){

                let _p = new V2(x,y);
                let distance = center.distance(_p);

                if(distance < radius){
                    ctx.fillRect(x,y,1,1);
                }
            }
        }
    }

    start(){
        this.cargoCount = 5;
        this.demoCargoAlter = undefined;
        this.road1 = this.addGo(new GO({
            position: new V2(400, 168),
            size: new V2(200, 15),
            img: createCanvas(new V2(200, 15), (ctx, size, hlp) => {
                hlp.setFillColor('#394956')
                this.drawCircle(ctx, new V2(7,7), 8)
                hlp.rect(7,0,size.x, size.y).setFillColor('#29323B').rect(4,4,size.x-8,size.y-8);
               
                for(let i = 0; i < 3; i++){
                    hlp.setFillColor('#FEF1CE')
                    this.drawCircle(ctx, new V2(7 + fast.r(i*size.x/3),7), 4)
                    hlp.setFillColor('#29323B').rect(6 + fast.r(i*size.x/3), 6,3,3)
                }
                
            })
        }))

        this.road2 = this.addGo(new GO({
            position: new V2(this.sceneCenter.x, 230),
            size: new V2(this.viewport.x, 20),
            img: createCanvas(new V2(this.viewport.x, 20), (ctx, size, hlp) => {
                hlp.setFillColor('#394956').rect(0,0,size.x, size.y).setFillColor('#29323B').rect(5,5,size.x-10,size.y-10);
               
                for(let i = 0; i < 3; i++){
                    hlp.setFillColor('#FEF1CE')
                    this.drawCircle(ctx, new V2(10 + fast.r(i*size.x/3),10), 5)
                    hlp.setFillColor('#29323B').rect(9 + fast.r(i*size.x/3), 9,3,3)
                }
                
            })
        }),5)

        this.shadow = this.addGo(new GO({
            position: new V2(this.sceneCenter.x, 260),
            size: new V2(this.viewport.x, 17),
            img: createCanvas(new V2(1,1), (ctx,size, hlp) => {
                hlp.setFillColor('#1FA58A').rect(0,0,size.x, size.y);
            })
        }));

        this.light1 = this.addGo(new GO({
            position: new V2(this.sceneCenter.x + 150, 130),
            size: new V2(100, 20),
            img: createCanvas(new V2(1,1), (ctx,size, hlp) => {
                hlp.setFillColor('#55BFB5').rect(0,0,size.x, size.y);
            })
        }));

        this.light2 = this.addGo(new GO({
            position: new V2(this.sceneCenter.x - 50 , 140),
            size: new V2(150, 15),
            img: createCanvas(new V2(1,1), (ctx,size, hlp) => {
                hlp.setFillColor('#55BFB5').rect(0,0,size.x, size.y);
            })
        }));

        this.light3 = this.addGo(new GO({
            position: new V2(this.sceneCenter.x  , 200),
            size: new V2(120, 10),
            img: createCanvas(new V2(1,1), (ctx,size, hlp) => {
                hlp.setFillColor('#55BFB5').rect(0,0,size.x, size.y);
            })
        }));

        this.robotHand = this.addGo(new RobotHand({
            position: new V2(this.sceneCenter.x, 100),
        }), 10)

        this.demoCargo = this.addGo(this.createCargo());

        this.sceneManager = this.addGo(new GO({
            position: new V2(),
            size: new V2(1,1),
            init() {
                let scene = this.parentScene;
                this.takeSequence = [
                    //this.addProcessScriptDelay(500),
                    function() {
                        scene.demoCargo.moveIn(() => { 
                            this.processScript();
                         })
                    },
                    this.addProcessScriptDelay(5),
                      function() {
                        scene.robotHand.rotateForearm(20, 20, false, () => {
                            this.processScript();
                        });
                    },
                    function() {
                        scene.robotHand.rotateShoulder(-80, 20, false, () => {
                            this.processScript();
                        });
                    },
                    this.addProcessScriptDelay(5),
                      function() {
                        scene.robotHand.rotateForearm(-60, 20, false, () => {
                            this.processScript();
                        });
                    },
                    this.addProcessScriptDelay(5),
                    function() {
                        scene.robotHand.rotateShoulder(25, 20, false, () => {
                            this.processScript();
                        });
                    },
                    this.addProcessScriptDelay(5),
                    function() {
                        scene.robotHand.expandPalm(4, 7, () => {
                            this.processScript();
                        });
                    },
                    this.addProcessScriptDelay(5),
                    function() {
                        scene.robotHand.take(scene.demoCargo);
                        this.processScript();
                    },
                    // this.addProcessScriptDelay(5),
                    // function() {
                    //     scene.robotHand.rotatePalm(-90, 20, true, () => {
                    //         this.processScript();
                    //     });
                    // },
                    this.addProcessScriptDelay(5),
                    function() {
                        scene.robotHand.rotateShoulder(-25, 20, false, () => {
                            this.processScript();
                        });
                    },
                    
                    this.addProcessScriptDelay(5),
                      function() {
                        scene.robotHand.rotateForearm(60, 20, false, () => {
                            this.processScript();
                        });
                    },
                    // this.addProcessScriptDelay(5),
                    // function() {
                    //     scene.robotHand.rotatePalm(90, 20, true, () => {
                    //         this.processScript();
                    //     });
                    // },
                    this.addProcessScriptDelay(5),
                    function() {
                        scene.robotHand.rotateShoulder(80, 20, false, () => {
                            this.processScript();
                        });
                    },
                    this.addProcessScriptDelay(5),
                      function() {
                        scene.robotHand.rotateForearm(-20, 20, false, () => {

                            let p = scene.demoCargo.getAbsolutePosition();
                            scene.demoCargoAlter = scene.createCargo();
                            scene.demoCargoAlter.position = p
 
                            scene.addGo(scene.demoCargoAlter, 2);

                            this.processScript();
                        });
                    },
                    this.addProcessScriptDelay(5),
                    function() {
                        scene.robotHand.expandPalm(8, 7, () => {
                           // 
                        });
                        //scene.demoCargo.position = p;
                        this.processScript();
                    },
                    function() {   
                        scene.demoCargo.parent.removeChild(scene.demoCargo);
                        this.processScript();
                    },
                    function() {
                        scene.demoCargoAlter.fall(() => { 
                            this.processScript();
                         })
                    },
                    function() {   
                        scene.demoCargoAlter.moveOut(function () {
                            this.setDead();
                        });

                        scene.demoCargo = undefined;
                        this.processScript();
                    },
                    function(){
                        scene.demoCargo = scene.addGo(scene.createCargo());
                        this.processScript();
                    },
                    function(){
                        scene.cargoCount--;
                        if(scene.cargoCount == 0){
                            this.processScript();
                        }
                        else {
                            this.takeItem();
                        }
                        
                    }
                ]

                this.delayTimer = this.registerTimer(createTimer(2000, () => {
                    this.unregTimer(this.delayTimer);
                    this.takeItem();
                }, this, false));

                
                
                // this.script.items = [
                    
                //     this.addProcessScriptDelay(500),
                //     function() {
                //         scene.robotHand.rotateShoulder(-90, 30, () => {
                //             this.processScript();
                //         });
                //     },
                    
                // ]

                // this.processScript();
              
            },
            takeItem() {
                this.script.items = [...this.takeSequence];
                this.processScript();
            }
        }))
        
    }
}

class RobotHand extends GO {
    constructor(options = {}) {
        options = assignDeep({}, {
            renderValuesRound: true,
            size: new V2(40,40)
        }, options)

        super(options);
    }
    rotatePalm(angle, duration = 100, rotateChild = true, callback = () => {}) {
        this.shoulderHolder.rotatePalm(angle, duration, rotateChild, callback);
    }
    expandPalm(value, duration = 10, callback = () => {}) {
        this.shoulderHolder.expandPalm(value, duration, callback);
    }
    rotateForearm(angle, duration = 100, rotateChild = true, callback = () => {}) {
        this.shoulderHolder.rotateForearm(angle, duration, rotateChild, callback);
    }
    rotateShoulder(angle, duration = 100, rotateChild = true, callback = () => {}) {
        this.shoulderHolder.rotateShoulder(angle, duration, rotateChild, callback);
    }
    take(go) {
        this.shoulderHolder.take(go);
    }
    init(){

        this.holder = this.addChild(new GO({
            position: new V2(0, -20), 
            size: new V2(this.parentScene.viewport.x*2,6),
            img: createCanvas(new V2(1,6), (ctx,size, hlp) => {
                hlp.setFillColor('#3C4858').rect(0,0,1,2).setFillColor('#273039').rect(0,2,1,6);
            })
        }))

        this.baseMent = this.addChild(new GO({
            position: new V2(0,0),
            size: new V2(40,40),
            img: PP.createImage(rotationSceneModels.basement)
        }))

        this.shoulderHolder = this.addChild(new GO({
            position: new V2(0,4),
            size: new V2(120, 120),
            rotatePalm(angle, duration = 100, rotateChild = true, callback = () => {}) {
                this.forearmHolder.rotatePalm(angle, duration, rotateChild, callback);
            },
            expandPalm(value, duration = 10, callback = () => {}) {
                this.forearmHolder.expandPalm(value, duration, callback);
            },
            take(go) {
                this.forearmHolder.take(go) ;
            },
            rotateForearm(angle, duration = 100, rotateChild = true, callback = () => {}) {
                this.forearmHolder.rotateForearm(angle, duration, rotateChild, callback);
            },
            rotateShoulder(angle, duration = 100, rotateChild = true, callback = () => {}) {
                this.shoulder.rotate(angle, duration, rotateChild, callback);
            },
            init() {
                // forearm
                this.forearmHolder = this.addChild(new GO({
                    position: new V2(0, 45),
                    size: this.size,
                    rotatePalm(angle, duration = 100, rotateChild = true,callback = () => {}) {
                        this.palmHolder.rotate(angle, duration, rotateChild, callback);
                    },
                    expandPalm(value, duration = 10, callback = () => {}) {
                        this.palmHolder.expand(value, duration, callback);
                    },
                    rotateForearm(angle, duration = 100, rotateChild = true, callback = () => {}) {
                        this.forearm.rotate(angle, duration, rotateChild, callback);
                    },
                    take(go){
                        this.palmHolder.take(go);
                    },
                    init() {
                        //
                        this.palmHolder = this.addChild(new GO({
                            position: new V2(0, 45),
                            size: new V2(60,60),
                            expand(value, duration,callback = () => {}) {
                                this.palm.expand(value, duration, callback);
                            },
                            rotate(angle, duration = 100, rotateChild = true,callback = () => {}){
                                this.palm.rotate(angle, duration, rotateChild, callback);
                            },
                            take(go) {
                                this.palm.take(go);
                            },
                            init() {
                                this.originPosition = this.position.clone();
                                this.palm = this.addChild(new GO({
                                    position: new V2(0,0),
                                    size: this.size,
                                    angle: 0,
                                    rotationOrigin: new V2(15, 0),
                                    renderValuesRound: true,
                                    currentExpand: 8,
                                    init() {
                                        this.imgCenter = this.size.mul(0.5).toInt();
                                        this.createImage();

                                        this.timer = this.regTimerDefault(30, () => {
                                            let needRecreateImg = false;
                                            if(this.eChange){
                                                this.currentExpand = easing.process(this.eChange);
                                                this.eChange.time++;
                                                needRecreateImg = true;

                                                if(this.eChange.time > this.eChange.duration){
                                                    this.eChange = undefined;
                                                    this.expandCompleteCallback();
                                                    this.expandCompleteCallback = undefined;
                                                }
                                            }

                                            if(this.aChange) {
                                                this.angle = easing.process(this.aChange);
                                                this.aChange.time++
                                                needRecreateImg = true;

                                                if(this.aChange.time > this.aChange.duration){
                                                    this.aChange = undefined;
                                                    this.rotateCompleteCallback();
                                                    this.rotateCompleteCallback = undefined;
                                                }
                                            }

                                            if(needRecreateImg){
                                                this.createImage();
                                                if(this.childrenGO.length){
                                                    this.rotateCargoPosition();
                                                }
                                                
                                            }
                                        })
                                    },
                                    rotateCargoPosition() {
                                        this.childrenGO[0].position = this.childrenGO[0].originPosition.rotate(this.angle, false)//.toInt();
                                        this.childrenGO[0].needRecalcRenderProperties = true;
                                    },
                                    createImage() {
                                        let model = rotationSceneModels.palm();
                                        model.general.size = this.size;
                                        model.main.layers[1].points.forEach(p => {
                                            p.point.x+=this.currentExpand;
                                        });

                                        model.main.layers[2].points.forEach(p => {
                                            p.point.x-=this.currentExpand;
                                        });
                                        
                                        model.main.layers.forEach(l => {
                                            l.points.forEach(p => {
                                                let v2 = new V2(p.point);
                                                v2.substract(this.rotationOrigin, true).rotate(this.angle, false, true).add(this.imgCenter, true).toInt(true);
                                                p.point.x = v2.x;
                                                p.point.y = v2.y;
                                            })
                                        })
                        
                                        this.img = PP.createImage(model);
                                    },
                                    take(go) {
                                        //console.log(this.getAbsolutePosition().substract(go.position));
                                        go.setDead();
                                        go.afterDead = () => {
                                            go.position = this.getAbsolutePosition().substract(go.position).mul(-1);
                                            go.alive = true;
                                            this.addChild(go);
                                            go.needRecalcRenderProperties = true;
                                            go.originPosition = go.position.clone();
                                            go.afterDead = () => {}
                                        }
                                        //
                                        
                                        //this.parent.parent.parent.parent.parentScene.removeGo(go);
                                    },
                                    rotate(angle, duration = 100, rotateChild = true, callback = () => {}){
                                        this.aChange = easing.createProps(duration, this.angle, this.angle + angle, 'quad', 'inOut');
                                        console.log('Palm rotation created', this.aChange);
                                        this.rotateCompleteCallback = callback;

                                        if(rotateChild && this.childrenGO.length){
                                            this.childrenGO[0].rotate(angle, duration);
                                        }
                                    },
                                    expand(value, duration = 10, callback = () => {}) {
                                        if(value > 10)
                                            value = 10;

                                        this.eChange = easing.createProps(duration, this.currentExpand, value, 'quad', 'in');
                                        this.expandCompleteCallback = callback;
                                    }
                                }));
                            }
                        }));

                        this.originPosition = this.position.clone();
                        this.forearm = this.addChild(new GO({
                            position: new V2(0,0),
                            size: this.size,
                            angle: 0,
                            rotationOrigin: new V2(10, 6),
                            renderValuesRound: true,
                            palmHolder: this.palmHolder,
                            init() {
                                this.imgCenter = this.size.mul(0.5).toInt();
                                this.createImage();
                                this.rotatePalmPosition();

                                this.timer = this.regTimerDefault(30, () => {

                                    if(this.aChange){
                                        this.angle = fast.r(easing.process(this.aChange));
                                        this.aChange.time++;
                                        this.createImage();
                                        
                                        this.rotatePalmPosition();
                    
                                        if(this.aChange.time > this.aChange.duration){
                                            this.aChange = undefined;
                                            this.rotateCompleteCallback();
                                            this.rotateCompleteCallback = undefined;
                                        }
                                    }
                                    
                                })
                            },
                            rotate(angle, duration = 100, rotateChild = true, callback = () => {}){
                                this.aChange = easing.createProps(duration, this.angle, this.angle + angle, 'quad', 'inOut');
                                console.log('Forearm rotation created', this.aChange);
                                this.rotateCompleteCallback = callback;

                                if(rotateChild){
                                    this.palmHolder.rotate(angle, duration);
                                }
                            },
                            rotatePalmPosition() {
                                this.palmHolder.position = this.palmHolder.originPosition.rotate(this.angle, false)//.toInt();
                                this.palmHolder.needRecalcRenderProperties = true;
                            },
                            createImage() {
                                let model = rotationSceneModels.forearm();
                                model.general.size = this.size;
                                model.main.layers.forEach(l => {
                                    l.points.forEach(p => {
                                        let v2 = new V2(p.point);
                                        v2.substract(this.rotationOrigin, true).rotate(this.angle, false, true).add(this.imgCenter, true).toInt(true);
                                        p.point.x = v2.x;
                                        p.point.y = v2.y;
                                    })
                                })
                
                                this.img = PP.createImage(model);
                            }
                        }))
                    }
                }));

                this.shoulder = this.addChild(new GO({
                    position: new V2(0,0),
                    size: this.size,
                    angle: -45,
                    rotationOrigin: new V2(10, 6),
                    forearmHolder: this.forearmHolder,
                    renderValuesRound: true,
                    init() {
                        this.imgCenter = this.size.mul(0.5).toInt();
                        this.createImage();
                        this.rotateForearmPosition();
                        this.timer = this.regTimerDefault(30, () => {
                            if(this.aChange){
                                this.angle = easing.process(this.aChange);
                                this.rotateForearmPosition();
                                this.aChange.time++
                                this.createImage();
            
                                if(this.aChange.time > this.aChange.duration){
                                    this.aChange = undefined;
                                    this.rotateCompleteCallback();
                                    this.rotateCompleteCallback = undefined;
                                }
                            }
                            
                        })
                    },
                    rotate(angle, duration = 100, rotateChild = true, callback = () => {}){
                        this.aChange = easing.createProps(duration, this.angle, this.angle + angle, 'quad', 'inOut');
                        console.log('Shoulder rotation created', this.aChange);
                        this.rotateCompleteCallback = callback;
                        if(rotateChild){
                            this.forearmHolder.rotateForearm(angle, duration, rotateChild);
                        }
                    },
                    rotateForearmPosition() {
                        this.forearmHolder.position = this.forearmHolder.originPosition.rotate(this.angle, false)//.toInt();
                        this.forearmHolder.needRecalcRenderProperties = true;
                        //this.forearmHolder.forearm.canUpdateImg = true;
                        //this.forearmHolder.nextposition = this.forearmHolder.originPosition.rotate(this.angle, false)
                        
                    },
                    createImage() {
                        let model = rotationSceneModels.shoulder();
                        model.general.size = this.size;
                        model.main.layers.forEach(l => {
                            l.points.forEach(p => {
                                let v2 = new V2(p.point);
                                v2.substract(this.rotationOrigin, true).rotate(this.angle, false, true).add(this.imgCenter, true).toInt(true);
                                p.point.x = v2.x;
                                p.point.y = v2.y;
                            })
                        })
        
                        this.img = PP.createImage(model);
                    }
                }))
            }
        }))
    }
}