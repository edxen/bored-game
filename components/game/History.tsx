import React from 'react';
import Image from 'next/image';
import GetData from '../hooks/GetData';

const History = () => {
    const { history } = GetData();

    return (
        <div className="flex flex-col max-h-[150px] h-full border rounded-lg overflow-y-hidden p-4">
            <div className="flex items-center gap-1">
                <Image src='/images/icons/icon-arrow-left.png' alt="arrow left" width="12" height="12" className='opacity-50' />
                <span className="font-medium text-sm">History</span>
            </div>
            <ul className="flex flex-col list-inside list-disc overflow-y-scroll">
                {
                    history.map((item, i) => (
                        <li key={i} className='text-sm'>
                            {item}
                        </li>
                    ))
                }
            </ul>
        </div>
    );

};

export default History;