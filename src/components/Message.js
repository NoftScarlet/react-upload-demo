import React from 'react';
import PropTypes from 'prop-types';

const Message = (props) => {
    return (
        <>
            {
                <div className="position-absolute text-wrap">{props.msg}</div>
            }
        </>
    );
};

Message.propTypes = {
    msg: PropTypes.string.isRequired
};
export default Message;