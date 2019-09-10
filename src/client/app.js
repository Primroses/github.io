import React from "react";
import { hot } from "react-hot-loader/root";
import "./app.scss"

class App extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      name:"SDZ",
      age:20
    }
  }

  render(){
    return (
      <div className="head">
        <p>Learning React SSRRRRRRRRRR</p>
      </div>
    )
  }

}


export default hot(App);
