const DIRECTIONS = ['forward', 'right', 'backward', 'left'];

class Player {

  constructor() {
    this.brain = new Brain();
  }

  playTurn(warrior) {
    this.brain.process(warrior);
  }
}

class Brain {
  constructor() {
    this.health = 20;
    this.direction = 'forward';
  }

  process(warrior) {
    this.warrior = warrior;

    if (false) {

    }

    else {
      this.walkToStairs();
    }

    this.storeState();

  }

  storeState() {
    //this.health = this.warrior.health();
  }

  walkToStairs() {
    this.warrior.walk(this.warrior.directionOfStairs());
  }
}