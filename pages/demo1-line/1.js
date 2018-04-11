/**
 * @file   绘制网格
 * @author caohang (caohanghust@gmail.com)
 * @date   2018/3/29
 */

let demo = {
    init() {
        this.initThree();
        this.initScene();
        this.initCamera();
        this.initLight();
        this.initObject();
        this.render.clear();
        this.render.render(this.scene, this.camera);
    },
    initThree() {
        width = document.getElementById('canvas-frame').clientWidth;
        height = document.getElementById('canvas-frame').clientHeight;
        this.render = new THREE.WebGLRenderer({
            antialias : true
        });
        this.render.setSize(width, height);
        document.getElementById('canvas-frame').appendChild(this.render.domElement);
        this.render.setClearColor(0xFFFFFF, 1.0);
    },
    initCamera() {
        this.camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);
        this.camera.position.x = 0;
        this.camera.position.y = 0;
        this.camera.position.z = 1000;
        this.camera.up.x = 0;
        this.camera.up.y = 0;
        this.camera.up.z = 0;
        this.camera.lookAt(this.scene.position);
    },
    initScene() {
        this.scene = new THREE.Scene();
    },
    initLight() {
        this.light = new THREE.DirectionalLight(0xFF0000, 1.0, 0);
        this.light.position.set(100, 100, 200);
        this.scene.add(this.light);
    },
    initObject() {
        var geometry = new THREE.Geometry();
        geometry.vertices.push( new THREE.Vector3( -500, 0, 0 ) );
        geometry.vertices.push( new THREE.Vector3( 500, 0, 0 ) );

        for ( var i = 0; i <= 20; i ++ ) {

            var line = new THREE.Line( geometry, new THREE.LineBasicMaterial( { color: 0x000000, opacity: 0.2 } ) );
            line.position.y = ( i * 50 ) - 500;
            this.scene.add( line );

            var line = new THREE.Line( geometry, new THREE.LineBasicMaterial( { color: 0x000000, opacity: 0.2 } ) );
            line.position.x = ( i * 50 ) - 500;
            line.rotation.z = 90 * Math.PI / 180;
            this.scene.add( line );
        }
    }
};
demo.init();
