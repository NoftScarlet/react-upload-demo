import React from 'react';
import PropTypes from 'prop-types';

const Message = (props) => {
    return (
        <>
            {
                <div>{props.msg}</div>
            }
        </>
    );
};

Message.propTypes = {
    msg: PropTypes.array.isRequired
};

export default Message;