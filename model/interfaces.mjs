// Idealized interface sensitivities. These are not component ratings.
export function motionMetrics({radius, innerRadius, outerRadius, speed, stopSeconds}) {
  const omega = speed / radius;
  return { innerSpeed:omega*innerRadius, outerSpeed:omega*outerRadius,
    periodHours:speed>0?2*Math.PI/omega/3600:Infinity,
    acceleration:speed*speed/radius, stopDistance:speed*stopSeconds/2,
    deceleration:speed/stopSeconds };
}
export function transferMetrics({flow, stations, unavailable, stroke, speed, resetSeconds, velocity}) {
  const connectedSeconds = stroke/speed;
  const duty = connectedSeconds/(connectedSeconds+resetSeconds);
  const active = Math.max(0, stations-unavailable);
  const perStation = active>0 ? flow/(active*duty) : Infinity;
  return {connectedSeconds, duty, active, perStation,
    diameter:Math.sqrt(4*perStation/(Math.PI*velocity)), cycleSeconds:connectedSeconds+resetSeconds};
}
export function outageMetrics({averageFlow, storageHours, peakFactor, outageHours}) {
  const storage = averageFlow*3600*storageHours;
  const required = averageFlow*peakFactor*3600*outageHours;
  return {storage,required,remaining:storage-required,hoursToFull:storageHours/peakFactor};
}
export function powerMetrics({deliveredMW, efficiency}) {
  const inputMW=deliveredMW/efficiency;
  return {inputMW,lossMW:inputMW-deliveredMW};
}
