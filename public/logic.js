import { XSIZE,YSIZE } from "./sketch.js";
class Cell {
  //-1,-1 空白
  //x, -2 random
  constructor(parentMinoId, cellId, x, y) {
    if (cellId === -2) cellId = Math.floor(Math.random() * 15);
    this.parentMinoId = parentMinoId;
    this.cellId = cellId;
    this.x = x;
    this.y = y;
  }
}
class Mino {
  constructor(cells, id, x, y) {
    //二次元配列
    this.cells = cells;
    this.x = x;
    this.y = y;
    this.id = id;
    this.w = cells.reduce((pre, i) => Math.max(pre, i.length), 0);
  }
}
class Field {
  constructor(cells) {
    this.cells = cells;
    this.combo=this.combo_check();
  }
  combo_check() {
    let dxdy = [
      //近傍の相対的な座標
      [0, 1],
      [1, 0],
      [0, -1],
      [-1, 0],
    ];
    //comboしているミノのidを二次元配列に記録 例:[[1,2,3],[4,6],[5]]
    let combo = [];
    for (let i = 0; i < XSIZE*YSIZE; i++) {
      combo.push([]);
    }

    let uf = new UnionFind(XSIZE * YSIZE);

    //近傍を見て同じCellIdの場合は連結とみなす
    for (let y = 0; y < YSIZE; y++) {
      for (let x = 0; x < XSIZE; x++) {
        if (this.cells[y*XSIZE+x].parentMinoId == -1) continue;

        for (let i = 0; i < 4; i++) {
          let nx = x + dxdy[i][0];
          let ny = y + dxdy[i][1];
          if (
            nx < 0 ||
            nx >= XSIZE ||
            ny < 0 ||
            ny >= YSIZE
          )
            continue;
          if (this.cells[y*XSIZE+x].cellId == this.cells[ny*XSIZE+nx].cellId) {
            uf.union(
              y * XSIZE + x,
              ny * XSIZE + nx
            );
          }
        }
      }
    }

    //描画やスコア計算のために連結集合を配列にまとめる
    for (let y = 0; y < YSIZE; y++) {
      for (let x = 0; x < XSIZE; x++) {
        if (this.cells[y*XSIZE+x].parentMinoId == -1) continue;
        combo[uf.find(y * XSIZE + x)].push(
          new Coordinate(y, x)
        );
      }
    }
    //空の配列を削除
    combo = combo.filter((value) => {
      return value.length > 0;
    });
    //comboを連結数の降順にソート
    combo.sort((a, b) => {
      return b.length - a.length;
    });
    return combo;
  }
  score() {
    //暫定の計算式　全ての連結集合に対して、(連結数-1)の二乗+連結数
    //孤立したセルは 1点 二個連結したセルは 2点 三個連結したセルは 5点 四個連結したセルは 10点
    let combo = this.combo_check();
    let score = 0;
    for (let i = 0; i < combo.length; i++) {
      score += (combo[i].length - 1) * (combo[i].length - 1) + combo[i].length;
    }
    return score;
  }
}
class Coordinate {
  constructor(y, x) {
    this.x = x;
    this.y = y;
  }
}
class UnionFind {
  //GPT製のUnionFind
  constructor(size) {
    this.parent = new Array(size);
    this.rank = new Array(size);

    for (let i = 0; i < size; i++) {
      this.parent[i] = i;
      this.rank[i] = 0;
    }
  }

  find(x) {
    if (this.parent[x] !== x) {
      this.parent[x] = this.find(this.parent[x]);
    }
    return this.parent[x];
  }

  union(x, y) {
    const rootX = this.find(x);
    const rootY = this.find(y);

    if (rootX !== rootY) {
      if (this.rank[rootX] < this.rank[rootY]) {
        this.parent[rootX] = rootY;
      } else if (this.rank[rootX] > this.rank[rootY]) {
        this.parent[rootY] = rootX;
      } else {
        this.parent[rootX] = rootY;
        this.rank[rootY]++;
      }
    }
  }

  isConnected(x, y) {
    return this.find(x) === this.find(y);
  }
}

export { Cell, Coordinate, Field, Mino };
