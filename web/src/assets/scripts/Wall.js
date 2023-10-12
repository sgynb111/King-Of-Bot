import { AcGameObject } from "./AcGameObject";

export class Wall extends AcGameObject {
    constructor(r, c, gamemap) {
        super();

        this.r = r;//横坐标
        this.c = c;//纵坐标
        this.gamemap = gamemap;//地图
        this.color = "#B37226";//颜色
    }

    update() {
        this.render();
    }

    render() {
        const L = this.gamemap.L;//获取单位长度
        const ctx = this.gamemap.ctx;//获取画布

        ctx.fillStyle = this.color;//获取颜色
        ctx.fillRect(this.c * L, this.r * L, L, L);//填充颜色
    }
}
