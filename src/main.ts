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
} from "@babylonjs/core";
import "@babylonjs/loaders/glTF";
import "@babylonjs/gui";
import "@babylonjs/inspector";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const engine = new Engine(canvas, true);

const scene = new Scene(engine);
// scene.debugLayer.show();
const skyboxTexture = new CubeTexture("Standard-Cube-Map/", scene);
skyboxTexture.coordinatesMode = Texture.SKYBOX_MODE;
scene.environmentTexture = skyboxTexture;

// const camera = new ArcRotateCamera("camera1", 3.3, 1.7, 5, new Vector3(0, 0, 0), scene);
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
  tshirt = scene.getMeshByName("tshirt");
  // console.log(tshirt)
  // const mat = scene.getMaterialByName('FABRIC 2_FRONT_93425') as StandardMaterial
  // mat.reflectionTexture =hdr
  // mat.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
});

const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
light.intensity = 2;

const skybox = MeshBuilder.CreateBox("skyBox", { size: 1000.0 }, scene);
const skyboxMaterial = new StandardMaterial("skyBox", scene);
skyboxMaterial.backFaceCulling = false;
skyboxMaterial.reflectionTexture = skyboxTexture;

skyboxMaterial.diffuseColor = new Color3(0, 0, 0);
skyboxMaterial.specularColor = new Color3(0, 0, 0);
skybox.material = skyboxMaterial;

engine.runRenderLoop(function () {
  if (state === "PARSING") {
    frameCount++;
    if (frameCount > 10) {
      const loading = document.getElementById("loading") as HTMLDivElement;
      loading.classList.add("hidden");
      const panel = document.getElementById("panel") as HTMLDivElement;
      panel.classList.remove("hidden");

      state = "READY";
    }
  }
  if (state === "READY" && tshirt) {
    tshirt.rotation.y += 0.01;
  }
  scene.render();
});

window.addEventListener("resize", function () {
  engine.resize();
});
