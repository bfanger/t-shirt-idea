<script lang="ts">
  import { onMount } from "svelte";

  import {
    Canvas,
    Scene,
    PerspectiveCamera,
    DirectionalLight,
    PCFSoftShadowMap,
    AmbientLight,
    PlaneBufferGeometry,
    Mesh,
    MeshStandardMaterial,
    WebGLRenderer,
    OrbitControls,
    DoubleSide,
    MathUtils,
    CanvasTexture,
    GLTFLoader,
    Geometry,
  } from "https://unpkg.com/svelthree@latest/dist/svelthree.mjs";

  export let name: string;

  let sourceTexture: ImageBitmap | undefined;
  let mesh: Mesh;

  let shirtGeometry: Geometry;
  const paintCanvas = document.createElement("canvas");
  paintCanvas.style.width = "100px";
  const ctx = paintCanvas.getContext("2d") as CanvasRenderingContext2D;
  ctx.canvas.width = 1024;
  ctx.canvas.height = 1024;
  ctx.fillStyle = "#F00";
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  const paintTexture = new CanvasTexture(ctx.canvas);
  paintTexture.flipY = false;
  let shirtMaterial = new MeshStandardMaterial();
  shirtMaterial.map = paintTexture;

  function updateTexture(name: string, sourceTexture: ImageBitmap | undefined) {
    if (sourceTexture) {
      ctx.drawImage(sourceTexture, 0, 0);
    }
    ctx.fillStyle = "#fff";
    ctx.font = "bold 50px sans-serif";
    ctx.fillText(name, 700, 200);
    paintTexture.needsUpdate = true;
  }

  $: updateTexture(name, sourceTexture);

  let div: HTMLDivElement;
  onMount(() => {
    div.appendChild(paintCanvas);
  });

  const loader = new GLTFLoader();

  loader.load("dist/assets/t-shirt.glb", (gltf: any) => {
    const shirt = gltf.scene.getObjectByName("tshirt") as THREE.Mesh;
    shirtGeometry = shirt.geometry as Geometry;
    sourceTexture = shirt.material.map.image;
  });

  let floorGeometry = new PlaneBufferGeometry(4, 4, 1);
  let floorMaterial = new MeshStandardMaterial();
</script>

<Canvas let:sti w={500} h={500}>
  <Scene {sti} let:scene id="scene1" props={{ background: 0xedf2f7 }}>
    <PerspectiveCamera {scene} id="cam1" pos={[0, 0, 3]} lookAt={[0, 0, 0]} />
    <AmbientLight {scene} intensity={1.75} />
    <DirectionalLight
      {scene}
      pos={[1, 2, 1]}
      intensity={0.2}
      shadowMapSize={512 * 8}
      castShadow
    />
    {#if shirtGeometry && shirtMaterial}
      <Mesh
        bind:this={mesh}
        {scene}
        geometry={shirtGeometry}
        material={shirtMaterial}
        pos={[0, 0, 0]}
        rot={[0, 0, 0]}
        castShadow
        receiveShadow
      />
    {/if}

    <Mesh
      {scene}
      geometry={floorGeometry}
      material={floorMaterial}
      mat={{
        roughness: 0.5,
        metalness: 0.5,
        side: DoubleSide,
        color: 0xf7fafc,
      }}
      pos={[0, -0.501, 0]}
      rot={[MathUtils.degToRad(-90), 0, 0]}
      scale={[1, 1, 1]}
      receiveShadow
    />

    <OrbitControls {scene} autoRotate enableDamping />
  </Scene>

  <WebGLRenderer
    {sti}
    sceneId="scene1"
    camId="cam1"
    config={{ antialias: true, alpha: true }}
    enableShadowMap
    shadowMapType={PCFSoftShadowMap}
  />
</Canvas>

<div bind:this={div} />
