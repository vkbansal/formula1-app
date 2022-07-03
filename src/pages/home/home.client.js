/* global racesByCountry, ChartGeo, Chart */
(async () => {
  const data = await fetch(
    'https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries-sans-antarctica.json'
  ).then((r) => r.json());

  const countries = ChartGeo.topojson.feature(
    data,
    data.objects.countries1
  ).features;

  const racesByCountryCopy = { ...racesByCountry };

  const countriesProxy = new Proxy(
    {},
    {
      get(target, key) {
        let countryKey = key;

        switch (key) {
          case 'United States of America':
            countryKey = 'USA';
            break;
          case 'United Arab Emirates':
            countryKey = 'UAE';
            break;
          case 'United Kingdom':
            countryKey = 'UK';
            break;
          case 'South Korea':
            countryKey = 'Korea';
            break;
          case 'Antarctica':
            return null;
        }

        if (countryKey in racesByCountry) {
          delete racesByCountryCopy[countryKey];
          return racesByCountry[countryKey];
        }

        return 0;
      }
    }
  );

  new Chart(document.getElementById('world-map').getContext('2d'), {
    type: 'choropleth',
    data: {
      labels: countries.map((d) => d.properties.name),
      datasets: [
        {
          label: 'Countries',
          outline: countries,
          data: countries.map((d) => ({
            feature: d,
            value: countriesProxy[d.properties.name]
          }))
        }
      ]
    },
    options: {
      showOutline: true,
      showGraticule: false,
      clipMap: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: (item) => {
              return ` ${item.raw.feature.properties.name}: ${item.raw.value} Races`;
            }
          }
        }
      },
      scales: {
        xy: {
          projection: 'mercator'
          // projection: 'equalEarth'
          // padding: 0
        },
        color: {
          interpolate: 'reds'
        }
      }
    }
  });

  console.log(
    'Could not plot data for the following countries:',
    Object.keys(racesByCountryCopy).join(', ') || '-'
  );
})();
