/**
 * @file   绘制三维坐标系
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
        this.animation();
    },
    initThree() {
        width = document.getElementById('canvas-frame').clientWidth;
        height = document.getElementById('canvas-frame').clientHeight;
        this.renderer = new THREE.WebGLRenderer({
            antialias : true
        });
        this.renderer.setSize(width, height);
        document.getElementById('canvas-frame').appendChild(this.renderer.domElement);
        this.renderer.setClearColor(0xFFFFFF, 1.0);
    },
    initCamera() {
        this.camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);
        this.camera.position.x = 300;
        this.camera.position.y = 300;
        this.camera.position.z = 200;
        this.camera.up.x = 1;
        this.camera.up.y = 0;
        this.camera.up.z = 0;
        this.camera.lookAt(this.scene.position);
    },
    initScene() {
        this.scene = new THREE.Scene();
    },
    initLight() {
    },
    initObject() {
        // var geometry = new THREE.Geometry();
        // geometry.vertices.push( new THREE.Vector3( 0, 0, 0 ) );
        // geometry.vertices.push( new THREE.Vector3( 100, 0, 0 ) );
        this.drawCube();
        // var line = new THREE.Line( geometry, new THREE.LineBasicMaterial( { color: 0x000000, opacity: 0.2 } ) );
        // this.scene.add(line);
        //
        // var line2 = new THREE.Line( geometry, new THREE.LineBasicMaterial( { color: 0x000000, opacity: 0.2 } ) );
        // line2.rotation.y = -90 * Math.PI / 180;
        // this.scene.add(line2);
        //
        // var line3 = new THREE.Line( geometry, new THREE.LineBasicMaterial( { color: 0x000000, opacity: 0.2 } ) );
        // line3.rotation.z = 90 * Math.PI / 180;
        // this.scene.add(line3);
        // for ( var i = 0; i <= 30; i ++ ) {
        //
        //     var line = new THREE.Line( geometry, new THREE.LineBasicMaterial( { color: 0x000000, opacity: 0.2 } ) );
        //     line.position.y = i * 30;
        //     this.scene.add(line);
        //
        //     var line = new THREE.Line( geometry, new THREE.LineBasicMaterial( { color: 0x000000, opacity: 0.2 } ) );
        //     line.position.x = i * 30;
        //     line.rotation.y = 90 * Math.PI / 180;
        //     this.scene.add( line );
        // }
    },
    drawCube() {
        // 4横线
        let geometry = new THREE.Geometry();
        geometry.vertices.push( new THREE.Vector3( 0, 0, 0 ) );
        geometry.vertices.push( new THREE.Vector3( 100, 0, 0 ) );
        let row = new THREE.Line( geometry, new THREE.LineBasicMaterial( { color: 0x000000, opacity: 0.2 } ) );
        this.scene.add(row);
        let row1 = new THREE.Line( geometry, new THREE.LineBasicMaterial( { color: 0x000000, opacity: 0.2 } ) );
        row1.position.y = 100;
        this.scene.add(row1);
        let row2 = new THREE.Line( geometry, new THREE.LineBasicMaterial( { color: 0x000000, opacity: 0.2 } ) );
        row2.position.z = 100;
        this.scene.add(row2);
        let row3 = new THREE.Line( geometry, new THREE.LineBasicMaterial( { color: 0x000000, opacity: 0.2 } ) );
        row3.position.z = 100;
        row3.position.y = 100;
        this.scene.add(row3);

        // 4竖线
        geometry = new THREE.Geometry();
        geometry.vertices.push( new THREE.Vector3( 0, 0, 0 ) );
        geometry.vertices.push( new THREE.Vector3( 0, 100, 0 ) );
        let stand = new THREE.Line( geometry, new THREE.LineBasicMaterial( { color: 0xff0000, opacity: 0.2 } ) );
        this.scene.add(stand);
        let stand1 = new THREE.Line( geometry, new THREE.LineBasicMaterial( { color: 0xff0000, opacity: 0.2 } ) );
        stand1.position.x = 100;
        this.scene.add(stand1);
        let stand2 = new THREE.Line( geometry, new THREE.LineBasicMaterial( { color: 0xff0000, opacity: 0.2 } ) );
        stand2.position.z = 100;
        this.scene.add(stand2);
        let stand3 = new THREE.Line( geometry, new THREE.LineBasicMaterial( { color: 0xff0000, opacity: 0.2 } ) );
        stand3.position.z = 100;
        stand3.position.x = 100;
        this.scene.add(stand3);

        // 4纵线
        geometry = new THREE.Geometry();
        geometry.vertices.push( new THREE.Vector3( 0, 0, 0 ) );
        geometry.vertices.push( new THREE.Vector3( 0, 0, 100 ) );
        let endlong = new THREE.Line( geometry, new THREE.LineBasicMaterial( { color: 0xffff00, opacity: 0.2 } ) );
        this.scene.add(endlong);
        let endlong1 = new THREE.Line( geometry, new THREE.LineBasicMaterial( { color: 0xffff00, opacity: 0.2 } ) );
        endlong1.position.x = 100;
        this.scene.add(endlong1);
        let endlong2 = new THREE.Line( geometry, new THREE.LineBasicMaterial( { color: 0xffff00, opacity: 0.2 } ) );
        endlong2.position.y = 100;
        this.scene.add(endlong2);
        let endlong3 = new THREE.Line( geometry, new THREE.LineBasicMaterial( { color: 0xffff00, opacity: 0.2 } ) );
        endlong3.position.y = 100;
        endlong3.position.x = 100;
        this.scene.add(endlong3);
    },
    initTween() {

    },
    animation() {
        //renderer.clear();
        // this.render.clear();
        // this.camera.position.x = this.camera.position.x +1;
        // this.camera.position.y = this.camera.position.y +1;
        // this.camera.position.z = this.camera.position.z +1;
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(this.animation.bind(this));
        TWEEN.update();
    }
};
demo.init();
