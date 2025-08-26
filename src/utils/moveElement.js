import rough from "roughjs";
const generator = rough.generator();

export default function moveElement(
	selectedElement,
	dragOffsetRef,
	cursorCoords
) {
	const { dx, dy } = dragOffsetRef.current;
	const { cursorX, cursorY } = cursorCoords;
	if (selectedElement.type === "line") {
		const { dx2, dy2 } = dragOffsetRef.current;
		const [newX, newY, newX2, newY2] = [
			cursorX - dx,
			cursorY - dy,
			cursorX - dx2,
			cursorY - dy2,
		];
		const movedLine = generator.line(
			newX,
			newY,
			newX2,
			newY2,
			selectedElement.options
		);
		return {
			x: newX,
			y: newY,
			x2: newX2,
			y2: newY2,
			element: movedLine,
		};
	} else if (
		selectedElement.type === "rectangle" ||
		selectedElement.type === "text"
	) {
		const newX = cursorX - dragOffsetRef.current.dx;
		const newY = cursorY - dragOffsetRef.current.dy;
		const { width, height, type } = selectedElement;
		if (type === "rectangle") {
			const movedRectangle = generator.rectangle(
				newX,
				newY,
				width,
				height,
				selectedElement.options
			);
			return {
				x: newX,
				y: newY,
				element: movedRectangle,
			};
		} else {
			return {
				x: newX,
				y: newY,
			};
		}
	} else if (selectedElement.type === "ellipse") {
		const { width, height } = selectedElement;

		const newX = cursorX - dragOffsetRef.current.dx;
		const newY = cursorY - dragOffsetRef.current.dy;

		const newXCenter = newX + width / 2;
		const newYCenter = newY + height / 2;

		const movedEllipse = generator.ellipse(
			newXCenter,
			newYCenter,
			width,
			height,
			selectedElement.options
		);

		return {
			x: newX,
			y: newY,
			xCenter: newXCenter,
			yCenter: newYCenter,
			element: movedEllipse,
		};
	}
}
