window.onload = function() {

	// 1.获取画布  
	var canvas = document.getElementById("canvas");
	// 获取画笔
	var ctx = canvas.getContext("2d");
	// 定义常量
	const START = 0;
	const STARTING = 1;
	const RUNDING = 2;
	const PAUSE = 3;
	const END = 4;
	const WIDTH = 480;
	const HEIGHT = 700;

	var score = 0;
	var life = 3;

	// 开始状态
	var state = START;
	// 创建图片对象
	var bg = new Image();
	bg.src = "img/main/background.png";
	var logo = new Image();
	logo.src = "img/main/logo.png";

	var BG = {
		imgs_bg: bg,
		imgs_logo: logo,
		width: WIDTH,
		height: HEIGHT
	}

	// 自定义构造函数
	function Photo(BG) {
		this.width = BG.width;
		this.height = BG.height;

		this.x1 = 0;
		this.y1 = 0;
		this.x2 = 0;
		this.y2 = -this.height;
		// 绘制图片方法
		this.draw = function() {
			ctx.drawImage(BG.imgs_bg, this.x1, this.y1, BG.width, BG.height);
			ctx.drawImage(BG.imgs_bg, this.x2, this.y2, BG.width, BG.height);
		}
		// 图片运动方法
		this.run = function() {
			this.y1++;
			this.y2++;
			if (this.y1 == this.height) {
				this.y1 = -this.height;
			}
			if (this.y2 == this.height) {
				this.y2 = -this.height;
			}
		}
	}

	// 2.我方飞机出场阶段，游戏过度阶段
	// 点击画布进入到该阶段（游戏开始前）。
	canvas.onclick = function() {
		if (state == START) {
			state = STARTING;
		}
	};
	// 创建出场的图片对象
	// 图片数组
	var loads = [];
	loads[0] = new Image();
	loads[0].src = "img/me/life.png";
	loads[1] = new Image();
	loads[1].src = "img/me/life.png";
	loads[2] = new Image();
	loads[2].src = "img/me/life.png";
	loads[3] = new Image();
	loads[3].src = "img/me/life.png";
	// 图片对象
	var LOADS = {
		imgs : loads,
		length : loads.length,
		width : 46,
		height : 57,
	}
	
	// 自定义动画效果构造函数
	function Load(plane) {
		this.imgs = plane.imgs;
		this.length = plane.length;
		this.width = plane.width;
		this.height = plane.height;
		
		// 定义一个索引值
		this.startIndex = 0;
		// 绘制图片方法
		this.draw_show = function() {
			ctx.drawImage(this.imgs[this.startIndex], 0, HEIGHT - this.height);
		}
		// 初始速度
		this.speed = 0;
		// 图片运动方法
		this.move = function() {
			this.speed++;
			
			if (this.speed % 5 == 0) {
				this.startIndex++;
			}
			if (this.startIndex == this.length) {
				state = RUNDING;
			}
		}
	}
	
	// 实例化出场效果对象
	var show = new Load(LOADS);
	
	
	

	// 3.进入游戏，己方飞机
	var heros = [];
	// 未碰撞
	heros[0] = new Image();
	heros[0].src = "img/me/me1.png";
	heros[1] = new Image();
	heros[1].src = "img/me/me2.png";
	// 发生碰撞
	heros[2] = new Image();
	heros[2].src = "img/me/me_destroy_1.png";
	heros[3] = new Image();
	heros[3].src = "img/me/me_destroy_2.png";
	heros[4] = new Image();
	heros[4].src = "img/me/me_destroy_3.png";
	// 图片对象
	var HEROS = {
		imgs : heros,
		length : heros.length,
		width : 102,
		height : 126,
	}
	// 自定义我方飞机构造函数
	function ME(config) {
		this.imgs = config.imgs;
		this.length = config.length;
		this.width = config.width;
		this.height = config.height;
		// 图片的索引
		this.startIndex = 0;
		// 我方飞机初始坐标
		this.x = WIDTH/2 - this.width/2;
		this.y = HEIGHT - this.height -20;
		// 记录是否发生碰撞,初始值false
		this.carsh = false;
		// 记录飞机碰撞后动画是否执行完成
		this.candel = false;
		// 画飞机
		this.paint = function() {
			// 画出初始位置
			ctx.drawImage(this.imgs[this.startIndex], this.x, this.y);
			// console.log(this.x);
			// console.log(this.y);
		}
		// 运动方法（我方）
		this.step = function() {
			if (this.crash) {
				// 发生碰撞
				this.startIndex++;
				// 判断临界值
				if (this.startIndex == this.length) {
					life--;
					if (life == 0) {
						// 生命值用完，游戏结束，state值变为END
						state = END;
						this.startIndex = this.length - 1;
					} else {
						// 生命值没用完，继续游戏
						hero = new ME(HEROS);
					}
				}	
			} else {
				// 没有发生碰撞 切换索引
				// 改变startIndex 1或者0
				if (this.startIndex == 0) {
					this.startIndex = 1;
				} else{
					this.startIndex = 0;
				}
			}	
		}
		// 我方发生撞击的方法
		this.bang = function() {
			this.crash = true;
		}
		
		// 我方飞机发射子弹方法
		// 速度
		this.time = 0;
		this.shoot = function() {
			this.time++;
			if (this.time % 3 == 0) {
				// 还没写
				bullets.push(new Bullet(BULLETS));
			}
		}	
	}
	// 实例化我方飞机对象
	var hero = new ME(HEROS);
	// 鼠标跟踪事件
	canvas.onmousemove = function(event) {
		// state = RUNDING;
		// 兼容性问题
		event = event || window.event;
		if (state == RUNDING) {
			var x = event.offsetX - hero.width / 2;
			var y = event.offsetY - hero.height / 2;
			// 鼠标坐标赋值给飞机位置
			hero.x = x;
			hero.y = y;	
		}
	}
	// 子弹的绘制
	// 加载子弹图片
	var bullet = new Image();
	bullet.src = "img/bullet/bullet1.png";
	// 初始化子弹的基本信息
	var BULLETS = {
		imgs : bullet,
		width : 9,
		height : 21,
	}
	// 创建子弹构造函数
	function Bullet(config) {
		this.imgs = config.imgs;
		this.width = config.width;
		this.height = config.height;
		// 坐标
		this.x = hero.x + hero.width/2 - this.width/2;
		this.y = hero.y - this.height;
		// 绘制方法
		this.paint = function() {
			ctx.drawImage(this.imgs, this.x, this.y);
		}
		// 运动方法
		this.step = function() {
			this.y -= 20;
		}
		// 是否发生碰撞
		this.candel = false;
		// 碰撞的方法，修改candel为true
		this.bang = function() {
			this.candel = true;
		}	
	}
	
	// 定义一个数组，用于储存子弹
	var bullets = [];
	// 绘制数组中所有的子弹
	function bulletsPaint() {
		for (var i = 0; i < bullets.length; i++) {
			bullets[i].paint();
		}
	}
	// 数组中子弹的运动
	function bulletsStep() {
		for (var i = 0; i < bullets.length; i++) {
			bullets[i].step();
		}
	}
	// 删除溢出画布，或者发生碰撞的子弹
	function bulletsDel() {
		for (var i = 0; i < bullets.length; i++) {
		// 如果子弹小于等于子弹的高度
			if (bullets[i].y < -bullets[i].height || bullets[i].candel) {
				// 删除数组中i位置的元素
				bullets.splice(i, 1);
			}
		}
	}
	// 敌机的绘制
	// 加载地方飞机图片（3种飞机）
	// ①小飞机
	var enemy1 = [];
	enemy1[0] = new Image();
	enemy1[0].src = "img/enemy1/enemy1.png";
	enemy1[1] = new Image();
	enemy1[1].src = "img/enemy1/enemy1_down1.png";
	enemy1[2] = new Image();
	enemy1[2].src = "img/enemy1/enemy1_down2.png";
	enemy1[3] = new Image();
	enemy1[3].src = "img/enemy1/enemy1_down3.png";
	enemy1[3] = new Image();
	enemy1[3].src = "img/enemy1/enemy1_down4.png";
	
	// 初始化敌方飞机数据,小飞机对象
	var ENEMY1 = {
		imgs : enemy1,
		length : enemy1.length,
		width : 57,
		height : 51,
		type : 1, //表示飞机大 中 小
		life : 1, //飞机和子弹碰撞几次才能牺牲
		score : 1, //击落得分
		frame : 1,
	}
	
	// ②中飞机
	var enemy2 = [];
	enemy2[0] = new Image();
	enemy2[0].src = "img/enemy2/enemy2.png";
	enemy2[1] = new Image();
	enemy2[1].src = "img/enemy2/enemy2_down1.png";
	enemy2[2] = new Image();
	enemy2[2].src = "img/enemy2/enemy2_down2.png";
	enemy2[3] = new Image();
	enemy2[3].src = "img/enemy2/enemy2_down3.png";
	enemy2[4] = new Image();
	enemy2[4].src = "img/enemy2/enemy2_down4.png";
	// 初始化敌方飞机数据,中飞机对象	
	var ENEMY2 = {
		imgs : enemy2,
		length : enemy2.length,
		width : 69,
		height : 95,
		type : 2, //表示飞机大 中 小
		life : 5, //飞机和子弹碰撞几次才能牺牲
		score : 5, //击落得分
		frame : 1,
	}
	//大飞机
	// 未发生碰撞
	var enemy3 = [];
	enemy3[0] = new Image();
	enemy3[0].src = "img/enemy3/enemy3_n1.png";
	enemy3[1] = new Image();
	enemy3[1].src = "img/enemy3/enemy3_n2.png";
	// 受到打击
	enemy3[2] = new Image();
	enemy3[2].src = "img/enemy3/enemy3_hit.png";
	// 爆炸
	enemy3[3] = new Image();
	enemy3[3].src = "img/enemy3/enemy3_down1.png";
	enemy3[4] = new Image();
	enemy3[4].src = "img/enemy3/enemy3_down2.png";
	enemy3[5] = new Image();
	enemy3[5].src = "img/enemy3/enemy3_down3.png";
	enemy3[6] = new Image();
	enemy3[6].src = "img/enemy3/enemy3_down4.png";
	enemy3[7] = new Image();
	enemy3[7].src = "img/enemy3/enemy3_down5.png";
	enemy3[8] = new Image();
	enemy3[8].src = "img/enemy3/enemy3_down6.png";
	// 初始化敌方飞机数据,中飞机对象	
	var ENEMY3 = {
		imgs : enemy3,
		length : enemy3.length,
		width : 165,
		height : 261,
		type : 3, //表示飞机大 中 小
		life : 10, //飞机和子弹碰撞几次才能牺牲
		score : 20, //击落得分
		frame : 1,
	}
	
	// 敌机的构造函数
	function Enemy(config) {
		this.imgs = config.imgs;
		this.length = config.length;
		this.width = config.width;
		this.height = config.height;
		this.type = config.type;
		this.life = config.life;
		this.score = config.score;
		this.frame = config.frame;
		// 坐标
		// x坐标随机，最大值不能超过画布的宽度
		this.x = Math.random() * (WIDTH - this.width);
		// 初始化图片在画布外面
		this.y = -this.height;
		// 索引
		this.startIndex = 0;
		// 标识是否发生了碰撞
		this.crash = false;
		// 发生碰撞动画是否完成
		this.candel = false;
		
		// 绘制的方法
		this.paint = function() {
			ctx.drawImage(this.imgs[this.startIndex], this.x, this.y);
		}
		// 运动的方法
		this.step = function() {
			// 涉及大飞机，需要完善 是否碰撞
			this.y++;
			if (this.crash) {
				// 发生了碰撞
				this.startIndex++;
				// 判断临界值
				if (this.startIndex == this.length) {
					this.candel = true; //发生碰撞动画效果加载完成
					this.startIndex = this.length - 1;
				}
			} else{
				// 没有发生碰撞
				// 小飞机，中飞机下标 始终是0
				// 大飞机的下标在0-1之间切换
				this.startIndex++;
				this.startIndex = this.startIndex % this.frame;
				// 飞机向下移动
				this.y++;
			}
		}
		
		// 撞击的方法
		this.bang = function() {
			this.life--;
			// 判断敌机摧毁 我方得分
			if (this.life == 0) {
				this.crash = true;
				score += this.score;
			}
		}
		
		// 判断是否撞击
		// 参数可能是子弹，也可能是我方飞机
		// 子弹左上角的坐标在敌机左上角-敌机右上角的区域且在敌机右上角-右下角区域
		// 或者 子弹右上角的坐标在敌机左上角-敌机右上角区间且在敌机左上-右下区间
		this.checkHit = function(obj) {
			return this.y < obj.y + obj.height &&
					 obj.y < this.y + this.height &&
					 this.x < obj.x + obj.width &&
					 obj.x < this.x + this.width;
		}
	}
	
	// 创建数组，用于储存飞机
	var enemies = [];
	// 往数组中添加飞机
	function pushEnemies() {
		// 随机添加大 中 小飞机到数组中
		var numRand = Math.floor(Math.random() * 100);
		if (numRand < 3) {
			// 随机添加小飞机
			enemies.push(new Enemy(ENEMY1));
		} else if (numRand > 98) {
			// 随机添加中飞机
			enemies.push(new Enemy(ENEMY2));
		} else if (numRand == 50) {
			// 添加大型飞机
			enemies.push(new Enemy(ENEMY3));
		}
	}
	
	// 绘制敌方飞机
	function paintEnemies() {
		for (var i = 0; i < enemies.length; i++) {
			enemies[i].paint();
		}
	}
	// 敌方飞机移动
	function stepEnemies() {
		for (var i = 0; i < enemies.length; i++) {
			enemies[i].step();
		}
	}
	// 删除敌方飞机
	function enemyDel() {
		for (var i = 0; i < enemies.length; i++) {
			if (enemies[i].y > HEIGHT || enemies[i].candel) {
				enemies.splice(i, 1);
			}
		}
	}
	
	// 绘制碰撞后的函数
	function enemiesHit() {
		for (var i = 0; i < enemies.length; i++) {
			// 子弹碰撞敌方飞机 每一颗子弹
			for (var j = 0; j < bullets.length; j++) {
				if (enemies[i].checkHit(bullets[j])) {
					enemies[i].bang();
					bullets[j].bang();
				}
			}
			// 我方飞机碰撞敌方飞机
			if (enemies[i].checkHit(hero)) {
				enemies[i].bang();
				hero.bang();
			}
		}
	}
	
	// 绘制分数和生命值
	function scoreText() {
		ctx.font = "30px bold";
		ctx.fillText("score:" + score, 10, 30);
		ctx.fillText("life:" + life, 350, 30);
	}
	
	// 游戏暂停事件
	canvas.onmouseout = function() {
		if (state == RUNDING) {
			state = PAUSE;
		}
	};
	
	// 绘制游戏继续
	canvas.onmouseover = function() {
		if (state == PAUSE) {
			state = RUNDING;
		}
	}
	
	// 绘制暂停的图片
	var pause = new Image();
	pause.src = "img/main/pause_nor.png";
	
	// 绘制游戏结束
	function end() {
		ctx.font = "50px bold";
		ctx.fillText("GAME OVER！！", 80, 300);
		canvas.onclick = function() {
			location.reload();
		};
	}
	
	// 启动游戏
	var plane = new Photo(BG);
	setInterval(function() {
		plane.draw();
		plane.run();
		switch (state){
			case START:
				ctx.drawImage(logo, 110, 160);
				break;
			case STARTING:
				show.draw_show();
				show.move();
				break;
			case RUNDING:
				// 绘制飞机
				hero.paint();
				// 飞机运动方法
				hero.step();
				//发射子弹
				hero.shoot();
				// 绘制子弹
				bulletsPaint();
				// 子弹运动
				bulletsStep();
				// 删除子弹
				bulletsDel();
				// 添加敌机进数组
				pushEnemies();
				// 绘制地方飞机
				paintEnemies();
				// 敌方飞机移动
				stepEnemies();
				// 判断是否相撞
				enemiesHit();
				// 删除地方飞机
				enemyDel();
				// 绘制分数和生命值
				scoreText();
				break;
			case PAUSE:
				hero.paint();
				bulletsPaint();
				paintEnemies();
				scoreText();
				ctx.drawImage(pause, 200, 300);
				break;
			case END:
				hero.paint();
				bulletsPaint();
				paintEnemies();
				scoreText();
				end();
				break;	
		}
	}, 20);
	
};
