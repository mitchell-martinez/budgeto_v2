import { useEffect, useState } from 'react';

import styles from './styles.module.scss';

const OfflineBanner = () => {
  const [isOffline, setIsOffline] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const handleOffline = () => {
      setIsOffline(true);
      setDismissed(false);
    };
    const handleOnline = () => setIsOffline(false);

    // Check initial state
    if (!navigator.onLine) {
      setIsOffline(true);
    }

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);
    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  if (!isOffline || dismissed) {
    return null;
  }

  return (
    <div className={styles.banner} role='status' aria-live='polite'>
      <span className={styles.message}>
        You&apos;re offline — changes will sync when you reconnect.
      </span>
      <button
        type='button'
        className={styles.dismiss}
        onClick={() => setDismissed(true)}
        aria-label='Dismiss offline notification'
      >
        ✕
      </button>
    </div>
  );
};

export default OfflineBanner;
