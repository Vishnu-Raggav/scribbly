const handleSize = 10;
const handleClass = "fill-white stroke-blue-400 stroke-2 pointer-events-auto";

export default function SelectionBox({
	element,
	panOffset,
	canvasRef,
	onMouseUp,
	onMouseDown,
}) {
	if (element.type === "line") {
		const [x1, y1] = [element.x + panOffset.x, element.y + panOffset.y];
		const [x2, y2] = [element.x2 + panOffset.x, element.y2 + panOffset.y];
		return (
			<svg
				className="absolute top-0 left-0 pointer-events-none"
				width={canvasRef.current.width}
				height={canvasRef.current.height}
			>
				<line
					className="stroke-blue-400 stroke-2"
					x1={x1}
					y1={y1}
					x2={x2}
					y2={y2}
				/>
				<rect
					x={x1 - handleSize / 2}
					y={y1 - handleSize / 2}
					width={handleSize}
					height={handleSize}
					rx={2}
					ry={2}
					className={handleClass + " cursor-pointer"}
					onMouseUp={onMouseUp}
					onMouseDown={() => {
						onMouseDown("tl");
					}}
				/>
				<rect
					x={x2 - handleSize / 2}
					y={y2 - handleSize / 2}
					width={handleSize}
					height={handleSize}
					rx={2}
					ry={2}
					className={handleClass + " cursor-pointer"}
					onMouseUp={onMouseUp}
					onMouseDown={() => {
						onMouseDown("br");
					}}
				/>
			</svg>
		);
	} else {
		let { x, y, width, height } = element;
		[x, y] = [x + panOffset.x, y + panOffset.y];
		const startX = width < 0 ? x + width : x;
		const startY = height < 0 ? y + height : y;
		const absWidth = Math.abs(width);
		const absHeight = Math.abs(height);
		return (
			<svg
				className="absolute top-0 left-0 pointer-events-none"
				width={canvasRef.current.width}
				height={canvasRef.current.height}
			>
				<rect
					x={startX}
					y={startY}
					width={absWidth}
					height={absHeight}
					className="fill-transparent stroke-blue-400 stroke-2"
				/>
				{element.type !== "text" && (
					<>
						<rect
							x={x - handleSize / 2}
							y={y - handleSize / 2}
							width={handleSize}
							height={handleSize}
							rx={2}
							ry={2}
							className={handleClass + " cursor-nw-resize"}
							onMouseUp={onMouseUp}
							onMouseDown={() => {
								onMouseDown("tl");
							}}
						/>
						<rect
							x={x - handleSize / 2}
							y={y + element.height - handleSize / 2}
							width={handleSize}
							height={handleSize}
							rx={2}
							ry={2}
							className={handleClass + " cursor-sw-resize"}
							onMouseUp={onMouseUp}
							onMouseDown={() => {
								onMouseDown("bl");
							}}
						/>
						<rect
							x={x + element.width - handleSize / 2}
							y={y - handleSize / 2}
							width={handleSize}
							height={handleSize}
							rx={2}
							ry={2}
							className={handleClass + " cursor-ne-resize"}
							onMouseUp={onMouseUp}
							onMouseDown={() => {
								onMouseDown("tr");
							}}
						/>
						<rect
							x={x + element.width - handleSize / 2}
							y={y + element.height - handleSize / 2}
							width={handleSize}
							height={handleSize}
							rx={2}
							ry={2}
							className={handleClass + " cursor-se-resize"}
							onMouseUp={onMouseUp}
							onMouseDown={() => {
								onMouseDown("br");
							}}
						/>
					</>
				)}
			</svg>
		);
	}
}
