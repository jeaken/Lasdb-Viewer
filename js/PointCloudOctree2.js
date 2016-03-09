

/**
 * Stands in place for invisible or unloaded octree nodes.
 * If a proxy node becomes visible and its geometry has not been loaded,
 * loading will begin.
 * If it is visible and the geometry has been loaded, the proxy node will 
 * be replaced with a point cloud node (THREE.PointCloud as of now)
 */
PCDviewr.PointCloudOctreeProxyNode = function(geometryNode){
	THREE.Object3D.call( this );
	
	this.geometryNode = geometryNode;
	this.boundingBox = geometryNode.boundingBox;
	this.name = geometryNode.name;
	this.level = geometryNode.level;
	this.numPoints = geometryNode.numPoints;
}

PCDviewr.PointCloudOctreeProxyNode.prototype = Object.create(THREE.Object3D.prototype);








PCDviewr.PointCloudOctree = function(geometry, material){
	THREE.Object3D.call( this );

    PCDviewr.PointCloudOctree.lru = PCDviewr.PointCloudOctree.lru || new LRU();
	
	this.pcoGeometry = geometry;
	this.boundingBox = this.pcoGeometry.boundingBox;
	this.material = material;
	this.maxVisibleNodes = 2000;
	this.maxVisiblePoints = 20*1000*1000;
	this.level = 0;
	
	this.LODDistance = 20;
	this.LODFalloff = 1.3;
	this.LOD = 4;
	
	
	var rootProxy = new PCDviewr.PointCloudOctreeProxyNode(this.pcoGeometry.root);
	this.add(rootProxy);  //this -> THREE.Object3D
}

PCDviewr.PointCloudOctree.prototype = Object.create(THREE.Object3D.prototype);

PCDviewr.PointCloudOctree.prototype.update = function(camera){
	this.numVisibleNodes = 0;
	this.numVisiblePoints = 0;
	var frustum = new THREE.Frustum();
	frustum.setFromMatrix( new THREE.Matrix4().multiplyMatrices( camera.projectionMatrix, camera.matrixWorldInverse ) );
	
	// check visibility
	var stack = [];
	stack.push(this);
	while(stack.length > 0){
		var object = stack.shift();
		
		var boxWorld = PCDviewr.utils.computeTransformedBoundingBox(object.boundingBox, object.matrixWorld);
		var camWorldPos = new THREE.Vector3().setFromMatrixPosition( camera.matrixWorld );
		var distance = boxWorld.center().distanceTo(camWorldPos);
		var radius = boxWorld.size().length() * 0.5;
		//var ratio = distance/(1100/this.LOD);
		var visible = true; 
		visible = visible && frustum.intersectsBox(boxWorld);
		if(object.level >= 1){
            //visible = visible && (ratio>=(this.LOD - object.level) && ratio<(this.LOD + 1 - object.level));
            visible = visible && radius / distance > (/*1.17*/1 / this.LOD);
			//visible = visible && (this.numVisiblePoints + object.numPoints < PCDviewr.pointLoadLimit);
            visible = visible && (this.numVisiblePoints < 1000000);
			visible = visible && (this.numVisibleNodes <= this.maxVisibleNodes);
			//visible = visible && (this.numVisiblePoints <= this.maxVisiblePoints);
		}else{
			visible = true;
		}
		
		
		
		
		object.visible = visible;
		
		if(!visible){
			this.hideDescendants(object);
			continue;
		}
		
		if(object instanceof THREE.Points){    //THREE.PointCloud -> THREE.Points
			this.numVisibleNodes++;
			//this.numVisiblePoints += object.numPoints;
            PCDviewr.PointCloudOctree.lru.touch(object);
		}else if (object instanceof PCDviewr.PointCloudOctreeProxyNode) {
			this.replaceProxy(object);
		}
		
		for(var i = 0; i < object.children.length; i++){
			stack.push(object.children[i]);
		}
	}
}


PCDviewr.PointCloudOctree.prototype.replaceProxy = function(proxy){
	
	var geometryNode = proxy.geometryNode;
	if(geometryNode.loaded == true){
		var geometry = geometryNode.geometry;
		var node = new THREE.Points(geometry, this.material);  //THREE.PointCloud -> THREE.Points
		node.name = proxy.name;
		node.level = proxy.level;
		node.numPoints = proxy.numPoints;
		node.boundingBox = geometry.boundingBox;
		node.pcoGeometry = geometryNode;
		var parent = proxy.parent;
		parent.remove(proxy);
		parent.add(node);
        this.numVisiblePoints += node.numPoints  //
		for(var i = 0; i < 8; i++){      // 8 -> geometryNode.children.length
			if(geometryNode.children[i] !== undefined){
				var child = geometryNode.children[i];
				var childProxy = new PCDviewr.PointCloudOctreeProxyNode(child);
				node.add(childProxy);
			}
		}
	}else{
        this.numVisiblePoints += geometryNode.load(this.pcoGeometry.url);  //
	}
}

PCDviewr.PointCloudOctree.prototype.hideDescendants = function(object){
	var stack = [];
	for(var i = 0; i < object.children.length; i++){
		var child = object.children[i];
		if(child.visible){
			stack.push(child);
		}
	}
	
	while(stack.length > 0){
		var object = stack.shift();
        if(object.loaded)  this.numVisiblePoints -= object.numPoints;//
		object.visible = false;

		for(var i = 0; i < object.children.length; i++){
			var child = object.children[i];
			if(child.visible){
				stack.push(child);
			}
		}
	}
}

PCDviewr.PointCloudOctree.prototype.moveToOrigin = function(){
    this.position.set(0,0,0);
    this.updateMatrixWorld();
    var box = this.boundingBox;
    var transform = this.matrixWorld;
    var tBox = PCDviewr.utils.computeTransformedBoundingBox(box, transform);
    this.position.set(0,0,0).sub(tBox.center());
}

PCDviewr.PointCloudOctree.prototype.moveToGroundPlane = function(){
    this.updateMatrixWorld();
    var box = this.boundingBox;
    var transform = this.matrixWorld;
    var tBox = PCDviewr.utils.computeTransformedBoundingBox(box, transform);
    this.position.y += -tBox.min.y;
}


/**
 *
 * amount: minimum number of points to remove
 */
PCDviewr.PointCloudOctree.disposeLeastRecentlyUsed = function(amount){
	
	
	var freed = 0;
	do{
		var node = this.lru.first.node;
		var parent = node.parent;
		var geometry = node.geometry;
		var pcoGeometry = node.pcoGeometry;
		var proxy = new PCDviewr.PointCloudOctreeProxyNode(pcoGeometry);
	
		var result = PCDviewr.PointCloudOctree.disposeNode(node);
		freed += result.freed;
		
		parent.add(proxy);
		
		if(result.numDeletedNodes == 0){
			break;
		}
	}while(freed < amount);
}

PCDviewr.PointCloudOctree.disposeNode = function(node){
	
	var freed = 0;
	var numDeletedNodes = 0;
	var descendants = [];
	
	node.traverse(function(object){
		descendants.push(object);
	});
	
	for(var i = 0; i < descendants.length; i++){
		var descendant = descendants[i];
		if(descendant instanceof THREE.Points){    //THREE.PointCloud -> THREE.Points
			freed += descendant.pcoGeometry.numPoints;
			descendant.pcoGeometry.dispose();
			descendant.geometry.dispose();
            PCDviewr.PointCloudOctree.lru.remove(descendant);
			numDeletedNodes++;
		}
	}

    PCDviewr.PointCloudOctree.lru.remove(node);
	node.parent.remove(node);
	
	return {
		"freed": freed,
		"numDeletedNodes": numDeletedNodes
	};
}