// Libraries
import rough from "roughjs";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

// Custom Helpers
import moveElement from "./utils/moveElement";
import createElement from "./utils/createElement";
import findDragOffset from "./utils/findDragOffset";
import { screenToWorld } from "./utils/convertCoords";
import adjustElementCoords from "./utils/adjustElementCoords";
import getElementAtPosition from "./utils/getElementAtPosition";
import identifyCursor, { cursorWithinElement } from "./utils/identifyCursor";
import { clearCanvas, drawCanvas } from "./utils/canvasHelpers";
import updateElement, { updateElementById } from "./utils/updateElement";
import { changeFill, resizeElementCoords } from "./utils/elementHelpers";

// Config
import {
	generateSeed,
	roughOptions,
	fontSizeInNumber,
	fontSizeInPixels,
} from "./config";

// Components
import Toolbar from "./Toolbar";
import FillTool from "./FillTool";
import SelectionBox from "./SelectionBox";

// export default function App() {
// 	const [elements, setElements] = useState([]);
// 	const [isTyping, setIsTyping] = useState(false);
// 	const [fillColor, setFillColor] = useState(null);
// 	const [fillStyle, setFillStyle] = useState("none");
// 	const [toolbarEvents, setToolbarEvents] = useState(true);
// 	const [selectedTool, setSelectedTool] = useState("Select");
// 	const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
// 	const [selectedElement, setSelectedElement] = useState(null);
// 	const canvasInternalsRef = useRef({
// 		roughCanvas: null,
// 		canvasContext: null,
// 	});
// 	const dragOffset = useRef({});
// 	const action = useRef("none");
// 	const canvasRef = useRef(null);
// 	const lastPos = useRef({ x: null, y: null });

// 	// map keys to change tools
// 	useEffect(() => {
// 		const mapKeyToTool = (key) => {
// 			switch (key) {
// 				case "v":
// 					return "Select";
// 				case "o":
// 					return "Circle";
// 				case "r":
// 					return "Rectangle";
// 				case "l":
// 					return "Line";
// 				case "t":
// 					return "Text";
// 			}
// 		};
// 		const changeSelectedTool = (event) => {
// 			if (!isTyping) {
// 				const mappedTool = mapKeyToTool(event.key);
// 				if (mappedTool !== selectedTool && mappedTool !== undefined) {
// 					setSelectedElement(null);
// 					dragOffset.current = {};
// 					setSelectedTool(mappedTool);
// 				}
// 			}
// 		};
// 		window.addEventListener("keydown", changeSelectedTool);
// 		return () => window.removeEventListener("keydown", changeSelectedTool);
// 	}, [selectedTool, isTyping]);

// 	// delete selected element on backspace
// 	useEffect(() => {
// 		const deleteElement = (element) => {
// 			setElements((prev) => prev.filter((el) => el.id !== element.id));
// 		};

// 		const deleteSelectedElementOnBackspace = (event) => {
// 			if (event.key === "Backspace" && selectedElement !== null) {
// 				deleteElement(selectedElement);
// 				dragOffset.current = {};
// 				setSelectedElement(null);
// 			}
// 		};

// 		window.addEventListener("keydown", deleteSelectedElementOnBackspace);

// 		return () =>
// 			window.removeEventListener(
// 				"keydown",
// 				deleteSelectedElementOnBackspace
// 			);
// 	}, [selectedElement]);

// 	// drawing logic
// 	useLayoutEffect(() => {
// 		// to avoid initialing context and roughCanvas when elements change
// 		if (
// 			!canvasInternalsRef.current.roughCanvas ||
// 			!canvasInternalsRef.current.canvasContext
// 		) {
// 			canvasInternalsRef.current = {
// 				roughCanvas: rough.canvas(canvasRef.current),
// 				canvasContext: canvasRef.current.getContext("2d"),
// 			};
// 		}

// 		// clear and re-draw canvas
// 		const { roughCanvas, canvasContext } = canvasInternalsRef.current;
// 		clearCanvas(canvasRef, canvasContext);
// 		canvasContext.save();
// 		canvasContext.translate(panOffset.x, panOffset.y);
// 		drawCanvas(canvasContext, roughCanvas, elements, {
// 			fontSizeInPixels,
// 			fontSizeInNumber,
// 		});
// 		canvasContext.restore();
// 	}, [elements, panOffset]);

// 	function handleMouseDown(event) {
// 		event.preventDefault();
// 		const { offsetX, offsetY } = event.nativeEvent;
// 		const options = { ...roughOptions, seed: generateSeed() };

// 		// disable clicking to toolbar (to allow drawing shapes beneath the toolbar)
// 		if (selectedTool !== "Text") setToolbarEvents(false);

// 		if (selectedTool === "Line") {
// 			action.current = "draw";
// 			const [x, y] = [offsetX - panOffset.x, offsetY - panOffset.y];
// 			const line = generator.line(x, y, x, y, options);

// 			setElements((prev) => [
// 				...prev,
// 				{
// 					id: uuid(),
// 					x1: x,
// 					y1: y,
// 					x2: x,
// 					y2: y,
// 					options,
// 					type: "line",
// 					element: line,
// 				},
// 			]);
// 		} else if (selectedTool === "Rectangle") {
// 			action.current = "draw";
// 			const [x, y] = [offsetX - panOffset.x, offsetY - panOffset.y];
// 			const fill = fillStyle !== "none" && fillColor;
// 			const rectangle = generator.rectangle(x, y, 0, 0, {
// 				...options,
// 				fill,
// 				fillStyle,
// 			});
// 			setElements((prev) => [
// 				...prev,
// 				{
// 					id: uuid(),
// 					x,
// 					y,
// 					width: 0,
// 					height: 0,
// 					options: {
// 						...options,
// 						fill,
// 						fillStyle,
// 					},
// 					type: "rectangle",
// 					element: rectangle,
// 				},
// 			]);
// 		} else if (selectedTool === "Circle") {
// 			action.current = "draw";
// 			const [x, y] = [offsetX - panOffset.x, offsetY - panOffset.y];
// 			const fill = fillStyle !== "none" && fillColor;
// 			const ellipse = generator.ellipse(x, y, 0, 0, {
// 				...options,
// 				fill,
// 				fillStyle,
// 			});
// 			setElements((prev) => [
// 				...prev,
// 				{
// 					id: uuid(),
// 					x,
// 					y,
// 					xCenter: x,
// 					yCenter: y,
// 					width: 0,
// 					height: 0,
// 					options: {
// 						...options,
// 						fill,
// 						fillStyle,
// 					},
// 					type: "ellipse",
// 					element: ellipse,
// 				},
// 			]);
// 		} else if (selectedTool === "Text") {
// 			if (!isTyping) {
// 				setIsTyping(true);
// 				setElements((prev) => [
// 					...prev,
// 					{
// 						id: uuid(),
// 						x: offsetX - panOffset.x,
// 						y: offsetY - panOffset.y,
// 						width: 0,
// 						height: 0,
// 						type: "text",
// 						value: "",
// 					},
// 				]);
// 			} else {
// 				setIsTyping(false);

// 				// Delete text with empty string
// 				const lastElement = elements[elements.length - 1];
// 				if (lastElement.type === "text" && lastElement.value === "") {
// 					setElements(elements.slice(0, -1));
// 				}
// 			}
// 		} else if (selectedTool === "Select") {
// 			if (selectedElement === null) {
// 				const element = [...elements]
// 					.reverse()
// 					.find((el) =>
// 						getElementAtPosition(
// 							offsetX - panOffset.x,
// 							offsetY - panOffset.y,
// 							el
// 						)
// 					);
// 				if (element !== undefined) {
// 					action.current = "move";
// 					if (["rectangle", "ellipse"].includes(element.type)) {
// 						setFillColor(element.options.fill);
// 						setFillStyle(element.options.fillStyle);
// 					}
// 					setSelectedElement(element);
// 					dragOffset.current = findDragOffset(
// 						{
// 							cursorX: offsetX - panOffset.x,
// 							cursorY: offsetY - panOffset.y,
// 						},
// 						element
// 					);
// 				} else {
// 					// pan
// 					if (event.button === 2) {
// 						action.current = "pan";
// 						const { offsetX, offsetY } = event.nativeEvent;
// 						lastPos.current = { x: offsetX, y: offsetY };
// 						event.target.style.cursor = "grabbing";
// 					}

// 					// reset selected details
// 					setSelectedElement(null);
// 					dragOffset.current = {};
// 				}
// 			} else {
// 				if (
// 					cursorWithinElement(
// 						offsetX - panOffset.x,
// 						offsetY - panOffset.y,
// 						selectedElement
// 					)
// 				) {
// 					action.current = "move";
// 					dragOffset.current = findDragOffset(
// 						{
// 							cursorX: offsetX - panOffset.x,
// 							cursorY: offsetY - panOffset.y,
// 						},
// 						selectedElement
// 					);
// 				} else {
// 					const element = elements.find((el) =>
// 						getElementAtPosition(
// 							offsetX - panOffset.x,
// 							offsetY - panOffset.y,
// 							el
// 						)
// 					);
// 					if (element !== undefined) {
// 						action.current = "move";
// 						setSelectedElement(element);
// 						dragOffset.current = findDragOffset(
// 							{
// 								cursorX: offsetX - panOffset.x,
// 								cursorY: offsetY - panOffset.y,
// 							},
// 							element
// 						);
// 					} else {
// 						// pan
// 						if (event.button === 2) {
// 							action.current = "pan";
// 							const { offsetX, offsetY } = event.nativeEvent;
// 							lastPos.current = { x: offsetX, y: offsetY };
// 						}
// 						// reset selected details
// 						setSelectedElement(null);
// 						dragOffset.current = {};
// 					}
// 				}
// 			}
// 		}
// 	}

// 	function handleMouseMove(event) {
// 		const { offsetX, offsetY } = event.nativeEvent;
// 		const cursorWorld = {
// 			x: offsetX - panOffset.x,
// 			y: offsetY - panOffset.y,
// 		};
// 		if (selectedTool === "Select") {
// 			if (
// 				// change cursor when inside selectedElement
// 				selectedElement !== null &&
// 				cursorWithinElement(
// 					cursorWorld.x,
// 					cursorWorld.y,
// 					selectedElement
// 				)
// 			) {
// 				event.target.style.cursor = "move";
// 			} else {
// 				// change cursor when near shapes
// 				event.target.style.cursor =
// 					[...elements]
// 						.reverse()
// 						.find((el) =>
// 							getElementAtPosition(
// 								cursorWorld.x,
// 								cursorWorld.y,
// 								el
// 							)
// 						) !== undefined
// 						? "move"
// 						: "default";
// 			}
// 		} else {
// 			event.target.style.cursor = "crosshair";
// 		}

// 		if (action.current === "draw") {
// 			const lastElement = elements[elements.length - 1];
// 			const [x, y] =
// 				lastElement.type === "line"
// 					? [lastElement.x1, lastElement.y1]
// 					: [lastElement.x, lastElement.y];
// 			const { offsetX, offsetY } = event.nativeEvent;
// 			if (selectedTool === "Line") {
// 				const [x2, y2] = [offsetX - panOffset.x, offsetY - panOffset.y];
// 				const updatedLine = generator.line(
// 					x,
// 					y,
// 					x2,
// 					y2,
// 					lastElement.options
// 				);
// 				setElements((prev) => {
// 					const elementsCopy = [...prev];
// 					elementsCopy[prev.length - 1] = {
// 						...elementsCopy[prev.length - 1],
// 						x1: x,
// 						y1: y,
// 						x2,
// 						y2,
// 						type: "line",
// 						element: updatedLine,
// 					};
// 					return elementsCopy;
// 				});
// 			} else if (selectedTool === "Rectangle") {
// 				const [width, height] = [
// 					offsetX - panOffset.x - x,
// 					offsetY - panOffset.y - y,
// 				];
// 				const updatedRectangle = generator.rectangle(
// 					x,
// 					y,
// 					width,
// 					height,
// 					lastElement.options
// 				);
// 				setElements((prev) => {
// 					const elementsCopy = [...prev];
// 					elementsCopy[prev.length - 1] = {
// 						...elementsCopy[prev.length - 1],
// 						x,
// 						y,
// 						width,
// 						height,
// 						type: "rectangle",
// 						element: updatedRectangle,
// 					};
// 					return elementsCopy;
// 				});
// 			} else if (selectedTool === "Circle") {
// 				const [width, height] = [
// 					Math.abs(offsetX - panOffset.x - x),
// 					Math.abs(offsetY - panOffset.y - y),
// 				];
// 				const [xCenter, yCenter] = [
// 					(offsetX - panOffset.x + x) / 2,
// 					(offsetY - panOffset.y + y) / 2,
// 				];
// 				const updatedEllipse = generator.ellipse(
// 					xCenter,
// 					yCenter,
// 					width,
// 					height,
// 					lastElement.options
// 				);
// 				setElements((prev) => {
// 					const elementsCopy = [...prev];
// 					elementsCopy[prev.length - 1] = {
// 						...elementsCopy[prev.length - 1],
// 						xCenter,
// 						yCenter,
// 						width,
// 						height,
// 						type: "ellipse",
// 						element: updatedEllipse,
// 					};
// 					return elementsCopy;
// 				});
// 			}
// 		} else if (action.current === "move") {
// 			const { offsetX, offsetY } = event.nativeEvent;
// 			const [cursorX, cursorY] = [
// 				offsetX - panOffset.x,
// 				offsetY - panOffset.y,
// 			];

// 			const movedElement = moveElement(
// 				selectedElement,
// 				dragOffset,
// 				{ cursorX, cursorY },
// 				generator
// 			);

// 			setSelectedElement((prev) => {
// 				return {
// 					...prev,
// 					...movedElement,
// 				};
// 			});

// 			setElements((prev) =>
// 				prev.map((el) => {
// 					if (!(el.id === selectedElement.id)) return el;
// 					return {
// 						...selectedElement,
// 						...movedElement,
// 					};
// 				})
// 			);
// 		} else if (action.current === "pan") {
// 			event.target.style.cursor = "grabbing";
// 			const { x, y } = lastPos.current;
// 			lastPos.current = { x: offsetX, y: offsetY };
// 			setPanOffset((prev) => ({
// 				x: prev.x + (offsetX - x),
// 				y: prev.y + (offsetY - y),
// 			}));
// 		}
// 	}

// 	function handleMouseUp(event) {
// 		// allow clicking the toolbar
// 		setToolbarEvents(true);

// 		if (action.current === "draw") {
// 			const lastElement = elements[elements.length - 1];
// 			const [x, y] =
// 				lastElement.type === "line"
// 					? [lastElement.x1, lastElement.y1]
// 					: [lastElement.x, lastElement.y];
// 			const { offsetX, offsetY } = event.nativeEvent;

// 			// adjust shape coordinates to maintain consistent behaviour, regardless of the direction
// 			adjustElementCoordinates(
// 				lastElement,
// 				{ x, y },
// 				{
// 					offsetX: offsetX - panOffset.x,
// 					offsetY: offsetY - panOffset.y,
// 				},
// 				setElements,
// 				generator
// 			);

// 			// delete shapes that has the same start and end point
// 			if (selectedTool !== "Text") {
// 				if (elements.length > 0) {
// 					const [x, y] =
// 						lastElement.type === "line"
// 							? [lastElement.x1, lastElement.y1]
// 							: [lastElement.x, lastElement.y];
// 					if (x === offsetX && y === offsetY) {
// 						setElements((prev) => prev.slice(0, prev.length - 1));
// 					}
// 				}
// 			}
// 		}

// 		// change cursor
// 		if (event.button === 2) {
// 			event.target.style.cursor = "default";
// 		}
// 		action.current = "none";
// 	}

// 	function handleSelectionMouseDown(corner) {
// 		action.current = "resize";
// 		const handleResizing = (event) => {
// 			if (action.current === "resize") {
// 				const { clientX, clientY } = event;
// 				const resizedElement = resizeElementCoords(
// 					clientX - panOffset.x,
// 					clientY - panOffset.y,
// 					selectedElement,
// 					corner,
// 					selectedElement.options
// 				);
// 				setSelectedElement(resizedElement);
// 				setElements((prev) =>
// 					prev.map((el) => {
// 						if (el.id !== resizedElement.id) return el;
// 						return resizedElement;
// 					})
// 				);
// 			}
// 		};

// 		const stopResizing = () => {
// 			action.current = "none";
// 			setSelectedElement((prev) => {
// 				const element = adjustElementCoords(
// 					prev,
// 					selectedElement.options
// 				);
// 				setElements((prev) =>
// 					prev.map((el) => {
// 						if (el.id !== element.id) return el;
// 						return element;
// 					})
// 				);
// 				return element;
// 			});
// 			window.removeEventListener("mousemove", handleResizing);
// 			window.removeEventListener("mouseup", stopResizing);
// 		};

// 		window.addEventListener("mousemove", handleResizing);
// 		window.addEventListener("mouseup", stopResizing);
// 	}

// 	return (
// 		<>
// 			<Toolbar
// 				selectedTool={selectedTool}
// 				pointerEvents={toolbarEvents}
// 				setSelectedTool={setSelectedTool}
// 				resetSelectedDetails={() => {
// 					setIsTyping(false);
// 					setSelectedElement(null);
// 					dragOffset.current = {};
// 				}}
// 			/>
// 			<FillTool
// 				onClick={() => {
// 					setIsTyping(false);
// 					dragOffset.current = {};
// 				}}
// 				pointerEvents={toolbarEvents}
// 				selectedFillColor={fillColor}
// 				selectedFillStyle={fillStyle}
// 				setSelectedFillColor={(color) => {
// 					if (selectedElement !== null) {
// 						const newElement = changeFill(
// 							selectedElement,
// 							color,
// 							fillStyle
// 						);
// 						setSelectedElement(newElement);
// 						setElements((prev) =>
// 							prev.map((el) => {
// 								if (el.id !== newElement.id) return el;
// 								return newElement;
// 							})
// 						);
// 					}
// 					setFillColor(color);
// 				}}
// 				setSelectedFillStyle={(style) => {
// 					if (selectedElement !== null) {
// 						const newElement = changeFill(
// 							selectedElement,
// 							fillColor,
// 							style
// 						);
// 						setSelectedElement(newElement);
// 						setElements((prev) =>
// 							prev.map((el) => {
// 								if (el.id !== newElement.id) return el;
// 								return newElement;
// 							})
// 						);
// 					}
// 					setFillStyle(style);
// 				}}
// 			/>
// 			<canvas
// 				ref={canvasRef}
// 				width={window.innerWidth}
// 				height={window.innerHeight}
// 				onMouseUp={handleMouseUp}
// 				onMouseMove={handleMouseMove}
// 				onMouseDown={handleMouseDown}
// 				onContextMenu={(e) => e.preventDefault()}
// 				className="absolute bg-paper"
// 			/>
// 			{isTyping && (
// 				<div
// 					style={{
// 						fontSize: fontSizeInPixels,
// 						top: elements[elements.length - 1].y + panOffset.y,
// 						left: elements[elements.length - 1].x + panOffset.x,
// 					}}
// 					className="grid absolute leading-[1.3] font-caveat after:content-[attr(data-replicated-value)_'_'] after:whitespace-pre-wrap after:invisible after:row-start-1 after:col-start-1 after:row-end-2 after:col-end-2 after:font-[inherit] after:leading-[inherit] after:tracking-[inherit] after:[padding:inherit]"
// 				>
// 					<textarea
// 						rows={1}
// 						cols={1}
// 						className="bg-transparent z-20 p-0 overflow-hidden resize-none border-none outline-none row-start-1 col-start-1 row-end-2 col-end-2 font-[inherit] leading-[inherit] tracking-[inherit]"
// 						autoFocus
// 						onChange={(e) => {
// 							e.target.parentNode.dataset.replicatedValue =
// 								e.target.value;
// 							const { width, height } =
// 								e.target.getBoundingClientRect();
// 							setElements((prev) => {
// 								const elementsCopy = [...prev];
// 								const currentText = prev[prev.length - 1];
// 								if (currentText.type !== "text")
// 									return elementsCopy;
// 								elementsCopy[prev.length - 1] = {
// 									...currentText,
// 									width,
// 									height,
// 									value: e.target.value,
// 								};
// 								return elementsCopy;
// 							});
// 						}}
// 					/>
// 				</div>
// 			)}
// 			{selectedElement !== null && (
// 				<SelectionBox
// 					canvasRef={canvasRef}
// 					panOffset={panOffset}
// 					element={selectedElement}
// 					onMouseUp={handleMouseUp}
// 					onMouseDown={handleSelectionMouseDown}
// 				/>
// 			)}
// 		</>
// 	);
// }

export default function App() {
	const [elements, setElements] = useState([]);
	const [isTyping, setIsTyping] = useState(false);
	const [fillColor, setFillColor] = useState(null);
	const [fillStyle, setFillStyle] = useState("none");
	const [toolbarEvents, setToolbarEvents] = useState(true);
	const [selectedTool, setSelectedTool] = useState("Select");
	const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
	const [selectedElement, setSelectedElement] = useState(null);
	const canvasInternalsRef = useRef({
		roughCanvas: null,
		canvasContext: null,
	});
	const dragOffset = useRef({});
	const action = useRef("none");
	const canvasRef = useRef(null);
	const lastPos = useRef({ x: null, y: null });

	// map keys to change tools
	// useEffect(() => {
	// 	if (action.current === "none") {
	// 		const mapKeyToTool = (key) => {
	// 			switch (key) {
	// 				case "v":
	// 					return "Select";
	// 				case "o":
	// 					return "Circle";
	// 				case "r":
	// 					return "Rectangle";
	// 				case "l":
	// 					return "Line";
	// 				case "t":
	// 					return "Text";
	// 			}
	// 		};
	// 		const changeSelectedTool = (event) => {
	// 			if (!isTyping) {
	// 				const mappedTool = mapKeyToTool(event.key);
	// 				if (
	// 					mappedTool !== selectedTool &&
	// 					mappedTool !== undefined
	// 				) {
	// 					setSelectedElement(null);
	// 					dragOffset.current = {};
	// 					setSelectedTool(mappedTool);
	// 				}
	// 			}
	// 		};
	// 		window.addEventListener("keydown", changeSelectedTool);
	// 		return () =>
	// 			window.removeEventListener("keydown", changeSelectedTool);
	// 	}
	// }, [selectedTool, isTyping]);

	// delete selected element on backspace
	useEffect(() => {
		const deleteElement = (element) => {
			setElements((prev) => prev.filter((el) => el.id !== element.id));
		};

		const deleteSelectedElementOnBackspace = (event) => {
			if (event.key === "Backspace" && selectedElement !== null) {
				deleteElement(selectedElement);
				dragOffset.current = {};
				setSelectedElement(null);
			}
		};

		window.addEventListener("keydown", deleteSelectedElementOnBackspace);

		return () =>
			window.removeEventListener(
				"keydown",
				deleteSelectedElementOnBackspace
			);
	}, [selectedElement]);

	// change cursor when tool changes
	useLayoutEffect(() => {
		if (selectedTool === "Select") {
			canvasRef.current.style.cursor = "default";
		} else {
			canvasRef.current.style.cursor = "crosshair";
		}
	}, [selectedTool]);

	// drawing logic
	useLayoutEffect(() => {
		// to avoid initialing context and roughCanvas when elements change
		if (
			!canvasInternalsRef.current.roughCanvas ||
			!canvasInternalsRef.current.canvasContext
		) {
			canvasInternalsRef.current = {
				roughCanvas: rough.canvas(canvasRef.current),
				canvasContext: canvasRef.current.getContext("2d"),
			};
		}

		// clear and re-draw canvas
		const { roughCanvas, canvasContext } = canvasInternalsRef.current;
		clearCanvas(canvasRef, canvasContext);
		canvasContext.save();
		canvasContext.translate(panOffset.x, panOffset.y);
		drawCanvas(canvasContext, roughCanvas, elements, {
			fontSizeInPixels,
			fontSizeInNumber,
		});
		canvasContext.restore();
	}, [elements, panOffset]);

	function handleMouseDown(event) {
		event.preventDefault();
		const [x, y] = screenToWorld(
			event.nativeEvent.offsetX,
			event.nativeEvent.offsetY,
			panOffset
		);
		const options = { ...roughOptions, seed: generateSeed() };

		// disable clicking to toolbar (to allow drawing shapes beneath the toolbar)
		if (selectedTool !== "Text") setToolbarEvents(false);

		switch (selectedTool) {
			case "Select": {
				if (event.button === 0) {
					if (selectedElement === null) {
						const element = [...elements]
							.reverse()
							.find((el) => getElementAtPosition(x, y, el));
						if (element === undefined) {
							// reset selected details
							setSelectedElement(null);
							dragOffset.current = {};
						} else {
							action.current = "move";
							if (
								["rectangle", "ellipse"].includes(element.type)
							) {
								setFillColor(element.options.fill);
								setFillStyle(element.options.fillStyle);
							}
							setSelectedElement(element);
							dragOffset.current = findDragOffset(
								{
									cursorX: x,
									cursorY: y,
								},
								element
							);
						}
					} else {
						const isCursorOnSelectedElement = cursorWithinElement(
							x,
							y,
							selectedElement
						);
						if (isCursorOnSelectedElement) {
							action.current = "move";
							dragOffset.current = findDragOffset(
								{
									cursorX: x,
									cursorY: y,
								},
								selectedElement
							);
						} else {
							const element = [...elements]
								.reverse()
								.find((el) => getElementAtPosition(x, y, el));
							if (element === undefined) {
								// reset selected details
								setSelectedElement(null);
								dragOffset.current = {};
							} else {
								action.current = "move";
								if (
									["rectangle", "ellipse"].includes(
										element.type
									)
								) {
									setFillColor(element.options.fill);
									setFillStyle(element.options.fillStyle);
								}
								setSelectedElement(element);
								dragOffset.current = findDragOffset(
									{
										cursorX: x,
										cursorY: y,
									},
									element
								);
							}
						}
					}
				} else if (event.button === 2) {
					action.current = "pan";
					const { offsetX, offsetY } = event.nativeEvent;
					lastPos.current = { x: offsetX, y: offsetY };
					event.target.style.cursor = "grabbing";
				}
				break;
			}
			case "Text": {
				if (!isTyping) {
					setIsTyping(true);
					createElement({ x, y, options, type: "text" }, setElements);
				} else {
					setIsTyping(false);
					setSelectedTool("Select");

					// Delete text with empty string
					const lastElement = elements[elements.length - 1];
					if (
						lastElement.type === "text" &&
						lastElement.value === ""
					) {
						setElements(elements.slice(0, -1));
					}
				}
				break;
			}
			default: {
				action.current = "draw";
				const fill = fillStyle !== "none" && fillColor;
				createElement(
					{
						x,
						y,
						options: {
							...options,
							fill,
							fillStyle,
						},
						type: selectedTool.toLowerCase(),
					},
					setElements
				);
				break;
			}
		}
	}

	function handleMouseMove(event) {
		const [cursorX, cursorY] = screenToWorld(
			event.nativeEvent.offsetX,
			event.nativeEvent.offsetY,
			panOffset
		);

		if (selectedTool === "Select") {
			identifyCursor(
				cursorX,
				cursorY,
				elements,
				selectedElement,
				canvasRef.current
			);
		} else {
			event.target.style.cursor = "crosshair";
		}
		if (elements.length > 0) {
			switch (action.current) {
				case "draw": {
					const lastElement = elements[elements.length - 1];
					switch (lastElement.type) {
						case "line": {
							updateElement(
								{ ...lastElement, x2: cursorX, y2: cursorY },
								setElements
							);
							break;
						}
						case "rectangle": {
							const [width, height] = [
								cursorX - lastElement.x,
								cursorY - lastElement.y,
							];
							updateElement(
								{ ...lastElement, width, height },
								setElements
							);
							break;
						}
						case "ellipse": {
							const [width, height] = [
								cursorX - lastElement.x,
								cursorY - lastElement.y,
							];
							const [xCenter, yCenter] = [
								(cursorX + lastElement.x) / 2,
								(cursorY + lastElement.y) / 2,
							];
							updateElement(
								{
									...lastElement,
									xCenter,
									yCenter,
									width,
									height,
								},
								setElements
							);
						}
					}
					break;
				}
				case "move": {
					const movedElement = moveElement(
						selectedElement,
						dragOffset,
						{
							cursorX,
							cursorY,
						}
					);
					setSelectedElement((prev) => {
						updateElementById(prev, setElements);
						return {
							...prev,
							...movedElement,
						};
					});
					break;
				}
				case "pan": {
					event.target.style.cursor = "grabbing";
					const { x, y } = lastPos.current;
					const { offsetX, offsetY } = event.nativeEvent;
					lastPos.current = { x: offsetX, y: offsetY };
					setPanOffset((prev) => ({
						x: prev.x + (offsetX - x),
						y: prev.y + (offsetY - y),
					}));
				}
			}
		}
	}

	function handleMouseUp(event) {
		// allow clicking the toolbar
		setToolbarEvents(true);

		const lastElement = elements[elements.length - 1];
		const [cursorX, cursorY] = screenToWorld(
			event.nativeEvent.offsetX,
			event.nativeEvent.offsetY,
			panOffset
		);

		if (action.current === "draw") {
			const adjustedElement = adjustElementCoords(
				lastElement,
				lastElement.options
			);
			updateElementById(adjustedElement, setElements);
		}

		// delete shapes that has the same start and end point
		if (selectedTool !== "Text") {
			if (elements.length > 0) {
				const isLine = lastElement.type === "line";
				if (
					!isLine &&
					lastElement.x === cursorX &&
					lastElement.y === cursorY
				) {
					setElements((prev) => prev.slice(0, prev.length - 1));
				}
			}

			if (event.button === 2) {
				identifyCursor(
					cursorX,
					cursorY,
					elements,
					selectedElement,
					canvasRef.current
				);
			}

			action.current = "none";
		}

		if (selectedTool !== "Text") setSelectedTool("Select");
	}

	function handleSelectionMouseDown(corner) {
		action.current = "resize";
		const handleResizing = (event) => {
			if (action.current === "resize") {
				const [cursorX, cursorY] = screenToWorld(
					event.clientX -
						canvasRef.current.getBoundingClientRect().left,
					event.clientY -
						canvasRef.current.getBoundingClientRect().top,
					panOffset
				);
				const resizedElement = resizeElementCoords(
					cursorX,
					cursorY,
					selectedElement,
					corner,
					selectedElement.options
				);
				setSelectedElement(resizedElement);
				setElements((prev) =>
					prev.map((el) => {
						if (el.id !== resizedElement.id) return el;
						return resizedElement;
					})
				);
			}
		};

		const stopResizing = () => {
			action.current = "none";
			setSelectedElement((prev) => {
				const element = adjustElementCoords(
					prev,
					selectedElement.options
				);
				setElements((prev) =>
					prev.map((el) => {
						if (el.id !== element.id) return el;
						return element;
					})
				);
				return element;
			});
			window.removeEventListener("mousemove", handleResizing);
			window.removeEventListener("mouseup", stopResizing);
		};

		window.addEventListener("mousemove", handleResizing);
		window.addEventListener("mouseup", stopResizing);
	}

	return (
		<>
			<Toolbar
				selectedTool={selectedTool}
				pointerEvents={toolbarEvents}
				setSelectedTool={setSelectedTool}
				resetSelectedDetails={() => {
					setIsTyping(false);
					setSelectedElement(null);
					dragOffset.current = {};
				}}
			/>
			<FillTool
				onClick={() => {
					setIsTyping(false);
					dragOffset.current = {};
				}}
				pointerEvents={toolbarEvents}
				selectedFillColor={fillColor}
				selectedFillStyle={fillStyle}
				setSelectedFillColor={(color) => {
					if (selectedElement !== null) {
						const newElement = changeFill(
							selectedElement,
							color,
							fillStyle
						);
						setSelectedElement(newElement);
						setElements((prev) =>
							prev.map((el) => {
								if (el.id !== newElement.id) return el;
								return newElement;
							})
						);
					}
					setFillColor(color);
				}}
				setSelectedFillStyle={(style) => {
					if (selectedElement !== null) {
						const newElement = changeFill(
							selectedElement,
							fillColor,
							style
						);
						setSelectedElement(newElement);
						setElements((prev) =>
							prev.map((el) => {
								if (el.id !== newElement.id) return el;
								return newElement;
							})
						);
					}
					setFillStyle(style);
				}}
			/>
			<canvas
				ref={canvasRef}
				width={window.innerWidth * 2}
				height={window.innerHeight * 2}
				onMouseUp={handleMouseUp}
				onMouseMove={handleMouseMove}
				onMouseDown={handleMouseDown}
				onContextMenu={(e) => e.preventDefault()}
				className="absolute bg-paper"
			/>
			{isTyping && (
				<div
					style={{
						fontSize: fontSizeInPixels,
						top: elements[elements.length - 1].y + panOffset.y,
						left: elements[elements.length - 1].x + panOffset.x,
					}}
					className="grid absolute leading-[1.3] font-caveat after:content-[attr(data-replicated-value)_'_'] after:whitespace-pre-wrap after:invisible after:row-start-1 after:col-start-1 after:row-end-2 after:col-end-2 after:font-[inherit] after:leading-[inherit] after:tracking-[inherit] after:[padding:inherit]"
				>
					<textarea
						rows={1}
						cols={1}
						className="bg-transparent z-20 p-0 overflow-hidden resize-none border-none outline-none row-start-1 col-start-1 row-end-2 col-end-2 font-[inherit] leading-[inherit] tracking-[inherit]"
						autoFocus
						onChange={(e) => {
							e.target.parentNode.dataset.replicatedValue =
								e.target.value;
							const { width, height } =
								e.target.getBoundingClientRect();
							setElements((prev) => {
								const elementsCopy = [...prev];
								const currentText = prev[prev.length - 1];
								if (currentText.type !== "text")
									return elementsCopy;
								elementsCopy[prev.length - 1] = {
									...currentText,
									width,
									height,
									value: e.target.value,
								};
								return elementsCopy;
							});
						}}
					/>
				</div>
			)}
			{selectedElement !== null && (
				<SelectionBox
					canvasRef={canvasRef}
					panOffset={panOffset}
					element={selectedElement}
					onMouseUp={handleMouseUp}
					onMouseDown={handleSelectionMouseDown}
				/>
			)}
		</>
	);
}
