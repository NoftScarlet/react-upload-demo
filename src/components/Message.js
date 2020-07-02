import React from 'react';
import PropTypes from 'prop-types';

const Message = ( props ) => {
    return (
        <>
            {
                props.msg.map(text=>(
                    <div>{text}</div>
                ))
            }
        </>
    );
};

Message.propTypes = {
    msg: PropTypes.array.isRequired
};

export default Message;