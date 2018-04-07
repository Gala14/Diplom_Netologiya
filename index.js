'use strict';
class Vector {
	constructor(x=0, y=0) {
		this.x = x;
		this.y = y;
	}
	plus(vector) {
		if (!(vector instanceof Vector)) {
			throw new Error('Можно прибавлять к вектору только вектор типа Vector');
		}

		return new Vector(this.x + vector.x, this.y + vector.y);
	}

	times(num) {
		return new Vector(this.x * num, this.y * num);
	}
}

const start = new Vector(30, 50);
const moveTo = new Vector(5, 10);
const finish = start.plus(moveTo.times(2));

console.log(`Исходное расположение: ${start.x}:${start.y}`);
console.log(`Текущее расположение: ${finish.x}:${finish.y}`);

class Actor {
	constructor(
		position = new Vector(0, 0),
		size = new Vector(1, 1),
		speed = new Vector(0, 0)
	) {
		if (
			!(position instanceof Vector) ||
			!(size instanceof Vector) ||
			!(speed instanceof Vector)
		) {
			throw new Error();
		}

		this.pos = position;
		this.size = size;
		this.speed = speed;
	}
	get left() {
		return this.pos.x;
	}
	get top() {
		return this.pos.y;
	}
	get right() {
		return this.pos.x + this.size.x;
	}
	get bottom() {
		return this.pos.y + this.size.y;
	}
  
	get type() {
		return 'actor';
	}

  act() {
    
  }
	isIntersect(actor) {
		if (!(actor instanceof Actor) || actor === undefined) {
			throw new Error();
		}
		if (
			actor === this ||
			actor.bottom <= this.top ||
			actor.left >= this.right ||
			actor.top >= this.bottom ||
			actor.right <= this.left
		) {
			return false;
		}
		return true;
	}
}

/*const items = new Map();
const player = new Actor();
items.set('Игрок', player);
items.set('Первая монета', new Actor(new Vector(10, 10)));
items.set('Вторая монета', new Actor(new Vector(15, 5)));

function position(item) {
  return ['left', 'top', 'right', 'bottom']
    .map(side => `${side}: ${item[side]}`)
    .join(', ');  
}

function movePlayer(x, y) {
  player.position = player.position.plus(new Vector(x, y));
}

function status(item, title) {
  console.log(`${title}: ${position(item)}`);
  if (player.isIntersect(item)) {
    console.log(`Игрок подобрал ${title}`);
  }
}

items.forEach(status);
movePlayer(10, 10);
items.forEach(status);
movePlayer(5, -5);
items.forEach(status);*/

class Level {
	constructor(grid = [], actors = []) {
		this.grid = grid;
		this.actors = actors;
		this.player = this.actors.find(function(x) {
			return x.type === 'player';
		});
		this.height = this.grid.length;
		this.width = Math.max(0, ...this.grid.map(x => x.length));
		this.status = null;
		this.finishDelay = 1;
	}
	isFinished() {
		if (this.status !== null && this.finishDelay < 0) {
			return true;
		}return false;
	}
	actorAt(actor) {
		if (!(actor instanceof Actor) || actor === undefined) {
			throw new Error();
		}
		/*this.actors.forEach(function(actor, i, actors) {
			if (this.actors(i).isIntersect(actor)) {
				return this.actors(i);
			}*/
			return this.actors.find(function(x) { return x.isIntersect(actor)});
	}
	obstacleAt(position, size) {
		if (!(position instanceof Vector) || !(size instanceof Vector)) {
			return new Error();
		}
		
		let actor = new Actor(position, size);
		if (actor.bottom > this.height) {
			return 'lava';
		}
		console.log(actor, ",", actor.left+",", actor.top+",", actor.right+",", this.width);
		
		
		if (actor.left < 0 || actor.top < 0 || actor.right > this.width) {
      return 'wall';
		}
		for (let x = Math.floor(actor.left); x < actor.right; x++) {
			for (let y = Math.floor(actor.top); y < actor.bottom; y++) {
				if (this.grid[y][x] !== undefined) {
					return this.grid[y][x];
				}
			}
		}
		return undefined;
	}
	removeActor(actor) {
		let index = this.actors.findIndex(x => x === actor);
		if (index !== -1) {
			this.actors.splice(index, 1);
		}
	}
	noMoreActors(type) {
		return this.actors.every(x => x.type !== type);
	}
	playerTouched(type, actor) {
        if (this.status !== null) {
            return;
        }

        if (type === 'lava' || type === 'fireball') {
            this.status = 'lost';
            return;
        }

        if (type === 'coin' && actor !== undefined && actor.type === 'coin') {
            this.removeActor(actor);
            if (this.noMoreActors('coin')) {
                this.status = 'won';
            }
		}
	  
	}
}

/*const grid = [
  [undefined, undefined],
  ['wall', 'wall']
];

function MyCoin(title) {
  this.type = 'coin';
  this.title = title;
}
MyCoin.prototype = Object.create(Actor);
MyCoin.constructor = MyCoin;

const goldCoin = new MyCoin('Золото');
const bronzeCoin = new MyCoin('Бронза');
const player = new Actor();
const fireball = new Actor();

const level = new Level(grid, [ goldCoin, bronzeCoin, player, fireball ]);

level.playerTouched('coin', goldCoin);
level.playerTouched('coin', bronzeCoin);

if (level.noMoreActors('coin')) {
  console.log('Все монеты собраны');
  console.log(`Статус игры: ${level.status}`);
}

const obstacle = level.obstacleAt(new Vector(1, 1), player.size);
if (obstacle) {
  console.log(`На пути препятствие: ${obstacle}`);
}

const otherActor = level.actorAt(player);
if (otherActor === fireball) {
  console.log('Пользователь столкнулся с шаровой молнией');
}*/

class LevelParser {
	constructor(diction) {
  	if (diction===undefined) {
  	  this.diction=[];
  	}else {
  	  this.diction = diction;
  	}
	}
	actorFromSymbol(char) {
	 
		if (char !== undefined) {
			return this.diction[char];
		}
		return undefined;
	}
	obstacleFromSymbol(char) {
		switch (char) {
			case 'x':
				return 'wall';
			case '!':
				return 'lava';
			default:
				return undefined;
		}
	}
	createGrid(strings) {
		let grid = []; // массив, который надо создать
		for (let i = 0; i< strings.length; i++) {
		  let cells = [];
		  for (let y = 0; y< strings[i].length; y++) {
		    cells.push(this.obstacleFromSymbol(strings[i].charAt(y)));
		  }
		  grid.push(cells);
		}
		return grid;
	}

	/*createActors(strings) {
		let actors = [];
		for (let i = 0; i < strings.length; i++) {
			for (let j = 0; j < strings[i].length; j++) {
			  if(strings[i][j]==='@' || strings[i][j]==='o' || strings[i][j]==='=' || strings[i][j]==='|' || strings[i][j]==='v') {
				let actor = this.actorFromSymbol(strings[i].charAt(j)); //получаем конструктор объекта по символу
				if (actor!==undefined && typeof actor === 'function') {
				let item = new Actor(new Vector(i, j)); // создаем новый движущийся объект с вектором
				if (item instanceof Actor) {
					actors.push(item);
				}}
			}}
		}
		return actors;
	}*/
  createActors(strs) {
    let actors = [];
    for (let i = 0; i < strs.length; i++) {
        for (let j = 0; j < strs[i].length; j++) {
          console.log(this.actorFromSymbol(strs[i].charAt(j)));
            let actor = this.actorFromSymbol(strs[i].charAt(j));
            if (actor !== undefined && typeof actor === 'function') {
                let inst = new actor(new Vector(j, i));
                if (inst instanceof Actor) {
                    actors.push(inst);
                }
            }
        }
    }
    return actors;
  }

	parse(strings) {
		return new Level(this.createGrid(strings), this.createActors(strings));
	}

}

/*const plan = [
  ' @ ',
  'x!x'
];

const actorsDict = Object.create(null);
actorsDict['@'] = Actor;

const parser = new LevelParser(actorsDict);
const level = parser.parse(plan);

level.grid.forEach((line, y) => {
  line.forEach((cell, x) => console.log(`(${x}:${y}) ${cell}`));
});

level.actors.forEach(actor => console.log(`(${actor.pos.x}:${actor.pos.y}) ${actor.type}`));*/

class Fireball extends Actor {
  constructor (pos = new Vector(0,0), speed = new Vector (0,0)) 
    {
        super(pos, new Vector (1,1), speed);
    }

    get type() {
        return 'fireball';
    }
    
  getNextPosition(time = 1) {
        return this.pos.plus(this.speed.times(time));
    }
  handleObstacle() {
    this.speed = this.speed.times(-1);
  }
    
  act(time, level){
    let newPosition = this.getNextPosition(time);
    if(level.obstacleAt(newPosition, this.size)) {
      this.handleObstacle();
    }else {
      this.pos = newPosition;
    }
  }
}

class HorizontalFireball extends Fireball {
  constructor(pos) {
    super (pos, new Vector(2,0));
  }
}

class VerticalFireball extends Fireball {
  constructor(pos) {
    super (pos, new Vector(0,2));
  }
}
class FireRain extends Fireball {
  constructor(pos) {
    super (pos, new Vector(0, 3));
    this.beginPos = pos;
  }
 handleObstacle() {
   this.pos = this.beginPos;
}
}

class Coin extends Actor {
  constructor(pos = new Vector(0,0)) {
    super (pos.plus(new Vector(0.2,0.1)), new Vector(0.6,0.6));
   this.posStart = this.pos;
  this.springSpeed = 8;
  this.springDist = 0.07;
  this.spring = Math.random()*(2*Math.PI);
}
    
    get type() {
        return 'coin';
    }
 
updateSpring(time=1) {
    this.spring = this.spring+this.springSpeed*time;
}
getSpringVector() {
  return new Vector(0, Math.sin(this.spring)*this.springDist);
}
getNextPosition(time = 1) {
  this.updateSpring(time);
  return this.posStart.plus(this.getSpringVector());
}
act(time) {
  this.pos = this.getNextPosition(time);
}
}  
class Player extends Actor {
  constructor (pos = new Vector(0,0)) {
     super (pos.plus(new Vector(0,-0.5)), new Vector(0.8,1.5), new Vector (0,0));
   this.posStart = this.pos;
  }
  get type() {
        return 'player';
    }
}
  

