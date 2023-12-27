class Cell{
    //-1,-1 空白
    constructor(parentMinoId, cellId){
        this.parentMinoId=parentMinoId;
        this.cellId = cellId;
    }
}
class Mino{
    constructor(cells){
        //二次元配列
        this.cells = cells;
    }
}
class Field{
    constructor(cells){
        this.cells = cells;
    }
}
