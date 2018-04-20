/**
 * @file   太阳系
 * @author caohang (caohanghust@gmail.com)
 * @date   2018/3/29
 */

let AXISZ = 1,
    AXISY = 2,
    AXISX = 3,
    AXISZ_REVERSE = -1;
AXISY_REVERSE = -2;
AXISX_REVERSE = -3;

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
        this.camera = new THREE.PerspectiveCamera(60, this.width / this.height, .1, 10000);
        this.camera.position.x = -300;
        this.camera.position.y = 500;
        this.camera.position.z = 400;
        this.camera.lookAt(this.scene.position);
        this.trackballControls = new THREE.TrackballControls(this.camera);
        this.trackballControls.rotateSpeed = 3;
        this.trackballControls.zoomSpeed = 1;
        this.trackballControls.panSpeed = 2;
    },
    initScene() {
        this.scene = new THREE.Scene();
    },
    initLight() {
        this.light = new THREE.PointLight(0xffffff);
        this.scene.add(this.light);
    },
    initObject() {
        let black = 0x000000;
        let red = 0xff0000;
        let green = 0x00ff00;
        let blue = 0x0000ff;
        // 坐标轴
        let axes = new THREE.AxisHelper(2000);
        this.scene.add(axes);

        // 绘制行星轨道

        let ringSize = 200;
        for (let i = 0; i < 8; i++) {
            let ring = this.createPathWay(ringSize);
            ring.rotation.x = Math.PI / 2;
            ringSize += 100;
            this.scene.add(ring);
        }

        this.planets = [];

        // 太阳本身为光源，材质不同
        let sunGemo = new THREE.SphereGeometry(100, 100, 100);
        let sunTexture = new THREE.TextureLoader().load('sun.jpg');
        let sunMaterial = new THREE.MeshBasicMaterial({
            map: sunTexture
        });
        let sun = new THREE.Mesh(sunGemo, sunMaterial);
        this.planets.push(sun);

        // 水星
        let mercury = this.createPlanet(15, 0x00ffff);
        mercury.position.x = 200;
        mercury.speed = 4;
        this.planets.push(mercury);

        let venus = this.createPlanet(20, 0xf0f0aa);
        venus.position.x = 300;
        venus.speed = 1.5;
        this.planets.push(venus);

        // 地球
        let earth = this.createPlanet(30, undefined, 'Earth.png');
        earth.position.x = 400;
        earth.speed = 1;
        this.planets.push(earth);

        // 火星
        let mars = this.createPlanet(25, undefined, 'Mars.png');
        mars.position.x = 500;
        mars.speed = .5;
        this.planets.push(mars);

        // 木星
        let jupiter = this.createPlanet(50, 0x5f5f00);
        jupiter.position.x = 600;
        jupiter.speed = .1;
        this.planets.push(jupiter);

        // 土星
        let staurn = this.createPlanet(30, 0x7f5f05);
        staurn.position.x = 700;
        staurn.speed = .03;
        this.planets.push(staurn);

        // 天王星
        let uranus = this.createPlanet(20, 0x00aaff);
        uranus.position.x = 800;
        uranus.speed = .015;
        this.planets.push(uranus);

        // 海王星
        let neptune = this.createPlanet(10, 0x00ffaa);
        neptune.position.x = 900;
        neptune.speed = .006;
        this.planets.push(neptune);

        this.planets.forEach(item => {
            this.scene.add(item);
        });

    },
    createPathWay(size) {
        let ringGemo = new THREE.RingGeometry(size - 1, size, 100);
        let mat = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            side: THREE.DoubleSide
        });
        let ring = new THREE.Mesh(ringGemo, mat);
        return ring;
    },
    createPlanet(size, color, img) {
        let planetGemo = new THREE.SphereGeometry(size, 50, 50);
        let material;
        if (img) {
            let texture = new THREE.TextureLoader().load(img);
            material = new THREE.MeshLambertMaterial({
                map: texture
            })
        }
        else {
            material = new THREE.MeshLambertMaterial({
                color: color
            });
        }

        let planet = new THREE.Mesh(planetGemo, material);
        return planet;
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
        this.planets.forEach(item => {
            let speed = item.speed * 0.015 || .015;
            rotateAroundWorld(item, speed, AXISY);
        });
    }
};
demo.init();
