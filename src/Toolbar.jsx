import { motion } from "motion/react";
import lineImg from "./assets/line.svg";
import textImg from "./assets/text.svg";
import selectImg from "./assets/select.svg";
import circleImg from "./assets/circle.svg";
import squareImg from "./assets/square.svg";

const tools = [
	["Select", selectImg],
	["Ellipse", circleImg],
	["Rectangle", squareImg],
	["Line", lineImg],
	["Text", textImg],
];

export default function Toolbar({
	selectedTool,
	pointerEvents,
	setSelectedTool,
	resetSelectedDetails,
}) {
	return (
		<div
			className="h-screen fixed z-5 flex flex-col justify-center gap-3 ml-6 select-none pointer-events-none"
			onClick={() => resetSelectedDetails()}
		>
			{tools.map((arr) => (
				<div
					key={arr[0]}
					style={{
						pointerEvents: pointerEvents ? "auto" : "none",
					}}
					className="relative w-fit grid place-items-center border-3 p-3 rounded-xl bg-paper cursor-pointer"
					onClick={() => {
						setSelectedTool(arr[0]);
					}}
				>
					{selectedTool === arr[0] && <ActiveIndicator />}
					<img src={arr[1]} className="relative size-8 z-10" />
				</div>
			))}
		</div>
	);
}

function ActiveIndicator() {
	return (
		<svg
			width="49"
			height="53"
			viewBox="0 0 49 53"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className="absolute size-full"
		>
			<motion.path
				d="M28.5254 2L12.4706 16.84L28.5254 8.39333L13.1221 22.6267L38.5305 7.27333L2.00003 37.6533L47 9.65333L12.4706 36.8133L38.5305 23.7467L17.3568 41.9L36.9949 30.6533L24.3372 51"
				stroke="#ADD8E6"
				strokeWidth="5"
				initial={{ pathLength: 0 }}
				animate={{ pathLength: 1 }}
			/>
		</svg>
	);
}
