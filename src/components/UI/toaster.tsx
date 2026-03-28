import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "../UI/toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props} className="bg-gray-800 text-white p-4 rounded-lg shadow-lg">
            <div className="grid gap-2">
              {title && <ToastTitle className="text-lg font-bold">{title}</ToastTitle>}
              {description && (
                <ToastDescription className="text-sm">{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose className="text-red-500 hover:text-red-700" />
          </Toast>
        )
      })}
      <ToastViewport className="fixed bottom-0 right-0 m-4" />
    </ToastProvider>
  )
}
