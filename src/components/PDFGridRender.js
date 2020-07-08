import React, { useEffect, useState} from 'react';
import {ReactSortable} from "react-sortablejs";
import Message from "./Message";

const PDFGridRender = props => {
    let pageAttr = props.pageData
    const [state, setState] = useState(pageAttr);

   useEffect(()=>{
        setState(props.pageData)
        console.log(props.pageData)
    },[props.pageData])

    return (
        <div className={"col"}>
            <ReactSortable list={state} setList={setState}>
                {state.map(doc => (
                    <div key={doc.fingerprint + "-" + doc.pageNum} className={"grid-square"}>
                        <canvas id={`canvas-${doc.fingerprint}-${doc.pageNum}`}>.</canvas>
                        <Message msg={doc.fileName + " -page " + doc.pageNum}/>
                    </div>

                ))}
            </ReactSortable>
        </div>
    );
};

export default PDFGridRender