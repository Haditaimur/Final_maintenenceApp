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
  
  // Try with orderBy first, fall back to simple query if index doesn't exist
  const q = query(
    jobsRef,
    where('hotelId', '==', hotelId)
  )

  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      const jobs = []
      snapshot.forEach((doc) => {
        const data = doc.data()
        jobs.push({
          id: doc.id,
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
      // Still call callback with empty array to prevent app from hanging
      callback([])
    }
  )

  return unsubscribe
}

// Create a new job
export const createJobInDb = async (jobData) => {
  try {
    const jobsRef = collection(db, 'jobs')
    
    // Handle photo - compress if too large or remove if problematic
    let processedData = { ...jobData }
    
    if (processedData.photo && typeof processedData.photo === 'string') {
      // Check if photo is too large (Firestore has 1MB document limit)
      const photoSize = processedData.photo.length
      console.log('Photo size:', Math.round(photoSize / 1024), 'KB')
      
      if (photoSize > 500000) { // If larger than ~500KB
        console.warn('Photo too large for Firestore, removing from job')
        processedData.photo = null
        alert('Photo was too large and could not be uploaded. Job will be created without photo.')
      }
    }
    
    console.log('Creating job in Firebase:', processedData)
    
    const docRef = await addDoc(jobsRef, {
      ...processedData,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
    })
    
    console.log('Job created successfully with ID:', docRef.id)
    return docRef.id
  } catch (error) {
    console.error('Error creating job:', error)
    console.error('Error details:', error.message)
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
