
const DIRECTIONS = ['forward', 'right', 'backward', 'left'];

class Brain {
  constructor() {
    this.health = 20;
    this.isRunningAway = false;
    this.direction = 'forward';
    this.target = null;
  }

  think(warrior) {

    this.warrior = warrior;

    // Look at your surroundings
    this.lookAtSurroundings();

    this.checkForRangedThreats();

    // test if we should change our direction
    if (this.shouldChangeDirection()) {
      
    }
    
    // Check if we need to evade ranged attacks until healed
    else if (this.shouldEvadeAttack()) {

    }

    // should warrior take a rest
    else if (this.shouldTakeARest()) {

    }

    // check for anamy at range and attack
    else if (this.checkForEnemyAtRangeAndAttack()) {

    }

    // rescue captives
    else if (this.rescueCaptive()) {

    }

    // attack nearby enemies
    else if (this.attackEnemy()) {

    }

    // find your exit
    else {
      this.moveToStairs()
    }

    this.storeState();

  }

  /**
   * Look and record your surroundings
   */
  lookAtSurroundings() {

  }

  /**
   * Check for friendly Units in the line of fire
   * @returns {boolean}
   */
  hasFriendlyInLineOfFire() {

    const friendly = this.warrior.look(this.direction).find(space => space.isCaptive());
    const friendlyPos = this.warrior.look(this.direction).findIndex(space => space.isCaptive());

    const enemy = this.warrior.look(this.direction).find(space => space.isEnemy());
    const enemyPos = this.warrior.look(this.direction).findIndex(space => space.isEnemy());

    //this.warrior.think(`I looked ${this.direction} and found ${enemy} and ${friendly} at ${enemyPos} and ${friendlyPos}`);

    // if we have a friend in the line of fire
    if (friendly && enemy && friendlyPos < enemyPos) return true;

    return false;
  }

  /**
   *
   */
  checkForEnemyAtRangeAndAttack() {

    if (this.hasFriendlyInLineOfFire()) return false;

    // get remaining enemy
    const enemy = this.warrior.look(this.direction).find((space) => space.isEnemy());

    if (enemy) {
      this.warrior.shoot(this.direction);
      return true;
    }
    return false;
  }

  /**
   * Store turn state
   * @param warrior
   */
  storeState() {
    this.health = this.warrior.health();
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
    this.warrior.pivot(this.direction);
    
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
   * Find your exit
   *
   * @param warrior
   */
  moveToStairs() {
    this.warrior.walk(this.direction);

    return true;
  }

  /**
   * Attack enemy if present
   * @param warrior
   */
  attackEnemy() {
    if (this.warrior.feel(this.direction).isEnemy()) {
      this.warrior.attack(this.direction);
      return true;
    }
    return false;
  }

  /**
   * Rescue a captive
   * @param warrior
   */
  rescueCaptive() {
    if (this.warrior.feel(this.direction).isCaptive()) {
      this.warrior.rescue(this.direction);
      return true;
    }
    return false;
  }

  /**
   * Check
   *
   * {
   *  "character": "S",
   *  "stairs": false,
   *  "unit": {
   *    "name": "Thick Sludge",
   *    "character": "S",
   *    "maxHealth": 24,
   *    "health": 24
   *    }
   *  }
   *
   */
  checkForRangedThreats() {

    const possibleEnemies = DIRECTIONS.map((direction) => this.warrior.look(direction).find((space) => space.isEnemy()));

//    const hasArcher = possibleEnemies.findIndex((unit) => unit.name === 'Archer');

  }


  /**
   * I was attacked but no enemy was near
   * start moving in the opposite direction
   * @param warrior
   */
  shouldEvadeAttack() {
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
   *
   * @param warrior
   * @returns {Array}
   */
  adjacentToEnemy(warrior) {
    const isAdjacent = DIRECTIONS.some((direction) => warrior.feel(direction).isEnemy());

    this.warrior.think(isAdjacent);

    return isAdjacent;
  }

  /**
   * Warrior is not under attack, has been injured and is not in front of an enemy
   * @param warrior
   * @returns {boolean|*}
   */
  shouldTakeARest(warrior) {
    if (!this.wasAttackedLastTurn() && this.isInjured() && !this.warrior.feel(this.direction).isEnemy()) {
      this.warrior.rest();
      return true;
    }
    return false;
  }

  /**
   * Check if warrior has been injured
   * @param warrior
   * @returns {boolean}
   */
  isInjured() {
    return this.warrior.health() < 20;
  }

  /**
   * Check if a attack has happened since last turn.
   * @param warrior
   * @returns {boolean}
   */
  wasAttackedLastTurn() {
    return this.warrior.health() < this.health;
  }
}

class Player {

  constructor() {
    // create single instance of brain
    if (!this.brain) this.brain = new Brain();
  }

  playTurn(warrior) {
    this.brain.think(warrior);
  }
}
