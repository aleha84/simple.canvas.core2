class Face2Scene extends Scene {
    constructor(options = {}){
        super(options);

        // this.bgImg = textureGenerator.textureGenerator({
        //     size: this.viewport,
        //     backgroundColor: '#000000',
        //     surfaces: [
        //         textureGenerator.getSurfaceProperties({
        //             colors: ['#034B7B', '#E9F4FA'], opacity: [0.75],  type: 'line', line: { length: [2,8], directionAngle: 90, angleSpread: 0 }, density: 0.005
        //         }),
        //     ]
        // })
    }

    start() {
        this.faceSize = new V2(186, 176);
        this.multiplier = 2;
        this.faceImg = createCanvas(this.faceSize.mul(this.multiplier), (ctx, size) => {
            //<body>
            draw(ctx, {
                fillStyle: '#E5AF84', points: [
                    //left
                    new V2(73,62), new V2(75,68), new V2(76,71), new V2(76,74), new V2(74,77), new V2(72,78), new V2(63,79), new V2(58,83), new V2(54,87), new V2(53,91), new V2(53,94), new V2(54,98), new V2(53,102), new V2(49,108), new V2(44,116), new V2(39,124), new V2(36,132), new V2(36,139), new V2(37,145), new V2(44,153), new V2(45,155), new V2(44,159), new V2(43,166), new V2(43,175),
                    //right
                    new V2(108,175), new V2(111,167), new V2(116,154), new V2(121,142), new V2(127,134),  
                    //arm left-part
                    new V2(129,137), new V2(132,143), new V2(135,150), new V2(138,159), new V2(140,167), new V2(143,175),
                    //arm-rightpart
                    new V2(167,175),new V2(163,159),new V2(157,141),new V2(154,127),new V2(151,115),new V2(146,102),new V2(143,95),new V2(137,88),new V2(132,85),new V2(127,84),new V2(121,82),new V2(103,75),new V2(92,55)
                ].map(p => p.mul(this.multiplier))  
            })

            //<shadows>
                //arm-right
                draw(ctx, {
                    fillStyle: '#281913', points: [
                        //left
                        new V2(111,87), new V2(128,90), new V2(134,96), new V2(141,111), new V2(146,130), new V2(151,148), new V2(155,165), new V2(157,175),
                        //right
                        ...[new V2(167,175),new V2(163,159),new V2(157,141),new V2(154,127),new V2(151,115),new V2(146,102),new V2(143,95),new V2(137,88),new V2(132,85),new V2(127,83),new V2(121,81)].map(p => p.add(new V2(0.5,0)))
                    ].map(p => p.mul(this.multiplier))  
                })
            //</shadows>
            //</body>

            //<straps>
            //left
            draw(ctx, {
                fillStyle: '#0F0B0C', points: [//
                    new V2(75,76), new V2(64,87), new V2(57,96), new V2(52.5,102), new V2(49.25,107), new V2(46,112), new V2(43,117), new V2(39,123), new V2(37.5,127), new V2(36,130), new V2(35.25,135), new V2(35.5,139), new V2(35.5,143), new V2(36,152), new V2(36.5,157), new V2(37.5,166), new V2(38,170), new V2(39,175),
                    new V2(39,167),new V2(38,156),new V2(38,144),new V2(38,134),new V2(40,128),new V2(43,122),new V2(47,115),new V2(52,109),new V2(55,104),new V2(61,97),new V2(67,90),new V2(75,82),

                ].map(p => p.mul(this.multiplier))  
            })

            //right
            draw(ctx, {
                fillStyle: '#070707', points: [//
                    new V2(114,79), new V2(102,94), new V2(95,104), new V2(90,110), new V2(85,117), new V2(79,125), new V2(75,133), new V2(72,139), new V2(71,143), new V2(70,147), new V2(69,151), new V2(68,156), new V2(67,160), new V2(66,164), new V2(65,168), new V2(64,172), new V2(64,175),
                    new V2(73,175),new V2(74,170),new V2(75,166),new V2(76,162),new V2(77,158),new V2(78,154),new V2(79,150),new V2(80,145),new V2(83,138),new V2(85,133),new V2(87,130),new V2(91,124),new V2(95,119),new V2(99,114),new V2(104,108),new V2(110,101),new V2(118,90),new V2(125,82),
                ].map(p => p.mul(this.multiplier))  
            })
            //</straps>

            //<hairBack>
            draw(ctx, {
                fillStyle: '#8C5B33', points: [
                    //left
                    new V2(60,0),new V2(53,0), new V2(47,6), new V2(43,12), new V2(42,15), new V2(42,22), new V2(39,32), new V2(37,39), new V2(38,49), new V2(41,57), new V2(48,65), new V2(49,69), new V2(46,73), new V2(49,80), new V2(56,85), new V2(58,93), new V2(54,100),
                    new V2(61,94), new V2(69,90), new V2(73,84), new V2(70,78), new V2(69,73),  new V2(70,70)

                ].map(p => p.mul(this.multiplier))  
            })

            //</hairBack>

            //<face>
            draw(ctx, {
                fillStyle: '#D89771', points: [
                    new V2(68,1), new V2(61,3), new V2(55,7), new V2(52,11), new V2(50,15), new V2(49,24), new V2(48,32), new V2(51,34), new V2(52,45), new V2(54,51), new V2(57,57), new V2(58,59), new V2(59,61), new V2(60.5,63), new V2(61,65), new V2(63,68), new V2(65,69),
                    new V2(70,69), new V2(76,67), new V2(82,64), new V2(89,60), new V2(95,56)
                ].map(p => p.mul(this.multiplier))  
            })

            //</face>

            //<hairFront>
            draw(ctx, {
                fillStyle: '#1E1813', points: [
                    new V2(55,0), new V2(52,5), new V2(53,8), new V2(59,9), new V2(64,12), new V2(67,18), new V2(69,25), new V2(71,32), new V2(75,42), new V2(81,48), new V2(88,52), new V2(91,55), new V2(91,64), new V2(90,69), new V2(90,74), new V2(89,82), new V2(90,90), new V2(96,98), new V2(102,103),
                    new V2(103,97),new V2(107,93),new V2(113,91),new V2(118,89),new V2(122,83),new V2(123,79),new V2(121,73),new V2(120,65),new V2(117,59),new V2(115,53),new V2(118,46),new V2(117,33),new V2(115,21),new V2(111,11),new V2(107,4),new V2(104,0)
                ].map(p => p.mul(this.multiplier))  
            })

            //</hairFront>
            //
            
        });

        let faceSize = this.faceSize.mul(1.5);
        let borderSizeY = (this.viewport.y - faceSize.y)/2;
        this.addGo(new GO({
            position: this.sceneCenter,
            size: faceSize,
            img: this.faceImg
        }));
    }

    backgroundRender() {
        this.backgroundRenderDefault();
        //SCG.contexts.background.drawImage(this.bgImg, 0,0, SCG.viewport.real.width,SCG.viewport.real.height);
    }
}