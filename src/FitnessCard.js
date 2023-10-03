import './FitnessRing.js';

export default class FitnessCard extends HTMLElement {
  static observedAttributes = [
    'date',
    'unit',
    'steps',
    'distance',
    'flights',
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

    this.observer = new IntersectionObserver(
      elements => {
        elements.forEach(element => {
          if (element.isIntersecting) {
            element.target.classList.add('visible');
          } else {
            element.target.classList.remove('visible');
          }
        });
      },
      { threshold: 0.5 }
    );

    this.observer.observe(wrapper);
  }

  disconnectedCallback() {
    this.observer.disconnect();
  }

  // Conversions.
  number = number => Number(number).toLocaleString();

  date = date =>
    new Date(date).toLocaleDateString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  // Defaults.
  units = () => this.getAttribute('units') ?? 'miles';

  // Check attributes exist.
  hasHeader = () => this.getAttribute('date');

  hasSummary = () =>
    this.getAttribute('steps') ||
    this.getAttribute('distance') ||
    this.getAttribute('flights');

  // Distance value and units.
  distanceValue() {
    switch (this.units()) {
      case 'km':
      case 'kilometers':
      case 'kilometres':
        return (this.getAttribute('distance') / 1000).toFixed(2);

      case 'miles':
        return (this.getAttribute('distance') / 1609.344).toFixed(2);

      default:
        return this.getAttribute('distance');
    }
  }

  distanceUnit() {
    switch (this.units()) {
      case 'km':
      case 'kilometers':
        return 'Kilometers';

      case 'miles':
        return 'Miles';

      default:
        return this.units();
    }
  }

  distanceShorthand() {
    switch (this.units()) {
      case 'km':
      case 'kilometers':
        return 'km';

      case 'miles':
        return 'mi';

      default:
        return this.units();
    }
  }

  // Fitness total/goal methods.
  move = () =>
    `${this.number(this.getAttribute('move-total'))}/${this.number(
      this.getAttribute('move-goal')
    )}`;

  exercise = () =>
    `${this.number(this.getAttribute('exercise-total'))}/${this.number(
      this.getAttribute('exercise-goal')
    )}`;

  stand = () =>
    `${this.number(this.getAttribute('stand-total'))}/${this.number(
      this.getAttribute('stand-goal')
    )}`;

  style() {
    return `
      :host {
        --fitness-move: #fa114f;
        --fitness-exercise: #92e82a;
        --fitness-stand: #1eeaef;
        --fitness-font: "SF Mono", "Monaco", "Inconsolata", "Fira Mono", "Droid Sans Mono", "Source Code Pro", monospace;
        --fitness-value: inherit;

        display: block;
        font-family: var(--fitness-font);
      }
      dl {
        margin: 0;
        line-height: 1.25;
        text-align: center;
      }
      dl > div {
        margin: 0 0 1.25rem;
        letter-spacing: -0.075rem;
      }
      dl > div:last-child {
        margin-bottom: 0;
      }
      dt {
        margin: 0;
        font-size: 1.4rem;
      }
      dd {
        margin: 0;
        font-size: 1.5rem;
        font-variant-numeric: tabular-nums;
      }
      .text-value {
        color: var(--fitness-value);
      }
      .text-move {
        color: var(--fitness-move);
      }
      .text-exercise {
        color: var(--fitness-exercise);
      }
      .text-stand {
        color: var(--fitness-stand);
      }
      abbr {
        font-size: 0.6em;
        text-decoration: none;
        text-transform: uppercase;
        margin-left: 3px;
        letter-spacing: 0;
      }
      [part="header"] {
        margin: 0 0 1rem;
        padding: 1rem 0.5rem 0;
        font-size: 1.25rem;
        text-align: center;
      }
      [part="fitness"] {
        display: flex;
        margin: 1rem 0;
        padding: 0 1rem;
        flex-direction: column;
        align-items: center;
        justify-content: space-evenly;
      }
      [part="summary"] {
        margin: 1rem 0 0;
        padding: 0 0.5rem 1rem;
      }
      [part="summary"] dl {
        display: flex;
        flex-direction: column;
        items-align: center;
        text-align: center;
        justify-content: space-evenly;
        border-top: 3px solid transparent;
      }
      fitness-ring {
        margin-top: 1rem;
        max-width: 360px;
      }

      @media (min-width: 640px) {
        dl {
          line-height: 1.1;
        }
        dt {
          font-size: 1.4rem;
        }
        dd {
          font-size: 1.5rem;
        }
        [part="header"] {
          font-size: 1.66rem;
        }
        [part="fitness"] {
          flex-direction: row;
        }
        [part="fitness"] dl {
          text-align: left;
        }
        [part="summary"] dl {
          flex-direction: row;
        }
        [part="summary"] dl > div {
          margin-bottom: 0;
        }
        [part="summary"] dl dt {
          margin-bottom: 0.25rem;
        }
        fitness-ring {
          max-width: 45%;
          margin-top: 0;
        }
      }

      @media (min-width: 870px) {
        dt {
          font-size: 1.5rem;
        }
        dd {
          font-size: 1.75rem;
        }
        fitness-ring {
          max-width: 360px;
        }
      }
    `;
  }

  header = () =>
    this.hasHeader()
      ? `
    <div part="header">
      ${this.date(this.getAttribute('date'))}
    </div>
  `
      : '';

  stats = () => `
    <dl part="stats">
      <div>
        <dt>Move</dt>
        <dd class="text-move">
          ${this.move()}<abbr title="Kilocalories">Kcal</abbr>
        </dd>
      </div>

      <div>
        <dt>Exercise</dt>
        <dd class="text-exercise">
          ${this.exercise()}<abbr title="Minutes">min</abbr>
        </dd>
      </div>

      <div>
        <dt>Stand</dt>
        <dd class="text-stand">
          ${this.stand()}<abbr title="Hours">hrs</abbr>
        </dd>
      </div>
    </dl>
  `;

  steps = () =>
    this.getAttribute('steps')
      ? `
    <div>
      <dt>Steps</dt>
      <dd class="text-value">${this.number(this.getAttribute('steps'))}</dd>
    </div>
  `
      : '';

  distance = () =>
    this.getAttribute('distance')
      ? `
    <div>
      <dt>Distance</dt>
      <dd class="text-value">${this.distanceValue()}<abbr title="${this.distanceUnit()}">${this.distanceShorthand()}</abbr></dd>
    </div>
  `
      : '';

  flights = () =>
    this.getAttribute('flights')
      ? `
    <div>
      <dt>Flights</dt>
      <dd class="text-value">${this.number(this.getAttribute('flights'))}</dd>
    </div>
  `
      : '';

  summary = () =>
    this.hasSummary()
      ? `
    <div part="summary">
      <dl>
        ${this.steps()}
        ${this.distance()}
        ${this.flights()}
      </dl>
    </div>
  `
      : '';

  render() {
    return `
      ${this.header()}

      <div part="fitness">
        ${this.stats()}

        <fitness-ring
          move-total="${this.getAttribute('move-total')}"
          move-goal="${this.getAttribute('move-goal')}"
          exercise-total="${this.getAttribute('exercise-total')}"
          exercise-goal="${this.getAttribute('exercise-goal')}"
          stand-total="${this.getAttribute('stand-total')}"
          stand-goal="${this.getAttribute('stand-goal')}"
        ></fitness-ring>
      </div>

      ${this.summary()}
    `;
  }
}

window.customElements.define('fitness-card', FitnessCard);
