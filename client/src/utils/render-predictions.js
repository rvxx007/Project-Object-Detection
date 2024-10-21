export const renderPredictions = (predictions, ctx) => {
    // Clear the canvas
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Set common font properties
    const fontSize = 16; // Adjusted font size for readability
    const font = `${fontSize}px sans-serif`;
    ctx.font = font;
    ctx.textBaseline = "top";

    predictions.forEach(prediction => {
        const [x, y, width, height] = prediction.bbox;
        const label = prediction.class;
        const isPerson = label === 'person';

        // Set styles based on whether the object is a person
        ctx.strokeStyle = isPerson ? "#FF0000" : "#00FFFF";
        ctx.lineWidth = 4;
        ctx.fillStyle = `rgba(255, 0, 0, ${isPerson ? 0.2 : 0})`;

        // Draw bounding box
        ctx.strokeRect(x, y, width, height);

        // Fill box with a semi-transparent color if person
        if (isPerson) {
            ctx.fillRect(x, y, width, height);
        }

        // Draw label background
        const textWidth = ctx.measureText(label).width;
        const textHeight = fontSize; // Using fixed font size for height
        ctx.fillStyle = isPerson ? "#FF0000" : "#00FFFF";
        ctx.fillRect(x, y, textWidth + 4, textHeight + 4);

        // Draw label text
        ctx.fillStyle = "#000000"; // Set text color to black for contrast
        ctx.fillText(label, x + 2, y + 2); // Add padding to the text

        
    });
};
