// no need to explain anything

import React, { useEffect } from 'react';
import Timeline from '../components/Timeline';
import Sidebar from '../components/sidebar';
import Header from '../components/Header';

export default function Dashboard() {
    useEffect(() => {
        document.title = 'Social media';
    }, []);

    return (
        <div className='bg-gray-background font-Roboto '>
            <Header />

            <div className='grid grid-cols-3 gap-4  mx-auto  max-w-screen-lg md:grid-cols-1'>
                <Timeline />
                <Sidebar />
            </div>
        </div>
    );
}
