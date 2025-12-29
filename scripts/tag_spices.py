import json
import os

FILE_PATH = 'data/spices.json'

TAG_MAP = {
    'seed': {
        'mustard-seeds', 'cumin-seeds', 'coriander-seeds', 'fennel-seeds', 
        'fenugreek-seeds', 'poppy-seeds', 'carom-seeds', 'nigella-seeds', 
        'basil-seeds', 'melon-seeds'
    },
    'aromatic': {
        'cardamom', 'black-cardamom', 'cloves', 'cinnamon', 'nutmeg', 'mace', 
        'star-anise', 'bay-leaf', 'saffron', 'kabab-chin'
    },
    'heat': {
        'black-pepper', 'white-pepper', 'long-pepper', 'dry-red-chili'
    },
    'root': {
        'dry-ginger', 'turmeric', 'galangal'
    },
    'acidic': {
        'tamarind', 'kokum'
    },
    'resin': {
        'asafetida'
    },
    'flower': {
        'stone-flower', 'marathi-moggu'
    }
}

def main():
    if not os.path.exists(FILE_PATH):
        print("File not found")
        return

    with open(FILE_PATH, 'r') as f:
        data = json.load(f)

    count = 0
    for item in data:
        item_id = item['id']
        new_tags = []
        
        # Check against all categories
        for tag, ids in TAG_MAP.items():
            if item_id in ids:
                new_tags.append(tag)
        
        # Special case: Dry Ginger is Root + Heat?
        # Map above puts it in Root. Let's add Heat if appropriate?
        # User prompt implies single categorization or meaningful tagging.
        # "Heat" is useful. "Root" is botanical.
        # Let's start with primary culinary use.
        # Ginger -> Root (or Heat). I'll stick to the map above for now. 
        # Actually dry ginger is often used for heat (saunth).
        # But consistency: Turmeric (Root).
        
        if new_tags:
            item['tags'] = sorted(new_tags)
            count += 1
        else:
            # Fallback for anything missed?
            # Verify manually if needed.
            if item['tags'] == ['spice']:
                print(f"Skipping/Missed: {item_id}")

    with open(FILE_PATH, 'w') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    
    print(f"Updated tags for {count} spices.")

if __name__ == "__main__":
    main()
