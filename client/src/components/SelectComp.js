import React from 'react'
import Select from "react-select";
export const SelectComp = (props) => {
  return (
    <div>
    <Select options={props.options} placeholder={props.placeholder}
               isMulti onChange={(data)=>props.onChange(data.map(item=>{return{userId:item.value, nickname:item.label}}))}    styles={{
                control: (baseStyles, state) => ({
                  ...baseStyles,
                  width:"350px", backgroundColor:"#39191b" , 
                }),
                singleValue: (provided, state) => ({
                  ...provided,
                  color: "white",
                  fontSize: state.selectProps.myFontSize
                }),
                input: (provided, state) => ({
                  ...provided,
                  color: "white",
                  fontSize: state.selectProps.myFontSize
                }),
              }}/>
    </div>
  )
}
