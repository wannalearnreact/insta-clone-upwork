//no need to explain anything here, everything seems understandable

import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import Header from './header';
import Image from './image';
import Actions from './actions';
import Footer from './footer';
import Comments from './comments';

export default function Post({ content }) {
    const commentInput = useRef(null);

    const handleFocus = () => commentInput.current.focus();
    // components
    // -> header, image, actions (like & comment icons), footer, comments

    return (
        <div className='rounded col-span-4 border bg-white border-gray-primary mb-12 '>
            <Header username={content.username} />
            <Image src={content.imageSrc} caption={content.caption} />
            <Actions
                totalLikes={content.likes.length}
                likedPhoto={content.userLikedPhoto}
                docId={content.docId}
                handleFocus={handleFocus}
            />
            <Footer caption={content.caption} username={content.username} />
            <Comments
                docId={content.docId}
                comments={content.comments}
                posted={content.dateCreated}
                commentInput={commentInput}
            />
        </div>
    );
}

Post.propTypes = {
    // proptypes is like an interface in typescript where you know what you're expecting
    content: PropTypes.shape({
        // we know is gonna be an object so .shape
        username: PropTypes.string.isRequired,
        imageSrc: PropTypes.string.isRequired,
        caption: PropTypes.string.isRequired,
        docId: PropTypes.string.isRequired,
        userLikedPhoto: PropTypes.bool.isRequired,
        likes: PropTypes.array.isRequired,
        comments: PropTypes.array.isRequired,
        dateCreated: PropTypes.number.isRequired,
    }),
};
