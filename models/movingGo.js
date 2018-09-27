class MovingGO extends GO {
    constructor(options = {}) {
        options = assignDeep({}, {
            speed: 0,
            destination: undefined,
            direction: new V2,
            setDeadOnDestinationComplete: false,
            path: [],
        }, options);

        super(options);
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
            if(this.position.distance(this.destination) <= this.speed){
                this.setDestination();
            }
			else{
                this.position.add(this.direction.mul(this.speed), true);
                this.positionChangedCallback();
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
    
    setDestination(newDestination)
	{
		if(newDestination && newDestination instanceof V2){
			this.destination = newDestination;
			this.direction = this.position.direction(this.destination);
		}
		else{
			this.destination = undefined;
            this.direction = new V2;
            this.destinationCompleteCallBack();
		}
	}
}