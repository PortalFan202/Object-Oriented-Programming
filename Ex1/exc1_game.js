const prompts = require('prompts');

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

class Dungeon {
    constructor(){
        this.roomsArray = [];
    }
    roomWithPlayer(){
        let desiredRoom = [];
        for (let i = 0; i < this.roomsArray.length; i++) {
            if(this.roomsArray[i].playerPresent == true){
                desiredRoom = this.roomsArray[i]
                i = this.roomsArray.length
            }
        }
        return desiredRoom;
    }

    addRooms(){
        for (let i = 0; i < arguments.length; i++) {
            this.roomsArray.push(arguments[i]);
        }
    }
}

class Room {
    constructor(name, description){
        this.name = name;
        this.description = description;
        this.connections = new Array();
        this.creatures = new Array();
        this.finalRoom = false;
        this.playerPresent = false;
    }

    //Method for getting the name and description of the room
    getName() {return this.name}
    getDescription() {return this.description}

    //Method for both setting an erasing connections to other rooms
    makeOneWayConnection(room){
        this.connections.push(room);
    }
    removeConnection(room){
        let index = this.connections.indexOf(room);
        this.connections.splice(index, 1);
    }

    //Methods for adding and removing creatures
    addCreature(creature){this.creatures.push(creature)}
    removeCreature(creature){
        let index = this.creatures.indexOf(creature);
        this.creatures.splice(index, 1);
    }

    //Will return the creatures array
    returnCreatures() {return this.creatures}

    //Will check for creatures in the room and make it attack a target
    checkCreaturesAndAttackTarget(target) {
        for (let i = 0; i < this.creatures.length; i++) {
            if(this.creatures[i]) {
                let creature = this.creatures[i]
                creature.attackTarget(target)
            }
        }
    }
}

//Initial class that we will use as a template for the other classes.
class Template {
    //We assign the creature their hitpoints, damage and chance of hitting on creation
    constructor(hitPoints, attackDamage, chanceOfHit, name) {
        this.hitPoints = hitPoints;
        this.attackDamage = attackDamage;
        this.chanceOfHit = chanceOfHit;
        this.name = name;
        this.fallenState = false;
    }

    //Two methods, one increases the hitpoints by a given value and the other decreases the hitpoints by a given value.
    incraseHitPoints(hp) {this.hitPoints += hp;}
    decreaseHitPoints(hp) {this.hitPoints -= hp;}

    //One method to attack, if the hitpoints decrease to 0, it removes the target from the room
    attackTarget(target) {
        if (getRandomInt(1, 101) <= this.chanceOfHit) {
            target.decreaseHitPoints(this.attackDamage)
            console.log(this.name + ' attacks and deals ' + this.attackDamage + ' damage to the ' + target.name + '.')
            if (target.hitPoints <= 0) {
                console.log(target.name + ' falls in battle!')
                target.fallenState = true;
            } else {console.log(target.name + ' has ' + target.hitPoints + ' HP remaining.')}
        } else {
            console.log(this.name + "'s attack against " + target.name + " failed!")
        }
    }
}

class Player extends Template {
    constructor(hitPoints, attackDamage, chanceOfHit, name){
        super(hitPoints, attackDamage, chanceOfHit, name);
    }
}

class Enemy extends Template {
    constructor(hitPoints, attackDamage, chanceOfHit, name){
        super(hitPoints, attackDamage, chanceOfHit, name);
    }
}

//Dungeon construction starts here

    //Creation of rooms and dungeon

let dungeonEntrance = new Room(
    "Dungeon Entrance",
    "The entrance to the dungeon",
)

let hallway = new Room(
    "Hallway",
    "The hallway stretches trough the dungeon",
)

let chamber = new Room(
    "Chamber",
    "A vast dark room.",
)

let portal = new Room(
    "The Final Portal",
    "A huge portal that leads to places unknown",
)

let dungeon = new Dungeon;
dungeon.addRooms(dungeonEntrance, hallway, chamber, portal)

    //Creation of player and creatures

//The name of the mainPlayer object CAN'T be changed, its properties can be changed freely though, including the name property.
let mainPlayer = new Player(
    10,
    2,
    75,
    "The Player"
)

let sewerRat = new Enemy(
    2,
    1,
    50,
    "Sewer Rat"
)

let giantDragon = new Enemy(
    4,
    8,
    90,
    "Giant Dragon"
)

dungeonEntrance.makeOneWayConnection(hallway)
hallway.makeOneWayConnection(dungeonEntrance)
hallway.makeOneWayConnection(chamber)
chamber.makeOneWayConnection(hallway)
chamber.makeOneWayConnection(portal)
portal.makeOneWayConnection(chamber)
portal.finalRoom = true

dungeonEntrance.playerPresent = true
hallway.addCreature(sewerRat)
chamber.addCreature(giantDragon)

//Dungeon construction stops here

async function gameLoop() {
    let continueGame = true;

    // Example set of UI options for the user to select
    const initialActionChoices = [
        { title: 'Look Around (Roll Perception)', value: 'perceptionRoll' },
        { title: 'Move to room', value: 'moveToRoom' },
        { title: 'Attack', value: 'attack'},
        { title: 'Exit game', value: 'exit'}
    ];

    // Show the list of options for the user.
    // The execution does not proceed from here until the user selects an option.
    const response = await prompts({
      type: 'select',
      name: 'value',
      message: 'Choose your action',
      choices: initialActionChoices
    });

    // Deal with the selected value
    switch(response.value) {
      case 'perceptionRoll':
        roomWithPlayer = dungeon.roomWithPlayer()
        //Checks if the roll is above 10
        if(getRandomInt(1, 21) >= 10){
            //Says the description of the room
            console.log(roomWithPlayer.getDescription());
            //Should list the connections
            console.log("This room is connected to:")
            for (let i = 0; i < roomWithPlayer.connections.length; i++) {
                console.log(roomWithPlayer.connections[i].name);
            }
        } else {console.log("The perception roll failed! (Rolled bellow 10)")}
        //It'll check if there are any creatures in the room and make them attack the player if there are
        roomWithPlayer.checkCreaturesAndAttackTarget(mainPlayer)
        break;
      
      case 'moveToRoom':
        //Gives the user the list of connections based on the current room, which is decided from the Dungeon method.
        roomWithPlayer = dungeon.roomWithPlayer()

        const roomSelection = await prompts({
            type: 'select',
            name: 'selectedRoom',
            message: 'Choose a room',
            choices: roomWithPlayer.connections.map(function(room) {
                let object = { title: room.name, value: room }
                return object
            })
        });

        roomWithPlayer.playerPresent = false
        roomSelection.selectedRoom.playerPresent = true
        roomWithPlayer = dungeon.roomWithPlayer()

        //Now it'll check if there are any creatures in the room and make them attack the player if there are
        roomWithPlayer.checkCreaturesAndAttackTarget(mainPlayer)
        break;
      
      case 'attack':
        //Should make the player attack the other creature in the room
        roomWithPlayer = dungeon.roomWithPlayer()
        let attackableCreatures = roomWithPlayer.creatures.map(function(creature) {
            let object = { title: creature.name, value: creature }
            return object
        })
        if (attackableCreatures.length > 0){
            const creatureSelection = await prompts({
                type: 'select',
                name: 'selectedCreature',
                message: 'Choose a creature to attack',
                choices: attackableCreatures
            })

            mainPlayer.attackTarget(creatureSelection.selectedCreature)
            if(creatureSelection.selectedCreature.fallenState == true) {roomWithPlayer.removeCreature(creatureSelection.selectedCreature)}

        } else {console.log("No creatures to attack!")}
        break;
      
      case 'exit':
        continueGame = false;
        break;
    }

    if(mainPlayer.fallenState == true || dungeon.roomWithPlayer().finalRoom == true) {
        continueGame = false;
    }

    if(continueGame) {
      gameLoop();
    }    
}

process.stdout.write('\033c'); // clear screen on windows

console.log('Welcome to the Dungeon of the Dragon Lord')
console.log('=========================================')
console.log('You walk down the stairs to the dungeons')
gameLoop();