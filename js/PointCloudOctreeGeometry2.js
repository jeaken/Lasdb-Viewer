


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
	
}

PCDviewr.PointCloudOctreeGeometryNode.prototype.addChild = function(child){
	this.children[child.index] = child;
	child.parent = this;
}

PCDviewr.PointCloudOctreeGeometryNode.prototype.load = function(url){
	if(this.loading === true || this.pcoGeometry.numNodesLoading > 3){
		return;
	}
	
	if(PCDviewr.PointCloudOctree.lru.numPoints + this.numPoints >= PCDviewr.pointLoadLimit){
        PCDviewr.PointCloudOctree.disposeLeastRecentlyUsed(this.numPoints);
	}
	
	var pointsnumber = 0;
	this.pcoGeometry.numNodesLoading++;
	this.loading = true;
	var url = url + this.dir + "/" + this.bin;
	var node = this;
    //node.pcdLoad(url);
	try{
	var xhr = new XMLHttpRequest();
	xhr.open('GET', url, true);
	xhr.responseType = 'arraybuffer';
	xhr.overrideMimeType('text/plain; charset=x-user-defined');
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4) {
			if (xhr.status == 200 || xhr.status == 0) {
				var buffer = xhr.response;
                pointsnumber = node.bufferLoaded(buffer);
			} else {
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
    var patternHeader = /#\s\.PCD([\s\S]*)binary_compressed\s|#\s\.PCD([\s\S]*)binary\s|#\s\.PCD([\s\S]*)ascii\s/;
    var head = patternHeader.exec( bin2str(buffer) );
    var headerlength;
    if ( head !== null ) {
        headerlength = head[ 0 ].length;

	var geometry = new THREE.BufferGeometry();
	var numPoints = (buffer.byteLength-headerlength) / 16;   // 仅适用于“x y z rgb”16 bytes
	
	var positions = new Float32Array(numPoints*3);
	var colors = new Float32Array(numPoints*3);
	var color = new THREE.Color();
	var body = new DataView(buffer,headerlength);
	//var fView = new Float32Array(buffer);
	//var uiView = new Uint8Array(buffer);
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
        loc += result[ 1 ];
        var element = result[ 0 ];
        positions[3*i] = element.x;
        positions[3*i+1] = element.y;
        positions[3*i+2] = element.z;
        var a = "#";
        color.setStyle(a += element.rgb.toString(16));
        colors[3*i] = color.r;
        colors[3*i+1] = color.g;
        colors[3*i+2] = color.b;
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
    }

    function binaryReadElement ( dataview, at, little_endian ) {

        var element = {
            x:undefined,
            y:undefined,
            z:undefined,
            rgb:undefined
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

        result = binaryRead( dataview, at + read, "U", "4", little_endian );
        element.rgb = result[ 0 ];
        read += result[ 1 ];

        return [ element, read ];

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

    }
}

PCDviewr.PointCloudOctreeGeometryNode.prototype.dispose = function(){
	delete this.geometry;
	this.loaded = false;
	
	//console.log("dispose: " + this.name);
}