'use client';
import Link from 'next/link';
import React, { Suspense } from 'react';
import SuccessContent from '../../../themes/theme1/app/pl1/components/SuccessContent/index';

const Success = () => {

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SuccessContent />
        </Suspense>
    )
}

export default Success;
