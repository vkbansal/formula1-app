/* global driver_standings, constructor_standings, driver_points, constructor_points, race_names, Chart */
Chart.defaults.color = 'white';
Chart.defaults.borderColor = 'rgba(255, 255, 255, 0.25)';
Chart.defaults.plugins.tooltip = {
  ...Chart.defaults.plugins.tooltip,
  mode: 'interpolate',
  intersect: false,
  position: 'nearest'
};
Chart.defaults.plugins.legend = {
  ...Chart.defaults.plugins.legend,
  display: false
};
Chart.defaults.plugins.crosshair = {
  line: { color: 'white', width: 2 },
  sync: { enabled: false }
};
Chart.defaults.plugins.autocolors = {
  customize(context) {
    const colors = context.colors;

    return {
      background: Chart.helpers
        .color(colors.background)
        .lighten(0.5)
        .saturate(1)
        .rgbString(),
      border: Chart.helpers
        .color(colors.border)
        .lighten(0.5)
        .saturate(1)
        .rgbString()
    };
  }
};
Chart.register(window['chartjs-plugin-autocolors']);

const suffixes = new Map([
  ['one', 'st'],
  ['two', 'nd'],
  ['few', 'rd'],
  ['other', 'th']
]);
const pr = new Intl.PluralRules('en-IN', { type: 'ordinal' });
const formatOrdinals = (n) => `${n}${suffixes.get(pr.select(n))}`;

function getTickValues(data) {
  return data
    .map((r) => ({ name: r.label, position: r.data.find((i) => i !== null) }))
    .reduce((p, c) => ({ ...p, [c.position]: c.name }), {});
}

const driver_standings_tick_values = getTickValues(driver_standings);
const constructor_standings_tick_values = getTickValues(constructor_standings);

// Driver Standings Chart
new Chart(document.getElementById('driver-standings'), {
  type: 'line',
  data: { labels: race_names, datasets: driver_standings },
  options: {
    plugins: {
      tooltip: {
        itemSort: (a, b) => a.raw - b.raw,
        callbacks: {
          label: (item) => ` ${item.dataset.label}: ${formatOrdinals(item.raw)}`
        }
      }
    },
    scales: {
      x: { display: true, grid: { display: true } },
      y: {
        max: driver_standings.length,
        min: 1,
        reverse: true,
        offset: true,
        grid: { display: false },
        text: driver_standings.map((d) => d.label),
        ticks: {
          count: driver_standings.length,
          callback: (value) => driver_standings_tick_values[value]
        }
      }
    }
  }
});

// Driver Points Chart
new Chart(document.getElementById('driver-points'), {
  type: 'line',
  data: { labels: race_names, datasets: driver_points },
  options: {
    plugins: { tooltip: { itemSort: (a, b) => b.raw - a.raw } },
    scales: {
      x: { display: true, ticks: { display: true } },
      y: { min: 0, ticks: { display: true } }
    }
  }
});

// Constructors Standings Chart
new Chart(document.getElementById('constructor-standings'), {
  type: 'line',
  data: { labels: race_names, datasets: constructor_standings },
  options: {
    plugins: {
      tooltip: {
        itemSort: (a, b) => a.raw - b.raw,
        callbacks: {
          label: (item) => ` ${item.dataset.label}: ${formatOrdinals(item.raw)}`
        }
      }
    },
    scales: {
      x: { display: true, grid: { display: true } },
      y: {
        max: constructor_standings.length,
        min: 1,
        reverse: true,
        offset: true,
        grid: { display: false },
        text: constructor_standings.map((d) => d.label),
        ticks: {
          count: constructor_standings.length,
          callback: (value) => constructor_standings_tick_values[value]
        }
      }
    }
  }
});

// Contructors Points Chart
new Chart(document.getElementById('constructor-points'), {
  type: 'line',
  data: { labels: race_names, datasets: constructor_points },
  options: {
    plugins: {
      tooltip: { itemSort: (a, b) => b.raw - a.raw }
    },
    scales: {
      x: { display: true, ticks: { display: true } },
      y: { min: 0, ticks: { display: true } }
    }
  }
});
