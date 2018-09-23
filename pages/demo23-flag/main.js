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
        this.camera = new THREE.PerspectiveCamera(60, this.width / this.height, .1, 10);
        this.camera.position.x = -3;
        this.camera.position.y = 4;
        this.camera.position.z = 3;
        this.camera.lookAt(this.scene.position);

        this.orbitControls = new THREE.OrbitControls(this.camera);
        // this.trackballControls.rotateSpeed = 3;
        // this.trackballControls.zoomSpeed = 1;
        // this.trackballControls.panSpeed = 2;
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
      // let axes = new THREE.AxisHelper(2000);
      // this.scene.add(axes);
      const flag = this.flag = new Flag()
      // flag.rotateX(-Math.PI / 2)
      this.scene.add(flag)
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
        this.orbitControls.update(delta);

        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(this.animation.bind(this));

        this.flag.update()
        TWEEN.update();

    }
};
demo.init();
