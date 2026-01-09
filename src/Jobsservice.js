// src/Jobsservice.js

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
import { ref, uploadString, getDownloadURL } from 'firebase/storage'

import { getAuth } from "firebase/auth";
// ---- REALTIME SUBSCRIPTION ----

export const subscribeToJobs = (hotelId, callback) => {
  const jobsRef = collection(db, 'jobs')
  const q = query(jobsRef, where('hotelId', '==', hotelId))

  return onSnapshot(
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

        // ✅ Backward compatible: UI can always use job.photo
        const photo = data.photoUrl || data.photo || null

        jobs.push({
          id: snap.id,
          ...data,
          photo,
          created_at: createdAt,
          updated_at: updatedAt,
        })
      })

      jobs.sort((a, b) => {
        const aTime = new Date(a.created_at || 0).getTime()
        const bTime = new Date(b.created_at || 0).getTime()
        return bTime - aTime
      })

      callback(jobs)
    },
    (error) => {
      console.error('Error fetching jobs:', error)
      callback([])
    },
  )
}

// ---- INTERNAL PHOTO HELPER ----

const uploadPhotoDataUrl = async (hotelId, jobId, photoDataUrl) => {
  if (!photoDataUrl) return null

    const auth = getAuth();
  console.log("Auth user at upload:", auth.currentUser);

  const path = `jobPhotos/${hotelId}/${jobId}-${Date.now()}.jpg`
  const storageRef = ref(storage, path)


  
  await uploadString(storageRef, photoDataUrl, 'data_url')
  return await getDownloadURL(storageRef)
}

// ---- CRUD OPERATIONS ----

export const createJobInDb = async (jobData) => {
  const jobsRef = collection(db, 'jobs')
  const { photo, hotelId: inputHotelId, ...rest } = jobData || {}
  const hotelId = inputHotelId || 'athena'

  // 1) Create job without photoUrl first
  const docRef = await addDoc(jobsRef, {
    ...rest,
    hotelId,
    hasPhoto: false,
    photoUrl: null,
    created_at: serverTimestamp(),
    updated_at: serverTimestamp(),
  })

  // 2) Upload photo (if any) and patch doc with URL
  if (photo) {
    try {
      const url = await uploadPhotoDataUrl(hotelId, docRef.id, photo)
      await updateDoc(doc(db, 'jobs', docRef.id), {
        hasPhoto: true,
        photoUrl: url,
        updated_at: serverTimestamp(),
      })
    } catch (err) {
      console.error('Photo upload failed; job saved without photo:', err)
    }
  }

  return docRef.id
}

export const updateJobInDb = async (jobId, updates, hotelId = 'athena') => {
  const { photo, ...rest } = updates || {}
  const jobRef = doc(db, 'jobs', jobId)

  if (photo) {
    const url = await uploadPhotoDataUrl(hotelId, jobId, photo)
    await updateDoc(jobRef, {
      ...rest,
      hasPhoto: true,
      photoUrl: url,
      updated_at: serverTimestamp(),
    })
    return
  }

  await updateDoc(jobRef, {
    ...rest,
    updated_at: serverTimestamp(),
  })
}

export const deleteJobInDb = async (jobId) => {
  await deleteDoc(doc(db, 'jobs', jobId))
}

export const deleteMultipleJobsInDb = async (jobIds) => {
  if (!jobIds || jobIds.length === 0) throw new Error('No job IDs provided')

  const batch = writeBatch(db)
  jobIds.forEach((id) => batch.delete(doc(db, 'jobs', id)))
  await batch.commit()
}
