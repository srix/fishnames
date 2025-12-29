import json
import os

FILES = ['data/fish-seafood.json', 'data/grains-pulses.json', 'data/spices.json']

def audit_file(filepath):
    print(f"\n--- {filepath} ---")
    if not os.path.exists(filepath):
        print("File not found.")
        return

    with open(filepath, 'r') as f:
        data = json.load(f)

    print(f"{'ID':<25} | {'Tags'}")
    print("-" * 45)
    for item in data:
        tags = item.get('tags', [])
        print(f"{item['id']:<25} | {tags}")

def main():
    for f in FILES:
        audit_file(f)

if __name__ == "__main__":
    main()
