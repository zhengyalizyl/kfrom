import React from 'react'

//定义一个仓库
class FormStore{
  constructor(props){
    this.store={};
    //存储Field实例
    this.FieldEntities=[];
    this.callbacks={};
  }

  registerField=(entity)=>{
    console.log(entity,'enttty')
      this.FieldEntities.push(entity)
      return ()=>{
        this.FieldEntities=this.FieldEntities.filter(item=>item!==entity);
        delete this.store[entity.props.name]
      }
  }
 setCallback=callback=>{
   this.callbacks={
     ...this.callbacks,
     ...callback
   }
 }

  //设置this.store
  getFieldValue=(name)=>{
    return this.store[name]
  };

  //获取store的值
  setFieldValue=(newStore)=>{
    this.store={
      ...this.store,
      ...newStore
    };
   
    //store已经更新，下一步更新组件
    this.FieldEntities.forEach(entity=>{
      const {name}=entity.props;
      console.log(entity,newStore)
      Object.keys(newStore).forEach(key=>{
            if(key===name){
              entity.onStoreChange()
            }
      })
    })
  };

  validate=()=>{
    let err=[];
    // todo
    this.FieldEntities.forEach(entity=>{
      const {name,rules}=entity.props;
      let value=this.getFieldValue(name);
      let rule=rules&&rules[0];
      if(rule&&rule.required&&(value===undefined||value==='')){
        err.push({
          [name]:rules.message,
          value
        })
      }
    })
    return err;
  }
  submit=()=>{
    const { onFinish,
      onFinishFailed}=this.callbacks;
    //校验
    let err=this.validate()
    if(err.length===0){
      onFinish(this.store)
    }else if(err.length>0){
      onFinishFailed(err)
    }
    //根据校验结果，如果成功调用onFinished,失败否则调用onFinishFailed

  }
  getForm=()=>{
    return {
      getFieldValue:this.getFieldValue,
      setFieldValue:this.setFieldValue,
      registerField:this.registerField,
      submit:this.submit,
      setCallback:this.setCallback
    }
  }
}

export default function useForm() {
  const formRef=React.useRef();
  if(!formRef.current){
    const  formStore=new FormStore();
    formRef.current=formStore.getForm();
  }

  return [formRef.current]
}
