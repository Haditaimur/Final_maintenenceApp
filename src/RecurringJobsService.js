import { db, authReady } from './firebase'

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

const COLLECTION_NAME = 'recurringJobs'

export const subscribeToRecurringJobs = (hotelId = 'athena', callback) => {
  let unsubscribe = () => {}

  authReady
    .then(() => {
      const recurringRef = collection(db, COLLECTION_NAME)

      const q = query(
        recurringRef,
        where('hotelId', '==', hotelId)
      )

      unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const recurringJobs = []

          snapshot.forEach((snap) => {
            const data = snap.data()

            recurringJobs.push({
              id: snap.id,
              ...data,
              nextRunAt:
                data.nextRunAt?.toDate?.()?.toISOString?.() ||
                data.nextRunAt ||
                null,
              created_at:
                data.created_at?.toDate?.()?.toISOString?.() ||
                data.created_at ||
                null,
              updated_at:
                data.updated_at?.toDate?.()?.toISOString?.() ||
                data.updated_at ||
                null,
            })
          })

          recurringJobs.sort((a, b) => {
            return (
              new Date(a.nextRunAt || 0).getTime() -
              new Date(b.nextRunAt || 0).getTime()
            )
          })

          callback(recurringJobs)
        },
        (error) => {
          console.error('Error fetching recurring jobs:', error)
          callback([])
        }
      )
    })
    .catch((error) => {
      console.error(
        'Authentication failed before recurring jobs subscription:',
        error
      )
      callback([])
    })

  return () => unsubscribe()
}

export const createRecurringJob = async (data) => {
  const recurringRef = collection(db, COLLECTION_NAME)

  const docRef = await addDoc(recurringRef, {
    ...data,

    hotelId: data.hotelId || 'athena',

    active:
      data.active !== undefined
        ? data.active
        : true,

    created_at: serverTimestamp(),
    updated_at: serverTimestamp(),
  })

  return docRef.id
}

export const updateRecurringJob = async (id, updates) => {
  const recurringRef = doc(db, COLLECTION_NAME, id)

  await updateDoc(recurringRef, {
    ...updates,
    updated_at: serverTimestamp(),
  })
}

export const deleteRecurringJob = async (id) => {
  await deleteDoc(
    doc(db, COLLECTION_NAME, id)
  )
}
