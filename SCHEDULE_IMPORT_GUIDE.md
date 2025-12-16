# Schedule Import Guide

This guide explains how to use the Excel/Google Sheets template to pre-create schedules and import them into Firebase.

## Template File

**File:** `Schedule_Template.csv`

You can open this file in:
- Microsoft Excel
- Google Sheets (File → Import)
- LibreOffice Calc
- Any spreadsheet application

## Column Definitions

| Column | Description | Required | Example Values |
|--------|-------------|----------|----------------|
| **Game ID** | Unique identifier for the game | ✅ Yes | `football`, `basketball`, `badminton-singles-men`, `badminton-singles-women`, `badminton-mixed-doubles`, `carrom`, `chess` |
| **Game Type** | Type of game format | ✅ Yes | `team`, `singles`, `mixed-doubles` |
| **Team/Player 1** | First team or player name | ✅ Yes (for team/singles) | `Team Red`, `John Doe` |
| **Team/Player 2** | Second team or player name | ✅ Yes (for team/singles) | `Team Blue`, `Jane Smith` |
| **Pair 1** | First pair (for doubles only) | ✅ Yes (for mixed-doubles) | `John & Jane` |
| **Pair 2** | Second pair (for doubles only) | ✅ Yes (for mixed-doubles) | `Mike & Sarah` |
| **Round** | Match round/stage | ✅ Yes | `Group A - Match 1`, `Quarter Final 1`, `Semifinal 1`, `Final` |
| **Time** | Match scheduled time | ✅ Yes | `2:00 PM`, `14:00`, `9:30 AM` |
| **Venue** | Match location | Optional | `Main Ground`, `Court 1`, `Hall A` |
| **Notes** | Additional information | Optional | `Opening match`, `Best of 3` |

## Valid Game IDs

Use these exact values (case-sensitive):

1. `football` - Team sport
2. `basketball` - Team sport
3. `badminton-singles-men` - Singles sport
4. `badminton-singles-women` - Singles sport
5. `badminton-mixed-doubles` - Mixed doubles
6. `carrom` - Team sport
7. `chess` - Singles sport

## Game Type Rules

- **team**: Use `Team/Player 1` and `Team/Player 2` columns
- **singles**: Use `Team/Player 1` and `Team/Player 2` columns (enter player names)
- **mixed-doubles**: Use `Pair 1` and `Pair 2` columns (leave Team/Player columns empty)

## Round Naming Conventions

### Group Stage
- `Group A - Match 1`
- `Group A - Match 2`
- `Group B - Match 1`

### Knockout Stage
- `Quarter Final 1`, `Quarter Final 2`, `Quarter Final 3`, `Quarter Final 4`
- `Semifinal 1`, `Semifinal 2`
- `3rd-4th Placing`
- `Final`

## How to Import to Firebase

### Option 1: Manual Import via Firebase Console (Recommended for Small Data)

1. **Open Firebase Console**
   - Go to https://console.firebase.google.com/
   - Select your project

2. **Navigate to Realtime Database**
   - Click "Realtime Database" in the left sidebar
   - Click the "Data" tab

3. **Convert CSV to JSON**
   - Use a CSV to JSON converter (online tool or script below)
   - Structure should be: `{ "schedules": { "gameId": [ {...}, {...} ] } }`

4. **Import JSON**
   - Click the three dots (⋮) menu
   - Select "Import JSON"
   - Upload your converted file

### Option 2: Using Firebase Admin Script (Recommended for Large Data)

Create a file `import-schedules.js`:

```javascript
const admin = require('firebase-admin');
const fs = require('fs');
const csv = require('csv-parser');

// Initialize Firebase Admin
const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'YOUR_DATABASE_URL'
});

const db = admin.database();
const schedules = {};

// Read CSV file
fs.createReadStream('Schedule_Template.csv')
  .pipe(csv())
  .on('data', (row) => {
    const gameId = row['Game ID'];
    const gameType = row['Game Type'];

    if (!schedules[gameId]) {
      schedules[gameId] = [];
    }

    const schedule = {
      id: Date.now() + Math.random(), // Generate unique ID
      round: row['Round'],
      time: row['Time'],
      venue: row['Venue'] || null,
      notes: row['Notes'] || null
    };

    // Add participants based on game type
    if (gameType === 'team') {
      schedule.team1 = row['Team/Player 1'];
      schedule.team2 = row['Team/Player 2'];
    } else if (gameType === 'singles') {
      schedule.player1 = row['Team/Player 1'];
      schedule.player2 = row['Team/Player 2'];
    } else if (gameType === 'mixed-doubles') {
      schedule.pair1 = row['Pair 1'];
      schedule.pair2 = row['Pair 2'];
    }

    schedules[gameId].push(schedule);
  })
  .on('end', async () => {
    console.log('CSV file processed. Uploading to Firebase...');

    try {
      await db.ref('schedules').set(schedules);
      console.log('✅ Schedules imported successfully!');
      process.exit(0);
    } catch (error) {
      console.error('❌ Error importing schedules:', error);
      process.exit(1);
    }
  });
```

**To run:**
```bash
npm install firebase-admin csv-parser
node import-schedules.js
```

### Option 3: Using Python Script

Create a file `import-schedules.py`:

```python
import csv
import json
import firebase_admin
from firebase_admin import credentials, db
import time
import random

# Initialize Firebase
cred = credentials.Certificate('serviceAccountKey.json')
firebase_admin.initialize_app(cred, {
    'databaseURL': 'YOUR_DATABASE_URL'
})

schedules = {}

# Read CSV file
with open('Schedule_Template.csv', 'r', encoding='utf-8') as file:
    reader = csv.DictReader(file)

    for row in reader:
        game_id = row['Game ID']
        game_type = row['Game Type']

        if game_id not in schedules:
            schedules[game_id] = []

        schedule = {
            'id': int(time.time() * 1000) + int(random.random() * 1000),
            'round': row['Round'],
            'time': row['Time'],
            'venue': row['Venue'] if row['Venue'] else None,
            'notes': row['Notes'] if row['Notes'] else None
        }

        # Add participants based on game type
        if game_type == 'team':
            schedule['team1'] = row['Team/Player 1']
            schedule['team2'] = row['Team/Player 2']
        elif game_type == 'singles':
            schedule['player1'] = row['Team/Player 1']
            schedule['player2'] = row['Team/Player 2']
        elif game_type == 'mixed-doubles':
            schedule['pair1'] = row['Pair 1']
            schedule['pair2'] = row['Pair 2']

        schedules[game_id].append(schedule)

# Upload to Firebase
ref = db.reference('schedules')
ref.set(schedules)
print('✅ Schedules imported successfully!')
```

**To run:**
```bash
pip install firebase-admin
python import-schedules.py
```

## Example Schedule Data

### Football (Team Sport)
```csv
football,team,Team Red,Team Blue,,,Group A - Match 1,2:00 PM,Main Ground,
football,team,Team Green,Team Yellow,,,Group A - Match 2,3:00 PM,Main Ground,
```

### Badminton Singles (Singles)
```csv
badminton-singles-men,singles,John Doe,Mike Smith,,,Quarter Final 1,9:00 AM,Court A,
badminton-singles-men,singles,David Lee,Tom Brown,,,Quarter Final 2,9:30 AM,Court A,
```

### Badminton Mixed Doubles (Pairs)
```csv
badminton-mixed-doubles,mixed-doubles,,,,John & Jane,Mike & Sarah,Semifinal 1,10:00 AM,Court B,
badminton-mixed-doubles,mixed-doubles,,,,Alex & Lisa,Tom & Emma,Semifinal 2,10:30 AM,Court B,
```

## Tips

1. **Consistent Naming**: Use consistent names for teams/players throughout
2. **Time Format**: Use any readable time format (12-hour or 24-hour)
3. **Round Names**: Match the round names shown in the Knockout page for proper display
4. **Backup**: Always backup your Firebase data before bulk importing
5. **Test First**: Test with a small dataset before importing everything

## Validation Checklist

Before importing:
- [ ] All Game IDs are valid and match exactly
- [ ] Game Types are correct (team, singles, mixed-doubles)
- [ ] Participants are filled in the correct columns
- [ ] All required fields are filled
- [ ] Round names follow conventions
- [ ] No duplicate match IDs will be generated
- [ ] Time formats are consistent

## Troubleshooting

**Problem**: Schedules don't appear in the app
- Check that Game IDs match exactly (case-sensitive)
- Verify the data is in the correct Firebase path: `/schedules/{gameId}`

**Problem**: Import script fails
- Verify Firebase credentials are correct
- Check that the CSV file is in UTF-8 encoding
- Ensure all required npm/pip packages are installed

**Problem**: Mixed doubles not showing correctly
- Make sure Pair 1 and Pair 2 columns are filled
- Leave Team/Player columns empty for mixed doubles

## Support

For issues or questions:
- Check Firebase Console for data structure
- Verify admin access is working
- Contact: contact@yukti-ai.com
