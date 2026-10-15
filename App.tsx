import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, Linkedin, Code2, PenTool, ArrowUpRight, BookOpen, ExternalLink, Menu, X, ArrowUp, ChevronRight, Briefcase, GraduationCap, Award } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import ParticleDrift from './particle-drift';

/* ============================================
   Utilities
   ============================================ */
function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

const premiumEase = [0.16, 1, 0.3, 1];

/* ============================================
   Shiny Button Component
   ============================================ */
function ShinyButton({ children, href, className = "", onClick }: any) {
  if (href) {
    return (
      <a href={href} target={href.startsWith("#") ? undefined : "_blank"} rel="noopener noreferrer" className={cn("shiny-cta", className)}>
        <span>{children}</span>
      </a>
    );
  }
  return (
    <button className={cn("shiny-cta", className)} onClick={onClick}>
      <span>{children}</span>
    </button>
  );
}

/* ============================================
   Projects Data
   ============================================ */
const PROJECTS = [
  {
    title: "KrayaSetu AI",
    date: "2026",
    meta: "Smart India Hackathon • SIH26027 • Team of 6",
    headline: "Plans railway maintenance so compatible jobs share one track closure.",
    role: "Backend and calculations. Team of six.",
    description: "Bundles track, signalling and overhead maintenance jobs into shared blocks with constraint programming.",
    stack: ["Python", "FastAPI", "OR Tools", "React", "TypeScript", "DHTMLX"],
    image: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&q=80&w=2000",
    href: "https://kraya-setu-ai.vercel.app/login",
    links: [
      { label: "Prototype", url: "https://kraya-setu-ai.vercel.app/login" },
      { label: "GitHub", url: "https://github.com/JatinChoudhary-07/KrayaSetuAI" }
    ],
    highlight: "500 trains and 150+ maintenance jobs solved in under 8 seconds."
  },
  {
    title: "CORE",
    date: "2026",
    meta: "Campus Operations & Resource Engine",
    headline: "Role-based campus management platform with grievance tracking and admin control.",
    description: "Campus operations platform with dedicated role-based portals for students, faculty, and administrators. Built with Firebase authentication, Firestore, and live request tracking.",
    stack: ["JavaScript", "Firebase Auth", "Firestore", "Firebase Hosting", "CSS3"],
    image: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=2000",
    href: "https://aegis-protocol-bd795.web.app",
    links: [
      { label: "Live Demo", url: "https://aegis-protocol-bd795.web.app" },
      { label: "GitHub", url: "https://github.com/JatinChoudhary-07/CORE" }
    ],
    highlight: "Role-based portals for students, faculty, and admins with live grievance tracking."
  },
  {
    title: "Galactic Dashboard",
    date: "Dec 2025",
    meta: "Data Visualization",
    headline: "Visualizes civilization statistics and generates reports.",
    description: "An interactive analytics dashboard built to process complex civilization datasets, visualize them through dynamic charts, and automatically compile structured PDF reports.",
    stack: ["Python", "Streamlit", "Pandas", "Plotly", "ReportLab"],
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=2000",
    href: "https://galactic-civilization-dashboard-bw3w5rjzfhanw896jfmvwm.streamlit.app/",
    links: [
      { label: "Live Demo", url: "https://galactic-civilization-dashboard-bw3w5rjzfhanw896jfmvwm.streamlit.app/" },
      { label: "GitHub", url: "#" }
    ],
    highlight: "Analyzes 50+ civilization parameters with dynamic charts & automated PDF generation."
  },
  {
    title: "Library System",
    date: "Oct 2025",
    meta: "Desktop Application",
    headline: "App for books, members, issues, returns and fines.",
    description: "A robust desktop application relying on solid object-oriented principles to manage the complete lifecycle of library inventory and member transactions.",
    stack: ["Java", "OOP", "Swing", "File Handling"],
    image: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=80&w=2000",
    href: "#",
    links: [{ label: "GitHub", url: "#" }],
    highlight: "Manages 1,000+ cataloged records with robust transaction state and fine calculation."
  }
];

/* ============================================
   Animated Counter (counts up on viewport enter)
   ============================================ */
function AnimatedCounter({ value, suffix = "", decimals = 0, className = "" }: { value: number; suffix?: string; decimals?: number; className?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !hasAnimated.current) {
        hasAnimated.current = true;
        const duration = 2000;
        const startTime = performance.now();
        const animate = (now: number) => {
          const elapsed = now - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setCount(parseFloat((eased * value).toFixed(decimals)));
          if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
      }
    }, { threshold: 0.5 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [value, decimals]);

  return <span ref={ref} className={className}>{decimals > 0 ? count.toFixed(decimals) : count}{suffix}</span>;
}

/* ============================================
   Projects WebGL Slider (adapted from Lumina)
   ============================================ */
declare const gsap: any;
declare const THREE: any;

function ProjectsSlider() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [fallbackMode, setFallbackMode] = useState(() => {
    if (typeof window === 'undefined') return false;
    return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  });

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onMotionChange = (e: MediaQueryListEvent) => {
      if (e.matches) setFallbackMode(true);
    };
    motionQuery.addEventListener?.('change', onMotionChange);

    if (motionQuery.matches) {
      setFallbackMode(true);
      return () => motionQuery.removeEventListener?.('change', onMotionChange);
    }

    const isWebGLAvailable = () => {
      try {
        const c = document.createElement('canvas');
        return !!(window.WebGLRenderingContext && (c.getContext('webgl') || c.getContext('experimental-webgl')));
      } catch {
        return false;
      }
    };

    if (!isWebGLAvailable()) {
      setFallbackMode(true);
      return () => motionQuery.removeEventListener?.('change', onMotionChange);
    }

    const container = containerRef.current;
    if (!container) return;
    let cleanupFn: (() => void) | null = null;

    const loadScript = (src: string, globalName: string) => new Promise<void>((res, rej) => {
      if ((window as any)[globalName]) { res(); return; }
      if (document.querySelector(`script[src="${src}"]`)) {
        const check = setInterval(() => { if ((window as any)[globalName]) { clearInterval(check); res(); } }, 50);
        setTimeout(() => { clearInterval(check); rej(new Error(`Timeout ${globalName}`)); }, 10000);
        return;
      }
      const s = document.createElement('script');
      s.src = src;
      s.onload = () => setTimeout(() => res(), 100);
      s.onerror = () => rej(new Error(`Failed: ${src}`));
      document.head.appendChild(s);
    });

    const init = async () => {
      try {
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js', 'gsap');
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', 'THREE');
      } catch (e) {
        console.warn('Script load failed, falling back to static grid:', e);
        setFallbackMode(true);
        return;
      }

      const slides = PROJECTS.map(p => ({
        title: p.title,
        description: p.headline,
        highlight: p.highlight,
        role: (p as any).role,
        media: p.image,
        fallbackMedia: (p as any).fallbackImage,
        stack: p.stack,
        links: p.links,
        meta: p.meta,
      }));

      // --- State ---
      let currentSlideIndex = 0, isTransitioning = false;
      let shaderMaterial: any, renderer: any, scene: any, camera: any;
      let slideTextures: any[] = [], texturesLoaded = false, sliderEnabled = false;
      let autoSlideTimer: any = null, progressAnimation: any = null, animFrameId: number | null = null;
      const TRANSITION_DURATION = 2.5, AUTO_SLIDE_SPEED = 8000, PROGRESS_INTERVAL = 50;

      const getSize = () => ({ w: container.offsetWidth, h: container.offsetHeight });
      const $ = (sel: string) => container.querySelector(sel);
      const $$ = (sel: string) => container.querySelectorAll(sel);

      // --- Shaders ---
      const vertexShader = `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;
      const fragmentShader = `
        uniform sampler2D uTexture1, uTexture2;
        uniform float uProgress;
        uniform vec2 uResolution, uTexture1Size, uTexture2Size;
        uniform float uGlobalIntensity, uSpeedMultiplier, uDistortionStrength;
        uniform float uGlassRefraction, uGlassChrAb, uGlassBubble, uGlassEdge, uGlassFlow;
        varying vec2 vUv;
        vec2 coverUV(vec2 uv, vec2 ts) {
          vec2 s = uResolution / ts; float sc = max(s.x, s.y);
          vec2 ss = ts * sc; vec2 o = (uResolution - ss) * 0.5;
          return (uv * uResolution - o) / ss;
        }
        void main() {
          float progress = uProgress;
          float time = progress * 5.0 * uSpeedMultiplier;
          vec2 uv1 = coverUV(vUv, uTexture1Size);
          vec2 uv2 = coverUV(vUv, uTexture2Size);
          float maxR = length(uResolution) * 0.85;
          float br = progress * maxR;
          vec2 p = vUv * uResolution, c = uResolution * 0.5;
          float d = length(p - c);
          float nd = d / max(br, 0.001);
          float param = smoothstep(br + 3.0, br - 3.0, d);
          vec4 img;
          if (param > 0.0) {
            float ro = 0.08 * uGlassRefraction * uDistortionStrength * uGlobalIntensity * pow(smoothstep(0.3 * uGlassBubble, 1.0, nd), 1.5);
            vec2 dir = (d > 0.0) ? (p - c) / d : vec2(0.0);
            vec2 distUV = uv2 - dir * ro;
            distUV += vec2(sin(time + nd * 10.0), cos(time * 0.8 + nd * 8.0)) * 0.015 * uGlassFlow * uSpeedMultiplier * nd * param;
            float ca = 0.02 * uGlassChrAb * uGlobalIntensity * pow(smoothstep(0.3, 1.0, nd), 1.2);
            img = vec4(texture2D(uTexture2, distUV + dir * ca * 1.2).r, texture2D(uTexture2, distUV + dir * ca * 0.2).g, texture2D(uTexture2, distUV - dir * ca * 0.8).b, 1.0);
            float rim = smoothstep(0.95, 1.0, nd) * (1.0 - smoothstep(1.0, 1.01, nd));
            img.rgb += rim * 0.08 * uGlassEdge * uGlobalIntensity;
          } else { img = texture2D(uTexture2, uv2); }
          vec4 oldImg = texture2D(uTexture1, uv1);
          if (progress > 0.95) img = mix(img, texture2D(uTexture2, uv2), (progress - 0.95) / 0.05);
          gl_FragColor = mix(oldImg, img, param);
        }
      `;

      // --- Text helpers ---
      const splitText = (text: string) => text.split('').map(c => `<span style="display:inline-block;opacity:0">${c === ' ' ? '&nbsp;' : c}</span>`).join('');

      const updateContent = (idx: number) => {
        const titleEl = $('#projTitle') as HTMLElement;
        const descEl = $('#projDesc') as HTMLElement;
        const highlightEl = $('#projHighlight') as HTMLElement;
        const metaEl = $('#projMeta') as HTMLElement;
        const actionsEl = $('#projActions') as HTMLElement;
        if (!titleEl || !descEl) return;

        gsap.to(titleEl.children, { y: -20, opacity: 0, duration: 0.4, stagger: 0.012, ease: "power2.in" });
        gsap.to([descEl, highlightEl, metaEl, actionsEl].filter(Boolean), { y: -10, opacity: 0, duration: 0.3, ease: "power2.in" });

        setTimeout(() => {
          const slide = slides[idx];
          titleEl.innerHTML = splitText(slide.title);
          descEl.textContent = slide.description;
          if (highlightEl) {
            const parts: string[] = [];
            if (slide.highlight) parts.push(`<span>${slide.highlight}</span>`);
            if (slide.role) parts.push(`<span class="text-[#00E5FF] font-medium">${slide.role}</span>`);
            highlightEl.innerHTML = parts.join(' <span class="text-zinc-600 mx-1.5">•</span> ');
            gsap.set(highlightEl, { y: 15, opacity: 0 });
          }
          gsap.set(titleEl.children, { y: 20, opacity: 0 });
          gsap.set(descEl, { y: 15, opacity: 0 });

          if (metaEl) {
            metaEl.innerHTML = slide.stack.map((t: string) => `<span class="slide-tech-pill">${t}</span>`).join('');
            gsap.set(metaEl.children, { y: 10, opacity: 0 });
          }
          if (actionsEl) {
            const activeLinks = (slide.links || []).filter((l: any) => l.url && l.url !== '#' && l.url.trim() !== '');
            actionsEl.innerHTML = activeLinks.map((l: any, i: number) =>
              `<a href="${l.url}" target="_blank" rel="noopener noreferrer" class="slide-action-btn${i === 0 ? ' primary' : ''}">${l.label}</a>`
            ).join('');
            gsap.set(actionsEl.children, { y: 10, opacity: 0 });
          }

          const ch = titleEl.children;
          const anims = [
            () => { gsap.to(ch, { y: 0, opacity: 1, duration: 0.8, stagger: 0.022, ease: "power3.out" }); },
            () => { gsap.set(ch, { y: -20 }); gsap.to(ch, { y: 0, opacity: 1, duration: 0.8, stagger: 0.022, ease: "back.out(1.7)" }); },
            () => { gsap.set(ch, { filter: "blur(8px)", scale: 1.3, y: 0 }); gsap.to(ch, { filter: "blur(0px)", scale: 1, opacity: 1, duration: 1, stagger: { amount: 0.4, from: "random" }, ease: "power2.out" }); },
            () => { gsap.set(ch, { scale: 0, y: 0 }); gsap.to(ch, { scale: 1, opacity: 1, duration: 0.6, stagger: 0.04, ease: "back.out(1.5)" }); },
          ];
          anims[idx % anims.length]();

          gsap.to(descEl, { y: 0, opacity: 1, duration: 0.8, delay: 0.12, ease: "power3.out" });
          if (highlightEl) gsap.to(highlightEl, { y: 0, opacity: 1, duration: 0.8, delay: 0.18, ease: "power3.out" });
          if (metaEl) gsap.to(metaEl.children, { y: 0, opacity: 1, duration: 0.6, delay: 0.24, stagger: 0.025, ease: "power3.out" });
          if (actionsEl) gsap.to(actionsEl.children, { y: 0, opacity: 1, duration: 0.6, delay: 0.32, stagger: 0.05, ease: "power3.out" });
        }, 420);
      };

      // --- Navigation ---
      const updateNavState = (idx: number) => $$('.slide-nav-item').forEach((el, i) => el.classList.toggle('active', i === idx));
      const updateProgress = (idx: number, prog: number) => { const el = $$('.slide-nav-item')[idx]?.querySelector('.slide-progress-fill') as HTMLElement; if (el) { el.style.width = `${prog}%`; el.style.opacity = '1'; } };
      const fadeProgress = (idx: number) => { const el = $$('.slide-nav-item')[idx]?.querySelector('.slide-progress-fill') as HTMLElement; if (el) { el.style.opacity = '0'; setTimeout(() => el.style.width = '0%', 300); } };
      const quickResetProgress = (idx: number) => { const el = $$('.slide-nav-item')[idx]?.querySelector('.slide-progress-fill') as HTMLElement; if (el) { el.style.transition = 'width 0.2s ease-out'; el.style.width = '0%'; setTimeout(() => el.style.transition = 'width 0.1s ease, opacity 0.3s ease', 200); } };
      const updateCounter = (idx: number) => {
        const n = $('#projNum') as HTMLElement; if (n) n.textContent = String(idx + 1).padStart(2, '0');
        const t = $('#projTotal') as HTMLElement; if (t) t.textContent = String(slides.length).padStart(2, '0');
      };

      // --- Timer ---
      const stopTimer = () => { if (progressAnimation) clearInterval(progressAnimation); if (autoSlideTimer) clearTimeout(autoSlideTimer); progressAnimation = null; autoSlideTimer = null; };
      const startTimer = () => {
        if (!texturesLoaded || !sliderEnabled) return;
        if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          stopTimer();
          return;
        }
        stopTimer();
        let progress = 0;
        const increment = (100 / AUTO_SLIDE_SPEED) * PROGRESS_INTERVAL;
        progressAnimation = setInterval(() => {
          if (!sliderEnabled) { stopTimer(); return; }
          progress += increment;
          updateProgress(currentSlideIndex, progress);
          if (progress >= 100) {
            clearInterval(progressAnimation); progressAnimation = null;
            fadeProgress(currentSlideIndex);
            if (!isTransitioning) handleChange();
          }
        }, PROGRESS_INTERVAL);
      };
      const safeStartTimer = (delay = 0) => {
        stopTimer();
        if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          return;
        }
        if (sliderEnabled && texturesLoaded) {
          if (delay > 0) autoSlideTimer = setTimeout(startTimer, delay);
          else startTimer();
        }
      };

      // --- Slide transition ---
      const navigate = (targetIdx: number) => {
        if (isTransitioning || targetIdx === currentSlideIndex) return;
        stopTimer();
        quickResetProgress(currentSlideIndex);
        const curTex = slideTextures[currentSlideIndex], tarTex = slideTextures[targetIdx];
        if (!curTex || !tarTex) return;
        isTransitioning = true;
        const u = shaderMaterial.uniforms;
        u.uTexture1.value = curTex; u.uTexture2.value = tarTex;
        u.uTexture1Size.value = curTex.userData.size; u.uTexture2Size.value = tarTex.userData.size;
        updateContent(targetIdx);
        currentSlideIndex = targetIdx;
        updateCounter(currentSlideIndex);
        updateNavState(currentSlideIndex);
        gsap.fromTo(u.uProgress, { value: 0 }, {
          value: 1, duration: TRANSITION_DURATION, ease: "power2.inOut",
          onComplete: () => {
            u.uProgress.value = 0;
            u.uTexture1.value = tarTex; u.uTexture1Size.value = tarTex.userData.size;
            isTransitioning = false;
            safeStartTimer(100);
          }
        });
      };
      const handleChange = () => { if (!isTransitioning && texturesLoaded && sliderEnabled) navigate((currentSlideIndex + 1) % slides.length); };

      // --- Build nav ---
      const createNav = () => {
        const nav = $('#projNav') as HTMLElement; if (!nav) return;
        nav.innerHTML = '';
        slides.forEach((slide, i) => {
          const item = document.createElement('div');
          item.className = `slide-nav-item${i === 0 ? ' active' : ''}`;
          item.innerHTML = `<div class="slide-progress-line"><div class="slide-progress-fill"></div></div><div class="slide-nav-title">${slide.title}</div>`;
          item.addEventListener('click', (e) => {
            e.stopPropagation();
            if (!isTransitioning && i !== currentSlideIndex) { stopTimer(); quickResetProgress(currentSlideIndex); navigate(i); }
          });
          nav.appendChild(item);
        });
      };

      // --- Texture loading ---
      const loadTexture = (src: string, fallback?: string) => new Promise<any>((resolve, reject) => {
        const l = new THREE.TextureLoader();
        const tryLoad = (url: string, isFallback: boolean) => {
          l.load(
            url,
            (t: any) => {
              t.minFilter = t.magFilter = THREE.LinearFilter;
              t.userData = { size: new THREE.Vector2(t.image.width || 1920, t.image.height || 1080) };
              resolve(t);
            },
            undefined,
            (err: any) => {
              if (!isFallback && fallback) {
                tryLoad(fallback, true);
              } else {
                reject(err);
              }
            }
          );
        };
        tryLoad(src, false);
      });

      // --- Init renderer ---
      const canvas = container.querySelector('.webgl-canvas') as HTMLCanvasElement;
      if (!canvas) return;
      const { w, h } = getSize();
      scene = new THREE.Scene();
      camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
      renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false });
      renderer.setSize(w, h);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

      shaderMaterial = new THREE.ShaderMaterial({
        uniforms: {
          uTexture1: { value: null }, uTexture2: { value: null }, uProgress: { value: 0 },
          uResolution: { value: new THREE.Vector2(w, h) },
          uTexture1Size: { value: new THREE.Vector2(1, 1) }, uTexture2Size: { value: new THREE.Vector2(1, 1) },
          uGlobalIntensity: { value: 1.0 }, uSpeedMultiplier: { value: 1.0 }, uDistortionStrength: { value: 1.0 },
          uGlassRefraction: { value: 1.0 }, uGlassChrAb: { value: 1.0 }, uGlassBubble: { value: 1.0 }, uGlassEdge: { value: 1.0 }, uGlassFlow: { value: 1.0 },
        },
        vertexShader, fragmentShader,
      });
      scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), shaderMaterial));

      // --- Create nav and set initial content ---
      createNav();
      updateCounter(0);
      const titleEl = container.querySelector('#projTitle') as HTMLElement;
      const descEl = container.querySelector('#projDesc') as HTMLElement;
      const highlightEl = container.querySelector('#projHighlight') as HTMLElement;
      const metaEl = container.querySelector('#projMeta') as HTMLElement;
      const actionsEl = container.querySelector('#projActions') as HTMLElement;

      if (titleEl && descEl) {
        titleEl.innerHTML = splitText(slides[0].title);
        descEl.textContent = slides[0].description;
        if (highlightEl) {
          const parts: string[] = [];
          if (slides[0].highlight) parts.push(`<span>${slides[0].highlight}</span>`);
          if (slides[0].role) parts.push(`<span class="text-[#00E5FF] font-medium">${slides[0].role}</span>`);
          highlightEl.innerHTML = parts.join(' <span class="text-zinc-600 mx-1.5">•</span> ');
        }
        if (metaEl) metaEl.innerHTML = slides[0].stack.map((t: string) => `<span class="slide-tech-pill">${t}</span>`).join('');
        if (actionsEl) {
          const activeLinks = (slides[0].links || []).filter((l: any) => l.url && l.url !== '#' && l.url.trim() !== '');
          actionsEl.innerHTML = activeLinks.map((l: any, i: number) =>
            `<a href="${l.url}" target="_blank" rel="noopener noreferrer" class="slide-action-btn${i === 0 ? ' primary' : ''}">${l.label}</a>`
          ).join('');
        }
        gsap.fromTo(titleEl.children, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 1, stagger: 0.022, ease: "power3.out", delay: 0.5 });
        gsap.fromTo(descEl, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.7 });
        if (highlightEl) gsap.fromTo(highlightEl, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.78 });
        if (metaEl) gsap.fromTo(metaEl.children, { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.025, ease: "power3.out", delay: 0.85 });
        if (actionsEl) gsap.fromTo(actionsEl.children, { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.05, ease: "power3.out", delay: 1.0 });
      }

      // --- Fallback canvas texture if an image fails to load ---
      const createPlaceholderTexture = () => {
        const cvs = document.createElement('canvas');
        cvs.width = 1920; cvs.height = 1080;
        const ctx = cvs.getContext('2d');
        if (ctx) {
          const grad = ctx.createLinearGradient(0, 0, 1920, 1080);
          grad.addColorStop(0, '#0a0a0a');
          grad.addColorStop(1, '#002530');
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, 1920, 1080);
        }
        const t = new THREE.CanvasTexture(cvs);
        t.minFilter = t.magFilter = THREE.LinearFilter;
        t.userData = { size: new THREE.Vector2(1920, 1080) };
        return t;
      };

      // --- Load textures in strict 1-to-1 slide order ---
      const loadAll = async () => {
        const loaded: any[] = new Array(slides.length).fill(null);
        await Promise.all(
          slides.map(async (s, idx) => {
            try {
              loaded[idx] = await loadTexture(s.media, s.fallbackMedia);
            } catch (err) {
              console.warn(`Texture failed for slide ${idx}:`, s.media, err);
              loaded[idx] = createPlaceholderTexture();
            }
          })
        );
        slideTextures = loaded.map(t => t || createPlaceholderTexture());
        if (slideTextures.length >= 2) {
          const u = shaderMaterial.uniforms;
          u.uTexture1.value = slideTextures[0]; u.uTexture2.value = slideTextures[1];
          u.uTexture1Size.value = slideTextures[0].userData.size; u.uTexture2Size.value = slideTextures[1].userData.size;
          texturesLoaded = true; sliderEnabled = true;
          container.classList.add('loaded');
          safeStartTimer(500);
        } else {
          setFallbackMode(true);
        }
      };
      loadAll();

      // --- Render loop (only render when transitioning for perf) ---
      let needsRender = true;
      const renderLoop = () => {
        animFrameId = requestAnimationFrame(renderLoop);
        if (needsRender || isTransitioning) {
          renderer.render(scene, camera);
          if (!isTransitioning && needsRender) {
            // Render a few extra frames after textures load, then stop
            setTimeout(() => { needsRender = false; }, 500);
          }
        }
      };
      // Override: always render to keep it simple (the slider is off-screen when not visible)
      const renderLoopSimple = () => {
        animFrameId = requestAnimationFrame(renderLoopSimple);
        renderer.render(scene, camera);
      };
      renderLoopSimple();

      // --- Resize ---
      const observer = new ResizeObserver(() => {
        const { w: nw, h: nh } = getSize();
        renderer.setSize(nw, nh);
        shaderMaterial.uniforms.uResolution.value.set(nw, nh);
      });
      observer.observe(container);

      // --- Visibility ---
      const onVis = () => { if (document.hidden) stopTimer(); else if (!isTransitioning) safeStartTimer(); };
      document.addEventListener('visibilitychange', onVis);

      // --- Cleanup ---
      cleanupFn = () => {
        motionQuery.removeEventListener?.('change', onMotionChange);
        observer.disconnect();
        document.removeEventListener('visibilitychange', onVis);
        stopTimer();
        if (animFrameId !== null) cancelAnimationFrame(animFrameId);
        slideTextures.forEach((t: any) => t.dispose());
        if (shaderMaterial) shaderMaterial.dispose();
        if (renderer) renderer.dispose();
      };
    };

    init();
    return () => { if (cleanupFn) cleanupFn(); };
  }, []);

  if (fallbackMode) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {PROJECTS.map((project) => {
          const activeLinks = (project.links || []).filter(l => l.url && l.url !== '#' && l.url.trim() !== '');
          return (
            <div
              key={project.title}
              className="glass-card flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a]/90 hover:border-[#00E5FF]/40 transition-colors"
            >
              <div className="relative aspect-video w-full overflow-hidden bg-zinc-900">
                <img
                  src={project.image}
                  alt={project.title}
                  onError={(e) => {
                    if (project.fallbackImage && e.currentTarget.src !== project.fallbackImage) {
                      e.currentTarget.src = project.fallbackImage;
                    }
                  }}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6 md:p-8 flex flex-col flex-1 justify-between space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono text-zinc-500">
                    <span>{project.date}</span>
                    <span>{project.meta}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white tracking-tight">{project.title}</h3>
                  <p className="text-sm text-zinc-300 leading-relaxed">{project.headline}</p>
                  {project.highlight && (
                    <p className="text-xs font-mono text-zinc-400">
                      {project.highlight}
                      {(project as any).role && <span className="text-[#00E5FF] ml-2">• {(project as any).role}</span>}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {project.stack.map(tech => (
                      <span key={tech} className="slide-tech-pill text-[10px]">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {activeLinks.length > 0 && (
                  <div className="flex flex-wrap gap-3 pt-2">
                    {activeLinks.map((link, i) => (
                      <a
                        key={link.label}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`slide-action-btn${i === 0 ? ' primary' : ''}`}
                      >
                        {link.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div ref={containerRef} className="slider-wrapper">
      <canvas className="webgl-canvas" aria-hidden="true" />
      <div className="slide-counter">
        <span id="projNum">01</span>
        <span style={{ opacity: 0.3 }}> / </span>
        <span id="projTotal">04</span>
      </div>
      <div className="slide-content">
        <h3 className="slide-title" id="projTitle" />
        <p className="slide-description" id="projDesc" />
        <p className="slide-highlight" id="projHighlight" />
        <div className="slide-meta" id="projMeta" />
        <div className="slide-actions" id="projActions" />
      </div>
      <nav className="slides-navigation" id="projNav" />
    </div>
  );
}

/* ============================================
   Glassmorphic Spotlight Card
   ============================================ */
function SpotlightCard({ children, className, padding = "p-8" }: any) {
  return (
    <div
      className={cn(
        "glass-card group relative flex flex-col",
        className
      )}
    >
      <div className={cn("relative z-10 flex h-full flex-col", padding)}>
        {children}
      </div>
    </div>
  );
}

/* ============================================
   Text Reveal Animation (optimized)
   ============================================ */
function TextReveal({ text, className }: { text: string; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.8, ease: premiumEase }}
      className={className}
    >
      {text}
    </motion.div>
  );
}

/* ============================================
   Particle Drift Background Field
   ============================================ */
function AmbientBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      <ParticleDrift className="w-full h-full" />
    </div>
  );
}

/* ============================================
   Scroll-To-Top Button
   ============================================ */
function ScrollToTop({ visible }: { visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.3, ease: premiumEase }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Scroll to top"
          className="fixed bottom-8 right-8 z-40 p-3 rounded-full bg-[#00E5FF]/10 border border-[#00E5FF]/25 text-[#00E5FF] backdrop-blur-md hover:bg-[#00E5FF]/20 transition-colors shadow-lg"
        >
          <ArrowUp className="w-5 h-5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

/* ============================================
   Timeline Item Component (for Experience/Education)
   ============================================ */
function TimelineItem({ date, title, subtitle, description, score, isFirst = false, accentDot = false }: {
  date: string;
  title: string;
  subtitle: string;
  description?: string;
  score?: string;
  isFirst?: boolean;
  accentDot?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-5%" }}
      transition={{ duration: 0.6, ease: premiumEase }}
      className="relative pl-8 pb-10 last:pb-0 group"
    >
      {/* Vertical line */}
      <div className="absolute left-[5px] top-[14px] bottom-0 w-px bg-gradient-to-b from-white/15 to-transparent group-last:hidden" />

      {/* Dot */}
      <div className={cn(
        "absolute left-0 top-[6px] w-[11px] h-[11px] rounded-full border-2 transition-all duration-300",
        accentDot
          ? "border-[#00E5FF] bg-[#00E5FF]/20 shadow-[0_0_12px_rgba(0,229,255,0.4)] group-hover:bg-[#00E5FF]/40"
          : "border-zinc-500 bg-zinc-900 group-hover:border-zinc-300"
      )} />

      {/* Date badge */}
      <span className={cn(
        "inline-block text-[11px] font-mono tracking-widest uppercase px-3 py-1 rounded-md mb-3",
        accentDot
          ? "text-[#00E5FF] bg-[#00E5FF]/10 border border-[#00E5FF]/20"
          : "text-zinc-400 bg-white/5 border border-white/5"
      )}>
        {date}
      </span>

      {/* Title */}
      <h4 className="text-xl font-bold text-white tracking-tight mt-1 group-hover:text-[#00E5FF]/90 transition-colors duration-300">{title}</h4>

      {/* Subtitle */}
      <p className="text-sm font-mono text-zinc-500 uppercase tracking-wider mt-1">{subtitle}</p>

      {/* Score */}
      {score && (
        <div className="mt-2 inline-flex items-center gap-2">
          <span className="text-[#00E5FF] font-bold text-sm">{score}</span>
        </div>
      )}

      {/* Description */}
      {description && (
        <p className="text-zinc-400 text-sm mt-3 leading-relaxed max-w-lg">{description}</p>
      )}
    </motion.div>
  );
}

/* ============================================
   Main Portfolio Component
   ============================================ */
export default function Portfolio() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    document.title = "Jatin Choudhary | CSE student, C++ and Python, UI/UX";
  }, []);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 50);
          setShowScrollTop(window.scrollY > 500);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: "Projects", href: "#projects" },
    { label: "Research", href: "#research" },
    { label: "Experience", href: "#experience" },
    { label: "Skills", href: "#skills" },
  ];

  return (
    <div className="min-h-screen bg-transparent text-zinc-300 font-sans selection:bg-[#00E5FF] selection:text-black relative overflow-x-hidden">
      <AmbientBackground />

      {/* ── Fixed Header ── */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: premiumEase }}
        className={cn(
          "fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 md:px-12 backdrop-blur-xl border-b border-white/5 transition-all duration-500",
          scrolled ? "py-3 bg-black/80" : "py-5 bg-black/40"
        )}
      >
        <a href="#" className="font-bold text-white tracking-tight hover:text-[#00E5FF] transition-colors">JATIN CHOUDHARY.</a>
        <div className="hidden md:flex gap-8 text-xs font-mono font-bold tracking-widest uppercase text-zinc-400">
          {navLinks.map(link => (
            <a key={link.label} href={link.href} className="hover:text-[#00E5FF] transition-colors">{link.label}</a>
          ))}
        </div>
        <button className="md:hidden text-white p-1" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Menu">
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </motion.nav>

      {/* ── Mobile Menu Overlay ── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[55] bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-center gap-10 md:hidden"
          >
            {navLinks.map((link, i) => (
              <motion.a
                key={link.label}
                href={link.href}
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.5, ease: premiumEase }}
                className="text-3xl font-bold text-white tracking-tight hover:text-[#00E5FF] transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main Content ── */}
      <main className="max-w-[1400px] mx-auto px-6 md:px-12 pt-32 pb-24 space-y-48 relative z-10">

        {/* ── Section 1: Hero ── */}
        <section className="min-h-[90vh] flex flex-col justify-center relative">
          <div className="flex flex-col lg:flex-row items-center lg:items-center gap-16 lg:gap-24">
            {/* Left: Text content */}
            <div className="flex-1 space-y-6 text-center lg:text-left order-2 lg:order-1">
              {/* Role tag */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: premiumEase }}
              >
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#00E5FF]/8 border border-[#00E5FF]/15 text-[#00E5FF] text-xs font-mono uppercase tracking-[0.2em]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] animate-pulse" />
                  C++ brain, Figma hands
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, delay: 0.1, ease: premiumEase }}
                className="text-6xl md:text-8xl lg:text-[6.5rem] font-black tracking-[-0.04em] text-white leading-[0.9]"
              >
                Jatin<br />Choudhary
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.2, delay: 0.35, ease: premiumEase }}
                className="text-base md:text-lg text-zinc-400 leading-relaxed max-w-lg mx-auto lg:mx-0"
              >
                Second year CSE at SATI. I solve problems in C++, build backends in Python, and design the interface when nobody else will. Half grid, half graph, still figuring out the rest.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.55, ease: premiumEase }}
                className="flex flex-wrap gap-4 justify-center lg:justify-start items-center"
              >
                <ShinyButton href="#projects">
                  View my work <ChevronRight className="w-4 h-4" />
                </ShinyButton>
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-sm font-semibold tracking-wider uppercase text-zinc-300 border border-white/10 hover:border-white/25 hover:text-white transition-all duration-500 hover:bg-white/5"
                >
                  Get in touch
                </a>
                <a
                  href="mailto:choudharyjatin.3110@gmail.com?subject=Resume%20Request%20-%20Jatin%20Choudhary"
                  className="inline-flex items-center gap-2 px-6 py-4 rounded-full text-sm font-semibold tracking-wider uppercase text-[#00E5FF] border border-[#00E5FF]/25 hover:border-[#00E5FF]/50 hover:bg-[#00E5FF]/10 transition-all duration-500"
                >
                  Resume
                </a>
              </motion.div>
            </div>

            {/* Right: Profile Photo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.4, delay: 0.2, ease: premiumEase }}
              className="relative flex-shrink-0 order-1 lg:order-2"
            >
              <div className="relative w-64 h-64 md:w-80 md:h-80 lg:w-[380px] lg:h-[380px]">
                {/* Outer glow */}
                <div className="absolute -inset-4 rounded-full bg-gradient-to-br from-[#00E5FF]/15 via-transparent to-[#00E5FF]/5 blur-2xl animate-pulse" style={{ animationDuration: '4s' }} />
                {/* Glow ring */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#00E5FF]/20 to-transparent blur-xl" />
                {/* Photo circle */}
                <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-white/10 shadow-[0_0_80px_-15px_rgba(0,229,255,0.25)] bg-gradient-to-br from-[#00E5FF]/20 to-[#030509]">
                  <img
                    src={`${import.meta.env.BASE_URL}images/hero.jpg`}
                    alt="Jatin Choudhary"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Highlight badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.9, ease: premiumEase }}
            className="mt-24"
          >
            <p className="text-[11px] font-mono tracking-[0.25em] uppercase text-zinc-600 mb-5">Highlights</p>
            <div className="flex flex-wrap gap-3">
              {[
                { icon: "⚡", label: "270+ LeetCode" },
                { icon: "🎓", label: "GPA 8.00" },
                { icon: "🏆", label: "Smart India Hackathon 2026 (Selected)" },
                { icon: "📝", label: "Research paper in preparation" },
                { icon: "🎨", label: "UI/UX @ Xenon Media" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="glass-card flex items-center gap-2.5 px-5 py-3 !rounded-xl text-zinc-300 text-sm font-medium"
                >
                  <span className="text-base">{item.icon}</span>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ── Section 2: Projects (Lumina WebGL Slider) ── */}
        <section id="projects" className="space-y-12">
          <div className="space-y-4">
            <TextReveal text="PROJECTS" className="text-4xl md:text-6xl font-black tracking-[-0.03em] text-white" />
            <p className="text-[#00E5FF] font-mono text-xs tracking-[0.2em] uppercase">Interactive Showcase — Click or use navigation to explore</p>
          </div>
          <ProjectsSlider />
        </section>

        {/* ── Section 3: Research ── */}
        <section id="research" className="space-y-12">
          <div className="space-y-4">
            <TextReveal text="RESEARCH" className="text-4xl md:text-6xl font-black tracking-[-0.03em] text-white" />
          </div>
          <SpotlightCard className="p-8 md:p-12 lg:p-16 border-[#00E5FF]/20 bg-[#0A0A0A]/80 overflow-hidden">
            <div className="flex flex-col lg:flex-row gap-12 items-center">
              <div className="w-full lg:w-1/2 space-y-8 relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00E5FF]/10 border border-[#00E5FF]/20 text-[#00E5FF] text-xs font-mono uppercase tracking-widest">
                  <BookOpen className="w-3 h-3" />
                  In Preparation
                </div>
                <h3 className="text-2xl md:text-4xl font-bold text-white tracking-tight leading-tight">
                  Integrated Railway Maintenance Block Bundling: A Conceptual Decision Support Framework
                </h3>
                <p className="text-zinc-400 text-lg leading-relaxed">
                  A framework for planning railway maintenance blocks. Compatible tasks are grouped first, then scheduled with constraint programming. Machine learning only refines estimates, and humans make the final call.
                </p>
                <div className="bg-[#1A1C21] border border-white/5 p-6 rounded-2xl">
                  <p className="text-zinc-300 text-sm">
                    <span className="text-white font-bold mr-2">Note:</span>
                    Evaluated on synthetic scenarios. The 22.6% saving in the paper is an illustrative example, not a field result.
                  </p>
                </div>
                <p className="text-sm font-mono text-zinc-500">
                  Co-author with five peers and faculty guide Prof. Garima Jain, SATI Vidisha.
                </p>
              </div>
              <div className="w-full lg:w-1/2 relative group z-10">
                <div className="absolute -inset-4 bg-gradient-to-tr from-[#00E5FF]/20 to-transparent opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-700 pointer-events-none" />
                <div className="relative rounded-xl overflow-hidden border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)] transition-all duration-700 ease-out group-hover:scale-[1.02] group-hover:-rotate-1 group-hover:border-[#00E5FF]/30 bg-[#1A1C21] min-h-[300px] flex items-center justify-center">
                  <div className="absolute inset-0 bg-[#00E5FF]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-overlay z-10 pointer-events-none" />
                  <img
                    src={`${import.meta.env.BASE_URL}images/research-paper.png`}
                    alt="Integrated Railway Maintenance Block Bundling — Research Paper"
                    className="w-full h-auto object-contain opacity-90 group-hover:opacity-100 transition-all duration-700 relative z-20"
                  />
                </div>
              </div>
            </div>
          </SpotlightCard>
        </section>

        {/* ── Section 4: Experience & Education ── */}
        <section id="experience" className="space-y-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Column: Experience + Education */}
            <div className="space-y-16">
              {/* Experience */}
              <div className="space-y-8">
                <div className="flex items-center gap-4">
                  <div className="p-2.5 rounded-xl bg-[#00E5FF]/8 border border-[#00E5FF]/15">
                    <Briefcase className="w-5 h-5 text-[#00E5FF]" />
                  </div>
                  <TextReveal text="EXPERIENCE" className="text-3xl md:text-5xl font-black tracking-[-0.03em] text-white" />
                </div>

                <SpotlightCard padding="p-8 md:p-10">
                  <TimelineItem
                    date="Oct 2025 — May 2026"
                    title="Junior UI/UX Designer"
                    subtitle="Xenon Media India"
                    description="Designed website and mobile app screens in Figma and Elementor. Kept the design system consistent and shipped on schedule."
                    accentDot={true}
                  />
                </SpotlightCard>
              </div>

              {/* Education */}
              <div className="space-y-8">
                <div className="flex items-center gap-4">
                  <div className="p-2.5 rounded-xl bg-[#00E5FF]/8 border border-[#00E5FF]/15">
                    <GraduationCap className="w-5 h-5 text-[#00E5FF]" />
                  </div>
                  <TextReveal text="EDUCATION" className="text-3xl md:text-5xl font-black tracking-[-0.03em] text-white" />
                </div>

                <SpotlightCard padding="p-8 md:p-10">
                  <TimelineItem
                    date="2025 — 2029"
                    title="B.Tech Computer Science & Engineering"
                    subtitle="Samrat Ashok Technological Institute (SATI), Vidisha"
                    score="GPA: 8.00 / 10.0"
                    description="Core coursework in Data Structures, Algorithms, Discrete Mathematics & Computer Architecture. NPTEL Algorithm Design and Analysis."
                    accentDot={true}
                    isFirst={true}
                  />
                  <TimelineItem
                    date="2023 — 2025"
                    title="Higher Secondary (Class XII)"
                    subtitle="Holy Family Convent School, Indore, CBSE"
                    score="Score: 85.4%"
                    description="Physics, Chemistry, Mathematics, Computer Science (PCM+CS)."
                  />
                  <TimelineItem
                    date="2021 — 2023"
                    title="High School (Class X)"
                    subtitle="Holy Family Convent School, Indore, CBSE"
                    score="Score: 94.7%"
                    description="Mathematics and Science distinction, 94.7% aggregate."
                  />
                </SpotlightCard>
              </div>
            </div>

            {/* Right Column: Skills */}
            <div className="space-y-16" id="skills">
              <div className="space-y-8">
                <div className="flex items-center gap-4">
                  <div className="p-2.5 rounded-xl bg-[#00E5FF]/8 border border-[#00E5FF]/15">
                    <Code2 className="w-5 h-5 text-[#00E5FF]" />
                  </div>
                  <TextReveal text="SKILLS" className="text-3xl md:text-5xl font-black tracking-[-0.03em] text-white" />
                </div>
              </div>
              <div className="grid gap-6">
                <SpotlightCard className="space-y-6">
                  <div className="flex items-center gap-3 mb-2 border-b border-white/5 pb-4">
                    <Code2 className="w-5 h-5 text-[#00E5FF]" />
                    <h3 className="text-sm font-bold tracking-[0.15em] text-white uppercase">Code Stack</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {["C", "C++", "Python", "Java", "HTML5", "CSS3", "React", "TypeScript", "FastAPI", "Tailwind CSS", "Streamlit", "Pandas", "Plotly", "DSA", "OOP", "Git", "GitHub", "Linux"].map(skill => (
                      <span key={skill} className="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.07] text-zinc-300 text-sm font-medium hover:border-[#00E5FF]/30 hover:text-white hover:bg-[#00E5FF]/5 transition-all duration-300">
                        {skill}
                      </span>
                    ))}
                  </div>
                </SpotlightCard>

                <SpotlightCard className="space-y-6">
                  <div className="flex items-center gap-3 mb-2 border-b border-white/5 pb-4">
                    <PenTool className="w-5 h-5 text-[#00E5FF]" />
                    <h3 className="text-sm font-bold tracking-[0.15em] text-white uppercase">Design Stack</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {["Figma", "Elementor", "Design Systems", "Responsive UI", "Wireframing", "Prototyping", "User Research"].map(skill => (
                      <span key={skill} className="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.07] text-zinc-300 text-sm font-medium hover:border-[#00E5FF]/30 hover:text-white hover:bg-[#00E5FF]/5 transition-all duration-300">
                        {skill}
                      </span>
                    ))}
                  </div>
                </SpotlightCard>

                <SpotlightCard className="space-y-6">
                  <div className="flex items-center gap-3 mb-2 border-b border-white/5 pb-4">
                    <Award className="w-5 h-5 text-[#00E5FF]" />
                    <h3 className="text-sm font-bold tracking-[0.15em] text-white uppercase">Hackathons & Certifications</h3>
                  </div>
                  <ul className="text-zinc-400 leading-relaxed space-y-4 text-sm">
                    <li className="flex items-start gap-3">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#00E5FF] flex-shrink-0" />
                      <span>Smart India Hackathon 2026 — Selected for internal round, Team Honored_Ones (six members), problem statement SIH26027.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#00E5FF] flex-shrink-0" />
                      <span>NPTEL Algorithm Design and Analysis (ongoing).</span>
                    </li>
                  </ul>
                </SpotlightCard>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer id="contact" className="border-t border-white/5 bg-[#050505]/80 backdrop-blur-xl mt-32 relative z-10">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-32 flex flex-col items-center text-center">
          <h2 className="text-5xl md:text-7xl lg:text-[6.5rem] font-black tracking-tighter text-white mb-6 drop-shadow-[0_0_30px_rgba(255,255,255,0.05)]">
            LET&apos;S TALK.
          </h2>
          <p className="text-zinc-400 text-base md:text-lg max-w-lg mb-10 leading-relaxed">
            Have an exciting opportunity, project, or collaboration? My inbox is always open.
          </p>
          <div className="mb-12">
            <ShinyButton href="mailto:choudharyjatin.3110@gmail.com">
              choudharyjatin.3110@gmail.com <ArrowUpRight className="w-4 h-4 ml-2" />
            </ShinyButton>
          </div>

          <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-24">
            <a href="https://github.com/JatinChoudhary-07" target="_blank" rel="noreferrer" aria-label="GitHub Profile" className="group flex items-center gap-3 px-6 py-4 rounded-2xl bg-[#0a0a0a] border border-white/10 text-zinc-300 hover:bg-[#111] hover:border-[#00E5FF]/50 hover:text-[#00E5FF] transition-all font-mono text-sm uppercase tracking-widest shadow-lg hover:shadow-[0_0_20px_-5px_rgba(0,229,255,0.3)] hover:-translate-y-1">
              <Github className="w-5 h-5" /> GitHub
            </a>
            <a href="https://leetcode.com/u/JatinChoudhary-07/" target="_blank" rel="noreferrer" aria-label="LeetCode Profile" className="group flex items-center gap-3 px-6 py-4 rounded-2xl bg-[#0a0a0a] border border-white/10 text-zinc-300 hover:bg-[#111] hover:border-[#00E5FF]/50 hover:text-[#00E5FF] transition-all font-mono text-sm uppercase tracking-widest shadow-lg hover:shadow-[0_0_20px_-5px_rgba(0,229,255,0.3)] hover:-translate-y-1">
              <Code2 className="w-5 h-5" /> LeetCode
            </a>
            <a href="https://www.linkedin.com/in/jatin-choudhary-390336378" target="_blank" rel="noreferrer" aria-label="LinkedIn Profile" className="group flex items-center gap-3 px-6 py-4 rounded-2xl bg-[#0a0a0a] border border-white/10 text-zinc-300 hover:bg-[#111] hover:border-[#00E5FF]/50 hover:text-[#00E5FF] transition-all font-mono text-sm uppercase tracking-widest shadow-lg hover:shadow-[0_0_20px_-5px_rgba(0,229,255,0.3)] hover:-translate-y-1">
              <Linkedin className="w-5 h-5" /> LinkedIn
            </a>
          </div>

          <div className="w-full flex flex-col md:flex-row justify-between items-center gap-8 pt-12 border-t border-white/5 text-xs font-mono uppercase tracking-widest text-zinc-500">
            <p className="flex items-center gap-2">&copy; {new Date().getFullYear()} Jatin Choudhary</p>
            <p className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00E5FF] animate-pulse" />
              Indore, India
            </p>
          </div>
        </div>
      </footer>

      <ScrollToTop visible={showScrollTop} />
    </div>
  );
}