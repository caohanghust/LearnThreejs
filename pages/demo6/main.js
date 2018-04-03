/**
 * @file   绘制三维坐标系
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
        this.camera = new THREE.PerspectiveCamera(90, width / height, 1, 10000);
        this.camera.position.x = -500;
        this.camera.position.y = -500;
        this.camera.position.z = -500;
        // this.camera.up.x = 0;
        // this.camera.up.y = 1;
        // this.camera.up.z = 0;
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
    },
    initObject() {
        let black = 0x000000;
        let red = 0xff0000;
        let green = 0x00ff00;
        let blue = 0x0000ff;
        this.addLine({x: 0, y: 0, z: 0}, {x: 1000, y: 0, z: 0}, {color: black, opacity: 0.2});
        this.addLine({x: 0, y: 0, z: 0}, {x: 0, y: 1000, z: 0}, {color: black, opacity: 0.2});
        this.addLine({x: 0, y: 0, z: 0}, {x: 0, y: 0, z: 1000}, {color: black, opacity: 0.2});
        for (let i = 1, x = 0, y = 0, z = 0; i < 20; i++) {
            this.addLine({x: 0, y: i * 50, z: 0}, {x: 1000, y: i * 50, z: 0}, {color: red, opacity: 0.2});
            this.addLine({x: 0, y: i * 50, z: 0}, {x: 0, y: i * 50, z: 1000}, {color: green, opacity: 0.2});
            this.addLine({x: i * 50, y: 0, z: 0}, {x: i * 50, y: 0, z: 1000}, {color: blue, opacity: 0.2});
        }
    },
    addLine(start, end, config) {
        let geometry = new THREE.Geometry();
        geometry.vertices.push(new THREE.Vector3(start.x, start.y, start.z));
        geometry.vertices.push(new THREE.Vector3(end.x, end.y, end.z));
        let line = new THREE.Line(geometry, new THREE.LineBasicMaterial(config));
        this.scene.add(line);
    },
    initTween() {

    },
    animation() {
        //renderer.clear();
        // this.render.clear();
        this.camera.position.x = this.camera.position.x + .2;
        this.camera.position.y = this.camera.position.y + .5;
        this.camera.position.z = this.camera.position.z + 1;
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(this.animation.bind(this));
        TWEEN.update();
    }
};
demo.init();
