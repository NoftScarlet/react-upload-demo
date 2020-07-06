import React, { useEffect, useState} from 'react';
import {ReactSortable} from "react-sortablejs";

const PDFGridRender = props => {
    const [state, setState] = useState([]);
    useEffect(()=>{
        setState(props.pageData)
    },[props.pageData])
    return (
        <div className={"col"}>
            <ReactSortable list={state} setList={setState}>
                {state.map(doc => (
                    <div key={doc.fingerprint + "-" + doc.pageNums} className={"grid-square"}>
                        <canvas id={`canvas-${doc.fingerprint}-${doc.pageNums}`}>.</canvas>
                    </div>
                ))}
            </ReactSortable>
        </div>
    );
};

export default PDFGridRender