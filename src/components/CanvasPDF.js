import React, { useEffect, useState} from 'react';

const CanvasPDF = props => {

    let img = props.imageData;
    const [imageData, setImageData] = useState(img)

    const reRender =(imageData,id) => {
        let canvas=document.getElementById(id)
        let ctx = canvas.getContext('2d')
        ctx.putImageData(imageData,0,0)
    }

    useEffect(()=>{
        reRender(props.imageData,props.id)
    },[props.state])

    return (
        <>
        </>
    )

}

export default CanvasPDF