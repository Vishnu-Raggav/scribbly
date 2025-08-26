import rough from "roughjs";
const generator = rough.generator();

export default function adjustElementCoords(element, roughOptions) {
	if (element.type === "line") {
		const [x, y] = [element.x, element.y];
		const [endX, endY] = [element.x2, element.y2];
		let lineCoords;
		if (x < endX || (x === endX && y < endY)) {
			lineCoords = { x1: x, y1: y, x2: endX, y2: endY };
		} else {
			lineCoords = { x1: endX, y1: endY, x2: x, y2: y };
		}
		const adjustedLine = generator.line(
			lineCoords.x1,
			lineCoords.y1,
			lineCoords.x2,
			lineCoords.y2,
			roughOptions
		);
		return {
			...element,
			x: lineCoords.x1,
			y: lineCoords.y1,
			x2: lineCoords.x2,
			y2: lineCoords.y2,
			element: adjustedLine,
		};
	} else if (element.type === "rectangle") {
		const { x, y, width, height } = element;
		const absWidth = Math.abs(width);
		const absHeight = Math.abs(height);
		const minX = Math.min(x, x + width);
		const minY = Math.min(y, y + height);

		const adjustedRectangle = generator.rectangle(
			minX,
			minY,
			absWidth,
			absHeight,
			roughOptions
		);
		return {
			...element,
			x: minX,
			y: minY,
			width: absWidth,
			height: absHeight,
			element: adjustedRectangle,
		};
	} else if (element.type === "ellipse") {
		const { x, y, xCenter, yCenter, width, height } = element;
		const [absWidth, absHeight] = [Math.abs(width), Math.abs(height)];
		let [newX, newY] = [x, y];

		if (x > xCenter) newX = x - absWidth;
		if (y > yCenter) newY = y - absHeight;

		const adjustedEllipse = generator.ellipse(
			xCenter,
			yCenter,
			absWidth,
			absHeight,
			roughOptions
		);

		return {
			...element,
			x: newX,
			y: newY,
			xCenter,
			yCenter,
			width: absWidth,
			height: absHeight,
			element: adjustedEllipse,
		};
	}
}
