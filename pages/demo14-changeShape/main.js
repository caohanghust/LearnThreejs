/**
 * @file   raycaster
 * @author caohang (caohanghust@gmail.com)
 * @date   2018/4/11
 */
let createMesh = geometry => {
    let meshMaterial = new THREE.MeshNormalMaterial();
    meshMaterial.side = THREE.DoubleSide;
    let wireFrameMaterial = new THREE.MeshBasicMaterial();
    wireFrameMaterial.wireframe = true;
    let mesh = THREE.SceneUtils.createMultiMaterialObject(geometry, [meshMaterial, wireFrameMaterial]);
    console.log(mesh);
    return mesh;
};
let demo = {
    init() {
        this.initStats();
        this.initThree();
        this.initScene();
        this.initCamera();
        this.initLight();
        // this.initText();
        // this.initBackground();
        this.initObject();
        this.initTween();
        this.initRaycaster();
        this.animation();
    },
    initStats() {
        this.stats = new Stats();
        this.stats.setMode(0); // 0: fps, 1: ms

        // Align top-left
        this.stats.domElement.style.position = 'absolute';
        this.stats.domElement.style.left = '0px';
        this.stats.domElement.style.top = '0px';

        document.getElementById("Stats-output").appendChild(this.stats.domElement);
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
        this.renderer.shadowMapEnabled = false;
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
    initText() {
        let self = this;

        let loader = new THREE.FontLoader();
        loader.load('../../lib/fonts/FZLTH_Regular.json', function (font) {
            let options = {
                size: 50,
                height: 10,
                font: font,
                bevelThickness: 2,
                bevelSize: 4,
                bevelSegments: 3,
                bevelEnabled: true,
                curveSegments: 12,
                steps: 1
            };
            let text = createMesh(new THREE.TextGeometry('魔方', options));
            text.position.z = -100;
            text.position.y = 200;
            text.position.x = -100;
            self.scene.add(text);
        });
    },
    initBackground() {
        let size = 20;
        let geom = new THREE.BufferGeometry();
        let positions = new Float32Array(2000 * 3);
        this.velocitys = new Float32Array(2000);
        let material = new THREE.PointsMaterial({
            size: 20,
            transparent: true,
            opacity: .5,
            map: this.startTexture('#ffffff')
        });
        material.rotation = Math.PI;

        for (let x = 0; x < size; x++) {
            for (let y = 0; y < size; y++) {
                for (let z = 0; z < 5; z++) {
                    let now = (x * size * 5 + y * 5 + z) * 3;
                    positions[now] = (x - 10) * 40 ;
                    positions[now + 1] = (y - 10) * 40;
                    positions[now + 2] = (z - 2) * 10;
                    this.velocitys[x * size * 5 + y * 5 + z] = (Math.random() - .5) * 2;
                }
            }
        }
        geom.addAttribute('position', new THREE.BufferAttribute(positions, 3));
        this.cloud = new THREE.Points(geom, material);
        // 有一面不透明，旧版本threejs可以使用sortParticles解决，新版本未找到相关属性
        // this.cloud.sortParticles = true;
        this.scene.add(this.cloud);

    },
    startTexture(color) {
        let size = 200;
        let can = document.createElement('canvas');
        can.width = size;
        can.height = size;
        let ctx = can.getContext('2d');
        let unit = Math.PI / 180;
        ctx.beginPath();
        ctx.arc(0, 0, size / 2, 0 * unit, 90 * unit, 0);
        ctx.arc(size, 0, size / 2, 90 * unit, 180 * unit, 0);
        // ctx.moveTo(200, 100);
        ctx.arc(size, size, size / 2, 180 * unit, 270 * unit, 0);
        // ctx.moveTo(0, 100);
        ctx.arc(0, size, size / 2, 270 * unit, 360 * unit, 0);
        ctx.fillStyle = color;
        ctx.closePath();
        ctx.fill();
        let texture = new THREE.Texture(can);
        texture.needsUpdate = true;
        return texture;
    },
    initObject() {
        let black = 0x000000;
        let red = 0xff0000;
        let green = 0x00ff00;
        let blue = 0x0000ff;
        // 坐标轴
        let axes = new THREE.AxesHelper(2000);
        this.scene.add(axes);

        // this.rubik = this.generateRubik(100, 3);
        // this.scene.add(this.rubik);
        let cubeGeom = new THREE.BoxGeometry(100, 100, 100);
        let cubeMaterial = new THREE.MeshBasicMaterial({
            morphTargets: true,
            color: 0xffff00
        });
        // let cube = new THREE.Mesh(cubeGeom, cubeMaterial);

        let target1 = new THREE.BoxGeometry(20, 100, 20);
        cubeGeom.morphTargets[0] = {
            name: 't1',
            vertices: target1.vertices
        };
        cubeGeom.computeMorphNormals();
        this.cube = new THREE.Mesh(cubeGeom, cubeMaterial);
        this.scene.add(this.cube)

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
        let self = this;
        new TWEEN.Tween({influence: 0})
            .to( {influence: 1}, 3000 ).onUpdate(function () {
            self.cube.morphTargetInfluences[0] = this.influence
        }).start();
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
        this.stats.update();

        let delta = this.clock.getDelta();
        this.trackballControls.update(delta);

        // let position = this.cloud.geometry.attributes.position;
        // for (let i = 0; i < this.velocitys.length; i++) {
        //     position.array[i * 3 + 2] +=  this.velocitys[i];
        // }
        // position.needsUpdate = true;

        // this.raycaster.setFromCamera(this.mouse, this.camera);
        // let intersects = this.raycaster.intersectObjects(this.scene.children);
        // if (intersects.length > 0) {
        //     // intersects[0].object.rotation.x += Math.PI / 10;
        // }
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(this.animation.bind(this));

        TWEEN.update();

    }
};
demo.init();
