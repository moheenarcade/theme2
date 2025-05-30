'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const NotFound = () => {
    useEffect(() => {
        console.log('404 page loaded');
    }, []);

    return (
        <div className="min-h-[50vh] pb-20 flex flex-col items-center justify-center text-center px-4">
            <div className="h-[400px]">
                <DotLottieReact
                    src="https://lottie.host/98f77368-2b17-4e42-a5c8-de1c717acf6d/RKVtihMG3W.lottie"
                    loop
                    autoplay
                />
            </div>
            <Link href="/" className="w-fit cursor-pointer hover:scale-[1.05] transition-all duration-[0.3s] ease-in-out py-2 text-md px-4 rounded-lg bg-[#222222] text-white font-[500] -mt-20">
                Go back home
            </Link>
        </div>
    );
}

export default NotFound;