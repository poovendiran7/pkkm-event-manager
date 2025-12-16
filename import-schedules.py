#!/usr/bin/env python3
"""
Schedule Import Script for PKKM Event Manager
Imports schedule data from CSV templates into Firebase Realtime Database
"""

import csv
import json
import time
import random
from typing import Dict, List
import os

# Game ID mapping
GAME_CONFIG = {
    'futsal': {'type': 'team', 'file': 'Schedule_Template_Futsal.csv'},
    'netball': {'type': 'team', 'file': 'Schedule_Template_Netball.csv'},
    'carrom': {'type': 'individual', 'file': 'Schedule_Template_Carrom.csv'},
    'chess': {'type': 'individual', 'file': 'Schedule_Template_Chess.csv'},
    'badminton': {'type': 'mixed-doubles', 'file': 'Schedule_Template_Badminton.csv'},
    'esports': {'type': 'team', 'file': 'Schedule_Template_Esports.csv'},
    'darts': {'type': 'individual', 'file': 'Schedule_Template_Darts.csv'},
}


def generate_unique_id():
    """Generate a unique ID for each schedule entry"""
    return int(time.time() * 1000) + int(random.random() * 1000)


def parse_csv_file(file_path: str, game_id: str, game_type: str) -> List[Dict]:
    """Parse CSV file and return list of schedule objects"""
    schedules = []

    if not os.path.exists(file_path):
        print(f"⚠️  File not found: {file_path}")
        return schedules

    with open(file_path, 'r', encoding='utf-8') as file:
        reader = csv.DictReader(file)

        for row in reader:
            # Skip empty rows
            if all(not value.strip() for value in row.values()):
                continue

            schedule = {
                'id': generate_unique_id(),
                'round': row.get('Round', '').strip(),
                'time': row.get('Time', '').strip(),
                'venue': row.get('Venue', '').strip() or None,
                'notes': row.get('Notes', '').strip() or None
            }

            # Add participants based on game type
            if game_type == 'team':
                team1 = row.get('Team 1', '').strip()
                team2 = row.get('Team 2', '').strip()
                if team1 and team2:
                    schedule['team1'] = team1
                    schedule['team2'] = team2
                else:
                    # Skip if teams not specified (for TBD matches)
                    continue

            elif game_type == 'individual':
                player1 = row.get('Player 1', '').strip()
                player2 = row.get('Player 2', '').strip()
                if player1 and player2:
                    schedule['player1'] = player1
                    schedule['player2'] = player2
                else:
                    continue

            elif game_type == 'mixed-doubles':
                pair1 = row.get('Pair 1', '').strip()
                pair2 = row.get('Pair 2', '').strip()
                if pair1 and pair2:
                    schedule['pair1'] = pair1
                    schedule['pair2'] = pair2
                else:
                    continue

            schedules.append(schedule)

    return schedules


def export_to_json(schedules_data: Dict, output_file: str = 'schedules.json'):
    """Export schedules to JSON file"""
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump({'schedules': schedules_data}, f, indent=2, ensure_ascii=False)
    print(f"✅ Exported to {output_file}")


def main():
    """Main function to process all CSV files"""
    print("🏆 PKKM Event Manager - Schedule Import Tool")
    print("=" * 50)

    all_schedules = {}

    # Process each game
    for game_id, config in GAME_CONFIG.items():
        game_type = config['type']
        file_path = config['file']

        print(f"\n📋 Processing {game_id}...")
        schedules = parse_csv_file(file_path, game_id, game_type)

        if schedules:
            all_schedules[game_id] = schedules
            print(f"   ✓ Added {len(schedules)} schedule(s)")
        else:
            print(f"   ⚠️  No schedules found")

    # Export to JSON
    print("\n" + "=" * 50)
    if all_schedules:
        export_to_json(all_schedules)
        print(f"\n✅ Total schedules processed: {sum(len(s) for s in all_schedules.values())}")
        print("\n📤 Next Steps:")
        print("1. Open Firebase Console → Realtime Database")
        print("2. Click the three dots (⋮) menu → Import JSON")
        print("3. Select 'schedules.json' file")
        print("4. Confirm import")
    else:
        print("❌ No schedules found in any CSV file")
        print("\nMake sure you have:")
        print("- CSV files in the same directory")
        print("- Filled in the schedule data")
        print("- Saved the files")


def import_to_firebase():
    """
    Import directly to Firebase (requires firebase-admin)
    Uncomment and configure if you want direct import
    """
    try:
        import firebase_admin
        from firebase_admin import credentials, db

        # Initialize Firebase
        cred = credentials.Certificate('serviceAccountKey.json')
        firebase_admin.initialize_app(cred, {
            'databaseURL': 'YOUR_DATABASE_URL'  # Replace with your database URL
        })

        # Read the generated JSON
        with open('schedules.json', 'r') as f:
            data = json.load(f)

        # Upload to Firebase
        ref = db.reference('schedules')
        ref.set(data['schedules'])

        print("✅ Successfully imported to Firebase!")

    except ImportError:
        print("⚠️  firebase-admin not installed")
        print("Install with: pip install firebase-admin")
    except FileNotFoundError:
        print("⚠️  serviceAccountKey.json not found")
        print("Download from Firebase Console → Project Settings → Service Accounts")
    except Exception as e:
        print(f"❌ Error importing to Firebase: {e}")


if __name__ == '__main__':
    main()

    # Uncomment to enable direct Firebase import
    # print("\n" + "=" * 50)
    # print("🔥 Attempting direct Firebase import...")
    # import_to_firebase()
