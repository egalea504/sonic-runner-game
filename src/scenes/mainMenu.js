import { makeSonic } from "../entities/sonic";
import k from "../kaplayCtx";

export default function mainMenu() {
  if (!k.getData("best-score")) k.setData("best-score", 0);
  k.onButtonPress("jump", () => k.go("game"));

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

  makeSonic(k.vec2(200,745));

  k.add([
    k.text("SONIC RUN GAME", {font: "mania", size: 150}),
    k.pos(k.center().x, 200),
    k.anchor("center")
  ])

  k.onUpdate(() => {
    if (backgroundPieces[1].pos.x < 0) {
      backgroundPieces[0].moveTo(backgroundPieces[1].pos.x + backgroundPieceWidth * 2, 0);
      backgroundPieces.push(backgroundPieces.shift());
    }

    backgroundPieces[0].move(-100,0);
    backgroundPieces[1].moveTo(backgroundPieces[0].pos.x + backgroundPieceWidth * 2, 0);
  })

  k.onUpdate(() => {
    if (platforms[1].pos.x < 0) {
      platforms[0].moveTo(platforms[1].pos.x + platforms[1].width * 4, 450);
      platforms.push(platforms.shift());
    }

    platforms[0].move(-3000,0);
    platforms[1].moveTo(platforms[0].pos.x + platforms[1].width * 4, 450);
  })
};