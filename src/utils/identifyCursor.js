import getElementAtPosition from "./getElementAtPosition";

export default function identifyCursor(
	cursorX,
	cursorY,
	elements,
	selectedElement,
	canvas
) {
	if (
		// change cursor when inside selectedElement
		selectedElement !== null &&
		cursorWithinElement(cursorX, cursorY, selectedElement)
	) {
		canvas.style.cursor = "move";
	} else {
		// change cursor when near shapes
		canvas.style.cursor =
			[...elements]
				.reverse()
				.find((el) => getElementAtPosition(cursorX, cursorY, el)) !==
			undefined
				? "move"
				: "default";
	}
}

export function cursorWithinElement(cursorX, cursorY, element) {
	const { type } = element;
	if (type === "line") {
		return getElementAtPosition(cursorX, cursorY, element);
	} else {
		const { x, y, width, height } = element;
		return (
			cursorX >= x &&
			cursorY >= y &&
			cursorX <= x + width &&
			cursorY <= y + height
		);
	}
}
