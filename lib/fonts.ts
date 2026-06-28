import { Cormorant_Garamond, Plus_Jakarta_Sans, Limelight } from "next/font/google";

export const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const limelight = Limelight({
  subsets: ["latin"],
  weight: ["400"], 
});
