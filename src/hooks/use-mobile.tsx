import { useState, useEffect } from 'react';

// Mobile breakpoint hook
export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };

    // Check on mount
    checkIsMobile();

    // Listen for resize events
    window.addEventListener('resize', checkIsMobile);

    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  return isMobile;
};

// Touch-friendly button hook
export const useTouchButton = () => {
  const [isPressed, setIsPressed] = useState(false);

  const touchStart = () => setIsPressed(true);
  const touchEnd = () => setIsPressed(false);
  const touchCancel = () => setIsPressed(false);

  return {
    isPressed,
    bind: {
      onTouchStart: touchStart,
      onTouchEnd: touchEnd,
      onTouchCancel: touchCancel,
      onMouseDown: touchStart,
      onMouseUp: touchEnd,
      onMouseLeave: touchCancel,
    },
  };
};

// Mobile-friendly pagination hook
export const useMobilePagination = (totalItems: number, initialPageSize = 5) => {
  const isMobile = useIsMobile();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const nextPage = () => goToPage(currentPage + 1);
  const prevPage = () => goToPage(currentPage - 1);

  const firstPage = () => goToPage(1);
  const lastPage = () => goToPage(totalPages);

  // Auto-adjust page size on mobile
  useEffect(() => {
    if (isMobile && pageSize > 3) {
      setPageSize(3);
    } else if (!isMobile && pageSize === 3) {
      setPageSize(initialPageSize);
    }
  }, [isMobile, pageSize, initialPageSize]);

  return {
    currentPage,
    pageSize,
    totalPages,
    startIndex,
    endIndex,
    totalItems,
    setPageSize,
    goToPage,
    nextPage,
    prevPage,
    firstPage,
    lastPage,
    isMobile,
  };
};

// Mobile swipe detection hook
export const useSwipeGestures = (onSwipeLeft?: () => void, onSwipeRight?: () => void) => {
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && onSwipeLeft) {
      onSwipeLeft();
    }
    if (isRightSwipe && onSwipeRight) {
      onSwipeRight();
    }
  };

  return {
    bind: {
      onTouchStart,
      onTouchMove,
      onTouchEnd,
    },
  };
};

// Mobile-specific form validation
export const useMobileForm = () => {
  const isMobile = useIsMobile();
  
  const getMobileOptimizedRules = () => ({
    email: {
      required: 'Email is required',
      pattern: {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: 'Please enter a valid email address'
      }
    },
    phone: {
      pattern: {
        value: /^[\+]?[1-9][\d]{0,15}$/,
        message: 'Please enter a valid phone number'
      }
    },
    password: {
      required: 'Password is required',
      minLength: {
        value: 6,
        message: 'Password must be at least 6 characters'
      }
    }
  });

  return {
    isMobile,
    mobileOptimizedRules: getMobileOptimizedRules(),
    // Mobile-friendly error display
    formatErrorMessage: (error: string) => {
      if (isMobile) {
        // Shorter error messages for mobile
        return error.replace('is required', 'required')
                   .replace('must be at least', 'min')
                   .replace('characters', 'chars');
      }
      return error;
    }
  };
};

// Mobile notification preferences
export const useMobileNotifications = () => {
  const isMobile = useIsMobile();
  
  const getNotificationConfig = () => ({
    position: isMobile ? 'top-center' : 'bottom-right',
    duration: isMobile ? 2000 : 5000, // Shorter duration on mobile
    showProgressBar: !isMobile, // Hide progress bar on mobile for cleaner look
    closeButton: !isMobile, // Allow auto-hide on mobile
  });

  return {
    isMobile,
    notificationConfig: getNotificationConfig(),
  };
};