import toast from 'react-hot-toast';

export const useToast = () => {
  return {
    success: (msg) => toast.success(msg),
    error: (msg) => toast.error(msg),
    info: (msg) => toast(msg, { icon: 'ℹ️' }),
  };
};
