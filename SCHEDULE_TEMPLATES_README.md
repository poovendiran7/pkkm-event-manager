# Schedule Templates for PKKM Event Manager

This folder contains Excel/Google Sheets templates for pre-creating event schedules.

## Available Templates

| Template File | Sport | Type | Use For |
|--------------|-------|------|---------|
| `Schedule_Template_Futsal.csv` | Futsal | Team | Team matches |
| `Schedule_Template_Netball.csv` | Netball | Team | Team matches |
| `Schedule_Template_Carrom.csv` | Carrom | Individual | Player matches |
| `Schedule_Template_Chess.csv` | Chess | Individual | Player matches |
| `Schedule_Template_Badminton.csv` | Badminton | Mixed Doubles | Pair matches |
| `Schedule_Template_Esports.csv` | E-sports (FC26) | Team | Team matches |
| `Schedule_Template_Darts.csv` | Darts | Individual | Player matches |
| `Schedule_Template.csv` | All Games | Master | Combined template |

## Quick Start

### Option 1: Use Individual Templates (Recommended)

1. **Open the template** for your sport (e.g., `Schedule_Template_Futsal.csv`)
2. **Open in Excel or Google Sheets**
3. **Fill in the schedule data**:
   - Replace example teams/players with actual names
   - Update times and venues
   - Add notes if needed
4. **Save the file**

### Option 2: Use Google Sheets (Easiest)

1. **Open Google Sheets**: https://sheets.google.com
2. **File → Import → Upload**
3. **Choose the CSV template**
4. **Edit the data** directly in Google Sheets
5. **File → Download → CSV** when done

## Column Descriptions

### Team Sports (Futsal, Netball, E-sports)
- **Team 1**: Name of first team
- **Team 2**: Name of second team
- **Round**: Match round (e.g., "Group A - Match 1", "Quarter Final 1")
- **Time**: Match time (e.g., "2:00 PM", "14:00")
- **Venue**: Location (e.g., "Main Ground", "Court 1")
- **Notes**: Optional additional info

### Individual Sports (Carrom, Chess, Darts)
- **Player 1**: Name of first player
- **Player 2**: Name of second player
- **Round**: Match round
- **Time**: Match time
- **Venue**: Location
- **Notes**: Optional additional info

### Mixed Doubles (Badminton)
- **Pair 1**: First pair (e.g., "John & Jane")
- **Pair 2**: Second pair (e.g., "Mike & Sarah")
- **Round**: Match round
- **Time**: Match time
- **Venue**: Location
- **Notes**: Optional additional info

## Important Notes

### Round Names for Knockout Display

Use these exact names for proper knockout bracket display:

**Quarter Finals:**
- `Quarter Final 1`
- `Quarter Final 2`
- `Quarter Final 3`
- `Quarter Final 4`

**Semi Finals:**
- `Semifinal 1`
- `Semifinal 2`

**Final Matches:**
- `3rd-4th Placing`
- `Final`

### Group Stage Naming
For group matches, use format:
- `Group A - Match 1`
- `Group A - Match 2`
- `Group B - Match 1`

## How to Import into Firebase

### Method 1: Manual Entry (Small Schedules)
1. Login to the admin panel: `your-site.com/login`
2. Go to Admin → Schedule tab
3. Manually add each schedule entry
4. ✅ Simple, no technical knowledge needed

### Method 2: Firebase Console Import (Medium Schedules)

See `SCHEDULE_IMPORT_GUIDE.md` for detailed instructions with:
- CSV to JSON conversion
- Firebase Console import steps
- Python/Node.js import scripts

## Example Data

### Futsal Match (Team)
```csv
Team Red,Team Blue,Group A - Match 1,2:00 PM,Court 1,Opening match
```

### Chess Match (Individual)
```csv
John Doe,Mike Smith,Quarter Final 1,9:00 AM,Hall 2,Best of 3
```

### Badminton Match (Mixed Doubles)
```csv
John & Jane,Mike & Sarah,Semifinal 1,10:00 AM,Court 1,Championship path
```

## Tips for Success

1. **Keep Names Consistent**: Use the exact same spelling for teams/players throughout
2. **Use 12-hour Format**: Times like "2:00 PM" are easier to read
3. **Empty Knockout Slots**: Leave Team/Player columns empty for TBD knockout matches
4. **Add Notes**: Use Notes column for important match details
5. **Test Small First**: Try importing 2-3 schedules first before doing all

## Game ID Reference

When using the master template, use these Game IDs:

| Sport | Game ID |
|-------|---------|
| Futsal | `futsal` |
| Netball | `netball` |
| Carrom | `carrom` |
| Chess | `chess` |
| Badminton (Mixed Doubles) | `badminton` |
| E-sports (FC26) | `esports` |
| Darts | `darts` |

## Need Help?

- **Detailed Import Guide**: See `SCHEDULE_IMPORT_GUIDE.md`
- **Admin Panel**: Login at `/login` to manually add schedules
- **Support**: contact@yukti-ai.com

## Files in This Folder

```
📁 Event Manager/
├── 📄 Schedule_Template.csv                        (Master template)
├── 📄 Schedule_Template_Futsal.csv                 (Futsal only)
├── 📄 Schedule_Template_Netball.csv                (Netball only)
├── 📄 Schedule_Template_Carrom.csv                 (Carrom only)
├── 📄 Schedule_Template_Chess.csv                  (Chess only)
├── 📄 Schedule_Template_Badminton.csv              (Badminton only)
├── 📄 Schedule_Template_Esports.csv                (E-sports only)
├── 📄 Schedule_Template_Darts.csv                  (Darts only)
├── 📄 import-schedules.py                          (Python import script)
├── 📄 SCHEDULE_TEMPLATES_README.md                 (This file)
└── 📄 SCHEDULE_IMPORT_GUIDE.md                     (Import instructions)
```

## Google Sheets Link

You can also access these templates online:
- Copy the CSV content
- Paste into Google Sheets
- Share with your team
- Everyone can edit simultaneously

Enjoy organizing your event! 🏆
