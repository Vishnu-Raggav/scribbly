export default function findDragOffset(cursorCoords, selectedElement) {
	const { cursorX, cursorY } = cursorCoords;
	if (selectedElement.type === "line") {
		return {
			dx: cursorX - selectedElement.x,
			dy: cursorY - selectedElement.y,
			dx2: cursorX - selectedElement.x2,
			dy2: cursorY - selectedElement.y2,
		};
	} else
		return {
			dx: cursorX - selectedElement.x,
			dy: cursorY - selectedElement.y,
		};
}
