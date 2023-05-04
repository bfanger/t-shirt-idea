import {Scene,Engine
  ,Vector3
  ,HemisphericLight
  ,MeshBuilder,
  ArcRotateCamera,
  CubeTexture,
  StandardMaterial,
  Color3,
  Texture,
  SceneLoader
} from "@babylonjs/core"
import "@babylonjs/loaders/glTF"
import "@babylonjs/gui"
import "@babylonjs/inspector"

const canvas= document.getElementById("canvas") as HTMLCanvasElement;
const engine = new Engine(canvas, true);

  const scene = new Scene(engine);
  // scene.debugLayer.show();
  scene.environmentTexture = new CubeTexture("/environment_4k.env", scene);

  const camera = new ArcRotateCamera("camera1", 3.3, 1.7, 5, new Vector3(0, 0, 0), scene);

  camera.setTarget(Vector3.Zero());

  camera.attachControl(canvas, true);

  SceneLoader.ImportMesh("", "/", "tshirt.glb", scene, function () {          
    const mat = scene.getMaterialByName('FABRIC 2_FRONT_93425') as StandardMaterial
    mat.reflectionTexture = new CubeTexture("/environment_4k.env", scene);
    mat.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
  });
  const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
  light.intensity = 2;

  const skybox = MeshBuilder.CreateBox("skyBox", { size: 1000.0 }, scene);
  const skyboxMaterial = new StandardMaterial("skyBox", scene);
  skyboxMaterial.backFaceCulling = false;
  skyboxMaterial.reflectionTexture = scene.environmentTexture
  skyboxMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
  skyboxMaterial.diffuseColor = new Color3(0, 0, 0);
  skyboxMaterial.specularColor = new Color3(0, 0, 0);
  skybox.material = skyboxMaterial;




  engine.runRenderLoop(function () {
    scene.render();
  });

  window.addEventListener("resize", function () {
    engine.resize();
  });