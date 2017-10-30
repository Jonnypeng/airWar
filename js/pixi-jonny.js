

/* view layer 常规的按钮*/
class button extends PIXI.Sprite{
  constructor(imgID,x,y){
    super();
    this.texture = new PIXI.Texture.fromImage(imgID);
    this.x = x;
    this.y = y;
    this.pivot.x = this.texture.width / 2;
    this.pivot.y = this.texture.height / 2;
    this.interactive = true;
    this.buttonMode = true;
  }
};


/*创建隐藏的图片并且包含位置移动*/
class aniReady extends PIXI.Sprite{
  constructor(imgID,orX,orY,dirX,dirY,alpha){
    super();
    this.texture = new PIXI.Texture.fromImage(imgID);
    this.x = orX;
    this.y = orY;
    this.dx = dirX;
    this.dy = dirY;
    this.alpha = alpha;
  }
};

/* 设置背景的移动方案，上中下进行循环移动，需要添加在Ticker上进行RAF循环*/
function bgRun(obj,dir){
  obj.top.y += dir;
  obj.mid.y += dir;
  obj.bot.y += dir;
  if(obj.bot.y>=obj.limitY){
    obj.bot.y = obj.eHeight*-1;
  }else if(obj.mid.y>=obj.limitY){
    obj.mid.y = obj.eHeight*-1;
  }else if(obj.top.y>=obj.limitY){
    obj.top.y = obj.eHeight*-1;
  };
}


/* 设置背景的移动方案，上中进行循环移动，需要添加在Ticker上进行RAF循环*/
function bg2Run(obj,dir){
  obj.top.y += dir;
  obj.mid.y += dir;
  if(obj.mid.y>=obj.limitY){
    obj.mid.y = obj.eHeight*-1;
  }else if(obj.top.y>=obj.limitY){
    obj.top.y = obj.eHeight*-1;
  };
}


/* 设置元素的移动方案，添加在Ticker上进行RAF循环,定位随机*/
function bg1RunRandom(obj,dir,callback){
  obj.y += dir;
  if(obj.y>=obj.limitY){
    obj.y = Math.random()*1030*-1
  };
}

/*control layer 设置角色不能溢出到屏幕之外*/
function dragOutSide(obj){
  if(obj.x<=0 + obj.width / 2){
    obj.x = 0 + obj.width / 2;
  }else if(obj.x >= 640 - (0 + obj.width / 2)){
    obj.x = 640;
    obj.x = 640 - (0 + obj.width / 2);
  }else if(obj.y <= 0 + obj.height / 2){
    obj.y = 0 + obj.height / 2;
  }else if(obj.y >= 1030 - (0 + obj.height / 2)){
    obj.y = 1030 - (0 + obj.height / 2);
  };
};

/*返回一个对象rect*/
function rectAngle(obj){
    obj.minX = obj.x;
    obj.maxX = obj.x + obj.width;
    obj.minY = obj.y;
    obj.maxY = obj.y + obj.height;
};

/*两个对象的碰撞检测,碰撞检测矩形*/
function toHit(obj1,obj2){
  let hit = false;
  if(obj1.x > obj2.x + obj2.width || obj1.x + obj1.width < obj2.x || obj1.y + obj1.height < obj2.y || obj1.y > obj2.y + obj2.height){
    hit = false;
  }else {
    hit = true;
  }
  return hit;
}

/*两个对象的碰撞检测,自定义对象1的碰撞检测矩形*/
function toCustomHit(obj1,obj2){
  let hit = false;
  if(obj1.dx > obj2.x + obj2.width || obj1.dx + obj1.dwidth < obj2.x || obj1.dy + obj1.dheight < obj2.y || obj1.dy > obj2.y + obj2.height){
    hit = false;
  }else {
    hit = true;
  }
  return hit;
}
