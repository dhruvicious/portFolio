"use client";

import { Playfair_Display, Nothing_You_Could_Do } from "next/font/google";
import { useRef, forwardRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["600"] });
const nothing = Nothing_You_Could_Do({ subsets: ["latin"], weight: ["400"] });

/* ── Figma Selection Box ──────────────────────────────────────── */
const SelectionBox = forwardRef<HTMLDivElement, { showRotHandle?: boolean; rotRef?: React.Ref<HTMLDivElement> }>(
  ({ showRotHandle, rotRef }, ref) => {
    const dot = (p: React.CSSProperties): React.CSSProperties => ({
      position: "absolute", width: 10, height: 10,
      backgroundColor: "white", border: "2px solid #0D99FF",
      boxSizing: "border-box", boxShadow: "0 2px 8px rgba(0,0,0,0.5)", ...p,
    });
    return (
      <div ref={ref} style={{ position: "absolute", inset: -6, pointerEvents: "none", opacity: 0, zIndex: 10 }}>
        {/* Border */}
        <div style={{ position: "absolute", inset: 0, border: "2px solid #0D99FF" }} />
        {/* Corner dots */}
        <div style={dot({ top: -5, left: -5 })} />
        <div style={dot({ top: -5, right: -5 })} />
        <div style={dot({ bottom: -5, left: -5 })} />
        <div style={dot({ bottom: -5, right: -5 })} />
        {/* Rotation handle (line + circle above top-center) */}
        {showRotHandle && (
          <div
            ref={rotRef}
            style={{
              position: "absolute",
              bottom: "100%",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              opacity: 0,
              zIndex: 11,
            }}
          >
            <div style={{
              width: 10, height: 10, borderRadius: "50%",
              backgroundColor: "white", border: "2px solid #0D99FF",
              boxSizing: "border-box", boxShadow: "0 2px 6px rgba(0,0,0,0.4)",
            }} />
            <div style={{ width: 1, height: 18, background: "#0D99FF" }} />
          </div>
        )}
      </div>
    );
  }
);
SelectionBox.displayName = "SelectionBox";

/* ── Reusable Component ──────────────────────────────────────── */
export function FigmaWorksAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const hasPlayed = useRef(false);

  // Letter refs
  const myRef = useRef<HTMLDivElement>(null);
  const wRef  = useRef<HTMLSpanElement>(null);
  const oRef  = useRef<HTMLSpanElement>(null);
  const rRef  = useRef<HTMLSpanElement>(null);
  const kRef  = useRef<HTMLSpanElement>(null);
  const sRef  = useRef<HTMLSpanElement>(null);

  // Selection box refs
  const myBox = useRef<HTMLDivElement>(null);
  const wBox  = useRef<HTMLDivElement>(null);
  const oBox  = useRef<HTMLDivElement>(null);
  const rBox  = useRef<HTMLDivElement>(null);
  const kBox  = useRef<HTMLDivElement>(null);
  const sBox  = useRef<HTMLDivElement>(null);

  // Rotation handle refs (only for elements with rotation)
  const myRot = useRef<HTMLDivElement>(null);
  const wRot  = useRef<HTMLDivElement>(null);
  const kRot  = useRef<HTMLDivElement>(null);
  const sRot  = useRef<HTMLDivElement>(null);

  // Guide refs
  const hGuide = useRef<HTMLDivElement>(null);
  const vGuide = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);
    const container = containerRef.current;
    if (!container) return;

    const vw = window.innerWidth / 100;
    const ROT_HANDLE_H = 28; // dot(10) + line(18)

    // ── Helpers ──
    const visualPos = (el: HTMLElement) => {
      const er = el.getBoundingClientRect();
      const cr = container.getBoundingClientRect();
      return {
        x: er.left - cr.left, y: er.top - cr.top,
        cx: er.left - cr.left + er.width / 2,
        cy: er.top - cr.top + er.height / 2,
        right: er.right - cr.left,
      };
    };
    const layoutPos = (el: HTMLElement) => {
      let x = 0, y = 0;
      let cur: HTMLElement | null = el;
      while (cur && cur !== container) {
        x += cur.offsetLeft; y += cur.offsetTop;
        cur = cur.offsetParent as HTMLElement | null;
      }
      return {
        x, y,
        cx: x + el.offsetWidth / 2,
        cy: y + el.offsetHeight / 2,
        right: x + el.offsetWidth,
      };
    };

    // ═══════════════════════════════════════════════
    // MANGLED STATES
    // ═══════════════════════════════════════════════
    gsap.set(myRef.current, { scale: 2, rotation: -15, x: -8 * vw, y: 4 * vw, opacity: 0.6 });
    gsap.set(wRef.current,  { rotation: 25, y: -4 * vw, scale: 1.3 });
    gsap.set(oRef.current,  { scaleX: 3, scaleY: 0.5, transformOrigin: "center center" });
    gsap.set(rRef.current,  { scale: 0.4, y: 3 * vw, opacity: 0.4 });
    gsap.set(kRef.current,  { x: 5 * vw, rotation: -12 });
    gsap.set(sRef.current,  { y: -4 * vw, scale: 1.6, rotation: 12 });

    // Hide UI
    const allBoxes = [myBox, wBox, oBox, rBox, kBox, sBox].map(r => r.current);
    const allRots = [myRot, wRot, kRot, sRot].map(r => r.current);
    gsap.set(allBoxes, { opacity: 0 });
    gsap.set(allRots, { opacity: 0 });
    gsap.set(hGuide.current, { opacity: 0, scaleX: 0, transformOrigin: "center" });
    gsap.set(vGuide.current, { opacity: 0, scaleY: 0, transformOrigin: "center" });

    const cursor = document.getElementById("dev-cursor")!;
    gsap.set(cursor, { opacity: 0 });

    // ── Helper: read rotation dot's live position ──
    const rotDotPos = (rotHandle: HTMLElement) => {
      const dotEl = rotHandle.firstElementChild as HTMLElement;
      const dr = dotEl.getBoundingClientRect();
      const cr = container.getBoundingClientRect();
      return { x: dr.left - cr.left + dr.width / 2, y: dr.top - cr.top + dr.height / 2 };
    };

    // ── Helper: read element's right-edge position ──
    const rightEdgePos = (el: HTMLElement) => {
      const er = el.getBoundingClientRect();
      const cr = container.getBoundingClientRect();
      return { x: er.right - cr.left + 10, y: er.top - cr.top + er.height / 2 };
    };

    // ── Fix by DRAGGING right edge (O, R) — cursor tracks edge every frame ──
    const fixByDrag = (
      tl: gsap.core.Timeline,
      el: HTMLElement,
      box: HTMLElement,
      fixProps: gsap.TweenVars,
      dur = 0.35,
    ) => {
      // Fly to element's current right edge
      tl.to(cursor, { x: () => rightEdgePos(el).x, y: () => rightEdgePos(el).y, duration: 0.2, ease: "power2.inOut" });
      tl.to(box, { opacity: 1, duration: 0.05 });
      tl.to(cursor, { scale: 0.85, duration: 0.05 });
      // Fix — cursor follows right edge on every frame
      tl.to(el, {
        ...fixProps, duration: dur, ease: "power2.out",
        onUpdate() {
          const p = rightEdgePos(el);
          gsap.set(cursor, { x: p.x, y: p.y });
        },
      });
      tl.to(cursor, { scale: 1, duration: 0.05 });
      tl.to(box, { opacity: 0, duration: 0.05 });
    };

    // ── Fix via ROTATION HANDLE (my, W, K, S) — cursor tracks dot every frame ──
    const fixByRotation = (
      tl: gsap.core.Timeline,
      el: HTMLElement,
      box: HTMLElement,
      rotHandle: HTMLElement,
      fixProps: gsap.TweenVars,
      dur = 0.35,
    ) => {
      // Fly to rotation dot's current live position
      tl.to(cursor, {
        x: () => rotDotPos(rotHandle).x,
        y: () => rotDotPos(rotHandle).y,
        duration: 0.2, ease: "power2.inOut",
      });
      // Show selection + rotation handle
      tl.to(box, { opacity: 1, duration: 0.05 });
      tl.to(rotHandle, { opacity: 1, duration: 0.05 }, "<");
      // Grab
      tl.to(cursor, { scale: 0.85, duration: 0.05 });
      // Fix — cursor follows rotation dot on every frame as it arcs
      tl.to(el, {
        ...fixProps, duration: dur, ease: "power2.out",
        onUpdate() {
          const p = rotDotPos(rotHandle);
          gsap.set(cursor, { x: p.x, y: p.y });
        },
      });
      // Release
      tl.to(cursor, { scale: 1, duration: 0.05 });
      // Hide
      tl.to(rotHandle, { opacity: 0, duration: 0.05 });
      tl.to(box, { opacity: 0, duration: 0.05 }, "<");
    };

    // ── Scroll-TRIGGERED ──
    ScrollTrigger.create({
      trigger: container,
      start: "top 60%",
      onEnter: () => {
        if (hasPlayed.current) return;
        hasPlayed.current = true;

        const tl = gsap.timeline();

        // ═════════════ CURSOR ENTERS ═════════════
        // Fly in to "my"'s rotation dot
        tl.fromTo(cursor,
          { opacity: 0, x: container.offsetWidth + 100, y: container.offsetHeight },
          {
            opacity: 1,
            x: () => rotDotPos(myRot.current!).x,
            y: () => rotDotPos(myRot.current!).y,
            duration: 0.5, ease: "power3.out",
          }
        );

        // ═════════════ FIX "my" — ROTATION HANDLE ═════════════
        tl.to(myBox.current, { opacity: 1, duration: 0.05 });
        tl.to(myRot.current, { opacity: 1, duration: 0.05 }, "<");
        tl.to(cursor, { scale: 0.85, duration: 0.05 });
        // Fix — cursor follows "my"'s rotation dot every frame
        tl.to(myRef.current, {
          scale: 1, rotation: 0, x: 0, y: 0, opacity: 1,
          duration: 0.4, ease: "power2.out",
          onUpdate() {
            const p = rotDotPos(myRot.current!);
            gsap.set(cursor, { x: p.x, y: p.y });
          },
        });
        tl.to(cursor, { scale: 1, duration: 0.05 });
        tl.to(hGuide.current, { opacity: 0.5, scaleX: 1, duration: 0.1 });
        tl.to(hGuide.current, { opacity: 0, duration: 0.1 }, ">0.05");
        tl.to(myRot.current, { opacity: 0, duration: 0.05 }, "<");
        tl.to(myBox.current, { opacity: 0, duration: 0.05 }, "<");

        // ═════════════ FIX "W" — ROTATION HANDLE ═════════════
        // Rotated 25° + shifted up + scaled → correct
        fixByRotation(tl, wRef.current!, wBox.current!, wRot.current!, {
          rotation: 0, y: 0, scale: 1,
        });

        // ═════════════ FIX "O" — DRAG RIGHT EDGE ═════════════
        // Horizontally stretched 3× + squished 0.5× → correct proportions
        fixByDrag(tl, oRef.current!, oBox.current!, {
          scaleX: 1, scaleY: 1,
        }, 0.45);

        // ═════════════ FIX "R" — DRAG ═════════════
        // Too small (0.4×) + below baseline → correct size + position
        fixByDrag(tl, rRef.current!, rBox.current!, {
          scale: 1, y: 0, opacity: 1,
        });

        // ═════════════ FIX "K" — ROTATION HANDLE ═════════════
        // Bad kerning (5vw gap) + rotated -12° → correct
        fixByRotation(tl, kRef.current!, kBox.current!, kRot.current!, {
          x: 0, rotation: 0,
        });

        // ═════════════ FIX "S" — ROTATION HANDLE ═════════════
        // Above baseline + too big + rotated 12° → correct
        fixByRotation(tl, sRef.current!, sBox.current!, sRot.current!, {
          y: 0, scale: 1, rotation: 0,
        });

        // Vertical guide flash
        tl.to(vGuide.current, { opacity: 0.5, scaleY: 1, duration: 0.1 });
        tl.to(vGuide.current, { opacity: 0, duration: 0.1 }, ">0.05");

        // ═════════════ FINALE ═════════════
        tl.to(hGuide.current, { opacity: 0.3, scaleX: 1, duration: 0.1 }, "fin");
        tl.to(vGuide.current, { opacity: 0.3, scaleY: 1, duration: 0.1 }, "fin");
        tl.to([hGuide.current, vGuide.current], { opacity: 0, duration: 0.15 }, "fin+=0.15");
        tl.to(cursor, {
          x: container.offsetWidth + 100, y: -100,
          opacity: 0, duration: 0.4, ease: "power2.in",
        }, "fin+=0.1");
      },
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} style={{ position: "relative", display: "flex", justifyContent: "center", alignItems: "center", padding: "1rem 0", marginBottom: "4rem", overflow: "visible", width: "100%", color: "#FDE68A", textShadow: "0 8px 32px rgba(0,0,0,0.6), 0 2px 8px rgba(0,0,0,0.4)" }}>

      {/* ── Text ── */}
      <div style={{ fontSize: "12vw", margin: 0, display: "flex", flexDirection: "column", alignItems: "center", lineHeight: 0.85 }}>

        {/* "my" — has rotation */}
        <div ref={myRef} className={nothing.className}
          style={{ fontSize: "8vw", color: "#ffccd5", position: "relative", display: "inline-block", transform: "rotate(-5deg) translateX(-10vw)" }}>
          <SelectionBox ref={myBox} showRotHandle rotRef={myRot} />
          my
        </div>

        {/* W O R K S */}
        <div className={playfair.className} style={{ fontWeight: 600, textTransform: "uppercase", display: "flex", alignItems: "center" }}>

          {/* W — has rotation */}
          <span ref={wRef} style={{ display: "inline-block", position: "relative" }}>
            <SelectionBox ref={wBox} showRotHandle rotRef={wRot} />
            W
          </span>

          {/* O — no rotation, just resize */}
          <span ref={oRef} style={{ display: "inline-block", position: "relative" }}>
            <SelectionBox ref={oBox} />
            O
          </span>

          {/* R — no rotation, just scale/position */}
          <span ref={rRef} style={{ display: "inline-block", position: "relative" }}>
            <SelectionBox ref={rBox} />
            R
          </span>

          {/* K — has rotation */}
          <span ref={kRef} style={{ display: "inline-block", position: "relative" }}>
            <SelectionBox ref={kBox} showRotHandle rotRef={kRot} />
            K
          </span>

          {/* S — has rotation */}
          <span ref={sRef} style={{ display: "inline-block", position: "relative" }}>
            <SelectionBox ref={sBox} showRotHandle rotRef={sRot} />
            S
          </span>
        </div>
      </div>

      {/* ── Alignment Guides ── */}
      <div ref={hGuide} style={{ position: "absolute", left: "5%", right: "5%", top: "50%", height: 1, background: "#FF0066", pointerEvents: "none", zIndex: 8, opacity: 0 }} />
      <div ref={vGuide} style={{ position: "absolute", top: "15%", bottom: "15%", left: "50%", width: 1, background: "#FF0066", pointerEvents: "none", zIndex: 8, opacity: 0 }} />

      {/* ── Cursor (clean arrow, same as contact section) ── */}
      <div id="dev-cursor" style={{ position: "absolute", top: 0, left: 0, zIndex: 9999, pointerEvents: "none", opacity: 0, display: "flex", alignItems: "flex-start" }}>
        <svg width="24" height="36" viewBox="0 0 24 36" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transform: "translate(-10%, -5%)", filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))" }}>
          <path d="M5.65376 12.3673H5.46026L5.31717 12.4976L0.500002 16.8829L0.500002 1.19841L11.7871 12.3673H5.65376Z" fill="#F24E1E" stroke="white" strokeWidth="1.5"/>
        </svg>
        <div style={{
          position: "absolute", top: 32, left: 20,
          padding: "4px 10px", borderRadius: 12,
          backgroundColor: "#F24E1E", color: "white",
          fontWeight: 600, fontSize: "0.9rem", letterSpacing: "0.5px",
          whiteSpace: "nowrap", boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          fontFamily: "sans-serif",
        }}>Dhruv</div>
      </div>
    </div>
  );
}
