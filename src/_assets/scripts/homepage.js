/* global racesByCountry */
const MAX = racesByCountry.data[0].count;
const MIN = racesByCountry.data[racesByCountry.data.length - 1].count;

const svg = document.getElementById('world-map');
const tooltip = document.getElementById('world-map-tooltip');
let tooltipTimer = null;

svg.addEventListener('mouseover', (e) => {
  if (e.target.tagName === 'path') {
    if (tooltipTimer) {
      window.clearTimeout(tooltipTimer);
    }
    const box = e.target.getBBox();
    const country = e.target.getAttribute('name');
    const index = racesByCountry.indexMap[country];
    const count =
      typeof index === 'number' ? racesByCountry.data[index].count : 0;
    const svgScale = svg.clientWidth / 2000;

    tooltip.setAttribute('data-text', `${country}: ${count} races till date`);
    tooltip.style.transform = `translate(${
      (box.x + box.width / 2) * svgScale
    }px, ${(box.y + box.height / 2) * svgScale}px)`;
    tooltip.style.display = 'block';
  }
});

svg.addEventListener('mouseout', () => {
  if (tooltipTimer) {
    window.clearTimeout(tooltipTimer);
  }
  tooltipTimer = window.setTimeout(() => {
    tooltip.style.display = 'none';
  }, 200);
});

racesByCountry.data.forEach(({ country, count }) => {
  if (country === 'Korea') {
    country = 'South Korea';
  }

  const elems = svg.querySelectorAll(`path[name="${country}"]`);

  if (elems.length === 0) {
    console.log(`Could not locate "${country}" in the svg map`);
    return;
  }

  const lightness = 100 - ((count - MIN) * 44) / (MAX - MIN);

  elems.forEach((elem) => {
    elem.setAttribute('fill', `hsla(2deg, 100%, ${lightness.toFixed(0)}%, 1)`);
  });
});
