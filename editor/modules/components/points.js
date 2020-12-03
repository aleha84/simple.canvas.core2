components.fillPoints = function(groupProps, changeCallback) {
    let {pointsEl, pointEl, points} = groupProps;
    components.editor.editor.removeSelectedPoint = undefined;
    let fillPoint = (point, selectedOptionEl,changeCallback, eventDetails) => {
        htmlUtils.removeChilds(pointEl);

        if(point == undefined){
            changeCallback();
            return;
        }

        pointEl.appendChild(components.createV2(point.point, 'Point', function() {
            if(selectedOptionEl)
                selectedOptionEl.text =  `x: ${point.point.x}, y: ${point.point.y}`

            changeCallback();
        }))
        
        if(eventDetails!= 'skipSelectChangeCallback')
            changeCallback();
    }

    htmlUtils.removeChilds(pointsEl);

    let pointsToShow = points;

    let removeAllPoints = function() {
        while(points.length){
            points.pop();
        }

        components.fillPoints(groupProps, changeCallback);
        components.editor.editor.setModeState(true, 'edit');
        components.editor.editor.selected.pointId = undefined;
        changeCallback();
    }

    if(!groupProps.showPoints){
        //pointsToShow =  points.length > 0 ? [points[0]] : [];
        pointsEl.appendChild(htmlUtils.createElement('div', { text: 'Points hidden: ' + points.length }))
        pointsEl.appendChild(htmlUtils.createElement('input', { value: 'Remove all', attributes: { type: 'button' }, events: {
            click: removeAllPoints
        } }))

        return;
    }

    let removePointCallback = function(e, select) {
        points = points.filter(p => p.id != select.value);  
        points.forEach((p, i) => p.order = i);
        select.value = undefined;
        groupProps.points = points;
        components.fillPoints(groupProps, changeCallback);
        components.editor.editor.setModeState(true, 'edit');
        components.editor.editor.selected.pointId = undefined;
        changeCallback();
    }


    // points list
    pointsEl.appendChild(components.createList({
        title: 'Points',
        items: pointsToShow.map(p => {return { title: `x: ${p.point.x}, y: ${p.point.y}`, value: p.id, selected: p.selected }}),
        callbacks: {
            select: function(e){ 
                points.forEach(p => p.selected = false);
                let selectedPoint = points.find(l => l.id == e.target.value);
                if(selectedPoint){
                    selectedPoint.selected = true;
                    components.editor.editor.selected.pointId = selectedPoint.id;
                    components.editor.editor.removeSelectedPoint = () => removePointCallback(e,e.target);
                    //console.log('selected point id: ' + components.editor.editor.selected.pointId); 
                }

                let selectedOption = undefined;
                for(let i = 0; i < e.target.options.length;i++){
                    if(e.target.options[i].value == e.target.value){
                        selectedOption = e.target.options[i];
                        break;
                    }
                }

                components.editor.editor.setModeState(true, 'edit');

                fillPoint(selectedPoint,selectedOption, changeCallback, e.detail);  
            },
            reset: function(e) { 
                components.editor.editor.selected.pointId = undefined;

                points.forEach(p => p.selected = false);
                components.editor.editor.setModeState(true, 'edit');
                fillPoint(undefined, undefined, changeCallback, '') 
            },
            remove(e, select) {
                removePointCallback(e, select);
            },
            removeAll(e, select) {
                removeAllPoints();
            },
            add: function(e, select) {
                
                if(groupProps.currentPointId == undefined){
                    groupProps.currentPointId = 0;
                }

                let nextPointId = `${groupProps.id}_p_${groupProps.currentPointId++}`;
                while(points.filter(p => p.id == nextPointId).length > 0){
                    nextPointId = `${groupProps.id}_p_${groupProps.currentPointId++}`;
                }

                points.push({
                    id: nextPointId,
                    order: points.length,
                    point: {x: 0, y: 0},
                })
                components.fillPoints(groupProps, changeCallback);
                components.editor.editor.setModeState(true, 'edit');
                changeCallback();
            },
            move(select, direction) {
                let p = points.filter(p => p.id == select.value); 
                if(!p.length)
                    return;
                else 
                    p = p[0];

                let currentIndex = points.indexOf(p);
                if((direction == -1 && currentIndex == 0) || (direction == 1 && currentIndex == points.length-1))
                    return;

                components.array_move(points, currentIndex, currentIndex + direction);
                points.forEach((p, i) => p.order = i);

                components.fillPoints(groupProps, changeCallback);
                components.editor.editor.setModeState(true, 'edit');
                changeCallback();
            },
            changeCallback: changeCallback
        }
    }))
}