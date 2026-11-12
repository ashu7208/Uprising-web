import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function usePageInteractions() {
  const { pathname } = useLocation();

  useEffect(() => {
    const root = document.querySelector('#main');
    if (!root) return undefined;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const supportsHover = window.matchMedia('(hover: hover)');
    const observers = [];
    const timers = [];
    const cleanups = [];
    const temporaryNodes = new Set();
    const listen = (element, type, handler, options) => {
      element.addEventListener(type, handler, options);
      cleanups.push(() => element.removeEventListener(type, handler, options));
    };
    const observe = (elements, threshold, callback, repeat = false) => {
      if (!elements.length) return;
      if (reducedMotion.matches || !('IntersectionObserver' in window)) {
        elements.forEach((element) => callback(element, true));
        return;
      }

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.intersectionRatio >= threshold) {
            callback(entry.target, true);
            if (!repeat) observer.unobserve(entry.target);
          } else if (repeat && entry.intersectionRatio === 0) {
            callback(entry.target, false);
          }
        });
      }, { threshold: repeat ? [0, threshold] : threshold });
      elements.forEach((element) => observer.observe(element));
      observers.push(observer);
    };
    const revealOnce = (elements, className, threshold = 0.18) => {
      observe([...elements], threshold, (element, visible) => {
        if (visible) element.classList.add(className);
      });
    };
    const revealOnReentry = (elements, className, threshold = 0.2) => {
      observe([...elements], threshold, (element, visible) => {
        element.classList.toggle(className, visible);
      }, true);
    };
    const addRipple = (element, className, event) => {
      if (reducedMotion.matches) return;
      const rect = element.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.className = className;
      ripple.setAttribute('aria-hidden', 'true');
      const isKeyboardClick = event.type === 'click' && event.detail === 0;
      ripple.style.left = `${isKeyboardClick ? rect.width / 2 : event.clientX - rect.left}px`;
      ripple.style.top = `${isKeyboardClick ? rect.height / 2 : event.clientY - rect.top}px`;
      element.append(ripple);
      temporaryNodes.add(ripple);
      const remove = () => {
        ripple.remove();
        temporaryNodes.delete(ripple);
      };
      ripple.addEventListener('animationend', remove, { once: true });
      const timer = window.setTimeout(remove, 1200);
      timers.push(timer);
    };
    const setTilt = (element, event, xFactor, yFactor, xName = '--tilt-x', yName = '--tilt-y') => {
      const rect = element.getBoundingClientRect();
      const x = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
      const y = Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height));
      element.style.setProperty('--mx', `${x * 100}%`);
      element.style.setProperty('--my', `${y * 100}%`);
      element.style.setProperty(xName, `${(0.5 - y) * xFactor}deg`);
      element.style.setProperty(yName, `${(x - 0.5) * yFactor}deg`);
      return { x, y };
    };

    revealOnce(root.querySelectorAll('.rv, .reveal'), 'in', 0.12);
    revealOnce(root.querySelectorAll('.find-us-reveal'), 'is-visible', 0.08);

    root.querySelectorAll('.who-section').forEach((section) => {
      let scrollIntent = false;
      const checkVisibility = () => {
        if (!scrollIntent || section.classList.contains('is-visible')) return;
        const rect = section.getBoundingClientRect();
        const visibleHeight = Math.max(0, Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0));
        if (rect.height > 0 && visibleHeight / rect.height >= 0.35) {
          section.classList.add('is-visible');
          removeScrollListeners();
        }
      };
      const markScrollIntent = () => { scrollIntent = true; };
      const onWheel = (event) => { if (event.deltaY !== 0) markScrollIntent(); };
      const onKeyDown = (event) => {
        if (['ArrowDown', 'PageDown', ' ', 'End'].includes(event.key)) markScrollIntent();
      };
      const removeScrollListeners = () => {
        window.removeEventListener('wheel', onWheel);
        window.removeEventListener('touchmove', markScrollIntent);
        window.removeEventListener('keydown', onKeyDown);
        window.removeEventListener('scroll', checkVisibility);
      };
      listen(window, 'wheel', onWheel, { passive: true });
      listen(window, 'touchmove', markScrollIntent, { passive: true });
      listen(window, 'keydown', onKeyDown);
      listen(window, 'scroll', checkVisibility, { passive: true });
      cleanups.push(removeScrollListeners);
      if ('IntersectionObserver' in window && !reducedMotion.matches) {
        const observer = new IntersectionObserver(checkVisibility, { threshold: 0.35 });
        observer.observe(section);
        observers.push(observer);
      }

      const card = section.querySelector('.who-card');
      const tilt = section.querySelector('.who-tilt');
      const rows = [...section.querySelectorAll('.who-row')];
      const hint = section.querySelector('.who-hint');
      if (!card || !tilt) return;

      const resetTilt = () => {
        card.classList.remove('is-hovering');
        tilt.style.setProperty('--tilt-x', '0deg');
        tilt.style.setProperty('--tilt-y', '0deg');
      };
      listen(card, 'pointerenter', () => {
        if (!reducedMotion.matches) card.classList.add('is-hovering');
      });
      listen(card, 'pointermove', (event) => {
        if (reducedMotion.matches || event.pointerType === 'touch') return;
        setTilt(tilt, event, 9, 11);
      });
      listen(card, 'pointerleave', resetTilt);
      listen(card, 'pointerdown', (event) => {
        card.classList.add('is-pressed');
        addRipple(card, 'who-ripple', event);
      });
      const releaseWhoPress = (event) => {
        const timer = window.setTimeout(() => card.classList.remove('is-pressed'), event.pointerType === 'touch' ? 450 : 0);
        timers.push(timer);
      };
      listen(card, 'pointerup', releaseWhoPress);
      listen(card, 'pointercancel', releaseWhoPress);
      rows.forEach((row) => {
        listen(row, 'click', (event) => {
          addRipple(row, 'who-service-ripple', event);
          hint?.classList.add('is-hidden');
        });
      });
    });

    root.querySelectorAll('.why-section').forEach((section) => {
      const heading = section.querySelector('.why-heading');
      const cards = [...section.querySelectorAll('.why-card')];
      revealOnce(heading ? [heading] : [], 'is-revealed', 0.25);
      observe(cards, 0.25, (card, visible) => {
        if (!visible) return;
        card.style.setProperty('--why-reveal-delay', `${cards.indexOf(card) * 140}ms`);
        card.classList.add('is-revealed');
      });
      cards.forEach((card) => {
        const tilt = card.querySelector('.why-tilt');
        if (!tilt) return;
        let resetTimer;
        const resetTilt = () => {
          window.clearTimeout(resetTimer);
          card.classList.remove('is-hovered');
          tilt.style.setProperty('--why-rotate-x', '0deg');
          tilt.style.setProperty('--why-rotate-y', '0deg');
        };
        listen(card, 'pointerenter', () => card.classList.add('is-hovered'));
        listen(card, 'pointermove', (event) => {
          if (reducedMotion.matches || event.pointerType === 'touch') return;
          setTilt(tilt, event, 8, 10, '--why-rotate-x', '--why-rotate-y');
        });
        listen(card, 'pointerleave', resetTilt);
        listen(card, 'pointerdown', (event) => {
          card.classList.add('is-pressed');
          addRipple(tilt, 'why-ripple', event);
        });
        const release = (event) => {
          window.clearTimeout(resetTimer);
          resetTimer = window.setTimeout(() => {
            card.classList.remove('is-pressed');
            if (event.pointerType === 'touch') resetTilt();
          }, event.pointerType === 'touch' ? 450 : 0);
          timers.push(resetTimer);
        };
        listen(card, 'pointerup', release);
        listen(card, 'pointercancel', release);
        cleanups.push(() => window.clearTimeout(resetTimer));
      });
    });

    root.querySelectorAll('.process').forEach((section) => {
      const heading = section.querySelector('.process-heading');
      const progress = section.querySelector('.process-progress');
      const cards = [...section.querySelectorAll('.process-card')];
      revealOnce(heading ? [heading] : [], 'is-revealed', 0.25);
      revealOnce(progress ? [progress] : [], 'is-revealed', 0.25);
      observe(cards, 0.25, (card, visible) => {
        if (!visible) return;
        card.style.setProperty('--process-reveal-delay', `${cards.indexOf(card) * 130}ms`);
        card.dataset.revealed = 'true';
      });
      cards.forEach((card) => {
        listen(card, 'pointerdown', (event) => {
          card.classList.add('is-pressed');
          addRipple(card, 'process-ripple', event);
        });
        let pressTimer;
        const release = (event) => {
          window.clearTimeout(pressTimer);
          pressTimer = window.setTimeout(
            () => card.classList.remove('is-pressed'),
            event.pointerType === 'touch' ? 350 : 0
          );
          timers.push(pressTimer);
        };
        listen(card, 'pointerup', release);
        listen(card, 'pointercancel', release);
        cleanups.push(() => window.clearTimeout(pressTimer));
      });
    });

    root.querySelectorAll('.leadership-section').forEach((section) => {
      section.classList.add('leadership-enhanced');
      const heading = section.querySelector('.leadership-heading');
      const card = section.querySelector('.leadership-card');
      if (!heading || !card) return;
      card.classList.add('leadership-hidden');
      revealOnce([heading], 'is-revealed', 0.25);
      observe([card], 0.25, (element, visible) => {
        if (!visible) return;
        element.classList.remove('leadership-hidden');
        element.classList.add('is-visible');
      });

      const frame = section.querySelector('.leadership-photo-frame');
      const photoTilt = section.querySelector('.leadership-photo-tilt');
      if (!frame || !photoTilt) return;
      const resetTilt = () => {
        frame.classList.remove('is-tilting');
        photoTilt.style.setProperty('--leadership-rotate-x', '0deg');
        photoTilt.style.setProperty('--leadership-rotate-y', '0deg');
      };
      listen(frame, 'pointermove', (event) => {
        if (reducedMotion.matches || event.pointerType === 'touch') return;
        const { x, y } = setTilt(photoTilt, event, 10, 12, '--leadership-rotate-x', '--leadership-rotate-y');
        photoTilt.style.setProperty('--leadership-mx', `${x * 100}%`);
        photoTilt.style.setProperty('--leadership-my', `${y * 100}%`);
        frame.classList.add('is-tilting');
      });
      listen(frame, 'pointerleave', resetTilt);
      listen(frame, 'pointerdown', (event) => addRipple(frame, 'leadership-stat-ripple', event));
      listen(frame, 'pointercancel', resetTilt);
      let resetTimer;
      listen(frame, 'pointerup', (event) => {
        if (event.pointerType !== 'touch') return;
        window.clearTimeout(resetTimer);
        resetTimer = window.setTimeout(resetTilt, 450);
        timers.push(resetTimer);
      });
      cleanups.push(() => window.clearTimeout(resetTimer));
    });

    root.querySelectorAll('.number-card').forEach((card) => {
      let pressTimer;
      listen(card, 'pointerdown', () => card.classList.add('is-pressed'));
      const release = (event) => {
        window.clearTimeout(pressTimer);
        pressTimer = window.setTimeout(
          () => card.classList.remove('is-pressed'),
          event.pointerType === 'touch' ? 350 : 0
        );
        timers.push(pressTimer);
      };
      listen(card, 'pointerup', release);
      listen(card, 'pointercancel', release);
      cleanups.push(() => window.clearTimeout(pressTimer));
    });

    const aboutValues = root.querySelector('#vals');
    if (aboutValues) {
      aboutValues.classList.add('vals-enhanced');
      revealOnReentry([aboutValues], 'on', 0.2);
      aboutValues.querySelectorAll('.card').forEach((card) => {
        listen(card, 'pointermove', (event) => {
          if (reducedMotion.matches || !supportsHover.matches ||
              (event.pointerType !== 'mouse' && event.pointerType !== 'pen')) return;
          const rect = card.getBoundingClientRect();
          const x = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
          const y = Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height));
          card.style.setProperty('--mx', `${x * 100}%`);
          card.style.setProperty('--my', `${y * 100}%`);
          card.style.setProperty('--px', `${(x - 0.5) * 8}px`);
          card.style.setProperty('--py', `${(y - 0.5) * 8}px`);
          card.style.setProperty('--rx', `${(0.5 - y) * 8}deg`);
          card.style.setProperty('--ry', `${(x - 0.5) * 10}deg`);
        });
        listen(card, 'pointerleave', () => {
          ['--mx', '--my', '--px', '--py', '--rx', '--ry'].forEach((property) => card.style.removeProperty(property));
        });
      });
    }

    const missionVision = root.querySelector('#mv');
    if (missionVision) {
      revealOnReentry([missionVision], 'in', 0.25);
      missionVision.querySelectorAll('.card').forEach((card) => {
        let releaseTimer;
        listen(card, 'pointermove', (event) => {
          if (reducedMotion.matches || !supportsHover.matches ||
              (event.pointerType !== 'mouse' && event.pointerType !== 'pen')) return;
          window.clearTimeout(releaseTimer);
          const { x, y } = setTilt(card, event, 7, 9, '--mv-rotate-x', '--mv-rotate-y');
          card.style.transition = 'transform .08s linear';
          card.style.transform = `translateY(-10px) rotateX(${(0.5 - y) * 7}deg) rotateY(${(x - 0.5) * 9}deg)`;
          card.style.setProperty('--spot-x', `${x * 100}%`);
          card.style.setProperty('--spot-y', `${y * 100}%`);
          card.style.setProperty('--num-x', `${(x - 0.5) * 10}px`);
          card.style.setProperty('--num-y', `${(y - 0.5) * 10}px`);
        });
        listen(card, 'pointerleave', (event) => {
          if (event.pointerType !== 'mouse' && event.pointerType !== 'pen') return;
          card.style.transition = 'transform .4s ease';
          card.style.transform = '';
          ['--mx', '--my', '--mv-rotate-x', '--mv-rotate-y', '--spot-x', '--spot-y', '--num-x', '--num-y']
            .forEach((property) => card.style.removeProperty(property));
          releaseTimer = window.setTimeout(() => {
            card.style.transition = '';
          }, 450);
          timers.push(releaseTimer);
        });
        cleanups.push(() => window.clearTimeout(releaseTimer));
      });
    }

    const aboutLeadership = root.querySelector('#about-leadership');
    if (aboutLeadership) {
      aboutLeadership.classList.add('leadership-enhanced');
      revealOnReentry([aboutLeadership], 'on', 0.2);
      aboutLeadership.querySelectorAll('.leader-tags span').forEach((tag, index) => {
        tag.style.setProperty('--tag-i', String(index));
      });
      const panel = aboutLeadership.querySelector('.leadership-panel');
      const photo = aboutLeadership.querySelector('.leader-photo-wrap img');
      if (panel && photo) {
        listen(panel, 'pointermove', (event) => {
          if (reducedMotion.matches || !supportsHover.matches ||
              (event.pointerType !== 'mouse' && event.pointerType !== 'pen')) return;
          const rect = panel.getBoundingClientRect();
          const x = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
          const y = Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height));
          panel.style.setProperty('--mx', `${x * 100}%`);
          panel.style.setProperty('--my', `${y * 100}%`);
          photo.style.transition = 'transform .08s linear';
          photo.style.transform = `translate(${(0.5 - x) * 18}px, ${(0.5 - y) * 14}px) scale(1.06)`;
        });
        listen(panel, 'pointerleave', (event) => {
          if (event.pointerType !== 'mouse' && event.pointerType !== 'pen') return;
          panel.style.removeProperty('--mx');
          panel.style.removeProperty('--my');
          photo.style.transition = 'transform .4s ease';
          photo.style.transform = '';
        });
      }
    }

    const aboutCompany = root.querySelector('#about-company');
    if (aboutCompany) {
      aboutCompany.classList.add('company-details-enhanced');
      revealOnReentry([aboutCompany], 'on', 0.2);
      aboutCompany.querySelectorAll('.company-detail-box').forEach((box) => {
        listen(box, 'pointermove', (event) => {
          if (event.pointerType === 'touch') return;
          const rect = box.getBoundingClientRect();
          const x = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
          const y = Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height));
          box.style.setProperty('--mx', `${x * 100}%`);
          box.style.setProperty('--my', `${y * 100}%`);
        });
        listen(box, 'pointerleave', () => {
          box.style.removeProperty('--mx');
          box.style.removeProperty('--my');
        });
      });
    }

    root.querySelectorAll('.who-services-section').forEach((section) => {
      section.classList.add('who-services-enhanced');
      observe([section], 0.15, (element, visible) => {
        if (visible) element.classList.add('is-visible', 'who-services-visible');
      });
      const card = section.querySelector('.who-services-card');
      const rows = [...section.querySelectorAll('.who-service-row')];
      rows.forEach((row) => {
        row.querySelectorAll('.who-service-tags-inner > span').forEach((tag, index) => {
          tag.style.setProperty('--tag-index', String(index));
        });
        listen(row, 'click', (event) => addRipple(row, 'who-service-ripple', event));
      });
      if (card) {
        listen(card, 'pointermove', (event) => {
          if (reducedMotion.matches || (event.pointerType !== 'mouse' && event.pointerType !== 'pen')) return;
          const rect = card.getBoundingClientRect();
          const x = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
          const y = Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height));
          card.style.transition = 'transform .08s linear';
          card.style.transform = `rotateX(${(0.5 - y) * 5}deg) rotateY(${(x - 0.5) * 7}deg)`;
          card.style.setProperty('--who-card-x', `${x * 100}%`);
          card.style.setProperty('--who-card-y', `${y * 100}%`);
        });
        listen(card, 'pointerleave', (event) => {
          if (event.pointerType !== 'mouse' && event.pointerType !== 'pen') return;
          card.style.transition = 'transform .4s ease';
          card.style.transform = '';
        });
      }
    });

    ['#civil-construction', '#electrical-works', '#water-treatment'].forEach((selector) => {
      const section = root.querySelector(selector);
      if (!section) return;
      const type = selector === '#civil-construction' ? 'civil' :
        selector === '#electrical-works' ? 'electrical' : 'water';
      const wrapperSelector = `.${type}-service-wrap`;
      const cardSelector = `.${type}-service-card`;
      const rippleClass = `${type}-ripple`;
      const wrappers = [...section.querySelectorAll(wrapperSelector)];
      section.classList.add('is-enhanced');
      wrappers.forEach((wrapper, index) => {
        wrapper.style.setProperty('--row', String(Math.floor(index / 2)));
        wrapper.style.setProperty('--side', index % 2 ? '.08s' : '0s');
        wrapper.style.setProperty('--slide-x', index % 2 ? '40px' : '-40px');
      });
      observe([section], 0.2, (element, visible) => {
        if (visible) element.classList.add('is-visible');
      });
      observe(wrappers, 0.2, (wrapper, visible) => {
        if (visible) wrapper.classList.add('is-revealed');
      });
      wrappers.forEach((wrapper) => {
        const card = wrapper.querySelector(cardSelector);
        if (!card) return;
        listen(card, 'pointermove', (event) => {
          if (reducedMotion.matches || !supportsHover.matches ||
              (event.pointerType !== 'mouse' && event.pointerType !== 'pen')) return;
          const rect = card.getBoundingClientRect();
          const x = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
          const y = Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height));
          card.style.setProperty('--mx', `${x * 100}%`);
          card.style.setProperty('--my', `${y * 100}%`);
          card.style.setProperty('--tilt-x', `${(0.5 - y) * 16}deg`);
          card.style.setProperty('--tilt-y', `${(x - 0.5) * 16}deg`);
        });
        listen(card, 'pointerleave', (event) => {
          if (event.pointerType !== 'mouse' && event.pointerType !== 'pen') return;
          ['--mx', '--my', '--tilt-x', '--tilt-y'].forEach((property) => card.style.removeProperty(property));
          wrapper.classList.remove('is-pressed');
        });
        listen(card, 'pointerdown', (event) => {
          wrapper.classList.add('is-pressed');
          addRipple(card, rippleClass, event);
        });
        const release = () => wrapper.classList.remove('is-pressed');
        listen(card, 'pointerup', release);
        listen(card, 'pointercancel', release);
      });
    });

    const aboutHero = root.querySelector('.about-hero');
    if (aboutHero) {
      const picture = aboutHero.querySelector('.pic');
      const sizePicture = () => {
        if (!picture) return;
        const width = aboutHero.clientWidth;
        const height = aboutHero.clientHeight;
        const scale = Math.max(width / 1672, height / 941);
        const pictureWidth = 1672 * scale;
        const pictureHeight = 941 * scale;
        picture.style.width = `${pictureWidth}px`;
        picture.style.height = `${pictureHeight}px`;
        picture.style.left = `${width - pictureWidth}px`;
        picture.style.top = pictureHeight > height ? `${-(pictureHeight - height) * 0.4}px` : '0px';
      };
      sizePicture();
      listen(window, 'resize', sizePicture, { passive: true });
      if (picture && 'ResizeObserver' in window) {
        const resizeObserver = new ResizeObserver(sizePicture);
        resizeObserver.observe(aboutHero);
        observers.push(resizeObserver);
      }
      if (reducedMotion.matches) {
        aboutHero.classList.add('cards-settled');
      } else {
        aboutHero.classList.add('go');
        const settleTimer = window.setTimeout(() => aboutHero.classList.add('cards-settled'), 3600);
        timers.push(settleTimer);
        if (picture) {
          listen(picture, 'animationend', (event) => {
            if (event.animationName === 'aboutHeroImageIn') picture.classList.add('is-drifting');
          });
        }
      }
    }

    const onReducedMotionChange = (event) => {
      if (!event.matches) return;
      root.querySelectorAll('.about-hero').forEach((hero) => hero.classList.add('cards-settled'));
      root.querySelectorAll('.who-section').forEach((section) => section.classList.add('is-visible'));
      root.querySelectorAll('.about-values').forEach((section) => section.classList.add('on'));
      root.querySelectorAll('#mv').forEach((section) => section.classList.add('in'));
      root.querySelectorAll('.about-leadership, .about-company').forEach((section) => section.classList.add('on'));
      root.querySelectorAll('.who-services-section').forEach((section) => section.classList.add('is-visible', 'who-services-visible'));
    };
    listen(reducedMotion, 'change', onReducedMotionChange);

    return () => {
      observers.forEach((observer) => observer.disconnect());
      cleanups.forEach((cleanup) => cleanup());
      timers.forEach((timer) => window.clearTimeout(timer));
      temporaryNodes.forEach((node) => node.remove());
    };
  }, [pathname]);
}
