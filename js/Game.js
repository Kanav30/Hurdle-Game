class Game {
    constructor() { }

    getState() {
        var gameStateRef = database.ref('gameState');
        gameStateRef.on("value", function (data) {
            gameState = data.val();
        })
        //console.log("gameState in Game.js is " + gameState);
    }

    update(state) {
        database.ref('/').update({
            gameState: state
        });
    }


    async start() {
        //console.log("gameState in start() of Game.js is " + gameState)
        if (gameState === 0) {
            //console.log("Inside if (gameState === 0) of start() Game.js");
            player = new Player();
            var playerCountRef = await database.ref('playerCount').once("value");
            if (playerCountRef.exists()) {
                playerCount = playerCountRef.val();
                player.getCount();
            }
            //console.log("PlayerCount in start() is " + playerCount);

            form = new Form()
            form.display();
        }
        //console.log("Creating runners sprite")
        runner1 = createSprite(10, 200);
        runner1.scale = 1;
        runner1.setCollider("rectangle", 0, 0)
        //runner1.debug = true;
        runner1.velocityY = 2;
        runner1.addImage("runner1", runner1_img);
        runner2 = createSprite(10, 500);
        runner2.scale = 1;
        runner2.velocityY = 2;
        runner2.setCollider("rectangle", 0, 0);
        //runner2.debug = true;
        runner2.addImage("runner2", runner2_img);
        runners = [runner1, runner2];
        
        invisibleGround1 = createSprite(100, 480, displayWidth * 5, 20);
        invisibleGround1.setCollider("rectangle", 0, 0);
        //invisibleGround1.debug = true;
        // invisibleGround1.visible = false;
        invisibleGround2 = createSprite(100, 750, displayWidth * 5, 20);
        invisibleGround2.setCollider("rectangle", 0, 0);
       // invisibleGround2.debug = true;
        //console.log("Runner is start() Game.js is " + runners);


        // invisibleGround2.visible = false;


    }
    play() {
        form.hide();
        Player.getPlayerInfo();
        //console.log("allplayes in play() Game.js is " + allPlayers);
        //console.log("runners lenght in play() Game.js is " + runners.length);
        spawnObstacles();
        spawnObstacles1();

        
        // Player.getPlayersAtEnd();
        if (allPlayers !== undefined) {
            image(track, 0, -20, displayWidth * 5, displayHeight);

            //index of the array
            var index = 0;
            //x and y position of the cars
            var y = 140;
            var x = 50;
            runner1.collide(invisibleGround1);
            runner2.collide(invisibleGround2);
            for (var plr in allPlayers) { 
                index = index + 1; 
                //use data form the database to display the cars in x direction
                if(index <= 2)
                {
                    y = y + 260;
                    x = 360 - allPlayers[plr].distance;
                    runners[index - 1].x = x;
                    runners[index - 1].y = y;
                    runners[index - 1].velocityX = 2;
                    runners[index - 1].velocityY = 2;
                    
                }
                if (index === player.index) {
                    //console.log("yes")
                    stroke(10);
                    fill("red");
                    ellipse(x, y, 60, 60);
                    runners[index - 1].shapeColor = "red";
                    camera.position.x = runners[index - 1].x;
                    camera.position.y = runners[index - 1].y;
                    player.x = x;
                    player.y = y;

                }

              
            }
        }
        if (keyIsDown(UP_ARROW)) {
            console.log("Key Space pressed ");
            runners[0].velocityY = -10;

        }
        if (keyIsDown(RIGHT_ARROW)) {
            player.distance -= 10
            player.update();
        }

        if (player.distance == 4000) {
            gameState = 2;
            player.rank += 1
            Player.updateCarsAtEnd(player.rank)
        }

        if(runner1.isTouching(obstacleGroup)){
            console.log("YOU LOSE!");
        }
        
        if(runner2.isTouching(obstacleGroup1)){
            console.log("YOU LOSE!");
        }
        drawSprites();
    }

    end() {
        
    }
}

function spawnObstacles() {
    var i = 0;
    if (frameCount % 55 === 0) {
        i = i + 1000
        var obstacles = createSprite(3500, 400);

        obstacles.velocityX = -4;
        obstacles.addImage(hurdle);
        obstacles.scale = 0.80;
       // obstacles.lifetime = 800;
        obstacles.setCollider("rectangle", -10, 0, 90, 150);
        //obstacles.debug = true;
        obstacleGroup.add(obstacles);
    }
}

function spawnObstacles1() {
    if (frameCount % 55 === 0) {

        var obstacle = createSprite(3500, 700);

        obstacle.velocityX = -4;
        obstacle.addImage(hurdle);
        obstacle.scale = 0.80;
       // obstacle.lifetime = 800;
        obstacle.setCollider("rectangle", -10, 0, 90, 150);
        //obstacle.debug = true;
        obstacleGroup1.add(obstacle);

    }
}