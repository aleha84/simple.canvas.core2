function terrainAtlasMappings(defaultSourceTileSize) {
    let initialCentralPositions = {
        'greenHighGrassOutBackCentral': {
            destSourcePosition: new V2(32,736),
            destSourceSize: defaultSourceTileSize.clone()
        },
        'greenBackCentral': {
            destSourcePosition: new V2(704,96),
            destSourceSize: defaultSourceTileSize.clone()
        },
        'waterOutBackCentral': {
            destSourcePosition: new V2(320,384),
            destSourceSize: defaultSourceTileSize.clone()
        }
    }

    let result = {};

    Object.keys(initialCentralPositions).forEach(propName => {
        let centralMap = initialCentralPositions[propName];
        result[propName] = centralMap;

        let ds = defaultSourceTileSize;
        let centralMapSP = centralMap.destSourcePosition;
        let propNameWithoutCentral = propName.replace('Central', '');
        result[propNameWithoutCentral + 'TopLeft'] = { destSourcePosition: centralMapSP.add(new V2(-ds.x, -ds.y)), destSourceSize: ds.clone() }
        result[propNameWithoutCentral + 'Top'] = { destSourcePosition: centralMapSP.add(new V2(0, -ds.y)), destSourceSize: ds.clone() }
        result[propNameWithoutCentral + 'TopRight'] = { destSourcePosition: centralMapSP.add(new V2(ds.x, -ds.y)), destSourceSize: ds.clone() }
        result[propNameWithoutCentral + 'Right'] = { destSourcePosition: centralMapSP.add(new V2(ds.x, 0)), destSourceSize: ds.clone() }
        result[propNameWithoutCentral + 'BottomRight'] = { destSourcePosition: centralMapSP.add(new V2(ds.x, ds.y)), destSourceSize: ds.clone() }
        result[propNameWithoutCentral + 'Bottom'] = { destSourcePosition: centralMapSP.add(new V2(0, ds.y)), destSourceSize: ds.clone() }
        result[propNameWithoutCentral + 'BottomLeft'] = { destSourcePosition: centralMapSP.add(new V2(-ds.x, ds.y)), destSourceSize: ds.clone() }
        result[propNameWithoutCentral + 'Left'] = { destSourcePosition: centralMapSP.add(new V2(-ds.y, 0)), destSourceSize: ds.clone() }
    });

    let initialSquarePositions = {
        'waterInBackTopLeft': {
            destSourcePosition: new V2(320,288),
            destSourceSize: defaultSourceTileSize.clone()
        },
        'greenHighGrassInBackTopLeft': {
            destSourcePosition: new V2(32,640),
            destSourceSize: defaultSourceTileSize.clone()
        }
    }

    Object.keys(initialSquarePositions).forEach(propName => {
        let topLeftMap = initialSquarePositions[propName];
        result[propName] = topLeftMap;

        let ds = defaultSourceTileSize;
        let topLeftMapSP = topLeftMap.destSourcePosition;
        let propNameWithoutTopLeft = propName.replace('TopLeft', '');
        result[propNameWithoutTopLeft + 'TopRight'] = { destSourcePosition: topLeftMapSP.add(new V2(ds.x, 0)), destSourceSize: ds.clone() }
        result[propNameWithoutTopLeft + 'BottomRight'] = { destSourcePosition: topLeftMapSP.add(new V2(ds.x, ds.y)), destSourceSize: ds.clone() }
        result[propNameWithoutTopLeft + 'BottomLeft'] = { destSourcePosition: topLeftMapSP.add(new V2(0, ds.y)), destSourceSize: ds.clone() }
    });

    return result;
}