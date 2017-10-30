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

  var bg,plane,zidan;
  var waixings,waixin_fps;
  var plane,plane_fps,planeBomb_fps;
  var paopaos;
  var zidanInterval;
  var scoreConatiner,fenshu_fps,text,scoreView;
  var score = 0;

  var game = {
    'init':function (){
      var loader = new PIXI.loaders.Loader();
      loader.add(['images/cover.png','images/end.png','images/paper_1.jpg','images/paper_2.jpg','images/return.png','images/zidan.json','images/fenshu.json','images/plane.json','images/waixin_01.png','images/waixin_02.png','images/waixin_03.png','images/shitou.jpeg']);
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

        fenshu_fps = [];
        for(let i = 0;i< 11;i++){
          i = (i < 10) ? '0' + i : i ;
          fenshu_fps.push(PIXI.Texture.fromFrame('fenshu00' + i));
        }

        waixin_fps = [
          PIXI.Texture.fromImage('images/waixin_01.png'),
          PIXI.Texture.fromImage('images/waixin_02.png')
        ];

        plane_fps = [];       //飞机飞行
        for(let i = 0;i < 3;i ++){
          plane_fps.push(PIXI.Texture.fromFrame('plane000' + i));
        };

        var zidan_fps = [];
        for(let i = 0;i < 10;i++){
          zidan_fps.push(PIXI.Texture.fromFrame('zidan000' + i));
        };

        for(let i = 0;i<6;i++){
          let sprite = new PIXI.extras.AnimatedSprite(waixin_fps);
          sprite.width = 125;
          sprite.hit = false;
          sprite.x = i*128;
          sprite.y =  Math.random()*1030*-1;
          sprite.limitY = 1030;
          sprite.eHeight = 195;
          sprite.animationSpeed = 0.1;
          sprite.play();
          waixings.addChild(sprite);
        }

        scoreContainer = new PIXI.particles.ParticleContainer();

        plane = new PIXI.extras.AnimatedSprite(plane_fps);
        plane.animationSpeed = 0.1;
        plane.play();
        plane.position.x = app.screen.width/2 - plane.width/2;
        plane.position.y = app.screen.height - plane.height - 10;
        plane.dx = plane.x + 28.5;
        plane.dy = plane.y;
        plane.dwidth = 23;
        plane.dheight = 83;

          zidan = new PIXI.extras.AnimatedSprite(zidan_fps);
          zidan.play();
          zidan.animationSpeed = 0.2;
          zidan.anchor.set(0.5);
          zidan.position = new PIXI.Point(plane.x + plane.width*0.5 - 5 ,plane.y + 50);
          zidan.alpha = 0;

        var speed = 1;

        for(let i = 0;i<5;i++){
          let paopao = new PIXI.Sprite();
          paopao.texture = new PIXI.Texture.fromImage('images/shitou.jpeg');
          paopao.position = new PIXI.Point(Math.random()*540,Math.random()*800);
          paopao.angle = Math.random()*360;
          paopao.radians = (Math.PI/180)*paopao.angle;
          paopao.nextX = Math.cos(paopao.radians) * speed;
          paopao.nextY = Math.sin(paopao.radians) * speed;
          paopaos.addChild(paopao);
        };


        //angleUpdate();
        function angleUpdate(obj){
          obj.radians = (Math.PI/180)*obj.angle;
          obj.nextX = Math.cos(obj.radians) * speed;
          obj.nextY = Math.sin(obj.radians) * speed;
        };

        function paoMove(obj){
          if(obj.x > 580 || obj.x < 0){
            obj.angle = 180 - obj.angle;
            angleUpdate(obj);
          }else if(obj.y > 1080){
            obj.y = -60;
          }else if(obj.y < -60){
            obj.y = 1030;
          };
          obj.x += obj.nextX;
          obj.y += obj.nextY;
        };

        app.stage.addChild(bg,waixings,plane,zidan,paopaos,scoreContainer);

      zidanInterval = setInterval(game.zidan,700);

      app.ticker.add(update);

      function update(){
        bg2Run(bg,4);  //背景移动的速度是4像素
        for(let i in waixings.children){
          bg1RunRandom(waixings.children[i],4);
        };


        for(let index in waixings.children){
            //rectAngle(waixings.children[index]);
            //rectAngle(zidan);
            let zidanHit = toHit(zidan,waixings.children[index]);
            let dieHit = toCustomHit(plane,waixings.children[index]);
            if(dieHit){
                  game.gameover();
            };
            if(zidanHit){
              if(waixings.children[index].hit == false){
              game.fenshu();
              waixings.children[index].hit == true;
              }
              zidan.y = -100;
              waixings.children[index].y = 1040;
            }
        };


        for(let j in paopaos.children){
          paoMove(paopaos.children[j]);
          //rectAngle(paopaos.children[j]);
          //rectAngle(plane);
          let dieHit = toCustomHit(plane,paopaos.children[j]);
          if(dieHit){
                game.gameover();
          }
        };

      };
      game.control(plane);
    },
    'zidan':function (delta){

      var origin = new PIXI.Point(plane.x + plane.width*0.5 - 5,plane.y);

      zidan.points = [
        origin,
        new PIXI.Point(origin.x,-100),
        new PIXI.Point(origin.x,-100),
      ];

      new TweenMax(zidan,0.5,{
        'bezier':{
          'type':'quadratic',
          'values':zidan.points
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
          this.dx = plane.x + 28.5;
          this.dy = plane.y;
        };
      };

      function dragEnd(){
        this.dragging = false;
      };
    },
    'fenshu':function (){
      score++;
      var scoreArr = String(score);
      scoreContainer.removeChildren(0,scoreContainer.children.length)
      for(let i in scoreArr){
        let index = scoreArr[i];
        text = new PIXI.Sprite(fenshu_fps[10]);
        scoreView = new PIXI.Sprite(fenshu_fps[index]);
        text.x = 0;
        scoreView.x = (i * 30) + 150;
        scoreContainer.addChild(text,scoreView);
      }
    },
    'gameover':function (){
      app.ticker.stop();
      clearInterval(zidanInterval);
      app.stage.removeChild(paopaos,waixings,zidan,plane);
      scoreContainer.pivot.x = scoreContainer.width * 0.5;
      scoreContainer.pivot.y = scoreContainer.height * 0.5;
      //scoreContainer.scale.x = 2;
      //scoreContainer.scale.y = 2;
      //scoreContainer.x = app.stage.width*0.5 - scoreContainer.width*0.5;
      //scoreContainer.y = app.stage.height*0.5 - scoreContainer.height*0.5;
      scoreContainer.x = 320;
      scoreContainer.y = 1030*0.5;
      var returnPng = new PIXI.Sprite.fromImage("images/return.png");
      returnPng.anchor.set(0.5);
      returnPng.scale.set(0.5);
      returnPng.x = app.screen.width / 2;
      returnPng.y = app.screen.height / 2 + 200;
      returnPng.blendMode = PIXI.BLEND_MODES.MULTIPLY;
      app.stage.addChild(returnPng);

      returnPng.interactive = true;
      returnPng.on('pointertap',function (){
        location.reload();  
      });
    }
  };
  game.init();
};
