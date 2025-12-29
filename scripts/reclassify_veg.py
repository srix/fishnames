import json
import os

FILE_PATH = 'data/vegetables-fruits.json'

# New Classifications
FRUITS = {
    'v6', 'v7', 'v8', 'v9', 'v10', # Existing IDs for Mango, Banana, Jackfruit, Pomegranate, Apple
    'papaya', 'watermelon', 'pineapple', 'guava', 'orange', 'grapes', 
    'lemon', 'amla', 'coconut', 'muskmelon', 'custard-apple', 'sapota', 
    'pear', 'plum', 'apricot', 'peach', 'lychee', 'strawberry', 'fig', 
    'wood-apple', 'ice-apple', 'star-fruit', 'passion-fruit', 'dragon-fruit', 
    'kiwi', 'mulberry', 'jamun', 'raw-mango' # Raw mango is fruit biologically
}

ROOTS = {
    'v1', 'v2', # Potato, Onion (Onion is bulb but often grouped with root/tuber in culinary context or just veg. Potato is root/tuber)
    'carrot', 'beetroot', 'radish', 'sweet-potato', 'tapioca', 
    'yam', 'colocasia', 'turnip', 'elephant-foot-yam', 'chinese-potato', 
    'purple-yam', 'arrowroot', 'mango-ginger', 'ginger', 'garlic', 'turmeric-fresh'
}

LEAFY = {
    'v4', # Spinach
    'coriander-leaves', 'mint-leaves', 'curry-leaves', 'fenugreek-leaves', 
    'mustard-greens', 'amaranth-leaves', 'agathi-keerai', 'ponnanganni-keerai', 
    'manathakkali', 'gongura', 'bathua', 'parsley', 'basil', 'lettuce', 
    'spring-onion', 'cabbage', 'red-cabbage' # Cabbage is leafy? Usually grouped as cruciferous/veg, but leafy structure.
}

# Everything else defaults to 'vegetable' (includes gourds, beans, flowers, stems)

def main():
    if not os.path.exists(FILE_PATH):
        print("File not found.")
        return

    with open(FILE_PATH, 'r', encoding='utf-8') as f:
        data = json.load(f)

    updated_count = 0
    for item in data:
        item_id = item['id']
        old_tags = set(item.get('tags', []))
        new_tags = set()

        # Check strict categories first
        if item_id in FRUITS:
            new_tags.add('fruit')
        elif item_id in ROOTS:
            new_tags.add('root')
        elif item_id in LEAFY:
            new_tags.add('leafy')
        else:
            # Default to vegetable
             new_tags.add('vegetable')
        
        # Sort for consistency
        final_tags = sorted(list(new_tags))
        
        if final_tags != sorted(list(old_tags)):
            item['tags'] = final_tags
            updated_count += 1
            # print(f"Updated {item_id}: {old_tags} -> {final_tags}")

    with open(FILE_PATH, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    print(f"✅ Reclassified {updated_count} items.")

if __name__ == "__main__":
    main()
