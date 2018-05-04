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
            antialias : true
        });
        this.renderer.setSize(this.width, this.height);
        document.getElementById('canvas-frame').appendChild(this.renderer.domElement);
        this.renderer.setClearColor(0xffffff, 1.0);
        this.renderer.shadowMapEnabled = true;
        this.clock = new THREE.Clock();
    },
    initCamera() {
        this.camera = new THREE.PerspectiveCamera(90, this.width / this.height, .1, 1000);
        this.camera.position.x = 400;
        this.camera.position.y = 400;
        this.camera.position.z = 400;
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
        let spotLight = new THREE.AmbientLight(0xffffff);
        spotLight.position.set(-6, 6, 6);
        // spotLight.castShadow = true;
        this.scene.add(spotLight);
    },
    initObject() {
        let self = this;
        let black = 0x000000;
        let red = 0xff0000;
        let green = 0x00ff00;
        let blue = 0x0000ff;
        // 坐标轴
        let axes = new THREE.AxisHelper(200);
        this.scene.add(axes);

        this.loadLayer(4, 127);
    },
    async loadLayer (layer, max) {
        let step = 8;
        let group = new THREE.Object3D();
        for (let i = 0; i < max; i += step) {
            for (let j = 0; j < max; j += step) {
                let fileName = `tile_${layer}_${i}_${j}_tex`;
                let material = await this.loadMaterial(fileName);
                if (material === undefined) {
                    continue;
                }
                let obj = await this.loadObj(fileName, material);
                if (obj === undefined) {
                    continue;
                }
                group.add(obj);
            }
        }
        this.scene.add(group);
    },
    loadMaterial(name) {
        return new Promise(resolve => {
            new THREE.MTLLoader().setPath( '/LearnThreejs/models/altizure/' ).load(name + '.mtl', material => {
                material.preload();
                resolve(material);
            }, undefined, e => {
                resolve();
            });
        })
    },
    loadObj(name, material) {
        return new Promise(resolve => {
            new THREE.OBJLoader().setMaterials(material).setPath( '/LearnThreejs/models/altizure/' )
              .load(name + '.obj', obj => resolve(obj), undefined, e => {
                resolve();
              });
        })
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
