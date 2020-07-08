import React, { useEffect, useState} from 'react';
import {ReactSortable} from "react-sortablejs";
import Message from "./Message";

const PDFGridRender = props => {
    let pageAttr = props.pageData
    const [state, setState] = useState(pageAttr);
    let stateCopy = []
    console.log(state)

    const saveDeg = (str) =>{

        //
    }

    const deletePage = (state, key) => {
        //remove from state
        let newStateArr = state.filter(function (obj) {
            return obj.key !== key
        })
        console.log(newStateArr)
        //return newStateArr
    }

    const mergeData = () =>{

    }

   useEffect(()=>{
        setState(props.pageData)
        console.log(props.pageData)
    },[props.pageData])

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