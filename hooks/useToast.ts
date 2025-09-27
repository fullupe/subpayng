import { toast } from 'react-toastify'

export const useToast = () => {
  const showToast = {
    success: (message: string) => toast.success(message),
    error: (message: string) => toast.error(message),
    warning: (message: string) => toast.warning(message),
    info: (message: string) => toast.info(message),
    default: (message: string) => toast(message),
  }

  return showToast
}