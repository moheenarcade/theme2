"use client";
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getPageBySlug } from '../../../../lib/api';
import { useLanguage } from "../../../../context/LanguageContext";
import Loader from "../../components/loader";
import Link from 'next/link';
import { TbArrowBackUp } from "react-icons/tb";


const DynamicPage = ({ slug }) => {
  // const { slug } = useParams();
  const fallbackSlug = useParams()?.slug;
  const finalSlug = slug || fallbackSlug;
  const { language } = useLanguage();
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getPageBySlug(slug);
        if (response.success) {
          setPageData(response.data);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  if (loading) return <Loader />;
  if (!pageData) return <div className='text-center py-2 themeone-dynmaic-page-about-us'>Network Error</div>;

  return (
    <div className="container mx-auto px-6 lg:px-20 xl:px-62 py-20 relative">
      {/* <Link href="/" className=''>
      <TbArrowBackUp className='text-5xl'/>
      </Link> */}
      <h1 className='text-3xl md:text-4xl text-center pb-6 md:pb-12'>{language === "ar" ? pageData.title_ar : pageData.title}</h1>

      <div
        className={`prose max-w-none ${language === 'ar' ? 'text-right' : ''}`}
        dangerouslySetInnerHTML={{
          __html: language === 'ar' && pageData.details_ar
            ? pageData.details_ar
            : pageData.details
        }}
      />
    </div>
  );
};

export default DynamicPage;