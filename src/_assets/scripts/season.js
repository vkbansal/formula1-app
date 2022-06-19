/* global driver_standings, constructor_standings, driver_points, constructor_points, race_names, Chart */
Chart.defaults.color = 'white';
Chart.defaults.borderColor = 'rgba(255, 255, 255, 0.25)';

const driver_standings_tick_values = driver_standings
  .map((driver) => ({
    name: driver.label,
    position: driver.data.find((i) => i !== null)
  }))
  .reduce((p, c) => ({ ...p, [c.position]: c.name }), {});

const constructor_standings_tick_values = constructor_standings
  .map((constructor) => ({
    name: constructor.label,
    position: constructor.data.find((i) => i !== null)
  }))
  .reduce((p, c) => ({ ...p, [c.position]: c.name }), {});

// Driver Standings Chart
new Chart(document.getElementById('driver-standings'), {
  type: 'line',
  data: { labels: race_names, datasets: driver_standings },
  options: {
    plugins: {
      legend: { display: false },
      mouseLine: {
        color: '#32d296'
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
    plugins: { legend: { display: false } },
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
    plugins: { legend: { display: false } },
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
  },
  plugin: [
    {
      id: 'mouseLine',
      afterEvent: function (chart, e) {
        var chartArea = chart.chartArea;
        if (
          e.x >= chartArea.left &&
          e.y >= chartArea.top &&
          e.x <= chartArea.right &&
          e.y <= chartArea.bottom &&
          chart.active.length
        ) {
          chart.options.mouseLine.x = chart.active[0]._model.x;
        } else {
          chart.options.mouseLine.x = NaN;
        }
      },
      afterDraw: function (chart, easing) {
        var ctx = chart.chart.ctx;
        var chartArea = chart.chartArea;
        var x = chart.options.mouseLine.x;

        if (!isNaN(x)) {
          ctx.save();
          ctx.strokeStyle = chart.options.mouseLine.color;
          ctx.lineWidth = 1;
          ctx.moveTo(chart.options.mouseLine.x, chartArea.bottom);
          ctx.lineTo(chart.options.mouseLine.x, chartArea.top);
          ctx.stroke();
          ctx.restore();
        }
      }
    }
  ]
});

// Contructors Points Chart
new Chart(document.getElementById('constructor-points'), {
  type: 'line',
  data: { labels: race_names, datasets: constructor_points },
  options: {
    plugins: { legend: { display: false } },
    scales: {
      x: { display: true, ticks: { display: true } },
      y: { min: 0, ticks: { display: true } }
    }
  }
});
// https://codepen.io/kurkle/pen/KKVgQXV
// https://gist.github.com/x8BitRain/670e5e1dc3f12619be4a1a96ff6dc8de
