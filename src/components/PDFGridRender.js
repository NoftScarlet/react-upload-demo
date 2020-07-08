import React, { useEffect, useState} from 'react';
import {ReactSortable} from "react-sortablejs";
import Message from "./Message";

const PDFGridRender = props => {
    const [state, setState] = useState(props.pageData);

    useEffect(()=>{
        setState(props.pageData)
        console.log(props.pageData)
    },[props.pageData])

    return (
        <div className={"col"}>
            <ReactSortable list={state} setList={setState}>
                {state.map(doc => (

                    <div key={doc.fingerprint + "-" + doc.pageNums} className={"grid-square"}>
                        <canvas id={`canvas-${doc.fingerprint}-${doc.pageNums}`}>.</canvas>
                        <Message msg={doc.name + " -page " + doc.pageNum}/>
                    </div>

                ))}
            </ReactSortable>
        </div>
    );
};

export default PDFGridRender