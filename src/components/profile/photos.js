//no need to explain anything

import React from 'react';
import PropTypes from 'prop-types';
import Skeleton from 'react-loading-skeleton';
import Header from '../post/Header';
import { useEffect } from 'react';
import { deletePost } from '../../services/firebasePosts';

export default function Photos({
    photos,
    onDeletePost,
    loadingIndex,
    isCurrentUser,
}) {
    return (
        <div className='h-16 border-t border-gray-primary mt-12 pt-4 '>
            <div className='grid grid-cols-2 gap-16 mt-4 mb-12 md:grid-cols-1 md:gap-10 p-5 bg-gray-background'>
                {!photos ? (
                    <>
                        <Skeleton count={12} width={320} height={400} />
                    </>
                ) : photos.length > 0 ? (
                    photos.map((photo, i) => (
                        <div key={photo.docId} className='relative group '>
                            {loadingIndex == i ? (
                                <Skeleton style={{ height: '100%' }} />
                            ) : (
                                <>
                                    <img
                                        src={photo.imageSrc}
                                        alt={photo.caption}
                                        className='rounded-3xl w-[500px] h-[400px] object-cover'
                                    />
                                    <div
                                        className='absolute bottom-0 left-0 bg-gray-200 z-10 w-full justify-evenly
                            items-center h-full  group-hover:flex hidden rounded-3xl'
                                    >
                                        <p className='flex items-center text-white font-bold'>
                                            <svg
                                                xmlns='http://www.w3.org/2000/svg'
                                                viewBox='0 0 20 20'
                                                fill='currentColor'
                                                className='w-8 mr-4'
                                            >
                                                <path
                                                    fillRule='evenodd'
                                                    d='M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z'
                                                    clipRule='evenodd'
                                                />
                                            </svg>
                                            {photo.likes.length}
                                        </p>

                                        <p className='flex items-center text-white font-bold'>
                                            <svg
                                                xmlns='http://www.w3.org/2000/svg'
                                                viewBox='0 0 20 20'
                                                fill='currentColor'
                                                className='w-8 mr-4'
                                            >
                                                <path
                                                    fillRule='evenodd'
                                                    d='M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z'
                                                    clipRule='evenodd'
                                                />
                                            </svg>
                                            {photo.comments.length}
                                        </p>

                                        {isCurrentUser && (
                                            <p
                                                className='flex items-center text-white font-bold cursor-pointer'
                                                onClick={() =>
                                                    onDeletePost(photo.docId, i)
                                                }
                                            >
                                                <svg
                                                    xmlns='http://www.w3.org/2000/svg'
                                                    fill='currentColor'
                                                    height='40'
                                                    width='40'
                                                >
                                                    <path d='M11.792 34.167q-1.084 0-1.854-.771-.771-.771-.771-1.854V9.375H7.5V7.292h7.25v-1.25h10.5v1.25h7.25v2.083h-1.667v22.167q0 1.083-.771 1.854-.77.771-1.854.771Zm4.041-5.542h2.084V12.833h-2.084Zm6.25 0h2.084V12.833h-2.084Z' />
                                                </svg>
                                            </p>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    ))
                ) : null}
            </div>
            {!photos ||
                (photos.length === 0 && (
                    <p className='text-center text-2xl'>No Posts Yet</p>
                ))}
        </div>
    );
}

Photos.propTypes = {
    photos: PropTypes.array,
};
