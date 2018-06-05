## spoon - intermediate - level 5

### _You can feel the stairs right next to you, but are you sure you want to go up them right away?_

> **TIP:** You'll get more points for clearing the level first. Use `warrior.feel().isStairs()` and `warrior.feel().isEmpty()` to determine where to go.


### Floor Map

```
╔═════╗
║    S║
║@> SC║
╚═════╝

S = Thick Sludge (24 HP)
@ = spoon (20 HP)
> = stairs
C = Captive (1 HP)
```

### Abilities

#### Actions (only one per turn)

* `warrior.walk()`: Move one space in the given direction (forward by default).
* `warrior.attack()`: Attack a unit in the given direction (forward by default) dealing 5 HP of damage.
* `warrior.rest()`: Gain 10% of max health back, but do nothing more.
* `warrior.bind()`: Bind a unit in the given direction (forward by default) to keep him from moving.
* `warrior.rescue()`: Release a unit from his chains in the given direction (forward by default).

#### Senses

* `warrior.directionOfStairs()`: Return the direction (forward, right, backward or left) the stairs are from your location.
* `warrior.think()`: Think about your options before choosing an action.
* `warrior.feel()`: Return the adjacent space in the given direction (forward by default).
* `warrior.health()`: Return an integer representing your health.
* `warrior.directionOf()`: Return the direction (forward, right, backward or left) to the given space.
* `warrior.listen()`: Return an array of all spaces which have units in them (excluding yourself).

### Next Steps

When you're done editing `Player.js`, run the `warriorjs` command again.
