import React, { Component } from 'react';
import MineField from './MineField.jsx';

export default class Minesweeper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      numRow: 10,         //number of rows of the field
      numCol: 10,         //number of columns of the field
      numMine: 10,        //number of mines in the field
      numFlag: 0,         //number of flags used by the player
      numOpen: 0,         //number of opened cells
      time: 0,            //the timer displayed
      status: "playing"   // playing, clear, gameover
    };
  }
  componentWillUpdate() {
    if(this.state.status === "playing") {
      this.judge.call(this);
    }
  }
  componentWillMount() {
    this.intervals = [];
  }
  tick() {
    if(this.state.numOpen > 0 && this.state.status === "playing") {
      this.setState({time: this.state.time + 1});
    }
  }
  judge() {
    if(this.state.numOpen + this.state.numMine >= (this.state.numRow * this.state.numCol)) {
      this.setState({status: "clear"});
      clearInterval(this.interval);
    }
  }
  gameOver() {
    this.setState({status: "gameover"});
  }
  checkNumFlag(update) {
    this.setState({numFlag: this.state.numFlag + update});
  }
  addNumOpen() {
    console.log("add open");
    console.log(this.state.numOpen);
    if(this.state.numOpen === 0) {
      this.interval = setInterval(this.tick.bind(this), 1000);
    }
    this.setState({numOpen: (this.state.numOpen + 1)});
  }
  reset() {
    clearInterval(this.interval);
    this.setState({numOpen: 0, numFlag: 0, time: 0, status: "playing"});
  }
  render() {
    return(
      <div className="Minesweeper">
        <span className="numFlag"> {this.state.numMine - this.state.numFlag} </span>
        <span className="face" onClick={this.reset.bind(this)}>
          <span className={"button " + this.state.status} />
        </span>
        <span className="time"> {this.state.time} </span>
        <MineField numOpen={this.state.numOpen} numMine={this.state.numMine} numRow={this.state.numRow}
                  numCol={this.state.numCol} gameOver={this.gameOver.bind(this)} addNumOpen={this.addNumOpen.bind(this)}
                  checkNumFlag={this.checkNumFlag.bind(this)} />
      </div>
    );
  }
}
