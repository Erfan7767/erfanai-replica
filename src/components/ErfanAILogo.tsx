interface ErfanAILogoProps {
  className?: string;
  color?: string;
}

const ErfanAILogo = ({ className = "h-10 w-10", color = "currentColor" }: ErfanAILogoProps) => {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Brain curves on top */}
      <path
        d="M60 95 C60 65, 80 45, 105 45 C130 45, 145 60, 145 80"
        stroke={color}
        strokeWidth="10"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M55 80 C55 50, 80 30, 110 30 C140 30, 158 50, 158 75"
        stroke={color}
        strokeWidth="9"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M50 65 C50 35, 80 15, 115 15 C150 15, 170 40, 170 68"
        stroke={color}
        strokeWidth="8"
        strokeLinecap="round"
        fill="none"
      />

      {/* Letter E - left side */}
      <path
        d="M40 70 L40 150 C40 155, 42 158, 48 158 L90 158"
        stroke={color}
        strokeWidth="12"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* E middle bar */}
      <path
        d="M40 115 L80 115"
        stroke={color}
        strokeWidth="11"
        strokeLinecap="round"
        fill="none"
      />
      {/* E top bar */}
      <path
        d="M40 75 L75 75"
        stroke={color}
        strokeWidth="11"
        strokeLinecap="round"
        fill="none"
      />

      {/* Letter A - right side with curve connection */}
      <path
        d="M145 80 C145 100, 140 115, 130 130 L105 185"
        stroke={color}
        strokeWidth="12"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M130 130 C140 130, 150 140, 155 155 L165 185"
        stroke={color}
        strokeWidth="12"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* A crossbar */}
      <path
        d="M115 158 L152 158"
        stroke={color}
        strokeWidth="10"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
};

export default ErfanAILogo;
