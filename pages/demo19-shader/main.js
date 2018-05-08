/**
 * @file   着色器
 * @author caohang (caohanghust@gmail.com)
 * @date   2018/5/04
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
        this.needtrackballControls = true;
        this.camera = new THREE.PerspectiveCamera(90, this.width / this.height, .1, 1000);
        this.camera.position.x = 400;
        this.camera.position.y = 0;
        this.camera.position.z = 400;
        this.camera.lookAt(
          this.scene.position
        )
        // this.camera.rotation.x = Math.PI / 2;
        // this.camera.position.y = 400;
        // this.camera.rotation. y = Math.PI / 2;

      // this.camera.rotation.x = Math.PI / 2;
        if (this.needtrackballControls) {
          this.trackballControls = new THREE.TrackballControls(this.camera);
          this.trackballControls.rotateSpeed = 3;
          this.trackballControls.zoomSpeed = 1;
          this.trackballControls.panSpeed = 2;
        }
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
        // 坐标轴
        let axes = new THREE.AxisHelper(2000);
        this.scene.add(axes);

        this.loadLayer(0, 127);

        // let boundingBoxGemo = new THREE.BoxGeometry(1000, 1000, 1000);
        // let bMaterial = this.getShaderMaterial();
        // bMaterial.side = THREE.DoubleSide;
        // let boundingBox = new THREE.Mesh(boundingBoxGemo, bMaterial);
        // this.scene.add(boundingBox);

        // let boxGemo = new THREE.BoxGeometry(100, 100, 100);
        // let material = this.getShaderMaterial();
        //
        // let box = new THREE.Mesh(boxGemo, material);
        // this.scene.add(box);

    },
    getShaderMaterial() {
      const __ = (type, value) => ({ type, value })
      let quaternion = {
        x: -0.0013921209190372,
        y: -0.72073145037971,
        z: 0.0026101687108931,
        w: 0.69320807504677
      }
      const quaternion_to_rotate = new THREE.Quaternion()
        .setFromAxisAngle( new THREE.Vector3(0, 1, 0), 0 )

      quaternion = new THREE.Quaternion(quaternion.x, quaternion.y, quaternion.z, quaternion.w)
      quaternion.multiply(quaternion_to_rotate)

      let object = new THREE.Object3D();
      object.quaternion.set(
        quaternion.x,
        quaternion.y,
        quaternion.z,
        quaternion.w);
      object.position.set(0, 0.17, 0);

      let uniforms = THREE.UniformsUtils.clone({
        map:               __('t',  null),
        modelAlpha:        __('f',  0),
        opacity:           __('f',  1),
        progress:          __('f',  0),
        blackoutProgress:  __('f',  0),
        stasis:            __('i',  0),
        blackout:          __('i',  0),
        pano0Map:          __('t',  null),
        pano0Position:     __('v3', this.camera.position),
        pano0Matrix:       __('m4', object.matrix),
        pano1Map:          __('t',  null),
        pano1Position:     __('v3', this.camera.position),
        pano1Matrix:       __('m4', object.matrix)
      })
      uniforms.modelAlpha.value = 0
      uniforms.opacity.value = 1
      const material = new THREE.ShaderMaterial({
        vertexShader: document.getElementById('vs').textContent,
        fragmentShader: document.getElementById('fs').textContent,
        uniforms: uniforms
      })
      let images = ['r', 'l', 'u', 'd', 'f', 'b'];
      let imageLoaderPromise = [];
      for (let item of images) {
        imageLoaderPromise.push(this.loadPanoImg('pano1/' + item + '.jpg'));
      }
      Promise.all(imageLoaderPromise).then(result => {
        const cubeTexture = new THREE.CubeTexture(result);
        uniforms.pano1Map.value =
        uniforms.pano0Map.value = Object.assign(cubeTexture, {
          // sourceFile: 'pano1/r.jpg',
          needsUpdate: true,
          wrapS: THREE.RepeatWrapping,
          wrapT: THREE.RepeatWrapping,
          minFilter: THREE.LinearFilter,
        })
      })

      return material;
    },
    loadPanoImg(filename) {
      return new Promise(resolve => {
        const imageLoader = new THREE.ImageLoader();
        imageLoader.setCrossOrigin('');
        imageLoader.load(filename, image => {
          resolve(image);
        })
      });
    },
    async loadLayer (layer, max) {
        let step = 128;
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
                // todo 全景切换
                // obj.children[0].material = this.getShaderMaterial()
                // obj.children[0].material.wireframe = true;
                group.add(obj);
            }
        }
        let expectSize = 1000;
        let boudingBoxSize = this.getBoundingBox(group);
        let scaleRadio = expectSize / (boudingBoxSize.max.x - boudingBoxSize.min.x) ;
        window.group = group;
        group.scale.set(scaleRadio, scaleRadio, scaleRadio);
        group.position.z -= boudingBoxSize.min.z * 2;

        this.scene.add(group);
    },
    getBoundingBox(obj) {
        let box = new THREE.Box3();
        return box.expandByObject(obj);
    },
    loadMaterial(name) {
        return new Promise(resolve => {
            new THREE.MTLLoader().setPath( '/LearnThreejs/models/altizure/' ).load(name + '.mtl', material => {
                material.preload();
                resolve(material);
                console.log(name + '.mtl');
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
        this.needtrackballControls && this.trackballControls.update(delta);
        // this.camera.rotation.y += .01;
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(this.animation.bind(this));
        TWEEN.update();

    }
};
demo.init();
