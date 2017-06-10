import React, { Component } from 'react';
import Rows from './rows.jsx'

export default class MineField extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rows: this.createTable(props)
    };
  }
  componentWillReceiveProps(nextProps) {
    if(this.props.numOpen > nextProps.numOpen || this.props.numCol !== nextProps.numCol) {
      this.setState({
        rows: this.createTable(nextProps)
      });
    }
  }
  createMineField(props) {
    var matrix = [];
    for(var i = 0; i < props.numRow; i++) {
      for(var j = 0; j < props.numCol; j++) {
        matrix[i][j].push({
          x: i,
          y: j,
          count: 0,
          isOpened: false,
          hasMine: false,
          hasFlag: false
        });
      }
    }
    for(var i = 0; i < props.numMine; i++) {
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
    var rows = this.state.rows;
    if(!(rows[cell.x][cell.y].isOpened)) {
      this.props.addNumOpen();
    }
    rows[cell.x][cell.y].isOpened = true;

    var numAdjascentMines = this.countMines();
    rows[cell.x][cell.y].count = cell.hasMine ? "b" : numAdjascentMines;
    this.setState({rows: rows});

    if(rows[cell.y][cell.x].hasFlag) {
      rows[cell.y][cell.x].hasFlag = false;
      this.props.checkNumFlag(-1);
    }

    if(!(cell.hasMine) && numAdjascentMines == 0) {
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
  openAround() {
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
    var Rows = this.state.map((row, index) => {
      return(
        <Row cells={row} open={this.open.bind(this)} mark={this.mark.bind(this)} />
      );
    });

    return (
      <table className="MineField">
        <tbody> {Rows} </tbody>
      </table>
    );
  }

}
