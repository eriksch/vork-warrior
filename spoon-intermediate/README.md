## spoon - intermediate - level 3

### _You feel slime on all sides, you are surrounded!_

> **TIP:** Call `warrior.bind()` to bind an enemy to keep him from attacking. Bound enemies no longer look like enemies.


### Floor Map

```
╔═══╗
║>s ║
║s@s║
║ C ║
╚═══╝

> = stairs
s = Sludge (12 HP)
@ = spoon (20 HP)
C = Captive (1 HP)
```

### Abilities

#### Actions (only one per turn)

* `warrior.bind()`: Bind a unit in the given direction (forward by default) to keep him from moving.
* `warrior.rescue()`: Release a unit from his chains in the given direction (forward by default).
* `warrior.walk()`: Move one space in the given direction (forward by default).
* `warrior.attack()`: Attack a unit in the given direction (forward by default) dealing 5 HP of damage.
* `warrior.rest()`: Gain 10% of max health back, but do nothing more.

#### Senses

* `warrior.directionOfStairs()`: Return the direction (forward, right, backward or left) the stairs are from your location.
* `warrior.think()`: Think about your options before choosing an action.
* `warrior.feel()`: Return the adjacent space in the given direction (forward by default).
* `warrior.health()`: Return an integer representing your health.

### Next Steps

When you're done editing `Player.js`, run the `warriorjs` command again.
