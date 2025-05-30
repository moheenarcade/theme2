'use client'
import Script from 'next/script'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function PixelTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [pixels, setPixels] = useState(null)
  const [tiktokLoaded, setTiktokLoaded] = useState(false)
  const [fbLoaded, setFbLoaded] = useState(false)

  useEffect(() => {
    const pixelData = JSON.parse(localStorage.getItem('pixelData')) || {}
    setPixels(pixelData)
  }, [])

  // Track page views on route change
  useEffect(() => {
    if (!pixels) return
    // Facebook PageView
    if (fbLoaded && pixels.facebook_pixel) {
      window.fbq('track', 'PageView')
    }

    // TikTok PageView - only if loaded
    if (tiktokLoaded && pixels.tiktok_pixel) {
      // Clear previous events by reinitializing the pixel
      window.ttq = window.ttq || []
      window.ttq.push(['unset'])
      window.ttq.push(['init', pixels.tiktok_pixel])
      window.ttq.track('PageView')
    }
  }, [pathname, searchParams, pixels, fbLoaded, tiktokLoaded])

  if (!pixels) return null

  return (
    <>
      {/* Facebook Pixel */}
      {pixels.facebook_pixel && (
        <>
          <Script
            id="fb-pixel"
            strategy="afterInteractive"
            onLoad={() => setFbLoaded(true)}
            dangerouslySetInnerHTML={{
              __html: `
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '${pixels.facebook_pixel}');
              `,
            }}
          />
          <noscript>
            <img
              height="1"
              width="1"
              style={{ display: 'none' }}
              src={`https://www.facebook.com/tr?id=${pixels.facebook_pixel}&ev=PageView&noscript=1`}
            />
          </noscript>
        </>
      )}

      {/* TikTok Pixel */}
      {pixels.tiktok_pixel && (
        <>
          <Script
            id="tiktok-pixel"
            strategy="afterInteractive"
            onLoad={() => setTiktokLoaded(true)}
            dangerouslySetInnerHTML={{
              __html: `
                !function (w, d, t) {
                  w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
                  ttq.load('${pixels.tiktok_pixel}');
                }(window, document, 'ttq');
              `,
            }}
          />
          <noscript>
            <img
              height="1"
              width="1"
              style={{ display: 'none' }}
              src={`https://analytics.tiktok.com/i18n/pixel/${pixels.tiktok_pixel}.png?labels=${encodeURIComponent(JSON.stringify({ event: 'page_view' }))}`}
            />
          </noscript>
        </>
      )}
    </>
  )
}