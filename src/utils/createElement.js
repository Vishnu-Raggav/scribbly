import rough from "roughjs";
import { v4 as uuid } from "uuid";
const generator = rough.generator();

export default function createElement(element, setElements) {
	const { type } = element;
	switch (type) {
		case "line": {
			const { x, y, options } = element;
			const newElement = generator.line(x, y, x, y, options);
			setElements((prev) => [
				...prev,
				{
					id: uuid(),
					x,
					y,
					x2: x,
					y2: y,
					type,
					options,
					element: newElement,
				},
			]);
			break;
		}
		case "rectangle": {
			const { x, y, options } = element;
			const newElement = generator.rectangle(x, y, 0, 0, options);
			setElements((prev) => [
				...prev,
				{
					id: uuid(),
					x,
					y,
					width: 0,
					height: 0,
					type,
					options,
					element: newElement,
				},
			]);
			break;
		}
		case "ellipse": {
			const { x, y, options } = element;
			const newElement = generator.ellipse(x, y, 0, 0, options);
			setElements((prev) => [
				...prev,
				{
					id: uuid(),
					x,
					y,
					xCenter: x,
					yCenter: y,
					width: 0,
					height: 0,
					type,
					options,
					element: newElement,
				},
			]);
			break;
		}
		case "text": {
			const { x, y } = element;
			setElements((prev) => [
				...prev,
				{
					id: uuid(),
					x,
					y,
					width: 0,
					height: 0,
					type,
					value: "",
				},
			]);
		}
	}
}
