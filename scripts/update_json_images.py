import json
import os

def update_json_images():
    json_path = 'data/fish-seafood.json'
    
    with open(json_path, 'r') as f:
        data = json.load(f)
        
    updated_count = 0
    for fish in data:
        # Check if an image with the fish's ID exists
        image_name = f"{fish['id']}.webp"
        image_path = f"img/{image_name}"
        
        if os.path.exists(image_path):
            # Only update if it's different or currently a placeholder
            if fish.get('photo') != image_path:
                fish['photo'] = image_path
                updated_count += 1
            
    with open(json_path, 'w') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
        
    print(f"Updated {updated_count} entries in {json_path}")

if __name__ == "__main__":
    update_json_images()
