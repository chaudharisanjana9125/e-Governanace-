import React, { useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

interface Props {
  message: string;
  type: 'success' | 'error' | 'warning';
  onClose: () => void;
}

export default function Notification({ message, type, onClose }: Props) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    success: <CheckCircle size={20} className="text-green-500" />,
    error: <XCircle size={20} className="text-red-500" />,
    warning: <AlertCircle size={20} className="text-amber-500" />,
  };

  return (
    <div className={`notification ${type === 'error' ? 'error' : type === 'warning' ? 'warning' : ''}`}>
      {icons[type]}
      <span style={{ fontSize: '14px', fontWeight: 500, color: '#0f172a', flex: 1 }}>{message}</span>
      <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: '2px' }}>
        <X size={16} />
      </button>
    </div>
  );
}
