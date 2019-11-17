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
    groupMapper(g) {
        return {
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
        }
    },
    pointMapper(p) {
        return {
            point: new V2(p.point),
            order: p.order,
            selected: p.selected,
            id: p.id
        }
    }
}