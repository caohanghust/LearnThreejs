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
        this.initTween();
        this.animation();
    },
    initThree() {
        width = document.getElementById('canvas-frame').clientWidth;
        height = document.getElementById('canvas-frame').clientHeight;
        this.renderer = new THREE.WebGLRenderer({
            antialias : true
        });
        this.renderer.setSize(width, height);
        document.getElementById('canvas-frame').appendChild(this.renderer.domElement);
        this.renderer.setClearColor(0xFFFFFF, 1.0);
    },
    initCamera() {
        this.camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);
        this.camera.position.x = 0;
        this.camera.position.y = 0;
        this.camera.position.z = 600;
        this.camera.up.x = 0;
        this.camera.up.y = 1;
        this.camera.up.z = 0;
        this.camera.lookAt(this.scene.position);
    },
    initScene() {
        this.scene = new THREE.Scene();
    },
    initLight() {
        this.light = new THREE.AmbientLight(0xFF0000);
        this.light.position.set(100, 100, 200);
        this.scene.add(this.light);
        this.light = new THREE.PointLight(0x00FF00);
        this.light.position.set(0, 0, 300);
        this.scene.add(this.light);
    },
    initObject() {
        var geometry = new THREE.CylinderGeometry( 100,150,400);
        var material = new THREE.MeshLambertMaterial( { color:0x00FF00} );
        this.mesh = new THREE.Mesh( geometry,material);
        this.mesh.position = new THREE.Vector3(0,0,0);
        this.scene.add(this.mesh);
    },
    initTween() {
        new TWEEN.Tween( this.mesh.position)
            .to( { x: -400 }, 3000 ).repeat( Infinity ).start();
    },
    animation() {
        //renderer.clear();
        // this.render.clear();
        // this.camera.position.x = this.camera.position.x +1;
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(this.animation.bind(this));
        TWEEN.update();
    }
};
demo.init();
