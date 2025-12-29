import json
import os

def find_missing():
    with open('data/fish-seafood.json', 'r') as f:
        data = json.load(f)
        
    missing = []
    for item in data:
        photo_path = item.get('photo', '')
        # Check if placeholder or file missing
        if 'placeholder' in photo_path or not os.path.exists(photo_path):
            missing.append(item['id'])
            
    print(f"Found {len(missing)} items needing images:")
    for m in missing:
        print(m)

if __name__ == "__main__":
    find_missing()
