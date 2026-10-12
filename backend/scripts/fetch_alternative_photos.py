import urllib.request
import os

ALTERNATIVE_IMAGES = {
    # Chest Alternatives
    "alt_db_bench.jpg": "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&q=80", # DB press
    "alt_machine_chest_press.jpg": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80", # Gym machine
    "alt_incline_smith.jpg": "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&q=80", # Incline barbell/smith
    "alt_pec_deck.jpg": "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&q=80", # Pec deck / fly machine
    "alt_db_flyes.jpg": "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&q=80", # Dumbbell flyes

    # Shoulder Alternatives
    "alt_seated_db_press.jpg": "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&q=80", # DB shoulder press
    "alt_machine_shoulder_press.jpg": "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&q=80", # Machine press
    "alt_cable_lateral_raise.jpg": "https://images.unsplash.com/photo-1530822847156-5df684ec5ee1?w=800&q=80", # Cable raise
    "alt_reverse_pec_deck.jpg": "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=800&q=80", # Rear delt fly

    # Triceps Alternatives
    "alt_overhead_triceps_db.jpg": "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&q=80", # DB overhead extension
    "alt_straight_bar_pushdown.jpg": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80", # Cable pushdown
    "alt_db_skull_crushers.jpg": "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&q=80", # DB skull crusher

    # Back Alternatives
    "alt_pullups.jpg": "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=800&q=80", # Pull up
    "alt_db_row.jpg": "https://images.unsplash.com/photo-1603287681836-b174ce5074c2?w=800&q=80", # One arm DB row
    "alt_tbar_row.jpg": "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&q=80", # T-bar row
    "alt_chest_supported_row.jpg": "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&q=80", # Supported row

    # Biceps Alternatives
    "alt_ez_bar_curl.jpg": "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&q=80", # Barbell curl
    "alt_cable_curl.jpg": "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&q=80", # Cable curl
    "alt_cable_rope_hammer.jpg": "https://images.unsplash.com/photo-1530822847156-5df684ec5ee1?w=800&q=80", # Cable hammer curl

    # Legs Alternatives
    "alt_goblet_squat.jpg": "https://images.unsplash.com/photo-1434682881908-b43d0467b798?w=800&q=80", # DB goblet squat
    "alt_leg_press.jpg": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80", # Leg press
    "alt_walking_lunges.jpg": "https://images.unsplash.com/photo-1434682881908-b43d0467b798?w=800&q=80", # Lunges
    "alt_db_rdl.jpg": "https://images.unsplash.com/photo-1603287681836-b174ce5074c2?w=800&q=80", # DB RDL
    "alt_seated_leg_curl.jpg": "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&q=80", # Seated leg curl
    "alt_seated_calf_machine.jpg": "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&q=80", # Calf machine
    "alt_cable_crunch.jpg": "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=800&q=80", # Cable crunch
    "alt_glute_bridge.jpg": "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&q=80", # Glute bridge
}

target_dir = r"c:\project\Apex Fit Ai\frontend\public\images\exercises\alternatives"
os.makedirs(target_dir, exist_ok=True)

headers = {'User-Agent': 'Mozilla/5.0'}

for filename, url in ALTERNATIVE_IMAGES.items():
    dest_path = os.path.join(target_dir, filename)
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req) as response, open(dest_path, 'wb') as out_file:
            data = response.read()
            out_file.write(data)
        print(f"Downloaded {filename}: {len(data)} bytes")
    except Exception as e:
        print(f"Error {filename}: {e}")
