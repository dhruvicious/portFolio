"use client";

import { useRef, useState } from "react";
import styles from "./contact-section.module.css";
import { Instagram, Search } from "lucide-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Canvas } from "@react-three/fiber";
import { ShaderBackground } from "@/components/video-scroll";
import socialsData from "@/lib/socials.json";

const LinkedinIcon = (props: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none" {...props}>
      <g clipPath="url(#clip0_17_68)">
          <path d="M44.4469 0H3.54375C1.58437 0 0 1.54688 0 3.45938V44.5312C0 46.4437 1.58437 48 3.54375 48H44.4469C46.4062 48 48 46.4438 48 44.5406V3.45938C48 1.54688 46.4062 0 44.4469 0ZM14.2406 40.9031H7.11563V17.9906H14.2406V40.9031ZM10.6781 14.8688C8.39062 14.8688 6.54375 13.0219 6.54375 10.7437C6.54375 8.46562 8.39062 6.61875 10.6781 6.61875C12.9563 6.61875 14.8031 8.46562 14.8031 10.7437C14.8031 13.0125 12.9563 14.8688 10.6781 14.8688ZM40.9031 40.9031H33.7875V29.7656C33.7875 27.1125 33.7406 23.6906 30.0844 23.6906C26.3812 23.6906 25.8187 26.5875 25.8187 29.5781V40.9031H18.7125V17.9906H25.5375V21.1219H25.6312C26.5781 19.3219 28.9031 17.4188 32.3625 17.4188C39.5719 17.4188 40.9031 22.1625 40.9031 28.3313V40.9031Z" fill="currentColor"/>
      </g>
      <defs>
          <clipPath id="clip0_17_68">
          <rect width="48" height="48" fill="currentColor"/>
          </clipPath>
      </defs>
  </svg>
);

const TwitterIcon = (props: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none" {...props}>
    <path d="M36.6526 3.8078H43.3995L28.6594 20.6548L46 43.5797H32.4225L21.7881 29.6759L9.61989 43.5797H2.86886L18.6349 25.56L2 3.8078H15.9222L25.5348 16.5165L36.6526 3.8078ZM34.2846 39.5414H38.0232L13.8908 7.63406H9.87892L34.2846 39.5414Z" fill="currentColor"/>
  </svg>
);

const GithubIcon = (props: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none" {...props}>
      <g clipPath="url(#clip0_910_44)">
          <path fillRule="evenodd" clipRule="evenodd" d="M24.0199 0C10.7375 0 0 10.8167 0 24.1983C0 34.895 6.87988 43.9495 16.4241 47.1542C17.6174 47.3951 18.0545 46.6335 18.0545 45.9929C18.0545 45.4319 18.0151 43.509 18.0151 41.5055C11.3334 42.948 9.94198 38.6209 9.94198 38.6209C8.86818 35.8164 7.27715 35.0956 7.27715 35.0956C5.09022 33.6132 7.43645 33.6132 7.43645 33.6132C9.86233 33.7735 11.1353 36.0971 11.1353 36.0971C13.2824 39.7827 16.7422 38.7413 18.1341 38.1002C18.3328 36.5377 18.9695 35.456 19.6455 34.8552C14.3163 34.2942 8.70937 32.211 8.70937 22.9161C8.70937 20.2719 9.66321 18.1086 11.1746 16.4261C10.9361 15.8253 10.1008 13.3409 11.4135 10.0157C11.4135 10.0157 13.4417 9.3746 18.0146 12.4996C19.9725 11.9699 21.9916 11.7005 24.0199 11.6982C26.048 11.6982 28.1154 11.979 30.0246 12.4996C34.5981 9.3746 36.6262 10.0157 36.6262 10.0157C37.9389 13.3409 37.1031 15.8253 36.8646 16.4261C38.4158 18.1086 39.3303 20.2719 39.3303 22.9161C39.3303 32.211 33.7234 34.2539 28.3544 34.8552C29.2296 35.6163 29.9848 37.0583 29.9848 39.3421C29.9848 42.5871 29.9454 45.1915 29.9454 45.9924C29.9454 46.6335 30.383 47.3951 31.5758 47.1547C41.12 43.9491 47.9999 34.895 47.9999 24.1983C48.0392 10.8167 37.2624 0 24.0199 0Z" fill="currentColor"/>
      </g>
  </svg>
);

const YoutubeIcon = (props: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none" {...props}>
    <path d="M47.5219 14.4001C47.5219 14.4001 47.0531 11.0907 45.6094 9.6376C43.7812 7.7251 41.7375 7.71572 40.8 7.60322C34.0875 7.11572 24.0094 7.11572 24.0094 7.11572H23.9906C23.9906 7.11572 13.9125 7.11572 7.2 7.60322C6.2625 7.71572 4.21875 7.7251 2.39062 9.6376C0.946875 11.0907 0.4875 14.4001 0.4875 14.4001C0.4875 14.4001 0 18.2907 0 22.172V25.8095C0 29.6907 0.478125 33.5813 0.478125 33.5813C0.478125 33.5813 0.946875 36.8907 2.38125 38.3438C4.20937 40.2563 6.60938 40.1907 7.67813 40.397C11.5219 40.7626 24 40.8751 24 40.8751C24 40.8751 34.0875 40.8563 40.8 40.3782C41.7375 40.2657 43.7812 40.2563 45.6094 38.3438C47.0531 36.8907 47.5219 33.5813 47.5219 33.5813C47.5219 33.5813 48 29.7001 48 25.8095V22.172C48 18.2907 47.5219 14.4001 47.5219 14.4001ZM19.0406 30.2251V16.7345L32.0062 23.5032L19.0406 30.2251Z" fill="currentColor"/>
  </svg>
);

const EmailIcon = (props: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 62 62" fill="none" {...props}>
      <path d="M54.25 31C54.25 26.142 52.7284 21.4061 49.8986 17.4574C47.0691 13.5086 43.0735 10.5454 38.4736 8.98388C33.8734 7.42233 28.8998 7.34096 24.2509 8.75115C19.6021 10.1613 15.5119 12.9922 12.5545 16.8463C9.59721 20.7004 7.92141 25.3839 7.76245 30.2392C7.6035 35.0946 8.96941 39.8779 11.6683 43.9169C14.3673 47.9562 18.2636 51.0487 22.8102 52.7599C27.3567 54.4711 32.3253 54.715 37.0176 53.4577" stroke="currentColor" strokeWidth="6" strokeLinecap="round"/>
      <path d="M31 41.3333C36.7069 41.3333 41.3333 36.7069 41.3333 31C41.3333 25.293 36.7069 20.6666 31 20.6666C25.293 20.6666 20.6666 25.293 20.6666 31C20.6666 36.7069 25.293 41.3333 31 41.3333Z" stroke="currentColor" strokeWidth="6"/>
      <path d="M41.3334 23.25V34.875C41.3334 38.4418 44.2249 41.3333 47.7917 41.3333C51.3585 41.3333 54.25 38.4418 54.25 34.875V31" stroke="currentColor" strokeWidth="6" strokeLinecap="round"/>
  </svg>
);

const CONTACT_ITEMS = [
  {
    id: "linkedin",
    className: styles.itemLinkedin,
    bgClass: "bg-[#0077b5]",
    icon: LinkedinIcon,
    link: socialsData.linkedin,
  },
  {
    id: "github",
    className: styles.itemGithub,
    bgClass: "bg-[#222222]",
    icon: GithubIcon,
    link: socialsData.github,
  },
  {
    id: "twitter",
    className: styles.itemTwitter,
    bgClass: "bg-[#14171A]",
    icon: TwitterIcon,
    link: socialsData.twitter,
  },
  {
    id: "youtube",
    className: styles.itemYoutube,
    bgClass: "bg-[#FF0000]",
    icon: YoutubeIcon,
    link: socialsData.youtube,
  },
  {
    id: "email",
    className: styles.itemEmail,
    bgClass: "bg-gradient-to-r from-sky-400 to-blue-500",
    icon: EmailIcon,
    link: socialsData.email,
  },
  {
    id: "instagram",
    className: styles.itemInstagram,
    bgClass: "bg-gradient-to-tr from-pink-500 via-red-500 to-yellow-500",
    icon: Instagram,
    link: socialsData.instagram,
  }
];

const CURSORS = [
  { id: "c1", name: "Designer", color: "#ec4899", path: [0, 1] },
  { id: "c2", name: "Engineer", color: "#33CCFF", path: [2, 3] },
  { id: "c3", name: "Writer", color: "#22c55e", path: [4, 5] },
];

export function ContactSection() {
  const containerRef = useRef<HTMLElement>(null);
  const hasPlayed = useRef(false);
  const isAnimationComplete = useRef(false);
  const hasClickedEasterEgg = useRef(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const hoverTimeout = useRef<NodeJS.Timeout | null>(null);
  const scrollProgressRef = useRef<number>(0);

  const handleMouseEnter = (id: string) => {
    if (!isAnimationComplete.current) return; // Prevent resizing during drawing
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    hoverTimeout.current = setTimeout(() => {
      setHoveredId(id);
    }, 150);
  };

  const handleMouseLeave = () => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    setHoveredId(null);
  };

  const handleContainerClick = () => {
    const input = document.getElementById("hidden-input") as HTMLInputElement;
    if (input && !input.disabled) {
      input.focus({ preventScroll: true }); // Prevent browser scroll jumping
      
      // Little bump effect to show it was clicked
      const drawBox = document.getElementById("header-drawbox");
      if (drawBox) {
        gsap.fromTo(drawBox, { scale: 0.98 }, { scale: 1, duration: 0.2, ease: "power2.out" });
      }

      // WarGames Easter Egg!
      if (!hasClickedEasterEgg.current) {
        hasClickedEasterEgg.current = true;
        
        // Disable input while animation runs
        input.disabled = true;
        
        const typewriter = document.getElementById("typewriter") as HTMLElement;
        const currentText = typewriter.innerText;
        
        const textObj = { val: currentText.length };
        const eggTl = gsap.timeline({
          onComplete: () => {
            input.value = ""; // Leave it empty for the user to type
            input.disabled = false;
            input.focus({ preventScroll: true }); // refocus after animation
          }
        });

        // 1. Rapidly delete current text
        eggTl.to(textObj, {
          val: 0,
          duration: 0.5,
          ease: `steps(${currentText.length})`,
          onUpdate: () => {
            typewriter.innerText = currentText.slice(0, Math.floor(textObj.val));
          }
        });

        eggTl.to(textObj, { duration: 0.4 }); // ominous pause

        // 2. Type "shall we play a game ?"
        const msg = "shall we play a game ?";
        eggTl.to(textObj, {
          val: msg.length,
          duration: 1.5,
          ease: `steps(${msg.length})`,
          onUpdate: () => {
            typewriter.innerText = msg.slice(0, Math.floor(textObj.val));
          }
        });

        // 3. Wait for user to read it
        eggTl.to(textObj, { duration: 2.0 });

        // 4. Erase it so they can type
        eggTl.to(textObj, {
          val: 0,
          duration: 0.8,
          ease: `steps(${msg.length})`,
          onUpdate: () => {
            typewriter.innerText = msg.slice(0, Math.floor(textObj.val));
          }
        });
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const typewriter = document.getElementById("typewriter");
    if (typewriter) {
      typewriter.innerText = e.target.value;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const val = e.currentTarget.value.trim().toLowerCase();
      if (val.includes("yes") || val.includes("yep") || val.includes("sure")) {
        const typewriter = document.getElementById("typewriter") as HTMLElement;
        e.currentTarget.disabled = true; // Lock input immediately
        
        if (typewriter) {
          const currentText = typewriter.innerText;
          const textObj = { val: currentText.length };
          
          const accessTl = gsap.timeline({
            onComplete: () => {
              setTimeout(() => {
                window.location.href = "/play";
              }, 800);
            }
          });

          // 1. Delete current text
          accessTl.to(textObj, {
            val: 0,
            duration: 0.4,
            ease: `steps(${currentText.length})`,
            onUpdate: () => {
              typewriter.innerText = currentText.slice(0, Math.floor(textObj.val));
            }
          });

          accessTl.to(textObj, { duration: 0.2 }); // tiny pause

          // 2. Type "ACCESS GRANTED..."
          const msg = "ACCESS GRANTED...";
          accessTl.to(textObj, {
            val: msg.length,
            duration: 1.0,
            ease: `steps(${msg.length})`,
            onUpdate: () => {
              typewriter.innerText = msg.slice(0, Math.floor(textObj.val));
            }
          });
        }
      }
    }
  };

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    // Scroll tracking for the shader
    ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top bottom",
      end: "bottom top",
      onUpdate: (self) => {
        scrollProgressRef.current = self.progress;
      }
    });

    const items = gsap.utils.toArray(`.${styles.bentoItem}`) as HTMLElement[];
    
    ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top 60%", 
      onEnter: () => {
        if (hasPlayed.current) return;
        hasPlayed.current = true;
        
        const grid = document.querySelector(`.${styles.bentoGrid}`) as HTMLElement;
        const centerX = grid.offsetLeft + (grid.offsetWidth / 2);
        const centerY = grid.offsetTop + (grid.offsetHeight / 2);
        const cursorMaster = document.getElementById("cursor-master");
        const headerContainer = document.getElementById("header-container") as HTMLElement;
        const headerDrawBox = document.getElementById("header-drawbox") as HTMLElement;
        const typewriter = document.getElementById("typewriter") as HTMLElement;

        const masterTl = gsap.timeline({
          onComplete: () => {
            isAnimationComplete.current = true;
          }
        });

        // 1. Master Cursor flies in to the header
        masterTl.fromTo(cursorMaster,
          { x: centerX, y: centerY + 500, opacity: 0 },
          { x: () => headerContainer.offsetLeft, y: () => headerContainer.offsetTop, opacity: 1, duration: 1, ease: "power3.out" }
        );

        // 2. Draw Header Box (starts as sharp rectangle)
        masterTl.to(cursorMaster, {
          x: () => headerContainer.offsetLeft + headerContainer.offsetWidth,
          y: () => headerContainer.offsetTop + headerContainer.offsetHeight,
          duration: 1.2,
          ease: "power2.inOut"
        }, "drawHeader");

        masterTl.fromTo(headerDrawBox, 
          { width: "0%", height: "0%", opacity: 1, borderRadius: "0px" },
          { width: "100%", height: "100%", duration: 1.2, ease: "power2.inOut" },
          "drawHeader"
        );

        const radiusDot = document.getElementById("radius-dot") as HTMLElement;

        // 3. Fly to Radius Dot and Drag it!
        masterTl.to(radiusDot, { opacity: 1, duration: 0.2 });
        masterTl.to(cursorMaster, {
          x: () => headerContainer.offsetLeft + 12,
          y: () => headerContainer.offsetTop + 12,
          duration: 0.6,
          ease: "power2.inOut"
        });

        // Click dot
        masterTl.to(cursorMaster, { scale: 0.9, duration: 0.1 });

        // Drag dot diagonally to center of height
        masterTl.to(cursorMaster, {
          x: () => headerContainer.offsetLeft + 40,
          y: () => headerContainer.offsetTop + 40,
          duration: 0.8,
          ease: "power2.out"
        }, "dragRadius");

        masterTl.to(radiusDot, {
          top: 40,
          left: 40,
          duration: 0.8,
          ease: "power2.out"
        }, "dragRadius");

        // Morph box into pill shape!
        masterTl.to(headerDrawBox, {
          borderRadius: "40px",
          duration: 0.8,
          ease: "power2.out"
        }, "dragRadius");

        // Release dot
        masterTl.to(cursorMaster, { scale: 1, duration: 0.1 });
        masterTl.to(radiusDot, { opacity: 0, duration: 0.2 });

        // 4. Move cursor to click the box for typing
        masterTl.to(cursorMaster, {
          x: () => headerContainer.offsetLeft + 100,
          y: () => headerContainer.offsetTop + (headerContainer.offsetHeight / 2),
          duration: 0.4,
          ease: "power2.inOut"
        });

        // Click focus!
        masterTl.to(cursorMaster, { scale: 0.9, duration: 0.1, yoyo: true, repeat: 1 });
        masterTl.add(() => {
          headerDrawBox.classList.add(styles.focused);
          document.getElementById("caret")?.classList.add(styles.active);
          document.getElementById("search-icon")?.classList.add(styles.active);
          document.getElementById("cmd-badge")?.classList.add(styles.active);

          // Decoupled Typing Sequence: Runs asynchronously while cursor flies away
          const typingTl = gsap.timeline({
            onComplete: () => {
              const input = document.getElementById("hidden-input") as HTMLInputElement;
              if (input) {
                input.value = "contact me";
                input.disabled = false;
              }
              const headerContainer = document.getElementById("header-container");
              if (headerContainer) {
                headerContainer.style.cursor = "text";
              }
            }
          });
          const msg1 = "like what i do?";
          const textObj = { val: 0 };
          
          typingTl.to(textObj, {
            val: msg1.length,
            duration: 1.2,
            ease: `steps(${msg1.length})`,
            onUpdate: () => {
              typewriter.innerText = msg1.slice(0, Math.floor(textObj.val));
            }
          });
          
          typingTl.to(textObj, { duration: 0.8 }); // dramatic pause
          
          typingTl.to(textObj, {
            val: 0,
            duration: 0.6,
            ease: `steps(${msg1.length})`,
            onUpdate: () => {
              typewriter.innerText = msg1.slice(0, Math.floor(textObj.val));
            }
          });
          
          typingTl.to(textObj, { duration: 0.3 }); // pause
          
          const msg2 = "contact me";
          typingTl.to(textObj, {
            val: msg2.length,
            duration: 1,
            ease: `steps(${msg2.length})`,
            onUpdate: () => {
              typewriter.innerText = msg2.slice(0, Math.floor(textObj.val));
            }
          });
        });

        // Immediately Fly down to center of grid (no waiting!)
        masterTl.to(cursorMaster, {
          x: centerX,
          y: centerY,
          duration: 0.8,
          ease: "power2.inOut"
        });

        // Split happens (Master disappears)
        masterTl.to(cursorMaster, { opacity: 0, scale: 0, duration: 0.3 }, "split");
        
        CURSORS.forEach((cData) => {
          const cursorEl = document.getElementById(cData.id);
          const tl = gsap.timeline();
          
          cData.path.forEach((tileIndex, pathIdx) => {
            const tile = items[tileIndex];
            const drawBox = tile.querySelector(`.${styles.drawBox}`);
            const content = tile.querySelector(`.${styles.bentoContent}`);
            const radiusDot = tile.querySelector(`.${styles.radiusDot}`) as HTMLElement;
            
            // 1. Fly to tile
            if (pathIdx === 0) {
              // First tile: Explode outwards from the center where Master was!
              tl.fromTo(cursorEl, 
                { x: centerX, y: centerY, opacity: 0, scale: 0.5 },
                { x: () => tile.offsetLeft, y: () => tile.offsetTop, opacity: 1, scale: 1, duration: 0.8, ease: "power3.out" }
              );
            } else {
              // Nth tile: fly from previous position to the top-left of this tile
              tl.to(cursorEl, {
                x: () => tile.offsetLeft,
                y: () => tile.offsetTop,
                duration: 0.8,
                ease: "power2.inOut"
              }, `flyTo${tileIndex}`);
            }

            // 2. Click & drag to draw the box (to bottom-right of tile)
            tl.to(cursorEl, {
              x: () => tile.offsetLeft + tile.offsetWidth,
              y: () => tile.offsetTop + tile.offsetHeight,
              duration: 0.8,
              ease: "power2.inOut"
            }, `draw${tileIndex}`);
            
            // Also trigger the box rendering
            tl.fromTo(drawBox, 
              { width: "0%", height: "0%", opacity: 1, borderRadius: "0px" },
              { width: "100%", height: "100%", duration: 0.8, ease: "power2.inOut" },
              `draw${tileIndex}`
            );

            // 2.5 Drag radius for this tile!
            tl.to(radiusDot, { opacity: 1, duration: 0.1 });
            
            tl.to(cursorEl, {
              x: () => tile.offsetLeft + 12,
              y: () => tile.offsetTop + 12,
              duration: 0.4,
              ease: "power2.inOut"
            });
            
            tl.to(cursorEl, { scale: 0.9, duration: 0.1 }); // click dot
            
            tl.to(cursorEl, {
              x: () => tile.offsetLeft + 24,
              y: () => tile.offsetTop + 24,
              duration: 0.5,
              ease: "power2.out"
            }, `dragRadius${tileIndex}`);

            tl.to(radiusDot, {
              top: 24,
              left: 24,
              duration: 0.5,
              ease: "power2.out"
            }, `dragRadius${tileIndex}`);

            tl.to(drawBox, {
              borderRadius: "1.5rem",
              duration: 0.5,
              ease: "power2.out"
            }, `dragRadius${tileIndex}`);

            tl.to(cursorEl, { scale: 1, duration: 0.1 }); // release
            tl.to(radiusDot, { opacity: 0, duration: 0.1 });

            // 3. Reveal content
            tl.to(content, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, `reveal${tileIndex}`);
            tl.to(drawBox, { backgroundColor: "transparent", borderColor: "rgba(255, 255, 255, 0.15)", duration: 0.6 }, `reveal${tileIndex}`);
            tl.to(tile, { pointerEvents: "auto", duration: 0 }, `reveal${tileIndex}`);
          });

          // 4. Fly away into the void after finishing all tiles in path
          const lastTile = items[cData.path[cData.path.length - 1]];
          tl.to(cursorEl, { 
            x: () => lastTile.offsetLeft + lastTile.offsetWidth + 80, 
            y: () => lastTile.offsetTop + lastTile.offsetHeight + 80, 
            opacity: 0, 
            duration: 0.6, 
            ease: "power2.in" 
          }, "flyAway");

          // Sync this cursor's sub-timeline to explode exactly at the "split" point!
          masterTl.add(tl, "split");
        });
      }
    });
  }, { scope: containerRef });

  return (
    <section ref={containerRef} id="contact-me" className={styles.sectionContact} data-nav-theme="dark">
      <div className={styles.shaderContainer}>
        <div className={styles.shaderSticky}>
          <Canvas orthographic camera={{ position: [0, 0, 1], zoom: 1 }} dpr={[1, 1.5]}>
            <ShaderBackground scrollProgressRef={scrollProgressRef} />
          </Canvas>
        </div>
      </div>

      <div 
        className={styles.headerContainer} 
        id="header-container"
        onClick={handleContainerClick}
      >
        <div className={styles.headerDrawBox} id="header-drawbox">
          <div className={styles.radiusDot} id="radius-dot" />
        </div>
        
        <Search className={styles.searchIcon} id="search-icon" size={28} strokeWidth={2.5} />
        
        <h2 className={styles.sectionHeading}>
          <span id="typewriter"></span><span className={styles.caret} id="caret"></span>
        </h2>
        
        <div className={styles.cmdBadge} id="cmd-badge">
          <span>⌘</span>
          <span>K</span>
        </div>

        <input 
          type="text" 
          id="hidden-input" 
          className={styles.hiddenInput} 
          onChange={handleInputChange} 
          onKeyDown={handleKeyDown}
          disabled 
        />
      </div>
      
      <div className={`${styles.bentoGrid} ${hoveredId ? styles['hover_' + hoveredId] : ''}`}>
        {CONTACT_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <a 
              key={item.id}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.bentoItem} ${item.className}`}
              onMouseEnter={() => handleMouseEnter(item.id)}
              onMouseLeave={handleMouseLeave}
            >
              <div className={styles.drawBox}>
                <div className={styles.radiusDot} />
              </div>
              
              <div className={`${styles.bentoContent} ${item.bgClass}`}>
                <div className={styles.iconContainer}>
                  <Icon color="white" className={styles.centerIcon} />
                </div>
              </div>
              
              <div className={styles.resizeFrame}>
                <div className={`${styles.anchorDot} ${styles.tl}`} />
                <div className={`${styles.anchorDot} ${styles.tr}`} />
                <div className={`${styles.anchorDot} ${styles.bl}`} />
                <div className={`${styles.anchorDot} ${styles.br}`} />
              </div>
            </a>
          );
        })}

        {/* Global Multiplayer Cursors */}
        <div className={styles.globalCursor} id="cursor-master" style={{ zIndex: 30 }}>
          <svg className={styles.cursorSvg} viewBox="0 0 24 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5.65376 12.3673H5.46026L5.31717 12.4976L0.500002 16.8829L0.500002 1.19841L11.7871 12.3673H5.65376Z" fill="#ffffff" stroke="black" strokeWidth="1.5"/>
          </svg>
          <div className={styles.cursorName} style={{ backgroundColor: "#ffffff", color: "black" }}>
            Dhruv
          </div>
        </div>

        {CURSORS.map((c) => (
          <div key={c.id} className={styles.globalCursor} id={c.id}>
            <svg className={styles.cursorSvg} viewBox="0 0 24 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5.65376 12.3673H5.46026L5.31717 12.4976L0.500002 16.8829L0.500002 1.19841L11.7871 12.3673H5.65376Z" fill={c.color} stroke="white" strokeWidth="1.5"/>
            </svg>
            <div className={styles.cursorName} style={{ backgroundColor: c.color }}>
              {c.name}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
