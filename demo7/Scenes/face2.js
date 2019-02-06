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
                fillStyle: '#CD8F66', points: [
                    //left
                    new V2(73,62), new V2(75,68), new V2(76,71), new V2(76,74), new V2(74,77), new V2(72,78), new V2(63,79), new V2(58,83), new V2(54,87), new V2(53,91), new V2(53,94), new V2(54,98), 
                    new V2(53,102), new V2(49,108), new V2(44,116), new V2(39,124), new V2(36,132), new V2(36,139),new V2(36,141), new V2(37,145), new V2(41,151), new V2(44,153), new V2(46,154), new V2(44,159), new V2(43,166), new V2(43,175),
                    //right
                    new V2(108,175), new V2(111,167), new V2(116,154), new V2(121,142), new V2(127,134),  
                    //arm left-part
                    new V2(129,137), new V2(132,143), new V2(135,150), new V2(138,159), new V2(140,167), new V2(143,175),
                    //arm-rightpart
                    new V2(167,175),new V2(163,159),new V2(157,141),new V2(154,127),new V2(151,115),new V2(146,102),new V2(143,95),new V2(137,88),new V2(132,85),new V2(127,84),new V2(121,82),new V2(103,75),new V2(92,55)
                ].map(p => p.mul(this.multiplier))  
            })

            //<shadows>
                //arm
                draw(ctx, {
                    fillStyle: '#5F3B26', points: [
                        //left
                        new V2(114,79), new V2(102,94), new V2(95,104), new V2(90,110), new V2(85,117),
                        new V2(83,140),new V2(87,139),new V2(91,130),new V2(97,122),new V2(107,112),new V2(115,109),
                        new V2(129,137), new V2(132,143), new V2(135,150), new V2(138,159), new V2(140,167), new V2(143,175),
                        new V2(167,175),new V2(163,159),new V2(157,141),new V2(154,127),new V2(151,115),new V2(146,102),new V2(143,95),new V2(137,88),new V2(132,85),new V2(127,84),new V2(121,82),new V2(103,75),new V2(92,55)
                    ].map(p => p.mul(this.multiplier))  
                })

                //arm-right
                draw(ctx, {
                    fillStyle: '#281913', points: [
                        //left
                        new V2(111,87), new V2(128,90), new V2(134,96), new V2(141,111), new V2(146,130), new V2(151,148), new V2(155,165), new V2(157,175),
                        //right
                        ...[new V2(167,175),new V2(163,159),new V2(157,141),new V2(154,127),new V2(151,115),new V2(146,102),new V2(143,95),new V2(137,88),new V2(132,85),new V2(127,83),new V2(121,81)].map(p => p.add(new V2(0.5,0)))
                    ].map(p => p.mul(this.multiplier))  
                })

                //body-right
                draw(ctx, {
                    fillStyle: '#201511', points: [
                        new V2(109,105), new V2(99.5,115), new V2(90,128), new V2(84,139),  new V2(80,142), new V2(77,156), new V2(80,164), new V2(77,171), new V2(75,175),
                        ...[new V2(108,175), new V2(111,167), new V2(116,154), new V2(121,142), new V2(127,135)].map(p => p.add(new V2(0.5, 0))),  
                        ...[new V2(129,137), new V2(132,143), new V2(135,150)].map(p => p.add(new V2(-.5, 0))), 
                        new V2(138,158), new V2(135,144), new V2(130,124) , new V2(125,110), new V2(115,104)
                         
                    ].map(p => p.mul(this.multiplier))  
                })

                //breast right
                draw(ctx, {
                    fillStyle: '#563A33', points: [
                        new V2(121,124), new V2(116,126), new V2(111,130), new V2(107,136), new V2(102,143), new V2(97,150), new V2(95,154),
                        new V2(99,150), new V2(104,145),  new V2(108,139), new V2(112,132),new V2(116,128)
                        , new V2(121, 125), new V2(124, 128), new V2(124, 128), new V2(129, 137.5), new V2(125, 127)
                    ].map(p => p.mul(this.multiplier))  
                })

                //breast-right-bottom
                draw(ctx, {
                    fillStyle: '#553423', points: [
                        new V2(80,148), new V2(78,152), new V2(77,158),  new V2(80,159), new V2(85,159), new V2(89,158), new V2(84,152)
                    ].map(p => p.mul(this.multiplier))  
                })
                //

                //breast right - light
                draw(ctx, {
                    fillStyle: '#754930', points: [
                        new V2(88,128), new V2(82,138), new V2(80,147), new V2(80,152), new V2(82,156), new V2(86,158), new V2(88,158),
                        new V2(87,153), new V2(86,147), new V2(86,140), new V2(87,133)
                    ].map(p => p.mul(this.multiplier))  
                })

                //breast right - leftpart
                draw(ctx, {
                    fillStyle: '#99694C', points: [
                        //new V2(96,104), new V2(84,110), new V2(77,112), 
                        new V2(77,112), new V2(73,115), new V2(69,121), new V2(67,124), new V2(66,126), 

                        new V2(65,129), new V2(64,132), new V2(63,135), new V2(62,141), new V2(63,145), new V2(65,150), new V2(67,153), new V2(69,155),
                        new V2(76,141), new V2(91,118), new V2(68,128),

                        new V2(67.5,126),new V2(68,124),new V2(70,121),new V2(74,115)
                    ].map(p => p.mul(this.multiplier))  
                })

                //breast right - leftpart - light
                draw(ctx, {
                    fillStyle: '#DB9D74', points: [
                        new V2(69,137), new V2(66,138.5), new V2(64,141), new V2(64.5,146), new V2(68,152),new V2(69.5,144),new V2(70.5,140)
                    ].map(p => p.mul(this.multiplier))  
                })

                //breast left
                

                //breast left - dark
                draw(ctx, {
                    fillStyle: '#99694C', points: [
                        new V2(61,110), new V2(62,117), new V2(63,123), new V2(63,128), new V2(62,132), new V2(61,135), new V2(60,138), new V2(58,142), new V2(56,145), new V2(54,148), new V2(52,150), 
                        new V2(59,130),new V2(59,125),new V2(57,118)//,new V2(54,114)//,new V2(51,110),new V2(53,105),
                    ].map(p => p.mul(this.multiplier))  
                })

                //breast left - light
                draw(ctx, {
                    fillStyle: '#DB9D74', points: [
                        new V2(37,133), new V2(36,138), new V2(37,144), new V2(40.5,149), new V2(44,152),new V2(47.5,143), new V2(47,138), new V2(43,135)
                    ].map(p => p.mul(this.multiplier))  
                })
                
                draw(ctx, {
                    fillStyle: '#B6784F', points: [
                        new V2(36,139),new V2(36,141), new V2(37,145), new V2(41,151), new V2(44,153), new V2(46,154), new V2(50,153), new V2(55,147)
                        , new V2(51,148.5), new V2(48,150), new V2(45,150), new V2(42,148)
                        // new V2(62,92),new V2(66,92),new V2(64,95),new V2(60,101),
                        // new V2(59,106), new V2(63,110), new V2(65,117), new V2(65,123), new V2(64,128), new V2(62.5,132), new V2(61,135), new V2(60,138), new V2(58,142), new V2(56,145), new V2(54,148), new V2(52,150), new V2(49,152),
                        // new V2(43, 153),new V2(43, 151),new V2(44, 153),new V2(47,154),new V2(48,151),new V2(51,145),new V2(53,139),new V2(52,132),new V2(51,127), new V2(48,125), new V2(43,123),new V2(45,115),new V2(48,114),new V2(54,105) 
                    ].map(p => p.mul(this.multiplier))  
                })
            //</shadows>
                
            //<stomath>
            draw(ctx, {
                fillStyle: '#B57F5C', points: [
                    new V2(57,147), new V2(54,153), new V2(48,161), new V2(45,171), 
                    new V2(48,165),new V2(52,161),new V2(56,158), 
                    new V2(58,161), new V2(58,167), new V2(59,172), new V2(60,175),
                    new V2(63,175), new V2(64,171), new V2(65,165), new V2(63,161), new V2(60,155),
                ].map(p => p.mul(this.multiplier))  
            })
            //</stomath>

            //<neck>
            draw(ctx, {
                fillStyle: '#5A3022', points: [
                    new V2(76.5,73),new V2(75,76),new V2(74,80),
                    new V2(74,83), new V2(71,86), new V2(69,89), new V2(74,91), new V2(75,93),
                    new V2(77,94),new V2(81,92),  new V2(78,90), new V2(77,84), 
                ].map(p => p.mul(this.multiplier))  
            })

            draw(ctx, {
                fillStyle: '#5A3022', points: [
                    new V2(89,88),new V2(85,89),new V2(79,92),new V2(84,92),new V2(89,92),new V2(94,91)
                    
                ].map(p => p.mul(this.multiplier))  
            })

            draw(ctx, {
                fillStyle: '#80482B', points: [
                    new V2(95,59), new V2(83,62), new V2(83,64), new V2(88,68), new V2(89,70), new V2(92,79)      
                ].map(p => p.mul(this.multiplier))  
            })
            //</neck>

            //</body>

            //<straps>
            //left
            draw(ctx, {
                fillStyle: '#0F0B0C', points: [//
                    new V2(75,76), new V2(64,87), new V2(57,96), new V2(52.5,102), new V2(49.25,107), new V2(46.5,112), new V2(43.5,117), new V2(39.5,123), new V2(37.5,127), new V2(36,130), new V2(35.25,135), new V2(35.5,139), new V2(35.5,143), new V2(36,152), new V2(36.5,157), new V2(37.5,166), new V2(38,170), new V2(39,175),
                    new V2(39,167),new V2(38,156),new V2(38,144),new V2(38,134),
                    new V2(38,142),new V2(38.5,133), new V2(44,122),new V2(48.5,115),new V2(52,109),new V2(55,104),new V2(61,97),new V2(67,90),new V2(75,82),

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

            //face-left-shadow
            draw(ctx, {
                fillStyle: '#AF6E4B', points: [
                    ...[new V2(55,7),new V2(52,11), new V2(50,15), new V2(49,24), new V2(48,32), new V2(51,34), new V2(52,45), new V2(54,51)].map(p => p.add(new V2(-0.5,0))),
                    new V2(55,46),new V2(56,39),new V2(56,35),new V2(51,30),new V2(52,24),new V2(53,17),new V2(62,9)
                ].map(p => p.mul(this.multiplier))  
            })

            //face-right-shadow
            draw(ctx, {
                fillStyle: '#77452E', points: [
                    new V2(62,10), new V2(63,19), new V2(62,24),  new V2(63,29),new V2(67,27), new V2(78,27),
                ].map(p => p.mul(this.multiplier))  
            })

            //<left eye>
            draw(ctx, {
                fillStyle: '#876D5C', strokeStyle: '#2F201B', points: [
                    new V2(50.5,33), new V2(53,32.5), new V2(56,35), new V2(56,35.5), new V2(55,35), new V2(51.5,35.5)
                ].map(p => p.add(new V2(0,0.5)).mul(this.multiplier))  
            })

            // eyebrow
            draw(ctx, {
                strokeStyle: '#392116', points: [
                    new V2(47.5,30.5), new V2(50,30.5), new V2(53,31.5)
                ].map(p => p.add(new V2(0,0.5)).mul(this.multiplier))  
            })

            //upper-lashe
            draw(ctx, {
                strokeStyle: '#09090B', closePath: false, lineWidth: 2, points: [
                    new V2(49.5,34), new V2(51,33.5), new V2(53,34)
                ].map(p => p.mul(this.multiplier))  
            })

            //apple
            draw(ctx, {
                fillStyle: '#070602', points: [
                    new V2(51.5,33), new V2(54,33.5),new V2(54.5,35),new V2(53,36),new V2(52,34.5)
                ].map(p => p.mul(this.multiplier))  
            })
            //blik
            draw(ctx, {
                fillStyle: 'white', points: [//'#444645'
                    new V2(53,34), new V2(53.5,34),new V2(53.5,35)
                ].map(p => p.mul(this.multiplier))  
            })
            //</left eye>

            //<right eye>
            draw(ctx, {
                fillStyle: '#A88C80', strokeStyle: '#2F201B', points: [
                    new V2(64.5,35),new V2(67,31.75),new V2(75,32.5),
                    new V2(75,34),new V2(69,35.5),new V2(67,35.5)
                    
                ].map(p => p.mul(this.multiplier))  
            })

            // eyebrow
            draw(ctx, {
                strokeStyle: '#392116', lineWidth:3, closePath: false, points: [
                    new V2(61,31.5), new V2(63,29.5), new V2(67,27.5)
                ].map(p => p.mul(this.multiplier))  
            })
            draw(ctx, {
                strokeStyle: '#392116', lineWidth:2, closePath: false, points: [
                    new V2(63,29.5), new V2(67,27.5), new V2(73,27.5)
                ].map(p => p.mul(this.multiplier))  
            })

            //upper-lashe
            draw(ctx, {
                strokeStyle: '#09090B', closePath: false, lineWidth: 2, points: [
                    new V2(65.25,34),new V2(67,32),new V2(75,33),
                ].map(p => p.mul(this.multiplier))  
            })

            //apple
            draw(ctx, {
                fillStyle: '#070602', points: [
                    new V2(67,32.55),new V2(69,31.55),new V2(71,32.5),new V2(71,34.5),new V2(69,35.5),new V2(67,34.5)
                ].map(p => p.mul(this.multiplier))  
            })

            //blik
            draw(ctx, {
                fillStyle: 'white', points: [//'#444645'
                new V2(67.75,32.55),new V2(67.75,34),new V2(69,34.5),
                ].map(p => p.mul(this.multiplier))  
            })
            //</right eye>

            //nose-right-stroke
            draw(ctx, {
                strokeStyle: '#895640', closePath:false, points: [
                    new V2(56,34),new V2(56,38),new V2(55,43),new V2(54,47),new V2(53,51),new V2(58,52),new V2(62,51),new V2(64,51.5),
                    new V2(66,49), new V2(64,46)
                ].map(p => p.add(new V2(0,0.5)).mul(this.multiplier))  
            })

            //nose-right-shadow
            draw(ctx, {
                fillStyle: '#895640',  points: [
                    new V2(60,50),new V2(62,51),new V2(64,51.5),
                    new V2(66,49), new V2(64,46),new V2(61,45),
                ].map(p => p.add(new V2(0,0.5)).mul(this.multiplier))  
            })

            //nosetrill
            draw(ctx, {
                fillStyle: 'black',  points: [
                    new V2(58,52.5),new V2(61,52),new V2(59,51.5)
                ].map(p => p.mul(this.multiplier))  
            })
            
            //lips
            draw(ctx, {
                fillStyle: '#A4352F', points: [
                    new V2(58,57),new V2(58.5,59), new V2(58.5,61), new V2(60,62), new V2(63,62),new V2(65,61),new V2(69,58),new V2(66,58),new V2(62,57)
                ].map(p => p.add(new V2(-.5,0)).mul(this.multiplier))  
            })

            //lips-line
            draw(ctx, {
                fillStyle: '#6B221F', lineWidth: 0.25, closePath: false, points: [
                    //new V2(58,58.5), new V2(59,59.5), new V2(63,59.5)//,new V2(69,58.5)
                    new V2(59,59.5), new V2(63,59.5),new V2(69,58.5)
                ].map(p => p.add(new V2(-.5,0)).mul(this.multiplier))  
            })

            //lips-upper stroke
            draw(ctx, {
                strokeStyle: '#895640', closePath:false, points: [
                    new V2(58.5,53),new V2(58.5,55),new V2(58,57)
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
        this.backgroundRenderDefault('lightgray');
        //SCG.contexts.background.drawImage(this.bgImg, 0,0, SCG.viewport.real.width,SCG.viewport.real.height);
    }
}