

/**
 * @class Loads mno files and returns a PointcloudOctree
 * for a description of the mno binary file format, read mnoFileFormat.txt
 * 
 * @author Markus Schuetz
 */
function POCLoader(){
	
}
 
/**
 * @return a point cloud octree with the root node data loaded. 
 * loading of descendants happens asynchronously when they're needed
 * 
 * @param url
 * @param loadingFinishedListener executed after loading the binary has been finished
 */
POCLoader.load = function load(url) {
		var pco = new PCDviewr.PointCloudOctreeGeometry();
        pco.url = url;
<<<<<<< HEAD
		var pco_url = url + "/proj.qtx";
=======
		var pco_url = url + "/tree.octree";
>>>>>>> 77d73c8122e8a087b9dece73654d63d80a45cb2e
        try{
            //load pointcloud octree metadata
            var pco_xhr = new XMLHttpRequest();
            pco_xhr.open('GET', pco_url, false);
            pco_xhr.send(null);
            if(pco_xhr.status === 200 || pco_xhr.status === 0){
                var fMno = JSON.parse(pco_xhr.responseText);
<<<<<<< HEAD
                pco.cache_folder = fMno.cache_folder;
                //pco.depth =fMno.depth;
                //pco.has_pano =fMno.has_pano;
                //pco.has_traj =fMno.has_traj;
                pco.maxIntensity =fMno.maxIntensity;
                pco.minIntensity =fMno.minIntensity;
                //pco.maxdepth =fMno.maxdepth;
                pco.maxx =fMno.maxx;
                pco.maxy =fMno.maxy;
                pco.maxz =fMno.maxz;
                pco.minx =fMno.minx;
                pco.miny =fMno.miny;
                pco.minz =fMno.minz;
                var center = new THREE.Vector3((pco.minx + pco.maxx)/2,(pco.miny + pco.maxy)/2,(pco.minz + pco.maxz)/2);
                pco.maxx -= center.x;
                pco.maxy  -= center.y;
                pco.maxz -= center.z;
                pco.minx -= center.x;
                pco.miny  -= center.y;
                pco.minz  -= center.z;

                pco.pointFormat =fMno.pointFormat;
                //pco.statisticalMaxz =fMno.statisticalMaxz;
                //pco.statisticalMinz =fMno.statisticalMinz;
                //pco.wholePointNum =fMno.wholePointNum;
                pco.lod = fMno.maxdepth;
                pco.numpts = fMno.wholePointNum;
=======
                pco.name = fMno.name;
                pco.version = fMno.version;
                pco.pointtype = fMno.pointtype;
                pco.lod = fMno.lod;
                pco.numpts = fMno.numpts;
                pco.coord_system = fMno.coord_system;
>>>>>>> 77d73c8122e8a087b9dece73654d63d80a45cb2e
            }
        }catch(e){
            console.log("loading failed: '" + pco_url + "'");
            console.log(e);
        }
        //load octree nodes
        var nodes = {};

        {//load root
<<<<<<< HEAD
            var name = "0";
            var min = new THREE.Vector3(pco.minx, pco.miny, pco.minz);
            var max = new THREE.Vector3(pco.maxx, pco.maxy, pco.maxz);
            var boundingBox = new THREE.Box3(min,max);
            pco.boundingBox = boundingBox;

            var root = new PCDviewr.PointCloudOctreeGeometryNode(name, pco, boundingBox);
            root.name = name;
            root.level = 0;
            root.numPoints = 0;
            pco.root = root;
            root.numPoints = pco.root.load(url + "/" + pco.cache_folder);
            pco.boundingBox = pco.root.boundingBox; //!!!!!!
            nodes[name] = root;
        }
        //load remaining nodes
        /*nodes = */POCLoader.loadremainingnodes(nodes,url + "/" + pco.cache_folder,pco);
        //pco.nodes = nodes;
		return pco;
};

POCLoader.loadremainingnodes = function(node,url,pco){
    var qtxb_url = url + "/-1.qtxb";
    var FileList = [];
    try{
        var qtxb_xhr = new XMLHttpRequest();
        qtxb_xhr.open('GET', qtxb_url, false);
        qtxb_xhr.send(null);
        if(qtxb_xhr.status === 200 || qtxb_xhr.status === 0){
            var data = qtxb_xhr.responseText;
            var pattern = /\d+(?=\.lasdb)/g;
            //var result = pattern.exec( data);
            var result =data.match(pattern);
            var qtxb_Text = "";
            if ( result !== null ) {
                FileList = result;
            }
            for(var i = 1;i < FileList.length;i++){
                var name = FileList[i];
                //if(PCDviewr.utils.pathExists(url + "/" + name + ".lasdb")){
                    var index =  parseInt(name.charAt(name.length-1));
                    var parentName = name.substring(0,name.length-1);
                    var parentNode = node[parentName];
                    var boundingbox = POCLoader.createChildBoundingBox(parentNode.boundingBox,index);

                    var childNode = new PCDviewr.PointCloudOctreeGeometryNode(name, pco, boundingbox);
                    childNode.name  = name;
                    childNode.level = name.length - 1;
                    childNode.numPoints = 0;
                    parentNode.addChild(childNode);
                    node[name] = childNode;
                //}
            }
        }
        //return node;
    }
    catch(e){
        console.log("Failed to load:'" + qtxb_url + "'");
        //return ;
    }
    /*if(depth !== 0){
=======
            var name = "r";
            var xhr = new XMLHttpRequest();
            var root_url = url + "/tree.oct_idx";
            xhr.open('GET', root_url, false);
            xhr.send(null);
            if(xhr.status === 200 || xhr.status === 0){
                var fMno = JSON.parse(xhr.responseText);
                var min = new THREE.Vector3(fMno.bb_min[0], fMno.bb_min[1], fMno.bb_min[2]);
                var max = new THREE.Vector3(fMno.bb_max[0], fMno.bb_max[1], fMno.bb_max[2]);
                var boundingBox = new THREE.Box3(min,max);
                pco.boundingBox = boundingBox;

                var root = new PCDviewr.PointCloudOctreeGeometryNode(name, pco, boundingBox);
                root.dir = "";
                root.bin = fMno.bin;
                root.name = name;
                root.level = 0;
                root.numPoints = pco.numpts[0];
                pco.root = root;
                var nump = pco.root.load(url);
                nodes[name] = root;
            }
            else{
                console.log("loading tree.oct_idx failed...");
            }
        }
        //load remaining nodes
        POCLoader.loadremainingnodes(nodes["r"],url,pco,pco.lod);

        /*
		var xhr = new XMLHttpRequest();
		xhr.open('GET', pco.url, false);
		xhr.send(null);
		if(xhr.status === 200 || xhr.status === 0){
			var fMno = JSON.parse(xhr.responseText);

			var nodes = {};
			{ // load root
				var name = "0";
				var min = new THREE.Vector3(fMno.boundingBox.lx, fMno.boundingBox.ly, fMno.boundingBox.lz);
				var max = new THREE.Vector3(fMno.boundingBox.ux, fMno.boundingBox.uy, fMno.boundingBox.uz);
				var boundingBox = new THREE.Box3(min, max);
				pco.boundingBox = boundingBox;
				
				var root = new PCDviewr.PointCloudOctreeGeometryNode(name, pco, boundingBox);
				root.level = 0;
				root.numPoints = fMno.hierarchy[0][1];
				pco.root = root;
				pco.root.load();
				nodes[name] = root;
			}
			
			// load remaining hierarchy
			for( var i = 1; i < fMno.hierarchy.length; i++){
				var name = fMno.hierarchy[i][0];
				var numPoints = fMno.hierarchy[i][1];
				var index = parseInt(name.charAt(name.length-1));
				var parentName = name.substring(0, name.length-1);
				var parentNode = nodes[parentName];
				var points = fMno.hierarchy[i][1];
				var level = name.length-1;
				var boundingBox = POCLoader.createChildAABB(parentNode.boundingBox, index);
				
				var node = new PCDviewr.PointCloudOctreeGeometryNode(name, pco, boundingBox);
				node.level = level;
				node.numPoints = numPoints;
				parentNode.addChild(node);
				nodes[name] = node;
			}
			
			pco.nodes = nodes;
			
		}   */
        pco.nodes = nodes;
		return pco;

};

POCLoader.xhroctreeindex = function(name,dir,level,pco,url){
    var xhr = new XMLHttpRequest();
    var node_url = url + "/tree (1).oct_idx";
    xhr.open('GET', node_url, false);
    xhr.send(null);
    if(xhr.status === 200 || xhr.status === 0){
        var fMno = JSON.parse(xhr.responseText);
        var min = new THREE.Vector3(fMno.bb_min[0], fMno.bb_min[1], fMno.bb_min[2]);
        var max = new THREE.Vector3(fMno.bb_max[0], fMno.bb_max[1], fMno.bb_max[2]);
        var boundingBox = new THREE.Box3(min,max);

        var node = new PCDviewr.PointCloudOctreeGeometryNode(name, pco, boundingBox);
        node.name = name;
        node.dir = dir;
        node.bin = fMno.bin;
        node.level = level;
        node.numPoints = undefined;   //can't obtain points number now!!
        return node;
    }
    else{
        return 0;
        console.log("loading failed:" + node_url);
    }
};

POCLoader.loadremainingnodes = function(node,url,pco,depth){
    if(depth !== 0){
>>>>>>> 77d73c8122e8a087b9dece73654d63d80a45cb2e
        if(PCDviewr.utils.pathExists(url + "/0")){
            var name,dir,level;
            name = node.name + "0";
            dir = node.dir + "/0";
            level = pco.lod - depth + 1;
            var childnode = POCLoader.xhroctreeindex(name,dir,level,pco,url + "/0");
            if(childnode !== 0){
                node.addChild(childnode);
                POCLoader.loadremainingnodes(childnode,url + "/0",pco,depth-1);
            }
        }
        if(PCDviewr.utils.pathExists(url + "/1")){
            var name,dir,level;
            name = node.name + "1";
            dir = node.dir + "/1";
            level = pco.lod - depth + 1;
            var childnode = POCLoader.xhroctreeindex(name,dir,level,pco,url + "/1");
            if(childnode !== 0){
                node.addChild(childnode);
                POCLoader.loadremainingnodes(childnode,url + "/1",pco,depth-1);
            }
        }
        if(PCDviewr.utils.pathExists(url + "/2")){
            var name,dir,level;
            name = node.name + "2";
            dir = node.dir + "/2";
            level = pco.lod - depth + 1;
            var childnode = POCLoader.xhroctreeindex(name,dir,level,pco,url + "/2");
            if(childnode !== 0){
                node.addChild(childnode);
                POCLoader.loadremainingnodes(childnode,url + "/2",pco,depth-1);
            }
        }
        if(PCDviewr.utils.pathExists(url + "/3")){
            var name,dir,level;
            name = node.name + "3";
            dir = node.dir + "/3";
            level = pco.lod - depth + 1;
            var childnode = POCLoader.xhroctreeindex(name,dir,level,pco,url + "/3");
            if(childnode !== 0){
                node.addChild(childnode);
                POCLoader.loadremainingnodes(childnode,url + "/3",pco,depth-1);
            }
        }
        if(PCDviewr.utils.pathExists(url + "/4")){
            var name,dir,level;
            name = node.name + "4";
            dir = node.dir + "/4";
            level = pco.lod - depth + 1;
            var childnode = POCLoader.xhroctreeindex(name,dir,level,pco,url + "/4");
            if(childnode !== 0){
                node.addChild(childnode);
                POCLoader.loadremainingnodes(childnode,url + "/4",pco,depth-1);
            }
        }
        if(PCDviewr.utils.pathExists(url + "/5")){
            var name,dir,level;
            name = node.name + "5";
            dir = node.dir + "/5";
            level = pco.lod - depth + 1;
            var childnode = POCLoader.xhroctreeindex(name,dir,level,pco,url + "/5");
            if(childnode !== 0){
                node.addChild(childnode);
                POCLoader.loadremainingnodes(childnode,url + "/5",pco,depth-1);
            }
        }
        if(PCDviewr.utils.pathExists(url + "/6")){
            var name,dir,level;
            name = node.name + "6";
            dir = node.dir + "/6";
            level = pco.lod - depth + 1;
            var childnode = POCLoader.xhroctreeindex(name,dir,level,pco,url + "/6");
            if(childnode !== 0){
                node.addChild(childnode);
                POCLoader.loadremainingnodes(childnode,url + "/6",pco,depth-1);
            }
        }
        if(PCDviewr.utils.pathExists(url + "/7")){
            var name,dir,level;
            name = node.name + "7";
            dir = node.dir + "/7";
            level = pco.lod - depth + 1;
            var childnode = POCLoader.xhroctreeindex(name,dir,level,pco,url + "/7");
            if(childnode !== 0){
                node.addChild(childnode);
                POCLoader.loadremainingnodes(childnode,url + "/7",pco,depth-1);
            }
        }
<<<<<<< HEAD
    }*/
};

POCLoader.loadPointAttributes = function(mno){

	var fpa = mno.pointAttributes;
	var pa = new PointAttributes();

	for(var i = 0; i < fpa.length; i++){
		var pointAttribute = PointAttribute[fpa[i]];
		pa.add(pointAttribute);
	}

	return pa;
};

POCLoader.createChildBoundingBox = function(boundingbox,index){
    var min,max;
    var center = new THREE.Vector3((boundingbox.min.x + boundingbox.max.x)/2,(boundingbox.min.y + boundingbox.max.y)/2,(boundingbox.min.z + boundingbox.max.z)/2);
    if(index == 0){
        min = new THREE.Vector3(boundingbox.min.x, boundingbox.min.y, boundingbox.min.z);
        max = new THREE.Vector3(center.x, center.y, center.z);
      }
    else if(index == 1){
        min = new THREE.Vector3(center.x, boundingbox.min.y, boundingbox.min.z);
        max = new THREE.Vector3(boundingbox.max.x, center.y, center.z);
    }
    else if(index == 2){
        min = new THREE.Vector3(center.x, center.y, boundingbox.min.z);
        max = new THREE.Vector3(boundingbox.max.x, boundingbox.max.y, center.z);
    }
    else if(index == 3){
        min = new THREE.Vector3(boundingbox.min.x, center.y, boundingbox.min.z);
        max = new THREE.Vector3(center.x, boundingbox.max.y, center.z);
    }
    else if(index == 4){
        min = new THREE.Vector3(boundingbox.min.x, boundingbox.min.y, center.z);
        max = new THREE.Vector3(center.x, center.y, boundingbox.max.z);
    }
    else if(index == 5){
        min = new THREE.Vector3(center.x, boundingbox.min.y, center.z);
        max = new THREE.Vector3(boundingbox.max.x, center.y, boundingbox.max.z);
    }
    else if(index == 6){
        min = new THREE.Vector3(center.x, center.y, center.z);
        max = new THREE.Vector3(boundingbox.max.x, boundingbox.max.y, boundingbox.max.z);
    }
    else if(index == 7){
        min = new THREE.Vector3(boundingbox.min.x, center.y, center.z);
        max = new THREE.Vector3(center.x, boundingbox.max.y, boundingbox.max.z);
    }
    return new THREE.Box3(min,max);
};
=======
    }
};

POCLoader.loadPointAttributes = function(mno){
	
	var fpa = mno.pointAttributes;
	var pa = new PointAttributes();
	
	for(var i = 0; i < fpa.length; i++){   
		var pointAttribute = PointAttribute[fpa[i]];
		pa.add(pointAttribute);
	}                                                                     
	
	return pa;
};


>>>>>>> 77d73c8122e8a087b9dece73654d63d80a45cb2e
