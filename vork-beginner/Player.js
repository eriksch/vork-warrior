class Player {

  constructor() {
    this.health = 20;
  }

  playTurn(warrior) {
    if (!this.wasAttackedLastTurn(warrior) && this.isInjured(warrior) && !warrior.feel().isEnemy()) {
      warrior.rest();
    } else if (warrior.feel().isEnemy()) {
      warrior.attack();
    } else {
      warrior.walk();
    }

    this.health = warrior.health();
  }

  isInjured(warrior) {
    return warrior.health() < 20;
  }

  wasAttackedLastTurn(warrior) {
    return warrior.health() < this.health;
  }
}
