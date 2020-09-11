import React, { Component } from "react";
import FeildContext from "./FieldContext";

export default class Field extends Component {
  static contextType = FeildContext;

  componentDidMount() {
    const { registerField } = this.context;
    this.unRegisterField = registerField(this);
  }

  componentWillUnmount() {
    this.unRegisterField();
  }
  onStoreChange = () => {
    this.forceUpdate();
  };

  getControlled = () => {
    const { name } = this.props;
    const { getFieldValue,setFieldValue } = this.context;
    return {
      value: getFieldValue(name),
      onChange: event => {
        const newValue = event.target.value;
        console.log("newValue", newValue);
        //想要重新设置input value,那执行仓库的set函数就可以
        setFieldValue({ [name]: newValue });
      }
    };
  };
  render() {
    const { children } = this.props;
    const returnChildNode = React.cloneElement(children, this.getControlled());
    return returnChildNode;
  }
}
