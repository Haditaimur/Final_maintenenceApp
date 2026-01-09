// src/jobsService.js

import { db, storage } from './firebase'
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where,
  serverTimestamp,
  writeBatch,
} from 'firebase/firestore'
import { ref, uploadString, getDownloadURL, deleteObject } from 'firebase/storage'

// ---- REALTIME SUBSCRIPTION ----

// Subscribe to real-time updates for all jobs in a hotel
export const subscribeToJobs = (hotelId, callback) => {
  const jobsRef = collection(db, 'jobs')
  const q = query(jobsRef, where('hotelId', '==', hotelId))

  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      const jobs = []

      snapshot.forEach((snap) => {
        const data = snap.data()

        const createdAt =
          data.created_at?.toDate?.()?.toISOString?.() ||
          (typeof data.created_at === 'string' ? data.created_at : null)

        const updatedAt =
          data.updated_at?.toDate?.()?.toISOString?.() ||
          (typeof data.updated_at === 'string' ? data.updated_at : null)

        // ✅ Normalize photo so UI can always use job.photo
        const photo = data.photoUrl || data.photo || null

        jobs.push({
          id: snap.id,
          ...data,
          photo, // <-- UI reads this
          created_at: createdAt,
          updated_at: updatedAt,
        })
      })

      jobs.sort((a, b) => {
        const dateA = new Date(a.created_at || 0).getTime()
        const dateB = new Date(b.created_at || 0).getTime()
        return dateB - dateA
      })

      callback(jobs)
    },
    (error) => {
      console.error('Error fetching jobs:', error)
      callback([])
    },
  )

  return unsubscribe
}

// ---- INTERNAL PHOTO HELPER ----

// photoDataUrl is a base64 data URL string (e.g. "data:image/jpeg;base64,...")
const uploadPhotoDataUrl = async (hotelId, jobId, photoDataUrl) => {
  if (!photoDataUrl) return null

  // Basic size guard (Firestore doc limit is 1MB; Storage can handle big files)
  const approxSize = photoDataUrl.length
  console.log('Photo data length:', approxSize)

  // Path in Storage: jobPhotos/<hotelId>/<jobId>-timestamp.jpg
  const path = `jobPhotos/${hotelId}/${jobId}-${Date.now()}.jpg`
  const storageRef = ref(storage, path)

  // Upload the data URL directly
  await uploadString(storageRef, photoDataUrl, 'data_url')

  // Get a download URL we can store on the job
  const url = await getDownloadURL(storageRef)
  return url
}

// Delete photo from storage
const deletePhotoFromStorage = async (photoUrl) => {
  if (!photoUrl) return

  try {
    // Extract the path from the URL
    const photoRef = ref(storage, photoUrl)
    await deleteObject(photoRef)
    console.log('Photo deleted from storage:', photoUrl)
  } catch (error) {
    console.error('Error deleting photo from storage:', error)
    // Don't throw - if photo is already deleted, that's fine
  }
}

// ---- CRUD OPERATIONS ----

// Create a new job (optionally with photo data URL in jobData.photo)
export const createJobInDb = async (jobData) => {
  try {
    const jobsRef = collection(db, 'jobs')

    // extract photo out of jobData; rest goes into the doc directly
    const { photo, hotelId: inputHotelId, ...rest } = jobData || {}
    const hotelId = inputHotelId || 'athena' // default for now

    console.log('Creating job in Firebase (without photo yet):', {
      ...rest,
      hotelId,
    })

    // 1) Create job without photoUrl first
    const docRef = await addDoc(jobsRef, {
      ...rest,
      hotelId,
      hasPhoto: false,
      photoUrl: null,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
    })

    console.log('Job created successfully with ID:', docRef.id)

    // 2) If we have a photo as data URL, upload to Storage and update the job
    if (photo) {
      try {
        const url = await uploadPhotoDataUrl(hotelId, docRef.id, photo)

        if (url) {
          const jobRef = doc(db, 'jobs', docRef.id)
          await updateDoc(jobRef, {
            hasPhoto: true,
            photoUrl: url,
            updated_at: serverTimestamp(),
          })
          console.log('Photo uploaded & job updated with photoUrl:', url)
        }
      } catch (photoErr) {
        console.error('Error uploading photo, job will exist without photo:', photoErr)
      }
    }

    return docRef.id
  } catch (error) {
    console.error('Error creating job:', error)
    console.error('Error details:', error.message)
    throw error
  }
}

// Update an existing job (with photo support)
export const updateJobInDb = async (jobId, updates) => {
  try {
    const { photo, ...rest } = updates || {}

    // Get current job to check if it has an old photo
    const jobRef = doc(db, 'jobs', jobId)

    // If a new photo is provided
// Update an existing job (with photo support)
export const updateJobInDb = async (jobId, updates, hotelId) => {
  try {
    const { photo, ...rest } = updates || {}
    const jobRef = doc(db, 'jobs', jobId)

    // If a new photo is provided
    if (photo) {
      if (!hotelId) {
        throw new Error('hotelId is required to upload a photo')
      }

      const url = await uploadPhotoDataUrl(hotelId, jobId, photo)

      await updateDoc(jobRef, {
        ...rest,
        hasPhoto: true,
        photoUrl: url,
        updated_at: serverTimestamp(),
      })

      console.log('Job updated with new photo:', url)
      return
    }

    // No photo update → normal update
    await updateDoc(jobRef, {
      ...rest,
      updated_at: serverTimestamp(),
    })

    console.log('Job updated successfully')
  } catch (error) {
    console.error('Error updating job:', error)
    throw error
  }
}

    // If no photo update, just update other fields
    await updateDoc(jobRef, {
      ...rest,
      updated_at: serverTimestamp(),
    })
    console.log('Job updated successfully')
  } catch (error) {
    console.error('Error updating job:', error)
    throw error
  }
}

// Delete a single job
export const deleteJobInDb = async (jobId) => {
  try {
    const jobRef = doc(db, 'jobs', jobId)
    
    // Note: We're not deleting the photo from storage here
    // If you want to delete photos too, you'd need to:
    // 1. Fetch the job document first
    // 2. Get the photoUrl
    // 3. Delete from storage
    // 4. Then delete the document
    
    await deleteDoc(jobRef)
    console.log('Job deleted:', jobId)
  } catch (error) {
    console.error('Error deleting job:', error)
    throw error
  }
}

// Delete multiple jobs at once
export const deleteMultipleJobsInDb = async (jobIds) => {
  if (!jobIds || jobIds.length === 0) {
    throw new Error('No job IDs provided')
  }

  try {
    const batch = writeBatch(db)

    // Add all delete operations to the batch
    jobIds.forEach((jobId) => {
      const jobRef = doc(db, 'jobs', jobId)
      batch.delete(jobRef)
    })

    // Commit all deletes at once
    await batch.commit()
    console.log(`Successfully deleted ${jobIds.length} jobs`)
  } catch (error) {
    console.error('Error deleting multiple jobs:', error)
    throw error
  }
}
