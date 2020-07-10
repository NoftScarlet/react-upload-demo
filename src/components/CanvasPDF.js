import React, { useEffect, useState} from 'react';

//This component works as a canvas rendering helper by utilizing state changes.
//The c
const CanvasPDF = props => {

    let img = props.imageData;
    const [imageData, setImageData] = useState(img)

    const reRender =(imageData,id) => {
        let canvas=document.getElementById(id)
        canvas.height = 220;
        canvas.width = 160;
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