![](./screenshot.webp)

# Fitness Components

This provides two Web Components for fitness visualisations. You can use a fully
featured fitness card or just the activity rings on their own. The default
activity ring design is inspired by Apple Fitness.

## Installation

```bash
npm install @trovster/fitness-visualisations --save
```

## Usage

These are [Web
Components](https://developer.mozilla.org/en-US/docs/Web/API/Web_Components) and
must be imported before the custom elements can be used. If you are using the
fitness card, then you do not need to import the activity ring.

```html
<script type="module">
  import '@trovster/fitness-visualisations/src/FitnessCard.js';
  import '@trovster/fitness-visualisations/src/FitnessRing.js';
</script>
```

Both the card and ring require the `calories`, `minutes` and `hours` totals and
goals. The card has additional optional values. If you include the date, it
appears as a header. The `steps`, `distance` and `flights` data appear in the
footer section. The distance attribute should be provided **in meters**. By
default, this is converted to *miles*, but you can change this to kilometres
using `units="km"`.

```html
<fitness-card
  date="YYYY-MM-DD"
  units="km | miles"
  steps="0"
  distance="0"
  flights="0"
  calories-total="0"
  calories-goal="0"
  minutes-total="0"
  minutes-goal="0"
  hours-total="0"
  hours-goal="0"
></fitness-card>

<fitness-ring
  calories-total="0"
  calories-goal="0"
  minutes-total="0"
  minutes-goal="0"
  hours-total="0"
  hours-goal="0"
></fitness-ring>
```

### Custom Text

You can provide a custom header by using the named `<slot>`. You can also change
the text for “calories”, “minutes” and “hours”.

```html
<fitness-card>
  <div slot="header">The Custom Header</div>
  <div slot="calories">Move</div>
  <div slot="minutes">Exercise</div>
  <div slot="hours">Stand</div>
</fitness-card>
```

### Replayable

The activity rings animation can be replayed when using the `replayable="true"`
attribute. When the activity rings are clicked, the animation is replayed in
reverse, then completed again.

### Styling

The typeface and colours of the text and rings can be changed using CSS
variables. The `--fitness-value` controls the colour of the *values* in the
footer.

The colours of the fitness card values are linked to the ring colours, so they
can not be configured independently. To change the fitness card colours you must
use the CSS variable without the `-ring` value.

```css
--fitness-font: sans-serif;

--fitness-value: #9ca3af;
--fitness-calories: #fa114f;
--fitness-minutes: #92e82a;
--fitness-hours: #1eeaef;

--fitness-ring-calories: #fa114f;
--fitness-ring-minutes: #92e82a;
--fitness-ring-hours: #1eeaef;
```

If you provide labels, they can be styled using `--fitness-label` CSS variable.
You can target each label independently by using the appropriate `[slot]`
selector and setting the CSS variable.

```css
fitness-ring [slot="label-calories"] {
    --fitness-label: #B31162;
}
fitness-ring [slot="label-minutes"] {
    --fitness-label: #1FAD8F;
}
fitness-ring [slot="label-hours"] {
    --fitness-label: #1689A0;
}
```

You can target the styling of sections within the fitness card visualisation
using the `::part` pseudo-element.

```css
fitness-card::part(header) {}
fitness-card::part(main) {}
fitness-card::part(ring) {}
fitness-card::part(footer) {}
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
