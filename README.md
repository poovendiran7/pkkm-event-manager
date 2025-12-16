# PKKM Sports Carnival 2.0 - Live Event Management System

A colorful and interactive live sports event management application for the **Persatuan Kebajikan Kongu Malaysia (PKKM) Sports Carnival 2.0**.

## Features

- **Live Schedule Viewing** - Participants and spectators can view schedules for all 7 games
- **Live Results** - Real-time match results with winner highlights
- **Interactive Brackets** - Visual knockout tournament brackets
- **Admin Panel** - Easy-to-use interface for organizers to update schedules and results
- **Live Match Indicators** - Mark matches as "LIVE" for real-time updates
- **Colorful & Interactive UI** - Modern, responsive design with smooth animations

## Games Included

1. ⚽ Futsal (Team)
2. 🏀 Netball (Team)
3. 🎯 Carrom (Individual)
4. ♟️ Chess (Individual)
5. 🏸 Badminton (Mixed Doubles)
6. 🎮 E-sports (FC26) (Individual)
7. 🎯 Darts (Individual)

## Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure Firebase (already done for this project):**
   - Copy `.env.example` to `.env`
   - Firebase credentials are already configured in `.env`
   - For your own Firebase project, get config from Firebase Console

3. **Add PKKM Logo:**
   - Replace the placeholder file at `/public/pkkm-logo.png` with the actual PKKM logo image
   - Recommended size: 256x256 pixels (PNG format with transparent background)

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173)

5. **Build for production:**
   ```bash
   npm run build
   ```

## Usage

### For Participants & Spectators

1. **Schedule Tab** - View upcoming matches for all games
2. **Live Results Tab** - See completed match results and live scores
3. **Brackets Tab** - Visual representation of knockout tournament progress

### For Organizers (Admin Panel)

Access the Admin panel to manage the event:

1. **Manage Schedule**
   - Add new matches with time, venue, and participants
   - Delete existing schedules
   - View all scheduled matches

2. **Add Results**
   - Enter match scores
   - Select winners
   - Add optional notes

3. **Live Control**
   - Toggle matches as "LIVE" to display real-time indicators
   - Participants will see live badges on active matches

## Data Persistence

All data is stored in **Firebase Realtime Database**, providing:
- **Real-time synchronization** across all devices
- **Automatic backups** and data persistence
- **Multi-user support** - multiple admins can work simultaneously
- **Instant updates** - changes appear immediately for all viewers
- **Cloud storage** - data is safely stored in Google's infrastructure

## Technology Stack

- **React** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Lucide React** - Icons
- **Firebase Realtime Database** - Cloud data storage & real-time sync
- **Vercel** - Hosting platform

## Customization

### Colors
Edit `tailwind.config.js` to customize the color scheme.

### Games
Modify `src/data/gamesData.js` to add/remove games or change game properties.

### Layout
Edit `src/components/Layout.jsx` to customize the header, navigation, or footer.

## Deployment

This application is ready to deploy to Vercel with Firebase integration.

**See [DEPLOYMENT.md](DEPLOYMENT.md) for complete deployment instructions.**

Quick steps:
1. Push code to GitHub/GitLab/Bitbucket
2. Import project in [Vercel](https://vercel.com)
3. Add Firebase environment variables in Vercel
4. Deploy!

Your app will be live with real-time database synchronization across all users.

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Support

For issues or questions about PKKM Sports Carnival 2.0, please contact the event organizers.

---

**© 2025 Persatuan Kebajikan Kongu Malaysia (PKKM). All rights reserved.**
