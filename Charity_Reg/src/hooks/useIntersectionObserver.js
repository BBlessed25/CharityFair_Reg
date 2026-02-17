import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Tracks which section is in view for navigation highlighting.
 * @param {string[]} sectionIds - Array of section element IDs to observe
 * @param {Object} options - IntersectionObserver options (rootMargin, threshold)
 * @returns {{ activeSection: string | null; setActiveSection: (id: string | null) => void }}
 */
export function useIntersectionObserver(sectionIds, options = {}) {
  const { rootMargin = '-20% 0px -60% 0px', threshold = 0 } = options;
  const [activeSection, setActiveSection] = useState(null);
  const observersRef = useRef(new Map());

  const cleanup = useCallback(() => {
    observersRef.current.forEach((ob) => ob?.disconnect());
    observersRef.current.clear();
  }, []);

  useEffect(() => {
    if (!sectionIds?.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.id;
          if (entry.isIntersecting) {
            setActiveSection(id);
          }
        });
      },
      { rootMargin, threshold }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        observer.observe(el);
        observersRef.current.set(id, observer);
      }
    });

    return () => {
      observer.disconnect();
      cleanup();
    };
  }, [sectionIds.join(','), rootMargin, threshold, cleanup]);

  return { activeSection, setActiveSection };
}
