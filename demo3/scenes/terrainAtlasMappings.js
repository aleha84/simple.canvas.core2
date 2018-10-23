function terrainAtlasMappings(defaultSourceTileSize) {
    let tileSize64x64 = new V2(64,64);
    let tileSize64x128 = new V2(64,128);
    let tileSize32x64 = new V2(32,64);
    let tileSize16x16 = new V2(16,16);
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
        },
        'groundOutBackCentral': {
            destSourcePosition: new V2(512,96),
            destSourceSize: defaultSourceTileSize.clone()
        },
        'desertOutBackCentral': {
            destSourcePosition: new V2(32,384),
            destSourceSize: defaultSourceTileSize.clone()
        },
        'greenLowGrassOutBackCentral': {
            destSourcePosition: new V2(128,736),
            destSourceSize: defaultSourceTileSize.clone()
        },
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
        'groundInBackTopLeft': {
            destSourcePosition: new V2(512,0),
            destSourceSize: defaultSourceTileSize.clone()
        },
        'desertInBackTopLeft': {
            destSourcePosition: new V2(32,288),
            destSourceSize: defaultSourceTileSize.clone()
        },
        'greenHighGrassInBackTopLeft': {
            destSourcePosition: new V2(32,640),
            destSourceSize: defaultSourceTileSize.clone()
        },
        'greenLowGrassInBack': {
            destSourcePosition: new V2(128,640),
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

    result['waterSingleTop'] = {
        destSourcePosition: new V2(288,288),
        destSourceSize: defaultSourceTileSize.clone()
    };

    result['waterSingleBottom'] = {
        destSourcePosition: new V2(288,320),
        destSourceSize: defaultSourceTileSize.clone()
    };

    result['greenSingleTop'] = {
        destSourcePosition: new V2(672,0),
        destSourceSize: defaultSourceTileSize.clone()
    };

    result['greenSingleBottom'] = {
        destSourcePosition: new V2(672,32),
        destSourceSize: defaultSourceTileSize.clone()
    };

    result['groundSingleTop'] = {
        destSourcePosition: new V2(480,0),
        destSourceSize: defaultSourceTileSize.clone()
    };

    result['groundSingleBottom'] = {
        destSourcePosition: new V2(480,32),
        destSourceSize: defaultSourceTileSize.clone()
    };

    result['desertSingleTop'] = {
        destSourcePosition: new V2(0,288),
        destSourceSize: defaultSourceTileSize.clone()
    };

    result['desertSingleBottom'] = {
        destSourcePosition: new V2(0,320),
        destSourceSize: defaultSourceTileSize.clone()
    };

    result['greenHighGrassSingleTop'] = {
        destSourcePosition: new V2(0,640),
        destSourceSize: defaultSourceTileSize.clone()
    };

    result['greenHighGrassSingleBottom'] = {
        destSourcePosition: new V2(0,672),
        destSourceSize: defaultSourceTileSize.clone()
    };

    result['greenLowGrassSingleTop'] = {
        destSourcePosition: new V2(96,640),
        destSourceSize: defaultSourceTileSize.clone()
    };

    result['greenLowGrassSingleBottom'] = {
        destSourcePosition: new V2(96,672),
        destSourceSize: defaultSourceTileSize.clone()
    };

    // trees
    result['treeSmallGreen1'] = {
        destSourcePosition: new V2(0,0),
        destSourceSize: tileSize64x64.clone(),
        imgPropertyName: 'treesTileSet1'
    };

    result['treeSmallGreen2'] = {
        destSourcePosition: new V2(128,0),
        destSourceSize: tileSize64x64.clone(),
        imgPropertyName: 'treesTileSet1'
    };

    result['treeSmallYellow1'] = {
        destSourcePosition: new V2(64,0),
        destSourceSize: tileSize64x64.clone(),
        imgPropertyName: 'treesTileSet1'
    };

    result['treeSmallYellow2'] = {
        destSourcePosition: new V2(192,0),
        destSourceSize: tileSize64x64.clone(),
        imgPropertyName: 'treesTileSet1'
    };

    result['treeTallGreen1'] = {
        destSourcePosition: new V2(256,0),
        destSourceSize: tileSize64x128.clone(),
        imgPropertyName: 'treesTileSet1',
        noTileAdjustment: true,
        size: tileSize32x64.clone()
    };

    result['treeTallGreen2'] = {
        destSourcePosition: new V2(320,0),
        destSourceSize: tileSize64x128.clone(),
        imgPropertyName: 'treesTileSet1',
        noTileAdjustment: true,
        size: tileSize32x64.clone()
    };

    result['treeTallYellow1'] = {
        destSourcePosition: new V2(384,0),
        destSourceSize: tileSize64x128.clone(),
        imgPropertyName: 'treesTileSet1',
        noTileAdjustment: true,
        size: tileSize32x64.clone()
    };

    result['treeTallYellow2'] = {
        destSourcePosition: new V2(448,0),
        destSourceSize: tileSize64x128.clone(),
        imgPropertyName: 'treesTileSet1',
        noTileAdjustment: true,
        size: tileSize32x64.clone()
    };

    result['stump1'] = {
        imgPropertyName: 'sprites_set',
        destSourceSize: defaultSourceTileSize.clone(),
        destSourcePosition: new V2(128,1024),
        noTileAdjustment: true,
        size: tileSize16x16.clone()
    }

    result['stump2'] = {
        imgPropertyName: 'sprites_set',
        destSourceSize: defaultSourceTileSize.clone(),
        destSourcePosition: new V2(96,1152),
        noTileAdjustment: true,
        size: tileSize16x16.clone()
    }

    result['stump3'] = {
        imgPropertyName: 'sprites_set',
        destSourceSize: defaultSourceTileSize.clone(),
        destSourcePosition: new V2(128,1056),
        noTileAdjustment: true,
        size: tileSize16x16.clone()
    }

    result['stump4'] = {
        imgPropertyName: 'sprites_set',
        destSourceSize: defaultSourceTileSize.clone(),
        destSourcePosition: new V2(64,1376),
        noTileAdjustment: true,
        size: tileSize16x16.clone()
    }

    result['stump5'] = {
        imgPropertyName: 'sprites_set',
        destSourceSize: defaultSourceTileSize.clone(),
        destSourcePosition: new V2(96,1376),
        noTileAdjustment: true,
        size: tileSize16x16.clone()
    }

    result['grass1'] = {
        imgPropertyName: 'sprites_set',
        destSourceSize: defaultSourceTileSize.clone(),
        destSourcePosition: new V2(0,1024),
        noTileAdjustment: true,
        size: tileSize16x16.clone()
    }

    result['grass2'] = {
        imgPropertyName: 'sprites_set',
        destSourceSize: defaultSourceTileSize.clone(),
        destSourcePosition: new V2(32,1024),
        noTileAdjustment: true,
        size: tileSize16x16.clone()
    }

    result['grass3'] = {
        imgPropertyName: 'sprites_set',
        destSourceSize: defaultSourceTileSize.clone(),
        destSourcePosition: new V2(64,1024),
        noTileAdjustment: true,
        size: tileSize16x16.clone()
    }

    result['grass4'] = {
        imgPropertyName: 'sprites_set',
        destSourceSize: defaultSourceTileSize.clone(),
        destSourcePosition: new V2(96,1024),
        noTileAdjustment: true,
        size: tileSize16x16.clone()
    }

    result['grass5'] = {
        imgPropertyName: 'sprites_set',
        destSourceSize: defaultSourceTileSize.clone(),
        destSourcePosition: new V2(0,1056),
        noTileAdjustment: true,
        size: tileSize16x16.clone()
    }

    result['grass6'] = {
        imgPropertyName: 'sprites_set',
        destSourceSize: defaultSourceTileSize.clone(),
        destSourcePosition: new V2(32,1056),
        noTileAdjustment: true,
        size: tileSize16x16.clone()
    }

    result['grass7'] = {
        imgPropertyName: 'sprites_set',
        destSourceSize: defaultSourceTileSize.clone(),
        destSourcePosition: new V2(64,1056),
        noTileAdjustment: true,
        size: tileSize16x16.clone()
    }

    result['grass8'] = {
        imgPropertyName: 'sprites_set',
        destSourceSize: defaultSourceTileSize.clone(),
        destSourcePosition: new V2(96,1056),
        noTileAdjustment: true,
        size: tileSize16x16.clone()
    }

    result['bush1'] = { destSourcePosition: new V2(0,1344) }
    result['bush2'] = { destSourcePosition: new V2(32,1344) }
    result['bush3'] = { destSourcePosition: new V2(64,1344) }
    result['bush4'] = { destSourcePosition: new V2(96,1344) }
    result['bush5'] = { destSourcePosition: new V2(128,1344) }
    result['bush6'] = { destSourcePosition: new V2(160,1344) }
    result['bush7'] = { destSourcePosition: new V2(96,1344) }
    result['bush8'] = { destSourcePosition: new V2(128,1344) }

    Object.keys(result).filter((k) => k.startsWith('bush')).forEach((k)=> {
        result[k].imgPropertyName = 'sprites_set';
        result[k].destSourceSize = defaultSourceTileSize.clone();
        result[k].noTileAdjustment = true;
        result[k].size = tileSize16x16.clone();
    })

    return result;
}