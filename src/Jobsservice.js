// src/jobsService.js (or wherever you keep it)

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
} from 'firebase/firestore'
import { ref, uploadString, getDownloadURL } from 'firebase/storage'

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
        jobs.push({
          id: snap.id,
          ...data,
          // Convert Firestore timestamps to ISO strings if they exist
          created_at: data.created_at?.toDate?.()?.toISOString() || data.created_at,
          updated_at: data.updated_at?.toDate?.()?.toISOString() || data.updated_at,
        })
      })

      // Sort by created_at manually (most recent first)
      jobs.sort((a, b) => {
        const dateA = new Date(a.created_at || 0).getTime()
        const dateB = new Date(b.created_at || 0).getTime()
        return dateB - dateA
      })

      console.log('Fetched jobs from Firebase:', jobs.length)
      callback(jobs)
    },
    (error) => {
      console.error('Error fetching jobs:', error)
      callback([]) // prevent UI from hanging
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
          console.log('Photo uploaded & job updated with photoUrl')
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

// Update an existing job (without changing photo)
// If you want to support photo changes on edit later, we can extend this.
export const updateJobInDb = async (jobId, updates) => {
  try {
    const { photo, ...rest } = updates || {} // ignore `photo` here for now

    const jobRef = doc(db, 'jobs', jobId)
    await updateDoc(jobRef, {
      ...rest,
      updated_at: serverTimestamp(),
    })
  } catch (error) {
    console.error('Error updating job:', error)
    throw error
  }
}

// Delete a job
export const deleteJobInDb = async (jobId) => {
  try {
    const jobRef = doc(db, 'jobs', jobId)
    await deleteDoc(jobRef)
  } catch (error) {
    console.error('Error deleting job:', error)
    throw error
  }
}
