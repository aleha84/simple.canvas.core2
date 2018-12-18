class MovingGO extends GO {
    constructor(options = {}) {
        options = assignDeep({}, {
            speed: 0,
            destination: undefined,
            direction: new V2,
            setDeadOnDestinationComplete: false,
            path: [],
            setDestinationOnInit: false,
            positionChangeProcesser: undefined
        }, options);

        super(options);

        if(this.setDestinationOnInit) {
            let destination = this.destination;
            if(!this.destination && this.path.length) {
                destination = this.path.shift();
            }

            if(this.destination){
                this.setDestination(destination);
            }
        }
    }

    positionChangedCallback() {}

    destinationCompleteCallBack() {}

    pathCompleteCallBAck() {}

    beforePositionChange() {}

    internalPreUpdate(now) {
        this.beforePositionChange(now);

        if(!this.speed || this.speed === 0)
            return;

        if(this.destination)
		{
            if(
                (this.destinationCompleteCheck && isFunction(this.destinationCompleteCheck) && this.destinationCompleteCheck()) 
                || (this.position.distance(this.destination) <= this.speed)){
                this.setDestination();
            }
			else{
                let delta;

                if(this.positionChangeProcesser && isFunction(this.positionChangeProcesser)){
                    delta = this.positionChangeProcesser();
                }
                else {
                    delta = this.direction.mul(this.speed);
                    this.position.add(delta, true);
                }

                this.positionChangedCallback(delta);
                this.needRecalcRenderProperties = true;
			}	
		}

		if(this.destination == undefined)
		{
			if(this.path.length > 0)
			{
				this.setDestination(this.path.shift());
			}
			else {
                if(this.setDeadOnDestinationComplete)
                    this.setDead();
                    
                this.pathCompleteCallBAck();

				return;
			}
		}

    }
    
    setDestination(newDestination, relative = false)
	{
		if(newDestination && newDestination instanceof V2){

			this.destination = !relative ? newDestination : this.position.add(newDestination);
			this.direction = this.position.direction(this.destination);
		}
		else{
			this.destination = undefined;
            this.direction = new V2;
            this.destinationCompleteCallBack();
		}
    }
    
    stop() {
        this.setDestination();
    }
}