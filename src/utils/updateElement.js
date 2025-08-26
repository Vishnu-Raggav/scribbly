import rough from "roughjs";
const generator = rough.generator();

export default function updateElement(element, setElements) {
	const { type } = element;
	switch (type) {
		case "line": {
			const { x, y, x2, y2, options } = element;
			const newElement = generator.line(x, y, x2, y2, options);
			updateElementById(
				{
					...element,
					x,
					y,
					x2,
					y2,
					type,
					options,
					element: newElement,
				},
				setElements
			);
			break;
		}
		case "rectangle": {
			const { x, y, width, height, options } = element;
			const newElement = generator.rectangle(
				x,
				y,
				width,
				height,
				options
			);
			updateElementById(
				{
					...element,
					x,
					y,
					width,
					height,
					type,
					options,
					element: newElement,
				},
				setElements
			);
			break;
		}
		case "ellipse": {
			const { x, y, xCenter, yCenter, width, height, options } = element;
			const newElement = generator.ellipse(
				xCenter,
				yCenter,
				width,
				height,
				options
			);
			updateElementById(
				{
					...element,
					x,
					y,
					xCenter,
					yCenter,
					width,
					height,
					type,
					options,
					element: newElement,
				},
				setElements
			);
			break;
		}
	}
}

export function updateElementById(element, setElements) {
	setElements((prev) => {
		const elementsCopy = [...prev];
		return elementsCopy.map((el) => {
			if (el.id === element.id) return element;
			return el;
		});
	});
}
