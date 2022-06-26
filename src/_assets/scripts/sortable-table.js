/* global Alpine, tableData */
document.addEventListener('alpine:init', () => {
  function normalize(data) {
    if (typeof data === 'string') {
      return data.normalize('NFD');
    }

    return data;
  }

  Alpine.data('tableData', () => ({
    data: tableData,
    sortCol: null,
    sortAsc: false,
    sort(col) {
      this.sortAsc = this.sortCol === col ? !this.sortAsc : true;
      this.sortCol = col;
      this.data.sort((a, b) => {
        if (normalize(a[col]) < normalize(b[col])) {
          return this.sortAsc ? -1 : 1;
        }

        if (normalize(a[col]) > normalize(b[col])) {
          return this.sortAsc ? 1 : -1;
        }

        return 0;
      });
    }
  }));
});
