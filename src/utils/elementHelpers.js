import rough from "roughjs";
const generator = rough.generator();

export function adjustElementCoordinates(
	lastElement,
	initialCoords,
	cursorCoords,
	setElements,
	generator
) {
	const { x, y } = initialCoords;
	const { offsetX, offsetY } = cursorCoords;
	if (lastElement.type === "line") {
		let lineCoords;
		if (x < offsetX || (x === offsetX && y < offsetY)) {
			lineCoords = { x1: x, y1: y, x2: offsetX, y2: offsetY };
		} else {
			lineCoords = { x1: offsetX, y1: offsetY, x2: x, y2: y };
		}
		const adjustedLine = generator.line(
			lineCoords.x1,
			lineCoords.y1,
			lineCoords.x2,
			lineCoords.y2,
			lastElement.options
		);
		setElements((prev) => [
			...prev.slice(0, -1),
			{ ...lastElement, ...lineCoords, element: adjustedLine },
		]);
	} else if (lastElement.type === "rectangle") {
		const { width, height } = lastElement;
		const [minX, minY] = [Math.min(x, offsetX), Math.min(y, offsetY)];
		const [absWidth, absHeight] = [Math.abs(width), Math.abs(height)];
		const adjustedRectangle = generator.rectangle(
			minX,
			minY,
			absWidth,
			absHeight,
			lastElement.options
		);
		setElements((prev) => [
			...prev.slice(0, -1),
			{
				...lastElement,
				x: minX,
				y: minY,
				width: absWidth,
				height: absHeight,
				element: adjustedRectangle,
			},
		]);
	} else if (lastElement.type === "ellipse") {
		const { x, y, xCenter, yCenter, width, height } = lastElement;
		let newX = x;
		let newY = y;
		if (x > xCenter) {
			newX = x - width;
		}
		if (y > yCenter) {
			newY = y - height;
		}
		const adjustedEllipse = generator.ellipse(
			xCenter,
			yCenter,
			width,
			height,
			lastElement.options
		);
		setElements((prev) => [
			...prev.slice(0, -1),
			{
				...lastElement,
				x: newX,
				y: newY,
				xCenter,
				yCenter,
				width,
				height,
				element: adjustedEllipse,
			},
		]);
	}
}

export function resizeElementCoords(
	cursorX,
	cursorY,
	element,
	corner,
	roughOptions
) {
	const { type } = element;
	if (type === "line") {
		if (corner === "tl") {
			return {
				...element,
				x: cursorX,
				y: cursorY,
				element: generator.line(
					cursorX,
					cursorY,
					element.x2,
					element.y2,
					roughOptions
				),
			};
		}
		if (corner === "br") {
			return {
				...element,
				x2: cursorX,
				y2: cursorY,
				element: generator.line(
					element.x,
					element.y,
					cursorX,
					cursorY,
					roughOptions
				),
			};
		}
		// if no corner action is provided (should not get here)
		return element;
	} else if (type === "rectangle") {
		const { x, y, width, height } = element;
		if (corner === "tl") {
			const newWidth = width + x - cursorX;
			const newHeight = height + y - cursorY;
			return {
				...element,
				x: cursorX,
				y: cursorY,
				width: newWidth,
				height: newHeight,
				element: generator.rectangle(
					cursorX,
					cursorY,
					newWidth,
					newHeight,
					roughOptions
				),
			};
		}
		if (corner === "tr") {
			const newWidth = cursorX - x;
			const newHeight = height + y - cursorY;
			return {
				...element,
				x: cursorX - newWidth,
				y: cursorY,
				width: newWidth,
				height: newHeight,
				element: generator.rectangle(
					cursorX - newWidth,
					cursorY,
					newWidth,
					newHeight,
					roughOptions
				),
			};
		}
		if (corner === "bl") {
			const newWidth = width + x - cursorX;
			const newHeight = cursorY - y;
			return {
				...element,
				x: cursorX,
				y: cursorY - newHeight,
				width: newWidth,
				height: newHeight,
				element: generator.rectangle(
					cursorX,
					cursorY - newHeight,
					newWidth,
					newHeight,
					roughOptions
				),
			};
		}
		if (corner === "br") {
			const newWidth = cursorX - x;
			const newHeight = cursorY - y;
			return {
				...element,
				x: x,
				y: y,
				width: newWidth,
				height: newHeight,
				element: generator.rectangle(
					x,
					y,
					newWidth,
					newHeight,
					roughOptions
				),
			};
		}
		// if no corner action is provided (should not get here)
		return element;
	} else if (type === "ellipse") {
		const { x, y, width, height } = element;
		if (corner === "tl") {
			const newWidth = width + x - cursorX;
			const newHeight = height + y - cursorY;
			const newXCenter = newWidth / 2 + cursorX;
			const newYCenter = newHeight / 2 + cursorY;
			return {
				...element,
				x: cursorX,
				y: cursorY,
				xCenter: newXCenter,
				yCenter: newYCenter,
				width: newWidth,
				height: newHeight,
				element: generator.ellipse(
					newXCenter,
					newYCenter,
					newWidth,
					newHeight,
					roughOptions
				),
			};
		}
		if (corner === "tr") {
			const newWidth = cursorX - x;
			const newHeight = height + y - cursorY;
			const newXCenter = newWidth / 2 + cursorX - newWidth;
			const newYCenter = newHeight / 2 + cursorY;
			return {
				...element,
				x: cursorX - newWidth,
				y: cursorY,
				xCenter: newXCenter,
				yCenter: newYCenter,
				width: newWidth,
				height: newHeight,
				element: generator.ellipse(
					newXCenter,
					newYCenter,
					newWidth,
					newHeight,
					roughOptions
				),
			};
		}
		if (corner === "bl") {
			const newWidth = width + x - cursorX;
			const newHeight = cursorY - y;
			const newXCenter = newWidth / 2 + cursorX;
			const newYCenter = newHeight / 2 + cursorY - newHeight;
			return {
				...element,
				x: cursorX,
				y: cursorY - newHeight,
				xCenter: newXCenter,
				yCenter: newYCenter,
				width: newWidth,
				height: newHeight,
				element: generator.ellipse(
					newXCenter,
					newYCenter,
					newWidth,
					newHeight,
					roughOptions
				),
			};
		}
		if (corner === "br") {
			const newWidth = cursorX - x;
			const newHeight = cursorY - y;
			const newXCenter = newWidth / 2 + x;
			const newYCenter = newHeight / 2 + y;
			return {
				...element,
				x: x,
				y: y,
				xCenter: newXCenter,
				yCenter: newYCenter,
				width: newWidth,
				height: newHeight,
				element: generator.ellipse(
					newXCenter,
					newYCenter,
					newWidth,
					newHeight,
					roughOptions
				),
			};
		}
		return element;
	}
	return element;
}

export function changeFill(element, fillColor, fillStyle) {
	const isFillStyleNone = fillStyle === "none";

	if (element.type === "rectangle") {
		const newRectangle = generator.rectangle(
			element.x,
			element.y,
			element.width,
			element.height,
			{
				...element.options,
				fill: !isFillStyleNone && fillColor,
				fillStyle,
			}
		);

		return {
			...element,
			options: {
				...element.options,
				fill: !isFillStyleNone && fillColor,
				fillStyle,
			},
			element: newRectangle,
		};
	}
	if (element.type === "ellipse") {
		const newEllipse = generator.ellipse(
			element.xCenter,
			element.yCenter,
			element.width,
			element.height,
			{
				...element.options,
				fill: !isFillStyleNone && fillColor,
				fillStyle,
			}
		);

		return {
			...element,
			options: {
				...element.options,
				fill: !isFillStyleNone && fillColor,
				fillStyle,
			},
			element: newEllipse,
		};
	}
	return element;
}
