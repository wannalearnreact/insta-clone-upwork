import React from 'react';
import Avatar, { AvatarVariants } from '../../avatar';
import { BeatLoader } from 'react-spinners';
import { BiArrowBack } from 'react-icons/bi';
import useUser from '../../../hooks/use-user';
import profilePlaceholder from '../../../resources/profile-placeholder.svg';
export default function Overview({
    post,
    onCaptionChange,
    onDiscard,
    onSubmit,
    loading,
}) {
    const { user } = useUser();
    return (
        <div className=' grid justify-start '>
            <header className='flex flex-row justify-between p-4'>
                <span onClick={() => onDiscard()}>
                    <BiArrowBack size={30} className='cursor-pointer' />
                </span>

                <div>Image Overview</div>
                <button
                    className='text-blue-medium font-bold'
                    onClick={(e) => onSubmit(e)}
                >
                    {loading ? <BeatLoader /> : 'Post'}
                </button>
            </header>
            <img
                src={URL.createObjectURL(post.image)}
                alt='Overview'
                className='w-full object-cover h-[400px]'
            />
            <div className='flex flex-row m-5 justify-center items-center p-2'>
                {/*    <Avatar variant={AvatarVariants.large} src={user.imageSrc} /> */}

                <img
                    src={user.imageSrc ? user.imageSrc : profilePlaceholder}
                    alt=''
                    className='rounded-full md:w-[150px] md:h-[100px] w-[200px] h-[100px]'
                />

                <textarea
                    className='md:w-[200px] md:h-[100px] w-[200px] h-[100px] border-4 border-black p-2'
                    placeholder="What's on Your Mind?"
                    value={post.caption}
                    onChange={(e) => onCaptionChange(e.target.value)}
                />
            </div>
        </div>
    );
}
