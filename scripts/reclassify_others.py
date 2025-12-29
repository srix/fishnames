import json
import os

FISH_FILE = 'data/fish-seafood.json'
GRAINS_FILE = 'data/grains-pulses.json'

# --- FISH RECLASSIFICATION ---
FRESHWATER_FISH = {
    'basa', 'pangasius', 'grass-carp', 'silver-carp', 'common-carp', 
    'rohu', 'catla', 'walking-catfish', 'climbing-perch', 'gourami', 
    'featherback', 'mahseer', 'himalayan-trout', 'tilapia', 'murrel', 'catfish'
}
# Note: Eel can be both, leaving as is for now or checking specific ID? ID is 'eel'. Leave as sea/catadromous.

# --- GRAINS RECLASSIFICATION ---
PULSES = {
    'masoor-dal', 'moong-dal', 'chana-dal', 'chickpeas', 'black-chickpeas', 
    'kidney-beans', 'black-eyed-peas', 'dried-green-peas', 'soybeans', 
    'horse-gram', 'peanut', 'groundnut', 'green-gram', 'black-gram', 
    'moth-bean', 'lima-beans', 'field-beans', 'double-beans', 'pinto-beans', 
    'white-peas', 'roasted-gram', 'besan', 'soy-chunks'
}

MILLETS = {
    'jowar', 'bajra', 'ragi', 'kodo-millet', 'barnyard-millet', 
    'little-millet', 'foxtail-millet', 'proso-millet', 
    'sorghum', 'pearl-millet', 'finger-millet',
    'jowar-flour', 'bajra-flour', 'ragi-flour'
}

# Jaggery/Tamarind/etc don't fit well. Leaving as 'cereal' (default) or 'other'? 
# Whitelist only allows: cereal, pulse, millet. 
# So 'cereal' acts as "Others" for now.

def update_fish():
    if not os.path.exists(FISH_FILE): return
    with open(FISH_FILE, 'r') as f:
        data = json.load(f)
    
    count = 0
    for item in data:
        if item['id'] in FRESHWATER_FISH:
            item['tags'] = ['freshwater']
            count += 1
            
    with open(FISH_FILE, 'w') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print(f"Updated {count} fish to freshwater.")

def update_grains():
    if not os.path.exists(GRAINS_FILE): return
    with open(GRAINS_FILE, 'r') as f:
        data = json.load(f)
    
    count = 0
    for item in data:
        updated = False
        item_id = item['id']
        current_tags = set(item.get('tags', []))
        
        if item_id in PULSES:
            # Force pulse, remove cereal/millet
            item['tags'] = ['pulse']
            updated = True
        elif item_id in MILLETS:
            # Force millet
            item['tags'] = ['millet']
            updated = True
            
        if updated:
            count += 1

    with open(GRAINS_FILE, 'w') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print(f"Updated {count} grain entries.")

def main():
    update_fish()
    update_grains()

if __name__ == "__main__":
    main()
