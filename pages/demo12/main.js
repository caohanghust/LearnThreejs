/**
 * @file   raycaster
 * @author caohang (caohanghust@gmail.com)
 * @date   2018/4/11
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
        this.renderer.setClearColor(0xFFFFFF, 1.0);
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
        let axes = new THREE.AxisHelper(20);
        this.scene.add(axes);

        // this.rubik = this.generateRubik(100, 3);
        // this.scene.add(this.rubik);
        let itemSize = 100;
        let order = 3;
        let offset = itemSize * order / 2 - itemSize / 2;
        let matArray = ['#0000ff', '#00ff00', '#ff0000', '#00ffff', '#ff00ff', '#ffff00'].reduce((result, item) => {
            let texture = new THREE.Texture(this.faces(item, itemSize));
            texture.needsUpdate = true;
            let material = new THREE.MeshBasicMaterial({map: texture});
            result.push(material);
            return result;
        }, []);
        let faceMaterial = new THREE.MeshFaceMaterial(matArray);
        let cubeGeom = new THREE.BoxGeometry(itemSize / 2, itemSize / 2, itemSize / 2);
        let temp;
        let rubik = new THREE.Object3D();
        for (let x = 0; x < order; x++) {
            for (let y = 0; y < order; y++) {
                for (let z = 0; z < order; z++) {
                    temp = new THREE.Mesh(cubeGeom, faceMaterial);
                    temp.position.x = x * itemSize - offset;
                    temp.position.y = y * itemSize - offset;
                    temp.position.z = z * itemSize - offset;
                    this.scene.add(temp);
                }
            }
        }
        console.log(this.scene);
    },
    generateRubik(itemSize, order) {
        let offset = itemSize * order / 2 - itemSize / 2;
        let matArray = ['#0000ff', '#00ff00', '#ff0000', '#00ffff', '#ff00ff', '#ffff00'].reduce((result, item) => {
            let texture = new THREE.Texture(this.faces(item, itemSize));
            texture.needsUpdate = true;
            let material = new THREE.MeshBasicMaterial({map: texture});
            result.push(material);
            return result;
        }, []);
        let faceMaterial = new THREE.MeshFaceMaterial(matArray);
        let cubeGeom = new THREE.BoxGeometry(itemSize, itemSize, itemSize);
        let temp;
        let rubik = new THREE.Object3D();
        for (let x = 0; x < order; x++) {
            for (let y = 0; y < order; y++) {
                for (let z = 0; z < order; z++) {
                    temp = new THREE.Mesh(cubeGeom, faceMaterial);
                    temp.position.x = x * itemSize - offset;
                    temp.position.y = y * itemSize - offset;
                    temp.position.z = z * itemSize - offset;
                    rubik.add(temp);
                }
            }
        }
        return rubik;
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
        wrapper.position.set(15, 0, 0);
        wrapper.add(obj);
        obj.position.set(-15, 0, 0);
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

        this.raycaster.setFromCamera(this.mouse, this.camera);
        let intersects = this.raycaster.intersectObjects(this.scene.children);
        if (intersects.length > 0) {
            intersects[0].object.rotation.x += Math.PI / 10;
        }
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(this.animation.bind(this));

        TWEEN.update();

    }
};
demo.init();
