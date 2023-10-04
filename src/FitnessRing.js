export default class FitnessRing extends HTMLElement {
  static observedAttributes = [
    'move-total',
    'move-goal',
    'exercise-goal',
    'exercise-total',
    'stand-goal',
    'stand-total',
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
              element.target.classList.add('viewed');
            }
          });
        },
        { threshold: 0.5 }
      );

      this.observer.observe(wrapper);
    } else {
      wrapper.classList.add('viewed');
    }
  }

  disconnectedCallback() {
    this.observer.disconnect();
  }

  percentage = (total = 0, goal = 100, max = 100) =>
    Math.min(Math.floor((total / goal) * 100), max);

  style() {
    return `
      :host {
        --fitness-ring-move: #fa114f;
        --fitness-ring-exercise: #92e82a;
        --fitness-ring-stand: #1eeaef;

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
      circle.total {
        display: none;
      }
      .move circle {
        stroke: var(--fitness-move, var(--fitness-ring-move));
        transform: translate(50%, 50%);
      }
      .exercise circle {
        transform: translate(50%, 50%) scale(0.75);
        stroke: var(--fitness-exercise, var(--fitness-ring-exercise));
      }
      .stand circle {
        stroke: var(--fitness-stand, var(--fitness-ring-stand));
        transform: translate(50%, 50%) scale(0.5);
      }
      .move feDropShadow {
        flood-color: var(--fitness-move, var(--fitness-ring-move));
      }
      .exercise feDropShadow {
        flood-color: var(--fitness-exercise, var(--fitness-ring-exercise));
      }
      .stand feDropShadow {
        flood-color: var(--fitness-stand, var(--fitness-ring-stand));
      }
      .viewed .move circle {
        animation: ring 1450ms ease-in-out 50ms forwards;
      }
      .viewed .exercise circle {
        animation: ring 1200ms ease-in-out 300ms forwards;
      }
      .viewed .stand circle {
        animation: ring 950ms ease-in-out 550ms forwards;
      }
      @keyframes ring {
        to {
          stroke-dashoffset: 0;
        }
      }
      @media (prefers-reduced-motion) {
        .move circle,
        .exercise circle,
        .stand circle {
          animation: none;
          stroke-dashoffset: 0;
        }
      }
    `;
  }

  render() {
    return `
      <svg viewBox="0 0 36 36">
        <g class="move">
          <circle stroke-width="3" r="16" class="base"></circle>
          <circle
            stroke-width="3"
            r="16"
            stroke-linecap="round"
            stroke-dashoffset="${this.percentage(
              this.getAttribute('move-total'),
              this.getAttribute('move-goal')
            )}"
            stroke-dasharray="${this.percentage(
              this.getAttribute('move-total'),
              this.getAttribute('move-goal')
            )}, 100"
          ></circle>
          <circle
            stroke-width="3"
            r="16"
            class="total"
            stroke-linecap="round"
            stroke-dasharray="10, 100"
            filter="url(#shadow-move)"
          ></circle>
          <filter id="shadow-move">
            <feDropShadow dx="0" dy="0" stdDeviation="0" flood-opacity="0" />
          </filter>
        </g>

        <g class="exercise">
          <circle stroke-width="4" r="16" class="base"></circle>
          <circle
            stroke-width="4"
            r="16"
            stroke-linecap="round"
            stroke-dashoffset="${this.percentage(
              this.getAttribute('exercise-total'),
              this.getAttribute('exercise-goal')
            )}"
            stroke-dasharray="${this.percentage(
              this.getAttribute('exercise-total'),
              this.getAttribute('exercise-goal')
            )}, 100"
          ></circle>
          <circle
            stroke-width="4"
            r="16"
            class="total"
            stroke-linecap="round"
            stroke-dasharray="10, 100"
            filter="url(#shadow-exercise)"
          ></circle>
          <filter id="shadow-exercise">
            <feDropShadow dx="0" dy="0" stdDeviation="0" flood-opacity="0" />
          </filter>
        </g>

        <g class="stand">
          <circle stroke-width="6" r="16" class="base"></circle>
          <circle
            stroke-width="6"
            r="16"
            stroke-linecap="round"
            stroke-dashoffset="${this.percentage(
              this.getAttribute('stand-total'),
              this.getAttribute('stand-goal')
            )}"
            stroke-dasharray="${this.percentage(
              this.getAttribute('stand-total'),
              this.getAttribute('stand-goal')
            )}, 100"
          ></circle>
          <circle
            stroke-width="6"
            r="16"
            class="total"
            stroke-linecap="round"
            stroke-dasharray="10, 100"
            filter="url(#shadow-stand)"
          ></circle>
          <filter id="shadow-stand">
            <feDropShadow dx="0" dy="0" stdDeviation="0" flood-opacity="0" />
          </filter>
        </g>
      </svg>
    `;
  }
}

if ('customElements' in window) {
  window.customElements.define('fitness-ring', FitnessRing);
}
