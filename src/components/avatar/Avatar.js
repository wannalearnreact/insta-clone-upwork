import React from 'react';
import profilePlaceholder from '../../resources/profile-placeholder.svg';

import { BeatLoader } from 'react-spinners';

/**
 * circular avatar image with multiple size varients.
 */

export default function Avatar({ src, variant, loading, ...rest }) {
    return (
        <div>
            {loading ? (
                <BeatLoader />
            ) : (
                <img
                    src={src ?? profilePlaceholder}
                    alt="User's Profile"
                    {...rest}
                />
            )}
        </div>
    );
}
