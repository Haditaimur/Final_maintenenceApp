import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  updateDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore'

import { db } from './firebase'

// Create a new notification
export const createNotification = async ({
  hotelId,
  type,
  title,
  message,
  relatedJobId = null,
  relatedRecurringJobId = null,
}) => {
  return await addDoc(collection(db, 'notifications'), {
    hotelId,
    type,
    title,
    message,
    relatedJobId,
    relatedRecurringJobId,
    read: false,
    created_at: serverTimestamp(),
  })
}

// Real-time subscription for manager notifications
export const subscribeToNotifications = (
  hotelId,
  callback
) => {
  const notificationsQuery = query(
    collection(db, 'notifications'),
    where('hotelId', '==', hotelId),
    orderBy('created_at', 'desc')
  )

 return onSnapshot(
  notificationsQuery,
  (snapshot) => {
    const notifications = snapshot.docs.map((item) => ({
      id: item.id,
      ...item.data(),
    }))

    console.log('Notifications received:', notifications)

    callback(notifications)
  },
  (error) => {
    console.error('Notification listener error:', error)
  }
)
}

// Mark one notification as read
export const markNotificationAsRead = async (
  notificationId
) => {
  const notificationRef = doc(
    db,
    'notifications',
    notificationId
  )

  await updateDoc(notificationRef, {
    read: true,
  })
}
