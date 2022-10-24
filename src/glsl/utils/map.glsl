float map(float value, float min1, float max1, float min2, float max2) {
  return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
  // return clamp(min2 + (value - min1) * (max2 - min2) / (max1 - min1), min2, max2);
}

float map(float value, vec2 interval1, vec2 interval2) {
  return map(value, interval1.x, interval1.y, interval2.x, interval2.y);
}
#pragma glslify: export(map);