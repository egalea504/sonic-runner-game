import { makeMotobug } from "../entities/motobug";
import { makeSonic } from "../entities/sonic";
import k from "../kaplayCtx";

export default function game() {
  // set gravity will only work on body components
  k.setGravity(3100);

  const backgroundPieceWidth = 1920;
  const backgroundPieces = [
    k.add([k.sprite("chemical-background"), k.pos(0,0), k.scale(2), k.opacity(0.8)]),
    k.add([k.sprite("chemical-background"), k.pos(backgroundPieceWidth * 2,0), k.scale(2), k.opacity(0.8)])
  ]

  const platformWidth = 1280;
  const platforms = [
    k.add([k.sprite("platforms"), k.pos(0,450), k.scale(4), k.opacity(0.8)]),
    k.add([k.sprite("platforms"), k.pos(platformWidth,450), k.scale(4), k.opacity(0.8)])
  ]

  const sonic = makeSonic(k.vec2(200,745));
  // call functions here
  sonic.setControls();
  sonic.setEvents();
  sonic.onCollide("enemy", (enemy) => {
    if (!sonic.isGrounded()) {
      k.play("destroy", { volume: 0.5 });
      k.play("hyper-ring", { volume: 0.5 });
      k.destroy(enemy);
      sonic.play("jump");
      sonic.jump();
      k.play("jump", );
      return;
    }
    k.play("hurt", { volume: 0.5 });
    k.go("gameover");
  })

  let gameSpeed = 300;
  k.loop(1, () => {
    gameSpeed += 50;
  });

  const spawnMotoBug = () => {
    const motobug = makeMotobug(k.vec2(1950,773));
    motobug.onUpdate(() => {
      if (gameSpeed < 3000) {
        motobug.move(-(gameSpeed + 300), 0);
        return
      }

      motobug.move(-gameSpeed,0);
    })
    motobug.onExitScreen(() => {
      if (motobug.pos.x < 0) {
        k.destroy(motobug);
      }
    })
    const waitTime = k.rand(0.5, 2.5);
    // recursive function for infinite enemy time
    k.wait(waitTime, spawnMotoBug);
  }

  spawnMotoBug();

  k.add([
    k.rect(1920,3000),
    k.opacity(0),
    k.area(),
    k.pos(0,832),
    k.body({ isStatic: true }),
  ])

  k.onUpdate(() => {
    if (backgroundPieces[1].pos.x < 0) {
          backgroundPieces[0].moveTo(backgroundPieces[1].pos.x + backgroundPieceWidth * 2, 0);
          backgroundPieces.push(backgroundPieces.shift());
        }
    
        backgroundPieces[0].move(-100,0);
        backgroundPieces[1].moveTo(backgroundPieces[0].pos.x + backgroundPieceWidth * 2, 0);


        if (platforms[1].pos.x < 0) {
              platforms[0].moveTo(platforms[1].pos.x + platformWidth * 4, 450);
              platforms.push(platforms.shift());
            }
        
            platforms[0].move(-gameSpeed,0);
            platforms[1].moveTo(platforms[0].pos.x + platformWidth * 4, 450);
  })
}