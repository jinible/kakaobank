// Let's make something cool!
const {
  _: { debounce },
  Matter: { Body, Render, Engine, World, Bodies, Events },
  gsap: {
    utils: { random },
    to,
  },
} = window;
// eslint-disable-next-line
console.clear();

const ORIGINAL_SIZE = 140;
const TEXTURES = [
  "./image/coin.png",
  "./image/coin2.png",
  "./image/coin3.png",
  "./image/coin4.png",
];

const canvas = document.querySelector("canvas");

const engine = Engine.create({
  enableSleeping: true,
});

const render = Render.create({
  element: document.body,
  canvas,
  engine: engine,
  options: {
    background: "transparent",
    wireframeBackground: "transparent",
    wireframes: false,
    width: window.innerWidth,
    height: 680,
  },
});

// Create the ground
const ground = Bodies.rectangle(0, 680 - 10, 10000, 1, {
  isStatic: true,
  render: {
    opacity: 0,
  },
});

// add all of the bodies to the world
World.add(engine.world, [ground]);

// run the engine
Engine.run(engine);

// run the renderer
Render.run(render);

const addBear = () => {
  const HEADS = [];
  const amount = 20; //갯수
  for (let h = 0; h < amount; h++) {
    const SIZE = random(40, 60); //미니멈, 맥시멈
    const HEAD = Bodies.rectangle(
      random(0, window.innerWidth),
      -100,
      SIZE,
      SIZE,
      {
        angle: random(0, 360) * (Math.PI / 180),
        render: {
          strokeStyle: "#ffffff",
          sprite: {
            texture: TEXTURES[Math.floor(random(0, TEXTURES.length))],
            xScale: SIZE / ORIGINAL_SIZE,
            yScale: SIZE / ORIGINAL_SIZE,
          },
        },
      }
    );
    if (Math.random() > 0.5)
      to(HEAD, {
        angle: `${Math.random() > 0.5 ? "-" : "+"}=${(360 * Math.PI) / 180}`,
        repeat: -1,
        duration: random(0.2, 2),
      });
    Events.on(HEAD, "sleepStart", () => {
      World.remove(engine.world, HEAD);
      if (engine.world.bodies.length < 30) mixed(); //동전갯수가 30개 이하면 새로 만들어짐.
    });
    HEADS.push(HEAD);
  }
  World.add(engine.world, HEADS);
};

const mixed = () => addBear();
// const bear = () => addBear(0);
// const golden = () => addBear(1);
// const silver = () => addBear(2);
// const bronze = () => addBear(3);
// const green = () => addBear(4);
// const purpleRain = () => addBear(5);
const clear = () => World.clear(engine.world, true);

// document.body.addEventListener("click", mixed);   //클릭하면 생기는거
window.addEventListener(
  "resize", //화면크기 바뀌면 초기화
  debounce(() => {
    World.clear(engine.world, true);
    canvas.width = window.innerWidth;
    canvas.height = 680;
    Body.setPosition(ground, {
      x: 0,
      y: 680 - 10,
    });
    mixed();
  }, 500)
);

mixed();
$(".collapse").collapse({ toggle: false });
