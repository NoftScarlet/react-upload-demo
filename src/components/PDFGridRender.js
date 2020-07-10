import React, {useEffect, useState} from 'react';
import {ReactSortable} from "react-sortablejs";
import Message from "./Message";
import CanvasPDF from "./CanvasPDF";
import {getOptions} from "../static/utility"

const PDFGridRender = props => {

    let pageAttr = props.pageData
    const [state, setState] = useState(pageAttr);// -> Master state
    const [deletes, setDeletes] = useState([])
    const [rotate, setRotate] = useState([])

    useEffect(() => {
        //use spread operator to append new incoming page data into master state
        setState([...state, ...props.pageData])

    }, [props.pageData])

    useEffect(() => {
        setState(deletes)
    }, [deletes])

    useEffect(() => {
        setState(rotate)
    }, [rotate])

    useEffect(() => {
        addImageDataToState(state, props.imageData)
    }, [props.imageData])

    const addImageDataToState = (state, imageData) => {
        let stateArr = state;
        let objIndex = stateArr.findIndex((obj => obj.key === imageData.key));
        if (stateArr[objIndex] !== undefined && !("imageData" in stateArr[objIndex])) {
            stateArr[objIndex]["imageData"] = imageData.imgData
            setState(stateArr)
        }
    }

    const rotatePage = (state, doc) => {
        let stateArr = state;
        let objIndex = stateArr.findIndex((obj => obj.key === doc.key));
        if (stateArr[objIndex].rotateDeg === 270) {
            stateArr[objIndex].rotateDeg = 0
        } else {
            stateArr[objIndex].rotateDeg += 90
        }
        setRotate(stateArr)
    }

    const deletePage = (state, key) => {
        //remove from state
        let stateArr = []
        stateArr = state.filter(function (obj) {
            return obj.key !== key
        })
        setDeletes(stateArr)
    }

    const mergeData = (state) => {
        return getOptions(state)
    }

    const reRender = (imageData, id) => {
        let canvas = document.getElementById(id)
        let ctx = canvas.getContext('2d')
        ctx.putImageData(imageData, 0, 0)
    }

    return (
        <div>
            <button className={"btn-console btn btn-lg btn-secondary"} onClick={() => console.log(mergeData(state))}>Upload (console)</button>

                <ReactSortable list={state} setList={setState} animation={250}>
                    {state.map(doc => (
                        <div className={"grid-square border-1px-solid reveal"} key={doc.fingerprint + "-" + doc.pageNum +"grid-key"}>


                            <div
                                key={doc.fingerprint + "-" + doc.pageNum}

                                className={"d-flex"}
                            >
                                <canvas className={"mr-0-auto"} id={`canvas-${doc.fingerprint}-${doc.pageNum}`} style={{transform: "rotate(" + doc.rotateDeg + "deg)"}}>.
                                </canvas>
                                {(doc.imageData === undefined) ? null : reRender(doc.imageData, `canvas-${doc.fingerprint}-${doc.pageNum}`)}
                                {(doc.imageData === undefined) ? null :
                                    <CanvasPDF state={state} imageData={doc.imageData}
                                               id={`canvas-${doc.fingerprint}-${doc.pageNum}`}/>}
                            </div>
                            <Message msg={doc.fileName + " - page " + doc.pageNum}/>
                            <br/>
                            <button className="w-50 btn btn-danger rounded-0 " onClick={() => deletePage(state, doc.key)}>Delete</button>
                            <button className="w-50 btn btn-info rounded-0 " onClick={() => rotatePage(state, doc)}>Rotate Clockwise</button>


                        </div>
                    ))}
                </ReactSortable>

        </div>
    );
};

export default PDFGridRender