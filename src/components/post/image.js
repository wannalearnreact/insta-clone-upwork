//no need to explain anything here, everything seems understandable

import React from 'react';
import PropTypes from 'prop-types';

export default function Image({ src, caption }) {
    return (
        <img
            className='w-[500px] h-[450px] object-cover rounded-l-xl'
            src={src}
            alt={caption}
        />
    );
}

Image.propTypes = {
    src: PropTypes.string.isRequired,
    caption: PropTypes.string.isRequired,
};
