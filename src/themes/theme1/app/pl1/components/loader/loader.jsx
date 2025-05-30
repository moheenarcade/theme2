import React from 'react';
import './loader.css'

const Laoder = () => {
    return (
        <div className='laoder h-100vh fixed top-0 bottom-0 left-0 right-0 z-[99999] w-full h-full flex justify-center items-center bg-[#000000ed]'>
            <div className="lds-default" bis_skin_checked="1"><div bis_skin_checked="1"></div><div bis_skin_checked="1"></div><div bis_skin_checked="1"></div><div bis_skin_checked="1"></div><div bis_skin_checked="1"></div><div bis_skin_checked="1"></div><div bis_skin_checked="1"></div><div bis_skin_checked="1"></div><div bis_skin_checked="1"></div><div bis_skin_checked="1"></div><div bis_skin_checked="1"></div><div bis_skin_checked="1"></div></div>
        </div>
    )
}

export default Laoder;
