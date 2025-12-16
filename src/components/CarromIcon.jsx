const CarromIcon = ({ className = "w-10 h-10" }) => {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Carrom Board */}
      <rect
        x="10"
        y="10"
        width="80"
        height="80"
        fill="#D4A574"
        stroke="#8B4513"
        strokeWidth="2"
      />

      {/* Playing Area */}
      <rect
        x="15"
        y="15"
        width="70"
        height="70"
        fill="#E8C9A0"
        stroke="#8B4513"
        strokeWidth="1"
      />

      {/* Corner Pockets */}
      <circle cx="18" cy="18" r="4" fill="#333" />
      <circle cx="82" cy="18" r="4" fill="#333" />
      <circle cx="18" cy="82" r="4" fill="#333" />
      <circle cx="82" cy="82" r="4" fill="#333" />

      {/* Center Circle */}
      <circle cx="50" cy="50" r="15" fill="none" stroke="#8B4513" strokeWidth="1" />
      <circle cx="50" cy="50" r="10" fill="none" stroke="#8B4513" strokeWidth="0.5" />

      {/* Queen (Red) */}
      <circle cx="50" cy="50" r="3" fill="#DC143C" stroke="#8B4513" strokeWidth="0.5" />

      {/* Black Coins */}
      <circle cx="45" cy="45" r="2.5" fill="#333" stroke="#666" strokeWidth="0.5" />
      <circle cx="55" cy="45" r="2.5" fill="#333" stroke="#666" strokeWidth="0.5" />
      <circle cx="45" cy="55" r="2.5" fill="#333" stroke="#666" strokeWidth="0.5" />
      <circle cx="55" cy="55" r="2.5" fill="#333" stroke="#666" strokeWidth="0.5" />

      {/* White Coins */}
      <circle cx="50" cy="40" r="2.5" fill="#FFF" stroke="#999" strokeWidth="0.5" />
      <circle cx="50" cy="60" r="2.5" fill="#FFF" stroke="#999" strokeWidth="0.5" />
      <circle cx="40" cy="50" r="2.5" fill="#FFF" stroke="#999" strokeWidth="0.5" />
      <circle cx="60" cy="50" r="2.5" fill="#FFF" stroke="#999" strokeWidth="0.5" />

      {/* Diagonal Lines */}
      <line x1="15" y1="15" x2="35" y2="35" stroke="#8B4513" strokeWidth="0.5" />
      <line x1="85" y1="15" x2="65" y2="35" stroke="#8B4513" strokeWidth="0.5" />
      <line x1="15" y1="85" x2="35" y2="65" stroke="#8B4513" strokeWidth="0.5" />
      <line x1="85" y1="85" x2="65" y2="65" stroke="#8B4513" strokeWidth="0.5" />
    </svg>
  );
};

export default CarromIcon;
