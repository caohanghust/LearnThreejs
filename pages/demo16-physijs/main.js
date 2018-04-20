/**
 * @file   重力引擎
 * @author caohang (caohanghust@gmail.com)
 * @date   2018/3/29
 */

Physijs.scripts.worker = '../../lib/physijs_worker.js';
// todo 此处路径有BUG
Physijs.scripts.ammo = '../lib/ammo.js';

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
        this.renderer.setClearColor(0x000000, 1.0);
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
        this.scene = new Physijs.Scene();
        this.scene.setGravity(new THREE.Vector3(0, -10, 0));
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

        let boxGemo = new THREE.BoxGeometry(100, 100, 10);
        let texture = new THREE.Texture(this.faces('#ffff00', 100));
        texture.needsUpdate = true;
        let material = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            opacity: .8
        });

        let group = [];
        for (let i = -5; i < 5; i++) {
            let box = new Physijs.BoxMesh(boxGemo, material, 1);
            box.position.set(0, 50, i * 50);
            box.__dirtyRotation = true;
            group.push(box);
            this.scene.add(box);
        }
        group[0].rotation.x = Math.PI / 6;
        group[0].__dirtyRotation = true;

        let ground = new Physijs.BoxMesh(
            new THREE.BoxGeometry(1000, 1, 1000),
            new THREE.MeshBasicMaterial({
                color: 0x999999
            }),
            0
        );
        this.scene.add(ground);
    },
    faces(color, size) {
        let solidWidth = size / 10;
        let canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        let context = canvas.getContext('2d');
        if (context) {
            context.fillStyle = 'rgba(0, 0, 0, 1)';
            context.fillRect(0, 0, size, size);
            context.rect(solidWidth, solidWidth, size - solidWidth * 2, size - solidWidth * 2);
            context.lineJoin = 'round';
            context.lineWidth = solidWidth;
            context.fillStyle = color;
            context.strokeStyle = color;
            context.stroke();
            context.fill();
        }
        return canvas;
    },
    changePivot(obj) {
        let wrapper = new THREE.Object3D();
        wrapper.position.set(100, 0, 0);
        wrapper.add(obj);
        obj.position.set(-100, 0, 0);
        return wrapper;
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
        this.scene.simulate();
        TWEEN.update();
    }
};
demo.init();
