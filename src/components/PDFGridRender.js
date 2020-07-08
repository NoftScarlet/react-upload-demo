import React, { useEffect, useState} from 'react';
import {ReactSortable} from "react-sortablejs";
import Message from "./Message";

const PDFGridRender = props => {
    let pageAttr = props.pageData
    const [state, setState] = useState(pageAttr);
    const [deletes, setDeletes] = useState([])


    useEffect(()=>{
        setState([...state, ...props.pageData])
        console.log(props.pageData)
    },[props.pageData])

    useEffect(()=>{
        setState(deletes)
        console.log(deletes)
    },[deletes])

    const saveDeg = (str) =>{

        //
    }

    const deletePage = (state, key) => {
        //remove from state
        let arr =[]
        arr = state.filter(function (obj) {
            return obj.key !== key
        })
        setDeletes(arr)

    }

    const mergeData = () =>{

    }

    const reRender =() => {

    }

    return (
        <div className={"col"}>
            <ReactSortable list={state} setList={setState}>
                {state.map(doc => (
                    <>
                    <div key={doc.fingerprint + "-" + doc.pageNum} className={"grid-square"}>
                        <canvas id={`canvas-${doc.fingerprint}-${doc.pageNum}`}>.</canvas>
                        <Message msg={doc.fileName + " -page " + doc.pageNum}/>
                        <button onClick={()=>saveDeg(state,doc.key)} >rotate</button>
                        <button onClick={()=>deletePage(state,doc.key)} >delete</button>
                    </div>

                    </>

                ))}
            </ReactSortable>
        </div>
    );
};

export default PDFGridRender