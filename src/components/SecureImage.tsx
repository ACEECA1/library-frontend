import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
interface SecureImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  fallbackSrc?: string;
}
export const SecureImage: React.FC<SecureImageProps> = ({ src, fallbackSrc, ...props }) => {
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const [error, setError] = useState(false);
  useEffect(() => {
    let currentUrl: string | null = null;
    let isMounted = true;
    if (!src) {
      setError(true);
      return;
    }
    if (src.startsWith('data:') || src.startsWith('blob:')) {
      setObjectUrl(src);
      return;
    }
    const fetchImage = async () => {
      try {
        const response = await api.get(src, { responseType: 'blob' });
        const blob = new Blob([response.data], { type: response.headers['content-type'] as string });
        currentUrl = URL.createObjectURL(blob);
        if (isMounted) {
          setObjectUrl(currentUrl);
          setError(false);
        }
      } catch (err) {
        console.error('Failed to fetch secure image:', err);
        if (isMounted) {
          setError(true);
        }
      }
    };
    fetchImage();
    return () => {
      isMounted = false;
      if (currentUrl) {
        URL.revokeObjectURL(currentUrl);
      }
    };
  }, [src]);
  if (error && fallbackSrc) {
    return <img src={fallbackSrc} {...props} />;
  }
  if (!objectUrl) {
    return <div className="animate-pulse bg-gray-200 dark:bg-gray-800" style={{ width: props.width || '100%', height: props.height || '100%' }} />;
  }
  return <img src={objectUrl} {...props} />;
};
