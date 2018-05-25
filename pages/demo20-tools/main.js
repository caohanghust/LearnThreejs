/**
 * @file   魔方完整版
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
        this.initRaycaster();
        this.animation();
    },
    initThree() {
        this.width = document.getElementById('canvas-frame').clientWidth;
        this.height = document.getElementById('canvas-frame').clientHeight;
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });
        this.renderer.setSize(this.width, this.height);
        document.getElementById('canvas-frame').appendChild(this.renderer.domElement);
        this.renderer.setClearColor(0x000000, .5);
        this.renderer.shadowMapEnabled = true;
        this.clock = new THREE.Clock();
    },
    initCamera() {
        this.camera = new THREE.PerspectiveCamera(60, this.width / this.height, .1, 1000);
        this.camera.position.x = -300;
        this.camera.position.y = 400;
        this.camera.position.z = 300;
        this.camera.lookAt(this.scene.position);

        this.trackballControls = new THREE.TrackballControls(this.camera);
        this.trackballControls.rotateSpeed = 3;
        this.trackballControls.zoomSpeed = 1;
        this.trackballControls.panSpeed = 2;
    },
    initScene() {
        this.scene = new THREE.Scene();
        // this.scene.fog = new THREE.Fog(0xffffff, .015, 100);
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
        let axes = new THREE.AxisHelper(2000);
        this.scene.add(axes);

        const boxGeom = new THREE.BoxGeometry(100, 100, 100)
        const boxMatrial = new THREE.MeshBasicMaterial({
          color: 0xff0000,
          transparent: true,
          opacity: .5
        })
        const box = new THREE.Mesh(boxGeom, boxMatrial)
        const vertexNormalsHelper = new THREE.VertexNormalsHelper( box, 10 );
        box.add(vertexNormalsHelper)
        let faceHelper = new THREE.FaceNormalsHelper( box, 5, 0x00ff00, 5 );
        this.scene.add(box)
        this.scene.add(faceHelper)

        // const cameraHelper = new THREE.CameraHelper(this.camera)
        // this.scene.add(cameraHelper)
    },
    initTween() {

    },
    initRaycaster() {
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        window.addEventListener('mousemove', e => {
            this.mouse.x = (e.clientX / this.width) * 2 - 1;
            this.mouse.y = -(e.clientY / this.height) * 2 + 1;
        }, false);
    },

    animation() {
        let delta = this.clock.getDelta();
        this.trackballControls.update(delta);

        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(this.animation.bind(this));

        TWEEN.update();

    }
};
demo.init();
