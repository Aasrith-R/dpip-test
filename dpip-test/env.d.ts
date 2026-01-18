/// <reference types="vite/client" />

export {}

declare global {
  interface DocumentPictureInPictureOptions {
    width?: number
    height?: number
  }

  interface DocumentPictureInPicture {
    requestWindow(options?: DocumentPictureInPictureOptions): Promise<Window>
  }

  interface Window {
    documentPictureInPicture?: DocumentPictureInPicture
  }
}
