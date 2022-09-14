// no need to explain anything

import React, { useEffect } from 'react';
import Timeline from '../components/Timeline';
import Sidebar from '../components/sidebar';
import Header from '../components/Header';
import useUser from '../hooks/use-user';
import _ from 'lodash';

export default function Dashboard() {
  const { user } = useUser();

    useEffect(() => {
        document.title = 'Social media';
    }, []);

    return (
        <div className='bg-gray-background font-Roboto '>
            <Header />

        {!_.isEmpty(user) && (
          <div className='grid grid-cols-3 gap-4  mx-auto  max-w-screen-lg md:grid-cols-1'>
            <Timeline />
            <Sidebar />
          </div>
        )}
        </div>
    );
}
