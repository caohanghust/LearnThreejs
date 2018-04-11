/**
 * @file   立方体
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
        this.camera = new THREE.PerspectiveCamera(60, width / height, .1, 1000);
        this.camera.position.x = -30;
        this.camera.position.y = 40;
        this.camera.position.z = 30;
        this.camera.lookAt(this.scene.position);
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
        // 坐标轴
        let axes = new THREE.AxisHelper(20);
        this.scene.add(axes);
        // 平面
        // let planeGeometry = new THREE.PlaneGeometry(60, 20, 1, 1);
        // let planeMaterial = new THREE.MeshBasicMaterial({color: 0xcccccc});
        // let plane = new THREE.Mesh(planeGeometry, planeMaterial);
        // plane.rotation.x = -.5 * Math.PI;
        // plane.position.x = 0;
        // plane.position.y = 0;
        // plane.position.z = 0;
        // this.scene.add(plane);

        let pos = {
            x: 5,
            y: 5,
            z: 5
        };
        this.addCube(pos, 10);
    },
    addCube(pos, long) {
        let planeGeometry = new THREE.PlaneGeometry(long, long);
        let colors = [0x00ffff, 0xffff00, 0xff0000, 0x000000, 0x00ff00, 0x0000ff];
        let materials = colors.map(item => {
            return new THREE.MeshBasicMaterial({color: item});
        });
        let bottom = new THREE.Mesh(planeGeometry, materials[0]);
        bottom.position.x = pos.x;
        bottom.position.y = pos.y;
        bottom.position.z = pos.z - long / 2;
        bottom.rotation.y = Math.PI;

        let top = new THREE.Mesh(planeGeometry, materials[1]);
        top.position.x = pos.x;
        top.position.y = pos.y;
        top.position.z = pos.z + long / 2;

        let left = new THREE.Mesh(planeGeometry, materials[2]);
        left.position.x = pos.x - long / 2;
        left.position.y = pos.y;
        left.position.z = pos.z;
        left.rotation.y = -.5 * Math.PI;

        let right = new THREE.Mesh(planeGeometry, materials[3]);
        right.position.x = pos.x + long / 2;
        right.position.y = pos.y;
        right.position.z = pos.z;
        right.rotation.y = .5 * Math.PI;

        let front = new THREE.Mesh(planeGeometry, materials[4]);
        front.position.x = pos.x;
        front.position.y = pos.y + long / 2;
        front.position.z = pos.z;
        front.rotation.x = -.5 * Math.PI;

        let behind = new THREE.Mesh(planeGeometry, materials[4]);
        behind.position.x = pos.x;
        behind.position.y = pos.y - long / 2;
        behind.position.z = pos.z;
        behind.rotation.x = .5 * Math.PI;

        this.scene.add(top);
        this.scene.add(bottom);
        this.scene.add(left);
        this.scene.add(right);
        this.scene.add(front);
        this.scene.add(behind);
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
        // this.camera.position.x = this.camera.position.x + .2;
        // this.camera.position.y = this.camera.position.y + .05;
        // this.camera.position.z = this.camera.position.z + .03;
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(this.animation.bind(this));
        TWEEN.update();
    }
};
demo.init();
