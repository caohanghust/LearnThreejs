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
        this.trackballControls.rotateSpeed = 3;
        this.trackballControls.zoomSpeed = 1;
        this.trackballControls.panSpeed = 2;
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
        let geometry = new THREE.SphereGeometry(25, 20, 20);
        let material = new THREE.MeshNormalMaterial({
            color: 0x999999,
            wireframe: true,
            wireframeLinewidth: 1
        });
        let ball = new THREE.Mesh(geometry, material);
        this.scene.add(ball);
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

        // this.cube.position.x += .1;
        // this.cube.position.y += .1;
        // this.cube.position.z += .1;
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(this.animation.bind(this));
    }
};
demo.init();
