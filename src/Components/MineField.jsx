import React, { Component } from 'react';
import Row from './Row.jsx'

export default class MineField extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rows: this.createMineField(props)
    };
  }
  componentWillReceiveProps(nextProps) {
    if(this.props.numOpen > nextProps.numOpen || this.props.numCol !== nextProps.numCol) {
      this.setState({
        rows: this.createMineField(nextProps)
      });
    }
  }
  createMineField(props) {
    var matrix = [];
    var i;
    for(i = 0; i < props.numRow; i++) {
      matrix.push([]);
      for(var j = 0; j < props.numCol; j++) {
        matrix[i].push({
          x: i,
          y: j,
          count: 0,
          isOpened: false,
          hasMine: false,
          hasFlag: false
        });
      }
    }
    for(i = 0; i < props.numMine; i++) {
      var cell = matrix[Math.floor(Math.random() * props.numRow)][Math.floor(Math.random() * props.numCol)];
      if(cell.hasMine) {
        i--;
      } else {
        cell.hasMine = true;
      }
    }
    return matrix;
  }
  open(cell) {
    var _rows = this.state.rows;
    if(!(_rows[cell.x][cell.y].isOpened)) {
      console.log("here");
      this.props.addNumOpen();
    }
    _rows[cell.x][cell.y].isOpened = true;

    var numAdjascentMines = this.countMines(cell);
    _rows[cell.x][cell.y].count = cell.hasMine ? "b" : numAdjascentMines;
    this.setState({rows: _rows});

    if(_rows[cell.y][cell.x].hasFlag) {
      _rows[cell.y][cell.x].hasFlag = false;
      this.props.checkNumFlag(-1);
    }

    if(!(cell.hasMine) && numAdjascentMines === 0) {
      this.openAround(cell);
    }

    if(cell.hasMine) {
      this.props.gameOver();
    }
  }
  mark(cell) {
    var rows = this.state.rows;
    cell = rows[cell.x][cell.y];

    cell.hasFlag = !cell.hasFlag;
    this.setState({rows: rows});
    this.props.checkNumFlag(cell.hasFlag ? 1 : -1);
  }
  countMines(cell) {
    var numMine = 0;
    var row, col;

    //check cells around given cell for mines
    for(var i = -1; i <= 1; i++) {
      for(var j = -1; j <= 1; j++) {
        row = cell.x + i;
        col = cell.y + j;
        if( (row >= 0) && (col >= 0) && (row < this.props.numRow) && (col < this.props.numCol) ) {
          if(i === 0 && j === 0) {continue;}
          if(this.state.rows[row][col].hasMine) {
            numMine++;
          }
        }
      }
    }
    return numMine;
  }
  openAround(cell) {
    var row, col;
    var rows = this.state.rows;
    //check cells around given cell for mines
    for(var i = -1; i <= 1; i++) {
      for(var j = -1; j <= 1; j++) {
        row = cell.x + i;
        col = cell.y + j;
        if( (row >= 0) && (col >= 0) && (row < this.props.numRow) && (col < this.props.numCol) ) {
          if(i === 0 && j === 0) {continue;}
          if(!(rows[row][col].hasMine) && !(rows[row][col].isOpened)) {
            this.open(rows[row][col]);
          }
        }
      }
    }

  }
  render() {
    var Rows = this.state.rows.map((row, index) => {
      return(
        <Row cells={row} open={this.open.bind(this)} mark={this.mark.bind(this)} />
      );
    });

    return (
      <table className="MineField">
        <tbody>{Rows}</tbody>
      </table>
    );
  }

}
