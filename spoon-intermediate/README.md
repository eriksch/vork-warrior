## spoon - intermediate - level 2

### _Another large room, but with several enemies blocking your way to the stairs._

> **TIP:** Just like walking, you can attack and feel in multiple directions (forward, left, right, backward).


### Floor Map

```
╔════╗
║@s  ║
║ sS>║
╚════╝

@ = spoon (20 HP)
s = Sludge (12 HP)
S = Thick Sludge (24 HP)
> = stairs
```

### Abilities

#### Actions (only one per turn)

* `warrior.attack()`: Attack a unit in the given direction (forward by default) dealing 5 HP of damage.
* `warrior.rest()`: Gain 10% of max health back, but do nothing more.
* `warrior.walk()`: Move one space in the given direction (forward by default).

#### Senses

* `warrior.feel()`: Return the adjacent space in the given direction (forward by default).
* `warrior.health()`: Return an integer representing your health.
* `warrior.directionOfStairs()`: Return the direction (forward, right, backward or left) the stairs are from your location.
* `warrior.think()`: Think about your options before choosing an action.

### Next Steps

When you're done editing `Player.js`, run the `warriorjs` command again.
