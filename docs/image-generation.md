# Image Generation Documentation

This document captures the technique used to generate photo-realistic images for the FoodBhasha application.

## Overview

All images are generated as 2x2 grids using AI image generation, then sliced into individual 400x400 WebP images. This approach optimizes the generation process while maintaining consistent quality.

## Generation Process

### 1. Image Generation
- **Tool**: Gemini 3 Pro Image model via `generate_image` API
- **Format**: 2x2 grid layout
- **Style**: Photo-realistic, real-life photographs
- **Background**: White background for consistency
- **Output**: PNG files saved to artifacts directory

### 2. Grid Slicing
- **Script**: `scripts/process_grid.py`
- **Method**: Crops 2x2 grid into 4 individual images
- **Processing**: 
  - Top-Left → Image 1
  - Top-Right → Image 2
  - Bottom-Left → Image 3
  - Bottom-Right → Image 4
- **Resize**: Each slice resized to 400x400 pixels
- **Output Format**: WebP (optimized for web)
- **Output Location**: `img/` directory with descriptive filename (e.g., `potato.webp`)

### 3. Data Integration
- **Script**: `scripts/update_json_images.py`
- **Function**: Links generated images to JSON data by matching IDs
- **Updates**: `data/fish-seafood.json`, `data/vegetables-fruits.json`, `data/grains-pulses.json`

## Prompt Templates

### Fish & Seafood
```
A 2x2 grid of real-life, high-resolution photographs of fresh Indian fish/seafood on a white background. No text.
Top-Left: [Fish Name] ([Distinctive features])
Top-Right: [Fish Name] ([Distinctive features])
Bottom-Left: [Fish Name] ([Distinctive features])
Bottom-Right: [Fish Name] ([Distinctive features])
```

**Example:**
```
A 2x2 grid of real-life, high-resolution photographs of fresh Indian fish on a white background. No text.
Top-Left: Skipjack Tuna (Dark stripes on belly).
Top-Right: Bonito (Striped, similar to tuna).
Bottom-Left: Turbot (Flatfish, diamond-shaped).
Bottom-Right: Flounder (Flatfish, both eyes on one side).
```

### Vegetables & Fruits
```
A 2x2 grid of real-life, high-resolution photographs of fresh Indian vegetables/fruits on a white background. No text.
Top-Left: [Vegetable Name] ([Color, shape, characteristics])
Top-Right: [Vegetable Name] ([Color, shape, characteristics])
Bottom-Left: [Vegetable Name] ([Color, shape, characteristics])
Bottom-Right: [Vegetable Name] ([Color, shape, characteristics])
```

**Example:**
```
A 2x2 grid of real-life, high-resolution photographs of fresh Indian vegetables on a white background. No text.
Top-Left: Potato (Brown, starchy tuber).
Top-Right: Onion (Purple/red bulb).
Bottom-Left: Tomato (Red, round).
Bottom-Right: Spinach (Green leafy vegetable).
```

### Grains & Pulses
```
A 2x2 grid of real-life, high-resolution photographs of Indian grains/pulses on a white background. No text.
Top-Left: [Grain Name] ([Color, texture, form])
Top-Right: [Grain Name] ([Color, texture, form])
Bottom-Left: [Grain Name] ([Color, texture, form])
Bottom-Right: [Grain Name] ([Color, texture, form])
```

## Key Principles

### Photo-Realistic Style
- **Critical**: Always request "real-life, high-resolution photographs"
- **Avoid**: "illustrations", "drawings", or "artistic renderings"
- **Rationale**: Users expect to see actual food items, not stylized versions

### Descriptive Features
- Include distinctive visual characteristics in prompts
- Helps the AI generate more accurate representations
- Examples: color, texture, shape, unique features

### White Background
- Ensures consistency across all images
- Makes items stand out clearly
- Easier to integrate into various UI designs

### No Text
- Always specify "No text" in prompts
- Prevents unwanted labels or watermarks
- Keeps images clean and professional

## Regeneration Guide

### For Different Sizes
1. Modify `scripts/process_grid.py`:
   ```python
   # Change this line (currently 400x400)
   img_resized = img.resize((NEW_SIZE, NEW_SIZE), Image.Resampling.LANCZOS)
   ```
2. Re-run grid slicing on existing grid images
3. Update `scripts/update_json_images.py` if paths change

### For Different Styles
1. **Update prompt template**:
   - Replace "real-life, high-resolution photographs" with desired style
   - Examples: "watercolor paintings", "line drawings", "3D renders"
2. **Add style-specific descriptors**:
   - E.g., "vibrant colors", "minimalist", "detailed textures"
3. **Test with single batch** before bulk generation
4. **Maintain consistency** within each category

### For Different Output Format
1. Modify `scripts/process_grid.py`:
   ```python
   # Change format parameter
   img_resized.save(output_path, 'JPEG', quality=95)  # Instead of WebP
   ```
2. Update file extensions in `scripts/update_json_images.py`
3. Update image references throughout application

## Batch Organization

Images were generated in batches of 4 (one 2x2 grid per batch):
- **Fish Batches**: 1-9 (initial), A-R (remaining) = 66 total fish images
- **Vegetable Batches**: A-H (partial) = 32 vegetable images  
- **Grain Batches**: Manual import = 53 grain images

## Rate Limits & Troubleshooting

### Rate Limit Handling
- **Error**: 429 Too Many Requests
- **Causes**: 
  - `MODEL_CAPACITY_EXHAUSTED`: Temporary server capacity issue (retry after ~1 minute)
  - `QUOTA_EXHAUSTED`: Daily/hourly quota exceeded (wait for reset)
- **Strategy**: Generate in batches with delays between requests

### Quality Issues
- If images don't match expectations:
  - Refine descriptive features in prompt
  - Add more specific visual details
  - Test individual items before batch generation

## File Naming Convention

All images use descriptive IDs matching JSON data:
- ✅ Good: `potato.webp`, `rohu.webp`, `toor-dal.webp`
- ❌ Bad: `v1.webp`, `img001.webp`, `food-item.webp`

## Scripts Reference

- **`scripts/process_grid.py`**: Slices 2x2 grids into individual images
- **`scripts/update_json_images.py`**: Links images to JSON data
- **`scripts/find_missing_images.py`**: Identifies items without images
- **`scripts/rename_veg_ids.py`**: Renames generic IDs to descriptive ones
- **`scripts/generate_sitemap.py`**: Regenerates sitemap from current data

## Future Improvements

Potential enhancements for future iterations:
- Automated batch generation script
- Quality validation checks
- Alternative view angles (top, side, cut)
- Seasonal variations for fruits/vegetables
- Size comparison references
