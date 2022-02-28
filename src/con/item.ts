import triVs from '../glsl/tri.vert';
import triFs from '../glsl/tri.frag';
import { Util } from "../libs/util";
import { Mesh } from 'three/src/objects/Mesh';
import { DoubleSide } from 'three/src/constants';
import { Func } from "../core/func";
import { Vector3 } from "three/src/math/Vector3";
import { ShaderMaterial } from 'three/src/materials/ShaderMaterial';
import { Color } from 'three/src/math/Color';
import { Object3D } from "three/src/core/Object3D";
import { Scroller } from "../core/scroller";
import { Conf } from '../core/conf';
import { MyObject3D } from '../webgl/myObject3D';

export class Item extends MyObject3D {

  private _id:number
  private _con:Object3D
  private _tri:Mesh
  private _shadow:Mesh


  // private _shakeVal:Array<Val> = []
  // private _posNoise:Vector3 = new Vector3()

  public itemSize:Vector3 = new Vector3()

  constructor(opt:any = {}) {
    super()

    this._id = opt.id

    this._con = new Object3D()
    this.add(this._con)

    this._shadow = new Mesh(
      opt.geo,
      new ShaderMaterial({
        vertexShader:triVs,
        fragmentShader:triFs,
        transparent:true,
        side:DoubleSide,
        uniforms:{
          alpha:{value:1},
          color:{value:new Color(0x000000)},
        }
      })
    )
    this._con.add(this._shadow)

    this._tri = new Mesh(
      opt.geo,
      new ShaderMaterial({
        vertexShader:triVs,
        fragmentShader:triFs,
        transparent:true,
        side:DoubleSide,
        uniforms:{
          alpha:{value:1},
          color:{value:opt.col},
        }
      })
    )
    this._con.add(this._tri)

    // 基準点ずらす
    this._tri.position.x = 0.5
    this._shadow.position.x = 0.5

    this.scale.x = this._id % 2 == 0 ? 1 : -1
  }


  // ---------------------------------
  // ゆらす
  // ---------------------------------
  // private _shake(key:number):void {
  //   const sv = this._shakeVal[key]
  //   if(sv.val > 0) return

  //   Tween.instance.a(sv, {
  //     val:[0, 1.1]
  //   }, 0.2, 0)
  // }


  // ---------------------------------
  // 更新
  // ---------------------------------
  protected _update():void {
    super._update()

    // const sw = Func.instance.sw()
    const sh = Func.instance.sh()
    const s = Scroller.instance.val.y

    const sukima = 0.7
    this._con.position.y = 0
    const num = Conf.instance.ROT_NUM
    const it = (Conf.instance.SCROLL_HEIGHT * sh - sh) / num
    for(let i = 0; i < num; i++) {
      const start = i * it
      const end = start + (it * sukima)
      const r = Util.instance.map(s, 0, 1, start, end)
      const nowAng = 180 * i
      const addAng = i % 2 == 0 ? 180 : -180
      if(i == 0 || r > 0) this._con.rotation.z = Util.instance.radian(Util.instance.mix(nowAng, nowAng + addAng, r))
      if(i % 2 != 0 && r >= 1) {
        this._tri.position.y = 0.5
      }
      if(i % 2 == 0 && r >= 1) {
        this._tri.position.y = -0.5
      }
      if(i == 0 && r < 1) {
        this._tri.position.y = 0.5
      }
      if(r >= 1) this._con.position.y -= this._con.scale.y

      this._shadow.position.x = this._tri.position.x
      this._shadow.position.y = this._tri.position.y
    }

    const shadowSize = 0.05
    // this._shadow.position.x -= shadowSize
    this._shadow.position.y -= shadowSize

    const size = sh / (num + 1)
    this._con.scale.set(size, size, 1)

    this.itemSize.x = size * 1
    this.itemSize.y = size * 0.5
  }
}