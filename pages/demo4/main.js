/**
 * @file   绘制网格
 * @author caohang (caohanghust@gmail.com)
 * @date   2018/3/29
 */

let demo = {
    init() {
        this.initThree();
        this.initCamera();
        this.initScene();
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
        this.camera.lookAt({
            x : 0,
            y : 0,
            z : 0
        });
    },
    initScene() {
        this.scene = new THREE.Scene();
    },
    initLight() {
        // let light = new THREE.AmbientLight(0x00FF00);
        // light.position.set(100, 100, 200);
        // this.scene.add(light);
        //
        // // 第二个参数是光源强度，你可以改变它试一下
        // let light2 = new THREE.DirectionalLight(0xff0000,1);
        // // 位置不同，方向光作用于物体的面也不同，看到的物体各个面的颜色也不一样
        // light2.position.set(0,0,1);
        // this.scene.add(light2);
        //
        // let light3 = new THREE.PointLight(0x0000FF);
        // light3.position.set(0, 0, 500);
        // this.scene.add(light3);
    },
    initObject() {
        var geometry = new THREE.CubeGeometry( 200, 100, 50,4,4);
        let texture = THREE.ImageUtils.loadTexture("texture.jpg",null,function(t) {});
        var material = new THREE.MeshBasicMaterial({map:texture});
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
