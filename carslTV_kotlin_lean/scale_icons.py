#!/usr/bin/env python3
from PIL import Image, ImageDraw
import os

# Create the carslTV logo (dark C with red circle)
def create_logo(size):
    # Create a transparent background
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Draw dark gray 'C' shape
    # C is drawn as an arc (circle with gap)
    margin = size * 0.1
    bbox = [margin, margin, size - margin, size - margin]
    
    # Draw arc (C shape) in dark gray (60, 60, 60)
    draw.arc(bbox, 45, 315, fill=(60, 60, 60), width=int(size * 0.15))
    
    # Draw red circle on the right
    circle_radius = size * 0.12
    circle_x = size * 0.75
    circle_y = size * 0.65
    circle_bbox = [
        circle_x - circle_radius,
        circle_y - circle_radius,
        circle_x + circle_radius,
        circle_y + circle_radius
    ]
    draw.ellipse(circle_bbox, fill=(220, 72, 51))  # Red/orange color
    
    return img

# Android densities
densities = {
    'mdpi': 48,
    'hdpi': 72,
    'xhdpi': 96,
    'xxhdpi': 144,
    'xxxhdpi': 192,
}

base_res_path = r"C:\Users\OluwaMayowa\Desktop\carslTV\app\src\main\res"

# Scale and save to mipmap folders
print("Generating carslTV logo for all Android densities...")
for density, size in densities.items():
    mipmap_dir = os.path.join(base_res_path, f'mipmap-{density}')
    
    # Create the logo at this size
    logo_img = create_logo(size)
    
    # Save as PNG
    output_path = os.path.join(mipmap_dir, 'ic_launcher.png')
    logo_img.save(output_path, 'PNG')
    print(f"✓ Saved: {output_path} ({size}x{size})")
    
    # Save as webp
    output_webp = os.path.join(mipmap_dir, 'ic_launcher.webp')
    logo_img.save(output_webp, 'WEBP')

# Also save to drawable folder as app_icon_your_company.png (512x512)
drawable_dir = os.path.join(base_res_path, 'drawable')
drawable_size = 512
drawable_img = create_logo(drawable_size)
drawable_path = os.path.join(drawable_dir, 'app_icon_your_company.png')
drawable_img.save(drawable_path, 'PNG')
print(f"✓ Saved: {drawable_path} ({drawable_size}x{drawable_size})")

print("\n✓ All carslTV icons have been generated and updated!")
