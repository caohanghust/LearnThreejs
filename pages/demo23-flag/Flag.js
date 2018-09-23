const vs = `
varying vec2 vUv;
void main()
{
    vUv = uv;
    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
    //projectionMatrix * mvPosition; 最终得到MVP矩阵
    gl_Position = projectionMatrix * mvPosition;

}
`
const fs = `
//获取纹理
uniform sampler2D texture1;
//纹理坐标
varying vec2 vUv;

void main(void){
//texture2D()获取纹素
    gl_FragColor = texture2D(texture1, vUv);
}
`

let AXISZ = 1,
    AXISY = 2,
    AXISX = 3,
    AXISZ_REVERSE = -1,
    AXISY_REVERSE = -2,
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


const Flag = class {
  constructor () {
    const flagMesh = new THREE.Object3D()

    const pedestal = this.pedestalMesh()
    pedestal.scale.set(.56, 1, .56)

    const flagPole = this.flagPoleMesh()
    flagPole.scale.y = 2.5

    const flagHead = this.flagHeadMesh()
    flagHead.scale.set(.2, .2, .2)
    flagHead.position.set(0, 2.5, 0)

    const board = this.boardMesh()
    board.scale.set(1.4, .8, .03)
    board.position.set(.1, 1.6, 0)

    flagMesh.add(pedestal)
    flagMesh.add(flagPole)
    flagMesh.add(flagHead)
    flagMesh.add(board)

    Object.assign(flagMesh, {
      flagHead,
      update: this.update
    })
    return flagMesh
  }

  line(start, end, color) {
    const geometry = new THREE.Geometry();
    geometry.vertices.push(new THREE.Vector3(start.x, start.y, start.z));
    geometry.vertices.push(new THREE.Vector3(end.x, end.y, end.z));
    const line = new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: color }));
    return line
  }

  boardMesh () {
    const board = new THREE.Object3D()
    const content = this.boardContent()
    const boardTexture = this.boardTexture = new THREE.Texture(content)
    const mats = []
    mats.push(new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: .6, side: THREE.DoubleSide }))
    mats.push(new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: .6, side: THREE.DoubleSide }))
    mats.push(new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: .6, side: THREE.DoubleSide }))
    mats.push(new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: .6, side: THREE.DoubleSide }))
    mats.push(new THREE.MeshBasicMaterial({
      map: boardTexture,
      transparent: true,
      side: THREE.DoubleSide
    }))
    mats.push(new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0,  side: THREE.DoubleSide }))

    const material = new THREE.MeshFaceMaterial(mats)
    const mesh = this.boxMesh()
    mesh.children[0].material = material
    board.add(mesh)
    return board
  }

  boardContent () {
    const canvas = document.createElement('canvas')
    const width = 1400
    const height = 800
    canvas.setAttribute('width', width)
    canvas.setAttribute('height', height)
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = 'rgba(255, 255, 255, 0)'
    ctx.fillRect(0, 0, 1400, 800)

    ctx.font = 'bold 160px Arial'
    ctx.fillStyle = 'rgba(255, 255, 255, 1.0)'
    ctx.fillText('欢迎光临', 200, 260, 900)

    ctx.moveTo(100, 340)
    ctx.lineTo(1300, 340)
    const gradient = ctx.createLinearGradient(0, 0, 1400, 0)
    gradient.addColorStop(0,  'rgba(255, 255, 255, 0)')
    gradient.addColorStop(.5, 'rgba(255, 255, 255, 1)')
    gradient.addColorStop(1,  'rgba(255, 255, 255, 0)')
    ctx.lineWidth = 4
    ctx.strokeStyle = gradient
    ctx.stroke()

    const content = '泛海国际 3室1厅 145㎡'
    ctx.font = 'normal 100px Arial'
    ctx.fillStyle = 'rgba(255, 255, 255, 1.0)'
    ctx.fillText(content, 200, 490, 1300)

    const triangle = new Image()
    triangle.src = 'triangle.svg'
    triangle.onload = () => {
      ctx.drawImage(triangle, 500, 580, 100, 100)
      this.boardTexture.needsUpdate = true
    }

    const content2 = '开启讲房之旅'
    ctx.font = 'bold 100px Arial'
    ctx.fillStyle = 'rgba(40, 248, 255)'
    ctx.fillText(content2, 640, 670, 700)
    return canvas
  }

  boxMesh () {
    const box = new THREE.Object3D()
    const geom = new THREE.BoxGeometry(1, 1, 1)
    const material = new THREE.MeshBasicMaterial({
      color: 0x3CF3EA,
      transparent: true,
      opacity: .5
    })
    const mesh = new THREE.Mesh(geom, material)
    mesh.position.set(.5, .5, .5)
    box.add(mesh)
    const lines = [
      [ { x: 0, y: 0, z: 0 }, { x: 1, y: 0, z: 0} ],
      [ { x: 0, y: 0, z: 0 }, { x: 0, y: 1, z: 0} ],
      [ { x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 1} ],

      [ { x: 1, y: 1, z: 0 }, { x: 1, y: 1, z: 1} ],
      [ { x: 1, y: 1, z: 0 }, { x: 1, y: 0, z: 0} ],
      [ { x: 1, y: 1, z: 0 }, { x: 0, y: 1, z: 0} ],

      [ { x: 0, y: 1, z: 1 }, { x: 0, y: 1, z: 0} ],
      [ { x: 0, y: 1, z: 1 }, { x: 1, y: 1, z: 1} ],
      [ { x: 0, y: 1, z: 1 }, { x: 0, y: 0, z: 1} ],

      [ { x: 1, y: 0, z: 1 }, { x: 0, y: 0, z: 1} ],
      [ { x: 1, y: 0, z: 1 }, { x: 1, y: 1, z: 1} ],
      [ { x: 1, y: 0, z: 1 }, { x: 1, y: 0, z: 0} ]
    ]
    lines.forEach(([ start, end ]) => {
      box.add(this.line(start, end, 0xffffff))
    })
    return box
  }

  ballMesh () {
    const geom = new THREE.SphereGeometry(1, 50, 50)
    const material = new THREE.MeshBasicMaterial({
      color: 0x70FAF6
    })
    const mesh = new THREE.Mesh(geom, material)
    return mesh
  }

  flagHeadMesh () {
    const flagHead = new THREE.Object3D()
    const box = this.boxMesh()
    const ball = this.ballMesh()
    const radicalSign3 = Math.pow(3, .5)
    const rotateRadian = Math.acos(radicalSign3 / 3)
    ball.scale.set(.35, .35, .35)
    ball.position.set(.5, .5, .5)
    box.add(ball)
    rotateAroundWorld(box, -Math.PI / 4, AXISY)
    rotateAroundWorld(box, -rotateRadian, AXISZ)
    flagHead.add(box)
    flagHead.name = 'flagHead'
    return flagHead
  }

  flagPoleMesh () {
    const flagPole = new THREE.Object3D()
    const mesh = this.line(
      { x: 0, y: 0, z: 0 },
      { x: 0, y: 1, z: 0 },
      0xffffff
    )
    flagPole.add(mesh)
    return flagPole
  }

  pedestalMesh () {
    const pedstal = new THREE.Object3D()
    const geom = new THREE.PlaneGeometry(1, 1)
    const uniforms = {
      texture1 : { value : THREE.ImageUtils.loadTexture('./base.png') }
    }
    uniforms.texture1.value.warpS = uniforms.texture1.value.warpT = THREE.RepeatWrapping;
    const material = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: vs,
      fragmentShader: fs,
      side: THREE.FrontSide,
      transparent: true
    })
    const mesh = new THREE.Mesh(geom, material)
    mesh.rotateX(-Math.PI / 2)
    pedstal.add(mesh)
    return pedstal
  }

  update () {
    const { flagHead } = this
    flagHead.rotateY(.05)
  }
}
