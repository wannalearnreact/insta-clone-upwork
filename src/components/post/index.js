//no need to explain anything here, everything seems understandable

import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import Header from './Header';
import Image from './Image';
import Actions from './Actions';
import Footer from './Footer';
import Comments from './Comments';
import { getDownloadURL, ref } from 'firebase/storage';
import { fireStorage } from '../../firebase_settings/firebase';
import { useEffect } from 'react';
export default function Post({ content }) {
    const commentInput = useRef(null);

    // detecting which post the user is commenting on.
    const handleFocus = () => commentInput.current.focus();
    return (
        <div className=' rounded flex border bg-white border-gray-primary mb-12 md:grid-cols-1  md:flex rounded-r-xl rounded-l-xl'>
            <div className='w-2/3 md:w-full '>
                <Header
                    username={content.username}
                    imageSrc={content.userImageSrc}
                />
                <Image src={content.imageSrc} caption={content.caption} />
            </div>
            <div className='w-1/3 grid content-between sm:w-full '>
                <Footer caption={content.caption} username={content.username} />
                <Actions
                    totalLikes={content.likes.length}
                    likedPhoto={content.userLikedPhoto}
                    docId={content.docId}
                    handleFocus={handleFocus}
                />
                <Comments
                    docId={content.docId}
                    comments={content.comments}
                    posted={content.dateCreated}
                    commentInput={commentInput}
                />
            </div>
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
