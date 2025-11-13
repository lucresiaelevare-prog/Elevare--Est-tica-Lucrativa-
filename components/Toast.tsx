import React, { useEffect } from 'react';
import { Toast as ToastType } from '../types';

const Toast: React.FC<{ toast: ToastType; onClose: () => void }> = ({ toast, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 5000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const baseClasses = "flex items-center w-full max-w-xs p-4 space-x-4 rtl:space-x-reverse divide-x rtl:divide-x-reverse rounded-lg shadow-lg text-white space-x";
    const typeClasses = {
        success: "bg-green-500 divide-gray-700",
        error: "bg-red-500 divide-gray-700",
        info: "bg-blue-500 divide-gray-700",
    };

    return (
        <div className={`${baseClasses} ${typeClasses[toast.type]}`} role="alert">
            <div className="text-sm font-normal">{toast.message}</div>
            <button type="button" onClick={onClose} className="p-1.5 -mx-1.5 -my-1.5 ms-auto rounded-lg hover:bg-white/20 inline-flex items-center justify-center h-8 w-8" aria-label="Close">
                <span className="sr-only">Close</span>
                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                </svg>
            </button>
        </div>
    );
};

export default Toast;
