import { useEffect } from 'react';
import { X, CheckCircle2, AlertCircle } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const Toast = ({ toast }) => {
  const { removeToast } = useToast();

  useEffect(() => {
    const timer = setTimeout(() => {
      removeToast(toast.id);
    }, 3000);
    return () => clearTimeout(timer);
  }, [toast.id, removeToast]);

  return (
    <div className={`toast toast-${toast.type} animate-slide-in`}>
      <div className="toast-icon">
        {toast.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
      </div>
      <div className="toast-message">{toast.message}</div>
      <button className="toast-close" onClick={() => removeToast(toast.id)}>
        <X size={14} />
      </button>
    </div>
  );
};

const ToastContainer = () => {
  const { toasts } = useToast();

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} />
      ))}
    </div>
  );
};

export default ToastContainer;
