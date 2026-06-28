/**
 * motion.ts — Setup global de GSAP + Lenis
 *
 * O que está pronto aqui:
 *  - Lenis: scroll suave com resistência configurável
 *  - GSAP + ScrollTrigger: conectado ao Lenis via raf loop
 *  - gsap e ScrollTrigger exportados para uso em qualquer componente
 *
 * Como usar em outros arquivos:
 *   import { gsap, ScrollTrigger } from '@/scripts/motion'
 *
 * Como animar elementos com data-attributes (ver exemplos abaixo):
 *   <div data-fade-up>  → entra deslizando de baixo + fade
 *   <div data-fade-in>  → entra apenas com fade
 *   <div data-stagger>  → filhos animam em cascata
 */

import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ─── Lenis: scroll suave ───────────────────────────────────────────────────
const lenis = new Lenis({
  duration: 1.4,        // peso do scroll (1 = normal, >1 = mais pesado)
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
  touchMultiplier: 1.8,
});

// Conecta Lenis ao RAF do GSAP para que ScrollTrigger reaja ao scroll suave
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});

// Evita lag extra no ticker do GSAP
gsap.ticker.lagSmoothing(0);

// Atualiza ScrollTrigger a cada tick do Lenis
lenis.on('scroll', ScrollTrigger.update);

// ─── Animações prontas via data-attributes ─────────────────────────────────

function initScrollAnimations() {
  // data-fade-up → sobe + aparece ao entrar na viewport
  gsap.utils.toArray<HTMLElement>('[data-fade-up]').forEach((el) => {
    gsap.from(el, {
      y: 48,
      opacity: 0,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        toggleActions: 'play none none none',
      },
    });
  });

  // data-fade-in → apenas aparece (sem movimento)
  gsap.utils.toArray<HTMLElement>('[data-fade-in]').forEach((el) => {
    gsap.from(el, {
      opacity: 0,
      duration: 1.1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 90%',
        toggleActions: 'play none none none',
      },
    });
  });

  // data-fade-left → entra da direita
  gsap.utils.toArray<HTMLElement>('[data-fade-left]').forEach((el) => {
    gsap.from(el, {
      x: 60,
      opacity: 0,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        toggleActions: 'play none none none',
      },
    });
  });

  // data-stagger → anima filhos em cascata
  gsap.utils.toArray<HTMLElement>('[data-stagger]').forEach((el) => {
    gsap.from(el.children, {
      y: 36,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
      stagger: 0.12,
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        toggleActions: 'play none none none',
      },
    });
  });

  // data-parallax="velocidade" → parallax com scroll (ex: data-parallax="0.3")
  gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((el) => {
    const speed = parseFloat(el.dataset.parallax ?? '0.2');
    gsap.to(el, {
      y: () => -el.offsetHeight * speed,
      ease: 'none',
      scrollTrigger: {
        trigger: el,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });
  });
}

// Roda após o DOM estar pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initScrollAnimations);
} else {
  initScrollAnimations();
}

export { gsap, ScrollTrigger, lenis };
