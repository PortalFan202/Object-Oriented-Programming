const prompts = require('prompts');

//Just a function that returns a number from min (included) to max (excluded)
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

//We'll use the Dungeon to store the rooms we'll make and use methods that require to check all the rooms
class Dungeon {
    constructor(){
        //It contains this single array that we'll use to store the rooms
        this.roomsArray = [];
    }
    //This method checks which room the player is in using the .playerPresent boolean that each room has
    roomWithPlayer(){
        let desiredRoom = [];
        //It loops trough all the rooms and returns the one that has .playerPresent as true
        for (let i = 0; i < this.roomsArray.length; i++) {
            if(this.roomsArray[i].playerPresent == true){
                desiredRoom = this.roomsArray[i]
                i = this.roomsArray.length
            }
        }
        return desiredRoom;
    }

    //Adds rooms to the roomArray of the dungeon
    addRooms(){
        //It can take an infinite ammount of parameters, this is done using the "argument" variable that functions have, which is
        //an array of all the arguments specified in the constructor (what's inside the brackets).
        for (let i = 0; i < arguments.length; i++) {
            this.roomsArray.push(arguments[i]);
        }
    }
}

//The rooms that'll contain the monsters and such
class Room {
    constructor(name, description){
        //It has a name, description, an array that'll contain other rooms and we'll use to check connections, an array that contains the
        //enemy creatures, a boolean that determines if this is a final room and a boolean that determines if the player is in the room.
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
        //It just adds the room to the connections array
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
        //It first loops trough all the creatures array of the room
        for (let i = 0; i < this.creatures.length; i++) {
            //This actually shouldn't work but it does
            //If the creature is true, so if it exists (this doesn't work like this), then make that creature attack the target, for this
            //we use the attackTarget method that creatures have.
            if(this.creatures[i]) {
                let creature = this.creatures[i]
                creature.attackTarget(target)
            }
        }
    }
}

//Initial class that we will use as a template for the other classes.
class Template {
    constructor(hitPoints, attackDamage, chanceOfHit, name) {
        //We assign the creature their hitpoints, damage, chance of hitting and name on creation
        this.hitPoints = hitPoints;
        this.attackDamage = attackDamage;
        this.chanceOfHit = chanceOfHit;
        this.name = name;
        //The also make it have a boolean that we'll check to see if it has died.
        this.fallenState = false;
    }

    //Two methods, one increases the hitpoints by a given value and the other decreases the hitpoints by a given value.
    incraseHitPoints(hp) {this.hitPoints += hp;}
    decreaseHitPoints(hp) {this.hitPoints -= hp;}

    //One method to attack, if the hitpoints decrease to 0, it removes the target from the room
    attackTarget(target) {
        //If a random number from 1 to 100 is bellow or equal to their chance of hit, it will hit.
        if (getRandomInt(1, 101) <= this.chanceOfHit) {
            //We use the decreaseHitPoints method to lower the target's HP by the damage this creature has and then display some cool
            //message that who made the attack, the damage dealth and towards what target.
            target.decreaseHitPoints(this.attackDamage)
            console.log(this.name + ' attacks and deals ' + this.attackDamage + ' damage to the ' + target.name + '.')
            //If the target creature Hit Points go bellow or equal to zero, we change it fallenState to true and display with text that is has fallen
            if (target.hitPoints <= 0) {
                console.log(target.name + ' falls in battle!')
                target.fallenState = true;
            //If the creature doesn't die however, we just display it's remaining HP
            } else {console.log(target.name + ' has ' + target.hitPoints + ' HP remaining.')}
        //If the attack didn't land, we dont make any attack and dispaly that the attack failed.
        } else {
            console.log(this.name + "'s attack against " + target.name + " failed!")
        }
    }
}

//Player is an extension of the Template with no changes
class Player extends Template {
    constructor(hitPoints, attackDamage, chanceOfHit, name){
        super(hitPoints, attackDamage, chanceOfHit, name);
    }
}

////Player is an extension of the Template with no changes
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

    //Creation of connecetions and assigment of final room
dungeonEntrance.makeOneWayConnection(hallway)
hallway.makeOneWayConnection(dungeonEntrance)
hallway.makeOneWayConnection(chamber)
chamber.makeOneWayConnection(hallway)
chamber.makeOneWayConnection(portal)
portal.makeOneWayConnection(chamber)
portal.finalRoom = true

    //The add each creature to their room and set playerPresent to the first room.
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

        //This is just a fancy look around based on DnD
        case 'perceptionRoll':
            //We check the dungeon and make assign the rooom that has the player.
            roomWithPlayer = dungeon.roomWithPlayer()
            //Checks if the roll (random number from 1 to 20) is above 10
            if(getRandomInt(1, 21) >= 10){
                //If the rolls is aboce or equal to 10
                //Says the description of the room
                console.log(roomWithPlayer.getDescription());
                //Lists the connections
                console.log("This room is connected to:")
                for (let i = 0; i < roomWithPlayer.connections.length; i++) {
                    //Loops trough all the connections and logs the name of each room in the connections array
                    console.log(roomWithPlayer.connections[i].name);
                }
                console.log("You were able to spot these enemies:")
                for (let i = 0; i < roomWithPlayer.creatures.length; i++) {
                    //Loops trough all the connections and logs the name of each room in the connections array
                    console.log(roomWithPlayer.creatures[i].name);
                }
            //If the rool is bellow 10, it won't look around the room and just display that the roll failed.
            } else {console.log("The perception roll failed! (Rolled bellow 10)")}
            //It'll check if there are any creatures in the room and make them attack the player if there are using a method
            //Since this is outside the if statement, this always happens regardless of the result of the roll.
            roomWithPlayer.checkCreaturesAndAttackTarget(mainPlayer)
        break;
      
        case 'moveToRoom':
            //It checks the room the player is in
            roomWithPlayer = dungeon.roomWithPlayer()

            //Shows the selection of connections using the prompts package
            const roomSelection = await prompts({
                type: 'select',
                name: 'selectedRoom',
                message: 'Choose a room',
                choices: roomWithPlayer.connections.map(function(room) {
                    //This might look confusing but it simply makes an array of objects with the room name as "title" and
                    //the whole room object as "value". This has to do with the prompts package, it'll display the title as the option and
                    //when the option is selected it will select the value. This way we display only the name and not the whole object as an option.
                    let object = { title: room.name, value: room }
                    return object
                })
            });

            //After the room is selected, the room the player is in playerPresent will be set to false to "remove" the player from that room.
            roomWithPlayer.playerPresent = false
            //Then it'll make the same boolean true for the selected room, "moving" the player to that room
            roomSelection.selectedRoom.playerPresent = true
            //Now it will check wich room has the playerPresent boolean set as true and assign it as the room the player is in.
            roomWithPlayer = dungeon.roomWithPlayer()

            //Now it'll check if there are any creatures in the room and make them attack the player if there are
            roomWithPlayer.checkCreaturesAndAttackTarget(mainPlayer)
        break;
      
        case 'attack':
            //Checks the room the player is in
            roomWithPlayer = dungeon.roomWithPlayer()
            let attackableCreatures = roomWithPlayer.creatures.map(function(creature) {
                //Same as the options for the connections, makes an array of objects that follow the promptps package rules for showing
                //options, for more info how this works check the roomSelection constant.
                let object = { title: creature.name, value: creature }
                return object
            })

            //If the array of options has more than 0 objects inside (if it's not empty)
            if (attackableCreatures.length > 0){
                //It'll show the options using the prompts package.
                const creatureSelection = await prompts({
                    type: 'select',
                    name: 'selectedCreature',
                    message: 'Choose a creature to attack',
                    choices: attackableCreatures
                })

                //After choosing it'll make the player attack the selected creature.
                mainPlayer.attackTarget(creatureSelection.selectedCreature)

                //If the selected creature's fallenState (HP 0 or bellow) is true, it'll remove it from the room.
                if(creatureSelection.selectedCreature.fallenState == true) {roomWithPlayer.removeCreature(creatureSelection.selectedCreature)}
            
            //If the options for attackable creatures where equal to 0 (no creatures), it won't attack and just display this text.
            } else {console.log("No creatures to attack!")}
        break;
      
        case 'exit':
            //If the player selects exit, continue game will be set to false
            continueGame = false;
        break;
    }

    if(mainPlayer.fallenState == true || dungeon.roomWithPlayer().finalRoom == true) {
        //If the player dies or the current room's boolean for being the final room is true (if the current room is the final room), it will
        //set continueGame as false
        continueGame = false;
    }

    //If continueGame is true, it'll loop the game
    if(continueGame) {
      gameLoop();
    }    
}

process.stdout.write('\033c'); // clear screen on windows

console.log('Welcome to the Dungeon of the Dragon Lord')
console.log('=========================================')
console.log('You walk down the stairs to the dungeons')
gameLoop();