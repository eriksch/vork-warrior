const DIRECTIONS = ['forward', 'right', 'backward', 'left'];


class Brain {
  constructor() {
    this.health = 20;
    this.direction = 'forward';
    this.isRunningAway = false;
  }

  /**
   *
   * @param warrior
   */
  process(warrior) {
    this.warrior = warrior;

    if (this.shouldTakeARest()) {
      this.warrior.think('Taking a rest');
    }
    else if (this.shouldBindEnemy()) {
      this.warrior.think('Getting out the ropes.');
    }
    else if (this.shouldRescueCaptive()) {
      this.warrior.think('cutting the bonds.');
    }
    else if (this.shouldRunAway()) {
      this.warrior.think('I need to run away');
    }
    else if (this.isAdjacentToEnemy()) {
      this.warrior.think('It\'s clobbering time!');
      this.attackEnemy();
    }
    else if (this.isAdjacentToBoundEnemy()) {
      this.warrior.think('It\'s backstabbing time!');
      this.attackBoundEnemy();
    }
    else if (this.enemiesLeft()) {
      this.warrior.think('hunter killer');
      this.walkToEnemy();
    }
    else if (this.captivesLeft()) {
      this.warrior.think('rescue rangers');
      this.walkToCaptive();
    }
    else {
      this.walkToStairs();
    }

    this.storeState();
  }

  /**
   * Store current state
   */
  storeState() {
    this.health = this.warrior.health();
  }

  /**
   * Walk to exit
   */
  walkToStairs() {
    this.direction = this.warrior.directionOfStairs();
    this.warrior.walk(this.direction);
  }

  /**
   * Walk to remaining enemy
   */
  walkToEnemy() {
    const enemy = this.warrior
      .listen()
      .filter(space => {
        const unit = space.getUnit();
        return (
          space.isUnit() && (unit.isEnemy() || (unit.isBound() && unit.isEnemy()))
        );
      })
      .shift();

    if (enemy) {
      const direction = this.warrior.directionOf(enemy);

      // are we walking into stairs then don't
      if (this.warrior.feel(direction).isStairs()) {
        return this.walkToEmptySpace();
      }
      this.warrior.think(`walking ${direction} towards enemy.`);

      this.warrior.walk(direction);
    }

    return true;
  }

  walkToEmptySpace() {
    const direction = DIRECTIONS.find(dir => {
      const space = this.warrior.feel(dir);
      return space.isEmpty() && !space.isStairs();
    });

    if (direction) {
      this.warrior.think(`walking ${direction} towards empty space.`);
      this.warrior.walk(direction);
      return true;
    }
    this.warrior.think(`no empty space ${direction}`);

    return false;
  }

  /**
   * Walk to remaining captive
   */
  walkToCaptive() {
    const captive = this.warrior
      .listen()
      .filter(space => {
        const unit = space.getUnit();
        return space.isUnit() && (unit.isBound() && !unit.isEnemy());
      })
      .shift();

    if (captive) {
      const direction = this.warrior.directionOf(captive);
      this.warrior.think(`walking ${direction} towards captive.`);
      this.warrior.walk(direction);
    }
  }

  /**
   * Return list of all units
   */
  listenForAllUnits() {
    return this.warrior
      .listen()
      .filter(space => space.isUnit())
      .map(space => space.getUnit());
  }

  /**
   * Are there enemies left
   * @returns {boolean|*}
   */
  enemiesLeft() {
    return this.listenForAllUnits().some(unit => unit.isEnemy());
  }

  /**
   * Are there any captives left
   * @returns {boolean|*}
   */
  captivesLeft() {
    return this.listenForAllUnits().some(unit => (unit.isBound() && !unit.isEnemy()));
  }

  /**
   * Change direction
   *
   * @param warrior
   */
  shouldChangeDirection() {
    // hitting a wall we need to turn
    if (this.warrior.feel(this.direction).isWall()) {
      return this.turnLeft();
    }

    return false;
  }

  /**
   * Should i attempt to bind and unbound enemy?
   */
  shouldBindEnemy() {
    const enemy = this.getUnboundEnemies().shift();
    if (enemy && enemy.unit) {
      this.warrior.bind(enemy.direction);
      return true;
    } else {
      return false;
    }
  }

  /**
   *
   */
  shouldRescueCaptive() {
    const captive = this.getCaptives().shift();
    if (captive && captive.unit) {
      this.warrior.rescue(captive.direction);
      return true;
    } else {
      return false;
    }
  }

  /**
   * Standing next to unbound enemy?
   * @returns {boolean}
   */
  isAdjacentToEnemy() {
    return this.getUnboundEnemies().length > 0;
  }

  /**
   * Standing next to bound enemy?
   * @returns {boolean}
   */
  isAdjacentToBoundEnemy() {
    return this.getBoundEnemies().length > 0;
  }

  /**
   * Gets units in all four directions
   * @returns {Array}
   */
  getUnits() {
    return DIRECTIONS.map(direction => {
      return {
        direction,
        unit: this.warrior.feel(direction).getUnit(),
      };
    });
  }

  /**
   * Return all enemies
   * @returns {Array.<*>}
   */
  getEnemies() {
    return this.getUnits()
      .filter(item => item.unit && item.unit.isEnemy());
  }

  /**
   * Return any bound enemies
   * @returns {Array.<*>}
   */
  getBoundEnemies() {
    return this.getUnits()
      .filter(item => item.unit && item.unit.isBound() && item.unit.isEnemy());
  }

  /**
   * Return any unbound enemies
   * @returns {Array.<*>}
   */
  getUnboundEnemies() {
    return this.getUnits()
      .filter(item => item.unit && !item.unit.isBound() && item.unit.isEnemy());
  }

  /**
   * Return if unit is captive
   * @returns {Array.<*>}
   */
  getCaptives() {
    return this.getUnits()
      .filter(item => item.unit && item.unit.isBound() && !item.unit.isEnemy());
  }

  /**
   * Attack enemy if present
   * @param warrior
   */
  attackEnemy() {
    const item = this.getEnemies().shift();
    if (item && item.unit) {
      this.warrior.attack(item.direction);
      return true;
    }
    return false;
  }

  /**
   * Attack enemy if present
   * @param warrior
   */
  attackBoundEnemy() {
    const item = this.getBoundEnemies().shift();
    if (item && item.unit) {
      this.warrior.attack(item.direction);
      return true;
    }
    return false;
  }

  /**
   * Always turn left
   */
  turnLeft() {
    switch(this.direction) {
      case 'backward':
        this.direction = 'left';
        break;
      case 'left':
        this.direction = 'forward';
        break;
      case 'forward':
        this.direction = 'right';
        break;
      case 'right':
        this.direction = 'backward';
        break;
    }

    // pivot to this direction
    // this.warrior.pivot(this.direction);

    return true;
  }

  /**
   * Run forest Run
   */
  reverseDirection() {
    switch(this.direction) {
      case 'backward':
        this.direction = 'forward';
        break;
      case 'left':
        this.direction = 'right';
        break;
      case 'forward':
        this.direction = 'backward';
        break;
      case 'right':
        this.direction = 'left';
    }

    return true;
  }

  /**
   * I was attacked but no enemy was near
   * start moving in the opposite direction
   * @param warrior
   */
  shouldRunAway() {
    if (!this.isRunningAway && this.wasAttackedLastTurn() && this.warrior.health() <= 13 ) {
      this.reverseDirection();
      this.isRunningAway = true;
      this.warrior.walk(this.direction);
      return true;
    }
    // We can stop running and turn the opposite way again
    else if (this.isRunningAway && !this.wasAttackedLastTurn()) {
      this.reverseDirection();
      this.isRunningAway = false;
      return true;
    }
    return false;
  }

  /**
   * Warrior is not under attack, has been injured and is not in front of an enemy
   * @returns {boolean|*}
   */
  shouldTakeARest() {
    if (
      this.needsHealing() &&
      !this.wasAttackedLastTurn() &&
      !this.isInRangeOfHostiles()
    ) {
      this.warrior.rest();
      return true;
    }
    return false;
  }

  /**
   * Check if any of the units in range is hostile
   * @returns {boolean|*}
   */
  isInRangeOfHostiles() {
    return this.getUnboundEnemies().length > 0;
  }

  /**
   * Check if warrior has been injured
   * @returns {boolean}
   */
  isInjured() {
    return this.warrior.health() < 20;
  }

  /**
   * Check if we need healing
   * @returns {boolean}
   */
  needsHealing() {
    return this.warrior.health() < 10;
  }

  /**
   * Check if a attack has happened since last turn.
   * @returns {boolean}
   */
  wasAttackedLastTurn() {
    return this.warrior.health() < this.health;
  }
}

class Player {

  constructor() {
    this.brain = new Brain();
  }

  playTurn(warrior) {
    this.brain.process(warrior);
  }
}