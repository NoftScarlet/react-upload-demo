import React, { useEffect, useState} from 'react';
import {ReactSortable} from "react-sortablejs";
import Message from "./Message";

const PDFGridRender = props => {
    let pageAttr = props.pageData

    const [state, setState] = useState(pageAttr);
    const [deletes, setDeletes] = useState([])
    const [rotate, setRotate] = useState([])

    useEffect(()=>{
        setState([...state, ...props.pageData])
    },[props.pageData])

    useEffect(()=>{
        setState(deletes)
    },[deletes])

    useEffect(()=>{
        setState(rotate)
    },[rotate])



    const saveDeg = (state, doc) =>{
        console.log(state)

        let stateArr = state;

        let objIndex = stateArr.findIndex((obj => obj.key === doc.key));
        if (stateArr[objIndex].rotateDeg === 270) {
            stateArr[objIndex].rotateDeg = 0
        }
        else {
            stateArr[objIndex].rotateDeg += 90
        }
        setRotate(stateArr)
    }


    const deletePage = (state, key) => {
        //remove from state
        let stateArr =[]
        stateArr = state.filter(function (obj) {
            return obj.key !== key
        })
        setDeletes(stateArr)

    }

    const mergeData = () =>{

    }

    const reRender =() => {

    }

    return (
        <div className={"col"}>
            <ReactSortable list={state} setList={setState} animation={200} >
                {state.map(doc => (
                    <div className={"grid-square border-1px-solid"}>
                    <div
                        key={doc.fingerprint + "-" + doc.pageNum}
                        style={{transform:"rotate("+ doc.rotateDeg +"deg)"}}
                        className={"d-flex"}
                    >
                        <canvas className={"mr-0-auto"} id={`canvas-${doc.fingerprint}-${doc.pageNum}`}>.</canvas>

                    </div>
                        <br/>
                        <Message msg={doc.fileName + " -page " + doc.pageNum}/>
                        <button onClick={()=>deletePage(state,doc.key)} >delete</button>
                        <button onClick={()=>saveDeg(state,doc)} >rotate</button>
                    </div>

                ))}
            </ReactSortable>
        </div>
    );
};

export default PDFGridRender