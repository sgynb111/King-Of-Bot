const AC_GAME_OBJECTS = [];//存储所有游戏对象，为了能每帧都显示出来

export class AcGameObject {
    constructor() {
        AC_GAME_OBJECTS.push(this);//在对象数组里面加入当前的对象
        this.timedelta = 0;//这一帧执行的时刻距离上一阵执行的时刻的时间间隔
        this.has_called_start = false; //还没有启动
    }

    start() {  // 创建的时候只执行一次
    }

    update() {  /* 每一帧执行一次，除了第一帧之外 */

    }

    on_destroy() {  // 删除之前执行

    }

    destroy() {
        this.on_destroy();

        for (let i in AC_GAME_OBJECTS) {//遍历对象
            const obj = AC_GAME_OBJECTS[i];//获取遍历到的对象
            if (obj === this) {//当前对象与获取到的对象相等
                AC_GAME_OBJECTS.splice(i);//删除这个对象
                break;
            }
        }
    }
}

let last_timestamp;  // 上一次执行的时刻
const step = timestamp/*当前函数执行的时刻*/ => {
    for (let obj of AC_GAME_OBJECTS) {//遍历所有对象
        if (!obj.has_called_start) {//遍历到的对象如果没有执行start函数
            obj.has_called_start = true;//设为已经启动过
            obj.start();//执行启动函数
        } else {
            obj.timedelta = timestamp - last_timestamp;//已经启动过了
            obj.update();//执行更新函数
        }
    }

    last_timestamp = timestamp;//将上次执行的时刻设为当前执行的时刻
    requestAnimationFrame(step) //调用自己，使得每帧都执行一遍
}

requestAnimationFrame(step)//可以传一个回调函数，这个函数会在下一帧浏览器渲染之前执行一遍
