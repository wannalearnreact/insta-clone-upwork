import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import FirebaseContext from '../../context/firebase';
import UserContext from '../../context/user';

export default function AddComment({
    docId,
    comments,
    setComments,
    commentInput,
}) {
    const [comment, setComment] = useState('');
    const { firebase, FieldValue } = useContext(FirebaseContext);
    const {
        user: { displayName },
    } = useContext(UserContext); // authentication

    const handleSubmitComment = (event) => {
        event.preventDefault();

        setComments([{ displayName, comment }, ...comments]); // we're passing a new object into the comments array
        // we're saying "put this new comment inside the array and then (...comments) put the rest of the comments
        // give me a new array [] (look at array value in setComments)
        // put the new comment in there
        // add the old comments
        // then we have a new array with the new comment and the older comments
        setComment('');

        // saving into firebase
        return firebase //refactor to V9 and explain
            .firestore()
            .collection('photos')
            .doc(docId) // we need to modify by the docId and then add into the comments array
            .update({
                comments: FieldValue.arrayUnion({ displayName, comment }),
            });
    };

    return (
        <div className='border-t border-gray-primary'>
            <form
                className='flex justify-between pl-0 pr-5'
                method='POST'
                onSubmit={(event) =>
                    comment.length >= 1
                        ? handleSubmitComment(event)
                        : event.preventDefault()
                }
            >
                <input
                    aria-label='Add a comment'
                    autoComplete='off'
                    className='text-sm text-gray-base w-full mr-3 py-5 px-4'
                    type='text'
                    name='add-comment'
                    placeholder='Add a comment'
                    value={comment}
                    onChange={({ target }) => setComment(target.value)} //destructure target and comment is set (setComment new value) to what it's written inside the input
                    ref={commentInput}
                />
                <button
                    className={`text-sm font-bold text-blue-medium ${
                        !comment && 'opacity-25'
                    }`}
                    type='button'
                    disabled={comment.length < 1}
                    onClick={handleSubmitComment}
                >
                    Post
                </button>
            </form>
        </div>
    );
}

AddComment.propTypes = {
    docId: PropTypes.string.isRequired,
    comments: PropTypes.array.isRequired,
    setComments: PropTypes.func.isRequired,
    commentInput: PropTypes.object,
};
