
'use strict';

// ================================================================
// CONFIG
// ================================================================
const CFG = {
  W: 360, H: 640,
  TILE: 32,
  FPS: 60,
  // Palette
  C: {
    bg:'#07071a', floor1:'#12122a', floor2:'#14143a', wall:'#0a0a1c',
    wallTop:'#1a1a3a', door:'#3a2a10', stair:'#00ffcc',
    player:'#e8e8ff', enemy:'#cc4444', boss:'#ff2266',
    gold:'#ffd700', mana:'#4488ff', hp:'#ff4455',
    ui:'#1a1a3a', uiBorder:'#4a3a8a', uiGlow:'#8833ff',
    neon1:'#cc44ff', neon2:'#00ccff', neon3:'#ff4488',
    text:'#e8e8ff', textDim:'#8888aa', textGold:'#ffd700',
    shadow:'rgba(0,0,0,0.8)',
  },
  // Classes
  CLASSES:[
    {id:'warrior', name:'Chiến Binh Bóng Đêm', desc:'Cận chiến áp sát, dồn sát thương',
     color:'#aa88ff', accentColor:'#6644aa',
     hp:130,maxHp:130,mp:65,maxMp:65,atk:18,spd:2.45,def:11,crit:5,
     skillName:'Slam Bóng Đêm',skillDesc:'Đập đất tạo vòng nổ và rung màn hình',skillCd:7,skillMp:18,
     ranged:false, attackRange:50, attackRate:0.48},
    {id:'mage', name:'Pháp Sư Ánh Sương', desc:'Đánh xa, sát thương cao',
     color:'#44ccff', accentColor:'#2288aa',
     hp:80,maxHp:80,mp:120,maxMp:120,atk:25,spd:3.35,def:3,crit:10,
     skillName:'Thiên Thạch Hạ',skillDesc:'Gọi meteor strike có telegraph và hitstop',skillCd:5,skillMp:30,
     ranged:true, attackRange:195, attackRate:0.8},
    {id:'rogue', name:'Thích Khách Hư Vô', desc:'Siêu nhanh, crit cao',
     color:'#ff88cc', accentColor:'#aa4488',
     hp:95,maxHp:95,mp:80,maxMp:80,atk:15,spd:4.85,def:6,crit:20,
     skillName:'Ảnh Phân Thân',skillDesc:'Triệu hồi clone entity có AI riêng',skillCd:6,skillMp:25,
     ranged:false, attackRange:62, attackRate:0.36},
  ],
  // Enemies
  ENEMIES:[
    {id:'rat',name:'Chuột Hầm Mộ',color:'#aa8855',hp:20,atk:5,spd:3.5,exp:5,gold:[1,3],size:12,ranged:false,floor:1},
    {id:'zombie',name:'Xác Sống',color:'#88aa66',hp:45,atk:8,spd:1.2,exp:12,gold:[2,5],size:16,ranged:false,floor:1},
    {id:'darkMage',name:'Pháp Sư Bóng Tối',color:'#8833cc',hp:35,atk:18,spd:2.0,exp:20,gold:[3,8],size:14,ranged:true,floor:2},
    {id:'larva',name:'Ấu Trùng Lớn',color:'#88cc44',hp:60,atk:12,spd:5.0,exp:18,gold:[2,6],size:18,ranged:false,floor:3},
    {id:'skeleton',name:'Chiến Binh Xương',color:'#ccccaa',hp:55,atk:14,spd:2.5,exp:22,gold:[4,10],size:15,ranged:false,floor:2},
  ],
  BOSS:{id:'guardian',name:'Quỷ Bảo Hộ',color:'#ff2266',hp:400,atk:28,spd:2.2,exp:200,gold:[40,80],size:36,
        phase2Hp:200,enrageMult:1.35},
  BOSSES:[
    {id:'abyssal_warden', name:'Hộ Pháp Vực Thẳm',  biome:'abyss',      color:'#00ccff',hp:400,atk:28,spd:2.2,exp:200,gold:[40,80], size:36,enrageMult:1.35},
    {id:'catacomb_lich',  name:'Xác Quỷ Vương',      biome:'catacomb',   color:'#ffbb66',hp:460,atk:32,spd:1.9,exp:240,gold:[50,95], size:38,enrageMult:1.28},
    {id:'blood_queen',    name:'Nữ Hoàng Huyết Tổ',  biome:'blood_hive', color:'#ff4477',hp:520,atk:36,spd:2.6,exp:280,gold:[60,110],size:40,enrageMult:1.40},
    {id:'void_herald',    name:'Tiên Tri Hư Không',   biome:'void',       color:'#aa55ff',hp:580,atk:40,spd:2.4,exp:320,gold:[70,130],size:42,enrageMult:1.45},
  ],
  // Upgrades pool
  UPGRADES:[
    {id:'str',name:'+STR',desc:'Tăng 3 sát thương',icon:'⚔',apply:p=>{p.atk+=3;}},
    {id:'vit',name:'+VIT',desc:'Tăng 25 máu tối đa',icon:'❤',apply:p=>{p.maxHp+=25;p.hp=Math.min(p.hp+15,p.maxHp);}},
    {id:'agi',name:'+AGI',desc:'Tăng tốc độ 0.5',icon:'💨',apply:p=>{p.spd+=0.5;}},
    {id:'int',name:'+INT',desc:'Tăng mana tối đa 30',icon:'🔮',apply:p=>{p.maxMp+=30;p.mp=Math.min(p.mp+20,p.maxMp);}},
    {id:'luk',name:'+LUK',desc:'Tăng tỉ lệ crit 5%',icon:'🍀',apply:p=>{p.crit+=5;}},
    {id:'def',name:'+DEF',desc:'Tăng 4 phòng thủ',icon:'🛡',apply:p=>{p.def+=4;}},
    {id:'hpRegen',name:'Tái sinh Máu',desc:'Hồi 1 HP/giây',icon:'💗',apply:p=>{p.hpRegen=(p.hpRegen||0)+1;}},
    {id:'mpRegen',name:'Tái sinh Mana',desc:'Hồi 3 MP/giây',icon:'💧',apply:p=>{p.mpRegen=(p.mpRegen||0)+3;}},
    {id:'goldBonus',name:'Vàng x1.5',desc:'Tăng vàng nhặt lên 50%',icon:'💰',apply:p=>{p.goldMult=(p.goldMult||1)*1.5;}},
    {id:'cdReduce',name:'Giảm Hồi Chiêu',desc:'Giảm 1.5s hồi chiêu',icon:'⚡',apply:p=>{p.skillCd=Math.max(1,p.skillCd-1.5);}},
    {id:'critDmg',name:'Sát Thương Crit',desc:'Crit gây x2.5 thay vì x2',icon:'💥',apply:p=>{p.critMult=(p.critMult||2)+0.5;}},
    {id:'thorns',name:'Gai Phòng Thủ',desc:'Phản 20% sát thương nhận',icon:'🌵',apply:p=>{p.thorns=(p.thorns||0)+0.2;}},
  ],
  // Permanent upgrades
  PERMA:[
    {id:'hp0',name:'Máu Khởi Đầu +25',cost:5,maxLevel:5,apply:(c,lv)=>c.maxHp=c.hp=c.maxHp+25},
    {id:'atk0',name:'Sát Thương +4',cost:4,maxLevel:5,apply:(c,lv)=>c.atk+=4},
    {id:'spd0',name:'Tốc Độ +0.4',cost:3,maxLevel:5,apply:(c,lv)=>c.spd+=0.4},
    {id:'gold0',name:'Vàng +18%',cost:6,maxLevel:3,apply:(c,lv)=>c.goldMult=(c.goldMult||1)*1.18},
    {id:'soul0',name:'Soul Coin +30%',cost:8,maxLevel:3,apply:(c,lv)=>c.soulMult=(c.soulMult||1)*1.30},
  ],
  TIPS:[
    'Cầu thang xuống sẽ bị khóa khi còn quái trong phòng boss!',
    'Nhấn giữ nút kỹ năng để xem thông tin chi tiết.',
    'Vàng kiếm được sẽ mang về dù bạn có thua.',
    'Thích Khách có i-frame khi dash, hãy tận dụng!',
    'Gear hiếm sẽ tạo nhịp tăng sức mạnh rõ rệt ở tầng sâu.',
    'Soul Coins dùng để nâng cấp vĩnh viễn giữa các run.',
    'Rương vàng chứa đồ hiếm hơn rương bạc.',
    'Pháp Sư có thể tấn công từ xa qua tường không?',
  ],
  // Rarity
  RARITY:['Common','Rare','Epic','Legendary'],
  RARITY_COLORS:['#aaaaaa','#4488ff','#aa44ff','#ffd700'],
  RARITY_WEIGHTS:[60,25,12,3],
  GEAR_SLOTS:['weapon','armor','ring','relic'],
  BIOMES:[
    {id:'abyss',name:'Hố Abyss',floor:'1-4',floor1:'#101026',floor2:'#1a1a44',wall:'#080816',wallTop:'#20204b',accent:'#00ccff'},
    {id:'catacomb',name:'Hầm Mộ Cổ',floor:'5-9',floor1:'#18120f',floor2:'#2a1a12',wall:'#110b08',wallTop:'#3a2217',accent:'#ffbb66'},
    {id:'blood_hive',name:'Tổ Huyết',floor:'10-14',floor1:'#1d1016',floor2:'#3a1222',wall:'#12070d',wallTop:'#4a1a2e',accent:'#ff4477'},
    {id:'void',name:'Thành Phố Hư Không',floor:'15+',floor1:'#0d1120',floor2:'#131b33',wall:'#070b14',wallTop:'#202a44',accent:'#aa55ff'},
  ],
};

// ================================================================
// UTILS
// ================================================================
const U = {
  rng:(min,max)=>Math.floor(Math.random()*(max-min+1))+min,
  rngf:(min,max)=>Math.random()*(max-min)+min,
  pick:arr=>arr[Math.floor(Math.random()*arr.length)],
  clamp:(v,min,max)=>Math.max(min,Math.min(max,v)),
  lerp:(a,b,t)=>a+(b-a)*t,
  dist:(ax,ay,bx,by)=>Math.sqrt((bx-ax)**2+(by-ay)**2),
  distSq:(ax,ay,bx,by)=>(bx-ax)**2+(by-ay)**2,
  angle:(ax,ay,bx,by)=>Math.atan2(by-ay,bx-ax),
  norm:(x,y)=>{const l=Math.sqrt(x*x+y*y)||1;return{x:x/l,y:y/l};},
  hex2rgb(hex){const r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16);return{r,g,b};},
  rgba(hex,a){const c=U.hex2rgb(hex);return`rgba(${c.r},${c.g},${c.b},${a})`;},
  weightedRandom(weights){
    const total=weights.reduce((a,b)=>a+b,0);
    let r=Math.random()*total;
    for(let i=0;i<weights.length;i++){r-=weights[i];if(r<=0)return i;}
    return weights.length-1;
  },
  vibrate(ms=20){try{if(navigator.vibrate)navigator.vibrate(ms);}catch(e){}},
  fmtNum:n=>n>=1000?`${(n/1000).toFixed(1)}K`:String(n),
};


const SAVE_VERSION = 7;

function getBiome(floor=1){
  const idx = Math.floor((Math.max(1,floor)-1)/5) % CFG.BIOMES.length;
  return CFG.BIOMES[idx] || CFG.BIOMES[0];
}
function getBoss(biomeId){
  return CFG.BOSSES.find(b=>b.biome===biomeId)||CFG.BOSSES[0];
}

const ITEM_DB = {
  potion:{id:'potion',name:'Hồng dược',icon:'❤',price:22,stack:5,desc:'Hồi 45 HP',type:'consumable',shop:true, use:(p)=>{const before=p.hp;p.hp=Math.min(p.maxHp,p.hp+45);return p.hp-before;}},
  mana:{id:'mana',name:'Lam dược',icon:'✦',price:20,stack:5,desc:'Hồi 35 MP',type:'consumable',shop:true, use:(p)=>{const before=p.mp;p.mp=Math.min(p.maxMp,p.mp+35);return p.mp-before;}},
  elixir:{id:'elixir',name:'Tinh hoa',icon:'✺',price:48,stack:3,desc:'Hồi 50 HP & MP',type:'consumable',shop:true, use:(p)=>{const bh=p.hp,bm=p.mp;p.hp=Math.min(p.maxHp,p.hp+50);p.mp=Math.min(p.maxMp,p.mp+50);return (p.hp-bh)+(p.mp-bm);}},
  bomb:{id:'bomb',name:'Lôi cầu',icon:'✹',price:40,stack:3,desc:'Gây nổ diện rộng',type:'consumable',shop:true, use:(p,game)=>{const g=game&&game.currentScene&&game.currentScene.enemies?game.currentScene:null;if(!g)return 0;let hits=0;g.enemies.forEach(e=>{if(e.dead)return;if(U.dist(p.x,p.y,e.x,e.y)<90){const dmg=35+Math.floor(p.atk*0.7);e.takeDamage(dmg,false);p.damageDealt+=dmg;g.floatingTexts.push(FX.text(e.x,e.y-18,`${dmg}`,CFG.C.textGold,11));hits++;}});for(let i=0;i<18;i++)g.particles.push(FX.particle(p.x,p.y,U.rngf(-140,140),U.rngf(-160,40),CFG.C.neon3,0.6,U.rng(3,6),'fx/skill_burst'));return hits;}},
  focus:{id:'focus',name:'Tỉnh táo',icon:'⚡',price:34,stack:3,desc:'Giảm hồi skill 2s',type:'consumable',shop:true, use:(p)=>{p.skillTimer=Math.max(0,p.skillTimer-2);return 1;}},

  abyss_blade:{id:'abyss_blade',name:'Lưỡi Hư Vô',icon:'⚔',price:180,stack:1,desc:'+12 ATK, +8% crit, -0.08s hồi đòn',type:'gear',equipSlot:'weapon',shop:true,rarity:1,minFloor:1,mods:{atk:12,crit:8,attackRate:-0.08}},
  spellblade:{id:'spellblade',name:'Song Kiếm Sao Tàn',icon:'✦',price:260,stack:1,desc:'+16 ATK, +20 MP, -0.4s hồi kỹ năng',type:'gear',equipSlot:'weapon',shop:true,rarity:2,minFloor:3,mods:{atk:16,maxMp:20,skillCd:-0.4}},
  night_mail:{id:'night_mail',name:'Áo Giáp Đêm',icon:'🛡',price:190,stack:1,desc:'+50 HP, +7 DEF, hồi máu nhẹ',type:'gear',equipSlot:'armor',shop:true,rarity:1,minFloor:2,mods:{maxHp:50,def:7,hpRegen:0.5}},
  void_cloak:{id:'void_cloak',name:'Áo Choàng Hư Không',icon:'🜁',price:280,stack:1,desc:'+30 HP, +0.35 SPD, +6 crit',type:'gear',equipSlot:'armor',shop:true,rarity:2,minFloor:4,mods:{maxHp:30,spd:0.35,crit:6,skillCd:-0.25}},
  moon_ring:{id:'moon_ring',name:'Nhẫn Trăng Tĩnh',icon:'◌',price:160,stack:1,desc:'+35 MP, +2 MP/s, -0.5s hồi kỹ năng',type:'gear',equipSlot:'ring',shop:true,rarity:1,minFloor:1,mods:{maxMp:35,mpRegen:2,skillCd:-0.5}},
  hunter_talisman:{id:'hunter_talisman',name:'Bùa Săn Mồi',icon:'✧',price:210,stack:1,desc:'+25% vàng, +20% soul coin, +4 crit',type:'gear',equipSlot:'ring',shop:true,rarity:2,minFloor:3,mods:{goldMult:0.25,soulMult:0.2,crit:4}},
  blood_amulet:{id:'blood_amulet',name:'Mặt Dây Máu',icon:'☉',price:320,stack:1,desc:'+8 ATK, +0.8 HP/s, +15% phản đòn',type:'gear',equipSlot:'relic',shop:true,rarity:3,minFloor:5,mods:{atk:8,hpRegen:0.8,thorns:0.15}},
  relic_of_endless:{id:'relic_of_endless',name:'Tàn Tích Vô Tận',icon:'∞',price:300,stack:1,desc:'+0.3 crit mult, +30 soul coin, +10 MP',type:'gear',equipSlot:'relic',shop:true,rarity:3,minFloor:6,mods:{critMult:0.3,soulMult:0.3,maxMp:10}},
};


const GEAR_ITEMS = Object.values(ITEM_DB).filter(i=>i.type==='gear');
const GEAR_SLOT_LABELS = {weapon:'Vũ khí', armor:'Giáp', ring:'Nhẫn', relic:'Di vật'};
const GEAR_SHORT = {weapon:'⚔', armor:'🛡', ring:'◌', relic:'∞'};
const GEAR_RARITY_NAMES = ['Thường','Hiếm','Rất hiếm','Sử thi','Huyền thoại'];
const GEAR_AFFIXES = [
  {key:'atk', label:'Sát Thương', mods:{atk:4}},
  {key:'vital', label:'Sinh Lực', mods:{maxHp:24,hpRegen:0.25}},
  {key:'focus', label:'Tập Trung', mods:{maxMp:18,mpRegen:0.6,skillCd:-0.12}},
  {key:'swift', label:'Linh Hoạt', mods:{spd:0.18,attackRate:-0.04}},
  {key:'ward', label:'Hộ Giáp', mods:{def:4,maxHp:12}},
  {key:'seer', label:'Bí Ẩn', mods:{crit:4,critMult:0.15}},
  {key:'thorns', label:'Gai Ngược', mods:{thorns:0.06,def:2}},
  {key:'greed', label:'Tham Lam', mods:{goldMult:0.12,soulMult:0.08}},
  {key:'endless', label:'Vô Tận', mods:{maxMp:10,skillCd:-0.18,soulMult:0.1}},
];

const LEGENDARY_EFFECTS = [
  {id:'void_echo', label:'Hư Vô Dội Lại', desc:'Đòn đánh xa tạo vọng ảnh thứ hai gây thêm sát thương', mods:{atk:6,crit:4}, slot:'weapon'},
  {id:'storm_crown', label:'Vương Miện Bão', desc:'Crit kích hoạt sét lan sang kẻ địch gần đó', mods:{crit:8,critMult:0.2}, slot:'ring'},
  {id:'blood_pact', label:'Khế Ước Huyết', desc:'Hạ gục địch hồi máu và mana tức thì', mods:{atk:8,hpRegen:0.8,thorns:0.08}, slot:'relic'},
  {id:'abyssal_resonance', label:'Cộng Hưởng Hư Không', desc:'Dùng skill tạo xung kích quanh người', mods:{maxMp:20,skillCd:-0.28}, slot:'relic'},
  {id:'gravekeeper', label:'Kẻ Đào Mộ', desc:'Mở rương giải phóng sóng xung kích nhỏ', mods:{maxHp:32,def:5}, slot:'armor'},
];

function cloneMods(mods){return mods?JSON.parse(JSON.stringify(mods)):null;}
function scaleMods(mods, scale=1){const out={};Object.entries(mods||{}).forEach(([k,v])=>{out[k]=typeof v==='number'?Number((v*scale).toFixed(3)):v;});return out;}
function gearInstanceName(base, rarity, affixes, legendary){const aff=affixes&&affixes.length?` — ${affixes.map(a=>a.label).join(' / ')}`:'';const rare=GEAR_RARITY_NAMES[rarity]||GEAR_RARITY_NAMES[0];const leg=legendary?` ★ ${legendary.label}`:'';return `${base.name} [${rare}]${leg}${aff}`;}
function pickLegendaryEffect(slot, floor, rarity){
  const pool=LEGENDARY_EFFECTS.filter(e=>!e.slot||e.slot===slot);
  if(!pool.length)return null;
  const chance = rarity>=4 ? 0.7 : (rarity===3 ? 0.35 : 0);
  if(Math.random()>chance || floor<6)return null;
  return U.pick(pool);
}
function createGearInstance(base, floor=1, rarityHint=0){
  const baseRarity = Math.max(base.rarity||0, Math.min(4, rarityHint + (Math.random()<0.35?1:0)));
  const affixCount = baseRarity<=0?0:Math.min(2, 1 + Math.floor(baseRarity/2));
  const affixPool = [...GEAR_AFFIXES].sort(()=>Math.random()-0.5);
  const affixes = affixPool.slice(0, affixCount);
  const legendary = pickLegendaryEffect(base.equipSlot, floor, baseRarity);
  const rarity = legendary ? 4 : baseRarity;
  const scale = 1 + Math.max(0, rarity)*0.12 + Math.max(0, floor-1)*0.02;
  const mods = cloneMods(base.mods||{});
  affixes.forEach(a=>{
    const scaled = scaleMods(a.mods, scale * (a.key==='atk' ? 1.15 : 1));
    Object.entries(scaled).forEach(([k,v])=>{mods[k]=(mods[k]||0)+v;});
  });
  if(rarity>=2 && Math.random()<0.4) mods.crit = (mods.crit||0) + 2;
  if(rarity>=3 && Math.random()<0.35) mods.hpRegen = (mods.hpRegen||0) + 0.2;
  if(legendary && legendary.mods){Object.entries(legendary.mods).forEach(([k,v])=>{mods[k]=(mods[k]||0)+v;});}
  const name = gearInstanceName(base, rarity, affixes, legendary);
  return {id:base.id, name, baseName:base.name, icon:base.icon, type:'gear', equipSlot:base.equipSlot, rarity, mods, baseMods:cloneMods(base.mods||{}), affixes:affixes.map(a=>a.label), legendaryId:legendary?.id||null, legendaryLabel:legendary?.label||null, legendaryDesc:legendary?.desc||null, desc:gearBonusText({mods, legendaryLabel:legendary?.label, legendaryDesc:legendary?.desc})};
}
function gearBonusText(item){
  if(!item)return '';
  const m=item.mods||item.baseMods||{};
  const parts=[];
  if(m.atk)parts.push(`${m.atk>0?'+':''}${m.atk} ATK`);
  if(m.maxHp)parts.push(`${m.maxHp>0?'+':''}${m.maxHp} HP`);
  if(m.maxMp)parts.push(`${m.maxMp>0?'+':''}${m.maxMp} MP`);
  if(m.def)parts.push(`${m.def>0?'+':''}${m.def} DEF`);
  if(m.spd)parts.push(`${m.spd>0?'+':''}${m.spd.toFixed(2)} SPD`);
  if(m.crit)parts.push(`${m.crit>0?'+':''}${m.crit}% CRIT`);
  if(m.critMult)parts.push(`${m.critMult>0?'+':''}${m.critMult.toFixed(1)}x CRIT DMG`);
  if(m.hpRegen)parts.push(`${m.hpRegen>0?'+':''}${m.hpRegen}/s HP`);
  if(m.mpRegen)parts.push(`${m.mpRegen>0?'+':''}${m.mpRegen}/s MP`);
  if(m.skillCd)parts.push(`${m.skillCd>0?'-':''}${Math.abs(m.skillCd).toFixed(1)}s skill`);
  if(m.attackRate)parts.push(`${m.attackRate>0?'+':''}${m.attackRate.toFixed(2)} atk rate`);
  if(m.goldMult)parts.push(`${Math.round(m.goldMult*100)}% gold`);
  if(m.soulMult)parts.push(`${Math.round(m.soulMult*100)}% soul`);
  if(m.thorns)parts.push(`${Math.round(m.thorns*100)}% thorns`);
  if(item.legendaryLabel)parts.push(`★ ${item.legendaryLabel}`);
  if(item.legendaryDesc)parts.push(item.legendaryDesc);
  return parts.join(' · ');
}
function rollGearLoot(floor, rarityHint=0){
  const pool=GEAR_ITEMS.filter(i=>i.minFloor<=floor&&(i.rarity||0)>=Math.max(0,rarityHint-1));
  if(!pool.length)return null;
  return createGearInstance(U.pick(pool), floor, rarityHint);
}
function buildChestLoot(chest, floor){
  const gold = Math.floor(U.rng(5,20)*(chest.rarity+1));
  const loot = {gold, item:null};
  const gearChance = [0.20,0.33,0.52,0.75][chest.rarity] || 0.2;
  if(Math.random() < gearChance){
    const gear = rollGearLoot(floor, chest.rarity);
    if(gear) loot.item = gear;
  }
  return loot;
}

const Pools = { projectile:[], particle:[], text:[] };

const Assets = {
  images:Object.create(null),
  paths:{
    'characters/warrior':'assets/characters/warrior.png',
    'characters/mage':'assets/characters/mage.png',
    'characters/rogue':'assets/characters/rogue.png',
    'enemies/rat':'assets/enemies/rat.png',
    'enemies/zombie':'assets/enemies/zombie.png',
    'enemies/darkMage':'assets/enemies/darkMage.png',
    'enemies/larva':'assets/enemies/larva.png',
    'enemies/skeleton':'assets/enemies/skeleton.png',
    'bosses/guardian':'assets/bosses/guardian.png',
    'bosses/abyssal_warden':'assets/bosses/abyssal_warden.png',
    'bosses/catacomb_lich':'assets/bosses/catacomb_lich.png',
    'bosses/blood_queen':'assets/bosses/blood_queen.png',
    'bosses/void_herald':'assets/bosses/void_herald.png',
    'fx/projectile':'assets/fx/projectile.png',
    'fx/skill_burst':'assets/fx/skill_burst.png',
    'fx/spark':'assets/fx/spark.png',
    'fx/slash':'assets/fx/slash.png',
  },
  init(){Object.entries(this.paths).forEach(([k,src])=>{const img=new Image();img.decoding='async';img.src=src;this.images[k]=img;});},
  get(key){return this.images[key]||null;},
  ready(key){const img=this.images[key];return !!(img&&img.complete&&img.naturalWidth>0);},
};

const SPRITE_META = {
  'characters/warrior':{frames:4,cols:4,w:64,h:64},
  'characters/mage':{frames:4,cols:4,w:64,h:64},
  'characters/rogue':{frames:4,cols:4,w:64,h:64},
  'enemies/rat':{frames:4,cols:4,w:48,h:48},
  'enemies/zombie':{frames:4,cols:4,w:48,h:48},
  'enemies/darkMage':{frames:4,cols:4,w:48,h:48},
  'enemies/larva':{frames:4,cols:4,w:48,h:48},
  'enemies/skeleton':{frames:4,cols:4,w:48,h:48},
  'bosses/guardian':{frames:6,cols:6,w:96,h:96},
  'bosses/abyssal_warden':{frames:6,cols:6,w:96,h:96},
  'bosses/catacomb_lich':{frames:6,cols:6,w:96,h:96},
  'bosses/blood_queen':{frames:6,cols:6,w:96,h:96},
  'bosses/void_herald':{frames:6,cols:6,w:96,h:96},
  'fx/projectile':{frames:4,cols:4,w:32,h:32},
  'fx/skill_burst':{frames:8,cols:8,w:64,h:64},
  'fx/spark':{frames:6,cols:6,w:24,h:24},
  'fx/slash':{frames:6,cols:6,w:64,h:64},
};
function drawSprite(ctx,key,frame,x,y,w,h,flip=false,alpha=1){
  const img=Assets.ready(key)?Assets.get(key):null;
  if(!img)return false;
  const meta=SPRITE_META[key]||{frames:1,cols:1,w:img.width,h:img.height};
  const fw=meta.w||img.width, fh=meta.h||img.height;
  const cols=meta.cols||meta.frames||1;
  const total=meta.frames||1;
  const f=((Math.floor(frame)||0)%total+total)%total;
  const sx=(f%cols)*fw;
  const sy=Math.floor(f/cols)*fh;
  ctx.save();ctx.globalAlpha=alpha;
  if(flip){ctx.translate(x+w,y);ctx.scale(-1,1);ctx.drawImage(img,sx,sy,fw,fh,0,0,w,h);}else{ctx.drawImage(img,sx,sy,fw,fh,x,y,w,h);}
  ctx.restore();
  return true;
}

const FX = {
  projectile:(x=0,y=0,vx=0,vy=0,dmg=0,color=CFG.C.neon1,isPlayer=true,size=6,sprite=null)=>{const o=Pools.projectile.pop()||new Projectile();o.reset(x,y,vx,vy,dmg,color,isPlayer,size,sprite);return o;},
  particle:(x=0,y=0,vx=0,vy=0,color=CFG.C.neon1,life=0.5,size=4,sprite=null)=>{const o=Pools.particle.pop()||new Particle();o.reset(x,y,vx,vy,color,life,size,sprite);return o;},
  text:(x=0,y=0,text='',color=CFG.C.text,size=14)=>{const o=Pools.text.pop()||new FloatingText();o.reset(x,y,text,color,size);return o;},
  releaseProjectile:(o)=>{if(Pools.projectile.length<100)Pools.projectile.push(o);},
  releaseParticle:(o)=>{if(Pools.particle.length<100)Pools.particle.push(o);},
  releaseText:(o)=>{if(Pools.text.length<100)Pools.text.push(o);},
};

const SAVE_UTIL = {
  normalizeMeta(data){const base={soulCoins:0,permaUpgrades:{},bestFloor:0};if(!data||typeof data!=='object')return base;return {soulCoins:Number.isFinite(data.soulCoins)?data.soulCoins:base.soulCoins,permaUpgrades:data.permaUpgrades&&typeof data.permaUpgrades==='object'?data.permaUpgrades:{},bestFloor:Number.isFinite(data.bestFloor)?data.bestFloor:base.bestFloor,version:SAVE_VERSION};},
  normalizeRun(data){if(!data||typeof data!=='object')return null;const player=data.player&&typeof data.player==='object'?data.player:{};return {version:SAVE_VERSION,classId:typeof data.classId==='string'?data.classId:'warrior',floor:Number.isFinite(data.floor)?data.floor:1,player:{...player,inventory:Array.isArray(player.inventory)?player.inventory:[],quickSlots:Array.isArray(player.quickSlots)?player.quickSlots.slice(0,3).concat([null,null,null]).slice(0,3):[null,null,null],equipment:player.equipment&&typeof player.equipment==='object'?player.equipment:{weapon:null,armor:null,ring:null,relic:null}},chests:Array.isArray(data.chests)?data.chests:[]};},
};

// ================================================================
// AUDIO ENGINE (Procedural Web Audio)
// ================================================================
class AudioEngine {
  constructor(){
    this.ctx=null; this.enabled=true; this.vol=0.5;
    this.bgmNode=null; this.bgmGain=null;
  }
  init(){
    try{this.ctx=new(window.AudioContext||window.webkitAudioContext)();}catch(e){this.enabled=false;}
  }
  resume(){if(this.ctx&&this.ctx.state==='suspended')this.ctx.resume();}
  _gain(vol){const g=this.ctx.createGain();g.gain.value=vol*this.vol;g.connect(this.ctx.destination);return g;}
  sfx(type){
    if(!this.enabled||!this.ctx)return;
    this.resume();
    const ac=this.ctx,now=ac.currentTime;
    const g=this._gain(0.3),o=ac.createOscillator();
    o.connect(g);
    switch(type){
      case'hit':o.type='sawtooth';o.frequency.setValueAtTime(220,now);o.frequency.exponentialRampToValueAtTime(110,now+0.08);g.gain.exponentialRampToValueAtTime(0.001,now+0.1);o.start(now);o.stop(now+0.1);break;
      case'enemyDeath':o.type='square';o.frequency.setValueAtTime(330,now);o.frequency.exponentialRampToValueAtTime(55,now+0.2);g.gain.exponentialRampToValueAtTime(0.001,now+0.2);o.start(now);o.stop(now+0.2);break;
      case'playerHit':o.type='sawtooth';o.frequency.setValueAtTime(150,now);o.frequency.exponentialRampToValueAtTime(80,now+0.15);g.gain.value=0.5*this.vol;g.gain.exponentialRampToValueAtTime(0.001,now+0.15);o.start(now);o.stop(now+0.15);break;
      case'collect':o.type='sine';o.frequency.setValueAtTime(440,now);o.frequency.exponentialRampToValueAtTime(880,now+0.1);g.gain.exponentialRampToValueAtTime(0.001,now+0.15);o.start(now);o.stop(now+0.15);break;
      case'levelup':[523,659,784,1047].forEach((f,i)=>{const oo=ac.createOscillator(),gg=this._gain(0.2);oo.connect(gg);oo.type='sine';oo.frequency.value=f;gg.gain.setValueAtTime(0.2*this.vol,now+i*0.1);gg.gain.exponentialRampToValueAtTime(0.001,now+i*0.1+0.15);oo.start(now+i*0.1);oo.stop(now+i*0.1+0.15);});break;
      case'skill':o.type='square';o.frequency.setValueAtTime(880,now);o.frequency.exponentialRampToValueAtTime(220,now+0.3);g.gain.exponentialRampToValueAtTime(0.001,now+0.3);o.start(now);o.stop(now+0.3);break;
      case'dash':o.type='sine';o.frequency.setValueAtTime(660,now);o.frequency.exponentialRampToValueAtTime(1320,now+0.05);g.gain.exponentialRampToValueAtTime(0.001,now+0.1);o.start(now);o.stop(now+0.1);break;
      case'stairs':o.type='sine';[262,330,392].forEach((f,i)=>{const oo=ac.createOscillator(),gg=this._gain(0.15);oo.connect(gg);oo.frequency.value=f;oo.start(now+i*0.08);oo.stop(now+i*0.08+0.2);});break;
      case'uiClick':o.type='sine';o.frequency.setValueAtTime(600,now);g.gain.setValueAtTime(0.15*this.vol,now);g.gain.exponentialRampToValueAtTime(0.001,now+0.08);o.start(now);o.stop(now+0.08);break;
    }
  }
  startBgm(type){
    if(!this.enabled||!this.ctx)return;
    this.stopBgm();
    this.resume();
    // Simple procedural bgm using oscillators
    const ac=this.ctx;
    this.bgmGain=ac.createGain();
    this.bgmGain.gain.value=0.08*this.vol;
    this.bgmGain.connect(ac.destination);
    const notes=type==='boss'?[55,73,82,65,49]:[55,62,49,58,52];
    let ni=0;
    const playNote=()=>{
      if(!this.bgmGain)return;
      const o=ac.createOscillator();
      o.type=type==='boss'?'sawtooth':'triangle';
      o.frequency.value=notes[ni%notes.length];
      o.connect(this.bgmGain);
      const now=ac.currentTime;
      o.start(now);o.stop(now+0.4);
      ni++;
      this._bgmTimer=setTimeout(playNote,450);
    };
    playNote();
  }
  stopBgm(){clearTimeout(this._bgmTimer);if(this.bgmGain){this.bgmGain.gain.exponentialRampToValueAtTime(0.0001,this.ctx.currentTime+0.3);this.bgmGain=null;}}
}

// ================================================================
// DUNGEON GENERATOR
// ================================================================
class DungeonGen {
  constructor(){this.TILE_EMPTY=0;this.TILE_FLOOR=1;this.TILE_WALL=2;this.TILE_DOOR=3;this.TILE_STAIR=4;this.TILE_CHEST=5;}

  generate(floor){
    const W=50,H=50;
    const tiles=Array.from({length:H},()=>new Uint8Array(W));
    const rooms=[]; const numRooms=U.rng(7+Math.floor(floor/2),10+Math.floor(floor/2));

    const carvePlus=(x,y)=>{
      for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){
        const ny=y+dy,nx=x+dx;
        if(ny>=0&&ny<H&&nx>=0&&nx<W&&tiles[ny][nx]===this.TILE_EMPTY)tiles[ny][nx]=this.TILE_FLOOR;
      }
    };
    const carveH=(y,x1,x2)=>{
      for(let x=Math.min(x1,x2);x<=Math.max(x1,x2);x++){tiles[y][x]=this.TILE_FLOOR;carvePlus(x,y);}
    };
    const carveV=(x,y1,y2)=>{
      for(let y=Math.min(y1,y2);y<=Math.max(y1,y2);y++){tiles[y][x]=this.TILE_FLOOR;carvePlus(x,y);}
    };

    // Place rooms
    for(let i=0;i<220&&rooms.length<numRooms;i++){
      const rw=U.rng(5,10),rh=U.rng(5,9);
      const rx=U.rng(1,W-rw-2),ry=U.rng(1,H-rh-2);
      const r={x:rx,y:ry,w:rw,h:rh,cx:rx+Math.floor(rw/2),cy:ry+Math.floor(rh/2)};
      if(!rooms.some(e=>rx<e.x+e.w+2&&rx+rw+2>e.x&&ry<e.y+e.h+2&&ry+rh+2>e.y)){
        rooms.push(r);
        for(let y=ry;y<ry+rh;y++)for(let x=rx;x<rx+rw;x++)tiles[y][x]=this.TILE_FLOOR;
      }
    }

    // Connect rooms with wider corridors
    for(let i=1;i<rooms.length;i++){
      const a=rooms[i-1],b=rooms[i];
      if(Math.random()<0.5){
        carveH(a.cy,a.cx,b.cx);
        carveV(b.cx,a.cy,b.cy);
      } else {
        carveV(a.cx,a.cy,b.cy);
        carveH(b.cy,a.cx,b.cx);
      }
    }

    // Place stairs in last room
    const lastRoom=rooms[rooms.length-1];
    tiles[lastRoom.cy][lastRoom.cx]=this.TILE_STAIR;

    // Spawn points
    const startRoom=rooms[0];
    const playerStart={x:startRoom.cx*CFG.TILE+CFG.TILE/2,y:startRoom.cy*CFG.TILE+CFG.TILE/2};

    // Place enemies
    const enemies=[];
    const isBossFloor=floor%5===0;
    if(isBossFloor){
      // Boss in last room
      enemies.push({type:'boss',x:lastRoom.cx*CFG.TILE+CFG.TILE/2,y:(lastRoom.cy-1)*CFG.TILE+CFG.TILE/2});
      // Fill other rooms
      for(let ri=1;ri<rooms.length-1;ri++){
        const rm=rooms[ri]; const n=U.rng(3,5);
        for(let ei=0;ei<n;ei++){
          const ex=U.rng(rm.x+1,rm.x+rm.w-2)*CFG.TILE+CFG.TILE/2;
          const ey=U.rng(rm.y+1,rm.y+rm.h-2)*CFG.TILE+CFG.TILE/2;
          enemies.push({type:this._pickEnemy(floor),x:ex,y:ey});
        }
      }
    } else {
      for(let ri=1;ri<rooms.length;ri++){
        const rm=rooms[ri]; const n=U.rng(3,Math.min(6,3+Math.floor(floor/2)));
        for(let ei=0;ei<n;ei++){
          const ex=U.rng(rm.x+1,rm.x+rm.w-2)*CFG.TILE+CFG.TILE/2;
          const ey=U.rng(rm.y+1,rm.y+rm.h-2)*CFG.TILE+CFG.TILE/2;
          enemies.push({type:this._pickEnemy(floor),x:ex,y:ey});
        }
      }
    }

    // Place chests
    const chests=[];
    for(let ri=1;ri<rooms.length-1;ri+=2){
      const rm=rooms[ri];
      chests.push({x:U.rng(rm.x+1,rm.x+rm.w-2)*CFG.TILE+CFG.TILE/2,
                   y:U.rng(rm.y+1,rm.y+rm.h-2)*CFG.TILE+CFG.TILE/2,
                   rarity:U.weightedRandom([55,30,12,3]),opened:false});
    }

    return{tiles,W,H,rooms,playerStart,enemies,chests,isBossFloor};
  }

  _pickEnemy(floor){
    const eligible=CFG.ENEMIES.filter(e=>e.floor<=floor);
    return U.pick(eligible).id;
  }
}

// ================================================================
// FLOATING TEXT
// ================================================================
class FloatingText {
  constructor(x=0,y=0,text='',color=CFG.C.text,size=14){this.reset(x,y,text,color,size);}
  reset(x=0,y=0,text='',color=CFG.C.text,size=14){this.x=x;this.y=y;this.text=text;this.color=color;this.size=size;this.vy=-60;this.life=1.2;this.maxLife=1.2;this.dead=false;}
  update(dt){this.y+=this.vy*dt;this.vy*=0.92;this.life-=dt;if(this.life<=0)this.dead=true;}
  draw(ctx,cx,cy){if(this.dead)return;const a=this.life/this.maxLife;ctx.save();ctx.globalAlpha=a;ctx.font=`bold ${this.size}px 'Courier New', monospace`;ctx.fillStyle=this.color;ctx.textAlign='center';ctx.shadowColor=this.color;ctx.shadowBlur=6;ctx.fillText(this.text,this.x-cx,this.y-cy);ctx.restore();}
}

// ================================================================
// PROJECTILE
// ================================================================
class Projectile {
  constructor(x=0,y=0,vx=0,vy=0,dmg=0,color=CFG.C.neon1,isPlayer=true,size=6,sprite=null){this.reset(x,y,vx,vy,dmg,color,isPlayer,size,sprite);}
  reset(x=0,y=0,vx=0,vy=0,dmg=0,color=CFG.C.neon1,isPlayer=true,size=6,sprite=null){this.x=x;this.y=y;this.vx=vx;this.vy=vy;this.dmg=dmg;this.color=color;this.isPlayer=isPlayer;this.size=size;this.sprite=sprite;this.dead=false;this.life=3.0;}
  update(dt,dungeon){this.x+=this.vx*dt;this.y+=this.vy*dt;this.life-=dt;if(this.life<=0)this.dead=true;const tx=Math.floor(this.x/CFG.TILE),ty=Math.floor(this.y/CFG.TILE);if(tx<0||ty<0||tx>=dungeon.W||ty>=dungeon.H||dungeon.tiles[ty][tx]===2){this.dead=true;}}
  draw(ctx,cx,cy){const sx=this.x-cx,sy=this.y-cy;const key=this.sprite&&Assets.ready(this.sprite)?this.sprite:(Assets.ready('fx/projectile')?'fx/projectile':null);ctx.save();
    // Motion blur trail
    const speed=Math.hypot(this.vx,this.vy);
    if(speed>50){
      const trailCount=3;
      for(let i=1;i<=trailCount;i++){
        const tx=sx-this.vx*0.006*i, ty=sy-this.vy*0.006*i;
        const ta=0.18*(1-i/trailCount);
        ctx.globalAlpha=ta;
        ctx.fillStyle=this.color;
        ctx.beginPath();ctx.arc(tx,ty,this.size*(1-i*0.25),0,Math.PI*2);ctx.fill();
      }
    }
    if(key){
      const meta=SPRITE_META[key]||{frames:1,cols:1,w:32,h:32};
      const frame=Math.floor((1-Math.max(0,this.life)/3)*(meta.frames||1));
      ctx.globalAlpha=1;
      ctx.shadowColor=this.color;ctx.shadowBlur=14;
      drawSprite(ctx,key,frame,sx-this.size*2,sy-this.size*2,this.size*4,this.size*4,false,0.98);
      // Bright core on top
      ctx.globalAlpha=0.7;
      ctx.fillStyle='#ffffff';
      ctx.shadowBlur=6;
      ctx.beginPath();ctx.arc(sx,sy,this.size*0.5,0,Math.PI*2);ctx.fill();
    }else{
      ctx.globalAlpha=1;
      ctx.shadowColor=this.color;ctx.shadowBlur=10;
      ctx.fillStyle=this.color;
      ctx.beginPath();ctx.arc(sx,sy,this.size,0,Math.PI*2);ctx.fill();
      ctx.globalAlpha=0.6;
      ctx.fillStyle='#ffffff';
      ctx.beginPath();ctx.arc(sx,sy,this.size*0.45,0,Math.PI*2);ctx.fill();
    }
    ctx.restore();}
}

// ================================================================
// PARTICLE
// ================================================================
class Particle {
  constructor(x=0,y=0,vx=0,vy=0,color=CFG.C.neon1,life=0.5,size=4,sprite=null){this.reset(x,y,vx,vy,color,life,size,sprite);}
  reset(x=0,y=0,vx=0,vy=0,color=CFG.C.neon1,life=0.5,size=4,sprite=null){this.x=x;this.y=y;this.vx=vx;this.vy=vy;this.color=color;this.life=life;this.maxLife=life;this.size=size||4;this.sprite=sprite;this.dead=false;}
  update(dt){this.x+=this.vx*dt;this.y+=this.vy*dt;this.vx*=0.9;this.vy*=0.9;this.vy+=80*dt;this.life-=dt;if(this.life<=0)this.dead=true;}
  draw(ctx,cx,cy){const a=this.life/this.maxLife;const sx=this.x-cx,sy=this.y-cy;ctx.save();ctx.globalAlpha=a;const key=this.sprite&&Assets.ready(this.sprite)?this.sprite:(Assets.ready('fx/spark')?'fx/spark':null);if(key){const meta=SPRITE_META[key]||{frames:1,cols:1,w:24,h:24};const frame=Math.floor((1-a)*(meta.frames||1));drawSprite(ctx,key,frame,sx-this.size,sy-this.size,this.size*2,this.size*2,false,a);}else{ctx.fillStyle=this.color;ctx.shadowColor=this.color;ctx.shadowBlur=4;ctx.fillRect(sx-this.size/2,sy-this.size/2,this.size,this.size);}ctx.restore();}
}


// ================================================================
// PLAYER + CLONE ALLY
// ================================================================
class CloneAlly {
  constructor(owner,x,y,scene){
    this.owner=owner;
    this.scene=scene;
    this.classId=owner.classId;
    this.spriteKey=`characters/${owner.classId}`;
    this.x=x;this.y=y;
    this.vx=0;this.vy=0;
    this.facing=Math.random()*Math.PI*2;
    this.life=8.0;
    this.maxLife=8.0;
    this.dead=false;
    this.size=14;
    this.attackTimer=U.rngf(0.12,0.35);
    this.attackCooldown=Math.max(0.24,owner.attackRate*0.8);
    this.hitFlash=0;
    this.color=owner.accentColor||CFG.C.neon1;
    this.dashPulse=0;
  }
  _passable(x,y,hw,dungeon){
    // FIX: Block TILE_EMPTY(0) AND TILE_WALL(2)
    const checks=[{x:x-hw,y:y-hw},{x:x+hw,y:y-hw},{x:x-hw,y:y+hw},{x:x+hw,y:y+hw}];
    return checks.every(p=>{const tx=Math.floor(p.x/CFG.TILE),ty=Math.floor(p.y/CFG.TILE);const t=dungeon.tiles[ty]?.[tx];return tx>=0&&ty>=0&&tx<dungeon.W&&ty<dungeon.H&&t!==0&&t!==2;});
  }
  update(dt,player,dungeon,enemies,projectiles,particles){
    if(this.dead)return;
    this.life-=dt;
    this.hitFlash=Math.max(0,this.hitFlash-dt*4);
    this.dashPulse=Math.max(0,this.dashPulse-dt*4);
    if(this.life<=0||player.dead){this.dead=true;return;}
    const target=enemies.filter(e=>!e.dead).sort((a,b)=>U.distSq(a.x,a.y,this.x,this.y)-U.distSq(b.x,b.y,this.x,this.y))[0]||null;
    let tx=player.x+Math.cos(this.facing+Math.PI)*28;
    let ty=player.y+Math.sin(this.facing+Math.PI)*28;
    if(target){
      const dist=U.dist(this.x,this.y,target.x,target.y);
      const ang=U.angle(this.x,this.y,target.x,target.y);
      this.facing=ang;
      if(dist>28){
        tx=target.x-Math.cos(ang)*20;
        ty=target.y-Math.sin(ang)*20;
      } else {
        tx=this.x; ty=this.y;
      }
      this.attackTimer-=dt;
      if(dist<34&&this.attackTimer<=0){
        this.attackTimer=this.attackCooldown;
        const dmg=Math.max(1,Math.floor(player.atk*0.72));
        target.takeDamage(dmg,false);
        player.damageDealt+=dmg;
        this.hitFlash=1;
        this.dashPulse=1;
        for(let i=0;i<4;i++)particles.push(FX.particle(target.x,target.y,U.rngf(-55,55),U.rngf(-80,-20),player.color,0.28,U.rng(2,4),'fx/slash'));
        this.scene.floatingTexts.push(FX.text(target.x,target.y-18,dmg,this.color,11));
      }
    }
    const dx=tx-this.x,dy=ty-this.y;
    const len=Math.hypot(dx,dy)||1;
    const speed=(target?2.8:1.8)*player.spd;
    this.vx=(dx/len)*speed;
    this.vy=(dy/len)*speed;
    const nx=this.x+this.vx*dt*CFG.TILE*0.5;
    const ny=this.y+this.vy*dt*CFG.TILE*0.5;
    const hw=this.size*0.45;
    if(this._passable(nx,this.y,hw,dungeon))this.x=nx;
    if(this._passable(this.x,ny,hw,dungeon))this.y=ny;
  }
  // NOTE: CloneAlly life bar drawn via alpha fade in draw() — no separate HP bar needed.

  draw(ctx,cx,cy){
    if(this.dead)return;
    const sx=this.x-cx,sy=this.y-cy;
    const a=Math.max(0.2,this.life/this.maxLife);
    ctx.save();
    ctx.globalAlpha=a;
    ctx.shadowColor=this.color;
    ctx.shadowBlur=12+this.dashPulse*8;
    const key=Assets.ready(this.spriteKey)?this.spriteKey:null;
    if(key){
      const frame=(Math.floor(performance.now()/100)+Math.floor(this.dashPulse*2))%4;
      drawSprite(ctx,key,frame,sx-24,sy-24,48,48,this.vx<0,0.92);
    }else{
      ctx.fillStyle=this.color;
      ctx.beginPath();ctx.arc(sx,sy,12,0,Math.PI*2);ctx.fill();
    }
    if(this.hitFlash>0){
      ctx.globalAlpha=Math.min(1,a*0.9+this.hitFlash*0.5);
      ctx.strokeStyle='#ffffff';ctx.lineWidth=2;ctx.beginPath();ctx.arc(sx,sy,14+this.hitFlash*4,0,Math.PI*2);ctx.stroke();
    }
    ctx.restore();
  }
}

class Player {
  constructor(classData,permaBonus){
    const d=JSON.parse(JSON.stringify(classData||CFG.CLASSES[0]));
    this.classId=d.id||'warrior';
    this.name=d.name||'Người Lạ';
    this.color=d.color||CFG.C.player;
    this.accentColor=d.accentColor||CFG.C.neon1;
    this.maxHp=d.hp||100; this.hp=this.maxHp;
    this.maxMp=d.mp||50; this.mp=this.maxMp;
    this.atk=d.atk||10; this.spd=d.spd||2; this.def=d.def||0; this.crit=d.crit||0;
    this.critMult=2;
    this.skillName=d.skillName||'Kỹ Năng';
    this.skillDesc=d.skillDesc||'';
    this.skillCd=d.skillCd||6;
    this.skillMp=d.skillMp||20;
    this.ranged=!!d.ranged;
    this.attackRange=d.attackRange||48;
    this.attackRate=d.attackRate||0.5;
    this.hpRegen=0; this.mpRegen=0; this.goldMult=1; this.soulMult=1; this.thorns=0;
    this.gold=0; this.exp=0; this.soulCoins=0; this.kills=0; this.damageDealt=0; this.damageTaken=0; this.floorTime=0;
    this.upgrades=[];
    this.x=0; this.y=0; this.facing=Math.PI/2;
    this.vx=0; this.vy=0; this.dead=false; this.hitFlash=0; this.invuln=0; this.dashTimer=0; this.dashCooldown=0;
    this.attackAnim=0; this.attackAnimStyle=''; this.attackAnimAngle=this.facing;
    this.dashDirX=0; this.dashDirY=0;
    this.attackTimer=this.attackRate;
    this.skillTimer=0;
    this.skillLevel=0; // 0=base, 1=evolved
    this._skillEvolved=false;
    this.dashTrail=[];  // [{x,y,t}] — afterimage trail for dash
    this.inventory=[];
    this.quickSlots=[null,null,null];
    this.equipment={weapon:null,armor:null,ring:null,relic:null};
    this.legendary={projectileEcho:0,critChain:0.35,critChainRange:120,skillPulse:false,chestBurst:false,killLeechHp:0,killLeechMp:0};
    this.scene=null;
    if(typeof permaBonus==='function')permaBonus(this);
    this.hp=this.maxHp;
    this.mp=this.maxMp;
  }
  _clampStats(){
    this.attackRate=Math.max(0.14,this.attackRate||0.14);
    this.skillCd=Math.max(0.5,this.skillCd||0.5);
    this.attackRange=Math.max(16,this.attackRange||16);
    this.crit=Math.max(0,Math.min(75,this.crit||0));
    this.critMult=Math.max(1.5,this.critMult||2);
    this.hp=Math.min(this.hp,this.maxHp);
    this.mp=Math.min(this.mp,this.maxMp);
  }
  _applyStatMods(mods,sign=1){
    if(!mods)return;
    const prevMaxHp=this.maxHp;
    Object.entries(mods).forEach(([k,v])=>{
      if(typeof v!=='number')return;
      const val=v*sign;
      if(k==='maxHp'){this.maxHp+=val;}
      else if(k==='maxMp'){this.maxMp+=val;}
      else if(k==='atk'){this.atk+=val;}
      else if(k==='spd'){this.spd+=val;}
      else if(k==='def'){this.def+=val;}
      else if(k==='crit'){this.crit+=val;}
      else if(k==='critMult'){this.critMult+=val;}
      else if(k==='hpRegen'){this.hpRegen=(this.hpRegen||0)+val;}
      else if(k==='mpRegen'){this.mpRegen=(this.mpRegen||0)+val;}
      else if(k==='skillCd'){this.skillCd+=val;}
      else if(k==='attackRate'){this.attackRate+=val;}
      else if(k==='attackRange'){this.attackRange+=val;}
      else if(k==='goldMult'){this.goldMult=(this.goldMult||1)*(sign>0?(1+v):1/(1+Math.max(0.01,v)));}
      else if(k==='soulMult'){this.soulMult=(this.soulMult||1)*(sign>0?(1+v):1/(1+Math.max(0.01,v)));}
      else if(k==='thorns'){this.thorns=(this.thorns||0)+val;}
    });
    if(prevMaxHp!==this.maxHp)this.hp=this.hp>this.maxHp?this.maxHp:this.hp;
    this._clampStats();
  }
  _syncLegendary(){
    this.legendary={projectileEcho:0,critChain:0.35,critChainRange:120,skillPulse:false,chestBurst:false,killLeechHp:0,killLeechMp:0};
    Object.values(this.equipment).forEach(e=>{if(e&&e.legendaryId)this._applyLegendaryEffect(e,1);});
  }
  _applyLegendaryEffect(item,sign=1){
    if(!item||!item.legendaryId)return;
    const s=sign>0?1:-1;
    switch(item.legendaryId){
      case'void_echo':this.legendary.projectileEcho=(this.legendary.projectileEcho||0)+s*1;break;
      case'storm_crown':this.legendary.critChain=Math.max(0.1,(this.legendary.critChain||0.35)+s*0.12);this.legendary.critChainRange=Math.max(60,(this.legendary.critChainRange||120)+s*12);break;
      case'blood_pact':this.legendary.killLeechHp=Math.max(0,(this.legendary.killLeechHp||0)+s*2);this.legendary.killLeechMp=Math.max(0,(this.legendary.killLeechMp||0)+s*1);break;
      case'abyssal_resonance':this.legendary.skillPulse=sign>0;break;
      case'gravekeeper':this.legendary.chestBurst=sign>0;break;
    }
  }
  _equipItem(entry,quiet=false){
    const data=entry?.data||entry;
    if(!data||data.type!=='gear')return false;
    const slot=data.equipSlot||'weapon';
    const current=this.equipment[slot];
    if(current)this._applyStatMods(current.mods||current.baseMods||{},-1);
    if(current&&current.legendaryId)this._applyLegendaryEffect(current,-1);
    this.equipment[slot]=JSON.parse(JSON.stringify(data));
    this._applyStatMods(data.mods||data.baseMods||{},1);
    this._applyLegendaryEffect(data,1);
    this._clampStats();
    if(!quiet&&this.scene){this.scene.floatingTexts.push(FX.text(this.x,this.y-42,`Trang bị: ${data.name}`,data.rarity!=null?CFG.RARITY_COLORS[data.rarity]:CFG.C.textGold,10));}
    return true;
  }
  _unequip(slot){
    const current=this.equipment[slot];
    if(!current)return false;
    this._applyStatMods(current.mods||current.baseMods||{},-1);
    if(current.legendaryId)this._applyLegendaryEffect(current,-1);
    this.addItem(current,1);
    this.equipment[slot]=null;
    this._clampStats();
    return true;
  }
  addItem(item,qty=1){
    const data=typeof item==='string'?ITEM_DB[item]:(item&&typeof item==='object'?item:null);
    if(!data)return false;
    const payload=data.type==='gear'?JSON.parse(JSON.stringify(data)):{id:data.id};
    if(data.type==='gear')payload.qty=1;
    const stackable=data.type!=='gear'&&data.stack!==1;
    if(stackable){
      const found=this.inventory.find(s=>!s.data&&s.id===data.id);
      if(found){found.qty+=qty;return true;}
    }
    for(let i=0;i<qty;i++){
      if(this.inventory.length>=12)return false;
      this.inventory.push(data.type==='gear'?{id:data.id,qty:1,data:payload}:{id:data.id,qty:1});
    }
    return true;
  }
  setQuickSlot(slot,itemId){
    if(slot<0||slot>2)return false;
    const exists=this.inventory.some(s=>s.id===itemId);
    if(!exists&&!ITEM_DB[itemId])return false;
    this.quickSlots[slot]=itemId;
    return true;
  }
  _consumeFromInventory(itemId){
    const idx=this.inventory.findIndex(s=>s.id===itemId);
    if(idx<0)return null;
    const stack=this.inventory[idx];
    if(stack.qty>1)stack.qty--;
    else this.inventory.splice(idx,1);
    return stack;
  }
  useQuickSlot(slot,game){
    if(slot<0||slot>2)return false;
    const itemId=this.quickSlots[slot];
    if(!itemId)return false;
    const entry=this.inventory.find(s=>s.id===itemId);
    const data=entry?.data||ITEM_DB[itemId];
    if(!data)return false;
    return this._useResolvedItem(data,entry,game,true);
  }
  useItem(item,game){
    const data=item?.data||ITEM_DB[item?.id||item];
    if(!data)return false;
    const entry=item?.data?item:this.inventory.find(s=>s===item||s.id===data.id);
    return this._useResolvedItem(data,entry,game,true);
  }
  _useResolvedItem(data,entry,game,fromInventory){
    if(data.type==='gear'){
      if(fromInventory&&entry){const idx=this.inventory.indexOf(entry);if(idx>=0)this.inventory.splice(idx,1);}
      return this._equipItem(data,true);
    }
    if(typeof data.use==='function'){
      const gain=data.use(this,game||this.scene?.game);
      if(fromInventory&&entry){const idx=this.inventory.indexOf(entry);if(idx>=0){if(entry.qty>1)entry.qty--;else this.inventory.splice(idx,1);}}
      return !!gain || gain===0;
    }
    return false;
  }
  update(dt,jx=0,jy=0,dungeon,projectiles){
    if(this.dead)return;
    this.hitFlash=Math.max(0,this.hitFlash-dt*6);
    this.invuln=Math.max(0,this.invuln-dt);
    this.attackTimer=Math.max(0,this.attackTimer-dt);
    this.skillTimer=Math.max(0,this.skillTimer-dt);
    this.dashCooldown=Math.max(0,this.dashCooldown-dt);
    this.floorTime=(this.floorTime||0)+dt;
    this.attackAnim=Math.max(0,(this.attackAnim||0)-dt*5.5);
    this.hp=Math.min(this.maxHp,this.hp+(this.hpRegen||0)*dt);
    this.mp=Math.min(this.maxMp,this.mp+(this.mpRegen||0)*dt);
    const dashActive=this.dashTimer>0;
    const speed=this.spd*(dashActive?3.8:1);
    let mvx=dashActive?this.dashDirX:jx, mvy=dashActive?this.dashDirY:jy;
    const mag=Math.hypot(mvx,mvy);
    if(mag>1){mvx/=mag; mvy/=mag;}
    if(mag>0.1)this.facing=Math.atan2(mvy,mvx);
    const hw=10;
    // FIX: Block TILE_EMPTY(0) AND TILE_WALL(2) — previously only blocked walls,
    // allowing the player to walk into empty (off-map) tiles.
    const passable=(x,y)=>{const pts=[{x:x-hw,y:y-hw},{x:x+hw,y:y-hw},{x:x-hw,y:y+hw},{x:x+hw,y:y+hw}];return pts.every(p=>{const tx=Math.floor(p.x/CFG.TILE),ty=Math.floor(p.y/CFG.TILE);const t=dungeon.tiles[ty]?.[tx];return tx>=0&&ty>=0&&tx<dungeon.W&&ty<dungeon.H&&t!==0&&t!==2;});};
    const steps=dashActive?4:1;
    const stepX=mvx*speed*CFG.TILE*dt/steps;
    const stepY=mvy*speed*CFG.TILE*dt/steps;
    for(let i=0;i<steps;i++){
      const nx=this.x+stepX, ny=this.y+stepY;
      if(passable(nx,this.y))this.x=nx;
      if(passable(this.x,ny))this.y=ny;
    }
    if(this.dashTimer>0){
      this.dashTimer-=dt;
      // Record afterimage trail during dash
      if(!this.dashTrail)this.dashTrail=[];
      this.dashTrail.push({x:this.x,y:this.y,a:0.7});
      if(this.dashTrail.length>6)this.dashTrail.shift();
    } else {
      // Fade out trail
      if(this.dashTrail&&this.dashTrail.length){
        this.dashTrail=this.dashTrail.filter(t=>(t.a-=dt*4)>0);
      }
    }
  }
  dash(jx=0,jy=0){
    if(this.dashCooldown>0||this.dead)return false;
    let dx=jx,dy=jy;
    if(Math.abs(dx)+Math.abs(dy)<0.1){dx=Math.cos(this.facing);dy=Math.sin(this.facing);}
    const len=Math.hypot(dx,dy)||1;
    dx/=len;dy/=len;
    this.dashDirX=dx;this.dashDirY=dy;
    this.dashTimer=0.18;
    this.dashCooldown=1.1;
    this.invuln=0.18;
    this.attackAnimStyle='dash';
    this.attackAnim=0.08;
    if(this.scene){this.scene.addShake(0.6,0.05);} 
    return true;
  }
  takeDamage(amount,source){
    if(this.dead||this.invuln>0)return 0;
    const armorScale=100/(100+Math.max(0,this.def)*4.25);
    const mitigated=Math.max(1,Math.floor(amount*armorScale));
    this.hp-=mitigated;
    this.damageTaken+=mitigated;
    this.hitFlash=1;
    this.invuln=0.05;
    if(source&&this.thorns>0&&typeof source.takeDamage==='function'){source.takeDamage(Math.max(1,Math.floor(mitigated*this.thorns)),false);}
    if(this.hp<=0){this.hp=0;this.dead=true;}
    return mitigated;
  }
  tryAttack(enemies,projectiles,particles){
    if(this.dead||this.attackTimer>0)return null;
    const target=enemies.filter(e=>!e.dead&&U.distSq(this.x,this.y,e.x,e.y)<this.attackRange*this.attackRange).sort((a,b)=>U.distSq(a.x,a.y,this.x,this.y)-U.distSq(b.x,b.y,this.x,this.y))[0]||null;
    if(!target){this.attackTimer=this.attackRate;return null;}
    const a=U.angle(this.x,this.y,target.x,target.y);
    this.attackAnim=0.18;
    this.attackAnimAngle=a;
    const crit=Math.random()*100<Math.max(0,Math.min(75,this.crit));
    const dmg=Math.max(1,Math.floor(this.atk*(crit?(this.critMult||2):1)));
    if(this.classId==='mage'){
      const speed=330;
      this.attackAnimStyle='cast';
      projectiles.push(FX.projectile(this.x,this.y,Math.cos(a)*speed,Math.sin(a)*speed,dmg,this.color,true,7,'fx/projectile'));
      // FIX: Implement void_echo legendary — echo projectile at offset angle
      if(this.legendary&&this.legendary.projectileEcho>0){
        const echoAngle=a+(Math.random()<0.5?0.28:-0.28);
        const echoDmg=Math.max(1,Math.floor(dmg*0.45));
        projectiles.push(FX.projectile(this.x,this.y,Math.cos(echoAngle)*speed*0.82,Math.sin(echoAngle)*speed*0.82,echoDmg,this.accentColor,true,5,'fx/projectile'));
      }
      for(let i=0;i<4;i++)particles.push(FX.particle(this.x,this.y,U.rngf(-20,20),U.rngf(-20,20),this.color,0.25,3,'fx/spark'));
      if(crit){for(let i=0;i<6;i++)particles.push(FX.particle(this.x,this.y,U.rngf(-35,35),U.rngf(-35,35),CFG.C.textGold,0.3,4,'fx/spark'));}
      this.attackTimer=this.attackRate;
      return {hit:true,ranged:true,target,dmg,isCrit:crit};
    }
    this.attackAnimStyle='slash';
    let _finalDmg=dmg;
    if(this._assassinMult&&this._assassinMult>0){_finalDmg=Math.floor(dmg*this._assassinMult);this._assassinMult=0;if(this.scene)this.scene.floatingTexts.push(FX.text(target.x,target.y-40,'ÁM SÁT! x3','#ffaacc',14));}
    target.takeDamage(_finalDmg,crit);
    this.damageDealt+=_finalDmg;
    for(let i=0;i<6;i++)particles.push(FX.particle(target.x,target.y,U.rngf(-70,70),U.rngf(-70,20),crit?CFG.C.textGold:this.accentColor,0.28,U.rng(2,5),'fx/slash'));
    if(this.scene&&crit){this.scene.addShake(0.35,0.04);} 
    this.attackTimer=this.attackRate;
    return {hit:true,ranged:false,target,dmg,isCrit:crit};
  }
  useSkill(enemies,projectiles,particles){
    if(this.dead||this.skillTimer>0||this.mp<this.skillMp)return false;
    this.mp=Math.max(0,this.mp-this.skillMp);
    this.skillTimer=this.skillCd;
    const scene=this.scene;
    const sq=(x,y,r)=>U.distSq(x,y,this.x,this.y)<r*r;
    if(this.classId==='warrior'){
      if(this.skillLevel>=1){
        // Evolved: Bão Tối Toàn Tập — double-radius slam + brief damage shield
        const radius=138;
        const dmgBase=Math.max(20,Math.floor(this.atk*2.4+18));
        if(scene){scene.addShake(2.5,0.18);scene.addSkillEffect({kind:'slam',x:this.x,y:this.y,radius,total:0.5,life:0.5,resolved:false,color:this.accentColor,damage:dmgBase});}
        for(let i=0;i<42;i++)particles.push(FX.particle(this.x,this.y,U.rngf(-180,180),U.rngf(-30,30),this.color,0.5,U.rng(3,6),'fx/skill_burst'));
        for(let i=0;i<24;i++)particles.push(FX.particle(this.x+U.rngf(-radius,radius),this.y+U.rngf(-radius,radius),U.rngf(-100,100),U.rngf(-100,0),this.accentColor,0.45,U.rng(2,5)));
        this.invuln=Math.max(this.invuln||0,1.2); // 1.2s damage shield
        if(scene){scene.floatingTexts.push(FX.text(this.x,this.y-52,'BÃO TỐI!',CFG.C.neon3,14));scene.floatingTexts.push(FX.text(this.x,this.y-70,'MIỄN THƯƠNG 1.2s','#aaffee',10));}
      } else {
        const radius=82;
        const dmgBase=Math.max(12,Math.floor(this.atk*1.55+10));
        if(scene){scene.addShake(1.7,0.12);scene.addSkillEffect({kind:'slam',x:this.x,y:this.y,radius,total:0.36,life:0.36,resolved:false,color:this.accentColor,damage:dmgBase});}
        for(let i=0;i<28;i++)particles.push(FX.particle(this.x,this.y,U.rngf(-120,120),U.rngf(-20,20),this.color,0.45,U.rng(2,5),'fx/skill_burst'));
        for(let i=0;i<18;i++)particles.push(FX.particle(this.x+U.rngf(-radius,radius),this.y+U.rngf(-radius,radius),U.rngf(-80,80),U.rngf(-80,0),this.accentColor,0.4,U.rng(2,4)));
        if(scene)scene.floatingTexts.push(FX.text(this.x,this.y-52,'SLAM!',CFG.C.neon3,12));
      }
      return true;
    }
    if(this.classId==='rogue'){
      if(this.skillLevel>=1){
        // Evolved: Ám Sát Hư Vô — 3 clones + 2.5s stealth + 3x dmg next hit
        if(scene){
          const ang=scene.facingAngle||this.facing||0;
          [-1,0,1].forEach((dir,i)=>{
            const ax=this.x+Math.cos(ang+dir*0.8)*22;
            const ay=this.y+Math.sin(ang+dir*0.8)*22;
            scene.addAlly(new CloneAlly(this,ax,ay,scene));
          });
          scene.addSkillEffect({kind:'cloneBurst',x:this.x,y:this.y,life:0.55,total:0.55,color:this.accentColor});
          scene.addShake(0.7,0.1);
          scene.floatingTexts.push(FX.text(this.x,this.y-48,'ÁM SÁT!',this.color,14));
          scene.floatingTexts.push(FX.text(this.x,this.y-66,'3x DMG x2.5s','#ffccee',10));
        }
        this.invuln=Math.max(this.invuln||0,2.5);
        this._assassinMult=3; // consumed on next melee hit
        for(let i=0;i<20;i++)particles.push(FX.particle(this.x,this.y,U.rngf(-110,110),U.rngf(-110,20),this.color,0.4,U.rng(2,5),'fx/slash'));
      } else {
        if(scene){
          const ang=scene.facingAngle||this.facing||0;
          const off=[-1,1];
          off.forEach((dir,i)=>{
            const ax=this.x+Math.cos(ang+dir*0.9)*18;
            const ay=this.y+Math.sin(ang+dir*0.9)*18;
            scene.addAlly(new CloneAlly(this,ax,ay,scene));
          });
          scene.addSkillEffect({kind:'cloneBurst',x:this.x,y:this.y,life:0.45,total:0.45,color:this.accentColor});
          scene.addShake(0.55,0.08);
          scene.floatingTexts.push(FX.text(this.x,this.y-48,'CLONES',this.color,12));
        }
        for(let i=0;i<12;i++)particles.push(FX.particle(this.x,this.y,U.rngf(-90,90),U.rngf(-90,20),this.color,0.35,U.rng(2,4),'fx/slash'));
      }
      return true;
    }
    if(this.classId==='mage'){
      const enemyList=enemies.filter(e=>!e.dead);
      const target=enemyList.sort((a,b)=>U.distSq(a.x,a.y,this.x,this.y)-U.distSq(b.x,b.y,this.x,this.y))[0];
      if(this.skillLevel>=1){
        // Evolved: Sao Băng Trận — 3 meteors, larger radius, chain targets
        const targets=enemyList.slice(0,3);
        for(let mi=0;mi<3;mi++){
          const tgt=targets[mi]||target;
          const tx=tgt?tgt.x+U.rngf(-12,12):this.x+Math.cos(this.facing+mi*0.4)*130;
          const ty=tgt?tgt.y+U.rngf(-12,12):this.y+Math.sin(this.facing+mi*0.4)*130;
          if(scene){
            scene.addSkillEffect({kind:'meteor',x:tx,y:ty,life:0.95+mi*0.55,total:0.95+mi*0.55,telegraph:0.55,resolved:false,color:this.color,damage:Math.max(22,Math.floor(this.atk*2.0)),radius:90,_delay:mi*0.55});
          }
        }
        if(scene){scene.addShake(0.5,0.1);scene.floatingTexts.push(FX.text(this.x,this.y-52,'SAO BĂNG x3!',CFG.C.neon2,14));}
        for(let i=0;i<14;i++)particles.push(FX.particle(this.x,this.y,U.rngf(-60,60),U.rngf(-60,60),this.color,0.5,U.rng(2,5),'fx/spark'));
      } else {
        const tx=target?target.x+U.rngf(-8,8):this.x+Math.cos(this.facing)*120;
        const ty=target?target.y+U.rngf(-8,8):this.y+Math.sin(this.facing)*120;
        if(scene){
          scene.addSkillEffect({kind:'meteor',x:tx,y:ty,life:0.95,total:0.95,telegraph:0.58,resolved:false,color:this.color,damage:Math.max(18,Math.floor(this.atk*2.2)),radius:78});
          scene.addShake(0.35,0.08);
          scene.floatingTexts.push(FX.text(this.x,this.y-52,'METEOR',CFG.C.neon2,12));
        }
        for(let i=0;i<8;i++)particles.push(FX.particle(this.x,this.y,U.rngf(-30,30),U.rngf(-30,30),this.color,0.45,U.rng(2,4),'fx/spark'));
      }
      return true;
    }
    return false;
  }
  draw(ctx,cx,cy){
    const sx=this.x-cx,sy=this.y-cy;
    const now=performance.now();
    const pulse=0.5+0.5*Math.sin(now/160);
    const attackT=Math.max(0,Math.min(1,(this.attackAnim||0)/0.18));
    const facing=this.attackAnimAngle||this.facing||0;
    const key=Assets.ready(`characters/${this.classId}`)?`characters/${this.classId}`:null;

    // ── Dash afterimage trail ──────────────────────────────────────
    if(this.dashTrail&&this.dashTrail.length){
      this.dashTrail.forEach((t,i)=>{
        const ta=Math.max(0,t.a);
        if(ta<=0)return;
        const tx=t.x-cx, ty=t.y-cy;
        ctx.save();
        ctx.globalAlpha=ta*0.5;
        ctx.shadowColor=this.color;
        ctx.shadowBlur=8;
        if(key){
          const frame=(Math.floor(now/140)+i)%4;
          drawSprite(ctx,key,frame,tx-18,ty-18,36,36,this.facing>Math.PI/2||this.facing<-Math.PI/2,ta*0.6);
        } else {
          ctx.fillStyle=this.accentColor;
          ctx.beginPath();ctx.arc(tx,ty,10,0,Math.PI*2);ctx.fill();
        }
        ctx.restore();
      });
    }

    // ── Shadow under character ────────────────────────────────────
    ctx.save();
    ctx.globalAlpha=0.25;
    ctx.fillStyle='#000';
    ctx.beginPath();
    ctx.ellipse(sx,sy+20,12,5,0,0,Math.PI*2);
    ctx.fill();
    ctx.restore();

    // ── Main sprite ────────────────────────────────────────────────
    ctx.save();
    ctx.globalAlpha=this.hitFlash>0?1:0.98;
    ctx.shadowColor=this.hitFlash>0?'#ffffff':this.color;
    ctx.shadowBlur=this.hitFlash>0?(12+this.hitFlash*10):(8+pulse*4);
    const isMoving=Math.abs(this.dashDirX)+Math.abs(this.dashDirY)>0.1||this.dashTimer>0;
    const bob=isMoving?Math.sin(now/120)*2:Math.sin(now/380)*1;
    const flip=this.facing>Math.PI/2||this.facing<-Math.PI/2;
    if(key){
      const frame=this.dashTimer>0?3:Math.floor(now/150)%4;
      drawSprite(ctx,key,frame,sx-22,sy-22+bob,44,44,flip,0.98);
      // Subtle color tint on hit
      if(this.hitFlash>0){
        ctx.globalAlpha=this.hitFlash*0.4;
        ctx.fillStyle='#ffffff';
        ctx.fillRect(sx-22,sy-22+bob,44,44);
      }
    } else {
      ctx.fillStyle=this.hitFlash>0?'#ffffff':this.color;
      ctx.beginPath();ctx.arc(sx,sy+bob,12,0,Math.PI*2);ctx.fill();
    }
    ctx.restore();

    // ── Attack animation overlays ──────────────────────────────────
    if(this.attackAnim>0){
      ctx.save();
      ctx.lineCap='round';
      if(this.attackAnimStyle==='cast'){
        // Mage: expanding ring + beam
        const ax=sx+Math.cos(facing)*16, ay=sy+Math.sin(facing)*16;
        ctx.globalAlpha=0.6+0.4*attackT;
        ctx.strokeStyle=this.accentColor;
        ctx.shadowColor=this.accentColor;
        ctx.shadowBlur=14;
        ctx.lineWidth=2+3*attackT;
        ctx.beginPath();
        ctx.arc(ax,ay,8+attackT*10,-Math.PI*0.4,Math.PI*1.8);
        ctx.stroke();
        // Energy beam line
        ctx.globalAlpha=0.7*attackT;
        ctx.lineWidth=2;
        ctx.strokeStyle='#ffffff';
        ctx.shadowBlur=8;
        ctx.beginPath();
        ctx.moveTo(sx,sy);
        ctx.lineTo(sx+Math.cos(facing)*22,sy+Math.sin(facing)*22);
        ctx.stroke();
        // Orb at tip
        ctx.globalAlpha=0.9*attackT;
        ctx.fillStyle=this.color;
        ctx.shadowBlur=16;
        ctx.beginPath();
        ctx.arc(ax+Math.cos(facing)*4,ay+Math.sin(facing)*4,3+attackT*3,0,Math.PI*2);
        ctx.fill();
      } else {
        // Melee: wide arc slash with gradient-like layers
        const sweepWidth = this.classId==='warrior'?Math.PI*1.1:Math.PI*0.85;
        const spin=(this.classId==='rogue'?1:-1);
        const start=facing-sweepWidth*0.6;
        const end=facing+sweepWidth*0.4;
        const r=20+attackT*10;
        // Outer glow arc
        for(let layer=0;layer<3;layer++){
          const la=Math.max(0,(0.3+0.5*attackT)*(1-layer*0.28));
          ctx.globalAlpha=la;
          ctx.strokeStyle=layer===0?this.accentColor:(layer===1?this.color:'#ffffff');
          ctx.shadowColor=this.accentColor;
          ctx.shadowBlur=10-layer*3;
          ctx.lineWidth=Math.max(1,(this.classId==='warrior'?7:4)-layer*2);
          ctx.beginPath();
          ctx.arc(sx,sy,r-layer*3,start,end,false);
          ctx.stroke();
        }
        // Slash sprite at arc tip
        if(Assets.ready('fx/slash')){
          const tipX=sx+Math.cos(end)*r;
          const tipY=sy+Math.sin(end)*r;
          const slashFrame=Math.floor((1-attackT)*6);
          ctx.globalAlpha=attackT*0.85;
          ctx.shadowBlur=0;
          drawSprite(ctx,'fx/slash',slashFrame,tipX-16,tipY-16,32,32,flip,attackT*0.9);
        }
      }
      ctx.restore();
    }

    // ── Idle aura ring ─────────────────────────────────────────────
    ctx.save();
    ctx.globalAlpha=0.15+0.12*pulse;
    ctx.strokeStyle=this.accentColor;
    ctx.shadowColor=this.accentColor;
    ctx.shadowBlur=6;
    ctx.lineWidth=1.5;
    ctx.beginPath();
    ctx.arc(sx,sy,17+Math.sin(now/200)*2,0,Math.PI*2);
    ctx.stroke();
    ctx.restore();

    // ── Hit flash ring ─────────────────────────────────────────────
    if(this.hitFlash>0){
      ctx.save();
      ctx.globalAlpha=0.9*this.hitFlash;
      ctx.strokeStyle='#ffffff';
      ctx.shadowColor='#ffffff';
      ctx.shadowBlur=20;
      ctx.lineWidth=2;
      ctx.beginPath();
      ctx.arc(sx,sy,20+this.hitFlash*6,0,Math.PI*2);
      ctx.stroke();
      ctx.restore();
    }

    // ── Invulnerability flicker (after damage) ─────────────────────
    if(this.invuln>0&&this.hitFlash<=0){
      ctx.save();
      ctx.globalAlpha=0.4*Math.sin(now/30);
      ctx.strokeStyle=this.color;
      ctx.lineWidth=2;
      ctx.beginPath();
      ctx.arc(sx,sy,22,0,Math.PI*2);
      ctx.stroke();
      ctx.restore();
    }
  }
}

// ================================================================
// ENEMY
// ================================================================
class Enemy {
  constructor(data,x,y,floor){
    Object.assign(this,JSON.parse(JSON.stringify(data)));
    this.x=x;this.y=y;this.floor=floor;
    this.maxHp=this.hp+Math.floor(floor*2.8);
    this.hp=this.maxHp;
    this.atk=this.atk+Math.floor(floor*1.15);
    this.dead=false;
    this.hitFlash=0;
    this.attackTimer=U.rngf(0.5,1.5);
    this.attackCooldown=1.5;
    this.state='patrol';
    this.patrolAngle=Math.random()*Math.PI*2;
    this.patrolTimer=U.rngf(1,3);
    this.vx=0;this.vy=0;
    this.isBoss=false;
    this.lootGold=U.rng(this.gold[0],this.gold[1]);
    this.shootTimer=U.rngf(1,2.5);
    this.shootCd=2.0;
    this.strafeDir=Math.random()<0.5?-1:1;
    this.strafeTimer=U.rngf(1.2,2.8);
    this.hpBarTimer=0;
  }
  update(dt,player,dungeon,projectiles){
    if(this.dead)return;
    this.hitFlash=Math.max(0,this.hitFlash-dt*5);
    this.hpBarTimer=Math.max(0,(this.hpBarTimer||0)-dt);
    const dist=U.dist(this.x,this.y,player.x,player.y);
    const aggroRange=this.ranged?220:160;
    if(dist<aggroRange)this.state='chase';
    else if(this.state==='chase'&&dist>280)this.state='patrol';

    if(this.state==='patrol'){
      this.patrolTimer-=dt;
      if(this.patrolTimer<=0){this.patrolAngle=Math.random()*Math.PI*2;this.patrolTimer=U.rngf(1,3);}
      this.vx=Math.cos(this.patrolAngle)*this.spd*0.4;
      this.vy=Math.sin(this.patrolAngle)*this.spd*0.4;
    }else if(this.ranged){
      this.strafeTimer-=dt;
      if(this.strafeTimer<=0){this.strafeTimer=U.rngf(1.1,2.6);this.strafeDir=Math.random()<0.5?-1:1;}
      const toPlayer=U.angle(this.x,this.y,player.x,player.y);
      const away=toPlayer+Math.PI;
      const tangent=toPlayer+(Math.PI/2)*this.strafeDir;
      const keepDist=132;
      const close=Math.max(0,(keepDist-18)-dist)/Math.max(1,keepDist-18);
      const far=Math.max(0,dist-(keepDist+24))/60;
      const orbit=Math.max(0,1-Math.abs(dist-keepDist)/52);
      let mx=0,my=0;
      if(close>0){
        mx+=Math.cos(away)*this.spd*(1.1+close*0.8);
        my+=Math.sin(away)*this.spd*(1.1+close*0.8);
      }
      if(far>0){
        mx+=Math.cos(toPlayer)*this.spd*0.9*far;
        my+=Math.sin(toPlayer)*this.spd*0.9*far;
      }
      mx+=Math.cos(tangent)*this.spd*(0.45+orbit*0.85);
      my+=Math.sin(tangent)*this.spd*(0.45+orbit*0.85);
      this.vx=mx;
      this.vy=my;
      this.shootTimer-=dt;
      if(this.shootTimer<=0&&dist<240){
        this.shootTimer=this.shootCd;
        const a=U.angle(this.x,this.y,player.x,player.y);
        projectiles.push(FX.projectile(this.x,this.y,Math.cos(a)*160,Math.sin(a)*160,this.atk,CFG.C.neon1,false,6,'fx/projectile'));
      }
    }else{
      const a=U.angle(this.x,this.y,player.x,player.y);
      const s=this.id==='larva'&&dist>80?this.spd*1.4:this.spd;
      this.vx=Math.cos(a)*s;
      this.vy=Math.sin(a)*s;
    }

    this._move(dt,dungeon);

    if(!this.ranged){
      this.attackTimer-=dt;
      if(dist<(this.size+14)&&this.attackTimer<=0){
        this.attackTimer=this.attackCooldown;
        player.takeDamage(this.atk,this);
      }
    }
  }
  _move(dt,dungeon){
    const T=CFG.TILE;
    const hw=this.size*0.4;
    const dx=this.vx*T*dt;
    const dy=this.vy*T*dt;
    const tryStep=(sx,sy)=>{
      const nx=this.x+sx, ny=this.y+sy;
      return this._passable(nx,ny,hw,dungeon)?{x:nx,y:ny}:null;
    };
    let moved=false;
    const direct=tryStep(dx,dy);
    if(direct){this.x=direct.x;this.y=direct.y;return;}
    const xOnly=tryStep(dx,0);
    if(xOnly){this.x=xOnly.x;this.y=xOnly.y;moved=true;}
    const yOnly=tryStep(0,dy);
    if(yOnly){this.x=yOnly.x;this.y=yOnly.y;moved=true;}
    if(moved)return;

    const base=Math.atan2(this.vy,this.vx);
    const speed=Math.hypot(this.vx,this.vy);
    if(speed<0.001)return;
    const angles=[Math.PI/6,-Math.PI/6,Math.PI/3,-Math.PI/3,Math.PI/2,-Math.PI/2,Math.PI*2/3,-Math.PI*2/3];
    for(const rot of angles){
      const sx=Math.cos(base+rot)*speed*T*dt;
      const sy=Math.sin(base+rot)*speed*T*dt;
      const step=tryStep(sx,sy);
      if(step){this.x=step.x;this.y=step.y;return;}
    }
  }
  _passable(x,y,hw,dungeon){
    // FIX: Block TILE_EMPTY(0) AND TILE_WALL(2)
    const checks=[{x:x-hw,y:y-hw},{x:x+hw,y:y-hw},{x:x-hw,y:y+hw},{x:x+hw,y:y+hw}];
    return checks.every(p=>{const tx=Math.floor(p.x/CFG.TILE),ty=Math.floor(p.y/CFG.TILE);const t=dungeon.tiles[ty]?.[tx];return tx>=0&&ty>=0&&tx<dungeon.W&&ty<dungeon.H&&t!==0&&t!==2;});
  }
  _drawHpBar(ctx,cx,cy){
    const pct=U.clamp(this.hp/this.maxHp,0,1);
    const sx=this.x-cx,sy=this.y-cy;
    const w=this.isBoss?72:30;
    const h=this.isBoss?8:5;
    const y=sy-this.size*1.6-(this.isBoss?14:10);
    if(!this.isBoss&&this.hp>=this.maxHp&&this.hitFlash<=0&&this.hpBarTimer<=0)return;
    ctx.save();
    ctx.globalAlpha=this.isBoss?1:0.95;
    // Background
    ctx.fillStyle='rgba(0,0,0,0.72)';
    ctx.fillRect(sx-w/2,y,w,h);
    // HP fill color
    const barColor=this.isBoss?(this.phase3?CFG.C.neon3:(this.phase2?CFG.C.neon2:this.color)):
      (pct>0.5?CFG.C.hp:pct>0.25?'#ff8844':'#ff2222');
    const barW=Math.max(0,(w-2)*pct);
    ctx.fillStyle=barColor;
    ctx.shadowColor=barColor;
    ctx.shadowBlur=this.isBoss?8:4;
    ctx.fillRect(sx-w/2+1,y+1,barW,h-2);
    // Shine
    ctx.globalAlpha=0.3;
    ctx.fillStyle='#ffffff';
    ctx.fillRect(sx-w/2+1,y+1,barW,Math.max(1,(h-2)*0.4));
    ctx.shadowBlur=0;
    ctx.globalAlpha=this.isBoss?1:0.95;
    ctx.strokeStyle='rgba(255,255,255,0.2)';
    ctx.lineWidth=0.5;
    ctx.strokeRect(sx-w/2,y,w,h);
    if(this.isBoss){
      ctx.fillStyle='rgba(255,255,255,0.9)';
      ctx.font='bold 8px Arial';
      ctx.textAlign='center';
      ctx.fillText(`${Math.ceil(this.hp)}/${this.maxHp}`,sx,y-2);
    }
    ctx.restore();
  }
  takeDamage(amount,isCrit){
    this.hp-=amount;
    this.hitFlash=1;
    this.hpBarTimer=2.5;
    if(this.hp<=0){this.dead=true;return true;}
    return false;
  }
  draw(ctx,cx,cy){
    if(this.dead)return;
    const sx=this.x-cx,sy=this.y-cy,s=this.size;
    const now=performance.now();
    const moving=Math.abs(this.vx)+Math.abs(this.vy)>0.15;
    const aggro=this.state==='chase';
    const bob=moving?Math.sin(now/110)*2.5:Math.sin(now/420)*0.8;

    // Ground shadow
    ctx.save();
    ctx.globalAlpha=0.22+aggro*0.08;
    ctx.fillStyle='#000';
    ctx.beginPath();
    ctx.ellipse(sx,sy+s*1.0,s*0.85,s*0.3,0,0,Math.PI*2);
    ctx.fill();
    ctx.restore();

    // Aggro indicator ring (pulsing red ring when chasing)
    if(aggro){
      const pulse=0.3+0.25*Math.sin(now/90);
      ctx.save();
      ctx.globalAlpha=pulse;
      ctx.strokeStyle=this.ranged?'#cc44ff':'#ff2244';
      ctx.shadowColor=ctx.strokeStyle;
      ctx.shadowBlur=10;
      ctx.lineWidth=1.5;
      ctx.beginPath();
      ctx.arc(sx,sy+bob,s*1.9,0,Math.PI*2);
      ctx.stroke();
      ctx.restore();
    }

    // Main sprite
    ctx.save();
    const key=Assets.ready(`enemies/${this.id}`)?`enemies/${this.id}`:null;
    if(key){
      const angry=aggro&&this.ranged&&this.shootTimer<0.4;
      const frame=angry?3:(moving?1+(Math.floor(now/130)%2):0);
      ctx.shadowColor=this.color;
      ctx.shadowBlur=aggro?16:5;
      drawSprite(ctx,key,frame,sx-s*1.65,sy-s*1.65+bob,s*3.3,s*3.3,this.vx<0,1);
      // White hit flash
      if(this.hitFlash>0){
        ctx.globalAlpha=this.hitFlash*0.65;
        ctx.fillStyle='#ffffff';
        ctx.fillRect(sx-s*1.65,sy-s*1.65+bob,s*3.3,s*3.3);
      }
    }else{
      // Fallback geometric shape
      ctx.fillStyle=this.hitFlash>0?'#ffffff':this.color;
      ctx.shadowColor=this.color;
      ctx.shadowBlur=aggro?12:5;
      ctx.beginPath();
      ctx.arc(sx,sy+bob,s,0,Math.PI*2);
      ctx.fill();
      ctx.fillStyle='#fff';ctx.shadowBlur=0;
      ctx.beginPath();ctx.arc(sx-s*0.35,sy-s*0.25+bob,s*0.28,0,Math.PI*2);ctx.fill();
      ctx.beginPath();ctx.arc(sx+s*0.35,sy-s*0.25+bob,s*0.28,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='#f00';
      ctx.beginPath();ctx.arc(sx-s*0.35,sy-s*0.2+bob,s*0.15,0,Math.PI*2);ctx.fill();
      ctx.beginPath();ctx.arc(sx+s*0.35,sy-s*0.2+bob,s*0.15,0,Math.PI*2);ctx.fill();
    }
    ctx.restore();
    this._drawHpBar(ctx,cx,cy);
  }
}


// ================================================================
// BOSS
// ================================================================
class Boss extends Enemy {
  constructor(x,y,floor){
    const _bid=(CFG.BIOME&&CFG.BIOME.id)||getBiome(floor).id;
    const _bd=getBoss(_bid);
    super(JSON.parse(JSON.stringify(_bd)),x,y,floor);
    this._bossData=_bd;
    this.maxHp=_bd.hp+floor*10;
    this.hp=this.maxHp;
    this.atk=_bd.atk+floor*1.9;
    this.isBoss=true;
    this.phase=1;
    this.phase2=false;
    this.phase3=false;
    this.enraged=false;
    this.skillTimer=U.rngf(2.5,4.5);
    this.skillCd=4;
    this.summonTimer=8;
    this.summonCd=8;
    this.castTimer=0;
    this.castType='';
    this.castAngle=0;
    this.projectilePattern=0;
    this.phasePulse=0;
    this.phaseGuardTimer=0;
    this.phaseGuardPhase=0;
    this.lootGold=U.rng(_bd.gold[0],_bd.gold[1]);
    this.exp=_bd.exp;
    this.dead=false;
    this.biomeId=_bid;
    this.color=_bd.color;
    this.size=_bd.size;
  }
  _biome(){return (CFG.BIOME&&CFG.BIOME.id)||this.biomeId||getBiome(this.floor).id;}
  _biomeAccent(){const b=CFG.BIOME||getBiome(this.floor);return b.accent||CFG.C.neon1;}
  _chooseCast(){const biome=this._biome();if(biome==='catacomb')return this.phase3?'wraith_pulse':(this.phase2?'bone_wall':'grave_ring');if(biome==='blood_hive')return this.phase3?'larva_burst':(this.phase2?'swarm':'spit');if(biome==='void')return this.phase3?'blink_assault':(this.phase2?'beam_fan':'rift_nova');return this.phase3?'spiral':(this.phase2?'beam':'nova');}
  _summonPool(){const biome=this._biome();if(biome==='catacomb')return CFG.ENEMIES.filter(e=>e.id==='skeleton'||e.id==='zombie'||e.id==='darkMage');if(biome==='blood_hive')return CFG.ENEMIES.filter(e=>e.id==='larva'||e.id==='rat'||e.id==='zombie');if(biome==='void')return CFG.ENEMIES.filter(e=>e.id==='darkMage'||e.id==='skeleton');return CFG.ENEMIES.filter(e=>e.floor<=this.floor);}
  _teleportNear(player,dungeon){const angle=Math.random()*Math.PI*2;const dist=U.rngf(90,140);this.x=U.clamp(player.x+Math.cos(angle)*dist,32,dungeon.W*CFG.TILE-32);this.y=U.clamp(player.y+Math.sin(angle)*dist,32,dungeon.H*CFG.TILE-32);this.phasePulse=Math.max(this.phasePulse,1.3);}
  _releaseCast(projectiles,enemies){const biome=this._biome();if(biome==='catacomb'){if(this.castType==='grave_ring'){const count=this.phase3?18:12;for(let i=0;i<count;i++){const a=(Math.PI*2/count)*i;projectiles.push(FX.projectile(this.x,this.y,Math.cos(a)*(180+this.phase*14),Math.sin(a)*(180+this.phase*14),this.atk*(this.phase3?0.6:0.72),CFG.C.wallTop||'#ddd',false,7,'fx/projectile'));}}else if(this.castType==='bone_wall'){for(let i=-3;i<=3;i++){const a=this.castAngle+i*0.18;projectiles.push(FX.projectile(this.x,this.y,Math.cos(a)*220,Math.sin(a)*220,this.atk*0.48,CFG.C.textGold,false,6,'fx/projectile'));}}else if(this.castType==='wraith_pulse'){for(let i=0;i<14;i++){const a=(Math.PI*2/14)*i+(this.phase3?0.12:0);projectiles.push(FX.projectile(this.x,this.y,Math.cos(a)*240,Math.sin(a)*240,this.atk*0.5,CFG.C.neon2,false,6,'fx/projectile'));}}}else if(biome==='blood_hive'){if(this.castType==='spit'){const count=this.phase3?16:10;for(let i=0;i<count;i++){const spread=(i-(count-1)/2)*0.08;const a=this.castAngle+spread;projectiles.push(FX.projectile(this.x,this.y,Math.cos(a)*(210+Math.abs(spread)*70),Math.sin(a)*(210+Math.abs(spread)*70),this.atk*(this.phase3?0.48:0.6),CFG.C.neon2,false,6,'fx/projectile'));}}else if(this.castType==='swarm'){const waves=this.enraged?3:2;for(let w=0;w<waves;w++){for(let i=0;i<8;i++){const a=this.castAngle+((Math.PI*2/8)*i)+(w*0.22);projectiles.push(FX.projectile(this.x,this.y,Math.cos(a)*(185+w*20),Math.sin(a)*(185+w*20),this.atk*0.42,CFG.C.neon1,false,5,'fx/projectile'));}}}else if(this.castType==='larva_burst'){for(let i=0;i<18;i++){const a=(Math.PI*2/18)*i;projectiles.push(FX.projectile(this.x,this.y,Math.cos(a)*170,Math.sin(a)*170,this.atk*0.34,CFG.C.neon3,false,5,'fx/projectile'));}}}else if(biome==='void'){if(this.castType==='rift_nova'){const count=this.phase3?20:12;for(let i=0;i<count;i++){const a=(Math.PI*2/count)*i+this.castAngle*0.1;projectiles.push(FX.projectile(this.x,this.y,Math.cos(a)*(195+this.phase*18),Math.sin(a)*(195+this.phase*18),this.atk*(this.phase3?0.56:0.68),CFG.C.neon3,false,7,'fx/projectile'));}}else if(this.castType==='beam_fan'){for(let i=-3;i<=3;i++){const a=this.castAngle+i*0.12;projectiles.push(FX.projectile(this.x,this.y,Math.cos(a)*(240-this.phase*12),Math.sin(a)*(240-this.phase*12),this.atk*0.52,CFG.C.neon1,false,7,'fx/projectile'));}}else if(this.castType==='blink_assault'){for(let i=0;i<10;i++){const a=(Math.PI*2/10)*i;projectiles.push(FX.projectile(this.x,this.y,Math.cos(a)*230,Math.sin(a)*230,this.atk*0.42,CFG.C.neon2,false,6,'fx/projectile'));}}}else{if(this.castType==='nova'){const count=this.phase3?16:(this.enraged?12:8);for(let i=0;i<count;i++){const a=(Math.PI*2/count)*i;projectiles.push(FX.projectile(this.x,this.y,Math.cos(a)*190,Math.sin(a)*190,this.atk*(this.phase3?0.58:0.7),this.phase3?CFG.C.neon2:CFG.C.neon3,false,8,'fx/projectile'));}}else if(this.castType==='spiral'){const waves=this.enraged?3:2;const count=6;for(let w=0;w<waves;w++){for(let i=0;i<count;i++){const a=this.castAngle+((Math.PI*2/count)*i)+(w*0.35);projectiles.push(FX.projectile(this.x,this.y,Math.cos(a)*(190+w*25),Math.sin(a)*(190+w*25),this.atk*0.48,CFG.C.neon1,false,6,'fx/projectile'));}}}else if(this.castType==='beam'){for(let i=-2;i<=2;i++){const a=this.castAngle+(i*0.15);projectiles.push(FX.projectile(this.x,this.y,Math.cos(a)*(230-this.phase*10),Math.sin(a)*(230-this.phase*10),this.atk*0.52,CFG.C.neon3,false,7,'fx/projectile'));}}}this.phasePulse=Math.max(this.phasePulse,1.0);}
  takeDamage(amount,isCrit){
    if(this.dead)return false;
    let final=amount;
    const isPhaseShift=this.phaseGuardTimer>0;
    if(isPhaseShift){
      const cap=Math.max(14,Math.floor(this.maxHp*0.05));
      final=Math.min(final,cap);
      final=Math.max(1,Math.floor(final*0.45));
    }else if(this.castTimer>0){
      final=Math.max(1,Math.floor(final*0.85));
    }
    return super.takeDamage(final,isCrit);
  }
  update(dt,player,dungeon,projectiles,enemies){
    if(this.dead)return;
    this.biomeId=(CFG.BIOME&&CFG.BIOME.id)||this.biomeId||getBiome(this.floor).id;
    this.hitFlash=Math.max(0,this.hitFlash-dt*5);
    this.hpBarTimer=Math.max(0,(this.hpBarTimer||0)-dt);
    this.phasePulse=Math.max(0,this.phasePulse-dt*1.4);
    this.phaseGuardTimer=Math.max(0,this.phaseGuardTimer-dt);

    const hpPct=this.hp/this.maxHp;
    if(!this.phase2&&hpPct<=0.72){
      this.phase2=true;this.phase=2;this.skillCd*=0.88;this.summonCd*=0.9;this.phasePulse=1.5;this.phaseGuardTimer=1.0;this.phaseGuardPhase=2;
      for(let i=0;i<8;i++)projectiles.push(FX.particle(this.x,this.y,U.rngf(-90,90),U.rngf(-90,20),this._biomeAccent(),0.45,U.rng(3,6),'fx/skill_burst'));
      if(this.scene){this.scene.addShake(1.0,0.12);this.scene.addHitstop(0.06);this.scene.floatingTexts.push(FX.text(this.x,this.y-70,'PHASE SHIFT',CFG.C.neon2,12));}
    }
    if(!this.phase3&&hpPct<=0.36){
      this.phase3=true;this.phase=3;this.spd*=1.15;this.attackCooldown*=0.85;this.skillCd*=0.78;this.summonCd*=0.82;this.phasePulse=1.9;this.phaseGuardTimer=1.1;this.phaseGuardPhase=3;
      for(let i=0;i<12;i++)projectiles.push(FX.particle(this.x,this.y,U.rngf(-120,120),U.rngf(-120,30),CFG.C.neon3,0.55,U.rng(3,7),'fx/skill_burst'));
      if(this.scene){this.scene.addShake(1.2,0.15);this.scene.addHitstop(0.08);this.scene.floatingTexts.push(FX.text(this.x,this.y-70,'OVERDRIVE',CFG.C.neon3,12));}
    }
    if(!this.enraged&&hpPct<=0.5){this.enraged=true;this.spd*=(this._bossData&&this._bossData.enrageMult)||1.35;this.skillCd*=0.7;this.phasePulse=1.8;}

    const a=U.angle(this.x,this.y,player.x,player.y);
    const dist=U.dist(this.x,this.y,player.x,player.y);
    const biome=this._biome();

    if(this.castTimer>0){
      this.castTimer-=dt;
      this.vx*=0.82;this.vy*=0.82;
      this._move(dt*0.45,dungeon);
      if(this.castTimer<=0)this._releaseCast(projectiles,enemies);
    }else{
      if(dist>80){const drift=this.phase3?1.08:1;this.vx=Math.cos(a)*this.spd*drift;this.vy=Math.sin(a)*this.spd*drift;}
      else{this.vx*=0.85;this.vy*=0.85;}
      this._move(dt,dungeon);
      this.skillTimer-=dt;
      if(this.skillTimer<=0){
        this.castAngle=a;this.castType=this._chooseCast();this.castTimer=this.phase3?0.95:(this.phase2?0.8:0.6);
        if(biome==='void'&&this.phase3&&Math.random()<0.7)this._teleportNear(player,dungeon);
        this.skillTimer=this.skillCd+this.castTimer;
        this.phasePulse=Math.max(this.phasePulse,1.1);
      }
      if(this.enraged){
        this.summonTimer-=dt;
        if(this.summonTimer<=0){
          this.summonTimer=this.summonCd;
          const nearby=enemies.filter(e=>!e.dead&&!e.isBoss&&U.distSq(e.x,e.y,this.x,this.y)<220*220).length;
          if(nearby<5){
            const options=this._summonPool().filter(e=>e.floor<=this.floor);
            const spawnCount=this.phase3?U.rng(2,3):U.rng(1,2);
            for(let i=0;i<spawnCount;i++){
              const data=U.pick(options.length?options:CFG.ENEMIES.filter(e=>e.floor<=this.floor));
              const minion=new Enemy(data,this.x+U.rngf(-48,48),this.y+U.rngf(-48,48),this.floor);
              minion.x=U.clamp(minion.x,32,dungeon.W*CFG.TILE-32);
              minion.y=U.clamp(minion.y,32,dungeon.H*CFG.TILE-32);
              enemies.push(minion);
              projectiles.push(FX.particle(minion.x,minion.y,0,0,this._biomeAccent(),0.2,12,'fx/skill_burst'));
            }
          }
        }
        this.spiralTimer=(this.spiralTimer||0)+dt;
        if(this.spiralTimer>0.2){
          this.spiralTimer=0;
          const sa=a+this.projectilePattern*(Math.PI/8);
          projectiles.push(FX.projectile(this.x,this.y,Math.cos(sa)*220,Math.sin(sa)*220,this.atk*0.45,this._biomeAccent(),false,6,'fx/projectile'));
          this.projectilePattern=(this.projectilePattern+1)%8;
        }
      }
    }

    this.attackTimer-=dt;
    if(dist<this.size+20&&this.attackTimer<=0){
      this.attackTimer=this.attackCooldown;
      player.takeDamage(this.atk,this);
    }
  }
  draw(ctx,cx,cy){
    if(this.dead)return;
    const sx=this.x-cx,sy=this.y-cy;
    const now=performance.now();
    const aura=this.phase3?CFG.C.neon3:(this.phase2?CFG.C.neon2:this._biomeAccent());

    // Ground shadow
    ctx.save();
    ctx.globalAlpha=0.4;
    ctx.fillStyle='#000';
    ctx.beginPath();
    ctx.ellipse(sx,sy+38,30,10,0,0,Math.PI*2);
    ctx.fill();
    ctx.restore();

    ctx.save();

    // Multi-ring pulsing aura
    const ringCount=this.phase3?4:(this.phase2?3:2);
    for(let r=0;r<ringCount;r++){
      const ringR=42+r*14+Math.sin(now/200+r*1.2)*3+(this.phasePulse||0)*6;
      const ringA=Math.max(0,(0.35-r*0.08)+Math.min(0.25,this.phasePulse*0.15));
      ctx.globalAlpha=ringA;
      ctx.shadowColor=aura;
      ctx.shadowBlur=12-r*3;
      ctx.strokeStyle=aura;
      ctx.lineWidth=Math.max(1,3-r);
      ctx.beginPath();ctx.arc(sx,sy,ringR,0,Math.PI*2);ctx.stroke();
    }

    // Phase guard shield
    if(this.phaseGuardTimer>0){
      const t=this.phaseGuardPhase||2;
      const gc=t===3?CFG.C.neon3:CFG.C.neon2;
      ctx.globalAlpha=0.25+this.phaseGuardTimer*0.35;
      ctx.setLineDash([8,5]);
      ctx.strokeStyle=gc;ctx.shadowColor=gc;ctx.shadowBlur=14;
      ctx.lineWidth=3;
      ctx.beginPath();ctx.arc(sx,sy,60+Math.sin(this.phaseGuardTimer*18)*4,0,Math.PI*2);ctx.stroke();
      ctx.setLineDash([]);
      // Pulsing fill
      ctx.globalAlpha=0.12+Math.sin(now/80)*0.06;
      ctx.fillStyle=gc;
      ctx.beginPath();ctx.arc(sx,sy,52,0,Math.PI*2);ctx.fill();
    }

    // Cast wind-up telegraph
    if(this.castTimer>0){
      ctx.setLineDash([6,5]);
      ctx.globalAlpha=0.25+Math.min(0.3,this.castTimer*0.3);
      ctx.strokeStyle='#ffffff';ctx.shadowColor='#ffffff';ctx.shadowBlur=6;
      ctx.lineWidth=1.5;
      ctx.beginPath();ctx.arc(sx,sy,54+(1-this.castTimer)*12,0,Math.PI*2);ctx.stroke();
      ctx.setLineDash([]);
      ctx.globalAlpha=0.55+Math.sin(now/60)*0.1;
      ctx.strokeStyle=aura;ctx.shadowColor=aura;ctx.shadowBlur=10;
      ctx.lineWidth=2;
      ctx.beginPath();ctx.moveTo(sx,sy);
      ctx.lineTo(sx+Math.cos(this.castAngle)*88,sy+Math.sin(this.castAngle)*88);
      ctx.stroke();
    }

    // Main sprite
    const _bid2=this._biome();
    const _bossKey='bosses/'+_bid2; // e.g. bosses/catacomb_lich
    const key=Assets.ready(_bossKey)?_bossKey:(Assets.ready('bosses/guardian')?'bosses/guardian':null);
    const frame=this.phase3?2:(this.phase2?1:0);
    const flip=this.castAngle>Math.PI/2||this.castAngle<-Math.PI/2;
    const bossAlpha=this.hitFlash>0?(0.5+this.hitFlash*0.5):1;
    ctx.shadowColor=aura;
    ctx.shadowBlur=this.hitFlash>0?24:16;
    if(key){
      drawSprite(ctx,key,frame,sx-52,sy-52,104,104,flip,bossAlpha);
      if(this.hitFlash>0){
        ctx.save();
        ctx.globalAlpha=this.hitFlash*0.45;
        ctx.globalCompositeOperation='lighter';
        drawSprite(ctx,key,frame,sx-52,sy-52,104,104,flip,this.hitFlash*0.4);
        ctx.restore();
      }
    } else {
      ctx.globalAlpha=bossAlpha;
      ctx.fillStyle=aura;
      ctx.beginPath();ctx.arc(sx,sy,32,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='#fff';ctx.fillRect(sx-6,sy-6,12,12);
    }

    // Phase-3 enrage sparks
    if(this.phase3&&this.enraged){
      const sparkCount=4;
      for(let i=0;i<sparkCount;i++){
        const sang=(now/180+i*(Math.PI*2/sparkCount))%(Math.PI*2);
        const spx=sx+44*Math.cos(sang);
        const spy=sy+44*Math.sin(sang);
        ctx.globalAlpha=0.7+0.3*Math.sin(now/100+i);
        ctx.fillStyle=CFG.C.neon3;
        ctx.shadowColor=CFG.C.neon3;ctx.shadowBlur=8;
        ctx.beginPath();ctx.arc(spx,spy,3,0,Math.PI*2);ctx.fill();
      }
    }

    ctx.restore();
    this._drawHpBar(ctx,cx,cy);
  }
}


// ================================================================
// VIRTUAL JOYSTICK
// ================================================================
class VirtualJoystick {
  constructor(cx,cy,radius){
    this.cx=cx;this.cy=cy;this.radius=radius;
    this.dx=0;this.dy=0;this.active=false;this.touchId=null;
    this.stickX=cx;this.stickY=cy;
  }
  onTouchStart(id,x,y){
    const d=U.dist(x,y,this.cx,this.cy);
    if(d<this.radius*1.5){this.active=true;this.touchId=id;this._update(x,y);return true;}
    return false;
  }
  onTouchMove(id,x,y){
    if(this.touchId!==id)return;
    this._update(x,y);
  }
  onTouchEnd(id){if(this.touchId===id){this.active=false;this.touchId=null;this.dx=0;this.dy=0;this.stickX=this.cx;this.stickY=this.cy;}}
  _update(x,y){
    const dx=x-this.cx,dy=y-this.cy;
    const d=Math.sqrt(dx*dx+dy*dy);
    const r=this.radius*0.7;
    if(d>r){this.dx=(dx/d);this.dy=(dy/d);this.stickX=this.cx+this.dx*r;this.stickY=this.cy+this.dy*r;}
    else{this.dx=dx/r;this.dy=dy/r;this.stickX=x;this.stickY=y;}
  }
  draw(ctx){
    ctx.save();
    // Outer ring — very faint, just enough to see
    ctx.globalAlpha=this.active?0.30:0.18;
    ctx.strokeStyle='#7777cc';
    ctx.lineWidth=1.5;
    ctx.beginPath();ctx.arc(this.cx,this.cy,this.radius,0,Math.PI*2);ctx.stroke();
    // Base fill — almost invisible
    ctx.globalAlpha=this.active?0.10:0.05;
    ctx.fillStyle='rgba(80,80,180,1)';
    ctx.fill();
    // Inner ring guide
    ctx.globalAlpha=this.active?0.14:0.07;
    ctx.strokeStyle='#6666bb';
    ctx.lineWidth=1;
    ctx.beginPath();ctx.arc(this.cx,this.cy,this.radius*0.55,0,Math.PI*2);ctx.stroke();
    // Stick knob — slightly more visible so player knows where it is
    ctx.globalAlpha=this.active?0.55:0.32;
    ctx.fillStyle='rgba(140,140,255,1)';
    ctx.beginPath();ctx.arc(this.stickX,this.stickY,this.radius*0.38,0,Math.PI*2);ctx.fill();
    ctx.globalAlpha=this.active?0.45:0.22;
    ctx.strokeStyle='#aaaaff';ctx.lineWidth=1.5;ctx.stroke();
    ctx.restore();
  }
}

// ================================================================
// SAVE MANAGER
// ================================================================
class SaveMgr {
  static save(data){try{localStorage.setItem('vsve_meta',JSON.stringify(SAVE_UTIL.normalizeMeta({...data,version:SAVE_VERSION})));}catch(e){}}
  static load(){try{const d=localStorage.getItem('vsve_meta');if(!d)return null;const parsed=JSON.parse(d);if(parsed&&parsed.version===SAVE_VERSION)return SAVE_UTIL.normalizeMeta(parsed);if(parsed&&typeof parsed==='object'&&('soulCoins' in parsed||'permaUpgrades' in parsed))return SAVE_UTIL.normalizeMeta(parsed);return null;}catch(e){return null;}}
  static saveRun(data){try{localStorage.setItem('vsve_run',JSON.stringify(SAVE_UTIL.normalizeRun(data)));}catch(e){}}
  static loadRun(){try{const d=localStorage.getItem('vsve_run');if(!d)return null;const parsed=JSON.parse(d);if(parsed&&parsed.version===SAVE_VERSION)return SAVE_UTIL.normalizeRun(parsed);if(parsed&&typeof parsed==='object'&&('player' in parsed||'classId' in parsed))return SAVE_UTIL.normalizeRun(parsed);return null;}catch(e){return null;}}
  static clearRun(){try{localStorage.removeItem('vsve_run');}catch(e){}}
}

// ================================================================
// DRAW HELPERS
// ================================================================
const Draw = {
  roundRect(ctx,x,y,w,h,r,fill,stroke){
    ctx.beginPath();ctx.moveTo(x+r,y);ctx.lineTo(x+w-r,y);ctx.arcTo(x+w,y,x+w,y+r,r);
    ctx.lineTo(x+w,y+h-r);ctx.arcTo(x+w,y+h,x+w-r,y+h,r);ctx.lineTo(x+r,y+h);
    ctx.arcTo(x,y+h,x,y+h-r,r);ctx.lineTo(x,y+r);ctx.arcTo(x,y,x+r,y,r);ctx.closePath();
    if(fill){ctx.fillStyle=fill;ctx.fill();}
    if(stroke){ctx.strokeStyle=stroke;ctx.stroke();}
  },
  glowText(ctx,text,x,y,color,size,glow,align='center'){
    ctx.save();ctx.font=`bold ${size}px 'Courier New', monospace`;ctx.textAlign=align;
    ctx.shadowColor=color;ctx.shadowBlur=glow||10;
    ctx.fillStyle=color;ctx.fillText(text,x,y);ctx.restore();
  },
  bar(ctx,x,y,w,h,pct,color,bg,border){
    ctx.fillStyle=bg||'#220000';ctx.fillRect(x,y,w,h);
    ctx.fillStyle=color;ctx.fillRect(x,y,w*U.clamp(pct,0,1),h);
    if(border){ctx.strokeStyle=border;ctx.lineWidth=1;ctx.strokeRect(x,y,w,h);}
  },
  tile(ctx,x,y,type,anim){
    const T=CFG.TILE;
    const biome=CFG.BIOME||CFG.BIOMES[0];
    if(type===1||type===3||type===5){
      const v=(Math.sin(x*0.3+y*0.7)*0.5+0.5)*0.12;
      ctx.fillStyle=`hsl(${220+Math.sin(x+y)*6},${28+v*12}%,${10+v*8}%)`;
      ctx.fillRect(x*T,y*T,T,T);
      ctx.fillStyle=`${biome.accent}18`;
      ctx.fillRect(x*T+2,y*T+2,T-4,T-4);
      if((x+y)%3===0){ctx.fillStyle='rgba(255,255,255,0.03)';ctx.fillRect(x*T+3,y*T+3,T-6,T-6);}
      if(type===3){ctx.fillStyle=biome.wallTop;ctx.fillRect(x*T+4,y*T,T-8,T);ctx.fillStyle=biome.accent;ctx.fillRect(x*T+T/2-2,y*T+T/3,4,4);}
    } else if(type===2){
      ctx.fillStyle=biome.wall;ctx.fillRect(x*T,y*T,T,T);
      ctx.fillStyle=biome.wallTop;ctx.fillRect(x*T,y*T,T,4);
      ctx.fillStyle=`${biome.accent}28`;
      if((x+y)%2===0)ctx.fillRect(x*T+2,y*T+6,T-4,T/2-4);
      else ctx.fillRect(x*T+4,y*T+T/2,T-8,T/2-4);
    }
  },
};

// ================================================================
// ================================================================
// HAZARDS (environmental — biome-specific floor threats)
// ================================================================
class Hazard {
  constructor(type,x,y){
    this.type=type;this.x=x;this.y=y;
    this.timer=Math.random()*4;
    this.active=false;this.pulsed=0;this.riftCd=0;
    switch(type){
      case'spike':this.cycleLen=3.8;this.onFrac=0.38;this.radius=16;break;
      case'acid': this.cycleLen=0;  this.onFrac=1;  this.radius=26;break;
      default:    this.cycleLen=0;  this.onFrac=1;  this.radius=22;break; // rift
    }
  }
  update(dt,player,scene){
    this.pulsed=Math.max(0,this.pulsed-dt);
    this.riftCd=Math.max(0,this.riftCd-dt);
    if(this.type==='spike'){
      this.timer+=dt;
      const cycle=this.timer%this.cycleLen;
      this.active=cycle>(this.cycleLen*(1-this.onFrac));
      if(this.active&&!player.iframes){
        if(U.dist(this.x,this.y,player.x,player.y)<this.radius+14){
          player.takeDamage(7,false);
          scene.floatingTexts.push(FX.text(player.x,player.y-32,'7','#ffbb66',11));
          scene.addShake(0.25,0.03);this.pulsed=0.15;player.iframes=0.4;
        }
      }
    } else if(this.type==='acid'){
      if(U.dist(this.x,this.y,player.x,player.y)<this.radius+14){
        player._acidTimer=(player._acidTimer||0)-dt;
        if((player._acidTimer||0)<=0){
          player.takeDamage(5,false);player._acidTimer=0.75;this.pulsed=0.12;
          scene.floatingTexts.push(FX.text(player.x,player.y-28,'5','#88cc44',10));
        }
      }
    } else if(this.type==='rift'){
      if(this.riftCd>0)return;
      if(U.dist(this.x,this.y,player.x,player.y)<this.radius+12){
        this.riftCd=9;this.pulsed=0.6;
        const T=CFG.TILE,dung=scene.dungeon;
        for(let att=0;att<60;att++){
          const rx=U.rng(2,dung.W-3),ry=U.rng(2,dung.H-3);
          if(dung.tiles[ry][rx]===1){
            player.x=rx*T+T/2;player.y=ry*T+T/2;
            scene.cameraX=player.x-scene.W/2;scene.cameraY=player.y-scene.H/2;break;
          }
        }
        scene.floatingTexts.push(FX.text(player.x,player.y-44,'VOID RIFT!','#cc88ff',13));
        scene.addShake(0.9,0.11);
      }
    }
  }
  draw(ctx,cx,cy){
    const sx=this.x-cx,sy=this.y-cy;
    if(sx<-64||sx>ctx.canvas.width+64||sy<-64||sy>ctx.canvas.height+64)return;
    ctx.save();
    if(this.type==='spike'){
      const cycle=this.timer%this.cycleLen,primed=cycle>(this.cycleLen*0.45)&&!this.active;
      const col=this.active?'#ffdd88':(primed?'#cc7722':'#664422');
      ctx.globalAlpha=this.active?0.9:(primed?0.65:0.38);
      ctx.shadowColor=col;ctx.shadowBlur=this.active?12:0;
      const count=this.active?8:4;
      for(let i=0;i<count;i++){
        const a=(Math.PI*2/count)*i+(this.active?Math.PI/8:Math.PI/4);
        const len=this.active?13:6;
        ctx.strokeStyle=col;ctx.lineWidth=this.active?2.5:1.5;
        ctx.beginPath();ctx.moveTo(sx,sy);ctx.lineTo(sx+Math.cos(a)*len,sy+Math.sin(a)*len);ctx.stroke();
      }
      ctx.fillStyle=col;ctx.beginPath();ctx.arc(sx,sy,this.active?5:3,0,Math.PI*2);ctx.fill();
    } else if(this.type==='acid'){
      ctx.globalAlpha=0.5+Math.sin(Date.now()/700)*0.08;
      const g=ctx.createRadialGradient(sx,sy,0,sx,sy,this.radius);
      g.addColorStop(0,'rgba(110,220,55,0.7)');g.addColorStop(1,'rgba(40,110,10,0)');
      ctx.fillStyle=g;ctx.beginPath();ctx.arc(sx,sy,this.radius,0,Math.PI*2);ctx.fill();
      ctx.globalAlpha=0.28;ctx.strokeStyle='#88cc44';ctx.lineWidth=1.5;ctx.stroke();
    } else {
      const spin=Date.now()/900;
      ctx.globalAlpha=this.riftCd>0?0.28:0.72;
      const g=ctx.createRadialGradient(sx,sy,0,sx,sy,this.radius);
      g.addColorStop(0,'rgba(190,110,255,0.8)');g.addColorStop(1,'rgba(70,20,150,0)');
      ctx.fillStyle=g;ctx.beginPath();ctx.arc(sx,sy,this.radius,0,Math.PI*2);ctx.fill();
      ctx.shadowColor='#aa55ff';ctx.shadowBlur=14;ctx.strokeStyle='#cc88ff';ctx.lineWidth=2;
      ctx.beginPath();ctx.arc(sx,sy,this.radius*0.55,spin,spin+Math.PI*1.4);ctx.stroke();
      if(this.riftCd<=0){ctx.globalAlpha=0.9;ctx.font='bold 11px Arial';ctx.textAlign='center';ctx.fillStyle='#ffffff';ctx.fillText('⟳',sx,sy+4);}
    }
    ctx.restore();
  }
}

// GAME SCENES
// ================================================================

// --- SCENE BASE ---
class Scene {
  constructor(game){this.game=game;this.ctx=game.ctx;this.W=game.W;this.H=game.H;}
  enter(data){}update(dt){}draw(){}exit(){}
  onTouchStart(id,x,y){}onTouchMove(id,x,y){}onTouchEnd(id,x,y){}
}

// --- BOOT SCENE ---
class BootScene extends Scene {
  enter(){this.progress=0;this.tip=U.pick(CFG.TIPS);this.time=0;
    this.particles=Array.from({length:40},()=>({x:Math.random()*this.W,y:Math.random()*this.H,vx:U.rngf(-10,10),vy:U.rngf(-15,-5),size:U.rng(1,3),color:U.pick([CFG.C.neon1,CFG.C.neon2,CFG.C.neon3]),life:1+Math.random()*2,maxLife:3}));}
  update(dt){
    this.time+=dt;this.progress=Math.min(1,this.progress+dt*0.4);
    this.particles.forEach(p=>{p.x+=p.vx*dt;p.y+=p.vy*dt;p.life-=dt;if(p.life<=0){p.x=Math.random()*this.W;p.y=this.H+10;p.life=p.maxLife;}});
    if(this.progress>=1&&this.time>1.5)this.game.switchScene('menu');
  }
  draw(){
    const{ctx,W,H}=this;
    ctx.fillStyle=CFG.C.bg;ctx.fillRect(0,0,W,H);
    // Stars
    this.particles.forEach(p=>{ctx.save();ctx.globalAlpha=p.life/p.maxLife*0.7;ctx.fillStyle=p.color;ctx.shadowColor=p.color;ctx.shadowBlur=4;ctx.fillRect(p.x,p.y,p.size,p.size);ctx.restore();});
    // Logo
    const pulse=Math.sin(this.time*3)*0.1+0.9;
    ctx.save();ctx.translate(W/2,H*0.35);ctx.scale(pulse,pulse);
    Draw.glowText(ctx,'VỰC SÂU',0,-30,CFG.C.neon1,28,25);
    Draw.glowText(ctx,'VÔ TẬN',0,10,CFG.C.neon2,28,25);
    ctx.font='12px Arial';ctx.fillStyle=CFG.C.textDim;ctx.textAlign='center';ctx.fillText('◆ DARK FANTASY ROGUELIKE ◆',0,42);
    ctx.restore();
    // Loading bar
    const bx=40,by=H*0.62,bw=W-80,bh=8;
    Draw.roundRect(ctx,bx,by,bw,bh,4,null,'#4a3a8a');
    ctx.save();ctx.shadowColor=CFG.C.neon1;ctx.shadowBlur=8;
    Draw.roundRect(ctx,bx,by,bw*this.progress,bh,4,CFG.C.neon1);ctx.restore();
    Draw.glowText(ctx,`Đang tải... ${Math.floor(this.progress*100)}%`,W/2,by+26,CFG.C.textDim,11,4);
    // Tip
    ctx.font='11px Arial';ctx.fillStyle=CFG.C.textDim;ctx.textAlign='center';
    ctx.fillText('💡 '+this.tip,W/2,H*0.75,W-60);
    // Footer
    Draw.glowText(ctx,'v1.1.0 — Vực Sâu Studio',W/2,H-20,CFG.C.textDim,10,3);
  }
}

// --- MENU SCENE ---
class MenuScene extends Scene {
  enter(){
    this.time=0;this.stars=Array.from({length:60},()=>({x:Math.random()*360,y:Math.random()*640,s:Math.random()*1.5+0.3,sp:Math.random()*8+2,op:Math.random()}));
    this.meta=SaveMgr.load()||{soulCoins:0,permaUpgrades:{},bestFloor:0};
    this.hasSave=!!SaveMgr.loadRun();
    this.buttons=[
      {label:'⚔  CHƠI MỚI',y:300,action:'newgame',color:CFG.C.neon1},
      this.hasSave?{label:'▶  TIẾP TỤC',y:370,action:'continue',color:CFG.C.neon2}:null,
      {label:'✦  NÂNG CẤP VĨNH VIỄN',y:this.hasSave?440:370,action:'perma',color:CFG.C.textGold},
      {label:'⚙  CÀI ĐẶT',y:this.hasSave?510:440,action:'settings',color:CFG.C.textDim},
    ].filter(Boolean);
    this.showSettings=false;
    this.audioOn=true;this.vibrateOn=true;
    this.hovered=null;
    this.glowAnim=0;
  }
  update(dt){
    this.time+=dt;this.glowAnim+=dt;
    this.stars.forEach(s=>{s.y+=s.sp*dt;if(s.y>640){s.y=-2;s.x=Math.random()*360;}});
  }
  onTouchEnd(id,x,y){
    U.vibrate(15);this.game.audio.sfx('uiClick');
    if(this.showSettings){this._handleSettings(x,y);return;}
    this.buttons.forEach(b=>{
      if(Math.abs(y-b.y)<28&&x>20&&x<340){
        if(b.action==='newgame'){SaveMgr.clearRun();this.game.switchScene('charselect');}
        else if(b.action==='continue')this.game.switchScene('gameplay',{resume:true});
        else if(b.action==='perma')this.game.switchScene('perma');
        else if(b.action==='settings')this.showSettings=true;
      }
    });
  }
  _handleSettings(x,y){
    if(y>200&&y<240){this.audioOn=!this.audioOn;this.game.audio.enabled=this.audioOn;}
    else if(y>260&&y<300){this.vibrateOn=!this.vibrateOn;}
    else if(y>340){this.showSettings=false;}
  }
  draw(){
    const{ctx,W,H,time}=this;
    // BG gradient
    const grd=ctx.createLinearGradient(0,0,0,H);
    grd.addColorStop(0,'#07071a');grd.addColorStop(1,'#0f0820');
    ctx.fillStyle=grd;ctx.fillRect(0,0,W,H);
    // Stars
    this.stars.forEach(s=>{ctx.save();ctx.globalAlpha=0.4+Math.sin(time*2+s.op*6)*0.3;ctx.fillStyle='#aaaaff';ctx.fillRect(s.x,s.y,s.s,s.s);ctx.restore();});
    // Dungeon atmosphere lines
    ctx.save();ctx.globalAlpha=0.06;ctx.strokeStyle=CFG.C.neon1;ctx.lineWidth=1;
    for(let i=0;i<8;i++){const y=100+i*70+Math.sin(time*0.5+i)*5;ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
    ctx.restore();
    // Title
    ctx.save();ctx.translate(W/2,H*0.18);
    const glow=Math.sin(this.glowAnim*2)*5+12;
    Draw.glowText(ctx,'VỰC SÂU',0,-18,CFG.C.neon1,32,glow);
    Draw.glowText(ctx,'VÔ TẬN',0,22,CFG.C.neon2,32,glow);
    ctx.font='11px Arial';ctx.fillStyle=CFG.C.textDim;ctx.textAlign='center';
    ctx.fillText('◆ DARK FANTASY ROGUELIKE ◆',0,52);
    ctx.restore();
    // Soul coins display
    Draw.glowText(ctx,`💎 ${this.meta.soulCoins||0} Soul Coins`,W/2,260,CFG.C.textGold,13,6);
    if(this.meta.bestFloor>0)Draw.glowText(ctx,`Tầng sâu nhất: ${this.meta.bestFloor}`,W/2,280,CFG.C.textDim,11,3);

    if(this.showSettings){this._drawSettings();}
    else{
      this.buttons.forEach((b,i)=>{
        const bx=40,bw=W-80,bh=46,by=b.y-bh/2;
        ctx.save();ctx.shadowColor=b.color;ctx.shadowBlur=12;
        Draw.roundRect(ctx,bx,by,bw,bh,8,U.rgba(b.color,0.12),b.color);
        ctx.font='bold 15px Arial';ctx.fillStyle=b.color;ctx.textAlign='center';
        ctx.shadowColor=b.color;ctx.shadowBlur=8;ctx.fillText(b.label,W/2,by+29);
        ctx.restore();
      });
    }
    // Footer
    ctx.font='10px Arial';ctx.fillStyle='#444466';ctx.textAlign='center';ctx.fillText('© 2024 Vực Sâu Studio',W/2,H-12);
  }
  _drawSettings(){
    const{ctx,W,H}=this;
    Draw.roundRect(ctx,20,160,W-40,240,12,U.rgba(CFG.C.uiBorder,0.95),'#6644cc');
    Draw.glowText(ctx,'CÀI ĐẶT',W/2,195,CFG.C.neon1,18,10);
    // Audio toggle
    ctx.font='14px Arial';ctx.fillStyle=CFG.C.text;ctx.textAlign='left';ctx.fillText('🔊 Âm Thanh',40,225);
    Draw.roundRect(ctx,W-80,210,50,24,12,this.audioOn?CFG.C.neon1:'#333355',this.audioOn?CFG.C.neon2:'#555577');
    ctx.font='12px Arial';ctx.fillStyle='#fff';ctx.textAlign='center';ctx.fillText(this.audioOn?'BẬT':'TẮT',W-55,226);
    // Vibrate
    ctx.font='14px Arial';ctx.fillStyle=CFG.C.text;ctx.textAlign='left';ctx.fillText('📳 Rung',40,285);
    Draw.roundRect(ctx,W-80,270,50,24,12,this.vibrateOn?CFG.C.neon1:'#333355',this.vibrateOn?CFG.C.neon2:'#555577');
    ctx.font='12px Arial';ctx.fillStyle='#fff';ctx.textAlign='center';ctx.fillText(this.vibrateOn?'BẬT':'TẮT',W-55,286);
    // Close
    Draw.roundRect(ctx,W/2-60,355,120,36,8,U.rgba(CFG.C.neon1,0.2),CFG.C.neon1);
    Draw.glowText(ctx,'ĐÓNG',W/2,379,CFG.C.neon1,14,6);
  }
}

// --- CHAR SELECT SCENE ---
class CharSelectScene extends Scene {
  enter(){this.selected=0;this.time=0;this.confirmPressed=false;this.holdTimer=null;this.showTooltip=-1;}
  update(dt){this.time+=dt;}
  onTouchStart(id,x,y){
    // Check card touches
    CFG.CLASSES.forEach((c,i)=>{
      const bx=i*(this.W/3),bw=this.W/3;
      if(x>=bx&&x<bx+bw&&y>200&&y<520){
        this.selected=i;U.vibrate(15);this.game.audio.sfx('uiClick');
        this.holdTimer=setTimeout(()=>this.showTooltip=i,400);
      }
    });
    // Confirm
    if(y>560&&x>60&&x<300){this.confirmPressed=true;}
  }
  onTouchEnd(id,x,y){
    clearTimeout(this.holdTimer);this.showTooltip=-1;
    if(this.confirmPressed){
      this.confirmPressed=false;
      U.vibrate(25);this.game.audio.sfx('levelup');
      this.game.switchScene('gameplay',{classId:CFG.CLASSES[this.selected].id});
    }
  }
  draw(){
    const{ctx,W,H,time}=this;
    ctx.fillStyle=CFG.C.bg;ctx.fillRect(0,0,W,H);
    // BG particles
    ctx.save();ctx.globalAlpha=0.04;
    for(let i=0;i<10;i++){const y=(time*15+i*70)%H;ctx.fillStyle=CFG.C.neon1;ctx.fillRect(i*36,y,1,20);}
    ctx.restore();
    Draw.glowText(ctx,'CHỌN NHÂN VẬT',W/2,55,CFG.C.neon1,18,12);
    ctx.font='11px Arial';ctx.fillStyle=CFG.C.textDim;ctx.textAlign='center';
    ctx.fillText('Nhấn giữ để xem kỹ năng chi tiết',W/2,80);

    CFG.CLASSES.forEach((c,i)=>{
      const sel=this.selected===i;
      const bx=i*(W/3)+6,bw=W/3-12,by=110,bh=410;
      ctx.save();
      if(sel){ctx.shadowColor=c.color;ctx.shadowBlur=20;}
      Draw.roundRect(ctx,bx,by,bw,bh,10,sel?U.rgba(c.color,0.15):'rgba(15,15,35,0.9)',sel?c.color:'#333355');
      ctx.restore();
      // Class sprite (drawn with canvas shapes)
      this._drawClassSprite(ctx,bx+bw/2,by+80,c,time,sel);
      // Name
      ctx.font=`bold 11px Arial`;ctx.fillStyle=c.color;ctx.textAlign='center';ctx.shadowColor=c.color;ctx.shadowBlur=sel?8:0;
      // Wrap name
      const words=c.name.split(' ');
      words.forEach((w,wi)=>ctx.fillText(w,bx+bw/2,by+155+wi*16));
      ctx.shadowBlur=0;
      // Stats
      const stats=[['❤',c.hp,c.maxHp],['⚡',c.mp*4,c.maxMp*4],['⚔',c.atk*4,100],['🐾',c.spd*10,60]];
      stats.forEach(([icon,val,max],si)=>{
        const sy=by+200+si*42;
        ctx.font='10px Arial';ctx.fillStyle=CFG.C.textDim;ctx.textAlign='left';ctx.fillText(icon+' '+['HP','MP','ATK','SPD'][si],bx+6,sy+12);
        Draw.bar(ctx,bx+6,sy+16,bw-12,5,val/max,c.color,'#111133',null);
      });
      // Skill name
      ctx.font='bold 9px Arial';ctx.fillStyle=CFG.C.textGold;ctx.textAlign='center';
      ctx.fillText('✦ '+c.skillName,bx+bw/2,by+380);
    });

    // Confirm button
    const sel=CFG.CLASSES[this.selected];
    ctx.save();ctx.shadowColor=sel.color;ctx.shadowBlur=15;
    Draw.roundRect(ctx,60,572,W-120,46,10,U.rgba(sel.color,0.2),sel.color);
    ctx.font='bold 16px Arial';ctx.fillStyle=sel.color;ctx.textAlign='center';ctx.shadowColor=sel.color;ctx.shadowBlur=8;
    ctx.fillText('BẮT ĐẦU HÀNH TRÌNH',W/2,601);ctx.restore();

    // Tooltip
    if(this.showTooltip>=0){
      const c=CFG.CLASSES[this.showTooltip];
      Draw.roundRect(ctx,20,H/2-60,W-40,130,10,'rgba(5,5,20,0.97)',c.color);
      Draw.glowText(ctx,'⚡ '+c.skillName,W/2,H/2-30,c.color,14,8);
      ctx.font='12px Arial';ctx.fillStyle=CFG.C.text;ctx.textAlign='center';ctx.fillText(c.skillDesc,W/2,H/2,W-80);
      ctx.fillText(`Hồi chiêu: ${c.skillCd}s | Chi phí: ${c.skillMp} MP`,W/2,H/2+30);
    }

    // Back button
    Draw.glowText(ctx,'← Quay Lại',50,30,CFG.C.textDim,12,4);
  }
  _drawClassSprite(ctx,x,y,c,t,sel){
    ctx.save();
    const bob=Math.sin(t*3)*3;
    if(sel){ctx.globalAlpha=0.18+Math.sin(t*4)*0.09;ctx.fillStyle=c.color;ctx.beginPath();ctx.arc(x,y+bob,34,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;}
    ctx.shadowColor=c.color;ctx.shadowBlur=sel?18:6;
    const key=`characters/${c.id}`;
    if(Assets.ready(key)){
      const meta=SPRITE_META[key]||{frames:4,cols:4,w:64,h:64};
      const frame=Math.floor(t*5)%(meta.frames||4);
      drawSprite(ctx,key,frame,x-28,y-36+bob,56,56);
    } else {
      ctx.fillStyle=c.color;ctx.fillRect(x-12,y-14+bob,24,24);
      ctx.fillStyle=c.accentColor;ctx.fillRect(x-12,y-2+bob,24,10);
      ctx.fillStyle='#fff';ctx.fillRect(x-6,y-10+bob,4,3);ctx.fillRect(x+2,y-10+bob,4,3);
    }
    ctx.restore();
  }
}

// --- PERMANENT UPGRADES SCENE ---
class PermaScene extends Scene {
  enter(){
    this.meta=SaveMgr.load()||{soulCoins:0,permaUpgrades:{}};
    this.msg='';this.msgTime=0;
  }
  update(dt){if(this.msgTime>0)this.msgTime-=dt;}
  onTouchEnd(id,x,y){
    U.vibrate(15);this.game.audio.sfx('uiClick');
    // Back
    if(y<60&&x<100){this.game.switchScene('menu');return;}
    // Buy buttons
    CFG.PERMA.forEach((p,i)=>{
      const by=110+i*90;
      const level=this.meta.permaUpgrades[p.id]||0;
      if(y>by&&y<by+80&&x>this.W-120&&x<this.W-20&&level<p.maxLevel){
        const cost=p.cost*(level+1);
        if(this.meta.soulCoins>=cost){
          this.meta.soulCoins-=cost;
          this.meta.permaUpgrades[p.id]=(level+1);
          SaveMgr.save(this.meta);
          this.msg=`Đã nâng cấp ${p.name}!`;this.msgTime=2;
          this.game.audio.sfx('levelup');U.vibrate(30);
        }else{this.msg='Không đủ Soul Coins!';this.msgTime=2;this.game.audio.sfx('playerHit');}
      }
    });
  }
  draw(){
    const{ctx,W,H}=this;
    ctx.fillStyle=CFG.C.bg;ctx.fillRect(0,0,W,H);
    Draw.glowText(ctx,'← Quay Lại',50,30,CFG.C.neon2,12,4);
    Draw.glowText(ctx,'NÂNG CẤP VĨNH VIỄN',W/2,65,CFG.C.textGold,16,10);
    Draw.glowText(ctx,`💎 ${this.meta.soulCoins} Soul Coins`,W/2,90,CFG.C.textGold,13,6);
    CFG.PERMA.forEach((p,i)=>{
      const by=110+i*90;const level=this.meta.permaUpgrades[p.id]||0;
      Draw.roundRect(ctx,15,by,W-30,82,8,'rgba(15,15,35,0.9)','#334');
      ctx.font='bold 13px Arial';ctx.fillStyle=CFG.C.text;ctx.textAlign='left';ctx.fillText(p.name,25,by+24);
      ctx.font='11px Arial';ctx.fillStyle=CFG.C.textDim;ctx.fillText(`Cấp ${level}/${p.maxLevel}`,25,by+44);
      // Progress pips
      for(let j=0;j<p.maxLevel;j++){ctx.fillStyle=j<level?CFG.C.textGold:'#333355';ctx.fillRect(25+j*18,by+52,14,8);}
      if(level<p.maxLevel){
        const cost=p.cost*(level+1);
        Draw.roundRect(ctx,W-120,by+18,96,44,6,U.rgba(CFG.C.textGold,0.15),CFG.C.textGold);
        ctx.font='bold 12px Arial';ctx.fillStyle=CFG.C.textGold;ctx.textAlign='center';
        ctx.fillText(`💎 ${cost}`,W-72,by+38);ctx.font='10px Arial';ctx.fillText('MUA',W-72,by+54);
      }else{ctx.font='12px Arial';ctx.fillStyle='#4a4';ctx.textAlign='center';ctx.fillText('TỐI ĐA',W-72,by+42);}
    });
    if(this.msgTime>0){
      ctx.save();ctx.globalAlpha=this.msgTime>1?1:this.msgTime;
      Draw.roundRect(ctx,40,H/2-20,W-80,40,8,'rgba(5,5,20,0.9)',CFG.C.neon1);
      ctx.font='13px Arial';ctx.fillStyle=CFG.C.neon1;ctx.textAlign='center';ctx.fillText(this.msg,W/2,H/2+5);
      ctx.restore();
    }
  }
}


// --- SHOP SCENE ---
class ShopScene extends Scene {
  enter(data){
    this.player=data.player||null;
    this.gameplay=data.gameplay||this.game.scenes.gameplay;
    this.meta=SaveMgr.load()||{soulCoins:0,permaUpgrades:{},bestFloor:0};
    this.selectedOffer=0;
    this.info='';
    this.infoTime=0;
    this._rollOffers();
  }
  _rollOffers(){
    const pool=Object.values(ITEM_DB).filter(i=>i.shop);
    this.offers=[];
    const picks=[...pool].sort(()=>Math.random()-0.5).slice(0,5);
    picks.forEach((item)=>{
      const isGear=item.type==='gear';
      const offerItem=isGear?createGearInstance(item,this.player?.floor||1,item.rarity||0):item;
      this.offers.push({item:offerItem,qty:isGear?1:U.rng(1,item.stack||3),price:item.price});
    });
  }
  _save(){if(this.gameplay&&this.gameplay._saveRun)this.gameplay._saveRun();}
  update(dt){if(this.infoTime>0)this.infoTime-=dt;}
  onTouchEnd(id,x,y){
    U.vibrate(12);this.game.audio.sfx('uiClick');
    if(y<55&&x<90){this.game.switchScene('gameplay',{fromShop:true});return;}
    for(let i=0;i<this.offers.length;i++){
      const o=this.offers[i];
      const oy=110+i*82;
      if(x>20&&x<340&&y>oy&&y<oy+70){
        if(x<240){this.selectedOffer=i;return;}
        const cost=o.price*o.qty;
        if(this.player.gold>=cost){
          this.player.gold-=cost;
          this.player.addItem(o.item,o.qty);
          this.info=`Đã mua ${o.item.name}`;
          this.infoTime=1.6;
          this.game.audio.sfx('levelup');
          this._save();
        }else{this.info='Không đủ vàng';this.infoTime=1.6;}
        return;
      }
    }
  }
  draw(){
    const{ctx,W,H}=this;
    ctx.fillStyle='rgba(5,5,20,0.96)';ctx.fillRect(0,0,W,H);
    Draw.glowText(ctx,'← Quay Lại',52,30,CFG.C.neon2,12,4);
    Draw.glowText(ctx,'CỬA HÀNG',W/2,56,CFG.C.textGold,18,12);
    ctx.font='12px Arial';ctx.fillStyle=CFG.C.textGold;ctx.textAlign='center';ctx.fillText(`Vàng: ${U.fmtNum(this.player.gold)}`,W/2,78);
    ctx.font='11px Arial';ctx.fillStyle=CFG.C.textDim;ctx.fillText('Kho đồ được tách sang màn hình riêng.',W/2,95);

    this.offers.forEach((o,i)=>{
      const y=110+i*82;
      const rarity=o.item.rarity||0;
      const rc=CFG.RARITY_COLORS[rarity]||CFG.C.neon1;
      Draw.roundRect(ctx,16,y,328,70,10,U.rgba(rc,0.08),rc);
      ctx.font='bold 18px Arial';ctx.fillStyle=rc;ctx.textAlign='left';ctx.fillText(o.item.icon,28,y+30);
      ctx.font='bold 13px Arial';ctx.fillStyle=CFG.C.text;ctx.fillText(o.item.name,58,y+22);
      ctx.font='11px Arial';ctx.fillStyle=CFG.C.textDim;ctx.fillText((o.item.desc||'').slice(0,40),58,y+38); if(o.item.type==='gear'){ctx.fillStyle=rc;ctx.fillText(gearBonusText(o.item).slice(0,50),58,y+56);}
      Draw.roundRect(ctx,248,y+15,80,34,8,U.rgba(CFG.C.textGold,0.18),CFG.C.textGold);
      ctx.font='bold 12px Arial';ctx.fillStyle=CFG.C.textGold;ctx.textAlign='center';ctx.fillText(`💰 ${o.price*o.qty}`,288,y+36);
      if(i===this.selectedOffer){Draw.roundRect(ctx,20,y+4,324,62,8,null,CFG.C.neon1);}
    });
    const so=this.offers[this.selectedOffer];
    if(so){
      Draw.roundRect(ctx,18,520,324,86,10,'rgba(10,10,24,0.96)',CFG.C.neon1);
      const rc=CFG.RARITY_COLORS[so.item.rarity||0]||CFG.C.neon1;
      ctx.font='bold 13px Arial';ctx.fillStyle=rc;ctx.textAlign='left';ctx.fillText('XEM TRƯỚC',28,542);
      ctx.font='bold 12px Arial';ctx.fillStyle=CFG.C.text;ctx.fillText(so.item.name,28,560);
      ctx.font='11px Arial';ctx.fillStyle=CFG.C.textDim;ctx.fillText((so.item.desc||'').slice(0,44),28,578);
      ctx.fillStyle=rc;ctx.fillText(so.item.type==='gear'?(gearBonusText(so.item).slice(0,50)):'Consumable',28,596);
    }
    if(this.infoTime>0){ctx.save();ctx.globalAlpha=this.infoTime>1?1:this.infoTime;
      Draw.roundRect(ctx,40,H-62,W-80,34,8,'rgba(5,5,20,0.95)',CFG.C.neon1);
      ctx.font='12px Arial';ctx.fillStyle=CFG.C.neon1;ctx.textAlign='center';ctx.fillText(this.info,W/2,H-40);ctx.restore();}
  }
}

class InventoryScene extends Scene {
  enter(data){
    this.player=data.player||null;
    this.gameplay=data.gameplay||this.game.scenes.gameplay;
    this.selectedInv=-1;
    this.selectedSlot=-1;
    this.selectedEquip='weapon';
    this.info='';
    this.infoTime=0;
  }
  _save(){if(this.gameplay&&this.gameplay._saveRun)this.gameplay._saveRun();}
  update(dt){if(this.infoTime>0)this.infoTime-=dt;}
  _equipSelected(){
    if(this.selectedInv<0)return false;
    const it=this.player.inventory[this.selectedInv];
    if(!it)return false;
    if(this.player.useItem(it,this.game)){
      this.info=it.data?`Đã trang bị ${it.data.name}`:`Đã dùng ${it.id}`;
      this.infoTime=1.4;
      this._save();
      return true;
    }
    return false;
  }
  _unequipSelected(){
    if(!this.selectedEquip)return false;
    if(this.player._unequip(this.selectedEquip)){
      this.info=`Đã tháo ${GEAR_SLOT_LABELS[this.selectedEquip]||this.selectedEquip}`;
      this.infoTime=1.4;
      this._save();
      return true;
    }
    return false;
  }
  onTouchEnd(id,x,y){
    U.vibrate(12);this.game.audio.sfx('uiClick');
    if(y<55&&x<90){this.game.switchScene('gameplay',{fromInventory:true});return;}

    const eqOrder=['weapon','armor','ring','relic'];
    const equipX=18,equipY=95,eqSize=70;
    for(let i=0;i<eqOrder.length;i++){
      const slot=eqOrder[i];
      const ex=equipX+(i%2)*78, ey=equipY+Math.floor(i/2)*86;
      if(x>ex&&x<ex+eqSize&&y>ey&&y<ey+eqSize){
        this.selectedEquip=slot;
        const cur=this.player.equipment&&this.player.equipment[slot];
        if(cur && this.selectedInv<0){
          this._unequipSelected();
          return;
        }
        return;
      }
    }

    const inv={x:18,y:285,cols:4,rows:3,size:72,gap:6};
    for(let idx=0;idx<this.player.inventory.length;idx++){
      const c=idx%inv.cols,r=Math.floor(idx/inv.cols);
      const sx=inv.x+c*(inv.size+inv.gap),sy=inv.y+r*(inv.size+inv.gap);
      if(x>sx&&x<sx+inv.size&&y>sy&&y<sy+inv.size){this.selectedInv=idx;this.selectedSlot=-1;return;}
    }

    for(let i=0;i<3;i++){
      const sx=150+i*70,sy=225;
      if(x>sx&&x<sx+54&&y>sy&&y<sy+54){
        if(this.selectedInv>=0){
          const it=this.player.inventory[this.selectedInv];
          if(it&&this.player.setQuickSlot(i,it.id)){this.info=`Gán ${it.id} vào ô ${i+1}`;this.infoTime=1.4;this._save();}
        } else if(this.player.useQuickSlot(i,this.game)){this.info='Đã dùng nhanh';this.infoTime=1.2;this._save();}
        else{this.selectedSlot=i;}
        return;
      }
    }

    if(this.selectedInv>=0&&x>250&&x<340&&y>508&&y<548){this._equipSelected();return;}
    if(this.selectedEquip&&x>250&&x<340&&y>558&&y<590){this._unequipSelected();return;}
  }
  draw(){
    const{ctx,W,H}=this;
    ctx.fillStyle='rgba(5,5,20,0.97)';ctx.fillRect(0,0,W,H);
    Draw.glowText(ctx,'← Quay Lại',52,30,CFG.C.neon2,12,4);
    Draw.glowText(ctx,'KHO ĐỒ',W/2,56,CFG.C.textGold,18,12);

    Draw.roundRect(ctx,14,78,W-28,136,10,'rgba(12,12,32,0.94)',CFG.C.neon1);
    const p=this.player;
    const statLines=[
      `HP ${Math.ceil(p.hp)}/${p.maxHp}`,
      `MP ${Math.ceil(p.mp)}/${p.maxMp}`,
      `ATK ${Math.ceil(p.atk)}  DEF ${Math.ceil(p.def)}`,
      `CRIT ${Math.ceil(p.crit)}%  x${(p.critMult||2).toFixed(1)}`,
    ];
    ctx.font='bold 12px Arial';ctx.fillStyle=CFG.C.text;ctx.textAlign='left';
    statLines.forEach((t,i)=>ctx.fillText(t,26,102+i*22));
    ctx.fillStyle=CFG.C.textDim;
    ctx.fillText(`Trang bị thay đổi chỉ số ngay khi gắn vào ô.`,26,194);

    const eqOrder=['weapon','armor','ring','relic'];
    eqOrder.forEach((slot,i)=>{
      const ex=182+(i%2)*78, ey=96+Math.floor(i/2)*66;
      const item=p.equipment&&p.equipment[slot]?(p.equipment[slot].data||ITEM_DB[p.equipment[slot].id]):null;
      const rc=item?CFG.RARITY_COLORS[item.rarity||0]:CFG.C.neon1;
      Draw.roundRect(ctx,ex,ey,68,54,8,item?U.rgba(rc,0.12):'rgba(18,18,40,0.9)',item?rc:'#445');
      ctx.font='18px Arial';ctx.fillStyle=item?'#fff':'#667';ctx.textAlign='center';
      ctx.fillText(item?(item.icon||GEAR_SHORT[slot]||'?'):'＋',ex+34,ey+28);
      ctx.font='8px Arial';ctx.fillStyle=item?rc:'#667';ctx.fillText(GEAR_SLOT_LABELS[slot],ex+34,ey+47);
      if(this.selectedEquip===slot){Draw.roundRect(ctx,ex-2,ey-2,72,58,8,null,CFG.C.neon2);}
    });

    Draw.glowText(ctx,'Ô nhanh',56,238,CFG.C.neon1,12,4,'left');
    for(let i=0;i<3;i++){
      const sx=150+i*70,sy=225;
      Draw.roundRect(ctx,sx,sy,54,54,8,'rgba(20,20,45,0.96)',i===this.selectedSlot?CFG.C.neon2:'#445');
      ctx.font='18px Arial';ctx.fillStyle='#fff';ctx.textAlign='center';
      const itemId=this.player.quickSlots[i];
      ctx.fillText(itemId?(ITEM_DB[itemId]?.icon||'?'):'＋',sx+27,sy+30);
      ctx.font='10px Arial';ctx.fillStyle=CFG.C.textDim;ctx.fillText(String(i+1),sx+27,sy+47);
    }

    Draw.glowText(ctx,'Kho đồ',50,275,CFG.C.neon1,12,4,'left');
    const inv={x:18,y:285,cols:4,rows:3,size:72,gap:6};
    for(let r=0;r<inv.rows;r++)for(let c=0;c<inv.cols;c++){
      const idx=r*inv.cols+c;
      const sx=inv.x+c*(inv.size+inv.gap),sy=inv.y+r*(inv.size+inv.gap);
      const stack=this.player.inventory[idx];
      const gearData=stack?.data||null;
      const rarityColor=gearData?CFG.RARITY_COLORS[gearData.rarity||0]:'#445';
      Draw.roundRect(ctx,sx,sy,inv.size,inv.size,8,idx===this.selectedInv?(gearData?U.rgba(rarityColor,0.18):'rgba(60,60,120,0.95)'):'rgba(20,20,45,0.96)',idx===this.selectedInv?(gearData?rarityColor:CFG.C.neon2):'#445');
      if(stack){ctx.font=gearData?'18px Arial':'20px Arial';ctx.fillStyle='#fff';ctx.textAlign='center';ctx.fillText(gearData?gearData.icon:(ITEM_DB[stack.id]?.icon||'?'),sx+inv.size/2,sy+31);ctx.font='11px Arial';ctx.fillStyle=gearData?rarityColor:CFG.C.textGold;ctx.fillText(gearData?gearData.name.split(' [')[0]:`x${stack.qty}`,sx+inv.size/2,sy+49);if(!gearData)ctx.fillText(`x${stack.qty}`,sx+inv.size/2,sy+60);}else{ctx.font='26px Arial';ctx.fillStyle='#334';ctx.textAlign='center';ctx.fillText('+',sx+inv.size/2,sy+40);}
    }

    Draw.roundRect(ctx,246,508,88,40,8,'rgba(30,30,60,0.95)',CFG.C.textGold);
    ctx.font='bold 12px Arial';ctx.fillStyle=CFG.C.textGold;ctx.textAlign='center';
    const it=this.selectedInv>=0?this.player.inventory[this.selectedInv]:null;
    ctx.fillText(this.selectedInv>=0&&it&&it.data?'TRANG BỊ':(this.selectedInv>=0?'DÙNG':'CHỌN'),290,533);
    Draw.roundRect(ctx,246,558,88,32,8,'rgba(30,30,60,0.95)',CFG.C.neon2);
    ctx.fillStyle=CFG.C.neon2;ctx.fillText('THÁO',290,579);

    const selItem=this.selectedInv>=0?this.player.inventory[this.selectedInv]:null;
    if(selItem){
      const detailX=18,detailY=520,detailW=216,detailH=122;
      const detail=selItem.data||ITEM_DB[selItem.id];
      const rarityColor=detail?.rarity!=null?CFG.RARITY_COLORS[detail.rarity]:CFG.C.neon1;
      Draw.roundRect(ctx,detailX,detailY,detailW,detailH,8,U.rgba(rarityColor,0.12),rarityColor);
      ctx.font='bold 12px Arial';ctx.fillStyle=rarityColor;ctx.textAlign='left';ctx.fillText(detail?.name||ITEM_DB[selItem.id]?.name||selItem.id,detailX+10,detailY+22);
      ctx.font='11px Arial';ctx.fillStyle=CFG.C.text;ctx.fillText(detail?.baseName?`Base: ${detail.baseName}`:(ITEM_DB[selItem.id]?.type==='gear'?'Trang bị':'Tiêu hao'),detailX+10,detailY+42);
      ctx.fillStyle=CFG.C.textDim;ctx.fillText((detail?.desc||ITEM_DB[selItem.id]?.desc||'').slice(0,42),detailX+10,detailY+60);
      ctx.fillStyle=rarityColor;ctx.fillText((detail?.affixes||[]).join(' · ').slice(0,44)||'Không có affix',detailX+10,detailY+80);
      if(detail?.mods){ctx.fillStyle=CFG.C.textGold;ctx.fillText(gearBonusText(detail).slice(0,54),detailX+10,detailY+100);}
    }

    if(this.infoTime>0){ctx.save();ctx.globalAlpha=Math.min(1,this.infoTime);Draw.roundRect(ctx,40,H-62,W-80,34,8,'rgba(5,5,20,0.95)',CFG.C.neon1);ctx.font='12px Arial';ctx.fillStyle=CFG.C.neon1;ctx.textAlign='center';ctx.fillText(this.info,W/2,H-40);ctx.restore();}
  }
}

// --- UPGRADE SCENE ---
// --- UPGRADE SCENE ---
class UpgradeScene extends Scene {
  enter(data){
    this.floor=data.floor;this.player=data.player;this.choices=[];
    const pool=[...CFG.UPGRADES];
    const shuffle=(arr)=>{for(let i=arr.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[arr[i],arr[j]]=[arr[j],arr[i]];}return arr;};
    this.choices=shuffle(pool).slice(0,3);
    this.chosen=false;this.time=0;
  }
  update(dt){this.time+=dt;}
  onTouchEnd(id,x,y){
    if(this.chosen)return;
    // Skip
    if(y>this.H-80&&x>this.W/2-80&&x<this.W/2+80){this.chosen=true;this.game.audio.sfx('uiClick');setTimeout(()=>this.game.switchScene('gameplay',{resume:true,fromUpgrade:true}),300);return;}
    this.choices.forEach((u,i)=>{
      const by=160+i*140;
      if(y>by&&y<by+130&&x>20&&x<this.W-20){
        this.chosen=true;
        u.apply(this.player);
        this.player.upgrades.push(u.id);
        this.game.audio.sfx('levelup');U.vibrate(40);
        setTimeout(()=>this.game.switchScene('gameplay',{resume:true,fromUpgrade:true}),400);
      }
    });
  }
  draw(){
    const{ctx,W,H,time}=this;
    ctx.fillStyle='rgba(5,5,20,0.97)';ctx.fillRect(0,0,W,H);
    Draw.glowText(ctx,'CHỌN NÂNG CẤP',W/2,55,CFG.C.neon1,20,14);
    Draw.glowText(ctx,`Tầng ${this.floor} hoàn thành!`,W/2,82,CFG.C.textGold,13,6);
    this.choices.forEach((u,i)=>{
      const bx=20,bw=W-40,by=155+i*140,bh=128;
      const pulse=Math.sin(time*3+i)*0.05+0.95;
      ctx.save();ctx.shadowColor=CFG.C.neon1;ctx.shadowBlur=this.chosen?0:8;
      Draw.roundRect(ctx,bx,by,bw,bh,10,U.rgba(CFG.C.neon1,0.08),CFG.C.neon1);
      ctx.font='48px Arial';ctx.textAlign='center';ctx.fillText(u.icon,bx+48,by+74);
      ctx.font='bold 15px Arial';ctx.fillStyle=CFG.C.neon2;ctx.fillText(u.name,bx+bw/2+20,by+44);
      ctx.font='12px Arial';ctx.fillStyle=CFG.C.text;ctx.fillText(u.desc,bx+bw/2+20,by+72);
      ctx.restore();
    });
    // Skip
    ctx.save();ctx.globalAlpha=0.5;
    Draw.roundRect(ctx,W/2-75,H-75,150,36,8,'rgba(30,30,50,0.8)','#445');
    ctx.font='12px Arial';ctx.fillStyle=CFG.C.textDim;ctx.textAlign='center';ctx.fillText('Bỏ qua (không khuyến khích)',W/2,H-51);
    ctx.restore();
  }
}

// --- GAME OVER SCENE ---
class GameOverScene extends Scene {
  enter(data){
    this.stats=data;this.time=0;
    this.meta=SaveMgr.load()||{soulCoins:0,permaUpgrades:{},bestFloor:0};
    // Award soul coins & gold
    const earned=Math.floor((data.soulCoins||0)*(data.soulMult||1));
    this.meta.soulCoins=(this.meta.soulCoins||0)+earned;
    this.earnedSouls=earned;
    if((data.floor||1)>(this.meta.bestFloor||0))this.meta.bestFloor=data.floor||1;
    SaveMgr.save(this.meta);SaveMgr.clearRun();
  }
  update(dt){this.time+=dt;}
  onTouchEnd(id,x,y){
    U.vibrate(20);this.game.audio.sfx('uiClick');
    if(y>480&&y<535&&x>30&&x<this.W/2-10)this.game.switchScene('charselect');
    if(y>480&&y<535&&x>this.W/2+10&&x<this.W-30)this.game.switchScene('menu');
  }
  draw(){
    const{ctx,W,H,time}=this;
    ctx.fillStyle='rgba(4,3,15,0.98)';ctx.fillRect(0,0,W,H);
    // Broken effect
    for(let i=0;i<8;i++){const x=Math.random()*W,yy=Math.random()*200+100,l=Math.random()*60+20;ctx.save();ctx.globalAlpha=0.05;ctx.strokeStyle=CFG.C.neon3;ctx.lineWidth=0.5;ctx.beginPath();ctx.moveTo(x,yy);ctx.lineTo(x+Math.random()*20-10,yy+l);ctx.stroke();ctx.restore();}
    // Title
    const shake=time<1?Math.sin(time*40)*3*(1-time):0;
    ctx.save();ctx.translate(W/2+shake,0);
    Draw.glowText(ctx,'NGƯƠI ĐÃ',0,120,CFG.C.neon3,28,20);
    Draw.glowText(ctx,'NGÃ XUỐNG...',0,158,CFG.C.neon3,22,15);
    ctx.restore();
    // Stats
    const s=this.stats;const sx=30,sy=195,sw=W-60,sh=240;
    Draw.roundRect(ctx,sx,sy,sw,sh,10,'rgba(12,5,25,0.9)',CFG.C.neon3);
    const rows=[['🗺 Tầng đạt được',s.floor||1],['💀 Quái đã giết',s.kills||0],['💰 Vàng kiếm được',U.fmtNum(s.gold||0)],['⏱ Thời gian sống',`${Math.floor((s.time||0)/60)}m${Math.floor((s.time||0)%60)}s`],['⚔ Sát thương gây ra',U.fmtNum(s.damageDealt||0)]];
    rows.forEach(([k,v],i)=>{
      ctx.font='12px Arial';ctx.fillStyle=CFG.C.textDim;ctx.textAlign='left';ctx.fillText(k,sx+15,sy+30+i*44);
      ctx.font='bold 15px Arial';ctx.fillStyle=CFG.C.text;ctx.textAlign='right';ctx.fillText(v,sx+sw-15,sy+30+i*44);
    });
    // Soul coins earned
    Draw.glowText(ctx,`+${this.earnedSouls} 💎 Soul Coins`,W/2,sy+sh+24,CFG.C.textGold,14,8);
    // Buttons
    const btnY=490;
    Draw.roundRect(ctx,30,btnY,W/2-40,48,8,U.rgba(CFG.C.neon1,0.15),CFG.C.neon1);
    Draw.glowText(ctx,'CHƠI LẠI',W/4+10,btnY+28,CFG.C.neon1,13,6);
    Draw.roundRect(ctx,W/2+10,btnY,W/2-40,48,8,U.rgba(CFG.C.neon2,0.15),CFG.C.neon2);
    Draw.glowText(ctx,'VỀ THÀNH',W*3/4,btnY+28,CFG.C.neon2,13,6);
  }
}

// --- PAUSE SCENE ---
class PauseScene extends Scene {
  enter(data){this.prev=data;}
  onTouchEnd(id,x,y){
    if(y>250&&y<305&&x>60&&x<this.W-60){this.game.switchScene('gameplay',{resume:true});}
    if(y>320&&y<375&&x>60&&x<this.W-60){SaveMgr.clearRun();this.game.switchScene('menu');}
  }
  draw(){
    const{ctx,W,H}=this;
    ctx.fillStyle='rgba(5,5,20,0.92)';ctx.fillRect(0,0,W,H);
    Draw.glowText(ctx,'TẠM DỪNG',W/2,H/2-100,CFG.C.neon1,24,15);
    Draw.roundRect(ctx,60,250,W-120,50,10,U.rgba(CFG.C.neon2,0.15),CFG.C.neon2);
    Draw.glowText(ctx,'TIẾP TỤC',W/2,281,CFG.C.neon2,16,8);
    Draw.roundRect(ctx,60,320,W-120,50,10,U.rgba(CFG.C.neon3,0.15),CFG.C.neon3);
    Draw.glowText(ctx,'VỀ THÀNH (Mất tiến trình tầng)',W/2,351,CFG.C.neon3,11,5);
  }
}

// ================================================================
// GAMEPLAY SCENE (Main)
// ================================================================
class GameplayScene extends Scene {
  enter(data){
    this.meta=SaveMgr.load()||{soulCoins:0,permaUpgrades:{}};
    if(data&&data.resume&&!data.fromUpgrade&&!data.fromShop){
      const saved=SaveMgr.loadRun();
      if(saved){this._loadRun(saved);return;}
    }
    if(data&&data.fromUpgrade){
      if(this.player){this._initFloor();return;}
    }
    if((data&&data.fromShop&&this.player)||(data&&data.fromInventory&&this.player)){
      this._initUI();return;
    }
    // New run
    const classId=(data&&data.classId)||'warrior';
    const classData=CFG.CLASSES.find(c=>c.id===classId)||CFG.CLASSES[0];
    // Build perma bonus function
    const permaBonus=(p)=>{
      const pu=this.meta.permaUpgrades||{};
      CFG.PERMA.forEach(upg=>{const lv=pu[upg.id]||0;for(let i=0;i<lv;i++)upg.apply(p,i);});
    };
    this.player=new Player(classData,permaBonus);
    this.player.scene=this;
    this.currentFloor=1;
    this._initFloor();
  }

  _initFloor(){
    const gen=new DungeonGen();
    this.dungeon=gen.generate(this.currentFloor);
    this.player.x=this.dungeon.playerStart.x;
    this.player.y=this.dungeon.playerStart.y;
    this.player.floor=this.currentFloor;
    CFG.BIOME=getBiome(this.currentFloor);
    CFG.BIOME=getBiome(this.currentFloor);
    this.enemies=this.dungeon.enemies.map(e=>{
      if(e.type==='boss'){const boss=new Boss(e.x,e.y,this.currentFloor);boss.scene=this;return boss;}
      const data=CFG.ENEMIES.find(d=>d.id===e.type)||CFG.ENEMIES[0];
      return new Enemy(data,e.x,e.y,this.currentFloor);
    });
    this.chests=[...this.dungeon.chests];
    this.projectiles=[];this.particles=[];this.floatingTexts=[];
    this.stairsLocked=true;
    this.stairsClear=false;
    this.hazards=[];
    this.stairPrompt=0;
    this._stairTriggered=false;
    this.cameraX=0;this.cameraY=0;
    this._initUI();
    this.game.audio.startBgm(this.dungeon.isBossFloor?'boss':'dungeon');
    this._bossAnnounce=this.dungeon.isBossFloor?3.0:0; // seconds to show boss warning
    // Skill evolution: trigger on floor 6+ (or kills 25+)
    const p=this.player;
    if(p&&!p._skillEvolved&&(this.currentFloor>=6||p.kills>=25)){
      p.skillLevel=1;p._skillEvolved=true;
      const evoNames={warrior:'Bão Tối Toàn Tập',mage:'Sao Băng Trận',rogue:'Ám Sát Hư Vô'};
      const evoName=evoNames[p.classId]||'Skill Tiến Hóa';
      p.skillName=evoName;
      this.floatingTexts.push(FX.text(p.x,p.y-80,'⚡ SKILL TIẾN HÓA!',CFG.C.neon3,16));
      this.floatingTexts.push(FX.text(p.x,p.y-98,evoName,CFG.C.neon2,13));
      if(this._shakeTimer!==undefined)this.addShake(1.5,0.18);
    }
    this._saveRun();
  }

  _initUI(){
    const W=this.W,H=this.H;
    this.joystick=new VirtualJoystick(85,H-110,55);
    this.touchTargets={skill1:{x:W-85,y:H-128,r:35},skill2:{x:W-155,y:H-83,r:28},dash:{x:W-50,y:H-78,r:25},pause:{x:W-30,y:30,r:22},minimap:{x:30,y:74,r:18},inventory:{x:W-110,y:74,r:22},shop:{x:W-70,y:74,r:22}};
    this.quickSlotTargets=[{x:W/2-64,y:H-25,r:18},{x:W/2-16,y:H-25,r:18},{x:W/2+32,y:H-25,r:18}];
    this.showMinimap=true;this.time=0;this.paused=false;
    this._keyX=0;this._keyY=0; // keyboard axes initialized
    this.stairPrompt=0;this._stairTriggered=false;this.pendingUpgrade=false;
    this._shakeTimer=0;this._shakeIntensity=0;
    this.hitstopTimer=0;
    this.allies=[];
    this.skillEffects=[];
    this._shopPressed=null;this._inventoryPressed=null;this._quickSlotPressed=null;
    this.lootPopup=null;this.lootPopupTime=0;
    this.bossHpVisible=false;
    this._gameOverQueued=false;
    this._stairTriggered=false;
    this._damageFlash=0;  // screen-edge flash on player hit
    this._critFlash=0;    // screen flash on player crit
    this._spawnHazards();
  }

  addShake(intensity=1.5,duration=0.1){
    this._shakeIntensity=Math.max(this._shakeIntensity,intensity);
    this._shakeTimer=Math.max(this._shakeTimer,duration);
  }
  addHitstop(duration=0.08){
    this.hitstopTimer=Math.max(this.hitstopTimer,duration);
  }
  addAlly(ally){
    if(!this.allies)this.allies=[];
    this.allies.push(ally);
  }
  addSkillEffect(effect){
    if(!this.skillEffects)this.skillEffects=[];
    this.skillEffects.push(effect);
  }
  _saveRun(){
    SaveMgr.saveRun({classId:this.player.classId,floor:this.currentFloor,player:this._serializePlayer(),chests:this.chests.map(c=>({...c}))});
  }

  _serializePlayer(){
    const p=this.player;
    return{hp:p.hp,maxHp:p.maxHp,mp:p.mp,maxMp:p.maxMp,atk:p.atk,spd:p.spd,def:p.def,crit:p.crit,skillCd:p.skillCd,skillMp:p.skillMp,skillName:p.skillName,ranged:p.ranged,attackRange:p.attackRange,attackRate:p.attackRate,hpRegen:p.hpRegen,mpRegen:p.mpRegen,goldMult:p.goldMult,soulMult:p.soulMult,critMult:p.critMult,thorns:p.thorns,gold:p.gold,exp:p.exp,soulCoins:p.soulCoins,kills:p.kills,damageDealt:p.damageDealt,damageTaken:p.damageTaken,floorTime:p.floorTime,upgrades:p.upgrades,name:p.name,color:p.color,accentColor:p.accentColor,classId:p.classId,inventory:JSON.parse(JSON.stringify(p.inventory)),quickSlots:[...p.quickSlots],equipment:JSON.parse(JSON.stringify(p.equipment))};
  }

  _loadRun(saved){
    // Simplified resume: just start fresh on saved floor
    const classData=CFG.CLASSES.find(c=>c.id===saved.classId)||CFG.CLASSES[0];
    this.player=new Player(classData,null);
    this.player.scene=this;
    Object.assign(this.player,saved.player);
    this.player.scene=this;
    this.player.inventory=Array.isArray(saved.player?.inventory)?saved.player.inventory:[];
    this.player.inventory.forEach(s=>{if(s&&s.uid==null)s.uid=Math.floor(Math.random()*1e9);});
    this.player.quickSlots=Array.isArray(saved.player?.quickSlots)?saved.player.quickSlots.slice(0,3):[null,null,null];
    this.player.equipment=saved.player?.equipment&&typeof saved.player.equipment==='object'?saved.player.equipment:{weapon:null,armor:null,ring:null,relic:null};
    Object.values(this.player.equipment).forEach(e=>{if(e&&e.stackRef)delete e.stackRef;});
    this.player.legendary={projectileEcho:0,critChain:0.35,critChainRange:120,skillPulse:false,chestBurst:false,killLeechHp:0,killLeechMp:0};
    Object.values(this.player.equipment).forEach(e=>{if(e&&e.legendaryId)this.player._applyLegendaryEffect(e,1);});
    this.currentFloor=saved.floor||1;
    this._initFloor();
  }

  update(dt){
    if(this.paused)return;
    this.time+=dt;
    const p=this.player;

    // Input
    const jx=this.joystick.active?this.joystick.dx:this._keyX;
    const jy=this.joystick.active?this.joystick.dy:this._keyY;

    if(this.hitstopTimer>0){
      this.hitstopTimer=Math.max(0,this.hitstopTimer-dt);
    }

    p.update(dt,jx||0,jy||0,this.dungeon,this.projectiles);

    // Auto target enemy
    const nearestEnemy=this._getNearestEnemy(p.x,p.y,p.attackRange);
    if(nearestEnemy){
      const a=U.angle(p.x,p.y,nearestEnemy.x,nearestEnemy.y);
      p.facing=a;
    } else if(jx!==0||jy!==0){p.facing=U.angle(0,0,jx||0,jy||0);}

    // Auto attack
    if(p.attackTimer<=0){
      const result=p.tryAttack(this.enemies,this.projectiles,this.particles);
      if(result&&result.hit&&!result.ranged&&result.target){
        this.floatingTexts.push(FX.text(result.target.x,result.target.y-20,
          result.isCrit?`CRIT! ${result.dmg}`:`${result.dmg}`,
          result.isCrit?CFG.C.textGold:CFG.C.neon2,result.isCrit?16:13));
        if(result.isCrit){this.game.audio.sfx('hit');U.vibrate(15);}
        if(result.isCrit&&p.legendary.critChain>0){
          const chainTarget=this.enemies.filter(e=>!e.dead&&e!==result.target&&U.distSq(e.x,e.y,result.target.x,result.target.y)<p.legendary.critChainRange*p.legendary.critChainRange).sort((a,b)=>U.distSq(a.x,a.y,result.target.x,result.target.y)-U.distSq(b.x,b.y,result.target.x,result.target.y))[0];
          if(chainTarget){const chainDmg=Math.max(1,Math.floor(result.dmg*p.legendary.critChain));chainTarget.takeDamage(chainDmg,false);p.damageDealt+=chainDmg;this.floatingTexts.push(FX.text(chainTarget.x,chainTarget.y-18,`⚡ ${chainDmg}`,CFG.C.neon3,12));for(let i=0;i<4;i++)this.particles.push(FX.particle(chainTarget.x,chainTarget.y,U.rngf(-60,60),U.rngf(-60,20),CFG.C.neon3,0.35,U.rng(3,5),'fx/skill_burst'));}
        }
      }
      // FIX: Mage ranged crit — also play SFX/vibrate when projectile is launched as crit
      if(result&&result.hit&&result.ranged&&result.isCrit){this.game.audio.sfx('hit');U.vibrate(10);}
    }

    // Update enemies
    this.enemies.forEach(e=>e.update(dt,p,this.dungeon,this.projectiles,this.enemies));

    // Update projectiles
    this.projectiles=this.projectiles.filter(pr=>{
      pr.update(dt,this.dungeon);
      if(!pr.dead){
        if(pr.isPlayer){
          for(const e of this.enemies){
            if(e.dead) continue;
            if(U.distSq(pr.x,pr.y,e.x,e.y)<(e.size+pr.size)**2){
              const isCrit=Math.random()*100<Math.max(0,Math.min(75,p.crit));
              const dmg=Math.floor(pr.dmg*(isCrit?p.critMult:1));
              e.takeDamage(dmg,isCrit);
              p.damageDealt+=dmg;
              this.floatingTexts.push(FX.text(e.x,e.y-20,isCrit?`CRIT! ${dmg}`:`${dmg}`,isCrit?CFG.C.textGold:CFG.C.neon2));
              pr.dead=true;
              for(let i=0;i<4;i++)this.particles.push(FX.particle(e.x,e.y,U.rngf(-60,60),U.rngf(-80,-20),'#ff4466',0.3,3));
              break;
            }
          }
        } else {
          if(!p.dead&&U.distSq(pr.x,pr.y,p.x,p.y)<(12+pr.size)**2){
            const dmg=p.takeDamage(pr.dmg,null);
            if(dmg)this.floatingTexts.push(FX.text(p.x,p.y-25,`-${dmg}`,CFG.C.neon3,13));
            this.game.audio.sfx('playerHit');pr.dead=true;
            this._shakeTimer=0.25;this._shakeIntensity=7;
            this._damageFlash=0.4;  // red screen flash
          }
        }
      }
      if(pr.dead)FX.releaseProjectile(pr);
      return!pr.dead;
    });

    // Update particles & floating texts
    this.particles=this.particles.filter(pt=>{pt.update(dt);if(pt.dead)FX.releaseParticle(pt);return!pt.dead;});
    if(this.hazards&&this.player&&!this.player.dead)this.hazards.forEach(h=>h.update(dt,this.player,this));
    this.floatingTexts=this.floatingTexts.filter(ft=>{ft.update(dt);if(ft.dead)FX.releaseText(ft);return!ft.dead;});

    // Handle enemy death
    this.enemies.forEach(e=>{
      if(e.dead&&!e._looted){
        e._looted=true;p.kills++;
        const gold=Math.floor(e.lootGold*(p.goldMult||1));
        p.gold+=gold;
        p.exp+=e.exp;
        p.soulCoins+=(e.isBoss?3:0);
        if(p.legendary.killLeechHp){p.hp=Math.min(p.maxHp,p.hp+p.legendary.killLeechHp);}if(p.legendary.killLeechMp){p.mp=Math.min(p.maxMp,p.mp+p.legendary.killLeechMp);}
        this.floatingTexts.push(FX.text(e.x,e.y-30,`+${gold}💰`,CFG.C.textGold,11));
        this.game.audio.sfx('enemyDeath');
        for(let i=0;i<6;i++)this.particles.push(FX.particle(e.x,e.y,U.rngf(-80,80),U.rngf(-120,-30),e.color,0.5,U.rng(3,7)));
        if(e.isBoss){this.stairsClear=true;this.game.audio.sfx('levelup');}
      }
    });

    // Remove dead enemies visually (keep for a moment)
    this.enemies=this.enemies.filter(e=>!e.dead);
    // Unlock stairs once all enemies are gone
    if(this.stairsLocked&&this.enemies.length===0){this.stairsLocked=false;this.stairsClear=true;}

    // Chest interaction
    this.chests.forEach(chest=>{
      if(!chest.opened&&U.dist(p.x,p.y,chest.x,chest.y)<32){
        chest.opened=true;
        const loot=buildChestLoot(chest,this.currentFloor);
        const gold=Math.floor(loot.gold*(p.goldMult||1));
        p.gold+=gold;
        if(loot.item)p.addItem(loot.item,1);
        this.floatingTexts.push(FX.text(chest.x,chest.y-20,`+${gold}💰`,CFG.C.textGold));
        if(loot.item)this.floatingTexts.push(FX.text(chest.x,chest.y-38,loot.item.name,CFG.RARITY_COLORS[chest.rarity]));
        if(p.legendary.chestBurst){for(let i=0;i<8;i++)this.projectiles.push(FX.projectile(chest.x,chest.y,U.rngf(-120,120),U.rngf(-120,40),Math.max(1,Math.floor(p.atk*0.35)),CFG.C.neon3,false,5,'fx/projectile'));}
        this.game.audio.sfx('collect');
        for(let i=0;i<8;i++)this.particles.push(FX.particle(chest.x,chest.y,U.rngf(-100,100),U.rngf(-120,-40),CFG.C.textGold,0.6,U.rng(3,6)));
        if(loot.item){for(let i=0;i<6;i++)this.particles.push(FX.particle(chest.x,chest.y,U.rngf(-60,60),U.rngf(-100,-20),CFG.RARITY_COLORS[chest.rarity],0.75,U.rng(3,6)));}
        this.lootPopup={rarity:CFG.RARITY[chest.rarity],color:CFG.RARITY_COLORS[chest.rarity],gold, item:loot.item?loot.item.name:null, icon:loot.item?loot.item.icon:null, gear:loot.item?loot.item.id:null};
        this.lootPopupTime=2.8;
      }
    });
    if(this.lootPopupTime>0)this.lootPopupTime-=dt;

    // Skill effects (slam / meteor / clone burst)
    if(this.skillEffects&&this.skillEffects.length){
      this.skillEffects=this.skillEffects.filter(e=>{
        e.life-=dt;
        if(e.kind==='slam'&&!e.resolved&&e.life<=e.total*0.52){
          e.resolved=true;
          let hits=0;
          this.enemies.forEach(en=>{if(!en.dead&&U.dist(en.x,en.y,e.x,e.y)<=e.radius){const dmg=Math.max(1,Math.floor(e.damage*(1-U.dist(en.x,en.y,e.x,e.y)/e.radius*0.12)));en.takeDamage(dmg,false);p.damageDealt+=dmg;hits++;this.floatingTexts.push(FX.text(en.x,en.y-18,dmg,e.color,11));for(let i=0;i<4;i++)this.particles.push(FX.particle(en.x,en.y,U.rngf(-70,70),U.rngf(-90,-10),e.color,0.35,U.rng(2,5),'fx/slash'));}});
          if(hits>0){this.addShake(0.9,0.08);this.game.audio.sfx('hit');}
        }
        if(e.kind==='meteor'&&!e.resolved&&e.life<=e.total-e.telegraph){
          e.resolved=true;
          this.addHitstop(0.12);
          this.addShake(3.8,0.18);
          let hits=0;
          const dmg=Math.max(1,Math.floor(e.damage));
          this.enemies.forEach(en=>{if(!en.dead&&U.dist(en.x,en.y,e.x,e.y)<=e.radius){en.takeDamage(dmg,false);p.damageDealt+=dmg;hits++;this.floatingTexts.push(FX.text(en.x,en.y-18,`☄ ${dmg}`,CFG.C.textGold,12));for(let i=0;i<8;i++)this.particles.push(FX.particle(en.x,en.y,U.rngf(-110,110),U.rngf(-110,20),e.color,0.5,U.rng(3,6),'fx/skill_burst'));}});
          if(hits===0){this.floatingTexts.push(FX.text(e.x,e.y-18,'MISS',CFG.C.textDim,10));}
          this.game.audio.sfx('hit');
        }
        return e.life>0;
      });
    }

    // Rogue clones / allies update
    if(this.allies&&this.allies.length){
      this.allies=this.allies.filter(a=>{a.update(dt,p,this.dungeon,this.enemies,this.projectiles,this.particles);return !a.dead;});
    }

    // Stairs check
    const stairTile=this._getStairPos();
    if(stairTile&&!this.stairsLocked&&U.dist(p.x,p.y,stairTile.x,stairTile.y)<40){
      this.stairPrompt+=dt;
      if(this.stairPrompt>0.5&&!this._stairTriggered){
        this._stairTriggered=true;
        this.game.audio.sfx('stairs');
        this._goNextFloor();
      }
    } else {this.stairPrompt=0;this._stairTriggered=false;}

    // Boss announcement timer
    if(this._bossAnnounce>0)this._bossAnnounce-=dt;

    // Check boss for HUD
    this.bossHpVisible=this.enemies.some(e=>e.isBoss&&!e.dead);

    // Screen shake decay
    if(this._shakeTimer>0){this._shakeTimer-=dt;this._shakeIntensity=Math.max(0,this._shakeIntensity-dt*20);}
    // Damage / crit flash decay
    if(this._damageFlash>0)this._damageFlash=Math.max(0,this._damageFlash-dt*4);
    if(this._critFlash>0)this._critFlash=Math.max(0,this._critFlash-dt*6);

    // Camera smooth follow
    const tx=p.x-this.W/2,ty=p.y-this.H/2;
    this.cameraX=U.lerp(this.cameraX,tx,0.1);this.cameraY=U.lerp(this.cameraY,ty,0.1);

    // Player death
    if(p.dead&&!this._gameOverQueued){
      this._gameOverQueued=true;
      setTimeout(()=>this.game.switchScene('gameover',{floor:this.currentFloor,kills:p.kills,gold:p.gold,time:p.floorTime,damageDealt:p.damageDealt,soulCoins:p.soulCoins,soulMult:p.soulMult}),800);
    }
  }

  _getNearestEnemy(px,py,range){
    let best=null,bd=range*range;
    this.enemies.forEach(e=>{if(e.dead)return;const d=U.distSq(px,py,e.x,e.y);if(d<bd){bd=d;best=e;}});
    return best;
  }

  _getStairPos(){
    for(let y=0;y<this.dungeon.H;y++)for(let x=0;x<this.dungeon.W;x++){
      if(this.dungeon.tiles[y][x]===4)return{x:x*CFG.TILE+CFG.TILE/2,y:y*CFG.TILE+CFG.TILE/2};
    }
    return null;
  }

  _goNextFloor(){
    this.currentFloor++;
    const isBossFloor=this.currentFloor%5===0;
    this._stairTriggered=false;
    if(!isBossFloor&&this.currentFloor>1){
      // Upgrade screen between normal floors
      this.game.switchScene('upgrade',{floor:this.currentFloor-1,player:this.player});
    } else {
      this._initFloor();
    }
  }

  draw(){
    const{ctx,W,H}=this;
    ctx.fillStyle=CFG.C.bg;ctx.fillRect(0,0,W,H);
    // Screen shake
    let shakeX=0,shakeY=0;
    if(this._shakeTimer>0){
      this._shakeTimer-=0;// decremented in update
      shakeX=(Math.random()-0.5)*this._shakeIntensity*2;
      shakeY=(Math.random()-0.5)*this._shakeIntensity*2;
    }
    const cx=Math.floor(this.cameraX+shakeX),cy=Math.floor(this.cameraY+shakeY);

    // === WORLD ===
    this._drawTiles(ctx,cx,cy);

    // Hazards
    if(this.hazards)this.hazards.forEach(h=>h.draw(ctx,cx,cy));
    // Draw chests
    this.chests.forEach(c=>{
      if(c.opened)return;
      const sx=c.x-cx,sy=c.y-cy;
      const rColor=CFG.RARITY_COLORS[c.rarity];
      const chestPulse=0.5+0.5*Math.sin(this.time*3+c.x*0.1);
      ctx.save();
      // Glow aura
      ctx.shadowColor=rColor;ctx.shadowBlur=12+chestPulse*8;
      // Chest body
      ctx.fillStyle=c.rarity>=2?'#2a1a05':'#1a1205';
      ctx.fillRect(sx-12,sy-9,24,18);
      // Lid
      ctx.fillStyle=rColor;ctx.fillRect(sx-12,sy-12,24,7);
      // Lock
      ctx.fillStyle='#ffee88';ctx.fillRect(sx-3,sy-2,6,5);
      // Rarity shine
      ctx.globalAlpha=0.3+chestPulse*0.2;
      ctx.strokeStyle=rColor;ctx.lineWidth=1;
      ctx.strokeRect(sx-12,sy-12,24,18);
      // Sparkle on top for epic/legendary
      if(c.rarity>=2){
        ctx.globalAlpha=chestPulse*0.7;
        ctx.fillStyle='#ffffff';
        ctx.fillRect(sx-1,sy-16,2,2);
        ctx.fillRect(sx+6,sy-14,2,2);
        ctx.fillRect(sx-8,sy-13,2,2);
      }
      ctx.restore();
    });

    // Stair glow
    const sp=this._getStairPos();
    if(sp){
      const sx=sp.x-cx,sy=sp.y-cy;
      ctx.save();const locked=this.stairsLocked;
      ctx.shadowColor=locked?'#ff4444':CFG.C.stair;ctx.shadowBlur=20+Math.sin(this.time*4)*8;
      ctx.strokeStyle=locked?'#ff4444':CFG.C.stair;ctx.lineWidth=2;
      ctx.beginPath();ctx.arc(sx,sy,16,0,Math.PI*2);ctx.stroke();
      ctx.fillStyle=locked?'rgba(255,0,0,0.15)':'rgba(0,255,200,0.15)';ctx.fill();
      if(locked){ctx.font='16px Arial';ctx.textAlign='center';ctx.fillStyle='#ff4444';ctx.fillText('🔒',sx,sy+6);}
      else{ctx.font='14px Arial';ctx.textAlign='center';ctx.fillStyle=CFG.C.stair;ctx.fillText('⬇',sx,sy+5);}
      ctx.restore();
    }

    // Skill effects
    if(this.skillEffects&&this.skillEffects.length){
      this.skillEffects.forEach(e=>{
        const sx=e.x-cx,sy=e.y-cy;
        ctx.save();
        if(e.kind==='slam'){
          const t=1-e.life/e.total;
          const r=e.radius*(0.3+t*0.9);
          ctx.globalAlpha=0.18+0.32*(1-t);
          ctx.strokeStyle=e.color;ctx.shadowColor=e.color;ctx.shadowBlur=20;
          ctx.lineWidth=5;
          ctx.beginPath();ctx.arc(sx,sy,r,0,Math.PI*2);ctx.stroke();
          ctx.globalAlpha=0.22;
          ctx.lineWidth=2;
          ctx.beginPath();ctx.arc(sx,sy,r+10*Math.sin(t*8),0,Math.PI*2);ctx.stroke();
        } else if(e.kind==='cloneBurst'){
          const t=1-e.life/e.total;
          ctx.globalAlpha=0.6*(1-t);
          ctx.strokeStyle=e.color;ctx.shadowColor=e.color;ctx.shadowBlur=18;
          ctx.lineWidth=3;
          ctx.beginPath();ctx.arc(sx,sy,14+t*18,0,Math.PI*2);ctx.stroke();
        } else if(e.kind==='meteor'){
          const t=1-e.life/e.total;
          const fallT=Math.min(1,t/Math.max(0.001,1-(e.telegraph/e.total)));
          const fallY=sy-110+fallT*110;
          const alpha=t<1-(e.telegraph/e.total)?0.95:0.45;
          if(t<1-(e.telegraph/e.total)){
            ctx.globalAlpha=0.32;
            ctx.strokeStyle='#ffffff';ctx.shadowColor=e.color;ctx.shadowBlur=10;
            ctx.lineWidth=2;
            ctx.setLineDash([4,4]);
            ctx.beginPath();ctx.arc(sx,sy,e.radius,0,Math.PI*2);ctx.stroke();
            ctx.setLineDash([]);
            ctx.globalAlpha=0.14;
            ctx.fillStyle=e.color;
            ctx.beginPath();ctx.arc(sx,sy,e.radius*0.7,0,Math.PI*2);ctx.fill();
            ctx.globalAlpha=0.9;
            ctx.fillStyle='#ffffff';
            ctx.font='bold 12px Arial';ctx.textAlign='center';
            ctx.fillText('!',sx,sy+4);
          } else {
            ctx.globalAlpha=alpha;
            ctx.fillStyle=e.color;ctx.shadowColor=e.color;ctx.shadowBlur=22;
            ctx.beginPath();ctx.arc(sx,fallY,10,0,Math.PI*2);ctx.fill();
            ctx.globalAlpha=0.45;
            ctx.strokeStyle='#ffffff';ctx.lineWidth=3;
            ctx.beginPath();ctx.arc(sx,sy,e.radius*0.9,0,Math.PI*2);ctx.stroke();
          }
        }
        ctx.restore();
      });
    }
    // Particles
    this.particles.forEach(p=>p.draw(ctx,cx,cy));
    // Enemies
    this.enemies.forEach(e=>e.draw(ctx,cx,cy));
    // Allies
    if(this.allies)this.allies.forEach(a=>a.draw(ctx,cx,cy));
    // Player
    this.player.draw(ctx,cx,cy);
    // Projectiles
    this.projectiles.forEach(pr=>pr.draw(ctx,cx,cy));
    // Floating texts
    this.floatingTexts.forEach(ft=>ft.draw(ctx,cx,cy));

    // === HUD ===
    this._drawHUD(ctx,W,H);

    // Loot popup
    if(this.lootPopupTime>0&&this.lootPopup){this._drawLootPopup(ctx,W,H);}

    // Boss entrance announcement
    if(this._bossAnnounce>0){
      const a=Math.min(1,this._bossAnnounce)*Math.min(1,3-this._bossAnnounce+0.5);
      ctx.save();ctx.globalAlpha=U.clamp(a,0,1);
      const pulse=Math.sin(this.time*8)*0.05+0.95;
      ctx.translate(W/2,H/3);ctx.scale(pulse,pulse);ctx.translate(-W/2,-H/3);
      Draw.roundRect(ctx,W/2-130,H/3-24,260,48,8,'rgba(30,0,10,0.92)',CFG.C.boss);
      Draw.glowText(ctx,'⚠ BOSS XUẤT HIỆN ⚠',W/2,H/3,CFG.C.boss,16,18);
      const _ab=this.enemies.find(e=>e.isBoss);Draw.glowText(ctx,_ab&&_ab._bossData?_ab._bossData.name:CFG.BOSS.name,W/2,H/3+20,CFG.C.neon3,12,8);
      ctx.restore();
    }

    // Boss HP bar (at top)
    if(this.bossHpVisible){
      const boss=this.enemies.find(e=>e.isBoss&&!e.dead);
      if(boss)this._drawBossHPBar(ctx,W,boss);
    }

    // Stair prompt
    if(this.stairPrompt>0&&!this.stairsLocked){
      ctx.save();ctx.globalAlpha=Math.min(1,this.stairPrompt*3);
      Draw.roundRect(ctx,W/2-80,H/2,160,36,6,'rgba(0,0,0,0.8)',CFG.C.stair);
      ctx.font='12px Arial';ctx.fillStyle=CFG.C.stair;ctx.textAlign='center';ctx.fillText('Đang xuống tầng...▼',W/2,H/2+22);
      ctx.restore();
    }
    if(this.stairsLocked&&this.stairPrompt>0){
      ctx.save();ctx.globalAlpha=0.9;
      Draw.roundRect(ctx,W/2-90,H/2,180,36,6,'rgba(0,0,0,0.8)','#ff4444');
      ctx.font='12px Arial';ctx.fillStyle='#ff4444';ctx.textAlign='center';ctx.fillText('Giết hết quái để mở khóa!',W/2,H/2+22);
      ctx.restore();
    }

    // ── Screen-edge vignette (sides only) ──
    {
      const vl=ctx.createLinearGradient(0,0,40,0);
      vl.addColorStop(0,'rgba(0,0,0,0.30)');vl.addColorStop(1,'rgba(0,0,0,0)');
      ctx.fillStyle=vl;ctx.fillRect(0,0,40,H);
      const vr=ctx.createLinearGradient(W-40,0,W,0);
      vr.addColorStop(0,'rgba(0,0,0,0)');vr.addColorStop(1,'rgba(0,0,0,0.30)');
      ctx.fillStyle=vr;ctx.fillRect(W-40,0,40,H);
    }

    // ── Damage flash (red edge) ───────────────────────────────────
    if(this._damageFlash>0){
      const df=ctx.createRadialGradient(W/2,H/2,H*0.15,W/2,H/2,H*0.65);
      df.addColorStop(0,'rgba(200,0,0,0)');
      df.addColorStop(1,`rgba(200,0,0,${this._damageFlash*0.6})`);
      ctx.fillStyle=df;
      ctx.fillRect(0,0,W,H);
    }

    // ── Low HP warning pulse ──────────────────────────────────────
    if(this.player&&this.player.hp/this.player.maxHp<0.25){
      const lhp=1-this.player.hp/this.player.maxHp;
      const pulse=0.5+0.5*Math.sin(this.time*6);
      const lpg=ctx.createRadialGradient(W/2,H/2,H*0.2,W/2,H/2,H*0.7);
      lpg.addColorStop(0,'rgba(180,0,0,0)');
      lpg.addColorStop(1,`rgba(180,0,0,${lhp*pulse*0.35})`);
      ctx.fillStyle=lpg;
      ctx.fillRect(0,0,W,H);
    }
  }

  _spawnHazards(){
    if(!this.dungeon||!this.player)return;
    const biome=(CFG.BIOME&&CFG.BIOME.id)||getBiome(this.currentFloor).id;
    const T=CFG.TILE,d=this.dungeon;
    let hazType=null;
    if(biome==='catacomb')hazType='spike';
    else if(biome==='blood_hive')hazType='acid';
    else if(biome==='void')hazType='rift';
    if(!hazType)return;
    const count=hazType==='rift'?U.rng(2,3):(hazType==='acid'?U.rng(4,7):U.rng(5,9));
    let placed=0,attempts=0;
    const ptx=Math.floor(this.player.x/T),pty=Math.floor(this.player.y/T);
    while(placed<count&&attempts<400){
      attempts++;
      const tx=U.rng(2,d.W-3),ty=U.rng(2,d.H-3);
      if(d.tiles[ty][tx]!==1)continue;
      if(Math.abs(tx-ptx)<4&&Math.abs(ty-pty)<4)continue;
      const wx=tx*T+T/2,wy=ty*T+T/2;
      if(this.hazards.some(h=>U.dist(h.x,h.y,wx,wy)<T*2.5))continue;
      this.hazards.push(new Hazard(hazType,wx,wy));
      placed++;
    }
  }
  _drawTiles(ctx,cx,cy){
    const T=CFG.TILE,d=this.dungeon;
    const startX=Math.floor(cx/T)-1,endX=Math.ceil((cx+this.W)/T)+1;
    const startY=Math.floor(cy/T)-1,endY=Math.ceil((cy+this.H)/T)+1;
    const biome=CFG.BIOME||getBiome(this.currentFloor);
    for(let y=Math.max(0,startY);y<Math.min(d.H,endY);y++){
      for(let x=Math.max(0,startX);x<Math.min(d.W,endX);x++){
        const t=d.tiles[y][x];
        if(t===0){
          ctx.save();ctx.translate(-cx,-cy);
          ctx.fillStyle=biome.wall;
          ctx.fillRect(x*T,y*T,T,T);
          if((x+y)%4===0){ctx.fillStyle='rgba(255,255,255,0.015)';ctx.fillRect(x*T+T/2-1,y*T+T/2-1,2,2);}
          ctx.restore();
          continue;
        }
        ctx.save();ctx.translate(-cx,-cy);
        Draw.tile(ctx,x,y,t,this.time);
        ctx.restore();
      }
    }
  }

  _drawHUD(ctx,W,H){
    const p=this.player;
    // Top bar bg
    ctx.fillStyle='rgba(5,5,20,0.88)';ctx.fillRect(0,0,W,52);
    ctx.strokeStyle='rgba(100,80,200,0.4)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(0,52);ctx.lineTo(W,52);ctx.stroke();

    // HP bar
    Draw.bar(ctx,8,10,130,12,p.hp/p.maxHp,CFG.C.hp,'#220000',CFG.C.hp);
    ctx.font='9px Arial';ctx.fillStyle='#fff';ctx.textAlign='left';ctx.fillText(`❤ ${Math.ceil(p.hp)}/${p.maxHp}`,10,20);
    // MP bar
    Draw.bar(ctx,8,28,130,10,p.mp/p.maxMp,CFG.C.mana,'#001133',CFG.C.mana);
    ctx.font='9px Arial';ctx.fillStyle='#aaccff';ctx.fillText(`✦ ${Math.floor(p.mp)}/${p.maxMp}`,10,36);

    // Floor name
    const biome=CFG.BIOME||getBiome(this.currentFloor);
    const floorName=this.currentFloor%5===0?`Tầng ${this.currentFloor} — BOSS`:`Tầng ${this.currentFloor} — ${biome.name}`;
    ctx.font='bold 11px Arial';ctx.fillStyle=this.currentFloor%5===0?CFG.C.neon3:biome.accent;ctx.textAlign='center';
    ctx.shadowColor=this.currentFloor%5===0?CFG.C.neon3:biome.accent;ctx.shadowBlur=6;ctx.fillText(floorName,W/2,22);ctx.shadowBlur=0;

    // Gold
    ctx.font='bold 12px Arial';ctx.fillStyle=CFG.C.textGold;ctx.textAlign='right';
    ctx.shadowColor=CFG.C.textGold;ctx.shadowBlur=5;ctx.fillText(`💰 ${U.fmtNum(p.gold)}`,W-10,22);ctx.shadowBlur=0;
    // Kill count
    ctx.font='10px Arial';ctx.fillStyle=CFG.C.textDim;ctx.fillText(`☠ ${p.kills}`,W-10,38);

    // ── Joystick (no bg strip — fully transparent area) ───────────
    this.joystick.draw(ctx);

    // ── Skill button 1 (ultimate) ─────────────────────────────────
    const s1=this.touchTargets.skill1;
    const s1ready=p.skillTimer<=0&&p.mp>=p.skillMp;
    ctx.save();
    ctx.shadowColor=s1ready?CFG.C.neon1:'#333355';
    ctx.shadowBlur=s1ready?18:4;
    // Local backdrop only under this button
    Draw.roundRect(ctx,s1.x-s1.r,s1.y-s1.r,s1.r*2,s1.r*2,s1.r,
      s1ready?U.rgba(CFG.C.neon1,0.22):'rgba(8,8,22,0.52)',
      s1ready?CFG.C.neon1:'#334455');
    ctx.font='15px Arial';ctx.fillStyle=s1ready?CFG.C.neon1:'#667';
    ctx.textAlign='center';
    ctx.fillText(p.skillLevel>=1?'✦':'⚡',s1.x,s1.y+6);
    if(p.skillLevel>=1){ctx.font='7px Arial';ctx.fillStyle=CFG.C.neon3;ctx.fillText('★',s1.x+s1.r*0.55,s1.y-s1.r*0.55);}
    ctx.font='8px Arial';ctx.fillStyle=s1ready?CFG.C.neon1:'#445';
    ctx.fillText(s1ready?'SẴN':`${p.skillTimer.toFixed(1)}s`,s1.x,s1.y+s1.r+10);
    ctx.restore();

    // ── Dash button ───────────────────────────────────────────────
    const s2=this.touchTargets.dash;
    const dashReady=p.dashCooldown<=0;
    ctx.save();
    ctx.shadowColor=dashReady?CFG.C.neon2:'#223';
    ctx.shadowBlur=dashReady?12:3;
    Draw.roundRect(ctx,s2.x-s2.r,s2.y-s2.r,s2.r*2,s2.r*2,s2.r,
      dashReady?U.rgba(CFG.C.neon2,0.18):'rgba(8,8,22,0.52)',
      dashReady?CFG.C.neon2:'#334455');
    ctx.font='13px Arial';ctx.fillStyle=dashReady?CFG.C.neon2:'#557';
    ctx.textAlign='center';ctx.fillText('💨',s2.x,s2.y+5);
    ctx.restore();

    // ── Pause / Minimap / Inventory / Shop (icon buttons, minimal bg) ─
    const _iconBtn=(t,icon,alpha=0.5)=>{
      ctx.save();ctx.globalAlpha=alpha;
      Draw.roundRect(ctx,t.x-t.r,t.y-t.r,t.r*2,t.r*2,t.r,'rgba(5,5,18,0.48)','#334');
      ctx.globalAlpha=1;ctx.font='13px Arial';ctx.fillStyle='#99aacc';
      ctx.textAlign='center';ctx.fillText(icon,t.x,t.y+5);
      ctx.restore();
    };
    _iconBtn(this.touchTargets.pause,'⏸',0.55);
    _iconBtn(this.touchTargets.minimap,'🗺',0.5);
    _iconBtn(this.touchTargets.inventory,'🎒',0.5);
    _iconBtn(this.touchTargets.shop,'👜',0.5);

    // Minimap
    if(this.showMinimap)this._drawMinimap(ctx,W,H);

    // Equipment summary
    const equipX=W-146,equipY=8,equipSize=18;
    const eqOrder=['weapon','armor','ring','relic'];
    eqOrder.forEach((slot,i)=>{
      const ex=equipX+(i%2)*35, ey=equipY+Math.floor(i/2)*26;
      const item=p.equipment&&p.equipment[slot]?(p.equipment[slot].data||ITEM_DB[p.equipment[slot].id]):null;
      Draw.roundRect(ctx,ex,ey,equipSize,equipSize,4,item?U.rgba(CFG.RARITY_COLORS[item.rarity||0],0.18):'rgba(10,10,30,0.6)',item?CFG.RARITY_COLORS[item.rarity||0]:'#445');
      ctx.font='11px Arial';ctx.fillStyle=item?'#fff':'#556';ctx.textAlign='center';ctx.fillText(item?(item.icon||GEAR_SHORT[slot]||'?'):'＋',ex+9,ey+13);
      if(item){ctx.font='7px Arial';ctx.fillStyle='#bbb';ctx.fillText(GEAR_SHORT[slot],ex+9,ey+22);}
    });

    // Quick slots — minimal pill behind only the 3 icons
    const qy=H-25,qx=W/2;
    // Tiny translucent pill just behind the 3 slots, not full-width
    ctx.save();
    ctx.globalAlpha=0.45;
    Draw.roundRect(ctx,qx-3*48/2-4,qy-18,3*48+8,36,8,'rgba(5,5,18,0.55)','#334');
    ctx.restore();
    for(let i=0;i<3;i++){
      const bx=qx+(i-1)*48-16,by=qy-16,bs=32;
      Draw.roundRect(ctx,bx,by,bs,bs,4,'rgba(8,8,24,0.5)','rgba(60,60,100,0.6)');
      const id=p.quickSlots[i];
      ctx.font='14px Arial';ctx.fillStyle=id?(ITEM_DB[id]?.shop?CFG.C.textGold:'#eee'):'#445';
      ctx.textAlign='center';ctx.fillText(id?(ITEM_DB[id]?.icon||'?'):'＋',bx+bs/2,by+21);
      ctx.font='9px Arial';ctx.fillStyle='#556';ctx.fillText(i+1,bx+bs/2,by+bs-3);
    }
  }

  _drawBossHPBar(ctx,W,boss){
    const bx=W*0.1,by=55,bw=W*0.8,bh=14;
    ctx.fillStyle='rgba(0,0,0,0.7)';ctx.fillRect(bx-4,by-2,bw+8,bh+4);
    Draw.bar(ctx,bx,by,bw,bh,boss.hp/boss.maxHp,boss.enraged?CFG.C.neon3:CFG.C.boss,'#330011',boss.enraged?CFG.C.neon3:CFG.C.boss);
    ctx.strokeStyle=boss.enraged?CFG.C.neon3:'#ff4466';ctx.lineWidth=1;ctx.strokeRect(bx,by,bw,bh);
    const pct=boss.hp/boss.maxHp;
    ctx.font='bold 10px Arial';ctx.fillStyle='#fff';ctx.textAlign='center';
    ctx.fillText(`${boss._bossData?boss._bossData.name:CFG.BOSS.name}  ${Math.ceil(boss.hp)}/${boss.maxHp}`,W/2,by+10);
    if(boss.enraged){ctx.save();ctx.shadowColor=CFG.C.neon3;ctx.shadowBlur=8;ctx.font='9px Arial';ctx.fillStyle=CFG.C.neon3;ctx.fillText('⚡ NỔI ĐIÊN!',W/2,by+26);ctx.restore();}
  }

  _drawMinimap(ctx,W,H){
    const d=this.dungeon,T=2,mx=60,my=62,mw=d.W*T,mh=d.H*T;
    ctx.save();ctx.globalAlpha=0.85;
    ctx.fillStyle='rgba(5,5,20,0.9)';ctx.fillRect(mx-2,my-2,mw+4,mh+4);
    for(let y=0;y<d.H;y++)for(let x=0;x<d.W;x++){
      const t=d.tiles[y][x];
      if(t===0)continue;
      if(t===2)ctx.fillStyle='#1a1a3a';
      else if(t===4)ctx.fillStyle=CFG.C.stair;
      else ctx.fillStyle='#3a3a6a';
      ctx.fillRect(mx+x*T,my+y*T,T,T);
    }
    // Player dot
    const px=Math.floor(this.player.x/CFG.TILE)*T,py=Math.floor(this.player.y/CFG.TILE)*T;
    ctx.fillStyle='#ffffff';ctx.fillRect(mx+px,my+py,3,3);
    // Enemies
    this.enemies.forEach(e=>{const ex=Math.floor(e.x/CFG.TILE)*T,ey=Math.floor(e.y/CFG.TILE)*T;ctx.fillStyle=e.isBoss?CFG.C.boss:CFG.C.enemy;ctx.fillRect(mx+ex,my+ey,2,2);});
    ctx.restore();
  }

  _drawLootPopup(ctx,W,H){
    const p=this.lootPopup;const a=Math.min(1,this.lootPopupTime);
    ctx.save();ctx.globalAlpha=a;
    Draw.roundRect(ctx,W/2-104,H/2-40,208,80,10,'rgba(5,5,20,0.95)',p.color);
    ctx.shadowColor=p.color;ctx.shadowBlur=12;
    ctx.font='bold 13px Arial';ctx.fillStyle=p.color;ctx.textAlign='center';
    ctx.fillText(`✦ ${p.rarity} Rương`,W/2,H/2-15);
    ctx.font='12px Arial';ctx.fillStyle=CFG.C.textGold;ctx.fillText(`+${p.gold} Vàng`,W/2,H/2+8);
    if(p.item){ctx.font='12px Arial';ctx.fillStyle='#ffffff';ctx.fillText(`${p.icon} ${p.item}`,W/2,H/2+28);} 
    ctx.restore();
  }

  onTouchStart(id,x,y){
    this.joystick.onTouchStart(id,x,y);
    const t=this.touchTargets;
    if(U.dist(x,y,t.skill1.x,t.skill1.y)<t.skill1.r){this._skillPressed=id;}
    if(U.dist(x,y,t.dash.x,t.dash.y)<t.dash.r){this._dashPressed=id;}
    if(U.dist(x,y,t.pause.x,t.pause.y)<t.pause.r){this._pausePressed=id;}
    if(U.dist(x,y,t.minimap.x,t.minimap.y)<t.minimap.r){this._minimapPressed=id;}
    if(t.inventory&&U.dist(x,y,t.inventory.x,t.inventory.y)<t.inventory.r){this._inventoryPressed=id;}
    if(t.shop&&U.dist(x,y,t.shop.x,t.shop.y)<t.shop.r){this._shopPressed=id;}
    this.quickSlotTargets.forEach((s,i)=>{if(U.dist(x,y,s.x,s.y)<s.r){this._quickSlotPressed={id,slot:i};}});
  }
  onTouchMove(id,x,y){this.joystick.onTouchMove(id,x,y);}
  onTouchEnd(id,x,y){
    this.joystick.onTouchEnd(id);
    if(this._skillPressed===id){
      const used=this.player.useSkill(this.enemies,this.projectiles,this.particles,this.enemies);
      if(used){this.game.audio.sfx('skill');U.vibrate(25);this.floatingTexts.push(FX.text(this.player.x,this.player.y-40,this.player.skillName,CFG.C.neon1,11));}
      else if(this.player.skillTimer>0){this.floatingTexts.push(FX.text(this.player.x,this.player.y-40,`Hồi chiêu: ${this.player.skillTimer.toFixed(1)}s`,CFG.C.textDim,10));}
      else{this.floatingTexts.push(FX.text(this.player.x,this.player.y-40,'Không đủ MP!','#ff4455',10));}
      this._skillPressed=null;
    }
    if(this._dashPressed===id){
      const jx=this.joystick.active?this.joystick.dx:0,jy=this.joystick.active?this.joystick.dy:0;
      if(this.player.dash(jx,jy)){this.game.audio.sfx('dash');U.vibrate(15);}
      this._dashPressed=null;
    }
    if(this._inventoryPressed===id){this._inventoryPressed=null;this.game.switchScene('inventory',{player:this.player,gameplay:this});return;}
    if(this._shopPressed===id){this._shopPressed=null;this.game.switchScene('shop',{player:this.player,gameplay:this});return;}
    if(this._pausePressed===id){this.game.switchScene('pause');this._pausePressed=null;}
    if(this._minimapPressed===id){this.showMinimap=!this.showMinimap;this._minimapPressed=null;}
    if(this._quickSlotPressed&&this._quickSlotPressed.id===id){const slot=this._quickSlotPressed.slot;if(this.player.useQuickSlot(slot,this.game)){this.game.audio.sfx('collect');U.vibrate(10);this.floatingTexts.push(FX.text(this.player.x,this.player.y-34,ITEM_DB[this.player.quickSlots[slot]]?.name||'Dùng nhanh',CFG.C.textGold,10));this._saveRun();}this._quickSlotPressed=null;}
  }
}

// ================================================================
// GAME CONTROLLER
// ================================================================
class Game {
  constructor(){
    this.canvas=document.getElementById('gameCanvas');
    this.ctx=this.canvas.getContext('2d');
    this.audio=new AudioEngine();
    this.audio.init();
    Assets.init();
    this.W=CFG.W;this.H=CFG.H;
    this._resize();
    this.scenes={
      boot:new BootScene(this), menu:new MenuScene(this),
      charselect:new CharSelectScene(this), gameplay:new GameplayScene(this),
      shop:new ShopScene(this), inventory:new InventoryScene(this),
      upgrade:new UpgradeScene(this), gameover:new GameOverScene(this),
      pause:new PauseScene(this), perma:new PermaScene(this),
    };
    this.currentScene=null;this._sceneKey=null;
    this._setupInput();
    this.lastTime=0;this._raf=null;
    this._fadeAlpha=0;
    this._fadingOut=false;this._pendingScene=null;
    this._doSwitch('boot',{});
    this._raf=requestAnimationFrame(this._loop.bind(this));
  }

  _resize(){
    const ww=window.innerWidth,wh=window.innerHeight;
    const scale=Math.min(ww/this.W,wh/this.H);
    this.canvas.width=this.W;this.canvas.height=this.H;
    this.canvas.style.width=`${this.W*scale}px`;this.canvas.style.height=`${this.H*scale}px`;
    this._scale=scale;
  }

  switchScene(name,data){
    if(this._fadingOut){return;} // block re-entry during fade
    this._fadingOut=true;
    this._fadeAlpha=0;
    this._pendingScene={name,data:data||{}};
  }
  _doSwitch(name,data){
    if(this.currentScene)this.currentScene.exit();
    this._sceneKey=name;this.currentScene=this.scenes[name];
    this.currentScene.enter(data||{});
    this._fadeAlpha=1.0;
    this._fadingOut=false;
  }

  _loop(ts){
    const dt=Math.min((ts-this.lastTime)/1000,0.05);this.lastTime=ts;
    this.ctx.clearRect(0,0,this.W,this.H);
    if(this.currentScene){this.currentScene.update(dt);this.currentScene.draw();}
    if(this._fadingOut){
      this._fadeAlpha=Math.min(1,this._fadeAlpha+dt*7);
      this.ctx.fillStyle=`rgba(0,0,0,${this._fadeAlpha})`;
      this.ctx.fillRect(0,0,this.W,this.H);
      if(this._fadeAlpha>=1&&this._pendingScene){
        const{name,data}=this._pendingScene;this._pendingScene=null;
        this._doSwitch(name,data);
      }
    } else if(this._fadeAlpha>0){
      this._fadeAlpha=Math.max(0,this._fadeAlpha-dt*5);
      this.ctx.fillStyle=`rgba(0,0,0,${this._fadeAlpha})`;
      this.ctx.fillRect(0,0,this.W,this.H);
    }
    this._raf=requestAnimationFrame(this._loop.bind(this));
  }

  _setupInput(){
    const canvas=this.canvas;
    const toCanvas=(touch)=>{
      const rect=canvas.getBoundingClientRect();
      return{id:touch.identifier,x:(touch.clientX-rect.left)/this._scale,y:(touch.clientY-rect.top)/this._scale};
    };
    const onTS=(e)=>{e.preventDefault();[...e.changedTouches].forEach(t=>{const p=toCanvas(t);if(this.currentScene)this.currentScene.onTouchStart(p.id,p.x,p.y);this.audio.resume();});};
    const onTM=(e)=>{e.preventDefault();[...e.changedTouches].forEach(t=>{const p=toCanvas(t);if(this.currentScene)this.currentScene.onTouchMove(p.id,p.x,p.y);});};
    const onTE=(e)=>{e.preventDefault();[...e.changedTouches].forEach(t=>{const p=toCanvas(t);if(this.currentScene)this.currentScene.onTouchEnd(p.id,p.x,p.y);});};
    canvas.addEventListener('touchstart',onTS,{passive:false});
    canvas.addEventListener('touchmove',onTM,{passive:false});
    canvas.addEventListener('touchend',onTE,{passive:false});
    canvas.addEventListener('touchcancel',onTE,{passive:false});

    // Keyboard (desktop testing)
    const keys={};
    document.addEventListener('keydown',e=>{keys[e.key]=true;this.audio.resume();});
    document.addEventListener('keyup',e=>{keys[e.key]=false;});
    this._keyInterval=setInterval(()=>{
      if(this.currentScene&&this._sceneKey==='gameplay'){
        const sc=this.currentScene;
        sc._keyX=(keys['a']||keys['ArrowLeft']?-1:0)+(keys['d']||keys['ArrowRight']?1:0);
        sc._keyY=(keys['w']||keys['ArrowUp']?-1:0)+(keys['s']||keys['ArrowDown']?1:0);
        if(keys[' ']&&!keys['_space']){keys['_space']=true;const p=sc.player;if(p){const used=p.useSkill(sc.enemies,sc.projectiles,sc.particles);if(used){this.audio.sfx('skill');}}}
        if(!keys[' '])keys['_space']=false;
        if(keys['q']&&!keys['_q']){keys['_q']=true;if(sc.player)sc.player.dash(sc._keyX,sc._keyY);}
        if(!keys['q'])keys['_q']=false;
      }
    },16);
    window.addEventListener('resize',()=>this._resize());
  }
}

// ================================================================
// BOOT
// ================================================================
window.addEventListener('DOMContentLoaded',()=>{window._game=new Game();});
