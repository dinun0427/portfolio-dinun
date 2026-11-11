import type { CSSProperties } from "react";
import { profile } from "@/lib/data";

/**
 * The "DR" mark: a thick glossy tile that swings in 3D, with the letters
 * floating in front of it. Pure CSS (no WebGL), so it costs almost nothing.
 * Hover it for a full spin. Styles live in app/globals.css (.logo3d).
 */
export function Logo() {
  return (
    <a
      href="#"
      aria-label={`${profile.initials} – back to top`}
      className="logo3d group inline-flex items-center"
    >
      <span className="logo3d-rotor" aria-hidden="true">
        {/* the tile's thickness: a stack of darker layers behind the front */}
        {[1, 2, 3, 4, 5].map((depth) => (
          <span
            key={depth}
            className="logo3d-layer"
            style={{ "--z": depth } as CSSProperties}
          />
        ))}
        <span className="logo3d-front">
          <span className="logo3d-shine" />
        </span>
        <span className="logo3d-letters">{profile.initials}</span>
      </span>
    </a>
  );
}
