import React, { Component } from "react";
import FieldContext from "./FieldContext";

export default function Form(props) {
  const {form,children,onFinish, onFinishFailed}=props;
  form.setCallback({
    onFinish,
    onFinishFailed
  })
  return (
    <form
      onSubmit={event => {
        event.preventDefault();
        form.submit();
        console.log("tiji");
      }}
    >
      <FieldContext.Provider value={form}>
        {children}
      </FieldContext.Provider>
    </form>
  );
}
