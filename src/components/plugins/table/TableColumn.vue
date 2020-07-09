<script>

export default {
  props: {
    index: Number,
    row: {
      type: Object,
      default() {
        return {};
      },
    },
    col: {
      type: Object,
      default() {
        return {};
      },
    },
    renderTable: {
      type: Function,
      default: () => {},
    },
  },
  render(h) {
    return this.renderTable(h, {
      index: this.index,
      row: this.row,
      col: this.col,
    });
  },
};
</script>
