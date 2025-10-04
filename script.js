// DOM elements
const colorCountSelect = document.getElementById('colorCount');
const colorInputsContainer = document.getElementById('colorInputs');
const gradientTypeSelect = document.getElementById('gradientType');
const directionSelect = document.getElementById('direction');
const radialControls = document.getElementById('radialControls');
const radialShapeSelect = document.getElementById('radialShape');
const radialPositionSelect = document.getElementById('radialPosition');
const imageWidthInput = document.getElementById('imageWidth');
const imageHeightInput = document.getElementById('imageHeight');
const gradientDisplay = document.getElementById('gradientDisplay');
const downloadPngBtn = document.getElementById('downloadPng');
const downloadJpegBtn = document.getElementById('downloadJpeg');
const body = document.getElementById('gradient');

// Default colors
const defaultColors = ['#4DAC4D', '#3EC1B1', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'];

// Initialize the app
function init() {
    generateColorInputs();
    updateGradient();
    setupEventListeners();
}

// Generate color input fields based on selected count
function generateColorInputs() {
    const colorCount = parseInt(colorCountSelect.value);
    colorInputsContainer.innerHTML = '';
    
    for (let i = 0; i < colorCount; i++) {
        const colorInputDiv = document.createElement('div');
        colorInputDiv.className = 'color-input';
        
        const label = document.createElement('label');
        label.textContent = `Color ${i + 1}`;
        
        const input = document.createElement('input');
        input.type = 'color';
        input.value = defaultColors[i] || '#000000';
        input.className = 'color-input-field';
        
        colorInputDiv.appendChild(label);
        colorInputDiv.appendChild(input);
        colorInputsContainer.appendChild(colorInputDiv);
        
        // Add event listener to this input
        input.addEventListener('input', updateGradient);
    }
}

// Update the gradient display
function updateGradient() {
    const colorInputs = document.querySelectorAll('.color-input-field');
    const colors = Array.from(colorInputs).map(input => input.value);
    const gradientType = gradientTypeSelect.value;
    const direction = directionSelect.value;
    
    let gradient;
    
    switch(gradientType) {
        case 'linear':
            gradient = `linear-gradient(${direction}, ${colors.join(', ')})`;
            break;
        case 'radial':
            const shape = radialShapeSelect.value;
            const position = radialPositionSelect.value;
            gradient = `radial-gradient(${shape} at ${position}, ${colors.join(', ')})`;
            break;
        case 'conic':
            gradient = `conic-gradient(from ${direction}, ${colors.join(', ')})`;
            break;
        default:
            gradient = `linear-gradient(${direction}, ${colors.join(', ')})`;
    }
    
    gradientDisplay.style.background = gradient;
    body.style.background = gradient;
}

// Toggle radial controls visibility
function toggleRadialControls() {
    const gradientType = gradientTypeSelect.value;
    const directionLabel = document.querySelector('.gradient-direction-controls label');
    
    if (gradientType === 'radial') {
        radialControls.style.display = 'grid';
        directionLabel.textContent = 'Gradient Direction: (Not used for radial)';
        directionLabel.style.opacity = '0.5';
    } else if (gradientType === 'conic') {
        radialControls.style.display = 'none';
        directionLabel.textContent = 'Starting Angle:';
        directionLabel.style.opacity = '1';
    } else {
        radialControls.style.display = 'none';
        directionLabel.textContent = 'Gradient Direction:';
        directionLabel.style.opacity = '1';
    }
}

// Setup all event listeners
function setupEventListeners() {
    colorCountSelect.addEventListener('change', generateColorInputs);
    gradientTypeSelect.addEventListener('change', () => {
        toggleRadialControls();
        updateGradient();
    });
    directionSelect.addEventListener('change', updateGradient);
    radialShapeSelect.addEventListener('change', updateGradient);
    radialPositionSelect.addEventListener('change', updateGradient);
    
    // Dimension input validation
    imageWidthInput.addEventListener('input', validateDimensions);
    imageHeightInput.addEventListener('input', validateDimensions);
    
    // Preset button handlers
    document.querySelectorAll('.preset-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const width = btn.getAttribute('data-width');
            const height = btn.getAttribute('data-height');
            imageWidthInput.value = width;
            imageHeightInput.value = height;
        });
    });
    
    downloadPngBtn.addEventListener('click', () => downloadGradient('png'));
    downloadJpegBtn.addEventListener('click', () => downloadGradient('jpeg'));
}

// Validate dimension inputs
function validateDimensions() {
    const width = parseInt(imageWidthInput.value);
    const height = parseInt(imageHeightInput.value);
    
    if (width < 100) imageWidthInput.value = 100;
    if (width > 4000) imageWidthInput.value = 4000;
    if (height < 100) imageHeightInput.value = 100;
    if (height > 4000) imageHeightInput.value = 4000;
}

// Download gradient as image
function downloadGradient(format) {
    const colorInputs = document.querySelectorAll('.color-input-field');
    const colors = Array.from(colorInputs).map(input => input.value);
    const gradientType = gradientTypeSelect.value;
    const direction = directionSelect.value;
    
    // Get custom dimensions
    const width = parseInt(imageWidthInput.value);
    const height = parseInt(imageHeightInput.value);
    
    // Create a canvas element
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas size to user-specified dimensions
    canvas.width = width;
    canvas.height = height;
    
    let canvasGradient;
    
    if (gradientType === 'linear') {
        // Map direction to canvas coordinates for linear gradients
        let x0, y0, x1, y1;
        switch(direction) {
            case 'to right':
                x0 = 0; y0 = 0; x1 = canvas.width; y1 = 0;
                break;
            case 'to left':
                x0 = canvas.width; y0 = 0; x1 = 0; y1 = 0;
                break;
            case 'to bottom':
                x0 = 0; y0 = 0; x1 = 0; y1 = canvas.height;
                break;
            case 'to top':
                x0 = 0; y0 = canvas.height; x1 = 0; y1 = 0;
                break;
            case 'to bottom right':
                x0 = 0; y0 = 0; x1 = canvas.width; y1 = canvas.height;
                break;
            case 'to bottom left':
                x0 = canvas.width; y0 = 0; x1 = 0; y1 = canvas.height;
                break;
            case 'to top right':
                x0 = 0; y0 = canvas.height; x1 = canvas.width; y1 = 0;
                break;
            case 'to top left':
                x0 = canvas.width; y0 = canvas.height; x1 = 0; y1 = 0;
                break;
            case '45deg':
                x0 = 0; y0 = canvas.height; x1 = canvas.width; y1 = 0;
                break;
            case '90deg':
                x0 = 0; y0 = 0; x1 = 0; y1 = canvas.height;
                break;
            case '135deg':
                x0 = 0; y0 = 0; x1 = canvas.width; y1 = canvas.height;
                break;
            case '180deg':
                x0 = canvas.width; y0 = 0; x1 = 0; y1 = 0;
                break;
            case '225deg':
                x0 = canvas.width; y0 = canvas.height; x1 = 0; y1 = 0;
                break;
            case '270deg':
                x0 = 0; y0 = canvas.height; x1 = 0; y1 = 0;
                break;
            case '315deg':
                x0 = canvas.width; y0 = 0; x1 = 0; y1 = canvas.height;
                break;
            default:
                x0 = 0; y0 = 0; x1 = canvas.width; y1 = 0;
        }
        canvasGradient = ctx.createLinearGradient(x0, y0, x1, y1);
    } else if (gradientType === 'radial') {
        const shape = radialShapeSelect.value;
        const position = radialPositionSelect.value;
        
        // Map position to canvas coordinates
        let centerX, centerY;
        switch(position) {
            case 'center':
                centerX = canvas.width / 2; centerY = canvas.height / 2;
                break;
            case 'top':
                centerX = canvas.width / 2; centerY = 0;
                break;
            case 'bottom':
                centerX = canvas.width / 2; centerY = canvas.height;
                break;
            case 'left':
                centerX = 0; centerY = canvas.height / 2;
                break;
            case 'right':
                centerX = canvas.width; centerY = canvas.height / 2;
                break;
            case 'top left':
                centerX = 0; centerY = 0;
                break;
            case 'top right':
                centerX = canvas.width; centerY = 0;
                break;
            case 'bottom left':
                centerX = 0; centerY = canvas.height;
                break;
            case 'bottom right':
                centerX = canvas.width; centerY = canvas.height;
                break;
            default:
                centerX = canvas.width / 2; centerY = canvas.height / 2;
        }
        
        const radius = Math.max(canvas.width, canvas.height) / 2;
        canvasGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
    } else if (gradientType === 'conic') {
        // For conic gradients, we'll use a radial gradient as approximation
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = Math.max(canvas.width, canvas.height) / 2;
        canvasGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
    }
    
    // Add color stops
    colors.forEach((color, index) => {
        const stop = index / (colors.length - 1);
        canvasGradient.addColorStop(stop, color);
    });
    
    // Fill the canvas with the gradient
    ctx.fillStyle = canvasGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Convert to image and download
    const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
    const quality = format === 'jpeg' ? 0.9 : undefined;
    
    canvas.toBlob(function(blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `gradient.${format}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, mimeType, quality);
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
