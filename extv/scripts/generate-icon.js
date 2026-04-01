#!/usr/bin/env node
/* eslint-disable no-undef */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const sizes = [
    { size: 1024, name: 'icon.png' },
    { size: 192, name: 'android-icon-foreground.png' },
    { size: 192, name: 'android-icon-background.png' },
    { size: 192, name: 'android-icon-monochrome.png' },
    { size: 180, name: 'favicon.png' },
];

const generateSVGIcon = (size, type = 'main') => {
    let fill = '#333333';
    let dotColor = '#d8522e';

    if (type === 'monochrome') {
        fill = '#000000';
        dotColor = '#000000';
    }

    const cX = Math.floor(size * 0.38);
    const cY = Math.floor(size * 0.55);
    const fontSize = Math.floor(size * 0.65);
    const dotX = Math.floor(size * 0.65);
    const dotY = Math.floor(size * 0.58);
    const dotR = Math.floor(size * 0.09);

    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="white"/>
  <text x="${cX}" y="${cY}" font-size="${fontSize}" font-weight="bold" font-family="'Bank Gothic', sans-serif" text-anchor="middle" dominant-baseline="middle" fill="${fill}">C</text>
  <circle cx="${dotX}" cy="${dotY}" r="${dotR}" fill="${dotColor}"/>
</svg>`;

    return svg;
};

const outputDir = path.join(__dirname, '../assets/images');
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

console.log('Generating app icons...');

sizes.forEach(({ size, name }) => {
    const type = name.includes('monochrome') ? 'monochrome' : 'main';
    const svg = generateSVGIcon(size, type);

    const svgPath = path.join(outputDir, `temp-${name}.svg`);
    const pngPath = path.join(outputDir, name);

    fs.writeFileSync(svgPath, svg);

    try {
        // Use sips (macOS built-in) to convert SVG to PNG
        execSync(`sips -s format png "${svgPath}" --out "${pngPath}"`, { stdio: 'pipe' });
        fs.unlinkSync(svgPath);
        console.log(`✓ Generated ${name} (${size}x${size})`);
    } catch (_e) {
        // Fallback: try using ImageMagick if available
        try {
            execSync(`convert "${svgPath}" "${pngPath}"`, { stdio: 'pipe' });
            fs.unlinkSync(svgPath);
            console.log(`✓ Generated ${name} (${size}x${size}) [ImageMagick]`);
        } catch (err) {
            console.error(`✗ Failed to generate ${name}: ${err.message}`);
        }
    }
});

console.log('\nIcon generation complete!');
