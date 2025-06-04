export default class FitnessRing extends HTMLElement {
  static observedAttributes = [
    'calories-total',
    'calories-goal',
    'minutes-goal',
    'minutes-total',
    'hours-goal',
    'hours-total',
  ];

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    const style = document.createElement('style');
    style.textContent = this.style();
    this.shadow.appendChild(style);

    const wrapper = document.createElement('div');
    wrapper.innerHTML = this.render();
    this.shadow.appendChild(wrapper);

    if ('IntersectionObserver' in window) {
      this.observer = new IntersectionObserver(
        elements => {
          elements.forEach(element => {
            if (element.isIntersecting) {
              element.target.classList.add('visible');
            }
          });
        },
        { threshold: 0.5 }
      );

      this.observer.observe(wrapper);
    } else {
      wrapper.classList.add('visible');
    }

    wrapper.addEventListener('click', () => {
      if (this.replayable() && wrapper.classList.contains('complete')) {
        wrapper.classList.add('reset');
        wrapper.classList.remove('complete');
      }
    });

    wrapper.addEventListener('animationstart', () => {
      wrapper.classList.remove('complete');
    });

    wrapper.addEventListener('animationend', () => {
      if (wrapper.classList.contains('reset')) {
        wrapper.classList.remove('reset');
        wrapper.classList.remove('visible');

        void wrapper.offsetWidth;
        wrapper.classList.add('visible');
      } else {
        window.setTimeout(() => wrapper.classList.add('complete'), 50);
      }
    });
  }

  disconnectedCallback() {
    this.observer.disconnect();
  }

  replayable = () =>
    this.getAttribute('replayable') &&
    this.getAttribute('replayable') === 'true';

  percentage = (total = 0, goal = 100) =>
    Math.floor((total / goal) * 100);

  style() {
    return `
      :host {
        --fitness-ring-calories: #fa114f;
        --fitness-ring-minutes: #92e82a;
        --fitness-ring-hours: #1eeaef;

        position: relative;
        display: block;
        width: 100%;
      }
      svg {
        display: block;
      }
      g {
        transform: rotate(-90deg);
        transform-origin: center;
      }
      circle {
        fill: transparent;
      }
      circle.base {
        opacity: 0.25;
      }
      .calories circle {
        transform: translate(50%, 50%);
      }
      .calories circle.base {
        stroke: var(--fitness-calories, var(--fitness-ring-calories));
      }
      .minutes circle {
        transform: translate(50%, 50%) scale(0.75);
      }
      .minutes circle.base {
        stroke: var(--fitness-minutes, var(--fitness-ring-minutes));
      }
      .hours circle {
        transform: translate(50%, 50%) scale(0.5);
      }
      .hours circle.base {
        stroke: var(--fitness-hours, var(--fitness-ring-hours));
      }
      .visible circle.ring {
        animation: ease-in-out forwards ring;
      }
      .visible .calories circle.ring {
        animation-delay: 50ms;
        animation-duration: 1450ms;
      }
      .visible .minutes circle.ring {
        animation-delay: 300ms;
        animation-duration: 1200ms;
      }
      .visible .hours circle.ring {
        animation-delay: 550ms;
        animation-duration: 950ms;
      }
      .reset.reset.reset circle.ring {
        animation-delay: 0ms;
        animation-duration: 650ms;
        animation-fill-mode: backwards;
        animation-name: ring-reverse;
      }
      .labels {
        position: absolute; top: 0; right: 0; bottom: 0; left: 0;
      }
      .labels ::slotted(*) {
        --fitness-label: #fff;

        position: absolute; left: 50%;
        margin-left: -3%;
        height: 6%; width: 6%;
        color: var(--fitness-label);
        fill: currentColor;
        stroke: currentColor;
      }
      .labels ::slotted([slot="label-calories"]) {
        top: 2.5%;
      }
      .labels ::slotted([slot="label-minutes"]) {
        top: 13.5%;
      }
      .labels ::slotted([slot="label-hours"]) {
        top: 25%;
      }
      @keyframes ring {
        to {
          stroke-dashoffset: 0;
        }
      }
      @keyframes ring-reverse {
        from {
          stroke-dashoffset: 0;
        }
      }
      @media (prefers-reduced-motion) {
        .calories circle,
        .minutes circle,
        .hours circle {
          animation: none;
          stroke-dashoffset: 0;
        }
      }
    `;
  }

  render() {
    return `
      <svg viewBox="0 0 36 36">
        <defs>
          <linearGradient id="calories-gradient" x1="0%" y1="0%" x2="100%" y2="0%" gradientUnits="objectBoundingBox">
            <stop offset="0%" stop-color="var(--fitness-calories, var(--fitness-ring-calories))" stop-opacity="1"/>
            <stop offset="10%" stop-color="var(--fitness-calories, var(--fitness-ring-calories))" stop-opacity="0.8"/>
            <stop offset="80%" stop-color="var(--fitness-calories, var(--fitness-ring-calories))" stop-opacity="0.2"/>
            <stop offset="100%" stop-color="var(--fitness-calories, var(--fitness-ring-calories))" stop-opacity="0"/>
          </linearGradient>
          <linearGradient id="minutes-gradient" x1="0%" y1="0%" x2="0%" y2="100%" gradientUnits="objectBoundingBox">
            <stop offset="0%" stop-color="var(--fitness-minutes, var(--fitness-ring-minutes))" stop-opacity="1"/>
            <stop offset="10%" stop-color="var(--fitness-minutes, var(--fitness-ring-minutes))" stop-opacity="0.8"/>
            <stop offset="80%" stop-color="var(--fitness-minutes, var(--fitness-ring-minutes))" stop-opacity="0.2"/>
            <stop offset="100%" stop-color="var(--fitness-minutes, var(--fitness-ring-minutes))" stop-opacity="0"/>
          </linearGradient>
          <linearGradient id="hours-gradient" gradientUnits="objectBoundingBox">
            <stop offset="0%" stop-color="var(--fitness-hours, var(--fitness-ring-hours))" stop-opacity="1"/>
            <stop offset="10%" stop-color="var(--fitness-hours, var(--fitness-ring-hours))" stop-opacity="0.8"/>
            <stop offset="80%" stop-color="var(--fitness-hours, var(--fitness-ring-hours))" stop-opacity="0.2"/>
            <stop offset="100%" stop-color="var(--fitness-hours, var(--fitness-ring-hours))" stop-opacity="0"/>
          </linearGradient>
        </defs>

        <g class="calories">
          <circle class="base" stroke-width="3" r="16"></circle>
          <circle class="ring"
            r="16"
            stroke="url(#calories-gradient)"
            stroke-width="3"
            stroke-linecap="round"
            stroke-dashoffset="${
              this.percentage(
                this.getAttribute('calories-total'),
                this.getAttribute('calories-goal')
              ) - 1
            }"
            stroke-dasharray="${this.percentage(
              this.getAttribute('calories-total'),
              this.getAttribute('calories-goal')
            )}, 100"
          ></circle>
        </g>

        <g class="minutes">
          <circle class="base" stroke-width="4" r="16"></circle>
          <circle class="ring"
            r="16"
            stroke="url(#minutes-gradient)"
            stroke-width="4"
            stroke-linecap="round"
            stroke-dashoffset="${
              this.percentage(
                this.getAttribute('minutes-total'),
                this.getAttribute('minutes-goal')
              ) - 1
            }"
            stroke-dasharray="${this.percentage(
              this.getAttribute('minutes-total'),
              this.getAttribute('minutes-goal')
            )}, 100"
          ></circle>
        </g>

        <g class="hours">
          <circle class="base" stroke-width="6" r="16"></circle>
          <circle class="ring"
            r="16"
            stroke="url(#hours-gradient)"
            stroke-width="6"
            stroke-linecap="round"
            stroke-dashoffset="${
              this.percentage(
                this.getAttribute('hours-total'),
                this.getAttribute('hours-goal')
              ) - 1
            }"
            stroke-dasharray="${this.percentage(
              this.getAttribute('hours-total'),
              this.getAttribute('hours-goal')
            )}, 100"
          ></circle>
        </g>
      </svg>

      <div class="labels">
        <slot part="label-calories" name="label-calories"></slot>
        <slot part="label-minutes" name="label-minutes"></slot>
        <slot part="label-hours" name="label-hours"></slot>
      </div>
    `;
  }
}

if ('customElements' in window) {
  window.customElements.define('fitness-ring', FitnessRing);
}
