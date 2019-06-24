class RotationScene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            debug: {
                enabled: false,
                showFrameTimeLeft: true,
                additional: [],
            },
            imgCache: []
        }, options)

        super(options);

    }

    backgroundRender() {
        this.backgroundRenderDefault();
    }

    getModel() {
        return {"general":{"originalSize":{"x":40,"y":40},"size":{"x":40,"y":40},"zoom":6,"showGrid":true},"main":{"layers":[{"order":0,"type":"lines","strokeColor":"#FF0000","fillColor":"#00ff00","closePath":true,"fill":true,"visible":true,"clear":false,"points":[{"point":{"x":19,"y":13}},{"point":{"x":28,"y":28}},{"point":{"x":11,"y":28}}]}]}}
    }

    start(){
        this.robotHand = this.addGo(new RobotHand({
            position: new V2(this.sceneCenter.x, 100),
        }))

        this.demoCargo = this.addGo(new GO({
            position: new V2(320, 150),
            size: new V2(20,20),
            init() {
                this.imgCenter = this.size.mul(0.5).toInt();
                this.createImage();
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
        }))

        this.sceneManager = this.addGo(new GO({
            position: new V2(),
            size: new V2(1,1),
            init() {
                let scene = this.parentScene;
                this.takeSequence = [
                    this.addProcessScriptDelay(500),
                    function() {
                        scene.robotHand.rotateForearm(90, 15, () => {
                            this.processScript();
                        });
                    },
                    this.addProcessScriptDelay(50),
                    function() {
                        scene.robotHand.rotateShoulder(-90, 10, () => {
                            this.processScript();
                        });

                        scene.robotHand.rotateForearm(-130, 10);
                    },
                    this.addProcessScriptDelay(50),
                    function() {
                        scene.robotHand.rotateShoulder(35, 100, () => {
                            this.processScript();
                        });

                        //scene.robotHand.rotateForearm(5, 100);
                    }
                ]

                this.takeItem();
                /*
                this.script.items = [
                    
                    this.addProcessScriptDelay(500),
                    function() {
                        scene.robotHand.rotateShoulder(-45, 15, () => {
                            this.processScript();
                        });
                    },
                    function() {
                        scene.robotHand.rotateForearm(-90, 25, () => {
                            this.processScript();
                        });
                    },
                    function() {
                        scene.robotHand.rotatePalm(-90, 20, () => {
                            this.processScript();
                        });
                    },
                    this.addProcessScriptDelay(100),
                    function() {
                        scene.robotHand.expandPalm(10, 10, () => {
                            this.processScript();
                        });
                    },
                    this.addProcessScriptDelay(1000),
                    function() {
                        scene.robotHand.rotatePalm(45, 10, () => {
                            this.processScript();
                        });
                    },
                    this.addProcessScriptDelay(100),
                    function() {
                        scene.robotHand.expandPalm(0, 10, () => {
                            this.processScript();
                        });
                    },
                ]

                this.processScript();
                */
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
    rotatePalm(angle, duration = 100, callback = () => {}) {
        this.shoulderHolder.rotatePalm(angle, duration, callback);
    }
    expandPalm(value, duration = 10, callback = () => {}) {
        this.shoulderHolder.expandPalm(value, duration, callback);
    }
    rotateForearm(angle, duration = 100, callback = () => {}) {
        this.shoulderHolder.rotateForearm(angle, duration, callback);
    }
    rotateShoulder(angle, duration = 100, callback = () => {}) {
        this.shoulderHolder.rotateShoulder(angle, duration, callback);
    }
    init(){
        this.baseMent = this.addChild(new GO({
            position: new V2(0,0),
            size: new V2(40,40),
            img: PP.createImage(rotationSceneModels.basement)
        }))

        this.shoulderHolder = this.addChild(new GO({
            position: new V2(0,4),
            size: new V2(120, 120),
            rotatePalm(angle, duration = 100, callback = () => {}) {
                this.forearmHolder.rotatePalm(angle, duration, callback);
            },
            expandPalm(value, duration = 10, callback = () => {}) {
                this.forearmHolder.expandPalm(value, duration, callback);
            },
            rotateForearm(angle, duration = 100, callback = () => {}) {
                this.forearmHolder.rotateForearm(angle, duration, callback);
            },
            rotateShoulder(angle, duration = 100, callback = () => {}) {
                this.shoulder.rotate(angle, duration, callback);
            },
            init() {
                // forearm
                this.forearmHolder = this.addChild(new GO({
                    position: new V2(0, 45),
                    size: this.size,
                    rotatePalm(angle, duration = 100, callback = () => {}) {
                        this.palmHolder.rotate(angle, duration, callback);
                    },
                    expandPalm(value, duration = 10, callback = () => {}) {
                        this.palmHolder.expand(value, duration, callback);
                    },
                    rotateForearm(angle, duration = 100, callback = () => {}) {
                        this.forearm.rotate(angle, duration, callback);
                    },
                    init() {
                        //
                        this.palmHolder = this.addChild(new GO({
                            position: new V2(0, 45),
                            size: new V2(60,60),
                            expand(value, duration,callback = () => {}) {
                                this.palm.expand(value, duration, callback);
                            },
                            rotate(angle, duration = 100, callback = () => {}){
                                this.palm.rotate(angle, duration, callback);
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
                                            }
                                        })
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
                                    rotate(angle, duration = 100, callback = () => {}){
                                        this.aChange = easing.createProps(duration, this.angle, this.angle + angle, 'quad', 'inOut');
                                        this.rotateCompleteCallback = callback;
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
                                        this.angle = easing.process(this.aChange);
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
                            rotate(angle, duration = 100, callback = () => {}){
                                this.aChange = easing.createProps(duration, this.angle, this.angle + angle, 'quad', 'inOut');
                                this.rotateCompleteCallback = callback;
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
                        // this.aChange = easing.createProps(200, -45, 45, 'quad', 'inOut');
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
                    rotate(angle, duration = 100, callback = () => {}){
                        this.aChange = easing.createProps(duration, this.angle, this.angle + angle, 'quad', 'inOut');
                        this.rotateCompleteCallback = callback;
                    },
                    rotateForearmPosition() {
                        this.forearmHolder.position = this.forearmHolder.originPosition.rotate(this.angle, false)//.toInt();
                        this.forearmHolder.needRecalcRenderProperties = true;
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