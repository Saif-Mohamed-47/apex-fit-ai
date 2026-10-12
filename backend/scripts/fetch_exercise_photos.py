import urllib.request
import os
import json

EXERCISE_IMAGE_URLS = {
    "skull_crushers.jpg": "https://images.unsplash.com/photo-1530822847156-5df684ec5ee1?w=800&q=80", # Triceps extension
    "barbell_rows.jpg": "https://images.unsplash.com/photo-1603287681836-b174ce5074c2?w=800&q=80", # Bent-over row / barbell
    "seated_cable_rows.jpg": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80", # Cable row / gym gym machine
    "face_pulls.jpg": "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&q=80", # Upper back cable / rear delt
    "hammer_curls.jpg": "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&q=80", # Dumbbell curl / hammer curl
    "bulgarian_split_squat.jpg": "https://images.unsplash.com/photo-1434682881908-b43d0467b798?w=800&q=80", # Dumbbell lunge / split squat
    "leg_curls.jpg": "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&q=80", # Leg gym machine / hamstring
    "calf_raises.jpg": "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&q=80", # Standing calves / legs
    "hanging_leg_raises.jpg": "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=800&q=80", # Hanging / pull up bar abs
}

target_dir = r"c:\project\Apex Fit Ai\frontend\public\images\exercises"
os.makedirs(target_dir, exist_ok=True)

headers = {'User-Agent': 'Mozilla/5.0'}

for filename, url in EXERCISE_IMAGE_URLS.items():
    dest_path = os.path.join(target_dir, filename)
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req) as response, open(dest_path, 'wb') as out_file:
            data = response.read()
            out_file.write(data)
        print(f"Downloaded {filename}: {len(data)} bytes")
    except Exception as e:
        print(f"Error {filename}: {e}")
