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

  replayable =() => this.getAttribute('replayable') && this.getAttribute('replayable') === 'true';

  percentage = (total = 0, goal = 100, max = 100) =>
    Math.min(Math.floor((total / goal) * 100), max);

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
        stroke: var(--fitness-calories, var(--fitness-ring-calories));
        transform: translate(50%, 50%);
      }
      .minutes circle {
        stroke: var(--fitness-minutes, var(--fitness-ring-minutes));
        transform: translate(50%, 50%) scale(0.75);
      }
      .hours circle {
        stroke: var(--fitness-hours, var(--fitness-ring-hours));
        transform: translate(50%, 50%) scale(0.5);
      }
      .visible circle:not(.base) {
        animation: ease-in-out forwards ring;
      }
      .visible .calories circle:not(.base) {
        animation-delay: 50ms;
        animation-duration: 1450ms;
      }
      .visible .minutes circle:not(.base) {
        animation-delay: 300ms;
        animation-duration: 1200ms;
      }
      .visible .hours circle:not(.base) {
        animation-delay: 550ms;
        animation-duration: 950ms;
      }
      .reset.reset.reset circle:not(.base) {
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
        <g class="calories">
          <circle stroke-width="3" r="16" class="base"></circle>
          <circle
            stroke-width="3"
            r="16"
            stroke-linecap="round"
            stroke-dashoffset="${this.percentage(
              this.getAttribute('calories-total'),
              this.getAttribute('calories-goal')
            ) - 1}"
            stroke-dasharray="${this.percentage(
              this.getAttribute('calories-total'),
              this.getAttribute('calories-goal')
            )}, 100"
          ></circle>
        </g>

        <g class="minutes">
          <circle stroke-width="4" r="16" class="base"></circle>
          <circle
            stroke-width="4"
            r="16"
            stroke-linecap="round"
            stroke-dashoffset="${this.percentage(
              this.getAttribute('minutes-total'),
              this.getAttribute('minutes-goal')
            ) - 1}"
            stroke-dasharray="${this.percentage(
              this.getAttribute('minutes-total'),
              this.getAttribute('minutes-goal')
            )}, 100"
          ></circle>
        </g>

        <g class="hours">
          <circle stroke-width="6" r="16" class="base"></circle>
          <circle
            stroke-width="6"
            r="16"
            stroke-linecap="round"
            stroke-dashoffset="${this.percentage(
              this.getAttribute('hours-total'),
              this.getAttribute('hours-goal')
            ) - 1}"
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
