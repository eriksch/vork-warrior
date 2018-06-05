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
    else if (this.shouldBind()) {
      this.warrior.think('Getting out the ropes.');
    }
    else if (this.rescueCaptive()) {
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
          unit && (unit.isHostile() || (unit.isBound() && !unit.isFriendly()))
        );
      })
      .shift();

    if (enemy) {
      const direction = this.warrior.directionOf(enemy);
      this.warrior.think(`walking ${direction} towards enemy.`);
      this.warrior.walk(direction);
    }
  }

  /**
   * Walk to remaining captive
   */
  walkToCaptive() {
    const captive = this.warrior
      .listen()
      .filter(space => {
        const unit = space.getUnit();
        return unit && (unit.isBound() && unit.isFriendly());
      })
      .shift();

    if (captive) {
      const direction = this.warrior.directionOf(captive);
      this.warrior.think(`walking ${direction} towards captive.`);
      this.warrior.walk(direction);
    }
  }

  /**
   * Are there enemies left
   * @returns {boolean|*}
   */
  enemiesLeft() {
    return this.warrior.listen().some(space => {
      const unit = space.getUnit();
      return (
        unit && (unit.isHostile() || (unit.isBound() && !unit.isFriendly()))
      );
    });
  }

  /**
   * Are there any captives left
   * @returns {boolean|*}
   */
  captivesLeft() {
    return this.warrior.listen().some(space => {
      const unit = space.getUnit();
      return unit && unit.isBound() && unit.isFriendly();
    });
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
   *
   */
  shouldBind() {
    const enemy = this.getEnemies().shift();
    if (enemy) {
      this.warrior.bind(enemy.direction);
      return true;
    } else {
      return false;
    }
  }

  /**
   *
   */
  rescueCaptive() {
    const captive = this.getCaptives().shift();
    if (captive) {
      this.warrior.rescue(captive.direction);
      return true;
    } else {
      return false;
    }
  }



  /**
   *
   * @param warrior
   * @returns {Array}
   */
  isAdjacentToEnemy() {
    return DIRECTIONS.some((direction) => {
      const unit = this.warrior.feel(direction).getUnit();
      return unit && unit.isHostile();
    });
  }

  /**
   *
   * @param warrior
   * @returns {Array}
   */
  isAdjacentToBoundEnemy() {
    return DIRECTIONS.some((direction) => {
      const unit = this.warrior.feel(direction).getUnit();
      return unit && unit.isBound() && !unit.isFriendly();
    });
  }

  /**
   *
   */
  getEnemies() {
    return DIRECTIONS.map(direction => {
      return {
        direction,
        unit: this.warrior.feel(direction).getUnit(),
      };
    }).filter(item => item.unit && item.unit.isHostile());
  }

  /**
   *
   */
  getBoundEnemies() {
    return DIRECTIONS.map(direction => {
      return {
        direction,
        unit: this.warrior.feel(direction).getUnit(),
      };
    }).filter(item => item.unit && item.unit.isBound() && !item.unit.isFriendly());
  }

  /**
   * REturn if unit is captive
   * @returns {Array.<*>}
   */
  getCaptives() {
    return DIRECTIONS.map(direction => {
      return {
        direction,
        unit: this.warrior.feel(direction).getUnit(),
      };
    }).filter(item => item.unit && item.unit.isBound() && item.unit.isFriendly());
  }

  /**
   * Attack enemy if present
   * @param warrior
   */
  attackEnemy() {
    const item = this.getEnemies().shift();
    if (item.unit) {
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
    if (item.unit) {
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
    if (!this.isRunningAway && this.wasAttackedLastTurn() && this.warrior.health() <= 13 ) {//&& !this.adjacentToEnemy(this.warrior)) {
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
   * Get direction to run away to
   */
  directionAwayFromHostile() {
    // default direction is forward (0)
    this.unitsInAllDirections().reduce((acc, unit, index) => {
        return unit && unit.isHostile() ? acc + index : acc;
      },
      0);
  }

  /**
   * Warrior is not under attack, has been injured and is not in front of an enemy
   * @returns {boolean|*}
   */
  shouldTakeARest() {
    if (!this.wasAttackedLastTurn() && this.isInjured() && !this.isInRangeOfHostiles()) {
      this.warrior.rest();
      return true;
    }
    return false;
  }

  /**
   * Gets units in all directions
   * @returns {Array}
   */
  unitsInAllDirections() {
    return DIRECTIONS.map(direction => {
      return this.warrior.feel(direction).getUnit();
    });
  }

  /**
   * Check if any of the units in range is hostile
   * @returns {boolean|*}
   */
  isInRangeOfHostiles() {
    return this.unitsInAllDirections().some(unit => unit && unit.isHostile());
  }


  /**
   * Check if warrior has been injured
   * @returns {boolean}
   */
  isInjured() {
    return this.warrior.health() < 20;
  }

  /**
   * Check if a attack has happened since last turn.
   * @returns {boolean}
   */
  wasAttackedLastTurn() {
    return this.warrior.health() < this.health;
  }
}