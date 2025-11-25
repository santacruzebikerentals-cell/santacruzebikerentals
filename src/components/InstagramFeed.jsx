import React, { useEffect, useRef } from 'react';

export default function InstagramFeed() {
  const wrapperRef = useRef(null);

  useEffect(() => {
    // Inject Elfsight script once on mount
    const script = document.createElement('script');
    script.src = "https://static.elfsight.com/platform/platform.js";
    script.async = true;
    script.defer = true;

    script.onload = () => {
      // Force Elfsight to initialize after script loads
      if (window.eapps && window.eapps.initialize) {
        window.eapps.initialize();
      }
    };

    // Append only if not already on page
    if (!document.querySelector('script[src*="elfsight"]')) {
      document.body.appendChild(script);
    } else {
      // If script already exists, try to initialize
      if (window.eapps && window.eapps.initialize) {
        window.eapps.initialize();
      }
    }

    return () => {
      // Cleanup if needed
    };
  }, []);

  return (
    <div className="w-full py-8">
      <h2 className="text-2xl font-semibold text-center mb-6">Follow Our Adventures</h2>
      <div className="w-full flex justify-center">
        <div
          ref={wrapperRef}
          className="elfsight-app-cde776c1-e6c3-4cf7-a303-d5ea257c4989"
          style={{ width: '100%', maxWidth: '1200px' }}
        ></div>
      </div>
    </div>
  );
}