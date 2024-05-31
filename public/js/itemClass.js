class ItemClass {
  constructor(_parent, item) {
    this.parent = _parent;
    this.label = item.label
    this.score = item.score
    this.prec = (item.score * 100).toFixed(2);

    this.render();
  }

  render() {
    let div = document.createElement("div");
    div.className = "box_inside";
    document.querySelector(this.parent).append(div);
    div.innerHTML = `
    <label>${this.label}</label>
    <div class="bar_rank w-100" >
      <div class="bar_rank_inside" style="width: ${Math.max(this.prec,15)}%;">${this.prec}%</div>
    </div>
    
    `
  }
}

export default ItemClass;