const fillColors = [
	"#ffadad",
	"#ffd6a5",
	"#fdffb6",
	"#caffbf",
	"#9bf6ff",
	"#a0c4ff",
	"#ffc6ff",
];

const fillStyle = [
	["#fdfbf6", "none"],
	["#fdfbf6", "zigzag"],
	["black", "solid"],
];

export default function FillTool({
	onClick,
	pointerEvents,
	selectedFillColor,
	selectedFillStyle,
	setSelectedFillColor,
	setSelectedFillStyle,
}) {
	return (
		<div
			onClick={onClick}
			className="fixed z-1 w-screen h-fit mt-6 flex justify-center items-center gap-3 pointer-events-none"
		>
			{fillColors.map((color) => (
				<div
					key={color}
					style={{
						backgroundColor: color,
						pointerEvents: pointerEvents ? "auto" : "none",
					}}
					className="grid place-items-center size-5 rounded-sm border-3 cursor-pointer"
					onClick={() => setSelectedFillColor(color)}
				>
					{selectedFillColor === color && (
						<div className="rounded-full bg-black size-2" />
					)}
				</div>
			))}
			<hr className="h-4 border-1 pointer-events-none" />
			{fillStyle.map((arr, index) => {
				return index === 1 ? (
					<div
						key={index}
						style={{
							backgroundColor: arr[0],
							pointerEvents: pointerEvents ? "auto" : "none",
						}}
						className="size-5 rounded-sm border-3 grid place-items-center cursor-pointer"
						onClick={() => setSelectedFillStyle(arr[1])}
					>
						<svg
							className="absolute"
							width="14"
							height="14"
							viewBox="0 0 19 18"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<line
								x1="0"
								y1="8"
								x2="8"
								y2="0"
								stroke="black"
								strokeWidth={2}
							/>
							<line
								x1="0"
								y1="16"
								x2="16"
								y2="0"
								stroke="black"
								strokeWidth={2}
							/>
							<line
								x1="0"
								y1="24"
								x2="24"
								y2="0"
								stroke="black"
								strokeWidth={2}
							/>
							<line
								x1="0"
								y1="32"
								x2="32"
								y2="0"
								stroke="black"
								strokeWidth={2}
							/>
						</svg>
						{selectedFillStyle === arr[1] && (
							<div className="rounded-full bg-black size-2" />
						)}
					</div>
				) : (
					<div
						key={index}
						style={{
							backgroundColor: arr[0],
							pointerEvents: pointerEvents ? "auto" : "none",
						}}
						className="grid place-items-center size-5 rounded-sm border-3 cursor-pointer"
						onClick={() => setSelectedFillStyle(arr[1])}
					>
						{selectedFillStyle === arr[1] && (
							<div
								style={{
									backgroundColor:
										arr[0] === "black" ? "white" : "black",
								}}
								className="rounded-full size-2"
							/>
						)}
					</div>
				);
			})}
		</div>
	);
}
