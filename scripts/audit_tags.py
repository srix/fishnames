import json

with open('data/vegetables-fruits.json', 'r') as f:
    data = json.load(f)

print(f"{'ID':<20} | {'Tags'}")
print("-" * 40)
for item in data:
    tags = item.get('tags', [])
    print(f"{item['id']:<20} | {tags}")
