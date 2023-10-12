import {AcGameObject} from "./AcGameObject"

import {Cell} from "./Cell"

export class Snake extends AcGameObject {
    constructor(info, gamemap) {
        super();

        this.id = info.id;
        this.color = info.color;
        this.gamemap = gamemap;

        this.cells = [new Cell(info.r, info.c)]//存放蛇的身体,cell[0]存放蛇头
        this.next_cell = null;//下一步的目标位置

        this.speed = 5//蛇每秒走5个格子
        this.direction = -1;//-1表示没有指令，0,1,2,3表示上右下左
        this.status = "idle";//idle表示静止，move表示移动，die表示失败

        this.dr = [-1, 0, 1, 0]//4个方向行的偏移量
        this.dc = [0, 1, 0, -1]//四个方向列的偏移量

        this.step = 0;//回合数

        this.eps = 1e-2;//允许的误差

        this.eye_direction = 0;
        if (this.id === 1) this.eye_direction = 2;

        this.eye_dx = [//蛇眼睛偏移量
            [-1, 1],
            [1, 1],
            [1, -1],
            [-1, -1],
        ];
        this.eye_dy = [
            [-1, -1],
            [-1, 1],
            [1, 1],
            [-1, 1],
        ];
    }

    start() {

    }

    set_direction(d) {//移动的方向
        this.direction = d;
    }

    check_tail_increasing() {//检测当前回合，蛇的长度是否增加
        if (this.step < 10) return true;//初始10格长
        if (this.step % 3 === 1) return true;//每3回合增长1格
        return false;
    }

    next_step() {//将蛇的状态变为走下一步
        const d = this.direction;
        this.next_cell = new Cell(this.cells[0].r + this.dr[d], this.cells[0].c + this.dc[d]);//头的下一节就是当前圆心位置加上下一步的偏移量
        this.eye_direction = d;
        this.direction = -1;//清空操作
        this.status = "move";//状态为移动
        this.step++;//回合数增加

        const k = this.cells.length;//获取当前蛇的长度
        for (let i = k; i > 0; i--) {
            this.cells[i] = JSON.parse(JSON.stringify(this.cells[i - 1]));//深拷贝每一节
        }

        if (!this.gamemap.check_valid(this.next_cell)) {  //撞了
            this.status = "die";//状态设为死亡
        }

    }

    update_move() {
        //移动距离等于下个位置减去当前位置
        const dx = this.next_cell.x - this.cells[0].x;
        const dy = this.next_cell.y - this.cells[0].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.eps) {//走到目标
            this.cells[0] = this.next_cell; //添加一个新蛇头
            this.next_cell = null;//重置下一节为空
            this.status = "idle"; //设为静止

            if (!this.check_tail_increasing()) {//如果当前回合蛇长度不增加，则尾删一个节点
                this.cells.pop();
            }
        } else {
            const move_distance = this.speed * this.timedelta / 1000;//每两帧之间走的距离
            // 蛇头的位置改变为下一帧的位置
            this.cells[0].x += move_distance * dx / distance;
            this.cells[0].y += move_distance * dy / distance;

            if (!this.check_tail_increasing()) {//蛇长度没有增加
                const k = this.cells.length;
                const tail = this.cells[k - 1], tail_target = this.cells[k - 2];
                const tail_dx = tail_target.x - tail.x;
                const tail_dy = tail_target.y - tail.y;
                // 蛇尾的位置改变为下一帧的位置
                tail.x += move_distance * tail_dx / distance;
                tail.y += move_distance * tail_dy / distance;
            }
        }

    }

    update() { //每一帧执行一次
        if (this.status === "move") {// 状态为移动则更新蛇的位置
            this.update_move();
        }
        this.render();// 每帧渲染一次
    }

    render() {
        const L = this.gamemap.L;//获取单位长度
        const ctx = this.gamemap.ctx;//获取画布

        ctx.fillStyle = this.color;//获取当前蛇的填充色
        if (this.status === "die") {//如果当前步死亡
            ctx.fillStyle = "white";// 填充色改为白色
        }

        for (const cell of this.cells) {//遍历蛇的结点并且填充每一个
            ctx.beginPath();
            ctx.arc(cell.x * L, cell.y * L, L / 2 * 0.8, 0, Math.PI * 2);
            ctx.fill();
        }

        //画蛇身
        for (let i = 1; i < this.cells.length; i++) {
            const a = this.cells[i - 1], b = this.cells[i];
            // 游戏开始蛇还蜷缩在一起
            if (Math.abs(a.x - b.x) < this.eps && Math.abs(a.y - b.y) < this.eps)
                continue;

            if (Math.abs(a.x - b.x) < this.eps) {//横向有移动
                ctx.fillRect((a.x - 0.4) * L, Math.min(a.y, b.y) * L, L * 0.8, Math.abs(a.y - b.y) * L);
            } else {// 纵向有移动
                ctx.fillRect(Math.min(a.x, b.x) * L, (a.y - 0.4) * L, Math.abs(a.x - b.x) * L, L * 0.8)
            }
        }


        ctx.fillStyle = "black";
        for (let i = 0; i < 2; i++) {//遍历两个眼睛
            const eye_x = (this.cells[0].x + this.eye_dx[this.eye_direction][i] * 0.15) * L;//获取眼睛圆心的位置
            const eye_y = (this.cells[0].y + this.eye_dy[this.eye_direction][i] * 0.15) * L;//获取眼睛圆心的位置
            ctx.beginPath();
            ctx.arc(eye_x, eye_y, L * 0.05, 0, Math.PI * 2);//填充黑色
            ctx.fill();
        }
    }
}