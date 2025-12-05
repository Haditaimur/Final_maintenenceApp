// Migration Script: Add hotelId to existing jobs in Firebase
// Run this ONCE to fix existing jobs that don't have hotelId

import { db } from './firebase'
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore'

export async function migrateJobsToAddHotelId() {
  try {
    console.log('Starting migration...')
    
    const jobsRef = collection(db, 'jobs')
    const snapshot = await getDocs(jobsRef)
    
    let updated = 0
    let skipped = 0
    
    for (const jobDoc of snapshot.docs) {
      const data = jobDoc.data()
      
      // If job doesn't have hotelId, add it
      if (!data.hotelId) {
        await updateDoc(doc(db, 'jobs', jobDoc.id), {
          hotelId: 'athena' // Change this to match your hotel
        })
        console.log(`Updated job ${jobDoc.id}`)
        updated++
      } else {
        console.log(`Job ${jobDoc.id} already has hotelId: ${data.hotelId}`)
        skipped++
      }
    }
    
    console.log('Migration complete!')
    console.log(`Updated: ${updated} jobs`)
    console.log(`Skipped: ${skipped} jobs`)
    
    return { updated, skipped }
  } catch (error) {
    console.error('Migration error:', error)
    throw error
  }
}

// To use this:
// 1. Import this file in your App.jsx: import { migrateJobsToAddHotelId } from './migration'
// 2. Add a temporary button in your app: <button onClick={migrateJobsToAddHotelId}>Fix Jobs</button>
// 3. Click the button once
// 4. Remove the button and this import
