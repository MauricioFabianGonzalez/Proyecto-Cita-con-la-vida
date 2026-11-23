/* Lumi 3D: personaje geométrico gratuito animado con Three.js (MIT).
 * Se muestra únicamente si WebGL + el módulo cargan; la imagen 2D es el respaldo.
 */
export async function mountLumi3D(toggle, reducedMotion) {
  if (!toggle || !window.WebGLRenderingContext) return false;
  const THREE = await import('./vendor/three.module.min.js');
  const canvas = document.createElement('canvas');
  canvas.className = 'lumi-3d-canvas';
  canvas.setAttribute('aria-hidden','true');
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'low-power'});
  } catch (_) { return false; }
  renderer.setClearColor(0,0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1,1.3));
  renderer.outputColorSpace=THREE.SRGBColorSpace;
  renderer.toneMapping=THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure=1.5;
  const scene=new THREE.Scene();
  const camera=new THREE.OrthographicCamera(-1.76,1.76,1.95,-1.95,.1,40);
  camera.position.set(0,.1,8);
  camera.lookAt(0,0,0);
  scene.add(new THREE.HemisphereLight(0xffffff,0xffb956,2.5));
  const key=new THREE.DirectionalLight(0xffe7b7,3.0);key.position.set(-3,4,6);scene.add(key);
  const rim=new THREE.PointLight(0xffae42,5.5,12);rim.position.set(2,3,-1);scene.add(rim);
  const world=new THREE.Group();scene.add(world);
  const bodyRig=new THREE.Group();world.add(bodyRig);
  const mat=(hex,opts={})=>new THREE.MeshStandardMaterial({color:hex,roughness:.48,metalness:0,...opts});
  const cream=mat(0xffd99d,{emissive:0xd27718,emissiveIntensity:.14});
  const face=mat(0xffe8b8,{emissive:0xe1a24b,emissiveIntensity:.15});
  const gold=mat(0xdca03b,{roughness:.7});
  const golden=mat(0xffcd54,{metalness:.3,roughness:.27,emissive:0xe69a17,emissiveIntensity:.25});
  const eyeWhite=mat(0xfffcf5);
  const brown=mat(0x54301f,{roughness:.25});
  const black=mat(0x160e0d,{roughness:.2});
  const coral=mat(0xe97666);
  const make=(geometry,material,parent,x=0,y=0,z=0)=>{
    const mesh=new THREE.Mesh(geometry,material);
    mesh.position.set(x,y,z);
    parent.add(mesh);
    return mesh;
  };
  const sphere=(parent,r,material,x,y,z,sx=1,sy=1,sz=1)=>{
    const o=make(new THREE.SphereGeometry(r,24,16),material,parent,x,y,z);
    o.scale.set(sx,sy,sz);return o;
  };
  // Cabeza de llamita con volumen, sin fotografía plana.
  const headRig=new THREE.Group();headRig.position.set(0,.22,.02);bodyRig.add(headRig);
  sphere(headRig,.96,face,0,.18,0,.91,.95,.75);
  const flame=make(new THREE.ConeGeometry(.54,1.15,28,2),cream,headRig,-.11,1.25,-.10);
  flame.rotation.z=-.36;
  sphere(headRig,.47,cream,-.12,.89,-.12,.83,1.0,.85);
  sphere(headRig,.34,cream,-.35,1.48,-.14,.65,1.1,.6);
  // Ojos tridimensionales, reflejos y párpados.
  const eyes=[];
  for(const sign of [-1,1]){
    const socket=new THREE.Group();socket.position.set(sign*.35,.19,.675);headRig.add(socket);
    sphere(socket,.245,eyeWhite,0,0,0,.89,1.10,.35);
    sphere(socket,.178,brown,sign*.024,-.018,.082,.95,1.08,.42);
    sphere(socket,.119,black,sign*.03,-.027,.145,.89,1.05,.52);
    sphere(socket,.048,eyeWhite,-.045,.071,.21,.7,.75,.45);
    eyes.push(socket);
    sphere(headRig,.13,coral,sign*.69,-.12,.64,1.15,.47,.17);
    const brow=make(new THREE.TorusGeometry(.22,.027,8,18,Math.PI),mat(0x9d5629),headRig,sign*.34,.56,.665);
    brow.rotation.z=Math.PI+(sign*.08);
  }
  const smile=make(new THREE.TorusGeometry(.19,.045,10,24,Math.PI),mat(0x9c4b30),headRig,0,-.31,.73);
  smile.rotation.z=Math.PI;
  sphere(headRig,.095,coral,0,-.35,.752,.9,.65,.18);
  // Cuerpo y pañuelo envolvente.
  sphere(bodyRig,.68,cream,0,-.83,0,.89,1.08,.69);
  const scarf=make(new THREE.TorusGeometry(.56,.155,12,38,Math.PI*1.65),gold,bodyRig,-.04,-.48,.29);
  scarf.rotation.z=.12;
  const tail=make(new THREE.CapsuleGeometry(.155,.5,5,12),gold,bodyRig,-.5,-1.0,.45);tail.rotation.z=-.39;
  // Cruz dorada como colgante delante del cuerpo.
  const cross=new THREE.Group();cross.position.set(.17,-1.03,.61);bodyRig.add(cross);
  make(new THREE.BoxGeometry(.12,.43,.08),golden,cross);
  make(new THREE.BoxGeometry(.3,.115,.09),golden,cross,0,.075,.004);
  const arms=[];
  for(const sign of [-1,1]){
    const arm=new THREE.Group();arm.position.set(sign*.59,-.58,0);bodyRig.add(arm);
    const armMesh=make(new THREE.CapsuleGeometry(.18,.47,5,14),cream,arm,sign*.28,-.19,0);
    armMesh.rotation.z=sign*.75;
    sphere(arm,.205,face,sign*.53,-.33,.03,.95,1,.9);
    arms.push(arm);
    sphere(bodyRig,.31,gold,sign*.32,-1.53,.15,1.17,.53,.9);
  }
  // Luz ambiental suave, sin reproducir videos.
  const halo=new THREE.PointLight(0xffd881,2.6,5);halo.position.set(0,1.2,1.4);scene.add(halo);
  toggle.insertBefore(canvas,toggle.firstChild);
  const backup=toggle.querySelector('img');
  const widget=toggle.closest('.lumi-widget');
  let running=true;
  let currentWidth=0,currentHeight=0;
  let tick=0;
  let lastFrame=0;
  let waveUntil=0;
  let blinkTime=0;
  let blinkNext=2.5;
  let gaze=0;
  const clock=new THREE.Clock();
  function resize(){
    const r=toggle.getBoundingClientRect();
    const w=Math.max(2,Math.round(r.width));
    const h=Math.max(2,Math.round(r.height));
    if(w===currentWidth&&h===currentHeight)return;
    currentWidth=w;currentHeight=h;
    renderer.setSize(w,h,false);
    const ratio=w/h;
    camera.left=-2.05*ratio;camera.right=2.05*ratio;
    camera.top=2.05;camera.bottom=-2.05;camera.updateProjectionMatrix();
  }
  const onTouch=()=>{waveUntil=clock.getElapsedTime()+1.45;};
  toggle.addEventListener('pointerdown',onTouch,{passive:true});
  const contextLost=(e)=>{
    e.preventDefault();running=false;toggle.classList.remove('lumi-3d-active');
  };
  canvas.addEventListener('webglcontextlost',contextLost,false);
  function frame(timestamp){
    if(!running||!document.body.contains(toggle))return;
    requestAnimationFrame(frame);
    if(document.hidden)return;
    // No más de 30 fps para reducir carga en teléfonos.
    if(timestamp-lastFrame<33)return;lastFrame=timestamp;
    resize();
    const t=clock.getElapsedTime();
    const state=widget?.dataset.state || 'float';
    const reduced=!!reducedMotion.matches;
    if(!reduced){
      world.position.y=Math.sin(t*1.7)*.07;
      world.rotation.y=Math.sin(t*.64)*.11;
      bodyRig.rotation.z=Math.sin(t*1.2)*.022;
      headRig.rotation.z=Math.sin(t*.9)*.045;
      if(state==='look'){
        headRig.rotation.y=-.28;gaze=-.08;
      }else{headRig.rotation.y=Math.sin(t*.65)*.08;gaze=0;}
      if(state==='sit'){
        bodyRig.position.y=-.23;
        bodyRig.scale.y=.89;
      }else{bodyRig.position.y=0;bodyRig.scale.y=1;}
      const wave=state==='wave'||t<waveUntil||widget?.classList.contains('lumi-open');
      arms[1].rotation.z=wave ? -1.65+Math.sin(t*10)*.32 : Math.sin(t*1.2)*.07;
      arms[0].rotation.z=Math.sin(t*.9)*.055;
      headRig.rotation.x=state==='yawn' ? -.19 : .015*Math.sin(t*.6);
      if(t>blinkNext){blinkTime=t;blinkNext=t+3+Math.random()*3.5;}
      const blinking=Math.max(0,1-Math.abs(t-blinkTime-.085)/.10);
      for(const eye of eyes){eye.scale.y=1-.88*blinking;eye.position.x=(eye.position.x<0?-.35:.35)+gaze;}
      smile.scale.x=state==='yawn'?1.25:1;
      smile.scale.y=state==='yawn'?1.5:1;
    }else{
      world.position.y=0;world.rotation.y=0;bodyRig.rotation.z=0;
      headRig.rotation.set(0,0,0);bodyRig.position.y=0;bodyRig.scale.y=1;
      eyes.forEach((e,i)=>{e.scale.y=1;e.position.x=(i===0?-.35:.35);});
      arms.forEach(a=>a.rotation.z=0);
    }
    renderer.render(scene,camera);
  }
  try{
    resize();
    renderer.render(scene,camera);
    toggle.classList.add('lumi-3d-active');
    requestAnimationFrame(frame);
  }catch(err){
    running=false;
    canvas.remove();
    renderer.dispose();
    return false;
  }
  return true;
}
