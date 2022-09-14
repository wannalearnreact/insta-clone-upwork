//no need to explain anything
import React, { useEffect } from 'react';
import { FcImageFile } from 'react-icons/fc';
export default function Uploader({ onChange, ...rest }) {
    const acceptableFileExts = ['png', 'jpeg', 'jpg'];
    useEffect(() => {
        // function to prevent the image from opening in new tab
        // when the user drags the image into the scren.
        const preventNewTab = (e) => e.preventDefault();

        // asign the function to the event listener onMount.
        window.addEventListener('dragover', preventNewTab, true);
        window.addEventListener('drop', preventNewTab, true);

        // disbale the listeners when the component unmount
        return () => {
            window.removeEventListener('dragover', preventNewTab, true);
            window.removeEventListener('drop', preventNewTab, true);
        };
    }, []);

    function onDrop(ev) {
        ev.preventDefault();
        const dt = ev.dataTransfer;
        const files = dt.files;

        if (files[0]?.name) {
            const fileName = files[0].name;
            const extension = fileName.substring(
                fileName.lastIndexOf('.') + 1,
                fileName.length
            );
            if (!acceptableFileExts.includes(extension)) return;
        }

        onChange(files[0]);
    }

    return (
        <div className='w-[300px] border-2 border-gray-base'>
            <label htmlFor='uploadedImage' />

            <div className='text-center grid grid-cols justify-center '>
                <FcImageFile size={350} onDrop={onDrop} />
                <div>
                    {' '}
                    <header className='text-center '>Drag Photo Here.</header>
                    <input
                        className='ml-10 mt-2 mb-4'
                        type='file'
                        id='uploadedImage'
                        name='uploadedImage'
                        alt='Image'
                        accept='image/png, image/jpeg'
                        onChange={(e) => onChange(e.target.files[0])}
                        {...rest}
                    />
                </div>
            </div>
        </div>
    );
}
