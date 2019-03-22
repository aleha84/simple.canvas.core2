class Ground extends GO {
    constructor(options = {}) {
        options = assignDeep({}, {
            size: new V2(500, 100),
        }, options);

        super(options)

        
    }

    init(){
        let that = this;

        this.background = this.addChild(new GO({
            size: this.size.clone(),
            position: new V2(),
            img: colorTransitionHelper.create({
                size: this.size,
                type: 'lines',
                items: [
                    {
                        color: '#B5946A',
                        position: 0,
                        startTransitionFrom: 2,
                        noNextColorPropbabilityCheck: true,
                    },
                    {
                        color: '#C4A073',
                        position: 6,
                        startTransitionFrom: 9,
                        noNextColorPropbabilityCheck: true,
                    },
                    {
                        color: '#CCA678',
                        position: 15,
                        startTransitionFrom: 25
                    },
                    {
                        color: '#DBB181',
                        position: 35,
                        startTransitionFrom: 45
                    },
                    {
                        color: '#E2B985',
                        position: this.size.y
                    }
                ]
            })
        }))

        this.landingPad = this.addChild(new GO({
            size: new V2(140,20),
            position: new V2(0, -4),
            img: PP.createImage(spacePortImages.landingPad)
        }))
    }
}