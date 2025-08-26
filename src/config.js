export const fontSizeInPixels = "32px";
export const fontSizeInNumber = parseInt(fontSizeInPixels);
export const roughOptions = {
	strokeWidth: 2,
	fillWeight: 10,
	hachureGap: 20,
};

export function generateSeed() {
	return Math.ceil(Math.random() * 500);
}
