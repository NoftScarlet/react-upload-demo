import React, { Component } from 'react'


class DragDropArea extends Component {
    constructor(props) {
        super(props);
        this.state = { drag: true };
        this.dropRef = React.createRef();
    }

    handleDrag = (e) => {
        e.preventDefault()
        e.stopPropagation()
    }

    handleDragIn = (e) => {
        e.preventDefault()
        e.stopPropagation()
        this.dragCounter++
        if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
            this.setState({drag: true})
        }
    }

    handleDrop = (e) => {
        e.preventDefault()
        e.stopPropagation()
        this.setState({drag: false})
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            this.props.handleDrop(e.dataTransfer.files)
            e.dataTransfer.clearData()
            this.dragCounter = 0
        }
    }

    componentDidMount() {
        let div = this.dropRef.current;
        div.addEventListener('dragenter', this.handleDragIn);
        div.addEventListener('dragover', this.handleDrag);
        div.addEventListener('drop', this.handleDrop);
    }

    componentWillUnmount() {
        let div = this.dropRef.current
        div.removeEventListener('dragenter', this.handleDragIn)
        div.removeEventListener('dragover', this.handleDrag)
        div.removeEventListener('drop', this.handleDrop)
    }

    render() {
        return (
            <div
                style={{display: 'inline-block', position: 'relative'}}
                ref={this.dropRef}
            >

                {this.state.drag &&
                <div
                    style={{
                        border: 'dashed grey 4px',
                        backgroundColor: 'rgba(255,255,255,.8)',
                        position: 'absolute',
                        top: 0,
                        bottom: 0,
                        left: 0,
                        right: 0,
                        zIndex: 9999
                    }}
                >
                    <div
                        style={{
                            position: 'absolute',
                            top: '50%',
                            right: 0,
                            left: 0,
                            textAlign: 'center',
                            color: 'grey',
                            fontSize: 36
                        }}
                    >
                        <div>drop here :)</div>

                    </div>
                </div>
                }
                {this.props.children}
            </div>
        )
    }
}
export default DragDropArea