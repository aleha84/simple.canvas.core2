class FaceScene extends Scene {
    constructor(options = {}){
        super(options);
    }

    start() {
        this.faceSize = new V2(80, 65);
        this.multiplier = 2;
        this.faceImg = createCanvas(this.faceSize.mul(this.multiplier), (ctx, size) => {

            draw(ctx, {
                fillStyle: '#68210F', points: [new V2(30,52), new V2(29,56), new V2(29,59), new V2(31,62), new V2(32,60), new V2(34,57), new V2(34,53)].map(p => p.mul(this.multiplier))  
            })
            //neck
            draw(ctx, {
                fillStyle: '#DF924A', points: [new V2(50,37), new V2(32,54), new V2(36,56), new V2(37,59), new V2(37.5,62), new V2(38,64), new V2(51,64)].map(p => p.mul(this.multiplier))  
            });

            draw(ctx, {
                fillStyle: '#9C4323', points: [new V2(50,34), new V2(29,54), new V2(33,54), new V2(36,55), new V2(39,59), new V2(41,64), new V2(52,64)].map(p => p.mul(this.multiplier))  
            })

            draw(ctx, {
                fillStyle: '#190202', points: [new V2(50,34), new V2(30,54), new V2(35,54), new V2(38,55), new V2(41,59), new V2(45,64), new V2(55,64)].map(p => p.mul(this.multiplier))  
            })
            
            //

            //hair
            draw(ctx, {
                fillStyle: '#A93F29', points: [new V2(14,0), new V2(7,9), new V2(6,21), new V2(14,37), new V2(18,31), new V2(16,14), new V2(22,7), new V2(34,0)].map(p => p.mul(this.multiplier))  
            })

            draw(ctx, {
                fillStyle: '#B17634', points: [new V2(12,2), new V2(8,7), new V2(13,12), new V2(16,9)].map(p => p.mul(this.multiplier))  
            })

            draw(ctx, {
                fillStyle: '#68210F', points: [new V2(16,12), new V2(10,22), new V2(14,35), new V2(20,24)].map(p => p.mul(this.multiplier))  
            })

            draw(ctx, {
                fillStyle: '#BF4026', points: [new V2(13,39), new V2(7,50), new V2(3,58), new V2(4,64), new V2(17,64), new V2(31,39)].map(p => p.mul(this.multiplier))  
            })

            draw(ctx, {
                fillStyle: 'black', points: [new V2(15,42), new V2(11,51), new V2(8,54), new V2(10,57), new V2(5,59), new V2(6,64)
                    , new V2(9,64), new V2(11,60), new V2(14,55), new V2(16,51),new V2(16,45)].map(p => p.mul(this.multiplier))  
            })

            draw(ctx, {
                fillStyle: '#68210F', points: [new V2(17,44), new V2(19,55), new V2(17,64), new V2(26,52)].map(p => p.mul(this.multiplier))  
            })

            draw(ctx, {
                fillStyle: '#A93F29', points: [new V2(14,0), new V2(20,10), new V2(26,12), new V2(30,15), new V2(36,24), new V2(44,30), new V2(45,37),  new V2(43,48), new V2(43,54), new V2(48,46), new V2(48,56), new V2(50,64),
                    new V2(70,64), new V2(74,53),new V2(78,39),new V2(77,21),new V2(72,8),new V2(65,0)    ].map(p => p.mul(this.multiplier))  
            })

            draw(ctx, {
                fillStyle: '#220302', points: [new V2(30,0), new V2(25,2), new V2(18,3), new V2(21,6), new V2(27,5), new V2(33,3), new V2(36,0)].map(p => p.mul(this.multiplier))  
            })

            draw(ctx, {
                fillStyle: '#250502', points: [new V2(71,7),
                    new V2(65,5), new V2(64,8),new V2(59,6), new V2(58,9), new V2(57,12),  new V2(51,9), new V2(52,13), new V2(48,12), new V2(46,15), new V2(43,15),  new V2(42,18), new V2(40,20),new V2(49,30),
                    new V2(60,28), new V2(61,24),   new V2(65,32), new V2(66,43), new V2(62,55), new V2(62,64),new V2(80,64), new V2(78,53),new V2(78.5,39),new V2(77.5,21),new V2(72.5,8),new V2(65.5,0)].map(p => p.mul(this.multiplier))  
            })//
            
            //face
            draw(ctx, {
                fillStyle: '#FCF0C0', points: [new V2(20,9), new V2(29,10), new V2(34,19), new V2(48,32), new V2(48,39), new V2(41,47), new V2(31,54), new V2(24,55),
                    new V2(22,53), new V2(22,50), new V2(20,49), new V2(19,47), new V2(17,45), new V2(18,41), new V2(13,39), new V2(13,37), new V2(17,29), new V2(15,23),new V2(15.5,14)].map(p => p.mul(this.multiplier))  
            })

            //nose shadow
            draw(ctx, {
                fillStyle: '#D4AD64', points: [new V2(12.5,38.5), new V2(20,39), new V2(18,41)].map(p => p.mul(this.multiplier))  
            })

            draw(ctx, {
                fillStyle: '#EFE7DA', points: [new V2(24,26), new V2(28,26), new V2(31,27), new V2(27,29), new V2(25,29)].map(p => p.mul(this.multiplier))  
            })

            //eyes
            draw(ctx, {
                strokeStyle: 'black', lineWidth: 1*this.multiplier, closePath: false, points: [new V2(23,26.5), new V2(24,25.5), new V2(26,25.5),  new V2(31,28)].map(p => p.mul(this.multiplier))  
            })

            draw(ctx, {
                strokeStyle: '#600C0C', lineWidth: 0.7*this.multiplier, closePath: false, points: [new V2(15.5,39.5),  new V2(18,39), new V2(18.5,39.25)].map(p => p.mul(this.multiplier))  
            })

            draw(ctx, {
                strokeStyle: '#600C0C', lineWidth: 0.7*this.multiplier, closePath: false, points: [new V2(15,23),  new V2(16.5,25.5)].map(p => p.mul(this.multiplier))  
            })

            // draw(ctx, {
            //     strokeStyle: 'black', lineWidth: 0.5*this.multiplier, closePath: false, points: [new V2(15,24),  new V2(16.5,26.5)].map(p => p.mul(this.multiplier))  
            // })

            draw(ctx, {
                strokeStyle: '#9E4F28', lineWidth: 0.5*this.multiplier, closePath: false, points: [new V2(24,29), new V2(26,29), new V2(29,29), new V2(31,28)].map(p => p.mul(this.multiplier))  
            })

            draw(ctx, {
                strokeStyle: '#2C2CCC', lineWidth: 1*this.multiplier, closePath: false, points: [new V2(24.5,26), new V2(25,28)].map(p => p.mul(this.multiplier))  
            })

            draw(ctx, {
                strokeStyle: '#571809', lineWidth: 1*this.multiplier, closePath: false, points: [new V2(20,25), new V2(24,23), new V2(28,24)].map(p => p.mul(this.multiplier))  
                
            })

            draw(ctx, {
                strokeStyle: '#571809', lineWidth: 0.75*this.multiplier, closePath: false, points: [new V2(28,24),  new V2(33,26)].map(p => p.mul(this.multiplier))     
            })

            draw(ctx, {
                fillStyle: '#C95A3C', points: [new V2(17,45), new V2(19,45),new V2(23,46),new V2(25.5,46.25),new V2(22,48.5),new V2(20,49),new V2(19,48),new V2(19,47)].map(p => p.mul(this.multiplier))  
            })

            draw(ctx, {
                strokeStyle: '#430605', lineWidth: 0.25*this.multiplier, closePath: false, points: [new V2(18,46.25), new V2(23,46.5), new V2(24.5,46.5)].map(p => p.mul(this.multiplier))  
            })
            draw(ctx, {
                strokeStyle: '#DD7244', lineWidth: 0.5*this.multiplier, closePath: false, points: [new V2(19,40),new V2(20,40), new V2(21.5,39), new V2(20.5,37)].map(p => p.mul(this.multiplier))  
            })

   

            draw(ctx, {
                fillStyle: '#D4AD64', points: [new V2(18.5,31), new V2(16.5,36), new V2(19.5,35.5)].map(p => p.mul(this.multiplier))  
            })
//shadows
            draw(ctx, {
                fillStyle: '#E2C48E', points: [new V2(43,28), new V2(33,36), new V2(32,44), new V2(27,50), new V2(28,54),new V2(31,54),new V2(41,47),new V2(48,39),new V2(48,32)].map(p => p.mul(this.multiplier))  
            })
            
            draw(ctx, {
                fillStyle: '#AA4F2A', points: [new V2(47,33), new V2(43,40), new V2(37,47), new V2(31,53), new V2(24,55), new V2(28,55),new V2(31,54.5),new V2(41,47.5),new V2(48,39.5),new V2(48,32.5)].map(p => p.mul(this.multiplier))  
            })
            
            draw(ctx, {
                fillStyle: '#C36D3A', points: [new V2(44.5,29), new V2(38,35), new V2(38,39), new V2(48,32)].map(p => p.mul(this.multiplier))  
            })

            draw(ctx, {
                fillStyle: '#D4AD64', points: [new V2(20,8), new V2(15,13), new V2(15,21), new V2(20,20), new V2(21,13), new V2(22,10), new V2(25,9)].map(p => p.mul(this.multiplier))  
            })

            draw(ctx, {
                fillStyle: '#D4AD64', points: [new V2(29,10), new V2(28,13), new V2(30,21), new V2(36,26), new V2(42,26), new V2(34,18)].map(p => p.mul(this.multiplier))  
            })

            draw(ctx, {
                fillStyle: '#220302', points: [new V2(58.5,29), new V2(53,38), new V2(54,41), new V2(57,38)].map(p => p.mul(this.multiplier))  
            })

            //ear
            draw(ctx, {
                fillStyle: '#E2C48E', points: [new V2(55,24), new V2(57,26), new V2(58,28), new V2(58,32), new V2(55.5,35), new V2(54,37), new V2(52,38),new V2(51,37),new V2(52,34),new V2(52,31),new V2(51,28),new V2(52,25)].map(p => p.mul(this.multiplier))  
            })

            draw(ctx, {
                fillStyle: '#55170A', points: [new V2(53,28), new V2(55,30), new V2(53,32)].map(p => p.mul(this.multiplier))  
            })

            draw(ctx, {
                strokeStyle: '#55170A', lineWidth: 0.25*this.multiplier, closePath: false, points: [new V2(53,27), new V2(55,26),new V2(56,27),new V2(57,30),new V2(55,34)].map(p => p.mul(this.multiplier))     
            })
            
            
        });

        let faceSize = this.faceSize.mul(this.multiplier);
        let borderSizeY = (this.viewport.y - faceSize.y)/2;
        this.addGo(new GO({
            position: this.sceneCenter,
            size: faceSize,
            img: this.faceImg
        }));

        this.addGo(new GO({
            position: new V2(this.viewport.x/2, this.viewport.y - borderSizeY/2),
            size: new V2(this.viewport.x, borderSizeY + 3),
            img: createCanvas(new V2(1,1), (ctx, size) => {ctx.fillStyle = 'white'; ctx.fillRect(0,0, size.x, size.y)})
        }))

        this.addGo(new GO({
            position: new V2(this.viewport.x/2,  borderSizeY/2),
            size: new V2(this.viewport.x, borderSizeY ),
            img: createCanvas(new V2(1,1), (ctx, size) => {ctx.fillStyle = 'white'; ctx.fillRect(0,0, size.x, size.y)})
        }))

        this.bgImg = textureGenerator.textureGenerator({
            size: this.viewport,
            backgroundColor: '#000000',
            surfaces: [
                textureGenerator.getSurfaceProperties({
                    colors: ['#034B7B', '#E9F4FA'], opacity: [0.75],  type: 'line', line: { length: [2,8], directionAngle: 90, angleSpread: 0 }, density: 0.005
                }),
            ]
        })
    }

    backgroundRender() {
        //this.backgroundRenderDefault();
        SCG.contexts.background.drawImage(this.bgImg, 0,0, SCG.viewport.real.width,SCG.viewport.real.height);
    }
}