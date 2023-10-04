![](./screenshot.webp)

# Fitness Components

This provides two Web Components for fitness visualisations. The default design
is inspired by Apple Fitness. You can use a fully featured card or just the
rings.

## Installation

```bash
npm install git+https://github.com/trovster/fitness-visualisations.git --save
```

## Usage

These are [Web
Components](https://developer.mozilla.org/en-US/docs/Web/API/Web_Components) and
must be imported before the custom elements can be used.

```html
<script type="module">
  import 'fitness-visualisations/src/FitnessCard.js';
  import 'fitness-visualisations/src/FitnessRing.js';
</script>
```

Both the card and ring require the move, exercise and stand totals and goals.
The card has additional optional values. If you include the date, it appears as
a header. The `steps`, `distance` and `flights` data appear in the summary
section. The distance attribute should be provided in **in meters**. By default,
this is converted to *miles* but you can change this to kilometres using
`units="km"`.

```html
<fitness-card
  date="YYYY-MM-DD"
  units="km | miles"
  steps="0"
  distance="0"
  flights="0"
  move-total="0"
  move-goal="0"
  exercise-total="0"
  exercise-goal="0"
  stand-total="0"
  stand-goal="0"
></fitness-card>

<fitness-ring
  move-total="0"
  move-goal="0"
  exercise-total="0"
  exercise-goal="0"
  stand-total="0"
  stand-goal="0"
></fitness-ring>
```

You can control the font and colours of the card and rings using CSS variables.

```css
--fitness-font: sans-serif;

--fitness-value: #9ca3af;
--fitness-move: #fa114f;
--fitness-exercise: #92e82a;
--fitness-stand: #1eeaef;

--fitness-ring-move: #fa114f;
--fitness-ring-exercise: #92e82a;
--fitness-ring-stand: #1eeaef;
```

You can target the styling of sections within the card component using the
`::part` pseudo-element.

```css
fitness-card::part(header) {}
fitness-card::part(fitness) {}
fitness-card::part(summary) {}
```

## Development

### Linting and Formatting

To scan the project for linting and formatting errors, run:

```bash
npm run lint
```

To automatically fix linting and formatting errors, run:

```bash
npm run format
```

### Local Demo with `web-dev-server`

To start a local development server that serves the basic demo located in
`docs/index.html`, run:

```bash
npm start
```

### Tooling Configs

For most of the tools, the configuration is in the `package.json` to minimize
the amount of files in your project.

If you customize the configuration a lot, you can consider moving them to
individual files.
