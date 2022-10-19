float circle(vec2 center, vec2 uv, float radius) {
	float d = length(center - uv) - radius;
	float t = smoothstep(0., 0.001, d);
	return 1. - t;
}

#pragma glslify: export(circle);