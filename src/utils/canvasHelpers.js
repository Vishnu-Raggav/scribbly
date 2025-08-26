export function clearCanvas(canvasRef, canvasContext) {
	const { width, height } = canvasRef.current;
	canvasContext.clearRect(0, 0, width, height);

	// force clear canvas (maybe specific to firefox)
	canvasContext.fillStyle = "rgba(0,0,0,0)";
	canvasContext.fillRect(0, 0, 1, 1);
}

export function drawCanvas(canvasContext, roughCanvas, elements, fontSize) {
	const { fontSizeInPixels, fontSizeInNumber } = fontSize;
	canvasContext.font = fontSizeInPixels + " 'Patrick Hand'";
	canvasContext.textBaseline = "top";
	canvasContext.fillStyle = "black";

	elements.forEach((el) => {
		if (el.type === "text") {
			el.value.split("\n").forEach((line, index) => {
				canvasContext.fillText(
					line,
					el.x,
					el.y + index * fontSizeInNumber * 1.3 + 7
				);
			});
		} else {
			roughCanvas.draw(el.element);
		}
	});
}
