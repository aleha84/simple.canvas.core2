class TankScene extends Scene {
    options = assignDeep({}, {
        
        
    }, options);

    super(options);
}

class Tank extends GO {
    constructor(options = {}) {
        options = assignDeep({}, {
            size: new V2(50, 30),
            
        }, options);

        super(options);
    }
}