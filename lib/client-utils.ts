/**
 * Client-side utility functions to handle SSR issues
 */

export const isClient = typeof window !== 'undefined'

export const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined'

export const getWindowOrigin = () => {
  if (typeof window !== 'undefined') {
    return window.location.origin
  }
  return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
}

export const safeWindowPrint = () => {
  if (typeof window !== 'undefined') {
    window.print()
  }
}

export const safeRequestNotification = async () => {
  if (typeof window !== 'undefined' && 'Notification' in window) {
    try {
      const permission = await Notification.requestPermission()
      return permission === 'granted'
    } catch (error) {
      console.error('Notification permission denied:', error)
      return false
    }
  }
  return false
}

export const safeCreateNotification = (title: string, options?: NotificationOptions) => {
  if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
    try {
      return new Notification(title, options)
    } catch (error) {
      console.error('Error creating notification:', error)
    }
  }
  return null
}

export const safeWindowFocus = () => {
  if (typeof window !== 'undefined') {
    window.focus()
  }
}