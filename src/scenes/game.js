import { makeMotobug } from "../entities/motobug";
import { makeRing } from "../entities/ring";
import { makeSonic } from "../entities/sonic";
import k from "../kaplayCtx";

export default function game() {
  // set gravity will only work on body components
  k.setGravity(3100);
  const citySfx = k.play("city", { volume: 0.2, loop: true });

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

  let score = 0;
  let scoreMultiplier = 0;

  const scoreText = k.add([
    k.text("SCORE: 0", { font: "mania", size: "72" }),
    k.pos(20,20),
  ]);

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
      scoreMultiplier += 1;
      score += 10 * scoreMultiplier;
      scoreText.text = `SCORE: ${score}`;
      if (scoreMultiplier === 1 ) sonic.ringCollectUI.text = `+10`;
      if (scoreMultiplier > 1) sonic.ringCollectUI.text = `x${scoreMultiplier}`;
      k.wait(1, () => { sonic.ringCollectUI.text = ""; })
      return;
    }
    k.play("hurt", { volume: 0.5 });
    k.setData("current-score", score);
    k.go("gameover", citySfx);
  })
  sonic.onCollide("ring", (ring) => {
    k.play("ring", { volume: 0.5 });
    k.destroy(ring);
    score++;
    scoreText.text = `SCORE: ${score}`;
    sonic.ringCollectUI.text = "+1";
    k.wait(1, () => { sonic.ringCollectUI.text = ""; });
  });

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
    // recursive function for infinite enemy spawn
    k.wait(waitTime, spawnMotoBug);
  }

  spawnMotoBug();

  const spawnRing = () => {
    const ring = makeRing(k.vec2(1950, 745));
    ring.onUpdate(() => {
      ring.move(-gameSpeed, 0);
    });
    ring.onExitScreen(() => {
      if (ring.pos.x < 0) {
        k.destroy(ring);
      }
    })
    const waitTime = k.rand(0.5, 3);
    // recursive function for infinite ring spawn
    k.wait(waitTime, spawnRing);
  }
spawnRing();

  k.add([
    k.rect(1920,3000),
    k.opacity(0),
    k.area(),
    k.pos(0,832),
    k.body({ isStatic: true }),
  ])

  k.onUpdate(() => {
    // reset multiplier to 0 
    if (sonic.isGrounded()) scoreMultiplier = 0;

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