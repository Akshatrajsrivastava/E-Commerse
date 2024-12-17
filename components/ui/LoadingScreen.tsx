import React from 'react';
import logo from '@/app/logot.png';
import Image from 'next/image';

const LoadingScreen = () => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-100">
            <div className="relative">
                {/* Logo with pulse animation */}
                <Image
                    src={logo}
                    alt="Pixorus logo"
                    width={220}
                    height={100}
                    className="mr-2 animate-pulse"
                />
                {/* Optional loading text */}
                {/* <p className="text-center mt-4 text-gray-600 animate-bounce">
                    Loading...
                </p> */}
            </div>
        </div>
    );
};

export default LoadingScreen;