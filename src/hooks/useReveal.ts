import { useEffect, useRef } from "react";

/** 요소가 viewport에 진입하면 .visible 클래스를 추가하는 스크롤 reveal 훅 */
export function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("visible");
          obs.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

/** 자식 .card-stagger 요소들을 순서대로 stagger 애니메이션하는 훅 */
export function useStaggerReveal(count: number) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const container = ref.current;
    if (!container) return;
    const cards = container.querySelectorAll<HTMLElement>(".card-stagger");
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          cards.forEach((card, i) => {
            setTimeout(() => card.classList.add("visible"), i * 60);
          });
          obs.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    obs.observe(container);
    return () => obs.disconnect();
  }, [count]);
  return ref;
}
