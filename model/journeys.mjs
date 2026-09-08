import {ringGeometry} from './design.mjs';
export const TAU=2*Math.PI;
export const wrap=a=>((a%TAU)+TAU)%TAU;
export const separation=(a,b)=>Math.min(wrap(a-b),wrap(b-a));
const rings=ringGeometry();
export const home={name:'Home',ring:1,angle:0};
// Illustrative placements, not a surveyed land-use plan or a ranking of demand.
export const destinations=[
 ['Grocery · local','Essentials',1,.08],['Grocery · market hall','Essentials',2,.55],
 ['Library','Learning',2,1.2],['Restaurant · neighborhood','Food',1,.15],
 ['Restaurant · across the gap','Food',2,.12],['Restaurant · far side','Food',2,Math.PI],
 ['Restaurant · outer-ring view','Food',5,2.7],['Café','Food',1,-.12],
 ['Bakery','Food',2,-.25],['Pharmacy','Health',1,.2],['Primary care','Health',2,.7],
 ['Dentist','Health',3,1.1],['Hospital','Health',4,2],['Primary school','Learning',1,-.2],
 ['Secondary school','Learning',2,1.7],['Childcare','Learning',1,.05],
 ['University','Learning',5,2.4],['Office','Work',3,.9],['Coworking','Work',2,-.8],
 ['Gym','Recreation',1,.3],['Swimming pool','Recreation',3,-.5],
 ['Sports fields','Recreation',4,1.8],['Cinema','Recreation',3,2.2],
 ['Theater','Recreation',4,-1.4],['Community center','Community',2,-1.1],
 ['Place of worship','Community',3,-2],['Post / parcel shop','Essentials',1,-.3],
 ['Hardware store','Essentials',4,.6],['Friend’s home','Community',6,-2.6],
 ['Regional rail station','Transit',7,1.4]
].map(([name,category,ring,angle],i)=>({id:i,name:String(name),category:String(category),ring:Number(ring),angle:Number(angle)}));
export function omega(index,speed=.5){return (index%2?1:-1)*speed/rings[index].midRadius;}
export function position(place,seconds,speed=.5){return wrap(place.angle+omega(place.ring,speed)*seconds);}
// Walk on a rotating ring to a FIXED station. Solve interception in both directions.
export function interceptFixed(start,target,radius,w,u){
 const positive=u/radius+w,negative=u/radius-w;
 const ccw=positive>0?wrap(target-start)/positive:Infinity;
 const cw=negative>0?wrap(start-target)/negative:Infinity;
 return ccw<=cw?{seconds:ccw,direction:1}:{seconds:cw,direction:-1};
}
export function journey(destination,{departureHours=0,speed=.5,walking=1.3,stations=32,boardingSeconds=0,freezeAtHours=0}={}){
 const t=departureHours*3600;
 // A frozen comparison keeps all locations at their phase at freezeAtHours.
 const homeAngle=position(home,speed===0?freezeAtHours*3600:t,speed===0?.5:speed);
 const destAngleAt=(seconds)=>position(destination,speed===0?freezeAtHours*3600:seconds,speed===0?.5:speed);
 const r0=rings[home.ring].midRadius,r1=rings[destination.ring].midRadius;
 if(destination.ring===home.ring){
  const seconds=separation(home.angle,destination.angle)*r0/walking;
  return {seconds,walkMeters:seconds*walking,station:-1,first:seconds,radial:0,last:0,boarding:0,homeAngle,destBoardAngle:destAngleAt(t),stationAngle:homeAngle};
 }
 let best={seconds:Infinity};
 for(let i=0;i<stations;i++){
  const a=TAU*i/stations;
  const first=interceptFixed(homeAngle,a,r0,omega(home.ring,speed),walking);
  // Fixed grade-separated radial spine. No intermediate ring boarding.
  const radial=Math.abs(r1-r0)/walking;
  const atBoard=t+first.seconds+boardingSeconds+radial+boardingSeconds;
  const target=destAngleAt(atBoard);
  // After boarding, pedestrian and destination share the ring's angular velocity.
  const last=separation(a,target)*r1/walking;
  const seconds=first.seconds+radial+last+2*boardingSeconds;
  if(seconds<best.seconds)best={seconds,walkMeters:(first.seconds+radial+last)*walking,station:i,first:first.seconds,radial,last,boarding:2*boardingSeconds,homeAngle,destBoardAngle:target,stationAngle:a};
 }
 return best;
}
export function stopGeometry({radius,phaseDegrees,exits=64,fixedStations=32,hydrantSpacing=50,hoseReach=30,radialGap=4}){
 const circumference=TAU*radius;
 const fixedPitch=circumference/fixedStations;
 const exitAngles=Array.from({length:exits},(_,i)=>wrap(phaseDegrees*Math.PI/180+TAU*i/exits));
 const nearest=exitAngles.map(a=>Math.min(...Array.from({length:fixedStations},(_,i)=>separation(a,TAU*i/fixedStations)*radius)));
 // Conservative routed length follows the gallery then crosses the gap, no diagonal shortcut.
 const requiredHose=hydrantSpacing/2+radialGap;
 return {exitAngles,nearest,worstWalk:Math.max(...nearest),allAngleBound:fixedPitch/2,
  requiredHose,hoseMargin:hoseReach-requiredHose,continuousLanding:true};
}
