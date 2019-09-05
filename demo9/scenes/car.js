class CarCommissionScene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            debug: {
                enabled: false,
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
        // bg
        this.bg = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.sky = {
                    colorTo: [282, 13, 19],
                    colorFrom: [282, 37, 3],
                    yTo: 200
                }

                
                this.colorsChange = {
                    s: easing.createProps(this.sky.yTo, this.sky.colorFrom[1], this.sky.colorTo[1], 'quad', 'in'),
                    v: easing.createProps(this.sky.yTo, this.sky.colorFrom[2], this.sky.colorTo[2], 'quad', 'in')
                }

                this.bgImg = createCanvas(this.size, (ctx, size, hlp) => {
                	for(let y = 0; y <=this.sky.yTo; y++){
                		this.colorsChange.s.time = y;
                		this.colorsChange.v.time = y;

                		let s = fast.r(easing.process(this.colorsChange.s));
                		let v = fast.r(easing.process(this.colorsChange.v));
                		hlp.setFillColor(colors.hsvToHex([this.sky.colorTo[0], s,v])).rect(0,y,size.x, 1);
                	}

                	hlp.rect(0, this.sky.yTo, size.x, size.y);
                })

				this.layer3BGen = ({ hlp,  leftX = 10, width = 50, height = 200 })=> {
					let topY = this.size.y - height;
					if(width%3 != 0){
                        width+= width%3;
                    }
					
					hlp.setFillColor('#C04000').dot(leftX-1, topY-1).dot(leftX+width, topY-1).dot(leftX+width+4, topY+2)
					hlp.setFillColor('#000020').rect(leftX, topY, width, height).rect(leftX-1, topY, 1, height)
					.rect(leftX+width, topY, 1, height)
					.setFillColor('#000040').rect(leftX+width+1, topY+1, 1, height)
					.setFillColor('#000020').rect(leftX+width+2, topY+2, 1, height)
					.setFillColor('#000040').rect(leftX+width+3, topY+3, 1, height)

					let count = fast.r(height/8);
                    let currentY = 0;
                    for(let i = 0; i< count;i++){
                        hlp.setFillColor('#002040').rect(leftX+width+1, topY+currentY + 1+1, 1,4).rect(leftX+width+1, topY+currentY + 1+6, 1,2)
                        hlp.setFillColor('#002040').rect(leftX+width+3, topY+currentY + 3+1, 1,4).rect(leftX+width+3, topY+currentY + 3+6, 1,2)

                        currentY+=8;
                    }

					count = fast.r(width/3);
					currentY = 1;
					while(currentY < height){
						//hlp.setFillColor('#000040').rect(leftX, topY+currentY+1, width, 1)
						let currentX = 0;
						for(let i = 0; i<count;i++){

							if(getRandomInt(0,2) == 0){
								hlp.setFillColor('#002040').rect(leftX+currentX, topY+currentY, 2, 2)
							}

							if(getRandomBool()){
								hlp.setFillColor('#004060').rect(leftX+currentX, topY+currentY, getRandomInt(1,2), 1)
							}

							currentX+=3;
						}
						
						currentY+=2;
					}
				}

                this.layer2BGen = ({ hlp,  leftX = 10, width = 50, height = 200 })=> {
                    let topY = this.size.y - height;
                    if(width%4 != 0){
                        width+= width%4;
                    }
                    let windowColors1 = {
                        upper: '#A06020', lower: '#604040', corner: '#C0C080'
                    }

                    let windowColors2 = {
                        upper: '#008080', lower: '#006080', corner: '#008080'
                    }

                    let c1Height = fast.r(height*0.1);

                    hlp.setFillColor('#002040').rect(leftX, topY, width, height)
                    .setFillColor('#006080').rect(leftX+width, topY,1,height)
                    .setFillColor('#002040').rect(leftX+width+1, topY,1,height)
                    .setFillColor('#000040').rect(leftX+width+2, topY+1,1,height)
                    .setFillColor('#000').rect(leftX+width+3, topY+1,1,height)
                    .setFillColor('#000020').rect(leftX+width+4, topY+2,1,height)
                    .setFillColor('#000').rect(leftX+width+5, topY+2,1,height)
                    .setFillColor('#000020').rect(leftX+width+6, topY+3,1,height)
                    .setFillColor('#000').rect(leftX+width+7, topY+3,1,height)
                    .setFillColor('#C04000').dot(leftX+1, topY-1, 1,1).dot(leftX+width-1, topY-1).dot(leftX+fast.r(width/2)-2, topY-1).dot(leftX+fast.r(width/2)+2, topY-1).dot(leftX+width+7, topY+2)

                    let count = fast.r(height/8);
                    let currentY = 0;
                    for(let i = 0; i< count;i++){
                        hlp.setFillColor('#004060').rect(leftX+width+2, topY+currentY + 2, 1,1).rect(leftX+width+2, topY+currentY + 6, 1,1)
                        .setFillColor('#002040').rect(leftX+width+2, topY+currentY + 3, 1,1).rect(leftX+width+2, topY+currentY + 5, 1,1)

                        hlp.setFillColor('#002040').rect(leftX+width+4, topY+currentY + 2, 1,1).rect(leftX+width+4, topY+currentY + 2 + 2, 1,4)

                        hlp.setFillColor('#000040').rect(leftX+width+6, topY+currentY + 3, 1,2).rect(leftX+width+6, topY+currentY + 4 + 3, 1,1)
                        currentY+=8;
                    }

                    currentY = getRandomInt(2,3)*2;
                    while(currentY < height){
                        let currentX = 1;
                        let count = width/4;
                        for(let i = 0; i < count;i++){
                            if(getRandomInt(0,4) > 0){
                                let colorGroup = currentY <= c1Height ? windowColors1 : windowColors2;
                                hlp.setFillColor(colorGroup.lower).rect(currentX + leftX, currentY + topY, 3, 2)

                                if(getRandomInt(0,6) == 0){
                                    colorGroup = windowColors1
                                }

                                hlp.setFillColor(colorGroup.upper).rect(currentX + leftX, currentY + topY, 3, 1)
                                hlp.setFillColor(colorGroup.corner).rect(currentX + leftX, currentY + topY, 1, 1)
                            }

                            currentX+=4;
                        }

                        currentY+=4;
                    }
                }
                
                this.frontalBGen = ({ hlp,  leftX = 10, width = 50, height = 100 }) => {
                    let mainWindowColors = ['#A06020', '#C0C080']
                    let secondaryWindowColors = ['#604040', '#002040']
                    let topY = this.size.y - height;
                    let secondPartTy = topY + getRandomInt(2,5)*2
                    hlp.setFillColor('#000').rect(leftX, topY, width, height)
                        .rect(leftX + fast.r(width/2), secondPartTy, fast.r(width), height);
                    
                    if(getRandomBool()) {
                        hlp.rect(leftX + 2, topY-1, width+getRandomInt(-6, 6), height)
                    }

                    let _c = getRandomInt(0,5);
                    for(let i = 0; i < _c;i++){
                        let tx = leftX + getRandomInt(4, width*1.5 - 4);
                        let ty = topY - getRandomInt(3,6);
                        
                        if(tx > leftX+width){
                            ty = secondPartTy - getRandomInt(3,6)
                        }

                        let w = getRandomInt(1,3);
                        hlp.rect(tx, ty, w, height)
                        .rect(tx+fast.r(w/2), ty+getRandomInt(2,4), getRandomInt(1,3), height );
                    }

                    let currentY = getRandomInt(1,5)*2;
                    let rowGroups = [1, 2];
                    let currentRowGroup = {index: 0, count: rowGroups[0]};

                    while(currentY < height){
                        let currentX = 2;
                        
                        for(let i = 0; i < 6;i++){
                            let colorGroup = getRandomInt(0, 4) == 0? secondaryWindowColors : mainWindowColors;
                            let color = colorGroup[getRandomInt(0, colorGroup.length-1)];
                            if(getRandomInt(0,3) != 0)
                                hlp.setFillColor(color).rect(leftX + currentX, currentY+topY, 1,1)

                            currentX+=2;
                            if(i == 2){
                                currentX++;
                            }
                        }

                        hlp.setFillColor(secondaryWindowColors[0]).rect(leftX+ width*3/2 - 4, topY + currentY + 1 + 10, 1,1)

                        currentRowGroup.count--;

                        if(currentRowGroup.count == 0){
                            currentRowGroup.index++;
                            if(currentRowGroup.index >= rowGroups.length){
                                currentRowGroup.index = 0;
                            }

                            currentRowGroup.count = rowGroups[currentRowGroup.index];
                            currentY+=4;
                        }
                        else {
                            currentY+=2;
                        }

                        
                    }
                }

                this.bGen = ({hlp, leftX = 10, width = 50, height = 150, windowSize = new V2(3, 2), windowGap = 1, fillColor = '#000000',
                              redLight = '#C04000', windowColorMain = '#006080', windowColorSecondary = '#004060', sideColorMain = '#000020', sideColorSecondary = '#000040'}
                    ) =>  {
                              

                	let topY = this.size.y - height;
					hlp.setFillColor(fillColor).rect(leftX, topY, width, height)
                	hlp.setFillColor(redLight).rect(leftX+5, topY-1, 1, 1).rect(leftX+width-5, topY-1, 1,1);
					hlp.setFillColor(sideColorMain).rect(leftX + width - 3,topY + 1, 2, height);		
                	let currentY = 4;
                	let sideSecondary = true;
                	while(currentY < height){
                		let currentX = 2;
                		while(currentX < (width-(windowSize.x + windowGap))){
                			if(getRandomInt(0,4) != 0){
                				hlp.setFillColor(windowColorMain).rect(currentX+leftX,currentY+topY, windowSize.x, 1)
                				.setFillColor(windowColorSecondary).rect(currentX+leftX,currentY+topY+1, windowSize.x, 1)

                			}

                			currentX+=windowSize.x + windowGap;
                		}

                		if(sideSecondary){
                			hlp.setFillColor(sideColorSecondary).rect(leftX + width - 3,topY + 1 + currentY, 2, 2)
                		}

                		sideSecondary = !sideSecondary;

                		currentY+=4;
                	}
                }

                this.frontalBLayerImg =  createCanvas(this.size, (ctx, size, hlp) => {
                    let buildings = [{x: 10, height: getRandomInt(100, 140), width: 20}, {x: 45, height: getRandomInt(100, 140), width: 30},
                        {x: 100, height: getRandomInt(100, 140), width: 25}, {x: 150, height: getRandomInt(120, 160), width: 30}, {x: 185, height: getRandomInt(100, 140), width: 35},
                        {x: 245, height: getRandomInt(100, 140), width: 22}, {x: 295, height: getRandomInt(130, 170), width: 25}, {x: 335, height: getRandomInt(110, 130), width: 20},
                        {x: 390, height: getRandomInt(90, 120), width: 25}, {x: 440, height: getRandomInt(100, 140), width: 30}]

                    for(let i = 0; i < buildings.length; i++){
                        let b = buildings[i];
                        this.frontalBGen({ hlp, leftX: b.x, width: b.width, height: b.height})
                    }
                });

                this.buildingLayer2Img =  createCanvas(this.size, (ctx, size, hlp) => {
                    let buildings = [{x: 30, height: getRandomInt(150, 200), width: 40},{x: 120, height: getRandomInt(150, 200), width: 50},
                    {x: 200, height: getRandomInt(150, 200), width: 50}, {x: 320, height: getRandomInt(150, 220), width: 60},{x: 420, height: getRandomInt(150, 220), width: 40}
                        ]

                    for(let i = 0; i < buildings.length; i++){
                        let b = buildings[i];
                        this.layer2BGen({ hlp, leftX: b.x, width: b.width, height: b.height})
                    }
                });

                this.buildingLayer3Img =  createCanvas(this.size, (ctx, size, hlp) => {
                    let buildings = [{x: 60, height: getRandomInt(180, 250), width: 20}, {x: 250, height: getRandomInt(180, 250), width: 20}, {x: 380, height: getRandomInt(180, 250), width: 20}
                        ]

                    for(let i = 0; i < buildings.length; i++){
                        let b = buildings[i];
                        this.layer3BGen({ hlp, leftX: b.x, width: b.width, height: b.height})
                    }
                });

                this.farBuildingLayerImg = createCanvas(this.size, (ctx, size, hlp) => {
                	let currentX = 5; 
                    let bannerBarroIndex = getRandomInt(1,2);
                    let bannerEsIndex = getRandomInt(3,4);
                    let index = 0;
                	while(currentX < this.size.x){
                		let width = getRandomInt(4, 8)*10;
                		if(currentX+width > this.size.x) {
                            width = this.size.x - currentX - 5;
                            if(width < 10) break;
                        }

                        let height = getRandomInt(13,18)*10;
                		this.bGen({hlp,leftX: currentX, width, height })
                		
                        if(bannerBarroIndex == index) {
                            let topY = this.size.y - height;

                            ctx.drawImage(PP.createImage(
                                {"general":{"originalSize":{"x":40,"y":20},"size":{"x":40,"y":20},"zoom":10,"showGrid":false},"main":{"layers":[{"order":0,"type":"lines","strokeColor":"#dadada","fillColor":"#eaeaea","closePath":true,"fill":true,"visible":true,"clear":false,"points":[{"point":{"x":0,"y":2}},{"point":{"x":2,"y":0}},{"point":{"x":37,"y":0}},{"point":{"x":39,"y":2}},{"point":{"x":39,"y":17}},{"point":{"x":37,"y":19}},{"point":{"x":2,"y":19}},{"point":{"x":0,"y":17}}]},{"order":1,"type":"lines","strokeColor":"#030303","fillColor":"#030303","closePath":false,"fill":false,"visible":true,"clear":false,"points":[{"point":{"x":3,"y":4}},{"point":{"x":3,"y":10}},{"point":{"x":6,"y":10}},{"point":{"x":7,"y":9}},{"point":{"x":7,"y":8}},{"point":{"x":6,"y":7}},{"point":{"x":4,"y":7}},{"point":{"x":6,"y":7}},{"point":{"x":7,"y":6}},{"point":{"x":6,"y":4}},{"point":{"x":4,"y":4}}]},{"order":2,"type":"lines","strokeColor":"#030303","fillColor":"#030303","closePath":false,"fill":false,"visible":true,"clear":false,"points":[{"point":{"x":9,"y":10}},{"point":{"x":11,"y":4}},{"point":{"x":14,"y":4}},{"point":{"x":14,"y":10}},{"point":{"x":14,"y":8}},{"point":{"x":11,"y":8}}]},{"order":3,"type":"lines","strokeColor":"#030303","fillColor":"#030303","closePath":false,"fill":false,"visible":true,"clear":false,"points":[{"point":{"x":16,"y":10}},{"point":{"x":16,"y":4}},{"point":{"x":19,"y":4}},{"point":{"x":20,"y":5}},{"point":{"x":20,"y":6}},{"point":{"x":19,"y":7}},{"point":{"x":17,"y":7}},{"point":{"x":18,"y":7}},{"point":{"x":20,"y":9}},{"point":{"x":20,"y":10}}]},{"order":4,"type":"lines","strokeColor":"#030303","fillColor":"#030303","closePath":false,"fill":false,"visible":true,"clear":false,"points":[{"point":{"x":22,"y":10}},{"point":{"x":22,"y":4}},{"point":{"x":25,"y":4}},{"point":{"x":26,"y":5}},{"point":{"x":26,"y":6}},{"point":{"x":25,"y":7}},{"point":{"x":23,"y":7}},{"point":{"x":24,"y":7}},{"point":{"x":26,"y":9}},{"point":{"x":26,"y":10}}]},{"order":5,"type":"lines","strokeColor":"#030303","fillColor":"#030303","closePath":false,"fill":false,"visible":true,"clear":false,"points":[{"point":{"x":32,"y":5}},{"point":{"x":32,"y":9}},{"point":{"x":33,"y":10}},{"point":{"x":35,"y":10}},{"point":{"x":36,"y":9}},{"point":{"x":36,"y":5}},{"point":{"x":35,"y":4}},{"point":{"x":33,"y":4}}]},{"order":6,"type":"lines","strokeColor":"#030303","fillColor":"#030303","closePath":false,"fill":false,"visible":true,"clear":false,"points":[{"point":{"x":29,"y":1}},{"point":{"x":29,"y":15}}]},{"order":7,"type":"dots","strokeColor":"#030303","fillColor":"#FF0000","closePath":false,"fill":false,"visible":true,"clear":false,"points":[{"point":{"x":33,"y":14}},{"point":{"x":36,"y":15}},{"point":{"x":22,"y":14}},{"point":{"x":30,"y":11}},{"point":{"x":30,"y":12}},{"point":{"x":30,"y":13}},{"point":{"x":30,"y":14}},{"point":{"x":31,"y":14}},{"point":{"x":28,"y":14}},{"point":{"x":28,"y":13}},{"point":{"x":28,"y":12}}]},{"order":8,"type":"lines","strokeColor":"#030303","fillColor":"#030303","closePath":true,"fill":true,"visible":true,"clear":false,"points":[{"point":{"x":2,"y":16}},{"point":{"x":38,"y":16}},{"point":{"x":34,"y":16}},{"point":{"x":33,"y":15}},{"point":{"x":28,"y":15}},{"point":{"x":27,"y":14}},{"point":{"x":24,"y":14}},{"point":{"x":23,"y":15}},{"point":{"x":19,"y":15}},{"point":{"x":18,"y":15}},{"point":{"x":18,"y":13}},{"point":{"x":18,"y":16}},{"point":{"x":17,"y":16}},{"point":{"x":16,"y":15}},{"point":{"x":14,"y":15}},{"point":{"x":14,"y":13}},{"point":{"x":13,"y":14}},{"point":{"x":12,"y":14}},{"point":{"x":11,"y":12}},{"point":{"x":10,"y":13}},{"point":{"x":9,"y":13}},{"point":{"x":8,"y":12}},{"point":{"x":7,"y":13}},{"point":{"x":6,"y":13}},{"point":{"x":5,"y":14}},{"point":{"x":3,"y":15}}]},{"order":9,"type":"dots","strokeColor":"#eaeaea","fillColor":"#FF0000","closePath":false,"fill":false,"visible":true,"clear":false,"points":[{"point":{"x":9,"y":13}},{"point":{"x":5,"y":14}},{"point":{"x":27,"y":14}}]},{"order":10,"type":"dots","strokeColor":"#7a7a7a","fillColor":"#FF0000","closePath":false,"fill":false,"visible":true,"clear":false,"points":[{"point":{"x":4,"y":5}},{"point":{"x":4,"y":6}},{"point":{"x":4,"y":8}},{"point":{"x":4,"y":9}},{"point":{"x":6,"y":9}},{"point":{"x":6,"y":8}},{"point":{"x":6,"y":6}},{"point":{"x":6,"y":5}},{"point":{"x":10,"y":10}},{"point":{"x":10,"y":9}},{"point":{"x":13,"y":10}},{"point":{"x":13,"y":9}},{"point":{"x":13,"y":7}},{"point":{"x":13,"y":6}},{"point":{"x":13,"y":5}},{"point":{"x":12,"y":5}},{"point":{"x":11,"y":6}},{"point":{"x":11,"y":7}},{"point":{"x":17,"y":10}},{"point":{"x":17,"y":9}},{"point":{"x":17,"y":8}},{"point":{"x":17,"y":6}},{"point":{"x":17,"y":5}},{"point":{"x":19,"y":5}},{"point":{"x":19,"y":6}},{"point":{"x":18,"y":8}},{"point":{"x":19,"y":9}},{"point":{"x":19,"y":10}},{"point":{"x":23,"y":10}},{"point":{"x":23,"y":9}},{"point":{"x":23,"y":8}},{"point":{"x":23,"y":6}},{"point":{"x":23,"y":5}},{"point":{"x":25,"y":5}},{"point":{"x":25,"y":6}},{"point":{"x":24,"y":8}},{"point":{"x":25,"y":9}},{"point":{"x":25,"y":10}},{"point":{"x":33,"y":5}},{"point":{"x":33,"y":6}},{"point":{"x":33,"y":7}},{"point":{"x":33,"y":8}},{"point":{"x":33,"y":9}},{"point":{"x":35,"y":9}},{"point":{"x":35,"y":8}},{"point":{"x":35,"y":7}},{"point":{"x":35,"y":6}},{"point":{"x":35,"y":5}}]},{"order":11,"type":"dots","strokeColor":"#b1b1b1","fillColor":"#FF0000","closePath":false,"fill":false,"visible":true,"clear":false,"points":[{"point":{"x":7,"y":10}},{"point":{"x":8,"y":9}},{"point":{"x":8,"y":8}},{"point":{"x":7,"y":7}},{"point":{"x":8,"y":6}},{"point":{"x":8,"y":5}},{"point":{"x":7,"y":4}},{"point":{"x":2,"y":4}},{"point":{"x":2,"y":5}},{"point":{"x":2,"y":6}},{"point":{"x":2,"y":7}},{"point":{"x":2,"y":8}},{"point":{"x":2,"y":9}},{"point":{"x":2,"y":10}},{"point":{"x":8,"y":10}},{"point":{"x":9,"y":8}},{"point":{"x":9,"y":7}},{"point":{"x":9,"y":6}},{"point":{"x":10,"y":5}},{"point":{"x":10,"y":4}},{"point":{"x":15,"y":4}},{"point":{"x":15,"y":5}},{"point":{"x":15,"y":6}},{"point":{"x":15,"y":7}},{"point":{"x":15,"y":8}},{"point":{"x":15,"y":9}},{"point":{"x":15,"y":10}},{"point":{"x":21,"y":10}},{"point":{"x":21,"y":9}},{"point":{"x":20,"y":8}},{"point":{"x":20,"y":7}},{"point":{"x":21,"y":8}},{"point":{"x":21,"y":7}},{"point":{"x":21,"y":6}},{"point":{"x":21,"y":5}},{"point":{"x":21,"y":4}},{"point":{"x":20,"y":4}},{"point":{"x":26,"y":4}},{"point":{"x":27,"y":4}},{"point":{"x":27,"y":6}},{"point":{"x":27,"y":5}},{"point":{"x":26,"y":7}},{"point":{"x":26,"y":8}},{"point":{"x":27,"y":9}},{"point":{"x":27,"y":10}},{"point":{"x":32,"y":10}},{"point":{"x":31,"y":9}},{"point":{"x":31,"y":8}},{"point":{"x":31,"y":7}},{"point":{"x":31,"y":6}},{"point":{"x":31,"y":5}},{"point":{"x":32,"y":4}},{"point":{"x":36,"y":4}},{"point":{"x":37,"y":5}},{"point":{"x":37,"y":6}},{"point":{"x":37,"y":7}},{"point":{"x":37,"y":8}},{"point":{"x":37,"y":9}},{"point":{"x":36,"y":10}}]},{"order":12,"type":"dots","strokeColor":"#cfcfcf","fillColor":"#FF0000","closePath":false,"fill":false,"visible":false,"clear":false,"points":[{"point":{"x":5,"y":5}},{"point":{"x":5,"y":6}},{"point":{"x":5,"y":8}},{"point":{"x":5,"y":9}},{"point":{"x":12,"y":6}},{"point":{"x":12,"y":7}},{"point":{"x":11,"y":9}},{"point":{"x":12,"y":9}},{"point":{"x":12,"y":10}},{"point":{"x":11,"y":10}},{"point":{"x":18,"y":10}},{"point":{"x":18,"y":9}},{"point":{"x":18,"y":6}},{"point":{"x":18,"y":5}},{"point":{"x":24,"y":5}},{"point":{"x":24,"y":6}},{"point":{"x":24,"y":9}},{"point":{"x":24,"y":10}},{"point":{"x":34,"y":5}},{"point":{"x":34,"y":6}},{"point":{"x":34,"y":7}},{"point":{"x":34,"y":8}},{"point":{"x":34,"y":9}}]},{"order":13,"type":"lines","strokeColor":"#7a7a7a","fillColor":"#FF0000","closePath":false,"fill":false,"visible":true,"clear":false,"points":[{"point":{"x":28,"y":11}},{"point":{"x":28,"y":1}},{"point":{"x":30,"y":1}},{"point":{"x":30,"y":10}},{"point":{"x":31,"y":11}},{"point":{"x":31,"y":13}}]}]}}
                                ), currentX + (width-40)/2, topY - 22, 40, 20)
                        }

                        if(bannerEsIndex == index) {
                            let topY = this.size.y - height;

                            ctx.drawImage(PP.createImage(
                                {"general":{"originalSize":{"x":30,"y":30},"size":{"x":30,"y":30},"zoom":8,"showGrid":false},"main":{"layers":[{"order":0,"type":"lines","strokeColor":"#e0e0e0","fillColor":"#f3f3f3","closePath":true,"fill":true,"visible":true,"clear":false,"points":[{"point":{"x":0,"y":1}},{"point":{"x":1,"y":0}},{"point":{"x":28,"y":0}},{"point":{"x":29,"y":1}},{"point":{"x":29,"y":28}},{"point":{"x":28,"y":29}},{"point":{"x":1,"y":29}},{"point":{"x":0,"y":28}}]},{"order":1,"type":"lines","strokeColor":"#1B191A","fillColor":"#1B191A","closePath":true,"fill":true,"visible":true,"clear":false,"points":[{"point":{"x":5,"y":5}},{"point":{"x":13,"y":5}},{"point":{"x":11,"y":6}},{"point":{"x":23,"y":23}},{"point":{"x":24,"y":24}},{"point":{"x":16,"y":24}},{"point":{"x":18,"y":23}},{"point":{"x":7,"y":7}}]},{"order":2,"type":"lines","strokeColor":"#1B191A","fillColor":"#1B191A","closePath":true,"fill":true,"visible":true,"clear":false,"points":[{"point":{"x":16,"y":13}},{"point":{"x":24,"y":5}},{"point":{"x":17,"y":15}}]},{"order":3,"type":"lines","strokeColor":"#1B191A","fillColor":"#FF0000","closePath":false,"fill":false,"visible":true,"clear":false,"points":[{"point":{"x":13,"y":17}},{"point":{"x":12,"y":18}},{"point":{"x":8,"y":19}},{"point":{"x":9,"y":19}},{"point":{"x":11,"y":20}},{"point":{"x":11,"y":22}},{"point":{"x":9,"y":24}},{"point":{"x":8,"y":24}},{"point":{"x":6,"y":23}},{"point":{"x":6,"y":21}},{"point":{"x":7,"y":20}}]},{"order":4,"type":"dots","strokeColor":"#1B191A","fillColor":"#FF0000","closePath":false,"fill":false,"visible":true,"clear":false,"points":[{"point":{"x":5,"y":23}},{"point":{"x":4,"y":23}}]},{"order":5,"type":"dots","strokeColor":"#f3f3f3","fillColor":"#FF0000","closePath":false,"fill":false,"visible":true,"clear":false,"points":[{"point":{"x":15,"y":15}}]},{"order":6,"type":"dots","strokeColor":"#565053","fillColor":"#FF0000","closePath":false,"fill":false,"visible":true,"clear":false,"points":[{"point":{"x":16,"y":12}},{"point":{"x":15,"y":10}},{"point":{"x":14,"y":9}},{"point":{"x":12,"y":17}},{"point":{"x":9,"y":18}},{"point":{"x":3,"y":22}}]},{"order":7,"type":"dots","strokeColor":"#867d82","fillColor":"#FF0000","closePath":false,"fill":false,"visible":true,"clear":false,"points":[{"point":{"x":23,"y":22}},{"point":{"x":13,"y":8}},{"point":{"x":12,"y":15}},{"point":{"x":25,"y":24}},{"point":{"x":22,"y":9}},{"point":{"x":18,"y":15}},{"point":{"x":13,"y":18}},{"point":{"x":11,"y":19}},{"point":{"x":10,"y":24}},{"point":{"x":11,"y":23}},{"point":{"x":12,"y":22}},{"point":{"x":12,"y":21}},{"point":{"x":12,"y":20}},{"point":{"x":12,"y":6}},{"point":{"x":24,"y":23}},{"point":{"x":24,"y":6}}]},{"order":8,"type":"dots","strokeColor":"#c7c0c4","fillColor":"#FF0000","closePath":false,"fill":false,"visible":true,"clear":false,"points":[{"point":{"x":15,"y":24}},{"point":{"x":17,"y":23}},{"point":{"x":16,"y":22}},{"point":{"x":16,"y":21}},{"point":{"x":15,"y":20}},{"point":{"x":14,"y":19}},{"point":{"x":14,"y":18}},{"point":{"x":12,"y":16}},{"point":{"x":11,"y":14}},{"point":{"x":10,"y":13}},{"point":{"x":9,"y":12}},{"point":{"x":8,"y":10}},{"point":{"x":7,"y":9}},{"point":{"x":6,"y":7}},{"point":{"x":5,"y":6}},{"point":{"x":4,"y":5}},{"point":{"x":9,"y":11}},{"point":{"x":7,"y":8}}]}]}}
                                ), currentX + (width-40)/2, topY - 22, 30, 30)
                        }

                        currentX+=(width + getRandomInt(4,8));

                        index++;
                	}
                	
                })

                // this.frameCount = 10;
                // this.img = this.createImage();

                //this.framesCount = 20;

                this.totalFramesCount = 720;
                this.framesCountByLayers = [this.totalFramesCount, this.totalFramesCount/2, this.totalFramesCount/4, this.totalFramesCount/8];

                this.fXChangeByLayers = this.framesCountByLayers.map(l => easing.createProps(l-1, 0, -this.size.x, 'linear', 'base')) 

                this.frames = [];
                
                this.towerModel = 
                {"general":{"originalSize":{"x":30,"y":120},"size":{"x":30,"y":120},"zoom":2,"showGrid":false},"main":{"layers":[{"order":0,"type":"lines","strokeColor":"#675450","fillColor":"#675450","closePath":false,"fill":false,"visible":false,"clear":false,"points":[{"point":{"x":9,"y":46}},{"point":{"x":19,"y":46}},{"point":{"x":17,"y":47}},{"point":{"x":11,"y":47}}]},{"order":1,"type":"lines","strokeColor":"#4a3d39","fillColor":"#FF0000","closePath":false,"fill":false,"visible":true,"clear":false,"points":[{"point":{"x":11,"y":46}},{"point":{"x":17,"y":46}}]},{"order":2,"type":"lines","strokeColor":"#413245","fillColor":"#58445F","closePath":true,"fill":true,"visible":true,"clear":false,"points":[{"point":{"x":8,"y":119}},{"point":{"x":10,"y":108}},{"point":{"x":12,"y":92}},{"point":{"x":12,"y":86}},{"point":{"x":13,"y":26}},{"point":{"x":13,"y":18}},{"point":{"x":14,"y":2}},{"point":{"x":14,"y":18}},{"point":{"x":14,"y":35}},{"point":{"x":16,"y":70}},{"point":{"x":16,"y":92}},{"point":{"x":18,"y":108}},{"point":{"x":20,"y":119}}]},{"order":3,"type":"lines","strokeColor":"#8B77D0","fillColor":"#FF0000","closePath":false,"fill":false,"visible":true,"clear":false,"points":[{"point":{"x":14,"y":43}},{"point":{"x":14,"y":119}}]},{"order":4,"type":"lines","strokeColor":"#141d34","fillColor":"#141d34","closePath":true,"fill":true,"visible":true,"clear":false,"points":[{"point":{"x":15,"y":39}},{"point":{"x":17,"y":39}},{"point":{"x":18,"y":42}},{"point":{"x":17,"y":44}},{"point":{"x":16,"y":45}},{"point":{"x":12,"y":45}},{"point":{"x":10,"y":43}},{"point":{"x":10,"y":42}},{"point":{"x":11,"y":39}},{"point":{"x":12,"y":39}}]},{"order":5,"type":"lines","strokeColor":"#FBEEFF","fillColor":"#FF0000","closePath":false,"fill":false,"visible":true,"clear":false,"points":[{"point":{"x":10,"y":45}},{"point":{"x":12,"y":44}},{"point":{"x":16,"y":44}},{"point":{"x":18,"y":45}}]},{"order":6,"type":"lines","strokeColor":"#f3ccff","fillColor":"#FF0000","closePath":false,"fill":false,"visible":true,"clear":false,"points":[{"point":{"x":11,"y":45}},{"point":{"x":17,"y":45}}]},{"order":7,"type":"lines","strokeColor":"#0f1526","fillColor":"#FF0000","closePath":false,"fill":false,"visible":true,"clear":false,"points":[{"point":{"x":17,"y":39}},{"point":{"x":17,"y":40}},{"point":{"x":18,"y":41}},{"point":{"x":18,"y":43}},{"point":{"x":17,"y":44}}]},{"order":8,"type":"lines","strokeColor":"#1f2d50","fillColor":"#FF0000","closePath":false,"fill":false,"visible":true,"clear":false,"points":[{"point":{"x":10,"y":43}},{"point":{"x":12,"y":42}},{"point":{"x":13,"y":42}},{"point":{"x":15,"y":42}},{"point":{"x":16,"y":42}},{"point":{"x":17,"y":43}},{"point":{"x":18,"y":43}}]},{"order":9,"type":"lines","strokeColor":"#2b3e71","fillColor":"#2b3e71","closePath":true,"fill":true,"visible":true,"clear":false,"points":[{"point":{"x":13,"y":38}},{"point":{"x":13,"y":36}},{"point":{"x":15,"y":36}},{"point":{"x":15,"y":38}}]},{"order":10,"type":"lines","strokeColor":"#2d222f","fillColor":"#FF0000","closePath":false,"fill":false,"visible":true,"clear":false,"points":[{"point":{"x":14,"y":32}},{"point":{"x":14,"y":10}}]},{"order":11,"type":"lines","strokeColor":"#22325b","fillColor":"#FF0000","closePath":false,"fill":false,"visible":true,"clear":false,"points":[{"point":{"x":15,"y":36}},{"point":{"x":15,"y":38}}]},{"order":12,"type":"lines","strokeColor":"#6a5272","fillColor":"#FF0000","closePath":true,"fill":true,"visible":true,"clear":false,"points":[{"point":{"x":13,"y":35}},{"point":{"x":13,"y":32}},{"point":{"x":14,"y":32}},{"point":{"x":15,"y":35}}]},{"order":13,"type":"lines","strokeColor":"#6a5272","fillColor":"#FF0000","closePath":false,"fill":false,"visible":true,"clear":false,"points":[{"point":{"x":12,"y":22}},{"point":{"x":15,"y":22}}]},{"order":14,"type":"lines","strokeColor":"#1d151e","fillColor":"#FF0000","closePath":false,"fill":false,"visible":true,"clear":false,"points":[{"point":{"x":14,"y":2}},{"point":{"x":14,"y":6}}]},{"order":15,"type":"lines","strokeColor":"#876891","fillColor":"#FF0000","closePath":false,"fill":false,"visible":true,"clear":false,"points":[{"point":{"x":13,"y":21}},{"point":{"x":13,"y":18}},{"point":{"x":14,"y":18}},{"point":{"x":14,"y":21}}]},{"order":16,"type":"dots","strokeColor":"#876891","fillColor":"#FF0000","closePath":false,"fill":false,"visible":true,"clear":false,"points":[{"point":{"x":13,"y":13}},{"point":{"x":14,"y":13}},{"point":{"x":14,"y":9}}]},{"order":17,"type":"lines","strokeColor":"#3e2f42","fillColor":"#FF0000","closePath":true,"fill":false,"visible":true,"clear":false,"points":[{"point":{"x":15,"y":46}},{"point":{"x":15,"y":61}},{"point":{"x":16,"y":62}},{"point":{"x":16,"y":96}},{"point":{"x":16,"y":86}},{"point":{"x":15,"y":84}}]},{"order":18,"type":"lines","strokeColor":"#402d82","fillColor":"#FF0000","closePath":false,"fill":false,"visible":true,"clear":false,"points":[{"point":{"x":14,"y":46}},{"point":{"x":14,"y":60}}]},{"order":19,"type":"lines","strokeColor":"#735ac7","fillColor":"#FF0000","closePath":false,"fill":false,"visible":true,"clear":false,"points":[{"point":{"x":14,"y":61}},{"point":{"x":14,"y":86}}]},{"order":20,"type":"lines","strokeColor":"#352839","fillColor":"#FF0000","closePath":false,"fill":false,"visible":true,"clear":false,"points":[{"point":{"x":13,"y":46}},{"point":{"x":13,"y":55}},{"point":{"x":12,"y":56}},{"point":{"x":12,"y":95}},{"point":{"x":11,"y":96}},{"point":{"x":11,"y":103}},{"point":{"x":11,"y":99}},{"point":{"x":13,"y":96}},{"point":{"x":13,"y":56}}]},{"order":21,"type":"dots","strokeColor":"#ac042b","fillColor":"#FF0000","closePath":false,"fill":false,"visible":true,"clear":false,"points":[{"point":{"x":11,"y":96}},{"point":{"x":12,"y":76}},{"point":{"x":12,"y":56}},{"point":{"x":12,"y":21}},{"point":{"x":13,"y":14}},{"point":{"x":14,"y":2}},{"point":{"x":14,"y":14}},{"point":{"x":15,"y":21}},{"point":{"x":15,"y":56}},{"point":{"x":16,"y":76}},{"point":{"x":17,"y":96}}]},{"order":22,"type":"lines","strokeColor":"#e895ff","fillColor":"#FF0000","closePath":false,"fill":false,"visible":true,"clear":false,"points":[{"point":{"x":11,"y":44}},{"point":{"x":12,"y":43}},{"point":{"x":16,"y":43}},{"point":{"x":17,"y":44}}]},{"order":23,"type":"lines","strokeColor":"#0f1526","fillColor":"#FF0000","closePath":false,"fill":false,"visible":true,"clear":false,"points":[{"point":{"x":10,"y":41}},{"point":{"x":11,"y":40}},{"point":{"x":16,"y":40}}]},{"order":24,"type":"dots","strokeColor":"#5c4763","fillColor":"#FF0000","closePath":false,"fill":false,"visible":true,"clear":false,"points":[{"point":{"x":14,"y":18}},{"point":{"x":14,"y":19}},{"point":{"x":14,"y":21}},{"point":{"x":14,"y":20}},{"point":{"x":14,"y":32}},{"point":{"x":14,"y":33}},{"point":{"x":14,"y":34}},{"point":{"x":14,"y":35}}]}]}}

                this.currentFrame = 0;
                this.timer = this.regTimerDefault(15, () => {
                	if(!this.parentScene.recorder){
                		//this.recorder = new Recorder(SCG.canvases.main);
                		//this.recorder.start();
                	}
                    this.img = this.frames[this.currentFrame++];
                    if(this.currentFrame == this.frames.length-1){
                        this.currentFrame = 0;
                        //this.recorder.stop();
                    }
                })

                for(let i = 0;i < this.totalFramesCount; i++){
                    // this.fXChange.time = i;
                    // let currentX = fast.r(easing.process(this.fXChange));

                    let currentXByLayers = this.fXChangeByLayers.map((change, i) => {
                		let result = easing.process(change);

                    	change.time++;
                    	if(change.time > change.duration){
                    		console.log(`Layer ${i} recreated`)
                    		change.time = 0;
                    		//this.fXChangeByLayers = easing.createProps(this.framesCountByLayers[i]-1, 0, -this.size.x, 'linear', 'base') 
                    	}

                    	return result;
                    })

                    this.frames[i] = createCanvas(this.size, (ctx, size, hlp) => {
                        // ctx.drawImage(this.asp.img, currentX, 0);
                        // ctx.drawImage(this.asp.img, currentX+this.size.x, 0)

                        ctx.drawImage(this.bgImg, 0,0);

                        ctx.drawImage(PP.createImage(this.towerModel), 350, 0, 60, 240)   

						ctx.drawImage(this.buildingLayer3Img, currentXByLayers[0],0);ctx.drawImage(this.buildingLayer3Img, currentXByLayers[0]+this.size.x,0);
	                    ctx.drawImage(this.farBuildingLayerImg, currentXByLayers[1],0);ctx.drawImage(this.farBuildingLayerImg, currentXByLayers[1]+this.size.x,0);
	                    ctx.drawImage(this.buildingLayer2Img, currentXByLayers[2],0);ctx.drawImage(this.buildingLayer2Img, currentXByLayers[2]+this.size.x,0);
	                    ctx.drawImage(this.frontalBLayerImg, currentXByLayers[3],0);ctx.drawImage(this.frontalBLayerImg, currentXByLayers[3]+this.size.x,0);
	                    
	                    hlp.setFillColor('#000').rect(0,220, size.x, 100);
                    })
                }
            },
            createImage() {
                return createCanvas(this.size, (ctx, size, hlp) => {
                    ctx.drawImage(this.bgImg, 0,0);

					

					ctx.drawImage(this.buildingLayer3Img, 0,0);
                    ctx.drawImage(this.farBuildingLayerImg, 0,0);
                    ctx.drawImage(this.buildingLayer2Img, 0,0);
                    ctx.drawImage(this.frontalBLayerImg, 0,0);
                    

                    hlp.setFillColor('#000').rect(0,220, size.x, 100);

                                     
                    //hlp.setFillColor('red').rect(350, 0, 30, 90)
                })
            }
        }), 1)

        // road
        this.road = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                //
                
                this.asp = {
                    color: '#66645D',
                    colorSecondary: '#36393D',
                    linesFrom: 15,
                    height: 40,
                    darkFrom: 30,
                     csParts: [],
                     lines: {
                        color: '#D1D1D1',
                        solid: {    
                            y: 2,
                            height: 2
                        }
                    }
                }

                this.fencing = {
                    //height: 20,
                    lowerY: 39,
                    column: {
                        colors: {
                            light: '#2B3147',
                            dark: '#1C1F32',
                        },
                        count: 2,
                        width: 10,
                        height: 40
                    },
                    bar: {
                        height: 20,
                        y: 7,
                        colors: {
                            main: '#161F3C',
                            dark: '#0C0F22',
                            bottom: '#101733',
                            upper: '#212F5B'
                        }
                    }
                }

                //this.asp.csParts = []
                let countChange = easing.createProps(15, 4, 20, 'quad', 'in');
                let maxlChange = easing.createProps(15, 4, 50, 'quad', 'in');
                let minlChange = easing.createProps(15, 2, 25, 'quad', 'in');

                //hlp.setFillColor(this.asp.colorSecondary);
                for(let y = 0; y <= 15;y++){
                    countChange.time = y;
                    maxlChange.time = y;
                    minlChange.time = y;
                    let count = fast.r(easing.process(countChange));
                    let maxlength = fast.r(easing.process(maxlChange));
                    let minlength = fast.r(easing.process(minlChange));

                    for(let i = 0; i < count; i++){
                        let len = getRandomInt(minlength, maxlength);
                        let x = getRandomInt(0, this.size.x);
                        this.asp.csParts.push({x, y, len});
                        //hlp.rect(x, this.asp.linesFrom + i, len, 1);
                    }
                }

                this.asp.img = this.createImage();

                this.framesCount = 20;
                this.frames = [];
                this.fXChange = easing.createProps(this.framesCount-1, 0, -this.size.x, 'linear', 'base');

                for(let i = 0;i < this.framesCount; i++){
                    this.fXChange.time = i;
                    let currentX = fast.r(easing.process(this.fXChange));

                    this.frames[i] = createCanvas(this.size, (ctx) => {
                        ctx.drawImage(this.asp.img, currentX, 0);
                        ctx.drawImage(this.asp.img, currentX+this.size.x, 0)
                    })
                }

                this.currentFrame = 0;
                this.timer = this.regTimerDefault(100, () => {
                    this.img = this.frames[this.currentFrame++];
                    if(this.currentFrame == this.frames.length-1){
                        this.currentFrame = 0;
                    }
                })
            },
            createImage() {
                return createCanvas(this.size, (ctx, size, hlp) => {
                    let aspYFrom = size.y-this.asp.height;
                    hlp.setFillColor(this.asp.color).rect(0, aspYFrom, size.x, this.asp.height)
                    .setFillColor(this.asp.colorSecondary).rect(0, aspYFrom + this.asp.darkFrom, size.x, this.asp.height-+ this.asp.darkFrom);

                    hlp.setFillColor(this.asp.colorSecondary);
                    for(let i = 0; i < this.asp.csParts.length; i++){
                        let l = this.asp.csParts[i];
                        hlp.rect(l.x, aspYFrom+this.asp.linesFrom+l.y, l.len, 1);
                    }

                    hlp.setFillColor(this.asp.lines.color).rect(0, aspYFrom+ this.asp.lines.solid.y, size.x, this.asp.lines.solid.height);
                    
                    let f = this.fencing;
                    let segWidth = fast.r(size.x/f.column.count);
                    for(let i = 0; i < f.column.count;i++){
                        let x = fast.r(segWidth*i + segWidth/2);
                        let y = size.y - f.lowerY - f.column.height;

                        hlp.setFillColor(f.column.colors.light).rect(x,y,f.column.width, f.column.height)
                        .setFillColor(f.column.colors.dark).rect(x+f.column.width-3,y,3, f.column.height)
                    }

                    let barYTop = size.y - f.lowerY - f.column.height + f.bar.y;
                    hlp.setFillColor(f.bar.colors.main).rect(0, barYTop, size.x, f.bar.height)

                    hlp.setFillColor(f.bar.colors.bottom)
                    for(let i = 0; i < 40; i++){
                        hlp.rect(getRandomInt(0,size.x), getRandomInt(0, f.bar.height) + barYTop, getRandomInt(1,4), 1);
                    }

                    hlp.setFillColor(f.bar.colors.upper).rect(0, barYTop, size.x, 2)
                    .setFillColor(f.bar.colors.dark).rect(0, barYTop+8, size.x, 7)
                    .setFillColor(f.bar.colors.bottom).rect(0, barYTop+14, size.x, 1)
                    .setFillColor(f.bar.colors.bottom).rect(0, barYTop+7, size.x, 1)
                    .setFillColor(f.bar.colors.bottom).rect(0, barYTop+20, size.x, 2)
                    .setFillColor(f.bar.colors.dark).rect(0, barYTop+21, size.x, 1);

                    
                })
            }
        }), 30)

        //car
        this.car = this.addGo(new GO({
            position: new V2(200, 230),
            size: new V2(290, 100),
            init() {
                this.colors = {
                    baseFill: '#552E54',
                    darkFill: '#391E31',
                    lightFill: '#713D77',
                    veryLight: '#976691',
                    baseStroke: '#1C0F0E',
                    black: '#000',
                    faceFill: '#A9A9A9',
                    fWindowFill: '#2B2B2B',
                    lowerLine: '#2D2D2D'
                }

                this.headModel = 
                {"general":{"originalSize":{"x":30,"y":30},"size":{"x":30,"y":30},"zoom":10,"showGrid":false},"main":{"layers":[{"order":0,"type":"lines","strokeColor":"#AE736C","fillColor":"#AE736C","closePath":true,"fill":true,"visible":true,"clear":false,"points":[{"point":{"x":9,"y":15}},{"point":{"x":9,"y":24}},{"point":{"x":15,"y":27}},{"point":{"x":15,"y":21}},{"point":{"x":15,"y":18}},{"point":{"x":12,"y":17}}]},{"order":1,"type":"lines","strokeColor":"#DDB099","fillColor":"#DDB099","closePath":true,"fill":true,"visible":true,"clear":false,"points":[{"point":{"x":8,"y":12}},{"point":{"x":9,"y":15}},{"point":{"x":12,"y":16}},{"point":{"x":15,"y":18}},{"point":{"x":18,"y":19}},{"point":{"x":21,"y":18}},{"point":{"x":22,"y":15}},{"point":{"x":23,"y":14}},{"point":{"x":22,"y":11}},{"point":{"x":22,"y":6}},{"point":{"x":17,"y":4}},{"point":{"x":14,"y":4}},{"point":{"x":10,"y":5}},{"point":{"x":8,"y":8}},{"point":{"x":8,"y":10}}]},{"order":2,"type":"lines","strokeColor":"#AE736C","fillColor":"#AE736C","closePath":true,"fill":true,"visible":true,"clear":false,"points":[{"point":{"x":15,"y":10}},{"point":{"x":15,"y":11}},{"point":{"x":16,"y":12}},{"point":{"x":18,"y":12}},{"point":{"x":18,"y":10}}]},{"order":3,"type":"lines","strokeColor":"#1E1E1E","fillColor":"#FF0000","closePath":false,"fill":false,"visible":true,"clear":false,"points":[{"point":{"x":11,"y":11}},{"point":{"x":11,"y":8}},{"point":{"x":10,"y":8}}]},{"order":4,"type":"lines","strokeColor":"#0F1315","fillColor":"#0F1315","closePath":true,"fill":true,"visible":true,"clear":false,"points":[{"point":{"x":8,"y":9}},{"point":{"x":22,"y":9}},{"point":{"x":22,"y":11}},{"point":{"x":21,"y":10}},{"point":{"x":20,"y":9}},{"point":{"x":19,"y":9}},{"point":{"x":19,"y":11}},{"point":{"x":19,"y":12}},{"point":{"x":17,"y":12}},{"point":{"x":16,"y":10}},{"point":{"x":16,"y":9}}]},{"order":5,"type":"lines","strokeColor":"#AE736C","fillColor":"#AE736C","closePath":true,"fill":true,"visible":true,"clear":false,"points":[{"point":{"x":8,"y":10}},{"point":{"x":10,"y":10}},{"point":{"x":10,"y":13}},{"point":{"x":8,"y":12}}]},{"order":6,"type":"dots","strokeColor":"#36393D","fillColor":"#36393D","closePath":false,"fill":false,"visible":true,"clear":false,"points":[]},{"order":7,"type":"lines","strokeColor":"#1E1E1E","fillColor":"#1E1E1E","closePath":true,"fill":true,"visible":true,"clear":false,"points":[{"point":{"x":19,"y":16}},{"point":{"x":22,"y":16}},{"point":{"x":21,"y":20}},{"point":{"x":16,"y":20}},{"point":{"x":11,"y":16}},{"point":{"x":11,"y":12}},{"point":{"x":13,"y":14}},{"point":{"x":16,"y":16}},{"point":{"x":17,"y":16}},{"point":{"x":17,"y":17}},{"point":{"x":18,"y":18}},{"point":{"x":19,"y":18}}]},{"order":8,"type":"lines","strokeColor":"#AE736C","fillColor":"#FF0000","closePath":false,"fill":false,"visible":true,"clear":false,"points":[{"point":{"x":19,"y":16}},{"point":{"x":21,"y":16}},{"point":{"x":21,"y":17}},{"point":{"x":20,"y":17}}]},{"order":9,"type":"dots","strokeColor":"#AE736C","fillColor":"#FF0000","closePath":false,"fill":false,"visible":true,"clear":false,"points":[{"point":{"x":20,"y":10}}]},{"order":10,"type":"lines","strokeColor":"#FF0000","fillColor":"#FF0000","closePath":true,"fill":true,"visible":true,"clear":false,"points":[{"point":{"x":19,"y":1}},{"point":{"x":21,"y":3}},{"point":{"x":22,"y":5}},{"point":{"x":18,"y":5}},{"point":{"x":11,"y":7}},{"point":{"x":9,"y":8}},{"point":{"x":1,"y":12}},{"point":{"x":7,"y":8}},{"point":{"x":7,"y":4}},{"point":{"x":10,"y":2}},{"point":{"x":13,"y":1}}]},{"order":11,"type":"lines","strokeColor":"#ff4242","fillColor":"#FF0000","closePath":false,"fill":false,"visible":true,"clear":false,"points":[{"point":{"x":19,"y":1}},{"point":{"x":12,"y":1}},{"point":{"x":7,"y":4}},{"point":{"x":7,"y":8}}]},{"order":12,"type":"lines","strokeColor":"#dd0000","fillColor":"#FF0000","closePath":false,"fill":false,"visible":true,"clear":false,"points":[{"point":{"x":20,"y":2}},{"point":{"x":22,"y":5}},{"point":{"x":16,"y":6}},{"point":{"x":8,"y":8}}]},{"order":13,"type":"lines","strokeColor":"#a3625a","fillColor":"#FF0000","closePath":false,"fill":false,"visible":true,"clear":false,"points":[{"point":{"x":19,"y":17}},{"point":{"x":21,"y":17}}]},{"order":14,"type":"dots","strokeColor":"#d09371","fillColor":"#FF0000","closePath":false,"fill":false,"visible":true,"clear":false,"points":[{"point":{"x":22,"y":15}},{"point":{"x":21,"y":15}},{"point":{"x":20,"y":13}}]},{"order":15,"type":"lines","strokeColor":"#d59c7d","fillColor":"#FF0000","closePath":false,"fill":false,"visible":true,"clear":false,"points":[{"point":{"x":7,"y":10}},{"point":{"x":8,"y":13}},{"point":{"x":9,"y":14}}]},{"order":16,"type":"dots","strokeColor":"#3c3c3c","fillColor":"#FF0000","closePath":false,"fill":false,"visible":true,"clear":false,"points":[{"point":{"x":20,"y":4}},{"point":{"x":19,"y":4}},{"point":{"x":18,"y":4}}]},{"order":17,"type":"lines","strokeColor":"#dd0000","fillColor":"#dd0000","closePath":true,"fill":true,"visible":true,"clear":false,"points":[{"point":{"x":16,"y":23}},{"point":{"x":19,"y":23}},{"point":{"x":22,"y":25}},{"point":{"x":24,"y":27}},{"point":{"x":3,"y":27}},{"point":{"x":7,"y":24}},{"point":{"x":9,"y":20}},{"point":{"x":10,"y":22}},{"point":{"x":11,"y":23}},{"point":{"x":13,"y":25}},{"point":{"x":15,"y":25}}]},{"order":18,"type":"lines","strokeColor":"#FF0000","fillColor":"#FF0000","closePath":false,"fill":false,"visible":true,"clear":false,"points":[]},{"order":19,"type":"dots","strokeColor":"#955953","fillColor":"#FF0000","closePath":false,"fill":false,"visible":true,"clear":false,"points":[{"point":{"x":9,"y":11}},{"point":{"x":9,"y":10}}]}]}}

                this.handModel = 
                {"general":{"originalSize":{"x":20,"y":30},"size":{"x":20,"y":30},"zoom":8,"showGrid":false},"main":{"layers":[{"order":0,"type":"lines","strokeColor":"#DDB099","fillColor":"#DDB099","closePath":true,"fill":true,"visible":true,"clear":false,"points":[{"point":{"x":13,"y":24}},{"point":{"x":10,"y":24}},{"point":{"x":9,"y":27}},{"point":{"x":13,"y":27}}]},{"order":1,"type":"lines","strokeColor":"#FF0000","fillColor":"#FF0000","closePath":true,"fill":true,"visible":true,"clear":false,"points":[{"point":{"x":15,"y":23}},{"point":{"x":19,"y":23}},{"point":{"x":18,"y":27}},{"point":{"x":14,"y":27}},{"point":{"x":13,"y":24}}]},{"order":2,"type":"lines","strokeColor":"#DDB099","fillColor":"#DDB099","closePath":true,"fill":true,"visible":true,"clear":false,"points":[{"point":{"x":10,"y":24}},{"point":{"x":9,"y":20}},{"point":{"x":8,"y":15}},{"point":{"x":8,"y":13}},{"point":{"x":7,"y":10}},{"point":{"x":5,"y":9}},{"point":{"x":0,"y":9}},{"point":{"x":4,"y":9}},{"point":{"x":6,"y":13}},{"point":{"x":6,"y":16}},{"point":{"x":6,"y":25}},{"point":{"x":7,"y":26}},{"point":{"x":9,"y":27}}]},{"order":3,"type":"dots","strokeColor":"#ce8e6c","fillColor":"#FF0000","closePath":false,"fill":false,"visible":true,"clear":false,"points":[{"point":{"x":10,"y":25}},{"point":{"x":11,"y":24}},{"point":{"x":12,"y":24}},{"point":{"x":6,"y":13}},{"point":{"x":5,"y":12}},{"point":{"x":6,"y":14}}]},{"order":4,"type":"lines","strokeColor":"#DDB099","fillColor":"#FF0000","closePath":false,"fill":false,"visible":true,"clear":false,"points":[{"point":{"x":4,"y":11}},{"point":{"x":2,"y":11}}]},{"order":5,"type":"dots","strokeColor":"#ce8e6c","fillColor":"#FF0000","closePath":false,"fill":false,"visible":true,"clear":false,"points":[]},{"order":6,"type":"lines","strokeColor":"#ce8e6c","fillColor":"#FF0000","closePath":false,"fill":false,"visible":true,"clear":false,"points":[{"point":{"x":6,"y":25}},{"point":{"x":6,"y":15}}]},{"order":7,"type":"dots","strokeColor":"#4a4a4a","fillColor":"#FF0000","closePath":false,"fill":false,"visible":true,"clear":false,"points":[{"point":{"x":7,"y":25}},{"point":{"x":8,"y":25}},{"point":{"x":9,"y":24}},{"point":{"x":7,"y":22}},{"point":{"x":8,"y":22}},{"point":{"x":9,"y":21}},{"point":{"x":7,"y":19}},{"point":{"x":8,"y":19}},{"point":{"x":7,"y":16}},{"point":{"x":8,"y":15}},{"point":{"x":7,"y":13}},{"point":{"x":9,"y":18}},{"point":{"x":8,"y":12}},{"point":{"x":10,"y":24}}]},{"order":8,"type":"dots","strokeColor":"#6f6f6f","fillColor":"#FF0000","closePath":false,"fill":false,"visible":true,"clear":false,"points":[{"point":{"x":7,"y":21}},{"point":{"x":8,"y":21}},{"point":{"x":7,"y":18}},{"point":{"x":8,"y":18}},{"point":{"x":7,"y":15}},{"point":{"x":7,"y":12}},{"point":{"x":8,"y":24}},{"point":{"x":7,"y":24}}]},{"order":9,"type":"dots","strokeColor":"#8a8a8a","fillColor":"#FF0000","closePath":false,"fill":false,"visible":true,"clear":false,"points":[{"point":{"x":9,"y":20}},{"point":{"x":9,"y":23}},{"point":{"x":8,"y":17}},{"point":{"x":8,"y":14}},{"point":{"x":10,"y":23}}]},{"order":10,"type":"dots","strokeColor":"#313131","fillColor":"#FF0000","closePath":false,"fill":false,"visible":true,"clear":false,"points":[{"point":{"x":6,"y":18}},{"point":{"x":6,"y":15}},{"point":{"x":6,"y":13}},{"point":{"x":6,"y":21}},{"point":{"x":6,"y":24}}]}]}}
                //{"general":{"originalSize":{"x":15,"y":30},"size":{"x":15,"y":30},"zoom":8,"showGrid":false},"main":{"layers":[{"order":0,"type":"lines","strokeColor":"#DDB099","fillColor":"#DDB099","closePath":true,"fill":true,"visible":true,"clear":false,"points":[{"point":{"x":7,"y":3}},{"point":{"x":3,"y":4}},{"point":{"x":4,"y":6}},{"point":{"x":8,"y":5}}]},{"order":1,"type":"lines","strokeColor":"#FF0000","fillColor":"#FF0000","closePath":true,"fill":true,"visible":true,"clear":false,"points":[{"point":{"x":6,"y":2}},{"point":{"x":13,"y":1}},{"point":{"x":12,"y":5}},{"point":{"x":8,"y":5}},{"point":{"x":8,"y":2}}]},{"order":2,"type":"lines","strokeColor":"#DDB099","fillColor":"#DDB099","closePath":true,"fill":true,"visible":true,"clear":false,"points":[{"point":{"x":1,"y":7}},{"point":{"x":1,"y":15}},{"point":{"x":2,"y":16}},{"point":{"x":2,"y":19}},{"point":{"x":1,"y":21}},{"point":{"x":1,"y":23}},{"point":{"x":0,"y":24}},{"point":{"x":0,"y":27}},{"point":{"x":3,"y":25}},{"point":{"x":4,"y":23}},{"point":{"x":4,"y":15}},{"point":{"x":4,"y":5}}]},{"order":3,"type":"lines","strokeColor":"#ce8e6c","fillColor":"#FF0000","closePath":false,"fill":false,"visible":true,"clear":false,"points":[{"point":{"x":0,"y":27}},{"point":{"x":1,"y":26}},{"point":{"x":3,"y":25}},{"point":{"x":4,"y":23}}]},{"order":4,"type":"lines","strokeColor":"#ce8e6c","fillColor":"#FF0000","closePath":false,"fill":false,"visible":true,"clear":false,"points":[{"point":{"x":8,"y":5}},{"point":{"x":8,"y":6}},{"point":{"x":5,"y":7}},{"point":{"x":4,"y":8}},{"point":{"x":4,"y":10}}]},{"order":5,"type":"lines","strokeColor":"#df0000","fillColor":"#FF0000","closePath":false,"fill":false,"visible":true,"clear":false,"points":[{"point":{"x":9,"y":5}},{"point":{"x":12,"y":5}}]}]}}

                this.baseLampModel = () => (
                    {"general":{"originalSize":{"x":10,"y":13},"size":{"x":10,"y":13},"zoom":10,"showGrid":false},"main":{"layers":[{"order":0,"type":"lines","strokeColor":"#D2D2D2","fillColor":"#ffffff","closePath":true,"fill":true,"visible":true,"clear":false,"points":[{"point":{"x":0,"y":4}},{"point":{"x":1,"y":1}},{"point":{"x":3,"y":0}},{"point":{"x":5,"y":0}},{"point":{"x":8,"y":1}},{"point":{"x":9,"y":3}},{"point":{"x":9,"y":7}},{"point":{"x":9,"y":8}},{"point":{"x":8,"y":11}},{"point":{"x":6,"y":12}},{"point":{"x":4,"y":12}},{"point":{"x":1,"y":11}},{"point":{"x":0,"y":8}},{"point":{"x":0,"y":6}}]},{"order":1,"type":"dots","strokeColor":"#BDBDBD","fillColor":"#FF0000","closePath":false,"fill":false,"visible":true,"clear":false,"points":[{"point":{"x":2,"y":4}},{"point":{"x":2,"y":5}},{"point":{"x":4,"y":2}},{"point":{"x":4,"y":3}},{"point":{"x":5,"y":3}},{"point":{"x":5,"y":2}},{"point":{"x":6,"y":5}},{"point":{"x":6,"y":4}},{"point":{"x":7,"y":4}},{"point":{"x":7,"y":5}},{"point":{"x":3,"y":4}},{"point":{"x":3,"y":5}}]},{"order":2,"type":"lines","strokeColor":"#eeeeee","fillColor":"#FF0000","closePath":false,"fill":false,"visible":true,"clear":false,"points":[{"point":{"x":1,"y":6}},{"point":{"x":1,"y":9}},{"point":{"x":3,"y":11}},{"point":{"x":6,"y":11}},{"point":{"x":8,"y":9}},{"point":{"x":8,"y":6}},{"point":{"x":8,"y":8}},{"point":{"x":7,"y":9}},{"point":{"x":6,"y":10}},{"point":{"x":3,"y":10}},{"point":{"x":2,"y":9}}]},{"order":3,"type":"dots","strokeColor":"#dddddd","fillColor":"#FF0000","closePath":false,"fill":false,"visible":true,"clear":false,"points":[{"point":{"x":2,"y":3}},{"point":{"x":3,"y":3}},{"point":{"x":4,"y":1}},{"point":{"x":5,"y":1}},{"point":{"x":6,"y":3}},{"point":{"x":7,"y":3}}]}]}}
                    )
                this.lampModel = (x,y,) => {
                    let model = this.baseLampModel().main.layers;
                     model.forEach(l => {
                        l.points.forEach(p => {
                            p.point.x+=x;
                            p.point.y+=y;
                        })

                        l.order+=90;
                    });

                     return model;
                }

				this.headLayers = this.headModel.main.layers;
				this.handLayers = this.handModel.main.layers;

				this.headLayers.forEach(l => {
					l.points.forEach(p => {
						p.point.x+=110;
						p.point.y+=4;
					})
				})

				this.handLayers.forEach(l => {
					l.points.forEach(p => {
						p.point.x+=93;
						p.point.y+=7;
					})

					//l.order+=100;
				})

                this.wheelModel = () => 
                	(
                		{"general":{"originalSize":{"x":50,"y":55},"size":{"x":50,"y":55},"zoom":4,"showGrid":false},"main":{"layers":[{"order":0,"type":"lines","strokeColor":"#000000","fillColor":"#000000","closePath":true,"fill":true,"visible":true,"clear":false,"points":[{"point":{"x":0,"y":0}},{"point":{"x":0,"y":33}},{"point":{"x":49,"y":40}},{"point":{"x":49,"y":0}}]},{"order":1,"type":"lines","strokeColor":"#202020","fillColor":"#202020","closePath":true,"fill":true,"visible":true,"clear":false,"points":[{"point":{"x":17,"y":15}},{"point":{"x":18,"y":54}},{"point":{"x":31,"y":54}},{"point":{"x":34,"y":53}},{"point":{"x":36,"y":51}},{"point":{"x":40,"y":44}},{"point":{"x":40,"y":35}},{"point":{"x":40,"y":32}},{"point":{"x":40,"y":28}},{"point":{"x":38,"y":22}},{"point":{"x":35,"y":19}},{"point":{"x":33,"y":17}},{"point":{"x":29,"y":15}}]},{"order":2,"type":"lines","strokeColor":"#2C2C2C","fillColor":"#2C2C2C","closePath":true,"fill":true,"visible":true,"clear":false,"points":[{"point":{"x":14,"y":16}},{"point":{"x":11,"y":18}},{"point":{"x":9,"y":21}},{"point":{"x":7,"y":26}},{"point":{"x":6,"y":30}},{"point":{"x":6,"y":36}},{"point":{"x":7,"y":42}},{"point":{"x":9,"y":48}},{"point":{"x":11,"y":51}},{"point":{"x":14,"y":54}},{"point":{"x":23,"y":54}},{"point":{"x":27,"y":51}},{"point":{"x":29,"y":48}},{"point":{"x":31,"y":43}},{"point":{"x":31,"y":37}},{"point":{"x":31,"y":33}},{"point":{"x":31,"y":30}},{"point":{"x":30,"y":25}},{"point":{"x":29,"y":22}},{"point":{"x":27,"y":19}},{"point":{"x":25,"y":17}},{"point":{"x":22,"y":15}},{"point":{"x":16,"y":15}}]},{"order":3,"type":"lines","strokeColor":"#555555","fillColor":"#FF0000","closePath":false,"fill":false,"visible":true,"clear":false,"points":[{"point":{"x":10,"y":19}},{"point":{"x":12,"y":17}},{"point":{"x":14,"y":16}},{"point":{"x":15,"y":15}},{"point":{"x":22,"y":15}},{"point":{"x":22,"y":16}},{"point":{"x":24,"y":16}},{"point":{"x":27,"y":19}},{"point":{"x":25,"y":17}},{"point":{"x":21,"y":16}},{"point":{"x":15,"y":16}},{"point":{"x":14,"y":17}},{"point":{"x":12,"y":18}}]},{"order":4,"type":"dots","strokeColor":"#555555","fillColor":"#FF0000","closePath":false,"fill":false,"visible":true,"clear":false,"points":[{"point":{"x":29,"y":22}},{"point":{"x":29,"y":23}},{"point":{"x":9,"y":21}},{"point":{"x":9,"y":22}},{"point":{"x":8,"y":23}}]},{"order":5,"type":"lines","strokeColor":"#000000","fillColor":"#000000","closePath":true,"fill":true,"visible":true,"clear":false,"points":[{"point":{"x":25,"y":15}},{"point":{"x":32,"y":18}},{"point":{"x":36,"y":22}},{"point":{"x":39,"y":27}},{"point":{"x":41,"y":33}},{"point":{"x":41,"y":17}},{"point":{"x":34,"y":15}}]},{"order":6,"type":"lines","strokeColor":"#515151","fillColor":"#515151","closePath":true,"fill":true,"visible":true,"clear":false,"points":[{"point":{"x":10,"y":33}},{"point":{"x":10,"y":31}},{"point":{"x":10,"y":29}},{"point":{"x":12,"y":23}},{"point":{"x":15,"y":20}},{"point":{"x":18,"y":20}},{"point":{"x":22,"y":20}},{"point":{"x":25,"y":22}},{"point":{"x":26,"y":23}},{"point":{"x":27,"y":25}},{"point":{"x":28,"y":29}},{"point":{"x":28,"y":31}},{"point":{"x":28,"y":43}},{"point":{"x":24,"y":45}},{"point":{"x":16,"y":36}},{"point":{"x":13,"y":33}}]},{"order":7,"type":"lines","strokeColor":"#D8D8D8","fillColor":"#D8D8D8","closePath":true,"fill":true,"visible":true,"clear":false,"points":[{"point":{"x":10,"y":34}},{"point":{"x":10,"y":38}},{"point":{"x":11,"y":43}},{"point":{"x":13,"y":47}},{"point":{"x":15,"y":49}},{"point":{"x":17,"y":50}},{"point":{"x":21,"y":50}},{"point":{"x":24,"y":49}},{"point":{"x":26,"y":46}},{"point":{"x":27,"y":44}},{"point":{"x":24,"y":44}},{"point":{"x":22,"y":42}},{"point":{"x":19,"y":40}},{"point":{"x":12,"y":31}}]},{"order":8,"type":"lines","strokeColor":"#888888","fillColor":"#888888","closePath":true,"fill":true,"visible":true,"clear":false,"points":[{"point":{"x":13,"y":33}},{"point":{"x":13,"y":29}},{"point":{"x":14,"y":26}},{"point":{"x":16,"y":24}},{"point":{"x":18,"y":23}},{"point":{"x":21,"y":23}},{"point":{"x":24,"y":26}},{"point":{"x":25,"y":30}},{"point":{"x":25,"y":32}},{"point":{"x":25,"y":35}},{"point":{"x":25,"y":38}},{"point":{"x":25,"y":40}},{"point":{"x":24,"y":45}},{"point":{"x":22,"y":48}},{"point":{"x":19,"y":48}},{"point":{"x":16,"y":47}},{"point":{"x":15,"y":45}},{"point":{"x":14,"y":42}},{"point":{"x":13,"y":39}},{"point":{"x":13,"y":36}}]},{"order":9,"type":"lines","strokeColor":"#000000","fillColor":"#FF0000","closePath":false,"fill":false,"visible":true,"clear":false,"points":[{"point":{"x":30,"y":22}},{"point":{"x":30,"y":23}},{"point":{"x":31,"y":24}},{"point":{"x":31,"y":27}},{"point":{"x":32,"y":28}},{"point":{"x":32,"y":44}},{"point":{"x":31,"y":45}},{"point":{"x":31,"y":46}}]}]}}
                		)

				this.backWheelModel = 
				{"general":{"originalSize":{"x":40,"y":45},"size":{"x":40,"y":45},"zoom":2,"showGrid":false},"main":{"layers":[{"order":0,"type":"lines","strokeColor":"#000","fillColor":"#000","closePath":true,"fill":true,"visible":true,"clear":false,"points":[{"point":{"x":0,"y":17}},{"point":{"x":0,"y":22}},{"point":{"x":1,"y":31}},{"point":{"x":1,"y":34}},{"point":{"x":3,"y":37}},{"point":{"x":5,"y":39}},{"point":{"x":6,"y":40}},{"point":{"x":8,"y":42}},{"point":{"x":13,"y":44}},{"point":{"x":26,"y":44}},{"point":{"x":30,"y":43}},{"point":{"x":33,"y":40}},{"point":{"x":35,"y":38}},{"point":{"x":36,"y":37}},{"point":{"x":38,"y":33}},{"point":{"x":38,"y":31}},{"point":{"x":39,"y":28}},{"point":{"x":39,"y":17}},{"point":{"x":39,"y":4}},{"point":{"x":0,"y":4}}]}]}}

                this.bodyModel = {"general":{"originalSize":this.size,"size":this.size,"zoom":10,"showGrid":false},
                "main": {
                    "layers":[

						...this.headLayers,
						...this.handLayers,
                        ...this.lampModel(213, 45),
                        ...this.lampModel(223, 45),
                        ...this.lampModel(265, 45),
                        ...this.lampModel(275, 45),
                        {"order":40,"type":"lines","strokeColor":this.colors.baseStroke,"fillColor":this.colors.baseFill,"closePath":true,"fill":true,"visible":true,"clear":false,"points":[
                            new V2(2,42), new V2(4,36), new V2(8,34), new V2(18,30), new V2(39, 27), new V2(76,29), new V2(102, 32), new V2(136, 32), new V2(206, 30),
                            //face 
                            new V2(264,32),new V2(272, 34),new V2(278, 36),new V2(283, 39),new V2(287, 44),new V2(288, 59),new V2(284,66),new V2(284, 71),new V2(278,77),
                            //bottom
                            new V2(197,77), new V2(149, 80), new V2(59, 80), new V2(22,73),new V2(13,70), new V2(8, 67), new V2(4,64), new V2(2, 60)
                        ].map(point => ({point}))
                        },
                        {"order":41,"type":"lines","strokeColor":this.colors.darkFill,"fillColor":this.colors.darkFill,"closePath":true,"fill":true,"visible":true,"clear":false,"points":[
                            new V2(4,36), new V2(7,42), new V2(51,43),new V2(78,48), 
                            //face 
                            new V2(287, 44),new V2(288, 59),new V2(284,66),new V2(284, 71),new V2(278,77),
                            //bottom
                            new V2(197,77), new V2(149, 80), new V2(59, 80), new V2(22,73),new V2(13,70), new V2(8, 67), new V2(4,64), new V2(2, 60)
                        ].map(point => ({point}))
                        },
                        {"order":42,"type":"lines","strokeColor":this.colors.black,"fillColor":this.colors.black,"closePath":true,"fill":true,"visible":true,"clear":true,"points":[
                            new V2(22,73), new V2(26,56), new V2(30,52), new V2(36,48),new V2(45,48), new V2(50,54), new V2(59,80)
                            
                        ].map(point => ({point}))
                        },
                        // светлый выступ над задним колесом
                        {"order":43,"type":"lines","strokeColor":'#7B4282',"fillColor":'#7B4282',"closePath":true,"fill":true,"visible":true,"clear":false,"points":[
                            new V2(28,53), new V2(32,47), new V2(37,45), new V2(45,46), new V2(49,49), new V2(53,58), new V2(50,53), new V2(45,48), new V2(36,47), new V2(31,50)
                            
                        ].map(point => ({point}))
                        },
                        {"order":44,"type":"lines","strokeColor":this.colors.baseStroke,"fillColor":'#663669',"closePath":false,"fill":true,"visible":true,"clear":false,"points":[
                            new V2(26,56), new V2(22,73),
                        ].map(point => ({point}))
                        },
                        {"order":301,"type":"lines","strokeColor":'#663669',"fillColor":'#663669',"closePath":false,"fill":true,"visible":true,"clear":false,"points":[
                            new V2(28,53), new V2(32,47), new V2(37,45), new V2(45,46), new V2(49,49), new V2(53,58)
                        ].map(point => ({point}))
                        },
                        // темная арка над передним колесом
                        {"order":300,"type":"lines","strokeColor":this.colors.black,"fillColor":this.colors.black,"closePath":true,"fill":true,"visible":true,"clear":true,"points":[
                            new V2(149,82), new V2(150,65), new V2(155,54),new V2(165,48), new V2(173,49), new V2(182,54), new V2(190, 70), new V2(197, 77), new V2(197, 82)
                            
                        ].map(point => ({point}))
                        },
                        // светлый выступ над передним колесом
                        {"order":301,"type":"lines","strokeColor":'#723D79',"fillColor":'#723D79',"closePath":true,"fill":true,"visible":true,"clear":false,"points":[
                            new V2(150,65), new V2(155,54),new V2(165,48), new V2(173,49), new V2(182,54), new V2(190, 70), new V2(185,55), new V2(179,48), new V2(174,46), new V2(167,46), new V2(159,49)
                            
                        ].map(point => ({point}))
                        },
                        {"order":301,"type":"lines","strokeColor":'#663669',"fillColor":'#663669',"closePath":false,"fill":true,"visible":true,"clear":false,"points":[
                            new V2(190, 70), new V2(185,55), new V2(179,48), new V2(174,46), new V2(167,46), new V2(159,49)
                            
                        ].map(point => ({point}))
                        },
                        {"order":302,"type":"lines","strokeColor":this.colors.baseStroke,"fillColor":'#663669',"closePath":false,"fill":true,"visible":true,"clear":false,"points":[
                            new V2(149, 80), new V2(150,64),
                        ].map(point => ({point}))
                        },
                        //
                        {"order":44,"type":"lines","strokeColor":this.colors.faceFill,"fillColor":this.colors.faceFill,"closePath":true,"fill":true,"visible":true,"clear":false,"points":[
                            new V2(202,45), new V2(212,44), new V2(287,44),new V2(288,59), new V2(284,66), new V2(279,67), new V2(212,67), new V2(206,64), new V2(202,57)
                            
                        ].map(point => ({point}))
                        },
                        {"order":45,"type":"lines","strokeColor":this.colors.lightFill,"fillColor":this.colors.lightFill,"closePath":true,"fill":true,"visible":true,"clear":false,"points":[
                            new V2(18,30), new V2(39, 27), new V2(76,29), new V2(102, 32), new V2(136, 32), new V2(206, 30),
                            new V2(264,32),new V2(272, 34),new V2(278, 36),new V2(283, 39),new V2(287, 44), new V2(212, 44), new V2(202,45)
                            
                        ].map(point => ({point}))
                        },
                        {"order":46,"type":"lines","strokeColor":this.colors.fWindowFill,"fillColor":this.colors.fWindowFill,"closePath":true,"fill":true,"visible":true,"clear":false,"points":[
                            new V2(135,8), new V2(148,6), new V2(157,6), new V2(183,8), new V2(206,30), new V2(142,32),
                            
                        ].map(point => ({point}))
                        },
                        {"order":46,"type":"lines","strokeColor":'#1A0A0C',"fillColor":this.colors.lowerLine,"closePath":true,"fill":true,"visible":true,"clear":false,"points":[
                            new V2(59,80), new V2(59,77), new V2(149,77), new V2(149,80)
                            
                        ].map(point => ({point}))
                        },
                        
                        {"order":48,"type":"lines","strokeColor":this.colors.black,"fillColor":this.colors.black,"closePath":true,"fill":true,"visible":true,"clear":false,"points":[
                            new V2(59,81), new V2(149,81), new V2(197,78), new V2(272,78), new V2(272,80), new V2(201,80), new V2(199,82), new V2(149,82), new V2(94,84),
                            new V2(88,87), new V2(84,87), new V2(78,84), new V2(65,84)
                            
                        ].map(point => ({point}))
                        },
                        {"order":49,"type":"lines","strokeColor":this.colors.veryLight,"fillColor":this.colors.veryLight,"closePath":false,"fill":false,"visible":true,"clear":false,"points":[
                            new V2(156,32), new V2(173,33), new V2(187,35), new V2(192,37), new V2(222,38), new V2(231,39), new V2(233,43), new V2(211,43), new V2(284,43),new V2(286,44),new V2(210,44)
                            
                        ].map(point => ({point})) // frontal light line
                        },
                        {"order":48,"type":"lines","strokeColor":'#262827',"fillColor":'#262827',"closePath":true,"fill":true,"visible":true,"clear":false,"points":[
                            new V2(212,44), new V2(284,44), new V2(284,58), new V2(215,58), new V2(212,56) 
                        ].map(point => ({point}))
                        },
                        {"order":49,"type":"lines","strokeColor":'#6A3470',"fillColor":'#6A3470',"closePath":true,"fill":true,"visible":true,"clear":false,"points":[
                            new V2(136,32), new V2(134,10), new V2(135,8), new V2(141,32)
                        ].map(point => ({point}))
                        },
                        {"order":51,"type":"lines","strokeColor":'#201112',"fillColor":this.colors.lowerLine,"closePath":false,"fill":false,"visible":true,"clear":false,"points":[
                            new V2(284,67), new V2(284,71), new V2(278,77), new V2(197,77), new V2(207,72), new V2(282,72)
                            
                        ].map(point => ({point}))
                        },
                        {"order":51,"type":"lines","strokeColor":'#414242',"fillColor":'#000',"closePath":true,"fill":true,"visible":true,"clear":false,"points":[
                            new V2(241,62), new V2(261,62), new V2(261,74),new V2(241,74)
                        ].map(point => ({point}))
                        },
                        // задний бампер
                        {"order":52,"type":"lines","strokeColor":'#808080',"fillColor":'#808080',"closePath":true,"fill":true,"visible":true,"clear":false,"points":[
                            new V2(2,48), new V2(8,48), new V2(8,67),new V2(4,64),new V2(2, 60)
                        ].map(point => ({point}))
                        },
                         {"order":53,"type":"lines","strokeColor":'#B3B3B3',"fillColor":'#B3B3B3',"closePath":true,"fill":true,"visible":true,"clear":false,"points":[
                            new V2(4,50), new V2(6,50), new V2(6,57),new V2(4,57),
                        ].map(point => ({point}))
                        },
                        {"order":54,"type":"lines","strokeColor":'#545454',"fillColor":'#808080',"closePath":true,"fill":true,"visible":true,"clear":false,"points":[
                            new V2(8,48), new V2(8,67)
                        ].map(point => ({point}))
                        },

                        //боковой декор
                        {"order":55,"type":"lines","strokeColor":'#301327',"fillColor":'#A5A5A5',"closePath":true,"fill":true,"visible":true,"clear":false,"points":[
                            new V2(93,48), new V2(200,48), new V2(200,56), new V2(93,56)
                        ].map(point => ({point}))
                        },
                        {"order":56,"type":"lines","strokeColor":'#EE7E1D',"fillColor":'#EE7E1D',"closePath":true,"fill":true,"visible":true,"clear":false,"points":[
                            new V2(104,50), new V2(195,50), new V2(195,51), new V2(104,51)
                        ].map(point => ({point}))
                        },
                        {"order":56,"type":"lines","strokeColor":'#D6D8D7',"fillColor":'#EE7E1D',"closePath":true,"fill":true,"visible":true,"clear":false,"points":[
                            new V2(94,54), new V2(198,54)
                        ].map(point => ({point}))
                        },
                        {"order":56,"type":"lines","strokeColor":'#8F828B',"fillColor":'#EE7E1D',"closePath":true,"fill":true,"visible":true,"clear":false,"points":[
                            new V2(94,55), new V2(199,55)
                        ].map(point => ({point}))
                        },
                        {"order":56,"type":"lines","strokeColor":'#B8C3CB',"fillColor":'#EE7E1D',"closePath":true,"fill":true,"visible":true,"clear":false,"points":[
                            new V2(94,53), new V2(199,53)
                        ].map(point => ({point}))
                        },
                        {"order":57,"type":"lines","strokeColor":'#EE7E1D',"fillColor":'#EE7E1D',"closePath":true,"fill":true,"visible":true,"clear":false,"points":[
                            new V2(191,52), new V2(195,52)
                        ].map(point => ({point}))
                        },
                        {"order":58,"type":"lines","strokeColor":'#EE7E1D',"fillColor":'#EE7E1D',"closePath":true,"fill":true,"visible":true,"clear":false,"points":[
                            new V2(198,50), new V2(198,51)
                        ].map(point => ({point}))
                        },
                        {"order":58,"type":"lines","strokeColor":'#BB5A13',"fillColor":'#EE7E1D',"closePath":true,"fill":true,"visible":true,"clear":false,"points":[
                            new V2(199,50), new V2(199,51)
                        ].map(point => ({point}))
                        },
                        {"order":59,"type":"lines","strokeColor":'#79797A',"fillColor":'#79797A',"closePath":true,"fill":true,"visible":true,"clear":false,"points":[
                            new V2(188,50), new V2(190,50), new V2(190,52), new V2(188,52)
                        ].map(point => ({point}))
                        },
                        {"order":59,"type":"lines","strokeColor":'#79797A',"fillColor":'#79797A',"closePath":true,"fill":true,"visible":true,"clear":false,"points":[
                            new V2(196,50), new V2(197,50), new V2(197,52), new V2(196,52)
                        ].map(point => ({point}))
                        },
                        {"order":59,"type":"dots","strokeColor":'#391E31',"fillColor":'#79797A',"closePath":true,"fill":true,"visible":true,"clear":false,"points":[
                            new V2(93,50), new V2(93,51), new V2(97,50), new V2(97,51), new V2(101,50), new V2(101,51)
                        ].map(point => ({point}))
                        },
                        {"order":59,"type":"dots","strokeColor":'#513D4B',"fillColor":'#79797A',"closePath":true,"fill":true,"visible":true,"clear":false,"points":[
                            new V2(94,50), new V2(94,51), new V2(98,50), new V2(98,51), new V2(102,50), new V2(102,51)
                        ].map(point => ({point}))
                        },
                        //желтые фары нижние
                        {"order":50,"type":"lines","strokeColor":'#000',"fillColor":'#000',"closePath":true,"fill":true,"visible":true,"clear":false,"points":[
                            new V2(214,68), new V2(279,68), new V2(279,69), new V2(276,71), new V2(217,71), new V2(214,69)
                        ].map(point => ({point}))
                        },
                        {"order":60,"type":"lines","strokeColor":'#FF7600',"fillColor":'#FF7600',"closePath":true,"fill":true,"visible":true,"clear":false,"points":[
                            new V2(216,68), new V2(225,68), new V2(225,71), new V2(219,71), new V2(216,69)
                        ].map(point => ({point}))
                        },
                        {"order":60,"type":"lines","strokeColor":'#FF7600',"fillColor":'#FF7600',"closePath":true,"fill":true,"visible":true,"clear":false,"points":[
                            new V2(270,68), new V2(276,68), new V2(276,69), new V2(274,71), new V2(270,71)
                        ].map(point => ({point}))
                        },

                        //морда
                        {"order":60,"type":"lines","strokeColor":'#FFF',"fillColor":'#FFF',"closePath":true,"fill":true,"visible":true,"clear":false,"points":[
                            new V2(216,60), new V2(282,60)
                        ].map(point => ({point}))
                        },

                        {"order":60,"type":"lines","strokeColor":'#DADADA',"fillColor":'#DADADA',"closePath":true,"fill":true,"visible":true,"clear":false,"points":[
                            new V2(216,60), new V2(282,60)
                        ].map(point => ({point}))
                        },
                        // решетка радиатора
                        {"order":61,"type":"lines","strokeColor":'#070907',"fillColor":'#070907',"closePath":true,"fill":true,"visible":true,"clear":false,"points":[
                            new V2(234,46), new V2(263,46)
                        ].map(point => ({point}))
                        },
                         {"order":61,"type":"lines","strokeColor":'#020202',"fillColor":'#020202',"closePath":true,"fill":true,"visible":true,"clear":false,"points":[
                            new V2(234,47), new V2(263,47)
                        ].map(point => ({point}))
                        },

                        {"order":61,"type":"lines","strokeColor":'#070907',"fillColor":'#070907',"closePath":true,"fill":true,"visible":true,"clear":false,"points":[
                            new V2(234,50), new V2(263,50)
                        ].map(point => ({point}))
                        },
                         {"order":61,"type":"lines","strokeColor":'#020202',"fillColor":'#020202',"closePath":true,"fill":true,"visible":true,"clear":false,"points":[
                            new V2(234,51), new V2(263,51)
                        ].map(point => ({point}))
                        },

                        {"order":61,"type":"lines","strokeColor":'#070907',"fillColor":'#070907',"closePath":true,"fill":true,"visible":true,"clear":false,"points":[
                            new V2(234,54), new V2(263,54)
                        ].map(point => ({point}))
                        },
                         {"order":61,"type":"lines","strokeColor":'#020202',"fillColor":'#020202',"closePath":true,"fill":true,"visible":true,"clear":false,"points":[
                            new V2(234,55), new V2(263,55)
                        ].map(point => ({point}))
                        },
                        {"order":61,"type":"lines","strokeColor":'#2A2A2A',"fillColor":'#2A2A2A',"closePath":true,"fill":true,"visible":true,"clear":false,"points":[
                            new V2(250,46), new V2(250,57), new V2(251,57), new V2(251,46),
                        ].map(point => ({point}))
                        },
                        
                        // дверная ручка
                        {"order":60,"type":"lines","strokeColor":'#CFD1CE',"fillColor":'#CFD1CE',"closePath":true,"fill":true,"visible":true,"clear":false,"points":[
                            new V2(87,34), new V2(94,34), new V2(94,37), new V2(87,36)
                        ].map(point => ({point}))
                        },
                        {"order":61,"type":"lines","strokeColor":'#989E97',"fillColor":'#989E97',"closePath":true,"fill":true,"visible":true,"clear":false,"points":[
                            new V2(85,35), new V2(92,36), new V2(92,37), new V2(85,36)
                        ].map(point => ({point}))
                        },
                        {"order":62,"type":"lines","strokeColor":'#736C72',"fillColor":'#736C72',"closePath":false,"fill":true,"visible":true,"clear":false,"points":[
                            new V2(92,37), new V2(89,37), new V2(87,36)
                        ].map(point => ({point}))
                        },
                        //сидение
                        {"order":-2,"type":"lines","strokeColor":'#3D4044',"fillColor":'#36393D',"closePath":true,"fill":true,"visible":true,"clear":false,"points":[
                            new V2(76,32), new V2(84,17), new V2(97,17),new V2(103,32)
                        ].map(point => ({point}))
                        },
                        {"order":-1,"type":"lines","strokeColor":'#2B2D30',"fillColor":'#2B2D30',"closePath":true,"fill":true,"visible":true,"clear":false,"points":[
                            new V2(76,32), new V2(84,18), new V2(86,18),new V2(86,32)
                        ].map(point => ({point}))
                        },

                        {"order":-2,"type":"lines","strokeColor":'#3D4044',"fillColor":'#36393D',"closePath":true,"fill":true,"visible":true,"clear":false,"points":[
                            new V2(106,32), new V2(114,17), new V2(125,17),new V2(132,32)
                        ].map(point => ({point}))
                        },
                        {"order":-1,"type":"lines","strokeColor":'#2B2D30',"fillColor":'#2B2D30',"closePath":true,"fill":true,"visible":true,"clear":false,"points":[
                            new V2(106,32), new V2(114,18), new V2(116,18),new V2(116,32)
                        ].map(point => ({point}))
                        },

                        //white strokes
                        {"order":90,"type":"lines","strokeColor":'#D6D8D6',"fillColor":'#6A3470',"closePath":false,"fill":false,"visible":true,"clear":false,"points":[
                            new V2(154,32), new V2(142,33), new V2(135,8),new V2(148,6),new V2(157,6),new V2(183,8)
                        ].map(point => ({point}))
                        },
                        {"order":91,"type":"lines","strokeColor":'#D6D8D6',"fillColor":'#6A3470',"closePath":false,"fill":false,"visible":true,"clear":false,"points":[
                            new V2(82,30), new V2(102,32), new V2(136,32), new V2(134,9)
                        ].map(point => ({point}))
                        },
                        
                        // dark strokes
                        {"order":698,"type":"lines","strokeColor":this.colors.baseStroke,"fillColor":'#6A3470',"closePath":false,"fill":false,"visible":true,"clear":false,"points":[
                            new V2(183,8), new V2(206,30), new V2(264,32),new V2(272, 34),new V2(278, 36),new V2(283, 39),new V2(287, 44)
                        ].map(point => ({point}))
                        },
                        {"order":699,"type":"lines","strokeColor":'#201112',"fillColor":this.colors.lowerLine,"closePath":false,"fill":false,"visible":true,"clear":false,"points":[
                            new V2(82,30), new V2(76,43), new V2(76,54), new V2(80,67), new V2(87,77), new V2(144,77), new V2(139,63), new V2(139,37), new V2(143,33)
                            
                        ].map(point => ({point}))
                        },
                        
                    ]}}

                this.totalFramesCount = 4;
                this.frames = [];
                this.bodyDy = 0;
                this.bodyDyDirection = 1;
                this.tracksToggle = true;
                this.lightLine1 = {
                    from: new V2(109,35),
                    to: new V2(136,36)
                }
                this.currentLightLine2 = 0;
                this.lightLine2 = [{
                    from: new V2(173, 9), to: new V2(194,29), w: 10
                },
                {
                    from: new V2(160, 7), to: new V2(179,31), w: 13
                },
                {
                    from: new V2(145, 7), to: new V2(160,31), w: 14
                },
                {
                    from: new V2(135, 7), to: new V2(142,32), w: 12
                }]

                for(let i = 0; i < 4; i++){
                    this.currentLightLine2 = i;
                	this.frames.push(this.createImage())
                	this.bodyDy+=this.bodyDyDirection;
                	if(this.bodyDy == 2 || this.bodyDy == 0){
                		this.bodyDyDirection = -1;
                	}

                	this.tracksToggle = !this.tracksToggle;

                    this.lightLine1.from.x-=25;
                    this.lightLine1.from.y-=1.5;
                    this.lightLine1.to.x-=20;
                    this.lightLine1.to.y-=1;
                }
                //this.img = this.createImage();
                //this.img = SCG.images['c'];

                this.currentFrame = 0;
                this.timer = this.regTimerDefault(100, () => {
                    this.img = this.frames[this.currentFrame++];
                    if(this.currentFrame == this.frames.length){
                        this.currentFrame = 0;
                    }
                })
            },
            createImage() {
                return createCanvas(this.size, (ctx, size, hlp) => {
                    let pp = new PP({context: ctx});

                    //hlp.setFillColor(this.colors.base);//.rect(0,0,size.x, size.y)
                    ctx.drawImage(PP.createImage(this.backWheelModel), 233, 50);
                    ctx.drawImage(PP.createImage(this.backWheelModel), 105, 50);

                    hlp.setFillColor('#000').rect(40, size.y-6, size.x-70, 1)
                    let leftWheel = this.wheelModel();
                    let rightWheel = this.wheelModel();
                    if(this.tracksToggle){
                    	[leftWheel, rightWheel].forEach(model => {
	                    	model.main.layers[7].points[0].point.y-=1;
							model.main.layers[7].points[13].point.y-=1;
							model.main.layers[7].points[10].point.y+=2;
							model.main.layers[7].points[9].point.y+=1;
							model.main.layers[7].points[9].point.x-=1;	

							model.main.layers[4].points[0].point.x+=1;	
							model.main.layers[4].points[0].point.y+=2;	
							model.main.layers[4].points[1].point.x+=1;	
							model.main.layers[4].points[1].point.y+=2;	

							model.main.layers[3].points[9].point.y-=1;
							model.main.layers[3].points[10].point.y-=1;
							model.main.layers[3].points[11].point.y-=1;
                    	})
						
                    }
                    rightWheel.main.layers[0].points[1].point.y = 42+this.bodyDy
                    rightWheel.main.layers[0].points[2].point.y = 42+this.bodyDy

                    ctx.drawImage(PP.createImage(leftWheel), 20, 40);
                    ctx.drawImage(PP.createImage(rightWheel), 148, 40);
                    
                    ctx.drawImage(PP.createImage(this.bodyModel), 0,this.bodyDy)

                    if(this.tracksToggle){
	                    hlp.setFillColor('#0F0F0F').rect(50,89, 8, 1).rect(178,89, 8, 1)
	                    hlp.setFillColor('#0F0F0F').rect(49,91, 7, 1).rect(177,91, 7, 1)
	                    hlp.setFillColor('#0F0F0F').rect(47,93, 6, 1).rect(175,93, 6, 1)
                    }
                    else {
                    	hlp.setFillColor('#0F0F0F').rect(50,90, 7, 1).rect(178,90, 7, 1)
	                    hlp.setFillColor('#0F0F0F').rect(48,92, 7, 1).rect(176,92, 7, 1)
                    }

                    hlp.setFillColor('#444').rect(5, size.y-5, size.x-10, 1)
                    .setFillColor('#000').rect(15-this.bodyDy*5, size.y-5, size.x-30+this.bodyDy*10, 1)

                    hlp.setFillColor('#D392C9')
                    pp.lineV2(this.lightLine1.from, this.lightLine1.to)
                    pp.lineV2(this.lightLine1.from.add(new V2(5,1)), this.lightLine1.to.add(new V2(5,1)))

                    let lightLine2 = this.lightLine2[this.currentLightLine2];
                    hlp.setFillColor('#F0F0F0');
                    for(let i = 0; i < lightLine2.w;i++){
                        pp.lineV2(lightLine2.from.add(new V2(i, +this.bodyDy)), lightLine2.to.add(new V2(i, +this.bodyDy)))
                    }
                })
            }
        }), 50)
    }
}