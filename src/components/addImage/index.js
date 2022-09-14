import React from 'react';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import UserContext from '../../context/user';
import { createPost } from '../../services/firebasePosts';
import Overview from './overview/Overview';

import Uploader from './uploader';

export default function AddImage() {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    // created post consists of image and caption to we initialize the component with an empty values for thoose two
    const [post, setPost] = React.useState({
        image: undefined,
        caption: '',
    });

    const [loading, setLoading] = React.useState(false);

    async function onSubmit() {
        setLoading(true);
        await createPost(
            {
                userId: user.uid,
                ...post,
            },
            () => navigate('/'),
            (e) => {
                console.log(e);
            }
        );
        setLoading(false);
    }

    /**
     * this component the built using two main subcomponents:
     * 1. uploader: responsable for getting the image from the user.
     * 2. overview: gives the user overview of the post like the photo and the caption
     *    so the user can have a look at post before posting it.
     * - the switching between those two component is done by checking if the user have uploaded a photo or not,
     *   if the user have chosen the photo then w redirect him to the next component to see the overview.
     */
    return (
        <div className=' w-[300px]  my-0 mx-auto border-2 border-gray-base'>
            <div>
                {post.image ? (
                    <Overview
                        post={post}
                        loading={loading}
                        onCaptionChange={(caption) =>
                            setPost({ ...post, caption })
                        }
                        onDiscard={() =>
                            setPost({ image: undefined, caption: '' })
                        }
                        onSubmit={() => onSubmit()}
                    />
                ) : (
                    <Uploader
                        value={post.image}
                        onChange={(image) => setPost({ ...post, image })}
                    />
                )}
            </div>
        </div>
    );
}
