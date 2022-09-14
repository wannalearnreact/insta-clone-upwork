//no need to explain anything
import React from 'react';
import usePhotos from '../hooks/use-photos';
import Skeleton from 'react-loading-skeleton';
import Post from './post';

export default function Timeline() {
    // we need to get the logged in user's photos (hook)
    const { photos } = usePhotos();

    /*  console.log('photos', photos) */
    // on loading the photos, we need to use react skeleton
    // if we have photos, render them (create a post component)
    // if the user has no photos, tell them to create some photos

    return (
        <div className='container col-span-2 md:p-5 '>
            {!photos ? (
                <Skeleton count={4} width={640} height={500} className='mb-5' />
            ) : photos?.length > 0 ? ( // do we have photos and the photos.length are greater than 0? (photos && photos.length > 0)
                photos.map((content) => (
                    <Post key={content.docId} content={content} />
                ))
            ) : (
                <p className='text-center text-2xl'>
                    Connect with people to see photos
                </p>
            )}
        </div>
    );
}
