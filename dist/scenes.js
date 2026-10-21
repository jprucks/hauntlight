/* Hauntlight original procedural scenes. No downloaded media or runtime dependencies. */
(function (root) {
  'use strict';
  var TAU = Math.PI * 2;
  var catalog = [
    {id:'ghosts',name:'Ghost Parade',category:'Spirits',description:'A quiet procession of floating, luminous spirits.',color:'#b7ffe0'},
    {id:'bats',name:'Midnight Flight',category:'Night sky',description:'Bats cross an enormous autumn moon.',color:'#cca7ff'},
    {id:'eyes',name:'Something Is Watching',category:'Creatures',description:'Pairs of glowing eyes peer out of the darkness.',color:'#c4fa70'},
    {id:'pumpkin',name:'Jack’s Grin',category:'Faces',description:'A glowing jack-o’-lantern face, made for a pumpkin.',color:'#ff9b36'},
    {id:'windows',name:'Haunted Windows',category:'Architecture',description:'Candlelit gothic windows and passing silhouettes.',color:'#b4a0ff'},
    {id:'fog',name:'Spectral Fog',category:'Atmosphere',description:'Slow rivers of emerald and violet mist.',color:'#91e6d0'},
    {id:'vines',name:'Creeping Garden',category:'Outdoors',description:'Twisting thorny branches breathe in moonlight.',color:'#a9cf6a'},
    {id:'web',name:'Silken Shadows',category:'Creatures',description:'A silver spiderweb with a slowly descending spider.',color:'#d1c4ff'},
    {id:'embers',name:'Witchfire',category:'Atmosphere',description:'A warm bed of fire with drifting golden embers.',color:'#ff793b'},
    {id:'portal',name:'The Other Side',category:'Magic',description:'Concentric violet rings open a glowing portal.',color:'#ba83ff'},
    {id:'stars',name:'Enchanted Ceiling',category:'Night sky',description:'A drifting star field with soft celestial ribbons.',color:'#9dcfff'},
    {id:'graveyard',name:'Sleepy Hollow',category:'Outdoors',description:'Crooked gravestones beneath a pale harvest moon.',color:'#a4c6b6'},
    {id:'cauldron',name:'Bubbling Brew',category:'Magic',description:'Green potion bubbles and curls into the night.',color:'#91ff8c'},
    {id:'candles',name:'Floating Candles',category:'Spirits',description:'A warm hall of candles gently suspended in air.',color:'#ffd391'},
    {id:'spores',name:'Foxfire Spores',category:'Any orientation',orientation:'any',description:'Mint and jade spores wander through a luminous forest dream.',color:'#78f5b9'},
    {id:'caustics',name:'Moonlit Water',category:'Any orientation',orientation:'any',description:'Overlapping blue ripples cast a pool of liquid moonlight.',color:'#83d7ff'},
    {id:'nebula',name:'Velvet Nebula',category:'Any orientation',orientation:'any',description:'Violet and rose clouds drift among scattered pinprick stars.',color:'#c8a0ff'},
    {id:'mandala',name:'Midnight Mandala',category:'Any orientation',orientation:'any',description:'A slow-turning lace of amber and amethyst petals.',color:'#e7b878'},
    {id:'vortex',name:'Cosmic Whirlpool',category:'Any orientation',orientation:'any',description:'Spiraling stardust curls into a deep indigo center.',color:'#aaa7ff'},
    {id:'plasma',name:'Potion Cells',category:'Any orientation',orientation:'any',description:'Translucent violet and lime cells drift and breathe.',color:'#c7ee86'},
    {id:'hexes',name:'Enchanted Honeycomb',category:'Any orientation',orientation:'any',description:'A field of glowing hexagons shimmers in jewel colors.',color:'#79d7c8'},
    {id:'ripples',name:'Echoes in the Dark',category:'Any orientation',orientation:'any',description:'Soft turquoise and lilac rings expand from scattered points.',color:'#b7c7ff'},
    {id:'mycelium',name:'Secret Mycelium',category:'Any orientation',orientation:'any',description:'Fine luminous filaments connect a hidden living network.',color:'#87e5ae'},
    {id:'constellation',name:'Ember Constellation',category:'Any orientation',orientation:'any',description:'Warm copper stars orbit gently in every direction.',color:'#ffc47b'}
  ];
  function hash(n) { var v = Math.sin(n * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); }
  function ellipse(c,x,y,rx,ry,color) { c.fillStyle=color;c.beginPath();c.ellipse(x,y,Math.max(.01,rx),Math.max(.01,ry),0,0,TAU);c.fill(); }
  function glow(c,x,y,r,color) { var g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,color);g.addColorStop(1,'rgba(0,0,0,0)');c.fillStyle=g;c.fillRect(x-r,y-r,r*2,r*2); }
  function line(c,points,color,width) { c.strokeStyle=color;c.lineWidth=width;c.beginPath();for(var i=0;i<points.length;i++){if(i===0)c.moveTo(points[i][0],points[i][1]);else c.lineTo(points[i][0],points[i][1]);}c.stroke(); }
  function sky(c,top,bottom) { var g=c.createLinearGradient(0,0,0,500);g.addColorStop(0,top);g.addColorStop(1,bottom);c.fillStyle=g;c.fillRect(0,0,800,500); }
  function stars(c,t,n,color) { for(var i=0;i<n;i++){var x=hash(i+2)*800,y=hash(i+104)*430;var a=.35+.3*Math.sin(t*.35+i);c.globalAlpha=a;ellipse(c,x,y,hash(i+55)*1.5+.4,hash(i+55)*1.5+.4,color);}c.globalAlpha=1; }
  function moon(c,x,y,r,color) {glow(c,x,y,r*1.6,'rgba(176,155,242,.18)');ellipse(c,x,y,r,r,color);for(var j=0;j<7;j++){var a=hash(j+9)*TAU,rr=hash(j+20)*r*.65;ellipse(c,x+Math.cos(a)*rr,y+Math.sin(a)*rr,r*(.06+hash(j)*.13),r*(.05+hash(j)*.12),'rgba(54,48,90,.09)');}}
  function ghost(c,x,y,s,t) {
    c.save();c.translate(x,y);c.scale(s,s);glow(c,0,12,95,'rgba(121,255,206,.13)');
    var g=c.createLinearGradient(0,-50,0,70);g.addColorStop(0,'rgba(222,255,246,.94)');g.addColorStop(.6,'rgba(125,241,209,.5)');g.addColorStop(1,'rgba(79,207,205,.02)');c.fillStyle=g;c.beginPath();c.moveTo(-40,55);c.lineTo(-40,-8);c.bezierCurveTo(-42,-68,42,-68,40,-8);c.lineTo(40,55);for(var k=4;k>=-4;k--)c.quadraticCurveTo(k*10+5,42+Math.sin(t+k)*9,k*10,61+Math.sin(t+k)*9);c.closePath();c.fill();
    ellipse(c,-13,-4,5,9,'#102632');ellipse(c,13,-4,5,9,'#102632');ellipse(c,0,20,5,7,'rgba(16,38,50,.65)');c.restore();
  }
  function bat(c,x,y,s,t) {c.save();c.translate(x,y);c.scale(s,s);var flap=Math.sin(t)*12;c.fillStyle='#070810';c.beginPath();c.moveTo(0,-4);c.quadraticCurveTo(-20,-30-flap,-52,-15-flap);c.lineTo(-39,0);c.quadraticCurveTo(-27,-12,-20,9);c.quadraticCurveTo(-10,-4,-5,12);c.lineTo(0,19);c.lineTo(5,12);c.quadraticCurveTo(10,-4,20,9);c.quadraticCurveTo(27,-12,39,0);c.lineTo(52,-15-flap);c.quadraticCurveTo(20,-30-flap,0,-4);c.fill();ellipse(c,0,0,5,13,'#070810');c.restore();}
  var scenes = {};
  scenes.ghosts=function(c,t){sky(c,'#02060c','#06151a');stars(c,t,35,'#b8d7d6');for(var i=0;i<5;i++){var x=((i*194+t*(11+i*2))%1050)-100,y=155+hash(i)*190+Math.sin(t*.7+i)*24;ghost(c,x,y,.7+hash(i+10)*.6,t+i);} };
  scenes.bats=function(c,t){sky(c,'#100e26','#352244');stars(c,t,60,'#dcceff');moon(c,510,205,132,'#c9b6df');for(var i=0;i<12;i++){var x=((hash(i)*1100+t*(18+hash(i+5)*25))%1100)-150,y=75+hash(i+22)*330+Math.sin(t*.9+i)*35;bat(c,x,y,.25+hash(i+9)*.6,t*(4+hash(i))+i);}for(var j=0;j<4;j++)glow(c,(j*280+t*9)%1100-150,440,210,'rgba(115,71,149,.16)');};
  scenes.eyes=function(c,t){c.fillStyle='#010403';c.fillRect(0,0,800,500);for(var i=0;i<7;i++){var x=100+hash(i+9)*600,y=65+hash(i+31)*360,s=.6+hash(i+44)*.6,blink=Math.pow(Math.max(0,Math.cos(t*.7+i*2.1)),30),open=1-blink*.96;c.save();c.translate(x,y);c.scale(s,s);glow(c,0,0,92,'rgba(94,150,26,.13)');for(var j=-1;j<=1;j+=2){c.save();c.translate(j*32,0);c.rotate(j*-.17);ellipse(c,0,0,23,12*open,'#aeeb67');ellipse(c,Math.sin(t*.31+i)*6,0,3,11*open,'#020504');ellipse(c,-7,-3*open,3,2*open,'rgba(246,255,217,.8)');c.restore();}c.restore();}};
  scenes.pumpkin=function(c,t){var breath=.8+Math.sin(t*1.3)*.1;glow(c,400,260,270,'rgba(241,75,4,.14)');c.save();c.translate(400,250);c.globalAlpha=breath;var g=c.createLinearGradient(0,-150,0,160);g.addColorStop(0,'#ffc95d');g.addColorStop(1,'#e55b12');c.fillStyle=g;
    c.beginPath();c.moveTo(-180,-70);c.lineTo(-70,-130);c.lineTo(-65,-30);c.closePath();c.fill();c.beginPath();c.moveTo(180,-70);c.lineTo(70,-130);c.lineTo(65,-30);c.closePath();c.fill();c.beginPath();c.moveTo(0,-30);c.lineTo(-27,18);c.lineTo(27,18);c.closePath();c.fill();
    c.beginPath();c.moveTo(-200,35);c.quadraticCurveTo(-174,151,0,168);c.quadraticCurveTo(174,151,200,35);c.lineTo(146,68);c.lineTo(142,105);c.lineTo(110,116);c.lineTo(106,84);c.lineTo(34,101);c.lineTo(30,135);c.lineTo(-1,137);c.lineTo(-5,102);c.lineTo(-80,91);c.lineTo(-85,120);c.lineTo(-118,111);c.lineTo(-116,77);c.closePath();c.fill();c.restore();};
  scenes.windows=function(c,t){sky(c,'#020208','#0e0920');for(var i=0;i<3;i++){var x=115+i*235;c.save();c.translate(x,75);c.beginPath();c.moveTo(-65,330);c.lineTo(-65,75);c.bezierCurveTo(-65,32,-20,0,0,-25);c.bezierCurveTo(20,0,65,32,65,75);c.lineTo(65,330);c.closePath();c.fillStyle='#a39ac9';c.fill();c.save();c.clip();var g=c.createLinearGradient(0,0,0,350);g.addColorStop(0,'#302b69');g.addColorStop(.7,'#574773');g.addColorStop(1,'#e09b63');c.fillStyle=g;c.fillRect(-65,-30,130,380);glow(c,0,310,100,'rgba(255,184,83,.5)');var px=((t*16+i*135)%390)-195;ghost(c,px,220,.8,t);c.fillStyle='#11101c';c.fillRect(-5,-30,10,380);c.fillRect(-70,110,140,10);c.fillRect(-70,230,140,10);c.restore();c.strokeStyle='#b7a7d2';c.lineWidth=3;c.stroke();c.fillStyle='#30243b';c.fillRect(-79,330,158,13);c.restore();}};
  scenes.fog=function(c,t){sky(c,'#010606','#07151c');for(var i=0;i<14;i++){var x=((i*97+t*(7+hash(i)*9))%1150)-175,y=100+hash(i+28)*340+Math.sin(t*.27+i)*55;glow(c,x,y,130+hash(i+4)*100,i%3===0?'rgba(103,61,163,.12)':'rgba(49,183,148,.11)');}for(var j=0;j<7;j++){c.beginPath();c.moveTo(-100,170+j*40);c.bezierCurveTo(170,80+j*35+Math.sin(t*.3+j)*80,530,390-j*30,900,190+j*43);c.strokeStyle='rgba(112,220,187,.06)';c.lineWidth=20+j*4;c.stroke();}};
  scenes.vines=function(c,t){sky(c,'#020904','#07130d');glow(c,400,250,310,'rgba(39,76,50,.15)');for(var side=0;side<2;side++)for(var i=0;i<5;i++){c.save();c.translate(side?800:0,500);c.scale(side?-1:1,1);c.beginPath();c.moveTo(i*14,20);var pts=[];for(var j=0;j<8;j++){var x=45+i*58+j*18+Math.sin(j*.85+i+t*.17)*25,y=-j*65;pts.push([x,y]);c.lineTo(x,y);}c.strokeStyle=i%2?'#698349':'#344b35';c.lineWidth=5-i*.65;c.stroke();for(var k=1;k<7;k++){var p=pts[k];c.save();c.translate(p[0],p[1]);c.rotate(Math.sin(k+i)*.7);c.fillStyle=k%2?'#536e3a':'#819254';c.beginPath();c.moveTo(0,0);c.quadraticCurveTo(35,-36,52,-12);c.quadraticCurveTo(31,8,0,0);c.fill();c.beginPath();c.moveTo(0,0);c.lineTo(-15,-20);c.lineTo(-5,-7);c.closePath();c.fill();c.restore();}c.restore();}for(var n=0;n<10;n++)ellipse(c,hash(n)*800,hash(n+31)*500+Math.sin(t+n)*5,1.6,1.6,'rgba(197,235,124,.55)');};
  scenes.web=function(c,t){sky(c,'#04030b','#0a0b19');var x=390,y=220;glow(c,x,y,260,'rgba(115,86,178,.1)');for(var i=0;i<16;i++){var a=i*TAU/16;line(c,[[x,y],[x+Math.cos(a)*580,y+Math.sin(a)*580]],'rgba(207,201,241,.38)',1);}for(var ring=1;ring<10;ring++){var r=ring*32;c.beginPath();for(var j=0;j<=16;j++){var a2=j*TAU/16,xx=x+Math.cos(a2)*r,yy=y+Math.sin(a2)*r*.86;if(j===0)c.moveTo(xx,yy);else{var mid=a2-TAU/32;c.quadraticCurveTo(x+Math.cos(mid)*r*.92,y+Math.sin(mid)*r*.79,xx,yy);}}c.strokeStyle='rgba(184,170,218,'+(.62-ring*.045)+')';c.lineWidth=1.2;c.stroke();}var sy=280+Math.sin(t*.35)*80,sx=x+85;line(c,[[sx,0],[sx,sy]],'#9187a5',1);c.save();c.translate(sx,sy);for(var s=-1;s<=1;s+=2)for(var k=0;k<4;k++)line(c,[[s*6,k*4-6],[s*(22+k*2),-19+k*14],[s*(35+k*3),-8+k*13]],'#aba0c6',2);ellipse(c,0,4,12,17,'#77638e');ellipse(c,0,-12,8,8,'#b4a1cd');ellipse(c,-3,-14,1.4,1.4,'#ffbf8c');ellipse(c,3,-14,1.4,1.4,'#ffbf8c');c.restore();};
  scenes.embers=function(c,t){sky(c,'#080203','#270a09');glow(c,400,560,500,'rgba(233,69,10,.45)');for(var i=0;i<12;i++){var x=i*78-20,h=110+hash(i)*120+Math.sin(t*1.4+i)*35;var g=c.createLinearGradient(0,500-h,0,520);g.addColorStop(0,'rgba(234,79,13,0)');g.addColorStop(.5,'rgba(241,79,12,.2)');g.addColorStop(1,'rgba(255,163,44,.7)');c.fillStyle=g;c.beginPath();c.moveTo(x-60,520);c.bezierCurveTo(x-90,450,x+Math.sin(t+i)*35,500-h,x,500-h);c.bezierCurveTo(x+80,440,x+25,450,x+70,520);c.fill();}for(var j=0;j<65;j++){var y=500-((hash(j)*600+t*(12+hash(j+9)*28))%580),x=hash(j+14)*800+Math.sin(t*.6+j)*22,sz=1+hash(j+22)*2;c.globalAlpha=Math.max(0,y/500);ellipse(c,x,y,sz*.65,sz*1.8,j%3?'#ffbb62':'#ff6b25');}c.globalAlpha=1;};
  scenes.portal=function(c,t){sky(c,'#020209','#0a0418');glow(c,400,250,245,'rgba(100,35,196,.22)');c.save();c.translate(400,250);for(var i=11;i>=0;i--){var r=42+i*15+Math.sin(t*.6+i)*3;c.save();c.rotate(t*(i%2?.035:-.028)+i*.4);c.strokeStyle='hsla('+(264+i*3)+',82%,'+(35+i*2.8)+'%,'+(.3+i*.04)+')';c.lineWidth=1.5+(i%3);c.beginPath();for(var k=0;k<=96;k++){var a=k*TAU/96,rr=r+Math.sin(a*6+t*.4+i)*3;if(k===0)c.moveTo(Math.cos(a)*rr,Math.sin(a)*rr);else c.lineTo(Math.cos(a)*rr,Math.sin(a)*rr);}c.stroke();if(i===9||i===6){for(var j=0;j<16;j++){var aa=j*TAU/16;c.save();c.translate(Math.cos(aa)*r,Math.sin(aa)*r);c.rotate(aa);line(c,[[-4,-5],[4,0],[-4,5]],'#cba8ff',1.3);c.restore();}}c.restore();}for(var n=0;n<36;n++){var a2=hash(n)*TAU+t*.12,rr2=60+hash(n+10)*160;ellipse(c,Math.cos(a2)*rr2,Math.sin(a2)*rr2,1.2,1.2,'#dac5ff');}glow(c,0,0,62,'rgba(23,7,45,.9)');c.restore();};
  scenes.stars=function(c,t){sky(c,'#02060f','#0d1026');for(var i=0;i<5;i++)glow(c,170+i*130+Math.sin(t*.1+i)*20,260+Math.sin(i)*85,160,i%2?'rgba(68,44,127,.1)':'rgba(36,99,146,.11)');stars(c,t,140,'#cde5ff');for(var j=0;j<7;j++){var x=60+hash(j+32)*680,y=45+hash(j+68)*360,a=.4+.15*Math.sin(t*.5+j);c.globalAlpha=a;line(c,[[x-6,y],[x+6,y]],'#e8f1ff',1);line(c,[[x,y-6],[x,y+6]],'#e8f1ff',1);}c.globalAlpha=1;var sweep=(t*35)%1300-200;if(sweep<900){c.strokeStyle='rgba(176,205,246,.3)';c.lineWidth=1.3;c.beginPath();c.moveTo(sweep,60+sweep*.3);c.lineTo(sweep-65,40+sweep*.3);c.stroke();} };
  scenes.graveyard=function(c,t){sky(c,'#07111b','#25343d');stars(c,t,45,'#bed1cc');moon(c,605,130,68,'#b5c7ba');c.fillStyle='#111d23';c.beginPath();c.moveTo(0,330);c.bezierCurveTo(230,230,490,420,800,290);c.lineTo(800,500);c.lineTo(0,500);c.fill();for(var i=0;i<8;i++){var x=60+i*100,y=325+hash(i+9)*90,s=.65+hash(i+20)*.6;c.save();c.translate(x,y);c.rotate((hash(i)-.5)*.27);c.scale(s,s);c.fillStyle='#10191c';if(i%3===0){c.fillRect(-9,-90,18,100);c.fillRect(-30,-70,60,15);}else{c.beginPath();c.moveTo(-26,15);c.lineTo(-26,-45);c.bezierCurveTo(-26,-82,26,-82,26,-45);c.lineTo(26,15);c.closePath();c.fill();line(c,[[-11,-40],[12,-40]],'#314043',2);line(c,[[-8,-29],[9,-29]],'#314043',2);}c.restore();}for(var k=0;k<6;k++)glow(c,((k*190+t*9)%1100)-150,450+Math.sin(k)*22,150,'rgba(108,148,138,.09)');c.fillStyle='#080f12';c.beginPath();c.moveTo(0,450);c.quadraticCurveTo(400,400,800,455);c.lineTo(800,500);c.lineTo(0,500);c.fill();};
  scenes.cauldron=function(c,t){sky(c,'#020804','#0a160d');glow(c,400,300,195,'rgba(74,210,70,.16)');for(var i=0;i<18;i++){var yy=315-((hash(i)*280+t*(12+hash(i+20)*12))%280),xx=345+hash(i+8)*110+Math.sin(t*.4+i)*35,rr=4+hash(i+7)*11;c.strokeStyle='rgba(151,255,134,'+(.12+yy/900)+')';c.lineWidth=1.5;c.beginPath();c.arc(xx,yy,rr,0,TAU);c.stroke();}c.fillStyle='#162d22';c.beginPath();c.moveTo(277,318);c.bezierCurveTo(250,455,550,455,523,318);c.closePath();c.fill();ellipse(c,400,318,125,26,'#3e7c3b');ellipse(c,400,314,111,18,'#9ee878');for(var j=0;j<7;j++)ellipse(c,320+hash(j+4)*155,310+Math.sin(t+j)*4,5+Math.sin(t*1.2+j)*2,2,'#e5ff9d');c.strokeStyle='#537552';c.lineWidth=5;c.beginPath();c.ellipse(400,318,125,26,0,0,TAU);c.stroke();line(c,[[300,397],[285,435]],'#273d2c',12);line(c,[[500,397],[515,435]],'#273d2c',12);};
  scenes.candles=function(c,t){sky(c,'#06050a','#100b16');for(var i=0;i<12;i++){var x=55+hash(i+19)*690,y=70+hash(i+40)*310+Math.sin(t*.65+i)*9,s=.5+hash(i+5)*.8;c.save();c.translate(x,y);c.scale(s,s);glow(c,0,-20,65,'rgba(255,171,64,.17)');var g=c.createLinearGradient(-9,0,9,0);g.addColorStop(0,'#846849');g.addColorStop(.45,'#e2c9a2');g.addColorStop(1,'#b29a73');c.fillStyle=g;c.fillRect(-8,0,16,61);ellipse(c,0,0,8,3,'#f5dcb6');c.fillStyle='#ffb74f';c.beginPath();c.moveTo(0,-33-Math.sin(t*2+i)*3);c.bezierCurveTo(-15,-13,-8,-3,0,-3);c.bezierCurveTo(13,-3,9,-17,0,-33-Math.sin(t*2+i)*3);c.fill();ellipse(c,0,-10,3,7,'#fff1b1');c.restore();}};
  // These scenes have no horizon, upright figures, or common direction of travel.
  // Detail changes bound drawing work; no per-pixel effects or blur filters are used.
  function amount(options, low, balanced, high) {
    return options.detail === 'low' ? low : (options.detail === 'high' ? high : balanced);
  }
  function field(c, color) { c.fillStyle=color; c.fillRect(0,0,800,500); }
  function orbit(i,t,spread) {
    var a=hash(i+83)*TAU+t*(i%2?1:-1)*(.035+hash(i+19)*.035);
    return [hash(i+8)*800+Math.cos(a)*spread,hash(i+52)*500+Math.sin(a)*spread];
  }
  scenes.spores=function(c,t,o) {
    field(c,'#020c0a');
    for(var j=0;j<4;j++){var p=orbit(j+180,t,40);glow(c,p[0],p[1],220,'rgba(16,97,72,.16)');}
    var n=amount(o,36,58,82);
    for(var i=0;i<n;i++){var p2=orbit(i,t,24),r=1.5+hash(i+94)*4,a=.35+.2*Math.sin(t*.3+i);
      c.globalAlpha=a;if(i%6===0)glow(c,p2[0],p2[1],r*7,'rgba(94,249,177,.25)');
      ellipse(c,p2[0],p2[1],r,r,i%3?'#8df2bd':'#d3ffe5');
    }c.globalAlpha=1;
  };
  scenes.caustics=function(c,t,o) {
    field(c,'#03121e');var n=amount(o,7,10,14);
    for(var i=0;i<n;i++){var p=orbit(i+320,t,28);c.save();c.translate(p[0],p[1]);c.rotate(hash(i+42)*TAU+t*.025);
      for(var ring=0;ring<3;ring++){var r=70+ring*38+hash(i+11)*50;c.beginPath();
        var steps=amount(o,30,42,54);for(var j=0;j<=steps;j++){var a=j*TAU/steps,rr=r+Math.sin(a*3+t*.33+i)*13+Math.cos(a*5-t*.2)*7;
          if(j===0)c.moveTo(Math.cos(a)*rr,Math.sin(a)*rr);else c.lineTo(Math.cos(a)*rr,Math.sin(a)*rr);}
        c.strokeStyle=ring%2?'rgba(102,203,241,.2)':'rgba(170,227,255,.27)';c.lineWidth=ring===1?2:4;c.stroke();
      }c.restore();
    }
  };
  scenes.nebula=function(c,t,o) {
    field(c,'#050411');var n=amount(o,7,10,13);
    for(var i=0;i<n;i++){var p=orbit(i+510,t,38);glow(c,p[0],p[1],135+hash(i+65)*85,i%3===0?'rgba(168,69,130,.2)':i%3===1?'rgba(85,52,175,.24)':'rgba(42,105,148,.19)');}
    var dots=amount(o,45,80,120);for(var j=0;j<dots;j++){c.globalAlpha=.3+.22*Math.sin(t*.25+j);var r=.6+hash(j+7)*1.2;ellipse(c,hash(j+901)*800,hash(j+723)*500,r,r,'#e1d9ff');}c.globalAlpha=1;
  };
  scenes.mandala=function(c,t,o) {
    field(c,'#100713');glow(c,400,250,430,'rgba(102,44,120,.17)');c.save();c.translate(400,250);
    var rings=amount(o,7,9,11),steps=amount(o,72,96,120);
    for(var i=0;i<rings;i++){c.save();c.rotate(t*(i%2?.018:-.014)+i*.13);var radius=32+i*49;c.beginPath();
      for(var j=0;j<=steps;j++){var a=j*TAU/steps,r=radius+(14+i*3)*Math.cos(a*8+Math.sin(t*.18)*.4);if(j===0)c.moveTo(Math.cos(a)*r,Math.sin(a)*r);else c.lineTo(Math.cos(a)*r,Math.sin(a)*r);}
      c.strokeStyle=i%2?'rgba(220,167,112,.7)':'rgba(185,129,224,.6)';c.lineWidth=i%3===0?2.4:1.3;c.stroke();c.restore();
    }glow(c,0,0,45,'rgba(244,191,128,.27)');c.restore();
  };
  scenes.vortex=function(c,t,o) {
    field(c,'#050512');glow(c,400,250,400,'rgba(68,48,142,.18)');c.save();c.translate(400,250);
    var arms=amount(o,5,7,9),steps=amount(o,48,64,80);
    for(var i=0;i<arms;i++){c.beginPath();for(var j=0;j<=steps;j++){var r=12+j*530/steps,a=i*TAU/arms+r*.012+t*.07;
        if(j===0)c.moveTo(Math.cos(a)*r,Math.sin(a)*r);else c.lineTo(Math.cos(a)*r,Math.sin(a)*r);}
      c.strokeStyle=i%2?'rgba(106,158,232,.43)':'rgba(175,134,244,.5)';c.lineWidth=2;c.stroke();}
    var n=amount(o,48,82,120);for(var k=0;k<n;k++){var rr=22+hash(k+54)*480,aa=hash(k)*TAU+t*(.04+30/(rr+80)),sz=.7+hash(k+46)*2;ellipse(c,Math.cos(aa)*rr,Math.sin(aa)*rr,sz,sz,k%4?'#afa9ed':'#e4dfff');}
    glow(c,0,0,66,'rgba(2,2,12,.95)');c.restore();
  };
  scenes.plasma=function(c,t,o) {
    field(c,'#090710');var n=amount(o,10,15,20);
    for(var i=0;i<n;i++){var p=orbit(i+670,t,45),r=35+hash(i+46)*45+Math.sin(t*.25+i)*7;
      glow(c,p[0],p[1],r*1.3,i%2?'rgba(145,62,202,.3)':'rgba(124,183,71,.23)');
      c.beginPath();c.arc(p[0],p[1],r,0,TAU);c.strokeStyle=i%2?'rgba(200,139,246,.44)':'rgba(195,231,135,.42)';c.lineWidth=1.5;c.stroke();
      ellipse(c,p[0]+Math.sin(t*.15+i)*r*.25,p[1]+Math.cos(t*.15+i)*r*.25,4,4,i%2?'#bc89dc':'#a7ce7b');
    }
  };
  scenes.hexes=function(c,t,o) {
    field(c,'#041010');var radius=amount(o,53,42,34),stepX=radius*1.5,stepY=radius*Math.sqrt(3);
    for(var col=-1;col<=Math.ceil(800/stepX);col++)for(var row=-1;row<=Math.ceil(500/stepY);row++){
      var x=col*stepX,y=(row+(col%2? .5:0))*stepY,phase=hash(col*31+row+600)*TAU,a=.16+.2*(.5+.5*Math.sin(t*.3+phase));
      c.beginPath();for(var k=0;k<6;k++){var angle=k*TAU/6,xx=x+Math.cos(angle)*(radius-4),yy=y+Math.sin(angle)*(radius-4);if(k===0)c.moveTo(xx,yy);else c.lineTo(xx,yy);}c.closePath();
      c.fillStyle='rgba(28,105,99,'+(a*.24)+')';c.fill();c.strokeStyle='hsla('+(160+hash(col*51+row+201)*100)+',60%,68%,'+a+')';c.lineWidth=1.8;c.stroke();
    }
  };
  scenes.ripples=function(c,t,o) {
    field(c,'#050b13');var n=amount(o,4,6,8);
    for(var i=0;i<n;i++){var p=[hash(i+142)*800,hash(i+384)*500];
      for(var j=0;j<5;j++){var phase=(t*.035+j/5+hash(i+52))%1,r=phase*340;
        c.strokeStyle=i%2?'rgba(178,155,234,'+(.27*Math.sin(phase*Math.PI))+')':'rgba(117,215,217,'+(.32*Math.sin(phase*Math.PI))+')';c.lineWidth=2.2;
        c.beginPath();c.arc(p[0],p[1],Math.max(.1,r),0,TAU);c.stroke();
      }
    }
  };
  // Build the network once; drawing never performs an all-pairs search.
  var network=[],links=[];
  for(var ni=0;ni<66;ni++)network.push([hash(ni+177)*800,hash(ni+922)*500]);
  for(var na=0;na<network.length;na++)for(var nb=na+1;nb<network.length;nb++){
    var dx=network[na][0]-network[nb][0],dy=network[na][1]-network[nb][1],distance=dx*dx+dy*dy;
    if(distance<105*105&&distance>24*24)links.push([na,nb]);
  }
  scenes.mycelium=function(c,t,o) {
    field(c,'#040c09');var n=amount(o,40,54,66);
    for(var i=0;i<links.length;i++){var pair=links[i];if(pair[0]>=n||pair[1]>=n)continue;var a=network[pair[0]],b=network[pair[1]],wave=Math.sin(t*.26+i)*4;
      c.beginPath();c.moveTo(a[0],a[1]);c.quadraticCurveTo((a[0]+b[0])/2+wave,(a[1]+b[1])/2-wave,b[0],b[1]);
      c.strokeStyle='rgba(109,218,156,'+(.22+.08*Math.sin(t*.23+i))+')';c.lineWidth=1.2;c.stroke();
    }
    for(var j=0;j<n;j++){var p=network[j],r=1.5+hash(j+23)*2;c.globalAlpha=.5+.17*Math.sin(t*.3+j);if(j%9===0)glow(c,p[0],p[1],25,'rgba(101,220,156,.2)');ellipse(c,p[0],p[1],r,r,'#b6f4c8');}c.globalAlpha=1;
  };
  scenes.constellation=function(c,t,o) {
    field(c,'#100704');var n=amount(o,35,60,88),previous=null;
    for(var i=0;i<n;i++){var p=orbit(i+809,t,18),r=.8+hash(i+9)*2.3;
      if(previous&&i%4!==0){var dx=p[0]-previous[0],dy=p[1]-previous[1];if(dx*dx+dy*dy<210*210)line(c,[previous,p],'rgba(213,129,65,.15)',1);}
      c.globalAlpha=.52+.18*Math.sin(t*.28+i);if(i%7===0)glow(c,p[0],p[1],26,'rgba(239,113,33,.28)');ellipse(c,p[0],p[1],r,r,i%3?'#e4a768':'#ffe0aa');previous=p;
    }c.globalAlpha=1;
  };
  function draw(ctx,id,t,w,h,options) {
    options=options||{};t=(Number(t)||0)*(typeof options.speed==='number'?options.speed:1);
    ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,w,h);ctx.fillStyle='#000';ctx.fillRect(0,0,w,h);ctx.scale(w/800,h/500);
    (scenes[id]||scenes.ghosts)(ctx,t,options);
    if(typeof options.intensity==='number'&&options.intensity<1){ctx.globalAlpha=1;ctx.fillStyle='rgba(0,0,0,'+Math.max(0,Math.min(1,1-options.intensity))+')';ctx.fillRect(0,0,800,500);}
    ctx.restore();
  }
  root.HauntScenes={catalog:catalog,draw:draw};
}(typeof window !== 'undefined' ? window : globalThis));
