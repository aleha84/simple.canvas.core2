var modelUtils = {
    layerMapper(l) {
        return {
            order: l.order,
            selected: l.selected,
            id: l.id,
            name: l.name,
            visible: l.visible,
        }
    },
    groupMapper(g, deep = false) {
        let group = {
            order: g.order,
            selected: g.selected,
            type: g.type,
            strokeColor: g.strokeColor,
            strokeColorOpacity: g.strokeColorOpacity,
            fillColor: g.fillColor,
            fillColorOpacity: g.fillColorOpacity,
            closePath: g.closePath,
            fill: g.fill,
            fillPattern: g.fillPattern,
            visible: g.visible,
            clear: g.clear,
            id: g.id,
            //points: deep ? 
        };

        if(deep){
            group.points = g.points.map((p) => {
                return {
                    ...modelUtils.pointMapper(p)
                }
            });
        }

        return group
    },
    pointMapper(p) {
        return {
            point: new V2(p.point),
            order: p.order,
            selected: p.selected,
            id: p.id
        }
    },
    createDefaultLayer(id, order) {
        return {
            order: order,
            currentGroupId: 0,
            selected: false,
            id: id,
            name: '',
            visible: true,
            groupsEl: undefined,
            groupEl: undefined,
            groups: []
        }
    },
    createDefaultGroup(id, order){
        return {
            currentPointId: 0,
            selected: false,
            order: order,
            id: id,
            visible: true,
            clear: false,
            strokeColor: '#FF0000',
            strokeColorOpacity: 1,
            fillColor: '#FF0000',
            fillColorOpacity: 1,
            fill: false,
            fillPattern: false,
            closePath: false,
            type: 'dots',
            pointsEl: undefined,
            pointEl: undefined,
            points: []
        }
    }
}