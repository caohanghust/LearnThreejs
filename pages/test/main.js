/**
 * @file   魔方完整版
 * @author caohang (caohanghust@gmail.com)
 * @date   2018/3/29
 */

let AXISZ = 1,
    AXISY = 2,
    AXISX = 3,
    AXISZ_REVERSE = -1;
    AXISY_REVERSE = -2;
    AXISX_REVERSE = -3;

// todo 这个函数有问题，稍后修复
let rotateAroundWorld = function (obj, rad, axis) {
    let x0 = obj.position.x;
    let y0 = obj.position.y;
    let z0 = obj.position.z;
    let q = new THREE.Quaternion();
    switch (axis) {
        case AXISZ:
            q.setFromAxisAngle(new THREE.Vector3(0, 0, -1), rad);
            obj.quaternion.premultiply(q);
            obj.position.x = y0 * Math.sin(rad) + x0 * Math.cos(rad);
            obj.position.y = y0 * Math.cos(rad) - x0 * Math.sin(rad);
            break;
        case AXISZ_REVERSE:
            q.setFromAxisAngle(new THREE.Vector3(0, 0, -1), rad);
            obj.quaternion.premultiply(q);

            obj.position.x = y0 * Math.sin(rad) + x0 * Math.cos(rad);
            obj.position.y = y0 * Math.cos(rad) - x0 * Math.sin(rad);
            break;
        case AXISY:
            q.setFromAxisAngle(new THREE.Vector3(0, -1, 0), rad);
            obj.quaternion.premultiply(q);


            obj.position.z = x0 * Math.sin(rad) + z0 * Math.cos(rad);
            obj.position.x = x0 * Math.cos(rad) - z0 * Math.sin(rad);
            break;
        case AXISY_REVERSE:
            q.setFromAxisAngle(new THREE.Vector3(0, -1, 0), rad);
            obj.quaternion.premultiply(q);

            obj.position.z = x0 * Math.sin(rad) + z0 * Math.cos(rad);
            obj.position.x = x0 * Math.cos(rad) - z0 * Math.sin(rad);
            break;
        case AXISX:
            q.setFromAxisAngle(new THREE.Vector3(1, 0, 0), rad);
            obj.quaternion.premultiply(q);

            obj.position.z = y0 * Math.sin(rad) + z0 * Math.cos(rad);
            obj.position.y = y0 * Math.cos(rad) - z0 * Math.sin(rad);
            break;
        case AXISX_REVERSE:
            q.setFromAxisAngle(new THREE.Vector3(1, 0, 0), rad);
            obj.quaternion.premultiply(q);

            obj.position.z = y0 * Math.sin(rad) + z0 * Math.cos(rad);
            obj.position.y = y0 * Math.cos(rad) - z0 * Math.sin(rad);
            break;
    }
};

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

        let itemSize = 100;
        let offset = 100 * 3 / 2 - 100 / 2;

        let matArray = ['#0000ff', '#00ff00', '#ff0000', '#00ffff', '#ff00ff', '#ffff00'].reduce((result, item) => {
            let texture = new THREE.Texture(this.faces(item, 100));
            texture.needsUpdate = true;
            let material = new THREE.MeshBasicMaterial({map: texture});
            result.push(material);
            return result;
        }, []);
        let faceMaterial = new THREE.MeshFaceMaterial(matArray);
        let cubeGeom = new THREE.BoxGeometry(100, 100, 100);

        this.rubik = new THREE.Object3D();

        this.temp = new THREE.Mesh(cubeGeom, faceMaterial);
        this.temp.position.x = 1 * itemSize - offset;
        this.temp.position.y = 1 * itemSize - offset;
        this.temp.position.z = 3 * itemSize - offset;

        this.temp2 = new THREE.Mesh(cubeGeom, faceMaterial);
        this.temp2.position.x = 2 * itemSize - offset;
        this.temp2.position.y = 1 * itemSize - offset;
        this.temp2.position.z = 3 * itemSize - offset;

        this.rubik.add(this.temp);
        this.rubik.add(this.temp2);
        // this.scene.add(this.temp);
        this.scene.add(this.rubik);


        // this.rubik = this.generateRubik(100, 3);
        // this.scene.add(this.rubik);

        // this.initRubikState();
        // this.selected = new THREE.Object3D();
        // this.selected.add(this.rubik.children[0], this.rubik.children[1], this.rubik.children[2],
        //     this.rubik.children[3], this.rubik.children[4], this.rubik.children[5], this.rubik.children[6], this.rubik.children[7], this.rubik.children[8]);
        // this.selected = this.changePivot(this.selected);
        // this.scene.add(this.selected);
        //
        // console.log(this.rubik);

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

    initTween() {
        // new TWEEN.Tween(this.selected.rotation)
        //     .to( { x: Math.PI / 2 }, 1000 ).repeat( 0 ).start();
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
        // this.selected.rotation.x += .01;
        // for (let i = 0; i < 27; i += 3) {
        //     rotateAroundWorldZ(this.rubik.children[i], .01);
        // }
        this.rubik.children.forEach(item => {
            rotateAroundWorld(item, .01, 3);
        });
        this.raycaster.setFromCamera(this.mouse, this.camera);
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(this.animation.bind(this));

        TWEEN.update();

    }
};
demo.init();
