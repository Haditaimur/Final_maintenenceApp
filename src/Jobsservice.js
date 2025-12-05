import { db } from './firebase'
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore'

// Subscribe to real-time updates for all jobs in a hotel
export const subscribeToJobs = (hotelId, callback) => {
  const jobsRef = collection(db, 'jobs')
  const q = query(
    jobsRef,
    where('hotelId', '==', hotelId),
    orderBy('created_at', 'desc')
  )

  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      const jobs = []
      snapshot.forEach((doc) => {
        jobs.push({
          id: doc.id,
          ...doc.data(),
        })
      })
      callback(jobs)
    },
    (error) => {
      console.error('Error fetching jobs:', error)
      callback([])
    }
  )

  return unsubscribe
}

// Create a new job
export const createJobInDb = async (jobData) => {
  try {
    const jobsRef = collection(db, 'jobs')
    const docRef = await addDoc(jobsRef, {
      ...jobData,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
    })
    return docRef.id
  } catch (error) {
    console.error('Error creating job:', error)
    throw error
  }
}

// Update an existing job
export const updateJobInDb = async (jobId, updates) => {
  try {
    const jobRef = doc(db, 'jobs', jobId)
    await updateDoc(jobRef, {
      ...updates,
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
