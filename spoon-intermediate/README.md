## spoon - intermediate - level 4

### _Your ears become more in tune with the surroundings. Listen to find enemies and captives!_

> **TIP:** Use `warrior.listen()` to find spaces with other units, and `warrior.directionOf()` to determine what direction they're in.


### Floor Map

```
╔════╗
║C s ║
║ @ S║
║C s>║
╚════╝

C = Captive (1 HP)
s = Sludge (12 HP)
@ = spoon (20 HP)
S = Thick Sludge (24 HP)
> = stairs
```

### Abilities

#### Actions (only one per turn)

* `warrior.walk()`: Move one space in the given direction (forward by default).
* `warrior.attack()`: Attack a unit in the given direction (forward by default) dealing 5 HP of damage.
* `warrior.rest()`: Gain 10% of max health back, but do nothing more.
* `warrior.bind()`: Bind a unit in the given direction (forward by default) to keep him from moving.
* `warrior.rescue()`: Release a unit from his chains in the given direction (forward by default).

#### Senses

* `warrior.directionOf()`: Return the direction (forward, right, backward or left) to the given space.
* `warrior.listen()`: Return an array of all spaces which have units in them (excluding yourself).
* `warrior.directionOfStairs()`: Return the direction (forward, right, backward or left) the stairs are from your location.
* `warrior.think()`: Think about your options before choosing an action.
* `warrior.feel()`: Return the adjacent space in the given direction (forward by default).
* `warrior.health()`: Return an integer representing your health.

### Next Steps

When you're done editing `Player.js`, run the `warriorjs` command again.
