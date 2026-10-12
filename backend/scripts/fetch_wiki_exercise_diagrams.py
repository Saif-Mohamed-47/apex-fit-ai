import urllib.request
import json
import os

WIKIMEDIA_FILES = {
    "alt_db_bench.png": "File:Dumbbell-bench-press-2.png",
    "alt_seated_db_press.png": "File:Dumbbell-shoulder-press-1.png",
    "alt_db_row.png": "File:Dumbbell-row-1.png",
    "alt_leg_press.jpg": "File:Leg Press 1.jpg",
    "alt_seated_leg_curl.png": "File:Seated-leg-curl-1.png",
    "alt_cable_seated_row.png": "File:Cable-seated-rows-1.png",
    "alt_biceps_curl.png": "File:Biceps-curl-1.png",
    "alt_calf_raises.png": "File:Calf-raises-1.png",
    "alt_incline_db_bench.png": "File:Incline-dumbbell-bench-press-2.png",
    "alt_pec_deck.png": "File:Pec-deck-fly-1.png",
}

target_dir = r"c:\project\Apex Fit Ai\frontend\public\images\exercises\alternatives"
os.makedirs(target_dir, exist_ok=True)

for local_name, wiki_title in WIKIMEDIA_FILES.items():
    try:
        url = f"https://commons.wikimedia.org/w/api.php?action=query&titles={urllib.parse.quote(wiki_title)}&prop=imageinfo&iiprop=url&format=json"
        req = urllib.request.Request(url, headers={'User-Agent': 'ApexFit/1.0'})
        res = urllib.request.urlopen(req)
        data = json.loads(res.read())
        pages = data.get('query', {}).get('pages', {})
        for p in pages.values():
            if 'imageinfo' in p and p['imageinfo']:
                img_url = p['imageinfo'][0]['url']
                dest = os.path.join(target_dir, local_name)
                img_req = urllib.request.Request(img_url, headers={'User-Agent': 'ApexFit/1.0'})
                with urllib.request.urlopen(img_req) as img_res, open(dest, 'wb') as f:
                    f.write(img_res.read())
                print(f"Downloaded {local_name} from {wiki_title}")
    except Exception as e:
        print(f"Error {wiki_title}: {e}")
