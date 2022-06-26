/* global driversData, constructorsData, raceNames, Chart */
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
    .map((r) => ({ name: r.label, ps: r.data.find((i) => i !== null).ps }))
    .reduce((p, c) => ({ ...p, [c.ps]: c.name }), {});
}

const driverStandingsTickValues = getTickValues(driversData);
const constructorStandingsTickValues = getTickValues(constructorsData);

// Driver Standings Chart
new Chart(document.getElementById('driver-standings'), {
  type: 'line',
  data: {
    labels: raceNames,
    datasets: driversData
  },
  options: {
    parsing: { yAxisKey: 'ps', xAxisKey: 'ps' },
    plugins: {
      tooltip: {
        itemSort: (a, b) => a.raw.ps - b.raw.ps,
        callbacks: {
          label: (item) =>
            `${item.dataset.label}: ${formatOrdinals(item.raw.ps)}`
        }
      }
    },
    scales: {
      x: { display: true, grid: { display: true } },
      y: {
        max: driversData.length,
        min: 1,
        reverse: true,
        offset: true,
        grid: { display: false },
        text: driversData.map((d) => d.label),
        ticks: {
          count: driversData.length,
          callback: (value) => driverStandingsTickValues[value]
        }
      }
    }
  }
});

// Driver Points Chart
new Chart(document.getElementById('driver-points'), {
  type: 'line',
  data: { labels: raceNames, datasets: driversData },
  options: {
    parsing: { yAxisKey: 'pt', xAxisKey: 'pt' },
    plugins: {
      tooltip: {
        itemSort: (a, b) => b.raw.pt - a.raw.pt,
        callbacks: {
          label: (item) =>
            `${item.dataset.label}: ${item.raw.pt} (Wins: ${item.raw.w})`
        }
      }
    },
    scales: {
      x: { display: true, ticks: { display: true } },
      y: { min: 0, ticks: { display: true } }
    }
  }
});

// Constructors Standings Chart
new Chart(document.getElementById('constructor-standings'), {
  type: 'line',
  data: { labels: raceNames, datasets: constructorsData },
  options: {
    parsing: { yAxisKey: 'ps', xAxisKey: 'ps' },
    plugins: {
      tooltip: {
        itemSort: (a, b) => a.raw.ps - b.raw.ps,
        callbacks: {
          label: (item) =>
            `${item.dataset.label}: ${formatOrdinals(item.raw.ps)}`
        }
      }
    },
    scales: {
      x: { display: true, grid: { display: true } },
      y: {
        max: constructorsData.length,
        min: 1,
        reverse: true,
        offset: true,
        grid: { display: false },
        text: constructorsData.map((d) => d.label),
        ticks: {
          count: constructorsData.length,
          callback: (value) => constructorStandingsTickValues[value]
        }
      }
    }
  }
});

// Contructors Points Chart
new Chart(document.getElementById('constructor-points'), {
  type: 'line',
  data: { labels: raceNames, datasets: constructorsData },
  options: {
    parsing: { yAxisKey: 'pt', xAxisKey: 'pt' },
    plugins: {
      tooltip: {
        itemSort: (a, b) => b.raw.pt - a.raw.pt,
        callbacks: {
          label: (item) =>
            `${item.dataset.label}: ${item.raw.pt} (Wins: ${item.raw.w})`
        }
      }
    },
    scales: {
      x: { display: true, ticks: { display: true } },
      y: { min: 0, ticks: { display: true } }
    }
  }
});
