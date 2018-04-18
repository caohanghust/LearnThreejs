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

// todo 这个函数有问题，以后修复
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

        this.rubik = this.generateRubik(100, 3);
        this.scene.add(this.rubik);

        this.initRubikState();
        this.initEvent();
    },
    initEvent() {
        let toolsNode = document.getElementById('tools');
        toolsNode.addEventListener('click', e => {
            let node = e.target;
            if (node.tagName === 'LI') {
                let allNodes = toolsNode.children;
                Array.prototype.forEach.call(allNodes, function (item) {
                    item.className = '';
                });
                let value = node.dataset.value;
                this.direction = Number(value);
                node.className = 'selected';
            }
        });

        let canvasNode = document.getElementById('canvas-frame');
        canvasNode.addEventListener('click', e => {
            this.raycaster.setFromCamera(this.mouse, this.camera);
            let intersects = this.raycaster.intersectObjects(this.rubik.children);
            if (intersects.length > 0 && !this.isMoving && this.direction !== 0) {
                this.isMoving = true;
                let position = intersects[0].object.position;
                console.log(intersects[0].object.name);
                this.doMove(position, this.direction);
            }
        });
    },
    initRubikState() {
        this.isMoving = false;
        // direction一共7个值
        // 其中：0默认值不转动 1、-1 绕Z轴顺时针、逆时针转动
        // 2、-2 绕Y轴顺时针逆时针转动
        // 3、-3 绕X轴顺时针逆时针转动
        this.direction = 0;
    },
    doMove(pos, direction) {
        if (direction === 0) {
            return;
        }
        let self = this;
        let group = new THREE.Object3D();
        let selectedList = this.rubik.children.filter(item => {
            let isSelected = false;
            switch (Math.abs(direction)) {
                case AXISZ:
                    return Math.floor(Math.abs(item.position.z - pos.z)) === 0;
                    break;
                case AXISY:
                    return Math.floor(Math.abs(item.position.y - pos.y)) === 0;
                    break;
                case AXISX:
                    return Math.floor(Math.abs(item.position.x - pos.x)) === 0;
                    break;
                default:
                    return false;

            }
        });
        // 克隆选中的元素进行组转动动画，动画结束后计算每个元素的结束位置
        selectedList.forEach(item => {
            group.add(item.clone());
            item.visible = false;
        });
        let toState = {};
        switch (direction) {
            case AXISZ:
                toState.z = -Math.PI / 2;
                break;
            case AXISZ_REVERSE:
                toState.z = Math.PI / 2;
                break;
            case AXISY:
                toState.y = -Math.PI / 2;
                break;
            case AXISY_REVERSE:
                toState.y = Math.PI / 2;
                break;
            case AXISX:
                toState.x = Math.PI / 2;
                break;
            case AXISX_REVERSE:
                toState.x = -Math.PI / 2;
                break;
        }
        new TWEEN.Tween(group.rotation)
            .to(toState, 1000)
            .repeat(0)
            .start()
            .onComplete(function () {
                self.moveEnd(group, selectedList, direction);
            });
        this.scene.add(group);
    },
    moveEnd(group, selectedList, direction) {
        let rotate = Math.PI / 2;
        if (direction < 0) {
            rotate = -rotate;
        }
        group.visible = false;
        selectedList.forEach(item => {
            item.visible = true;
            rotateAroundWorld(item, rotate, direction);
            this.isMoving = false;
        });
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
                    temp.name = 'x' + x + 'y' + y + 'z' + z;
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

        TWEEN.update();

    }
};
demo.init();
