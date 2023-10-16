import { AcGameObject } from "./AcGameObject";
import { Snake } from "./Snake";
import { Wall } from "./Wall";

export class GameMap extends AcGameObject {
    constructor(ctx/*画布*/, parent/*画布的父元素*/,store) {
        super();

        this.ctx = ctx;
        this.parent = parent;
        this.store = store;
        this.L = 0; //一个单位的长度（绝对距离）

        this.rows = 13;//高13
        this.cols = 14;//宽14
        
        this.inner_walls_count = 20;//地图内部障碍20个
        this.walls = [];

        this.snakes = [
            new Snake({id: 0,color: "#4676EA",r: this.rows - 2,c: 1},this),
            new Snake({id: 1,color: "#F94847",r: 1,c: this.cols - 2},this)
        ];
    }


    create_walls() {//创建墙
        const g = this.store.state.pk.gamemap;
        //遍历布尔数组，创建所有墙的对象
        for (let r = 0; r < this.rows; r ++ ) {
            for (let c = 0; c < this.cols; c ++ ) {
                if (g[r][c]) {
                    this.walls.push(new Wall(r, c, this));
                }
            }
        }
    }


    add_listening_events(){ //监听事件
        this.ctx.canvas.focus();

        const [snake0,snake1] = this.snakes;
        this.ctx.canvas.addEventListener("keydown", e => {

            if (e.key === 'w') snake0.set_direction(0);//上
            else if (e.key === 'd') snake0.set_direction(1);//右
            else if (e.key === 's') snake0.set_direction(2);//下
            else if (e.key === 'a') snake0.set_direction(3);//左

            else if (e.key === 'ArrowUp') snake1.set_direction(0);//上
            else if (e.key === 'ArrowRight') snake1.set_direction(1);//右
            else if (e.key === 'ArrowDown') snake1.set_direction(2);//下
            else if (e.key === 'ArrowLeft') snake1.set_direction(3);//左

        });
    }

    start() {
        this.create_walls();
        this.add_listening_events();
    }

    update_size() { //每一帧都更新一下边长
        this.L = parseInt(Math.min(this.parent.clientWidth/*客户端宽度*/ / this.cols, this.parent.clientHeight/*客户端高度*/ / this.rows));//以最小值作为单位长度
        this.ctx.canvas.width = this.L * this.cols;//游戏地图的宽度=单位长度*列数
        this.ctx.canvas.height = this.L * this.rows;//游戏地图的高度=单位长度*行数
    }

    check_ready(){//判断两条蛇是否  准备好了下一回合
        for(const snake of this.snakes){ //遍历两条蛇
            if (snake.status !== "idle") return false; //静止
            if (snake.direction === -1) return false; //没有指令
        }
        return true;
    }

    next_step(){//让两条蛇进入下一个回合
        for(const snake of this.snakes){//遍历两条蛇
            snake.next_step();//将蛇的状态变为走下一步
        }
    }

    check_valid(cell){//蛇规则
        for (const wall of this.walls){//遍历墙数组
            if (wall.r === cell.r && wall.c === cell.c)//判断蛇头是否与墙重合
                return false;
        }

        for (const snake of this.snakes){//分别查看两条蛇
            let k = snake.cells.length;//获取蛇的长度
            if (!snake.check_tail_increasing()){ //当蛇尾会前进的时候，蛇尾不要判断，如果蛇会增加长度，就要判断蛇尾
                k--;
            }

            for (let i = 0;i < k; i++){//从蛇头遍历蛇的每一格
                if(snake.cells[i].r === cell.r && snake.cells[i].c === cell.c) //判断蛇头是否与蛇身重合
                    return false;
            }
        }

        return true;
    }



    update() {
        this.update_size();//更新边长
        if (this.check_ready()){
            this.next_step();
        }
        this.render();//每帧渲染一次
    }

    render() {//地图画布，渲染函数
        const color_even = "#AAD751", color_odd = "#A2D149";
        for (let r = 0; r < this.rows; r ++ ) {//遍历宽
            for (let c = 0; c < this.cols; c ++ ) {//遍历高
                if ((r + c) % 2 == 0) {//长宽对2求余决定填充什么颜色
                    this.ctx.fillStyle = color_even;//浅色
                } else {
                    this.ctx.fillStyle = color_odd;//深色
                }
                this.ctx.fillRect(c * this.L, r * this.L/*起点*/, this.L, this.L/*终点*/);//画一个色块
            }
        }
    }
}
