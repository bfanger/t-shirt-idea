import {
  Scene,
  Engine,
  Vector3,
  HemisphericLight,
  MeshBuilder,
  ArcRotateCamera,
  CubeTexture,
  StandardMaterial,
  Color3,
  Texture,
  SceneLoader,
  AbstractMesh,
  Nullable,
  DynamicTexture,
  PBRMaterial,
  Axis,
} from "@babylonjs/core";
import "@babylonjs/loaders/glTF";
import "@babylonjs/gui";
import "@babylonjs/inspector";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const texture = document.getElementById("texture") as HTMLCanvasElement;
const ctx = texture.getContext("2d") as CanvasRenderingContext2D;
const loading = document.getElementById("loading") as HTMLDivElement;
const panel = document.getElementById("panel") as HTMLDivElement;
const input = document.querySelector("input") as HTMLInputElement;
const img = new Image();
img.src = "/v3/t-shirt.png";
const engine = new Engine(canvas, true);

const scene = new Scene(engine);
// scene.debugLayer.show();
const skyboxTexture = new CubeTexture("Standard-Cube-Map/", scene);
skyboxTexture.coordinatesMode = Texture.SKYBOX_MODE;
scene.environmentTexture = skyboxTexture;

const camera = new ArcRotateCamera(
  "camera1",
  1.5,
  1.7,
  2,
  new Vector3(0, 0, 0),
  scene
);
camera.setTarget(Vector3.Zero());

camera.attachControl(canvas, true);

let state = "LOADING";
let frameCount = 0;
let tshirt: Nullable<AbstractMesh>;
SceneLoader.ImportMesh("", "", "t-shirt.glb", scene, () => {
  state = "PARSING";
  loading.textContent = "Bezig met verwerken...";

  tshirt = scene.getMeshByName("tshirt");
  
});

const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
light.intensity = 1.8;

const skybox = MeshBuilder.CreateBox("skyBox", { size: 1000.0 }, scene);
const skyboxMaterial = new StandardMaterial("skyBox", scene);
skyboxMaterial.backFaceCulling = false;
skyboxMaterial.reflectionTexture = skyboxTexture;

skyboxMaterial.diffuseColor = new Color3(0, 0, 0);
skyboxMaterial.specularColor = new Color3(0, 0, 0);
skybox.material = skyboxMaterial;
let tshirtMaterial: PBRMaterial;
engine.runRenderLoop(function () {
  if (state === "PARSING") {
    frameCount++;
    if (frameCount > 10) {
      loading.classList.add("hidden");
      panel.classList.remove("hidden");
      tshirtMaterial = tshirt?.material as PBRMaterial;
      updateTexture();

      state = "READY";
    }
  }
  if (  tshirt && state === "READY") {
    tshirt.rotate(Axis.Y, 0.005);
  }
  scene.render();
});

window.addEventListener("resize", function () {
  engine.resize();
});

function updateTexture() {
  if (!tshirt) {
    return;
  }
  ctx.drawImage(img, 0, 0);
  ctx.fillStyle = "#fff";
  ctx.font = "bold 50px sans-serif";
  ctx.fillText(input.value, 690, 220);

  const myDynamicTexture = new DynamicTexture(
    "shirt ("+input.value+")",
    document.getElementById("texture"),
    scene,false,Texture.TRILINEAR_SAMPLINGMODE,Engine.TEXTUREFORMAT_RGBA,true
  );
  
  myDynamicTexture.vScale=-1
  myDynamicTexture.wrapV=1

  myDynamicTexture.update();
  tshirtMaterial.albedoTexture = myDynamicTexture;
}

input.addEventListener("focus", () => {
  input.select()
})
img.addEventListener("load", () => {
  updateTexture();
  input.addEventListener("input", () => {
    updateTexture();
  });
});
