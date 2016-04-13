﻿


PCDviewr.PointCloudOctreeGeometry = function(){
    PCDviewr.PointCloudOctree.lru = PCDviewr.PointCloudOctree.lru || new LRU();

	this.numNodesLoading = 0;
}

PCDviewr.PointCloudOctreeGeometryNode = function(name, pcoGeometry, boundingBox){
	this.name = name;
	this.index = parseInt(name.charAt(name.length-1));
	this.pcoGeometry = pcoGeometry;
	this.boundingBox = boundingBox;
	this.children = {};
	this.numPoints = 0;
	this.level = null;
<<<<<<< HEAD
	this.hasXYZ = true;
    this.hasIntensity = false;
    this.hasRGB = false;
    this.hasClass = false;
    this.hasRetain = false;
=======
	
>>>>>>> 77d73c8122e8a087b9dece73654d63d80a45cb2e
}

PCDviewr.PointCloudOctreeGeometryNode.prototype.addChild = function(child){
	this.children[child.index] = child;
	child.parent = this;
}

PCDviewr.PointCloudOctreeGeometryNode.prototype.load = function(url){
	if(this.loading === true || this.pcoGeometry.numNodesLoading > 3){
<<<<<<< HEAD
		return 0;
=======
		return;
>>>>>>> 77d73c8122e8a087b9dece73654d63d80a45cb2e
	}
	
	if(PCDviewr.PointCloudOctree.lru.numPoints + this.numPoints >= PCDviewr.pointLoadLimit){
        PCDviewr.PointCloudOctree.disposeLeastRecentlyUsed(this.numPoints);
	}
	
	var pointsnumber = 0;
<<<<<<< HEAD
    this.pcoGeometry.numNodesLoading++;
	this.loading = true;
	var node = this;
    var node_url = url + "/" + node.name + ".lasdb";
    if(1/*PCDviewr.utils.pathExists(node_url)*/){
    //node.pcdLoad(node_url);
	try{
	var xhr = new XMLHttpRequest();
	xhr.open('GET', node_url, true);
=======
	this.pcoGeometry.numNodesLoading++;
	this.loading = true;
	var url = url + this.dir + "/" + this.bin;
	var node = this;
    //node.pcdLoad(url);
	try{
	var xhr = new XMLHttpRequest();
	xhr.open('GET', url, true);
>>>>>>> 77d73c8122e8a087b9dece73654d63d80a45cb2e
	xhr.responseType = 'arraybuffer';
	xhr.overrideMimeType('text/plain; charset=x-user-defined');
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4) {
			if (xhr.status == 200 || xhr.status == 0) {
				var buffer = xhr.response;
                pointsnumber = node.bufferLoaded(buffer);
			} else {
<<<<<<< HEAD
				console.log('Failed to load file! HTTP status: ' + xhr.status + ", file: " + node_url);
			}
		}
	};
	xhr.send(null);
	}catch(e){
		console.log("Failed to load file: " + e);
	}
    }
    return pointsnumber === undefined ? 0 : pointsnumber;
}

PCDviewr.PointCloudOctreeGeometryNode.prototype.pcdLoad = function(node_url){
    var loader = new THREE.PCDLoader();
    loader.load(node_url, function (geometry) {
=======
				console.log('Failed to load file! HTTP status: ' + xhr.status + ", file: " + url);
			}
		}
	};
	
		xhr.send(null);
	}catch(e){
		console.log("Failed to load file: " + e);
	}
    return pointsnumber;
}

PCDviewr.PointCloudOctreeGeometryNode.prototype.pcdLoad = function(url){
    var loader = new THREE.PCDLoader();
    loader.load(url, function (geometry) {
>>>>>>> 77d73c8122e8a087b9dece73654d63d80a45cb2e
        var geometry = geometry;
        geometry.boundingBox = this.boundingBox;
        this.geometry = geometry;
        this.numPoints = geometry.numpoints;
        this.loaded = true;
        this.loading = false;
        //this.pcoGeometry.numNodesLoading--;

        } );
}

PCDviewr.PointCloudOctreeGeometryNode.prototype.bufferLoaded = function(buffer){
	//console.log("loaded: " + this.name);
<<<<<<< HEAD
    var little_endian = true;
    var headerlength = 8;
    if ( buffer == null ) {return 0;}
    this.parseHeader(new DataView(buffer,0,headerlength),little_endian);

	var geometry = new THREE.BufferGeometry();
	
	var positions = new Float32Array(this.numPoints*3);
	var colors = new Float32Array(this.numPoints*3);
    var Intensity,RGB,Class,Retain,Height;
    if(this.hasRetain) Retain = new Float64Array(this.numPoints);
    if(this.hasIntensity) Intensity = new Uint16Array(this.numPoints);
    if(this.hasRGB) RGB = new Uint16Array(this.numPoints*3);
    if(this.hasClass) Class = new Int32Array(this.numPoints);
=======
    var patternHeader = /#\s\.PCD([\s\S]*)binary_compressed\s|#\s\.PCD([\s\S]*)binary\s|#\s\.PCD([\s\S]*)ascii\s/;
    var head = patternHeader.exec( bin2str(buffer) );
    var headerlength;
    if ( head !== null ) {
        headerlength = head[ 0 ].length;

	var geometry = new THREE.BufferGeometry();
	var numPoints = (buffer.byteLength-headerlength) / 16;   // 仅适用于“x y z rgb”16 bytes
	
	var positions = new Float32Array(numPoints*3);
	var colors = new Float32Array(numPoints*3);
>>>>>>> 77d73c8122e8a087b9dece73654d63d80a45cb2e
	var color = new THREE.Color();
	var body = new DataView(buffer,headerlength);
	//var fView = new Float32Array(buffer);
	//var uiView = new Uint8Array(buffer);
<<<<<<< HEAD
    var _minx,_miny,_minz,_maxx,_maxy,_maxz;
    _minx = _maxx = this.binaryRead( body, 0, "F", "4", little_endian )[0];
    _miny = _maxy = this.binaryRead( body, 4, "F", "4", little_endian )[0];
    _minz = _maxz = this.binaryRead( body, 8, "F", "4", little_endian )[0];
    var result, loc = 0;
	for(var i = 0; i < this.numPoints; i++){
        result = this.binaryReadElement( body, loc, little_endian );
=======
    var result, loc = 0;
	for(var i = 0; i < numPoints; i++){
/*		positions[3*i] = fView[4*i];
		positions[3*i+1] = fView[4*i+1];
		positions[3*i+2] = fView[4*i+2];
		
		color.setRGB(uiView[16*i+12], uiView[16*i+13], uiView[16*i+14]);
		colors[3*i] = color.r /255;
		colors[3*i+1] = color.g / 255;
		colors[3*i+2] = color.b / 255;  */

        result = binaryReadElement( body, loc, true );
>>>>>>> 77d73c8122e8a087b9dece73654d63d80a45cb2e
        loc += result[ 1 ];
        var element = result[ 0 ];
        positions[3*i] = element.x;
        positions[3*i+1] = element.y;
        positions[3*i+2] = element.z;
<<<<<<< HEAD
        if(element.x < _minx) _minx = element.x;
        if(element.x > _maxx) _maxx = element.x;
        if(element.y < _miny) _miny = element.y;
        if(element.y > _maxy) _maxy = element.y;
        if(element.z < _minz) _minz = element.z;
        if(element.z > _maxz) _maxz = element.z;
/*      var a = "#";
=======
        var a = "#";
>>>>>>> 77d73c8122e8a087b9dece73654d63d80a45cb2e
        color.setStyle(a += element.rgb.toString(16));
        colors[3*i] = color.r;
        colors[3*i+1] = color.g;
        colors[3*i+2] = color.b;
<<<<<<< HEAD
*/
        if(this.hasRetain){
            Retain[i] = element.retain;
        }
        if(this.hasIntensity){
            Intensity[i] = element.intensity;
        }
        if(this.hasRGB){
            RGB[3*i] = element.r;
            RGB[3*i+1] = element.g;
            RGB[3*i+2] = element.b;
        }
        if(this.hasClass){
            Class[i] = element.class;
        }

        colors[3*i] = 0;
        colors[3*i+1] = 0;
        colors[3*i+2] = 0;
	}
	//console.log("[minx,miny,minz] = [" + _minx + "," + _miny + "," + _minz + "]\n");
    //console.log("[maxx,maxy,maxz] = [" + _maxx + "," + _maxy + "," + _maxz + "]");
	geometry.addAttribute('position', new THREE.Float32Attribute(positions, 3));
	geometry.addAttribute('color', new THREE.Float32Attribute(colors, 3));
    //geometry.attributes.color.dynamic = true;
    if(this.hasRetain){
        geometry.addAttribute('retain', new THREE.Float32Attribute(Retain, 1));
    }
    if(this.hasIntensity){
        geometry.addAttribute('intensity', new THREE.Float32Attribute(Intensity, 1));
    }
    if(this.hasRGB){
        geometry.addAttribute('RGB', new THREE.Float32Attribute(RGB, 3));
    }
    if(this.hasClass){
        geometry.addAttribute('class', new THREE.Float32Attribute(Class, 1));
    }
    this.boundingBox = new THREE.Box3(new THREE.Vector3(_minx,_miny,_minz),new THREE.Vector3(_maxx,_maxy,_maxz));
	geometry.boundingBox = this.boundingBox;
	this.geometry = geometry;
	this.loaded = true;
	this.loading = false;
	this.pcoGeometry.numNodesLoading--;
    return this.numPoints;
/*
    function parseHeader(headerDataView,little_endian){
        var pointFormat = headerDataView.getUint32( 0 ,little_endian);
        pointFormat = pointFormat.toString(2);
        if(pointFormat & 0x02){
            this.hasIntensity = true;
        };
        if(pointFormat & 0x04){
            this.hasRGB = true;
        };
        if(pointFormat & 0x08){
            this.hasClass = true;
        };
        if(pointFormat & 0x12){
            this.hasRetain = true;
        };

        this.numPoints = headerDataView.getUint32(4,little_endian);
=======
	}
	
	geometry.addAttribute('position', new THREE.Float32Attribute(positions, 3));
	geometry.addAttribute('color', new THREE.Float32Attribute(colors, 3));
	geometry.boundingBox = this.boundingBox;
	this.geometry = geometry;
    this.numPoints = numPoints;  //!!!
	this.loaded = true;
	this.loading = false;
	this.pcoGeometry.numNodesLoading--;
        return numPoints;
>>>>>>> 77d73c8122e8a087b9dece73654d63d80a45cb2e
    }

    function binaryReadElement ( dataview, at, little_endian ) {

        var element = {
            x:undefined,
            y:undefined,
            z:undefined,
<<<<<<< HEAD
            retain:undefined,
            intensity:undefined,
            r:undefined,
            g:undefined,
            b:undefined,
            class:undefined
=======
            rgb:undefined
>>>>>>> 77d73c8122e8a087b9dece73654d63d80a45cb2e
        };
        var result, read = 0;

        result = binaryRead( dataview, at + read, "F", "4", little_endian );
        element.x = result[ 0 ];
        read += result[ 1 ];

        result = binaryRead( dataview, at + read, "F", "4", little_endian );
        element.y = result[ 0 ];
        read += result[ 1 ];

        result = binaryRead( dataview, at + read, "F", "4", little_endian );
        element.z = result[ 0 ];
        read += result[ 1 ];
<<<<<<< HEAD
        if(this.hasRetain) {
            result = binaryRead( dataview, at + read, "U", "8", little_endian );
            element.retain = result[ 0 ];
            read += result[ 1 ];
        }
        if(this.hasIntensity) {
            result = binaryRead( dataview, at + read, "U", "2", little_endian );
            element.intensity = result[ 0 ];
            read += result[ 1 ];
        }
        if(this.hasRGB) {
            result = binaryRead( dataview, at + read, "U", "1", little_endian );
            element.r = result[ 0 ];
            read += result[ 1 ];

            result = binaryRead( dataview, at + read, "U", "1", little_endian );
            element.g = result[ 0 ];
            read += result[ 1 ];

            result = binaryRead( dataview, at + read, "U", "1", little_endian );
            element.b = result[ 0 ];
            read += result[ 1 ];
        }
        if(this.hasClass) {
            result = binaryRead( dataview, at + read, "I", "4", little_endian );
            element.class = result[ 0 ];
            read += result[ 1 ];
        }

        return [ element, read ];
=======

        result = binaryRead( dataview, at + read, "U", "4", little_endian );
        element.rgb = result[ 0 ];
        read += result[ 1 ];

        return [ element, read ];

>>>>>>> 77d73c8122e8a087b9dece73654d63d80a45cb2e
    }

    function binaryRead ( dataview, at, TYPE, SIZE, little_endian ) {

        switch ( SIZE ) {

            // corespondences for non-specific length types here match rply:
            case "1":
                if(TYPE == "I")
                    return [ dataview.getInt8( at ), 1 ];
                else
                    return [ dataview.getUint8( at ), 1 ];
                break;

            case "2":
                if(TYPE == "I")
                    return [ dataview.getInt16( at, little_endian ), 2 ];
                else
                    return [ dataview.getUint16( at, little_endian ), 2 ];
                break;

            case "4":
                if(TYPE == "I")
                    return [ dataview.getInt32( at, little_endian ), 4 ];
                if(TYPE == "U")
                    return [ dataview.getUint32( at, little_endian ), 4 ];
                if(TYPE == "F")
                    return [ dataview.getFloat32( at, little_endian ), 4 ];
                break;

            case "8":
                return [ dataview.getFloat64( at, little_endian ), 8 ];
                break;

            default:
                console.log('what\'s wrong!!');
        }

    }

    function bin2str ( buf ) {

        var array_buffer = new Uint8Array( buf );
        var str = '';
        for ( var i = 0; i < buf.byteLength; i ++ ) {

            str += String.fromCharCode( array_buffer[ i ] ); // implicitly assumes little-endian    ????????

        }

        return str;

<<<<<<< HEAD
    } */
=======
    }
>>>>>>> 77d73c8122e8a087b9dece73654d63d80a45cb2e
}

PCDviewr.PointCloudOctreeGeometryNode.prototype.dispose = function(){
	delete this.geometry;
	this.loaded = false;
	
	//console.log("dispose: " + this.name);
<<<<<<< HEAD
}

PCDviewr.PointCloudOctreeGeometryNode.prototype.parseHeader = function(headerDataView,little_endian){
    var pointFormat = headerDataView.getUint32( 0 ,little_endian);
    pointFormat = pointFormat.toString(2);
    if(pointFormat & 0x02){
        this.hasIntensity = true;
    };
    if(pointFormat & 0x04){
        this.hasRGB = true;
    };
    if(pointFormat & 0x08){
        this.hasClass = false;
    };
    if(pointFormat & 0x16){
        this.hasRetain = true;
    };
    var _numPoints = headerDataView.getUint32(4,little_endian);
    this.numPoints = _numPoints === undefined ? 0 : _numPoints;
}

PCDviewr.PointCloudOctreeGeometryNode.prototype.binaryReadElement = function(dataview, at, little_endian){

    var element = {
        x:undefined,
        y:undefined,
        z:undefined,
        retain:undefined,
        intensity:undefined,
        r:undefined,
        g:undefined,
        b:undefined,
        class:undefined
    };
    var result, read = 0;

    result = this.binaryRead( dataview, at + read, "F", "4", little_endian );
    element.x = result[ 0 ];
    read += result[ 1 ];

    result = this.binaryRead( dataview, at + read, "F", "4", little_endian );
    element.y = result[ 0 ];
    read += result[ 1 ];

    result = this.binaryRead( dataview, at + read, "F", "4", little_endian );
    element.z = result[ 0 ];
    read += result[ 1 ];
    if(this.hasRetain) {
        result = this.binaryRead( dataview, at + read, "U", "8", little_endian );
        element.retain = result[ 0 ];
        read += result[ 1 ];
    }
    if(this.hasIntensity) {
        result = this.binaryRead( dataview, at + read, "U", "2", little_endian );
        element.intensity = result[ 0 ];
        read += result[ 1 ];
    }
    if(this.hasRGB) {
        result = this.binaryRead( dataview, at + read, "U", "2", little_endian );
        element.r = result[ 0 ];
        read += result[ 1 ];

        result = this.binaryRead( dataview, at + read, "U", "2", little_endian );
        element.g = result[ 0 ];
        read += result[ 1 ];

        result = this.binaryRead( dataview, at + read, "U", "2", little_endian );
        element.b = result[ 0 ];
        read += result[ 1 ];
    }
    if(this.hasClass) {
        result = this.binaryRead( dataview, at + read, "U", "4", little_endian );
        element.class = result[ 0 ];
        read += result[ 1 ];
    }

    return [ element, read ];
}

PCDviewr.PointCloudOctreeGeometryNode.prototype.binaryRead = function(dataview, at, TYPE, SIZE, little_endian){

    switch ( SIZE ) {

        // corespondences for non-specific length types here match rply:
        case "1":
            if(TYPE == "I")
                return [ dataview.getInt8( at ), 1 ];
            else
                return [ dataview.getUint8( at ), 1 ];
            break;

        case "2":
            if(TYPE == "I")
                return [ dataview.getInt16( at, little_endian ), 2 ];
            else
                return [ dataview.getUint16( at, little_endian ), 2 ];
            break;

        case "4":
            if(TYPE == "I")
                return [ dataview.getInt32( at, little_endian ), 4 ];
            if(TYPE == "U")
                return [ dataview.getUint32( at, little_endian ), 4 ];
            if(TYPE == "F")
                return [ dataview.getFloat32( at, little_endian ), 4 ];
            break;

        case "8":
            return [ dataview.getFloat64( at, little_endian ), 8 ];
            break;

        default:
            console.log('what\'s wrong!!');
    }

=======
>>>>>>> 77d73c8122e8a087b9dece73654d63d80a45cb2e
}