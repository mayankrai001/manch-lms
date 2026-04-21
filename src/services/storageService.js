// ============================================================
// Storage Service — Firebase Storage Upload/Delete
// ============================================================
// Handles file uploads to Firebase Storage.
// Returns public download URLs stored in Firestore.
// ============================================================

import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject
} from 'firebase/storage'
import { storage } from '../firebase/firebase'

// Allowed MIME types
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const ALLOWED_MATERIAL_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp']

/**
 * Validate a file before upload.
 * @param {File} file
 * @param {'image'|'material'} type
 * @returns {{ valid: boolean, error: string|null }}
 */
export const validateFile = (file, type = 'image') => {
  const maxSizes = { image: 5, material: 20 } // MB
  const allowedTypes = type === 'image' ? ALLOWED_IMAGE_TYPES : ALLOWED_MATERIAL_TYPES
  const maxMB = maxSizes[type]

  if (!file) return { valid: false, error: 'No file selected.' }

  if (!allowedTypes.includes(file.type)) {
    const readable = type === 'image'
      ? 'JPG, PNG, WebP, or GIF'
      : 'PDF, JPG, PNG, or WebP'
    return { valid: false, error: `Invalid file type. Allowed: ${readable}` }
  }

  const sizeMB = file.size / (1024 * 1024)
  if (sizeMB > maxMB) {
    return { valid: false, error: `File too large. Max ${maxMB}MB allowed. (Current: ${sizeMB.toFixed(1)}MB)` }
  }

  return { valid: true, error: null }
}

/**
 * Upload a file with progress tracking.
 * @param {File} file - The file to upload
 * @param {string} storagePath - E.g., 'gallery/filename.jpg'
 * @param {Function} onProgress - Called with progress % (0-100)
 * @returns {Promise<string>} - Download URL
 */
export const uploadFile = (file, storagePath, onProgress = null) => {
  return new Promise((resolve, reject) => {
    const storageRef = ref(storage, storagePath)
    const uploadTask = uploadBytesResumable(storageRef, file)

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        )
        if (onProgress) onProgress(progress)
      },
      (error) => {
        console.error('Upload error:', error)
        reject(new Error('File upload failed. Please try again.'))
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)
          resolve(downloadURL)
        } catch {
          reject(new Error('Failed to get file URL after upload.'))
        }
      }
    )
  })
}

/**
 * Delete a file from Firebase Storage by its full download URL.
 * @param {string} fileUrl - The full Firebase Storage download URL
 * @returns {Promise<void>}
 */
export const deleteFile = async (fileUrl) => {
  try {
    const fileRef = ref(storage, fileUrl)
    await deleteObject(fileRef)
  } catch (error) {
    // If file doesn't exist, ignore; rethrow others
    if (error.code !== 'storage/object-not-found') {
      throw new Error('Failed to delete file from storage.')
    }
  }
}

/**
 * Generate a unique filename to avoid collisions.
 * @param {string} originalName
 * @returns {string}
 */
export const generateUniqueFilename = (originalName) => {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 8)
  const ext = originalName.split('.').pop()
  const baseName = originalName.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9]/g, '_')
  return `${baseName}_${timestamp}_${random}.${ext}`
}
