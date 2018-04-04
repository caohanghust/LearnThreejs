/**
 * @file   自定义立方体
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
        this.renderer.shadowMapEnabled = true;
        this.clock = new THREE.Clock();
    },
    initCamera() {
        this.camera = new THREE.PerspectiveCamera(60, width / height, .1, 1000);
        this.camera.position.x = -30;
        this.camera.position.y = 40;
        this.camera.position.z = 30;
        this.camera.lookAt(this.scene.position);

        this.trackballControls = new THREE.TrackballControls(this.camera);
        this.trackballControls.rotateSpeed = 1;
        this.trackballControls.zoomSpeed = 1;
        this.trackballControls.panSpeed = 1;
    },
    initScene() {
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.Fog(0xffffff, .015, 100);
    },
    initLight() {
        let spotLight = new THREE.SpotLight(0xffffff);
        spotLight.position.set(-60, 60, 60);
        spotLight.castShadow = true;
        this.scene.add(spotLight);
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
        // let planeGeometry = new THREE.PlaneGeometry(60, 40, 1, 1);
        // let planeMaterial = new THREE.MeshLambertMaterial({color: 0xffffff});
        // let plane = new THREE.Mesh(planeGeometry, planeMaterial);
        // plane.rotation.x = -.5 * Math.PI;
        // plane.position.x = 0;
        // plane.position.y = 0;
        // plane.position.z = 0;
        // plane.receiveShadow = true;
        // this.scene.add(plane);

        let pos = {
            x: 10,
            y: 10,
            z: 10
        };
        this.addCube(pos, 10);
    },
    addCube(pos, d) {
        let x = pos.x;
        let y = pos.y;
        let z = pos.z;
        let vertices = [
            [x - d / 2, y - d / 2, z - d / 2],
            [x + d / 2, y - d / 2, z - d / 2],

            [x - d / 2, y + d / 2, z - d / 2],
            [x + d / 2, y + d / 2, z - d / 2],

            [x - d / 2, y - d / 2, z + d / 2],
            [x + d / 2, y - d / 2, z + d / 2],

            [x - d / 2, y + d / 2, z + d / 2],
            [x + d / 2, y + d / 2, z + d / 2],
        ].map(item => {
            return new THREE.Vector3(item[0], item[1], item[2]);
        });
        let faces = [
            [0, 2, 1],
            [1, 2, 3],
            [1, 7, 5],
            [1, 3, 7],
            [0, 5, 4],
            [0, 1, 5],
            [0, 4, 6],
            [0, 6, 2],
            [2, 7, 3],
            [2, 6, 7],
            [4, 5, 7],
            [4, 7, 6]

        ].map(item => {
            return new THREE.Face3(item[0], item[1], item[2]);
        });

        let geom = new THREE.Geometry();
        geom.vertices = vertices;
        geom.faces = faces;
        geom.computeFaceNormals();
        let material = new THREE.MeshBasicMaterial({color: 0xff0000});
        let cube = new THREE.Mesh(geom, material);
        this.scene.add(cube);
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
        let delta = this.clock.getDelta();
        this.trackballControls.update(delta);
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(this.animation.bind(this));
    }
};
demo.init();
