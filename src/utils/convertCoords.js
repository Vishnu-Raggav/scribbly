export function screenToWorld(x, y, panOffset) {
	return [x - panOffset.x, y - panOffset.y];
}

export function worldToScreen(x, y, panOffset) {
	return [x + panOffset.x, y + panOffset.y];
}
