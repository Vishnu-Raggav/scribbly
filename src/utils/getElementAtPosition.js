function distanceBetweenPoints(A, B) {
	const dx = A.x - B.x;
	const dy = A.y - B.y;
	return Math.sqrt(dx * dx + dy * dy);
}

export default function getElementAtPosition(cursorX, cursorY, element) {
	if (element.type === "line") {
		const pointA = { x: element.x, y: element.y };
		const pointB = { x: element.x2, y: element.y2 };
		const pointC = { x: cursorX, y: cursorY };

		return (
			Math.abs(
				distanceBetweenPoints(pointA, pointC) +
					distanceBetweenPoints(pointC, pointB) -
					distanceBetweenPoints(pointA, pointB)
			) < 1
		);
	} else if (element.type === "rectangle") {
		const elementFillStyle = element.element.options.fillStyle;
		const grace = 3;
		const { x, y, width, height } = element;
		const insideBounds =
			cursorX >= x - grace &&
			cursorX <= x + width + grace &&
			cursorY >= y - grace &&
			cursorY <= y + height + grace;
		if (elementFillStyle !== "none" && insideBounds) return true;
		if (!insideBounds) return false;
		const nearLeft =
			Math.abs(cursorX - x) <= grace &&
			cursorY >= y &&
			cursorY <= y + height;
		const nearRight =
			Math.abs(cursorX - (x + width)) <= grace &&
			cursorY >= y &&
			cursorY <= y + height;
		const nearTop =
			Math.abs(cursorY - y) <= grace &&
			cursorX >= x &&
			cursorX <= x + width;
		const nearBottom =
			Math.abs(cursorY - (y + height)) <= grace &&
			cursorX >= x &&
			cursorX <= x + width;

		return nearLeft || nearRight || nearTop || nearBottom;
	} else if (element.type === "ellipse") {
		const elementFillStyle = element.element.options.fillStyle;
		const { xCenter, yCenter, width, height } = element;
		const [a, b] = [width / 2, height / 2];

		const normalized =
			(cursorX - xCenter) ** 2 / a ** 2 +
			(cursorY - yCenter) ** 2 / b ** 2;

		const minArea = 1000;
		const ellipseArea = Math.PI * a * b;
		if (ellipseArea <= minArea) return normalized <= 1;
		else {
			const ellipseGrace = 0.1;
			if (elementFillStyle !== "none" && normalized <= 1) return true;

			return (
				normalized >= 1 - ellipseGrace && normalized <= 1 + ellipseGrace
			);
		}
	} else if (element.type === "text") {
		const { x: startX, y: startY, width, height } = element;
		const [endX, endY] = [startX + width, startY + height];
		return (
			cursorX >= startX &&
			cursorX <= endX &&
			cursorY >= startY &&
			cursorY <= endY
		);
	} else return false;
}
