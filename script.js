const glow=document.querySelector('.cursor-glow');
window.addEventListener('pointermove',e=>{if(glow){glow.style.left=e.clientX+'px';glow.style.top=e.clientY+'px'}});

const observer=new IntersectionObserver(entries=>{
  entries.forEach((entry,i)=>{
    if(entry.isIntersecting){
      entry.target.style.transitionDelay=(Math.min(i%5,4)*70)+'ms';
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
},{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if(!reduced && window.THREE){
  const wrap=document.querySelector('.orb-wrap');
  const scene=new THREE.Scene();
  const camera=new THREE.PerspectiveCamera(40,1,.1,100);
  camera.position.z=5;
  const renderer=new THREE.WebGLRenderer({alpha:true,antialias:true});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio,1.5));
  renderer.setSize(1,1);
  renderer.domElement.style.cssText='position:absolute;inset:0;width:100%;height:100%;pointer-events:none;opacity:.5';
  wrap.appendChild(renderer.domElement);
  const group=new THREE.Group();
  scene.add(group);
  const geometry=new THREE.IcosahedronGeometry(1.7,2);
  const material=new THREE.MeshBasicMaterial({color:0x879984,wireframe:true,transparent:true,opacity:.22});
  const mesh=new THREE.Mesh(geometry,material);
  group.add(mesh);
  const points=new THREE.Points(geometry,new THREE.PointsMaterial({color:0xdde7d9,size:.025,transparent:true,opacity:.55}));
  group.add(points);
  function resize(){const r=wrap.getBoundingClientRect();renderer.setSize(r.width,r.height,false);camera.aspect=r.width/r.height;camera.updateProjectionMatrix()}
  resize();window.addEventListener('resize',resize,{passive:true});
  let scroll=0,target=0;
  window.addEventListener('scroll',()=>target=window.scrollY*.0005,{passive:true});
  function tick(t){scroll+=(target-scroll)*.04;group.rotation.x=t*.00008+scroll;group.rotation.y=t*.00011+scroll*1.4;renderer.render(scene,camera);requestAnimationFrame(tick)}
  requestAnimationFrame(tick);
}
