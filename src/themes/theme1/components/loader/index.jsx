import React from 'react';
import "./loader.css"

const Loader = () => {

    return (
        <div className='w-full h-[50vh] flex justify-center items-center'>
            <div className="lds-roller" bis_skin_checked="1"><div bis_skin_checked="1"></div>
                <div bis_skin_checked="1"></div><div bis_skin_checked="1"></div><div bis_skin_checked="1"></div>
                <div bis_skin_checked="1"></div><div bis_skin_checked="1"></div><div bis_skin_checked="1"></div>
                <div bis_skin_checked="1">
                </div>
            </div>
        </div>
    )
}

export default Loader;
