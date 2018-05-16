
const DIRECTIONS = ['forward', 'right', 'backward', 'left'];

class Player {

  constructor() {
    this.health = 22;
    this.isRunningAway = false;
    this.direction = 'backward';
  }

  playTurn(warrior) {

    //if(warrior.feel(this.direction).isWall()) {
      //this.turnLeft();
      //this.turnOpposite();
      //
      // this.direction = 'forward';
    //}

    // Check if we need to evade ranged attacks until healed
    if (this.shouldEvadeAttack(warrior)) {

    }

    // should warrior take a rest
    else if (this.shouldTakeARest(warrior)) {

    }

    // rescue captives
    else if (this.rescueCaptive(warrior)) {

    }

    // attack nearby enemies
    else if (this.attackEnemy(warrior)) {

    }

    // find your exit
    else {
      this.moveToStairs(warrior)
    }

    this.storeState(warrior);

    // test if we should change our direction
    this.shouldChangeDirection(warrior);

  }

  storeState(warrior) {
    this.health = warrior.health();
  }

  /**
   * Change direction
   *
   * @param warrior
   */
  shouldChangeDirection(warrior) {
      if (warrior.feel(this.direction).isWall()) {
       this.turnLeft();
        //this.shouldChangeDirection(warrior);
      }
  }

  /**
   * Allways turn left
   */
  turnLeft() {
    switch(this.direction) {
      case 'backward':
        return this.direction = 'left';
        break;
      case 'left':
        return this.direction = 'forward';
        break;
      case 'forward':
        return this.direction = 'right';
        break;
      case 'right':
        return this.direction = 'backward';
        break;
    }
    return true;
  }

  /**
   * Run forest Run
   */
  turnOpposite() {
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
  }

  /**
   * Find your exit
   *
   * @param warrior
   */
  moveToStairs(warrior) {
    warrior.walk(this.direction);

    return true;
  }

  /**
   * Attack anamy if present
   * @param warrior
   */
  attackEnemy(warrior) {
    if (warrior.feel(this.direction).isEnemy()) {
      warrior.attack(this.direction);
      return true;
    }
    return false;
  }

  /**
   * Rescue a captive
   * @param warrior
   */
  rescueCaptive(warrior) {
    if (warrior.feel(this.direction).isCaptive()) {
      warrior.rescue(this.direction);
      return true;
    }
    return false;
  }

  /**
   * I was attacked but no enemy was near
   * start moving in the opposite direction
   * @param warrior
   */
  shouldEvadeAttack(warrior) {
    if (!this.isRunningAway && this.wasAttackedLastTurn(warrior) && warrior.health() <= 10 && !this.adjacentToEnemy(warrior)) {

      this.turnOpposite();

      this.isRunningAway = true;

      warrior.walk(this.direction);

      return true;
    }

    // We can stop running and turn the opposite way again
    else if (this.isRunningAway && !this.wasAttackedLastTurn()) {

      this.turnOpposite();

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
    return DIRECTIONS.some((direction) => warrior.feel(direction).isEnemy());
  }

  /**
   * Warrior is not under attack, has been injured and is not in front of an enemy
   * @param warrior
   * @returns {boolean|*}
   */
  shouldTakeARest(warrior) {
    if (!this.wasAttackedLastTurn(warrior) && this.isInjured(warrior) && !warrior.feel(this.direction).isEnemy()) {
      warrior.rest();
      return true;
    }
    return false;
  }

  /**
   * Check if warrior has been injured
   * @param warrior
   * @returns {boolean}
   */
  isInjured(warrior) {
    return warrior.health() < 20;
  }

  /**
   * Check if a attack has happened since last turn.
   * @param warrior
   * @returns {boolean}
   */
  wasAttackedLastTurn(warrior) {
    return warrior.health() < this.health;
  }
}
