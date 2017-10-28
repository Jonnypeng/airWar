function init(){
  var app = new PIXI.Application(640,1030);
  var box = document.getElementById('box');
  var preload = document.getElementById("preload");

  box.appendChild(app.view);
  $('#box').css({
    'position':'absolute',
    'width':'100%',
    'height':'100%',
    'top':'0px',
    'left':'0px'
  });

  $('canvas').css({
    'position':'absolute',
    'width':'100%',
    'height':'100%',
    'top':'0px',
    'left':'0px',
  });

  var bg,plane,zidans;
  var waixings;
  var paopaos;
  var score = 0;

  var game = {
    'init':function (){
      var loader = new PIXI.loaders.Loader();
      loader.add(['images/cover.png','images/end.png','images/paper_1.jpg','images/paper_2.jpg','images/return.png','images/zidan.json','images/fenshu.json','images/plane.json','images/waixin_01.png','images/waixin_02.png','images/waixin_03.png','images/paopao.png']);
      loader.on('progress',function (load,res){
        console.log(load.progress);
        $("#num").html(Math.floor(load.progress) + '%');
      })
      loader.load(game.cover)
    },
    'cover':function (){
      console.clear();
      preload.style.display = 'none';

      var cover = new PIXI.Sprite.fromImage('images/cover.png');
      app.stage.addChild(cover);
      cover.interactive = true;
      cover.on('pointertap',function (){
        cover.destroy();
        game.war();
      });
    },
    'war':function (){

      zidans = [];

      function set (){
        bg = new PIXI.Container();
        bg.top = new PIXI.Sprite.fromImage('images/paper_1.jpg');
        bg.mid = new PIXI.Sprite.fromImage('images/paper_2.jpg');
        bg.top.y = - 1024;
        bg.mid.y = 0;
        bg.limitY = 1024;
        bg.eHeight = 1024;
        bg.addChild(bg.top,bg.mid);

        waixings = new PIXI.particles.ParticleContainer();
        paopaos =  new PIXI.particles.ParticleContainer();


        var waixin_fps = [
          PIXI.Texture.fromImage('images/waixin_01.png'),
          PIXI.Texture.fromImage('images/waixin_02.png'),
          PIXI.Texture.fromImage('images/waixin_03.png')
        ];

        var plane_fps = [];       //飞机飞行
        for(let i = 0;i < 3;i ++){
          plane_fps.push(PIXI.Texture.fromFrame('plane000' + i));
        };

        var planeBomb_fps = [];    //飞机爆炸
        for(let i = 4;i < 8;i ++){
          planeBomb_fps.push(PIXI.Texture.fromFrame('plane000' + i));
        };

        var zidan_fps = [];
        for(let i = 0;i < 10;i++){
          zidan_fps.push(PIXI.Texture.fromFrame('zidan000' + i));
        };

        for(let i = 0;i<6;i++){
          let sprite = new PIXI.extras.AnimatedSprite(waixin_fps);
          sprite.width = 125;
          sprite.x = i*128;
          sprite.y =  Math.random()*1030*-1;
          sprite.limitY = 1030;
          sprite.eHeight = 195;
          sprite.animationSpeed = 0.1;
          sprite.play();
          waixings.addChild(sprite);
        }

        plane = new PIXI.extras.AnimatedSprite(plane_fps);
        plane.animationSpeed = 0.1;
        plane.play();
        plane.position.x = app.screen.width/2 - plane.width/2;
        plane.position.y = app.screen.height - plane.height - 10;

        for(let i = 0;i < 3;i++){
          zidans.push(new PIXI.extras.AnimatedSprite(zidan_fps));
          zidans[i].play();
          zidans[i].animationSpeed = 0.2;
          zidans[i].anchor.set(0.5);
          zidans[i].position = new PIXI.Point(plane.x + plane.width*0.5 - 5 ,plane.y + 50);
          zidans[i].alpha = 0;
        }

        for(let i = 0;i<15;i++){
          let paopao = new PIXI.Sprite();
          paopao.texture = new PIXI.Texture.fromImage('images/paopao.png');
          paopao.position = new PIXI.Point(Math.random()*540,Math.random()*800);
          paopao.angle = Math.random()*60;
          paopao.radians = (Math.PI/180)*paopao.angle;
          paopao.speed = 2;
          paopao.nextX = Math.cos(paopao.radians) * paopao.speed;
          paopao.nextY = Math.sin(paopao.radians) * paopao.speed;
          paopaos.addChild(paopao);
        };


        //angleUpdate();
        function angleUpdate(obj){
          obj.radians = (Math.PI/180)*obj.angle;
          obj.nextX = Math.cos(obj.radians) * obj.speed;
          obj.nextY = Math.sin(obj.radians) * obj.speed;
        };

        function paoMove(obj){
          if(obj.x > 580 || obj.x < 0){
            obj.angle = 180 - obj.angle;
            angleUpdate(obj);
          }else if(obj.y > 1030){
            obj.y = 0;
          }else if(obj.y < 0){
            obj.y = 980;
          };
          obj.x += obj.nextX;
          obj.y += obj.nextY;
        };

        app.stage.addChild(bg,waixings,plane,zidans[0],zidans[1],zidans[2],paopaos);

      setInterval(game.zidan,1000);

      app.ticker.add(update);
      function update(){
        bg2Run(bg,4);  //背景移动的速度是4像素
        for(let i in waixings.children){
          bg1RunRandom(waixings.children[i],4);
        };

        for(let index in waixings.children){
          for(let num in zidans){
            rectAngle(waixings.children[index]);
            rectAngle(zidans[num]);
            let hit = toHit(zidans[num],waixings.children[index]);
            if(hit){
              zidans[num].y = -100;
              waixings.children[index].y = 1040;
            }
          };
        };

        for(let j in paopaos.children){
          paoMove(paopaos.children[j]);
        };

      };
      game.control(plane);
    };
      set();
    },
    'zidan':function (delta){

      var origin = new PIXI.Point(plane.x + plane.width*0.5 - 5,plane.y);

      zidans[0].points = [
        origin,
        new PIXI.Point(origin.x - 100,-100),
        new PIXI.Point(plane.x - 100,-100)
      ];

      zidans[1].points = [
        origin,
        new PIXI.Point(origin.x,-100),
        new PIXI.Point(origin.x,-100),
      ];

      zidans[2].points = [
        origin,
        new PIXI.Point(origin.x + 100,-100),
        new PIXI.Point(origin.x + 100,-100)
      ];

      new TweenMax(zidans[0],0.5,{
        'bezier':{
          'type':'quadratic',
          'values':zidans[0].points
        },
        alpha:1
      });
      new TweenMax(zidans[1],0.5,{
        'bezier':{
          'type':'quadratic',
          'values':zidans[1].points
        },
        alpha:1
      });
      new TweenMax(zidans[2],0.5,{
        'bezier':{
          'type':'quadratic',
          'values':zidans[2].points
        },
        alpha:1
      });
    },
    'control':function (plane){
      plane.interactive = true;

      plane.on('pointerdown',dragStart)
      .on('pointermove',dragMove)
      .on('pointerup',dragEnd)

      function dragStart(event){
        this.dragging = true;
      };

      function dragMove(event){
        if(this.dragging){
          this.position.x = event.data.global.x - this.width/2;
          this.position.y = event.data.global.y - this.height/2;
        };
      };

      function dragEnd(){
        this.dragging = false;
      };
    }
  };
  game.init();
};
