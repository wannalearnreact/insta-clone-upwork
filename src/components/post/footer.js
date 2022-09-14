//no need to explain anything here, everything seems understandable
import React from 'react';
import PropTypes from 'prop-types';

export default function Footer({ caption, username }) {
    return (
        <div className='p-4 pt-2 pb-8 '>
            <span className='mr-1 font-bold capitalize'>{username}</span>
            <span>{caption}</span>
        </div>
    );
}

Footer.propTypes = {
    caption: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
};
