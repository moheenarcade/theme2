    'use client';
    import Link from 'next/link';
    import React, { Suspense } from 'react';
    import SuccessContent from '../components/SuccessContent';

    const Success = () => {

        return (
            <Suspense fallback={<div>Loading...</div>}>
                <SuccessContent />
            </Suspense>
        )
    }

    export default Success;
