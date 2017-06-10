import React, { Component } from 'react';

export default class Cell extends Component {
  constructor(props) {
    super(props);
    this.state= {
      hasMine: props.cell.hasMine,
      isOpened: props.cell.isOpened,
      hasFlag: props.cell.hasFlag,
      count: 0
    };
  }
  componentWillReceiveProps(nextProps) {
    this.setState= ({
      hasMine: nextProps.cell.hasMine,
      isOpened: nextProps.cell.isOpened,
      hasFlag: nextProps.cell.hasFlag,
      count: nextProps.cell.count
    });
  }
  open() {
    this.props.open(this.props.cell);
  }
  mark(e) {
    e.preventDefault();
    if(!this.state.isOpened) {
      this.props.mark(this.props.cell);
    }
  }
  render() {
    var cell = () => {
      if(_this.state.isOpened){
        if(_this.state.hasMine){
          return (
            <div className="Cell__cover Cell__cover--opened">
                <span className="Cell__bomb">b</span>
            </div>
          );
        } else {
          return (
            <div className="Cell__cover Cell__cover--opened">
                <span className={"Cell__number"+_this.state.count}>{_this.state.count}</span>
            </div>
          );
        }
      } else if(_this.state.hasFlag){
        return (
          <div className="Cell__cover Cell__cover--opened">
              <span className="Cell__flag">f</span>
          </div>
        );
      } else {
        return (
          <div className="Cell__cover"></div>
        );
      }
    }();

    return (
      <td className="Cell" onClick={this.open.bind(this)} onContextMenu={this.mark.bind(this)}>
        {cell}
      </td>
   );
  }
}
