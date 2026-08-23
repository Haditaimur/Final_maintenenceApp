// HotelKeep App v2.0 - With Bulk Delete
import { useState, useEffect, useRef } from 'react'
import './App.css'
import {
  subscribeToJobs,
  createJobInDb,
  updateJobInDb,
  deleteJobInDb,
  deleteMultipleJobsInDb,
} from './Jobsservice'

import {
  subscribeToRecurringJobs,
  createRecurringJob,
  updateRecurringJob,
  deleteRecurringJob,
} from './RecurringJobsService'

import {
  createNotification,
  subscribeToNotifications,
  markNotificationAsRead,
} from './NotificationsService'

import { authReady } from './firebase'

// Data
const initialRooms = [
  // Basement
  { id: 1, room_number: '51', notes: 'Triple Room', floor: 'Basement' },
  { id: 2, room_number: '52', notes: 'Triple Room', floor: 'Basement' },
  { id: 3, room_number: '53', notes: 'Twin Room', floor: 'Basement' },
  { id: 4, room_number: '54', notes: 'Triple Room', floor: 'Basement' },
  // Ground Floor
  { id: 5, room_number: '1', notes: 'Single Room', floor: 'Ground Floor' },
  { id: 6, room_number: '2', notes: 'Family Room', floor: 'Ground Floor' },
  { id: 7, room_number: '3', notes: 'Double Room', floor: 'Ground Floor' },
  { id: 8, room_number: '4', notes: 'Double Room', floor: 'Ground Floor' },
  { id: 9, room_number: '5', notes: 'Twin Room', floor: 'Ground Floor' },
  { id: 10, room_number: '6', notes: 'Triple Room', floor: 'Ground Floor' },
  { id: 11, room_number: '7', notes: 'Family Room', floor: 'Ground Floor' },
  // First Floor
  { id: 12, room_number: '8', notes: 'Twin Room', floor: 'First Floor' },
  { id: 13, room_number: '2b', notes: 'Twin Room', floor: 'First Floor' },
  { id: 14, room_number: '11', notes: 'Quad Room', floor: 'First Floor' },
  { id: 15, room_number: '12', notes: 'Quad Room', floor: 'First Floor' },
  { id: 16, room_number: '13', notes: 'Quad Room', floor: 'First Floor' },
  { id: 17, room_number: '14', notes: 'Family Room', floor: 'First Floor' },
  { id: 18, room_number: '15', notes: 'Double Room', floor: 'First Floor' },
  { id: 19, room_number: '16', notes: 'Double Room', floor: 'First Floor' },
  // Second Floor
  { id: 20, room_number: '9', notes: 'Single Room', floor: 'Second Floor' },
  { id: 21, room_number: '5b', notes: 'Single Room', floor: 'Second Floor' },
  { id: 22, room_number: '21', notes: 'Family Room', floor: 'Second Floor' },
  { id: 23, room_number: '22', notes: 'Family Room', floor: 'Second Floor' },
  { id: 24, room_number: '23', notes: 'Family Room', floor: 'Second Floor' },
  { id: 25, room_number: '24', notes: 'Family Room', floor: 'Second Floor' },
  { id: 26, room_number: '25', notes: 'Double Room', floor: 'Second Floor' },
  { id: 27, room_number: '26', notes: 'Double Room', floor: 'Second Floor' },
  // Third Floor
  { id: 28, room_number: '31', notes: 'Quad Room', floor: 'Third Floor' },
  { id: 29, room_number: '32', notes: 'Family Room', floor: 'Third Floor' },
  { id: 30, room_number: '33', notes: 'Quad Room', floor: 'Third Floor' },
  { id: 31, room_number: '34', notes: 'Triple Room', floor: 'Third Floor' },
  { id: 32, room_number: '35', notes: 'Double Room', floor: 'Third Floor' },
  { id: 33, room_number: '36', notes: 'Double Room', floor: 'Third Floor' },
  // Fourth Floor
  { id: 34, room_number: '41', notes: 'Quad Room', floor: 'Fourth Floor' },
  { id: 35, room_number: '42', notes: 'Quad Room', floor: 'Fourth Floor' },
  { id: 36, room_number: '43', notes: 'Quad Room', floor: 'Fourth Floor' },
  { id: 37, room_number: '44', notes: 'Triple Room', floor: 'Fourth Floor' },
  { id: 38, room_number: '45', notes: 'Single Room', floor: 'Fourth Floor' },
  { id: 39, room_number: '46', notes: 'Single Room', floor: 'Fourth Floor' },
]

// NOTE: initialJobs is currently unused; kept for reference.
const initialJobs = [
  {
    id: 1,
    room_id: 5,
    title: 'Shower Leak',
    description:
      'Water dripping from shower head constantly. Needs immediate attention.',
    photo: null,
    status: 'Urgent',
    original_status: 'Urgent',
    created_at: new Date('2025-11-28T08:00:00').toISOString(),
    updated_at: new Date('2025-11-28T08:00:00').toISOString(),
  },
  {
    id: 2,
    room_id: 8,
    title: 'AC Not Working',
    description: 'Air conditioning unit not turning on. Room is getting warm.',
    photo: null,
    status: 'Urgent',
    original_status: 'Urgent',
    created_at: new Date('2025-11-28T09:30:00').toISOString(),
    updated_at: new Date('2025-11-28T09:30:00').toISOString(),
  },
  {
    id: 3,
    room_id: 14,
    title: 'Lamp Flickering',
    description: 'Bedside lamp flickering intermittently.',
    photo: null,
    status: 'To Do',
    original_status: 'To Do',
    created_at: new Date('2025-11-27T14:00:00').toISOString(),
    updated_at: new Date('2025-11-27T14:00:00').toISOString(),
  },
  {
    id: 4,
    room_id: 22,
    title: 'Loose Bathroom Tile',
    description: 'Tile near sink is coming loose and needs re-grouting.',
    photo: null,
    status: 'To Do',
    original_status: 'To Do',
    created_at: new Date('2025-11-27T11:00:00').toISOString(),
    updated_at: new Date('2025-11-27T11:00:00').toISOString(),
  },
  {
    id: 5,
    room_id: 28,
    title: 'Window Handle Loose',
    description: 'Window handle is wobbly and difficult to operate.',
    photo: null,
    status: 'To Do',
    original_status: 'To Do',
    created_at: new Date('2025-11-26T16:00:00').toISOString(),
    updated_at: new Date('2025-11-26T16:00:00').toISOString(),
  },
  {
    id: 6,
    room_id: 35,
    title: 'Curtain Rail Fixed',
    description: 'Repaired and reinforced curtain rail bracket.',
    photo: null,
    status: 'Done',
    original_status: 'To Do',
    created_at: new Date('2025-11-25T10:00:00').toISOString(),
    updated_at: new Date('2025-11-28T15:00:00').toISOString(),
  },
]

// Storage helpers
const storage = {
  get: (key, defaultValue) => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch {
      return defaultValue
    }
  },
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (e) {
      console.error('Storage error:', e)
    }
  },
}

// Simple hash function for manager code
const hashCode = (str) => {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash
  }
  return hash.toString()
}

// Version control for data updates
const APP_VERSION = '6.0'
const currentVersion = storage.get('appVersion', '1.0')

// Reset rooms if version changed
if (currentVersion !== APP_VERSION) {
  localStorage.removeItem('rooms')
  storage.set('appVersion', APP_VERSION)
}

// Main App Component
function HotelMaintenanceApp() {
  const [recurringJobs, setRecurringJobs] = useState([])
  const [notifications, setNotifications] = useState([])
  const goToNotifications = () => {
  setCurrentView('notifications')
}
const openNotification = async (notification) => {
  try {
    if (!notification.read) {
      await markNotificationAsRead(notification.id)
    }

    // Normal maintenance job notification
    if (notification.relatedJobId) {
      const relatedJob = jobs.find(
        (job) => job.id === notification.relatedJobId
      )

      if (relatedJob) {
        setSelectedJob(relatedJob)

        // Remember that we came from Notifications
        setSelectedCategory('Notifications')

        setIsEditing(false)
        setCurrentView('job-detail')
        return
      }
    }

    // Recurring/scheduled job notification
    if (notification.relatedRecurringJobId) {
      const relatedJob = recurringJobs.find(
        (job) =>
          job.id === notification.relatedRecurringJobId
      )

      if (relatedJob) {
        setSelectedRecurringJob(relatedJob)
        setSelectedNotification(notification)
        setCurrentView('manager-scheduled-job-detail')
        return
      }
    }

    window.alert('The related job could not be found.')
  } catch (error) {
    console.error('Could not open notification:', error)
    window.alert('Could not open notification.')
  }
}
  const [currentView, setCurrentView] = useState('role-select')
  const [userRole, setUserRole] = useState(null)
  const [rooms, setRooms] = useState(() => storage.get('rooms', initialRooms))

  // Jobs now come from Firebase, not localStorage
  const [jobs, setJobs] = useState([])
  const hotelId = 'athena' // you can change this later if needed

  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedJob, setSelectedJob] = useState(null)
  const [selectedFloor, setSelectedFloor] = useState(null)
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [completedSortOrder, setCompletedSortOrder] = useState('recent')
const [completedRoomFilter, setCompletedRoomFilter] = useState('all')
  const [isEditing, setIsEditing] = useState(false)
  const [enlargedPhoto, setEnlargedPhoto] = useState(null)
  const [managerCode, setManagerCode] = useState(() =>
    storage.get('managerCodeHash', hashCode('1234')),
  )
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [selectedJobs, setSelectedJobs] = useState([])
  const [isSelectionMode, setIsSelectionMode] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [selectedRecurringJob, setSelectedRecurringJob] = useState(null)
  const [selectedScheduledJob, setSelectedScheduledJob] = useState(null)
  const [selectedNotification, setSelectedNotification] = useState(null)

  
  const editRecurringJob = (job) => {
  setSelectedRecurringJob(job)
  setCurrentView('edit-recurring-job')
}

  useEffect(() => {
    console.log('🎉 HotelKeep v2.0 - Bulk Delete Enabled')
  }, [])

  useEffect(() => {
    storage.set('rooms', rooms)
  }, [rooms])

  useEffect(() => {
    storage.set('managerCodeHash', managerCode)
  }, [managerCode])

  // Real-time subscription to jobs from Firebase
  useEffect(() => {
    const unsubscribe = subscribeToJobs(hotelId, (newJobs) => {
      setJobs(newJobs)
    })

    return () => unsubscribe()
  }, [hotelId])

  useEffect(() => {
  const unsubscribe = subscribeToRecurringJobs(hotelId, (items) => {
    setRecurringJobs(items)
  })

  return () => unsubscribe()
}, [hotelId])

  useEffect(() => {
  let unsubscribe = null
  let cancelled = false

  const startNotificationsListener = async () => {
    try {
      await authReady

      if (cancelled) return

      unsubscribe = subscribeToNotifications(
        hotelId,
        (items) => {
          console.log('🔔 Notifications received:', items)
          setNotifications(items)
        }
      )
    } catch (error) {
      console.error(
        'Notification listener could not start:',
        error
      )
    }
  }

  startNotificationsListener()

  return () => {
    cancelled = true

    if (unsubscribe) {
      unsubscribe()
    }
  }
}, [hotelId])

  const selectRole = (role) => {
    if (role === 'manager') {
      const enteredCode = window.prompt('Enter manager security code:')
      if (enteredCode && hashCode(enteredCode) === managerCode) {
        setUserRole(role)
        setCurrentView('dashboard')
      } else if (enteredCode !== null) {
        window.alert('Incorrect security code. Access denied.')
      }
    } else {
      setUserRole(role)
      setCurrentView('dashboard')
    }
  }

  const changeManagerCode = () => {
    const currentCode = window.prompt('Enter current security code:')
    if (currentCode && hashCode(currentCode) === managerCode) {
      const newCode = window.prompt(
        'Enter new security code (4-8 digits recommended):',
      )
      if (newCode && newCode.length >= 4) {
        const confirmCode = window.prompt('Confirm new security code:')
        if (confirmCode === newCode) {
          setManagerCode(hashCode(newCode))
          window.alert('Security code updated successfully!')
        } else {
          window.alert('Codes do not match. Security code not changed.')
        }
      } else if (newCode !== null) {
        window.alert('Security code must be at least 4 characters long.')
      }
    } else if (currentCode !== null) {
      window.alert('Incorrect current code. Access denied.')
    }
  }

  const logout = () => {
    setUserRole(null)
    setCurrentView('role-select')
    setSelectedCategory(null)
    setSelectedJob(null)
    setSelectedFloor(null)
    setSelectedRoom(null)
    setIsEditing(false)
  }

  const goToDashboard = () => {
  setCurrentView('dashboard')
  setSelectedCategory(null)
  setSelectedJob(null)
  setSelectedFloor(null)
  setSelectedRoom(null)
  setIsSelectionMode(false)
  setSelectedJobs([])
  setCompletedSortOrder('recent')
  setCompletedRoomFilter('all')
}

  const viewCategory = (category) => {
  try {
    setSelectedCategory(category)
    setIsSelectionMode(false)
    setSelectedJobs([])

    if (category === 'Urgent') {
      setCurrentView('urgent-list')
    } else if (category === 'Done') {
      setCompletedSortOrder('recent')
      setCompletedRoomFilter('all')
      setCurrentView('completed-jobs')
    } else {
      setCurrentView('floor-list')
    }
  } catch (err) {
    console.error('Error in viewCategory:', err)
    goToDashboard()
  }
}

  const viewFloorRooms = (floor) => {
    setSelectedFloor(floor)
    setCurrentView('room-list')
  }

  const viewRoomJobs = (room) => {
    setSelectedRoom(room)
    setCurrentView('job-list')
  }

  const viewJobDetail = (job) => {
    setSelectedJob(job)
    setCurrentView('job-detail')
    setIsEditing(false)
  }

  const editJob = () => {
    setIsEditing(true)
    setCurrentView('edit-job')
  }

  const addNewJob = () => {
    setCurrentView('add-job')
  }

  const addNewRecurringJob = () => {
  setCurrentView('add-recurring-job')
}

const goToRecurringJobs = () => {
  setCurrentView('recurringJobs')
}

  const goToHandymanScheduledJobs = () => {
  setCurrentView('handyman-scheduled-jobs')
}

  const viewScheduledJobDetail = (job) => {
  setSelectedScheduledJob(job)
  setCurrentView('scheduled-job-detail')
}
  

  // Firebase-based createJob with timestamps and original_status
  const createJob = async (jobData) => {
    if (!jobData.title || !jobData.description) {
      window.alert('Job must have a title and description')
      return
    }

    if (jobData.status !== 'Other' && !jobData.room_id) {
      window.alert('Room-based jobs must have a valid room')
      return
    }

    const now = new Date().toISOString()

    setIsCreating(true)
    try {
      await createJobInDb({
        ...jobData,
        hotelId,
        original_status: jobData.status,
        created_at: now,
        updated_at: now,
      })
      goToDashboard()
    } catch (err) {
      console.error('Error creating job in Firebase:', err)
      window.alert('Could not create job. Please try again.')
    } finally {
      setIsCreating(false)
    }
  }

// updateJobData always sets updated_at
const updateJobData = async (jobId, updates) => {
  // Basic validation
  if (updates.title !== undefined && !updates.title.trim()) {
    window.alert('Job title cannot be empty')
    return
  }

  if (updates.description !== undefined && !updates.description.trim()) {
    window.alert('Job description cannot be empty')
    return
  }

  const existingJob = jobs.find((j) => j.id === jobId)
  if (!existingJob) return

  const newUpdates = { ...updates }

  // preserve original_status when moving to Done
  if (updates.status === 'Done' && existingJob.status !== 'Done') {
    newUpdates.original_status =
      existingJob.status === 'Other' ? 'Other' : existingJob.status
  }

  // always bump updated_at
  newUpdates.updated_at = new Date().toISOString()

  setIsUpdating(true)
  try {
    // 🔹 1) Write to Firestore
   await updateJobInDb(jobId, newUpdates, hotelId)

    // 🔔 Notify manager about handyman activity
if (userRole === 'handyman') {
  const room = rooms.find(
    (room) => room.id === existingJob.room_id
  )

  let notificationType = 'job_updated'
  let notificationTitle = 'Job Updated'
  let notificationResult = 'updated'

  // Handyman marked job as completed
  if (
    updates.status === 'Done' &&
    existingJob.status !== 'Done'
  ) {
    notificationType = 'job_completed'
    notificationTitle = 'Job Completed'
    notificationResult = 'completed'
  }

  // Status changed to something else
  else if (
    updates.status &&
    updates.status !== existingJob.status
  ) {
    notificationType = 'job_status_changed'
    notificationTitle = 'Job Status Changed'
    notificationResult = updates.status
  }

  await createNotification({
    hotelId,

    type: notificationType,

    title: notificationTitle,

    message: existingJob.title,

    relatedJobId: jobId,

    result: notificationResult,

    actionAt: newUpdates.updated_at,

    location: room
      ? `Room ${room.room_number}`
      : existingJob.jobType === 'other'
      ? 'Other Job'
      : '',
  })
}

    // Record manager reopening a completed job
if (
  userRole === 'manager' &&
  existingJob.status === 'Done' &&
  updates.status &&
  updates.status !== 'Done'
) {
  const room = rooms.find(
    (room) => room.id === existingJob.room_id
  )

  await createNotification({
    hotelId,
    type: 'job_reopened',
    title: 'Job Reopened',
    message: existingJob.title,
    relatedJobId: jobId,
    result: 'reopened',
    actionAt: newUpdates.updated_at,

    location: room
      ? `Room ${room.room_number}`
      : existingJob.jobType === 'other'
      ? 'Other Job'
      : '',
  })
}

    // 🔹 2) Optimistically update local jobs list
    setJobs((prev) =>
      prev.map((job) =>
        job.id === jobId ? { ...job, ...newUpdates } : job
      )
    )

    // 🔹 3) Keep selectedJob in sync if we’re on the detail view
    if (selectedJob && selectedJob.id === jobId) {
      setSelectedJob((prev) => (prev ? { ...prev, ...newUpdates } : prev))
    }

    // 🔹 4) Go back to Job Detail after successful update
    setCurrentView('job-detail')
  } catch (err) {
    console.error('Error updating job in Firebase:', err)
    window.alert('Could not update job. Please try again.')
  } finally {
    setIsUpdating(false)
  }
}


  // confirmation handled in JobDetail, this just executes the delete
  const deleteJob = async (jobId) => {
    setIsDeleting(true)
    try {
      await deleteJobInDb(jobId)
      goToDashboard()
    } catch (err) {
      console.error('Error deleting job in Firebase:', err)
      window.alert('Could not delete job. Please try again.')
    } finally {
      setIsDeleting(false)
    }
  }

  // Toggle selection mode
  const toggleSelectionMode = () => {
    console.log('Toggle selection mode:', !isSelectionMode)
    setIsSelectionMode(!isSelectionMode)
    setSelectedJobs([])
  }

  // Toggle job selection
  const toggleJobSelection = (jobId) => {
    setSelectedJobs((prev) =>
      prev.includes(jobId) ? prev.filter((id) => id !== jobId) : [...prev, jobId]
    )
  }

  // Select all jobs
  const selectAllJobs = (jobsList) => {
    setSelectedJobs(jobsList.map((job) => job.id))
  }

  // Delete selected jobs
  const deleteSelectedJobs = async () => {
    if (selectedJobs.length === 0) {
      window.alert('No jobs selected')
      return
    }

    if (!window.confirm(`Delete ${selectedJobs?.length || 0} job(s)?`)) {
      return
    }

    setIsDeleting(true)
    try {
      await deleteMultipleJobsInDb(selectedJobs)
      setSelectedJobs([])
      setIsSelectionMode(false)
      window.alert(`Deleted ${selectedJobs?.length || 0} job(s)!`)
    } catch (err) {
      console.error('Error deleting jobs:', err)
      window.alert('Could not delete jobs')
    } finally {
      setIsDeleting(false)
    }
  }

  const getJobsForCategory = (status) => {
    if (status === 'To Do') {
      return jobs.filter(
        (job) =>
          job.status === 'To Do' ||
          job.status === 'Urgent' ||
          job.status === 'Other',
      )
    }
    return jobs.filter((job) => job.status === status)
  }

  const getJobsWithRoomInfo = (jobsList) => {
    return jobsList.map((job) => ({
      ...job,
      room: rooms.find((r) => r.id === job.room_id),
    }))
  }

  const getRoomById = (roomId) => {
    if (!roomId) return null
    return rooms.find((r) => r.id === roomId) || null
  }

  return (
    <div className="app-container">
      {enlargedPhoto && (
        <div className="photo-modal" onClick={() => setEnlargedPhoto(null)}>
          <button
            className="photo-modal-close"
            onClick={() => setEnlargedPhoto(null)}
          >
            ×
          </button>
          <img src={enlargedPhoto} alt="Enlarged" />
        </div>
      )}

      {currentView === 'role-select' && (
        <RoleSelector onSelectRole={selectRole} />
      )}

      {currentView === 'dashboard' && (
        <Dashboard
            role={userRole}

              jobs={jobs}
            
              recurringJobs={recurringJobs}

              notifications={notifications}
            
              onViewCategory={viewCategory}
            
              onViewRecurringJobs={goToRecurringJobs}

              onViewAllScheduledJobs={goToHandymanScheduledJobs}

              onViewScheduledJob={viewScheduledJobDetail}

              onViewNotifications={goToNotifications}
            
              onAddJob={addNewJob}
            
              onLogout={logout}
            
              onChangeCode={changeManagerCode}
            
              showUserMenu={showUserMenu}
            
              setShowUserMenu={setShowUserMenu}
        />
      )}

      {currentView === 'notifications' && userRole === 'manager' && (

            <NotificationsList
          
              notifications={notifications}
          
              onBack={goToDashboard}

              onOpenNotification={openNotification}
          
            />
          
          )}

     {currentView === 'manager-scheduled-job-detail' &&
            userRole === 'manager' &&
            selectedRecurringJob &&
            selectedNotification && (
              <ManagerScheduledJobDetail
                job={selectedRecurringJob}
                notification={selectedNotification}
                notifications={notifications}
                onBack={goToNotifications}
                goToDashboard={goToDashboard}
              />
          )}

      {currentView === 'recurringJobs' && userRole === 'manager' && (
          <RecurringJobsList
            recurringJobs={recurringJobs}
            rooms={rooms}
            onBack={goToDashboard}
            onEdit={editRecurringJob}
            onAdd={addNewRecurringJob}
            onUpdate={updateRecurringJob}
            onDelete={deleteRecurringJob}
          />
        )}

      {currentView === 'handyman-scheduled-jobs' &&
          userRole === 'handyman' && (
            <HandymanScheduledJobsList
              recurringJobs={recurringJobs}
              onBack={goToDashboard}
              onViewJob={viewScheduledJobDetail}
            />
          )}

      {currentView === 'scheduled-job-detail' &&
            selectedScheduledJob && (
              <ScheduledJobDetail
                job={selectedScheduledJob}
                role={userRole}
                onBack={goToHandymanScheduledJobs}
                onUpdate={updateRecurringJob}
                goToDashboard={goToDashboard}
              />
            )}

      {currentView === 'urgent-list' && (
        <UrgentJobsList
          jobs={getJobsWithRoomInfo(getJobsForCategory('Urgent'))}
          onBack={goToDashboard}
          onViewJob={viewJobDetail}
          isSelectionMode={isSelectionMode}
          selectedJobs={selectedJobs}
          onToggleSelection={toggleJobSelection}
          onToggleMode={toggleSelectionMode}
          onSelectAll={selectAllJobs}
          onDeleteSelected={deleteSelectedJobs}
          isDeleting={isDeleting}
        />
      )}

      {currentView === 'completed-jobs' && (
        <CompletedJobsList
          jobs={jobs}
          rooms={rooms}
          sortOrder={completedSortOrder}
          selectedRoomFilter={completedRoomFilter}
          onChangeSortOrder={setCompletedSortOrder}
          onChangeRoomFilter={setCompletedRoomFilter}
          onBack={goToDashboard}
          onViewJob={viewJobDetail}
          goToDashboard={goToDashboard}
        />
      )}

      {currentView === 'floor-list' && (
        <FloorList
          category={selectedCategory}
          jobs={jobs}
          rooms={rooms}
          onBack={goToDashboard}
          onViewFloor={viewFloorRooms}
        />
      )}

      {currentView === 'room-list' && (
        <RoomList
          floor={selectedFloor}
          category={selectedCategory}
          jobs={jobs}
          rooms={rooms}
          onBack={() => setCurrentView('floor-list')}
          onViewRoom={viewRoomJobs}
          onViewJob={viewJobDetail}
          goToDashboard={goToDashboard}
        />
      )}

      {currentView === 'job-list' && (
        <JobList
          room={selectedRoom}
          category={selectedCategory}
          jobs={jobs}
          onBack={() => setCurrentView('room-list')}
          onViewJob={viewJobDetail}
          goToDashboard={goToDashboard}
          isSelectionMode={isSelectionMode}
          selectedJobs={selectedJobs}
          onToggleSelection={toggleJobSelection}
          onToggleMode={toggleSelectionMode}
          onSelectAll={selectAllJobs}
          onDeleteSelected={deleteSelectedJobs}
          isDeleting={isDeleting}
        />
      )}

      {currentView === 'job-detail' && selectedJob && (
        <JobDetail
          job={selectedJob}
          room={getRoomById(selectedJob.room_id)}
          role={userRole}
          onBack={() => {
            if (selectedCategory === 'Notifications') {
              setCurrentView('notifications')
            } else if (selectedCategory === 'Urgent') {
              setCurrentView('urgent-list')
            } else if (selectedCategory === 'Done') {
              setCurrentView('completed-jobs')
            } else {
              setCurrentView('job-list')
            }
          }}
          onUpdateJob={updateJobData}
          onDeleteJob={deleteJob}
          onEditJob={editJob}
          onEnlargePhoto={setEnlargedPhoto}
          goToDashboard={goToDashboard}
          isDeleting={isDeleting}
          notifications={notifications}
          />
      )}

      {currentView === 'add-job' && (
        <AddJobForm
          rooms={rooms}
          onBack={goToDashboard}
          onSubmit={createJob}
          goToDashboard={goToDashboard}
          isCreating={isCreating}
        />
      )}

      {currentView === 'edit-job' && selectedJob && (
        <EditJobForm
          job={selectedJob}
          rooms={rooms}
          onBack={() => setCurrentView('job-detail')}
          onSubmit={updateJobData}
          goToDashboard={goToDashboard}
          isUpdating={isUpdating}
        />
      )}

      {currentView === 'add-recurring-job' && userRole === 'manager' && (
        <AddRecurringJobForm
          onBack={goToRecurringJobs}
          onSubmit={async (data) => {
            try {
              await createRecurringJob({
                ...data,
                hotelId,
              })
      
              setCurrentView('recurringJobs')
            } catch (error) {
              console.error('Could not create recurring job:', error)
              window.alert('Could not create recurring job.')
            }
          }}
        />
      )}

      {currentView === 'edit-recurring-job' &&
        userRole === 'manager' &&
        selectedRecurringJob && (
          <EditRecurringJobForm
            job={selectedRecurringJob}
            onBack={goToRecurringJobs}
            onSubmit={async (jobId, updates) => {
              try {
                await updateRecurringJob(jobId, updates)
      
                setSelectedRecurringJob(null)
                setCurrentView('recurringJobs')
              } catch (error) {
                console.error('Could not update recurring job:', error)
                window.alert('Could not update recurring job.')
              }
            }}
          />
        )}
    </div>
  )
}

// ---- Components below here ----

function RoleSelector({ onSelectRole }) {
  return (
    <div className="fade-in">
      <div className="app-branding">
        <div className="app-logo">🏨</div>
        <h1 className="app-name">HotelKeep</h1>
        <p className="app-tagline">Professional Maintenance Management</p>
      </div>
      <div className="role-selector">
        <h2>Select Your Role</h2>
        <p>Choose your role to access the system</p>
        <div className="role-buttons">
          <button
            className="role-select-btn manager"
            onClick={() => onSelectRole('manager')}
          >
            <span>👨‍💼 Manager</span>
          </button>
          <button
            className="role-select-btn"
            onClick={() => onSelectRole('handyman')}
          >
            <span>🔧 Handyman</span>
          </button>
        </div>
      </div>
    </div>
  )
}

function Dashboard({
  role,

  jobs,

  recurringJobs,

  notifications,

  onViewNotifications,

  onViewCategory,

  onViewRecurringJobs,

  onViewAllScheduledJobs,

  onViewScheduledJob,

  onAddJob,

  onLogout,

  onChangeCode,

  showUserMenu,

  setShowUserMenu,
}) {
  const urgentCount = jobs.filter((j) => j.status === 'Urgent').length
  const todoCount = jobs.filter(
    (j) =>
      j.status === 'To Do' || j.status === 'Urgent' || j.status === 'Other',
  ).length
  const doneCount = jobs.filter((j) => j.status === 'Done').length
  const unreadNotificationCount = (notifications || []).filter(
  (notification) => !notification.read
    ).length

const activeScheduledJobs = (recurringJobs || [])
  .filter((job) => job.active)
  .sort((a, b) => {
    const aDate = new Date(a.nextRunAt || 0).getTime()
    const bDate = new Date(b.nextRunAt || 0).getTime()

    return aDate - bDate
  })

const today = new Date()
today.setHours(0, 0, 0, 0)

const overdueScheduledJobs = activeScheduledJobs.filter((job) => {
  if (!job.nextRunAt) return false

  const dueDate = new Date(job.nextRunAt)
  dueDate.setHours(0, 0, 0, 0)

  return dueDate < today
})

const upcomingScheduledJobs = activeScheduledJobs.filter((job) => {
  if (!job.nextRunAt) return false

  const dueDate = new Date(job.nextRunAt)
  dueDate.setHours(0, 0, 0, 0)

  return dueDate >= today
})

const dashboardScheduledJobs = [
  ...overdueScheduledJobs,
  ...upcomingScheduledJobs,
].slice(0, 1)

  return (
    <>
      <div className="app-header">
        <div className="header-content">
          <h1 className="app-title" onClick={() => setShowUserMenu(false)}>
            HotelKeep
          </h1>
          <div className="header-right">
            <span className={`role-badge ${role}`}>
              {role === 'manager' ? '👨‍💼 Manager' : '🔧 Handyman'}
            </span>
            {role === 'manager' && (
            <button
              className="notification-button"
              type="button"
              title="Notifications"
              onClick={onViewNotifications}
            >
              🔔
        
              {unreadNotificationCount > 0 && (
                <span className="notification-count">
                  {unreadNotificationCount > 99
                    ? '99+'
                    : unreadNotificationCount}
                </span>
              )}
            </button>
        )}
            
            <div className="user-menu-container">
              <button
                className="user-menu-button"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                ⚙️
                <span style={{ fontSize: '0.6rem' }}>▼</span>
              </button>
              {showUserMenu && (
                <div className="user-menu-dropdown">
                  {role === 'manager' && (
                    <button
                      className="user-menu-item"
                      onClick={() => {
                        setShowUserMenu(false)
                        onChangeCode()
                      }}
                    >
                      🔒 Change Security Code
                    </button>
                  )}
                  <button
                    className="user-menu-item danger"
                    onClick={() => {
                      setShowUserMenu(false)
                      onLogout()
                    }}
                  >
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard fade-in">
        {role === 'handyman' && (
  <div className="upcoming-scheduled-section">
    <div className="upcoming-scheduled-header">
      <div>
        <h2>🗓️ Upcoming Scheduled Jobs</h2>
        <p>Planned recurring maintenance tasks</p>
      </div>
    </div>

   {dashboardScheduledJobs.length === 0 ? (
      <div className="empty-state">
        <div className="empty-icon">🗓️</div>
        <div className="empty-title">
          No Scheduled Jobs
        </div>
        <div className="empty-message">
          There are no upcoming scheduled maintenance tasks.
        </div>
      </div>
    ) : (
    <>
      <div className="scheduled-jobs-list">
       {dashboardScheduledJobs.map((job) => {
        const locationLabel =

    job.location ||

    (job.room_number ? `Room ${job.room_number}` : null) ||

    (job.jobType === 'other' ? 'Other Job' : null)
          const nextDate = job.nextRunAt
            ? new Date(job.nextRunAt)
            : null

          const today = new Date()
          today.setHours(0, 0, 0, 0)

          const dueDate = nextDate
            ? new Date(nextDate)
            : null

          if (dueDate) {
            dueDate.setHours(0, 0, 0, 0)
          }

          const isDue =
            dueDate &&
            dueDate.getTime() === today.getTime()

          const isOverdue =
            dueDate &&
            dueDate.getTime() < today.getTime()

          return (
            <div
              key={job.id}
              className="scheduled-job-card"
              onClick={() => onViewScheduledJob(job)}
              style={{ cursor: 'pointer' }}
            >
              <div className="job-header">
                <div className="job-title">
                  {job.title}
                </div>

                <span
                  className={`job-status-badge ${
                    isOverdue
                      ? 'urgent'
                      : isDue
                      ? 'todo'
                      : 'done'
                  }`}
                >
                  {isOverdue
                    ? 'Overdue'
                    : isDue
                    ? 'Due Today'
                    : 'Upcoming'}
                </span>
              </div>

              <div className="detail-description">
                {job.description}
              </div>
<div className="scheduled-job-meta">
  <div>
    🗓️
    <span>
      Due:{' '}
      <strong>
        {nextDate
          ? nextDate.toLocaleDateString()
          : 'Not set'}
      </strong>
    </span>
  </div>

  <div>
    🔁
    <span>
      Every {job.frequencyInterval}{' '}
      {job.frequencyUnit}
      {Number(job.frequencyInterval) > 1 ? 's' : ''}
    </span>
  </div>

  {locationLabel && (
    <div>
      📍
      <span>{locationLabel}</span>
    </div>
  )}
</div>
            </div>
          )
        })}
      </div>

      {activeScheduledJobs.length > 1 && (
  <button
    className="view-all-scheduled-btn"
    onClick={onViewAllScheduledJobs}
  >
    View All Scheduled Jobs ({activeScheduledJobs.length})
  </button>
)}

    </>
    )}
  </div>
)}
        <div className="dashboard-grid">
          <div
            className="category-card urgent"
            onClick={() => onViewCategory('Urgent')}
          >
            <div className="category-header">
              <div className="category-title">
                <div className="category-icon">🔥</div>
                Urgent Jobs
              </div>
            </div>
            <div className="category-count">{urgentCount}</div>
            <div className="category-subtitle">
              Requires immediate attention
            </div>
          </div>

          <div
            className="category-card todo"
            onClick={() => onViewCategory('To Do')}
          >
            <div className="category-header">
              <div className="category-title">
                <div className="category-icon">📋</div>
                To Do Jobs
              </div>
            </div>
            <div className="category-count">{todoCount}</div>
            <div className="category-subtitle">
              Scheduled maintenance tasks
            </div>
          </div>

          <div
            className="category-card done"
            onClick={() => onViewCategory('Done')}
          >
            <div className="category-header">
              <div className="category-title">
                <div className="category-icon">✅</div>
                Done Jobs
              </div>
            </div>
            <div className="category-count">{doneCount}</div>
            <div className="category-subtitle">Completed tasks</div>
          </div>
          {role === 'manager' && (
  <div
    className="category-card recurring"
    onClick={onViewRecurringJobs}
  >
    <div className="category-header">
      <div className="category-title">
        <div className="category-icon">🔁</div>
        Recurring Jobs
      </div>
    </div>

    <div className="category-count">
      {(recurringJobs || []).filter((job) => job.active).length}
    </div>

    <div className="category-subtitle">
      Scheduled recurring maintenance
    </div>
  </div>
)}
        </div>
      </div>

      {(role === 'manager' || role === 'handyman') && (
        <button className="add-job-button" onClick={onAddJob}>
          +
        </button>
      )}
    </>
  )
}

function UrgentJobsList({ 
  jobs, 
  onBack, 
  onViewJob,
  isSelectionMode = false,
  selectedJobs = [],
  onToggleSelection,
  onToggleMode,
  onSelectAll,
  onDeleteSelected,
  isDeleting
}) {
  return (
    <>
      <div className="app-header">
        <button className="back-button" onClick={onBack}>
          ← Back
        </button>
        <h1 className="app-title" onClick={onBack}>
          HotelKeep
        </h1>
      </div>

      <div className="urgent-list fade-in">
        {/* Selection Toolbar */}
        {jobs.length > 0 && (
          <div className="selection-toolbar">
            <button 
              className="btn-secondary" 
              onClick={onToggleMode}
              disabled={isDeleting}
            >
              {isSelectionMode ? '✕ Cancel Selection' : '☑ Select Jobs'}
            </button>
            
            {isSelectionMode && (
              <>
                <button 
                  className="btn-secondary" 
                  onClick={() => onSelectAll(jobs)}
                >
                  Select All ({jobs?.length || 0})
                </button>
                
                {(selectedJobs?.length || 0) > 0 && (
                  <button 
                    className={isDeleting ? "btn-danger loading" : "btn-danger"}
                    onClick={onDeleteSelected}
                    disabled={isDeleting}
                  >
                    {isDeleting ? 'Deleting...' : `🗑 Delete ${selectedJobs?.length || 0}`}
                  </button>
                )}
              </>
            )}
          </div>
        )}

        {jobs.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🎉</div>
            <div className="empty-title">All Clear!</div>
            <div className="empty-message">
              No urgent jobs at the moment. Everything is under control.
            </div>
          </div>
        ) : (
          <div className="urgent-jobs">
            {jobs.map((job) => {
              const photoSrc = job.photoUrl || job.photo
              return (
                <div
                  key={job.id}
                  className={`urgent-job-card ${selectedJobs?.includes(job.id) ? 'selected' : ''}`}
                  onClick={() => {
                    if (isSelectionMode) {
                      onToggleSelection(job.id)
                    } else {
                      onViewJob(job)
                    }
                  }}
                >
                  {isSelectionMode && (
                    <input
                      type="checkbox"
                      checked={selectedJobs?.includes(job.id)}
                      onChange={() => onToggleSelection(job.id)}
                      onClick={(e) => e.stopPropagation()}
                      className="job-checkbox"
                    />
                  )}
                  <div className="job-header">
                    <div className="job-title">{job.title}</div>
                    <span className="job-status-badge urgent">Urgent</span>
                  </div>
                  <div className="room-number">
                    Room {job.room?.room_number}
                  </div>
                  <div className="detail-description">{job.description}</div>
                  <div className="job-meta">
                    <span>
                      📅 {new Date(job.created_at).toLocaleDateString()}
                    </span>
                    {photoSrc && (
                      <span className="job-photo-indicator">📷 Photo</span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}

function FloorList({ category, jobs, rooms, onBack, onViewFloor }) {
  const floors = [
    'Basement',
    'Ground Floor',
    'First Floor',
    'Second Floor',
    'Third Floor',
    'Fourth Floor',
  ]

  const getFloorJobCount = (floor) => {
    const floorRooms = rooms.filter((r) => r.floor === floor)
    const roomIds = floorRooms.map((r) => r.id)
    if (category === 'To Do') {
      return jobs.filter(
        (j) =>
          (j.status === 'To Do' || j.status === 'Urgent') &&
          roomIds.includes(j.room_id),
      ).length
    }
    return jobs.filter(
      (j) => j.status === category && roomIds.includes(j.room_id),
    ).length
  }

  const getOtherJobsCount = () => {
    if (category === 'To Do') {
      return jobs.filter((j) => j.status === 'Other').length
    } else if (category === 'Done') {
      return jobs.filter(
        (j) => j.status === 'Done' && j.original_status === 'Other',
      ).length
    }
    return 0
  }

  const getTotalJobCount = () => {
    return (
      getOtherJobsCount() +
      floors.reduce((sum, floor) => sum + getFloorJobCount(floor), 0)
    )
  }

  return (
    <>
      <div className="app-header">
        <button className="back-button" onClick={onBack}>
          ← Back
        </button>
        <h1 className="app-title" onClick={onBack}>
          HotelKeep
        </h1>
      </div>

      <div className="floor-list fade-in">
        {getTotalJobCount() === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              {category === 'To Do'
                ? '✅'
                : category === 'Done'
                ? '🎉'
                : '📋'}
            </div>
            <div className="empty-title">
              {category === 'To Do'
                ? 'No Pending Jobs'
                : category === 'Done'
                ? 'No Completed Jobs Yet'
                : `No ${category} Jobs`}
            </div>
            <div className="empty-message">
              {category === 'To Do'
                ? 'Great! All caught up. Use the + button to add new maintenance tasks.'
                : category === 'Done'
                ? 'No jobs have been completed yet. Completed jobs will appear here.'
                : `There are currently no ${category.toLowerCase()} jobs.`}
            </div>
          </div>
        ) : (
          <>
            {getOtherJobsCount() > 0 && (
              <div
                className="floor-section"
                onClick={() => onViewFloor('Other')}
              >
                <div className="floor-header" style={{ cursor: 'pointer' }}>
                  <div className="floor-title">
                    🔧 Other Jobs
                    <span className="floor-count">
                      ({getOtherJobsCount()}{' '}
                      {getOtherJobsCount() === 1 ? 'job' : 'jobs'})
                    </span>
                  </div>
                </div>
              </div>
            )}

            {floors.map((floor) => {
              const jobCount = getFloorJobCount(floor)
              if (jobCount === 0) return null
              return (
                <div
                  key={floor}
                  className="floor-section"
                  onClick={() => onViewFloor(floor)}
                >
                  <div className="floor-header" style={{ cursor: 'pointer' }}>
                    <div className="floor-title">
                      🏢 {floor}
                      <span className="floor-count">
                        ({jobCount} {jobCount === 1 ? 'job' : 'jobs'})
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </>
        )}
      </div>
    </>
  )
}

function RoomList({
  floor,
  category,
  jobs,
  rooms,
  onBack,
  onViewRoom,
  onViewJob,
  goToDashboard,
}) {
  if (floor === 'Other') {
    let otherJobs
    if (category === 'To Do') {
      otherJobs = jobs.filter((j) => j.status === 'Other')
    } else if (category === 'Done') {
      otherJobs = jobs.filter(
        (j) => j.status === 'Done' && j.original_status === 'Other',
      )
    } else {
      otherJobs = []
    }

    return (
      <>
        <div className="app-header">
          <button className="back-button" onClick={onBack}>
            ← Back
          </button>
          <h1 className="app-title" onClick={goToDashboard}>
            HotelKeep
          </h1>
        </div>

        <div className="urgent-list fade-in">
          {otherJobs.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <div className="empty-title">No Other Jobs</div>
              <div className="empty-message">
                No{' '}
                {category === 'Done' ? 'completed' : 'pending'} non-room
                maintenance tasks
              </div>
            </div>
          ) : (
            <div className="urgent-jobs">
              {otherJobs.map((job) => {
                const photoSrc = job.photoUrl || job.photo
                return (
                  <div
                    key={job.id}
                    className="urgent-job-card"
                    onClick={() => onViewJob(job)}
                    style={{
                      borderLeftColor:
                        job.status === 'Done' ? 'var(--done)' : 'var(--other)',
                    }}
                  >
                    <div className="job-header">
                      <div className="job-title">{job.title}</div>
                      <span
                        className={`job-job-status-badge ${job.status
                          .toLowerCase()
                          .replace(' ', '')}`}
                      >
                        {job.status}
                      </span>
                    </div>
                    <div className="detail-description">
                      {job.description}
                    </div>
                    <div className="job-meta">
                      <span>
                        📅 {new Date(job.created_at).toLocaleDateString()}
                      </span>
                      {photoSrc && (
                        <span className="job-photo-indicator">
                          📷 Photo
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </>
    )
  }

  const floorRooms = rooms.filter((r) => r.floor === floor)

  const getRoomJobCount = (roomId) => {
    if (category === 'To Do') {
      return jobs.filter(
        (j) =>
          (j.status === 'To Do' || j.status === 'Urgent') &&
          j.room_id === roomId,
      ).length
    }
    if (category === 'Done') {
      return jobs.filter(
        (j) =>
          j.status === 'Done' &&
          j.original_status !== 'Other' &&
          j.room_id === roomId,
      ).length
    }
    return jobs.filter(
      (j) => j.status === category && j.room_id === roomId,
    ).length
  }

  const roomsWithJobs = floorRooms.filter(
    (room) => getRoomJobCount(room.id) > 0,
  )

  return (
    <>
      <div className="app-header">
        <button className="back-button" onClick={onBack}>
          ← Back
        </button>
        <h1 className="app-title" onClick={goToDashboard}>
          HotelKeep
        </h1>
      </div>

      <div className="floor-list fade-in">
        {roomsWithJobs.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🏢</div>
            <div className="empty-title">No Jobs on {floor}</div>
            <div className="empty-message">
              {category === 'To Do'
                ? `All rooms on ${floor} are in good condition. No pending maintenance tasks.`
                : category === 'Done'
                ? `No completed jobs on ${floor} yet.`
                : `There are no ${category.toLowerCase()} jobs on this floor.`}
            </div>
          </div>
        ) : (
          <div className="room-list">
            {roomsWithJobs.map((room) => {
              const jobCount = getRoomJobCount(room.id)

              return (
                <div
                  key={room.id}
                  className="room-card"
                  onClick={() => onViewRoom(room)}
                >
                  <div className="room-header">
                    <div className="room-number">
                      Room {room.room_number}
                    </div>
                    <span className="job-count-badge">
                      {jobCount} {jobCount === 1 ? 'job' : 'jobs'}
                    </span>
                  </div>
                  <div className="room-notes">{room.notes}</div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}

function JobList({ 
  room, 
  category, 
  jobs, 
  onBack, 
  onViewJob, 
  goToDashboard,
  isSelectionMode = false,
  selectedJobs = [],
  onToggleSelection,
  onToggleMode,
  onSelectAll,
  onDeleteSelected,
  isDeleting
}) {
  // Guard against missing room (prevents white screen)
  if (!room) {
    return (
      <>
        <div className="app-header">
          <button className="back-button" onClick={onBack}>
            ← Back
          </button>
          <h1 className="app-title" onClick={goToDashboard}>
            HotelKeep
          </h1>
        </div>

        <div className="empty-state">
          <div className="empty-icon">🛏️</div>
          <div className="empty-title">No room selected</div>
          <div className="empty-message">
            Go back and pick a room again to view its jobs.
          </div>
        </div>
      </>
    )
  }

  let roomJobs
  if (category === 'To Do') {
    roomJobs = jobs.filter(
      (j) =>
        j.room_id === room.id &&
        (j.status === 'To Do' || j.status === 'Urgent'),
    )
  } else if (category === 'Done') {
    roomJobs = jobs.filter(
      (j) =>
        j.room_id === room.id &&
        j.status === 'Done' &&
        j.original_status !== 'Other',
    )
  } else {
    roomJobs = jobs.filter(
      (j) => j.room_id === room.id && j.status === category,
    )
  }

  return (
    <>
      <div className="app-header">
        <button className="back-button" onClick={onBack}>
          ← Back
        </button>
        <h1 className="app-title" onClick={goToDashboard}>
          HotelKeep
        </h1>
      </div>

      <div className="floor-list fade-in">
        {/* Selection Toolbar */}
        {roomJobs.length > 0 && (
          <div className="selection-toolbar">
            <button 
              className="btn-secondary" 
              onClick={onToggleMode}
              disabled={isDeleting}
            >
              {isSelectionMode 
                ? '✕ Cancel Selection' 
                : '☑ Select Jobs'}
            </button>

            {isSelectionMode && (
              <>
                <button 
                  className="btn-secondary" 
                  onClick={() => onSelectAll(roomJobs)}
                  disabled={isDeleting}
                >
                  Select All ({roomJobs?.length || 0})
                </button>

                {(selectedJobs?.length || 0) > 0 && (
                  <button 
                    className={isDeleting ? 'btn-danger loading' : 'btn-danger'}
                    onClick={onDeleteSelected}
                    disabled={isDeleting}
                  >
                    {isDeleting 
                      ? 'Deleting...' 
                      : `🗑 Delete ${selectedJobs?.length || 0}`}
                  </button>
                )}
              </>
            )}
          </div>
        )}
        {roomJobs.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">✅</div>
            <div className="empty-title">
              No Jobs for Room {room.room_number}
            </div>
            <div className="empty-message">
              {category === 'To Do'
                ? 'This room has no pending maintenance tasks.'
                : category === 'Done'
                ? 'No completed jobs for this room yet.'
                : `No ${category.toLowerCase()} jobs for this room.`}
            </div>
          </div>
        ) : (
          <div className="job-list">
            {roomJobs.map((job) => {
              const photoSrc = job.photoUrl || job.photo
              return (
                <div
                  key={job.id}
                  className={`job-card ${selectedJobs?.includes(job.id) ? "selected" : ""}`}
                  onClick={() => {
                    if (isSelectionMode) {
                      onToggleSelection(job.id)
                    } else {
                      onViewJob(job)
                    }
                  }}
                >
                  {isSelectionMode && (
                    <input
                      type="checkbox"
                      checked={selectedJobs?.includes(job.id)}
                      onChange={() => onToggleSelection(job.id)}
                      onClick={(e) => e.stopPropagation()}
                      className="job-checkbox"
                    />
                  )}
                  <div className="job-header">
                    <div className="job-title">{job.title}</div>
                    <span
                      className={`job-job-status-badge ${job.status
                        .toLowerCase()
                        .replace(' ', '')}`}
                    >
                      {job.status}
                    </span>
                  </div>
                  <div className="detail-description">
                    {job.description}
                  </div>
                  <div className="job-meta">
                    <span>
                      📅 {new Date(job.created_at).toLocaleDateString()}
                    </span>
                    {photoSrc && (
                      <span className="job-photo-indicator">📷 Photo</span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}

function JobDetail({
  job,
  room,
  role,
  notifications,
  onBack,
  onUpdateJob,
  onDeleteJob,
  onEditJob,
  onEnlargePhoto,
  goToDashboard,
  isDeleting, 
}) {
  const fileInputRef = useRef(null)
  const cameraInputRef = useRef(null)

  const handleMarkAsDone = () => {
    onUpdateJob(job.id, { status: 'Done' })
  }

  const handleReopenAsOriginal = () => {
    const originalStatus = job.original_status || 'To Do'
    onUpdateJob(job.id, { status: originalStatus })
  }

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      onDeleteJob(job.id)
    }
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        onUpdateJob(job.id, { photo: event.target.result })
      }
      reader.readAsDataURL(file)
    }
  }

  // SAFER: handle missing status gracefully
  const statusClass = job.status
    ? job.status.toLowerCase().replace(' ', '')
    : 'unknown'

  const photoSrc = job.photoUrl || job.photo

  const jobHistory = (notifications || [])
  .filter(
    (item) => item.relatedJobId === job.id
  )
  .sort((a, b) => {
    const getTime = (value) => {
      if (!value) return 0

      if (value.toDate) {
        return value.toDate().getTime()
      }

      const date = new Date(value)

      return Number.isNaN(date.getTime())
        ? 0
        : date.getTime()
    }

    return (
      getTime(b.actionAt || b.created_at) -
      getTime(a.actionAt || a.created_at)
    )
  })

  return (
    <>
      <div className="app-header">
        <button className="back-button" onClick={onBack}>
          ← Back
        </button>
        <h1 className="app-title" onClick={goToDashboard}>
          HotelKeep
        </h1>
      </div>

      <div className="job-detail fade-in">
        <div className="detail-card">
          <div className="detail-header">
            <div className="detail-title">{job.title}</div>
            <span className={`job-job-status-badge ${statusClass}`}>
              {job.status || 'Unknown'}
            </span>
          </div>

          <div className="detail-room">
            Room {room?.room_number} - {room?.notes}
          </div>

          <div className="detail-description">{job.description}</div>

          {photoSrc && (
            <img
              src={photoSrc}
              alt="Job photo"
              className="detail-photo"
              onClick={() => onEnlargePhoto(photoSrc)}
            />
          )}

          <div className="photo-upload-section">
            <label className="photo-upload-label">
              {photoSrc ? 'Update Photo' : 'Add Photo'}
            </label>
            <div className="photo-upload-buttons">
              <button
                className="photo-upload-btn"
                onClick={() => fileInputRef.current?.click()}
                type="button"
              >
                📁 Upload Photo
              </button>
              <button
                className="photo-upload-btn"
                onClick={() => cameraInputRef.current?.click()}
                type="button"
              >
                📷 Take Photo
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden-file-input"
              onChange={handleFileUpload}
            />
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden-file-input"
              onChange={handleFileUpload}
            />
          </div>

          <div className="detail-meta">
            <div>📅 Created: {new Date(job.created_at).toLocaleString()}</div>
            <div>🔄 Updated: {new Date(job.updated_at).toLocaleString()}</div>
          </div>
        </div>

        <div className="detail-actions">
          <button className="edit-button" onClick={onEditJob}>
            ✏️ Edit Job
          </button>

          {job.status !== 'Done' && (
            <button className="action-btn primary" onClick={handleMarkAsDone}>
              ✓ Mark as Done
            </button>
          )}

          {job.status === 'Done' && role === 'manager' && (
            <button
              className="action-btn secondary"
              onClick={handleReopenAsOriginal}
            >
              ↺ Reopen as {job.original_status || 'To Do'}
            </button>
          )}

          {role === 'manager' && (
            <button
              className={isDeleting ? 'action-btn danger loading' : 'action-btn danger'}
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting…' : '🗑 Delete Job'}
            </button>
          )}
        </div>
        
        {jobHistory.length > 0 && (
  <div className="activity-history-section">
    <h3>📋 Activity History</h3>

    {jobHistory.map((item) => {
      const activityDate =
        item.actionAt ||
        (item.created_at?.toDate
          ? item.created_at.toDate()
          : item.created_at)

      let activityIcon = '🔔'
      let activityLabel = item.title || 'Job Updated'

      if (
        item.result === 'completed' ||
        item.type === 'job_completed'
      ) {
        activityIcon = '✅'
        activityLabel = 'Completed'
      } else if (
        item.result === 'reopened' ||
        item.type === 'job_reopened'
      ) {
        activityIcon = '↺'
        activityLabel = 'Reopened'
      } else if (
        item.type === 'job_status_changed'
      ) {
        activityIcon = '🔄'
        activityLabel = 'Status Changed'
      } else if (
        item.type === 'job_updated'
      ) {
        activityIcon = '✏️'
        activityLabel = 'Job Updated'
      }

      return (
        <div
          key={item.id}
          className="activity-history-item"
        >
          <div>
            <strong>
              {activityIcon} {activityLabel}
            </strong>
          </div>

          {activityDate && (
            <div>
              🕒{' '}
              {new Date(
                activityDate
              ).toLocaleString()}
            </div>
          )}

          {item.location && (
            <div>
              📍 {item.location}
            </div>
          )}
        </div>
      )
    })}
  </div>
)}
      </div>
    </>
  )
}

function AddJobForm({ rooms, onBack, onSubmit, goToDashboard, isCreating }) {
  const [formData, setFormData] = useState({
    room_id: '',
    room_number: '',
    title: '',
    description: '',
    jobType: 'room',
    priority: 'To Do',
    status: 'To Do',
    photo: null,
  })

  const fileInputRef = useRef(null)
  const cameraInputRef = useRef(null)
  const [detectedFloor, setDetectedFloor] = useState('')

  const detectFloor = (roomNum) => {
    if (!roomNum) return ''

    const num = roomNum.toLowerCase().trim()

    if (['51', '52', '53', '54'].includes(num)) return 'Basement'
    if (['1', '2', '3', '4', '5', '6', '7'].includes(num))
      return 'Ground Floor'
    if (['8', '2b', '11', '12', '13', '14', '15', '16'].includes(num))
      return 'First Floor'
    if (['9', '5b', '21', '22', '23', '24', '25', '26'].includes(num))
      return 'Second Floor'
    if (['31', '32', '33', '34', '35', '36'].includes(num))
      return 'Third Floor'
    if (['41', '42', '43', '44', '45', '46'].includes(num))
      return 'Fourth Floor'

    return ''
  }

  const handleRoomNumberChange = (value) => {
    const floor = detectFloor(value)
    setDetectedFloor(floor)

    const matchingRoom = rooms.find(
      (r) =>
        r.room_number.toLowerCase() === value.toLowerCase().trim(),
    )

    setFormData({
      ...formData,
      room_number: value,
      room_id: matchingRoom ? matchingRoom.id : '',
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.title || !formData.description) {
      window.alert('Please fill in all required fields')
      return
    }

    if (formData.jobType === 'room') {
      if (!formData.room_number) {
        window.alert('Please enter a room number')
        return
      }

      const matchingRoom = rooms.find(
        (r) =>
          r.room_number.toLowerCase() ===
          formData.room_number.toLowerCase().trim(),
      )

      if (!matchingRoom) {
        window.alert(
          `Room "${formData.room_number}" not found. Please enter a valid room number.`,
        )
        return
      }

      formData.room_id = matchingRoom.id
    }

    const finalStatus =
      formData.jobType === 'other' ? 'Other' : formData.priority

    onSubmit({
      ...formData,
      status: finalStatus,
    })
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setFormData({ ...formData, photo: event.target.result })
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <>
      <div className="app-header">
        <button className="back-button" onClick={onBack}>
          ← Cancel
        </button>
        <h1 className="app-title" onClick={goToDashboard}>
          HotelKeep
        </h1>
      </div>

      <div className="form-container fade-in">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Job Type *</label>
            <select
              className="form-select"
              value={formData.jobType}
              onChange={(e) =>
                setFormData({ ...formData, jobType: e.target.value })
              }
              required
            >
              <option value="room">Room-based Job</option>
              <option value="other">Other (Non-room task)</option>
            </select>
          </div>

          {formData.jobType === 'other' && (
            <div className="form-group">
              <label className="form-label">Priority *</label>
              <select
                className="form-select"
                value={formData.priority}
                onChange={(e) =>
                  setFormData({ ...formData, priority: e.target.value })
                }
                required
              >
                <option value="To Do">To Do</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>
          )}

          {formData.jobType === 'room' && (
            <>
              <div className="form-group">
                <label className="form-label">Priority *</label>
                <select
                  className="form-select"
                  value={formData.priority}
                  onChange={(e) =>
                    setFormData({ ...formData, priority: e.target.value })
                  }
                  required
                >
                  <option value="To Do">To Do</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Room Number *</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.room_number}
                  onChange={(e) =>
                    handleRoomNumberChange(e.target.value)
                  }
                  placeholder="e.g., 1, 2b, 21, 51"
                  required
                />
                <div className="room-input-helper">
                  {detectedFloor ? (
                    <span>
                      ✓ <strong>{detectedFloor}</strong> - Room{' '}
                      {formData.room_number}
                    </span>
                  ) : formData.room_number ? (
                    <span>
                      ⚠️ Room not found. Please check the room number.
                    </span>
                  ) : (
                    <span>
                      <strong>Available rooms:</strong> Basement (51-54),
                      Ground (1-7), First (8, 2b, 11-16), Second (9, 5b,
                      21-26), Third (31-36), Fourth (41-46)
                    </span>
                  )}
                </div>
              </div>
            </>
          )}

          <div className="form-group">
            <label className="form-label">Title *</label>
            <input
              type="text"
              className="form-input"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="e.g., Broken window handle"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description *</label>
            <textarea
              className="form-textarea"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Provide detailed description of the issue..."
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Photo (Optional)</label>
            {formData.photo && (
              <img
                src={formData.photo}
                alt="Job photo"
                className="detail-photo"
              />
            )}
            <div className="photo-upload-buttons">
              <button
                type="button"
                className="photo-upload-btn"
                onClick={() => fileInputRef.current?.click()}
              >
                📁 Upload Photo
              </button>
              <button
                type="button"
                className="photo-upload-btn"
                onClick={() => cameraInputRef.current?.click()}
              >
                📷 Take Photo
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden-file-input"
              onChange={handleFileUpload}
            />
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden-file-input"
              onChange={handleFileUpload}
            />
          </div>

          <button type="submit" className={isCreating ? "form-submit loading" : "form-submit"} disabled={isCreating}>
            {isCreating ? "Creating..." : "Create Job"}
          </button>
        </form>
      </div>
    </>
  )
}

function EditJobForm({ job, rooms, onBack, onSubmit, goToDashboard, isUpdating }) {
  const currentRoom = rooms.find((r) => r.id === job.room_id)

  const getInitialJobType = () => {
    if (
      job.status === 'Other' ||
      (job.status === 'Done' && job.original_status === 'Other')
    ) {
      return 'other'
    }
    return 'room'
  }

  const getInitialPriority = () => {
    if (job.status === 'Done') return job.original_status || 'To Do'
    if (job.status === 'Other') return 'To Do'
    return job.status
  }

  const [formData, setFormData] = useState({
    room_id: job.room_id || '',
    room_number: currentRoom ? currentRoom.room_number : '',
    title: job.title,
    description: job.description,
    jobType: getInitialJobType(),
    priority: getInitialPriority(),
    status: job.status,
  })
  const [newPhoto, setNewPhoto] = useState(null) // Track NEW photo separately

  const fileInputRef = useRef(null)
  const cameraInputRef = useRef(null)
  const [detectedFloor, setDetectedFloor] = useState(
    currentRoom ? currentRoom.floor : '',
  )

  const detectFloor = (roomNum) => {
    if (!roomNum) return ''

    const num = roomNum.toLowerCase().trim()

    if (['51', '52', '53', '54'].includes(num)) return 'Basement'
    if (['1', '2', '3', '4', '5', '6', '7'].includes(num))
      return 'Ground Floor'
    if (['8', '2b', '11', '12', '13', '14', '15', '16'].includes(num))
      return 'First Floor'
    if (['9', '5b', '21', '22', '23', '24', '25', '26'].includes(num))
      return 'Second Floor'
    if (['31', '32', '33', '34', '35', '36'].includes(num))
      return 'Third Floor'
    if (['41', '42', '43', '44', '45', '46'].includes(num))
      return 'Fourth Floor'

    return ''
  }

  const handleRoomNumberChange = (value) => {
    const floor = detectFloor(value)
    setDetectedFloor(floor)

    const matchingRoom = rooms.find(
      (r) =>
        r.room_number.toLowerCase() === value.toLowerCase().trim(),
    )

    setFormData({
      ...formData,
      room_number: value,
      room_id: matchingRoom ? matchingRoom.id : '',
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.title || !formData.description) {
      window.alert('Please fill in all required fields')
      return
    }

    if (formData.jobType === 'room' && formData.status !== 'Done') {
      if (!formData.room_number) {
        window.alert('Please enter a room number')
        return
      }

      const matchingRoom = rooms.find(
        (r) =>
          r.room_number.toLowerCase() ===
          formData.room_number.toLowerCase().trim(),
      )

      if (!matchingRoom) {
        window.alert(
          `Room "${formData.room_number}" not found. Please enter a valid room number.`,
        )
        return
      }

      formData.room_id = matchingRoom.id
    }

    let finalStatus
    if (formData.status === 'Done') {
      finalStatus = 'Done'
    } else {
      finalStatus =
        formData.jobType === 'other' ? 'Other' : formData.priority
    }

    const updates = {
      ...formData,
      status: finalStatus,
    }
    
    // Only include photo if a new one was uploaded
    if (newPhoto) {
      updates.photo = newPhoto
    }
    
    onSubmit(job.id, updates)
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setNewPhoto(event.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <>
      <div className="app-header">
        <button className="back-button" onClick={onBack}>
          ← Cancel
        </button>
        <h1 className="app-title" onClick={goToDashboard}>
          HotelKeep
        </h1>
      </div>

      <div className="form-container fade-in">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Mark as Done?</label>
            <select
              className="form-select"
              value={formData.status === 'Done' ? 'Done' : 'Active'}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  status: e.target.value === 'Done' ? 'Done' : 'Active',
                })
              }
              required
            >
              <option value="Active">Active (Not Done)</option>
              <option value="Done">Done (Completed)</option>
            </select>
          </div>

          {formData.status !== 'Done' && (
            <>
              <div className="form-group">
                <label className="form-label">Job Type *</label>
                <select
                  className="form-select"
                  value={formData.jobType}
                  onChange={(e) =>
                    setFormData({ ...formData, jobType: e.target.value })
                  }
                  required
                >
                  <option value="room">Room-based Job</option>
                  <option value="other">Other (Non-room task)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Priority *</label>
                <select
                  className="form-select"
                  value={formData.priority}
                  onChange={(e) =>
                    setFormData({ ...formData, priority: e.target.value })
                  }
                  required
                >
                  <option value="To Do">To Do</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </div>

              {formData.jobType === 'room' && (
                <div className="form-group">
                  <label className="form-label">Room Number *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.room_number}
                    onChange={(e) =>
                      handleRoomNumberChange(e.target.value)
                    }
                    placeholder="e.g., 1, 2b, 21, 51"
                    required
                  />
                  <div className="room-input-helper">
                    {detectedFloor ? (
                      <span>
                        ✓ <strong>{detectedFloor}</strong> - Room{' '}
                        {formData.room_number}
                      </span>
                    ) : formData.room_number ? (
                      <span>
                        ⚠️ Room not found. Please check the room number.
                      </span>
                    ) : (
                      <span>
                        <strong>Available rooms:</strong> Basement (51-54),
                        Ground (1-7), First (8, 2b, 11-16), Second (9, 5b,
                        21-26), Third (31-36), Fourth (41-46)
                      </span>
                    )}
                  </div>
                </div>
              )}
            </>
          )}

          <div className="form-group">
            <label className="form-label">Title *</label>
            <input
              type="text"
              className="form-input"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="e.g., Broken window handle"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description *</label>
            <textarea
              className="form-textarea"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Provide detailed description of the issue..."
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Photo (Optional)</label>
            {(newPhoto || job.photoUrl || job.photo) && (
              <img
                src={newPhoto || job.photoUrl || job.photo}
                alt="Job photo"
                className="detail-photo"
              />
            )}
            <div className="photo-upload-buttons">
              <button
                type="button"
                className="photo-upload-btn"
                onClick={() => fileInputRef.current?.click()}
              >
                📁 Upload Photo
              </button>
              <button
                type="button"
                className="photo-upload-btn"
                onClick={() => cameraInputRef.current?.click()}
              >
                📷 Take Photo
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden-file-input"
              onChange={handleFileUpload}
            />
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden-file-input"
              onChange={handleFileUpload}
            />
          </div>

          <button type="submit" className={isUpdating ? "form-submit loading" : "form-submit"} disabled={isUpdating}>
            {isUpdating ? "Updating..." : "Update Job"}
          </button>
        </form>
      </div>
    </>
  )
}

function CompletedJobsList({
  jobs,
  rooms,
  sortOrder,
  selectedRoomFilter,
  onChangeSortOrder,
  onChangeRoomFilter,
  onBack,
  onViewJob,
  goToDashboard,
}) {
  const completedJobs = jobs
    .filter((job) => job.status === 'Done')
    .filter((job) => {
      if (selectedRoomFilter === 'all') return true
      return String(job.room_id) === String(selectedRoomFilter)
    })
    .map((job) => ({
      ...job,
      room: rooms.find((r) => r.id === job.room_id) || null,
    }))
    .sort((a, b) => {
      const aTime = new Date(a.updated_at || a.created_at || 0).getTime()
      const bTime = new Date(b.updated_at || b.created_at || 0).getTime()

      return sortOrder === 'oldest' ? aTime - bTime : bTime - aTime
    })

  const roomOptions = rooms
    .filter((room) => jobs.some((job) => job.status === 'Done' && job.room_id === room.id))
    .sort((a, b) =>
      String(a.room_number).localeCompare(String(b.room_number), undefined, {
        numeric: true,
      }),
    )

  return (
    <>
      <div className="app-header">
        <button className="back-button" onClick={onBack}>
          ← Back
        </button>
        <h1 className="app-title" onClick={goToDashboard}>
          HotelKeep
        </h1>
        <div />
      </div>

      <div className="job-list fade-in">
        <div className="form-group">
          <label className="form-label">Sort by time</label>
          <select
            className="form-select"
            value={sortOrder}
            onChange={(e) => onChangeSortOrder(e.target.value)}
          >
            <option value="recent">Most recent first</option>
            <option value="oldest">Oldest first</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Filter by room</label>
          <select
            className="form-select"
            value={selectedRoomFilter}
            onChange={(e) => onChangeRoomFilter(e.target.value)}
          >
            <option value="all">All rooms</option>
            {roomOptions.map((room) => (
              <option key={room.id} value={room.id}>
                Room {room.room_number}
              </option>
            ))}
          </select>
        </div>

        {completedJobs.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">✅</div>
            <div className="empty-title">No completed jobs found</div>
            <div className="empty-message">
              There are no completed jobs for the selected filters.
            </div>
          </div>
        ) : (
          <div className="job-grid">
            {completedJobs.map((job) => {
              const photoSrc = job.photoUrl || job.photo

              return (
                <div
                  key={job.id}
                  className="job-card"
                  onClick={() => onViewJob(job)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="job-header">
                    <div className="job-title">{job.title}</div>
                    <span className="job-status-badge done">Done</span>
                  </div>

                  <div className="detail-description">{job.description}</div>

                  <div className="job-meta">
                    <span>
                      {job.room ? `Room ${job.room.room_number}` : 'No room'}
                    </span>
                    <span>
                      {job.updated_at
                        ? new Date(job.updated_at).toLocaleString()
                        : 'No time'}
                    </span>
                    {photoSrc && (
                      <span className="job-photo-indicator">📷 Photo</span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}

function RecurringJobsList({
  recurringJobs,
  rooms,
  onBack,
  onEdit,
  onAdd,
  onUpdate,
  onDelete,
}) {
  const getRoom = (roomId) => {
    return rooms.find((room) => room.id === roomId)
  }

  const formatFrequency = (job) => {
    const interval = Number(job.frequencyInterval || 1)
    const unit = job.frequencyUnit || 'month'

    const unitLabel =
      interval === 1
        ? unit
        : `${unit}s`

    return `Every ${interval} ${unitLabel}`
  }

  const formatNextRun = (value) => {
    if (!value) return 'Not scheduled'

    const date = new Date(value)

    if (Number.isNaN(date.getTime())) {
      return 'Invalid date'
    }

    return date.toLocaleDateString()
  }

const handleToggleActive = async (job) => {
  try {
    const newActiveState = !job.active
    const now = new Date().toISOString()

    await onUpdate(job.id, {
      active: newActiveState,
    })

    await createNotification({
      hotelId: 'athena',

      type: newActiveState
        ? 'scheduled_resumed'
        : 'scheduled_paused',

      title: newActiveState
        ? 'Scheduled Job Resumed'
        : 'Scheduled Job Paused',

      message: job.title,

      relatedRecurringJobId: job.id,

      result: newActiveState
        ? 'resumed'
        : 'paused',

      actionAt: now,

      nextRunAt: job.nextRunAt || null,

      location: job.location || '',
    })
  } catch (error) {
    console.error(
      'Could not update recurring job:',
      error
    )

    window.alert(
      'Could not update recurring job.'
    )
  }
}

  const handleDelete = async (job) => {
    const confirmed = window.confirm(
      `Delete recurring job "${job.title}"?`
    )

    if (!confirmed) return

    try {
      await onDelete(job.id)
    } catch (error) {
      console.error('Could not delete recurring job:', error)
      window.alert('Could not delete recurring job.')
    }
  }

  return (
    <>
      <div className="app-header">
        <button className="back-button" onClick={onBack}>
          ← Back
        </button>

        <h1 className="app-title" onClick={onBack}>
          HotelKeep
        </h1>
      </div>

      <div className="job-list fade-in">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem',
            gap: '1rem',
          }}
        >
          <div>
            <h2 style={{ margin: 0 }}>Recurring Jobs</h2>
            <p style={{ marginTop: '0.4rem', color: '#64748b' }}>
              Manage recurring maintenance schedules
            </p>
          </div>

          <button
            className="form-submit"
            onClick={onAdd}
            style={{ width: 'auto' }}
          >
            + Add Recurring Job
          </button>
        </div>

        {recurringJobs.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔁</div>

            <div className="empty-title">
              No Recurring Jobs
            </div>

            <div className="empty-message">
              Add maintenance tasks with recurring due dates.
            </div>
          </div>
        ) : (
          <div className="job-grid">
            {recurringJobs.map((job) => {
              const room = getRoom(job.room_id)

            const locationLabel =
              job.location ||
              (room ? `Room ${room.room_number}` : null) ||
              (job.room_number ? `Room ${job.room_number}` : null) ||
              (job.jobType === 'other' ? 'Other Job' : null)

            const nextDate = job.nextRunAt
                ? new Date(job.nextRunAt)
                : null
              
              const today = new Date()
              today.setHours(0, 0, 0, 0)
              
              const dueDate = nextDate
                ? new Date(nextDate)
                : null
              
              if (dueDate) {
                dueDate.setHours(0, 0, 0, 0)
              }
              
              const isDue =
                job.active &&
                dueDate &&
                dueDate.getTime() === today.getTime()
              
              const isOverdue =
                job.active &&
                dueDate &&
                dueDate.getTime() < today.getTime()
              
              const scheduleStatus = !job.active
                ? 'Paused'
                : isOverdue
                ? 'Overdue'
                : isDue
                ? 'Due Today'
                : 'Upcoming'
              
              const scheduleStatusClass = !job.active
                ? 'done'
                : isOverdue
                ? 'urgent'
                : isDue
                ? 'todo'
                : 'done'

              return (
                <div
                  key={job.id}
                  className="job-card"
                >
                  <div className="job-header">
                    <div className="job-title">
                      {job.title}
                    </div>

                      <div
                        style={{
                          display: 'flex',
                          gap: '0.5rem',
                          flexWrap: 'wrap',
                        }}
                      >
                        <span
                          className={`job-status-badge ${
                            job.active ? 'todo' : 'done'
                          }`}
                        >
                          {job.active ? 'Active' : 'Paused'}
                        </span>
                      
                        {job.active && (
                          <span
                            className={`job-status-badge ${scheduleStatusClass}`}
                          >
                            {scheduleStatus}
                          </span>
                        )}
                      </div>
                  </div>

                  <div className="detail-description">
                    {job.description}
                  </div>

                  <div className="job-meta">
                    <span>
                      🔁 {formatFrequency(job)}
                    </span>

                    <span>
                      🗓️ Next: {formatNextRun(job.nextRunAt)}
                    </span>

                    {locationLabel && (
                      <span>
                        📍 {locationLabel}
                      </span>
                    )}
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      gap: '0.75rem',
                      marginTop: '1rem',
                      flexWrap: 'wrap',
                    }}
                  >
                    <button
                      className="btn-secondary"
                      onClick={() => handleToggleActive(job)}
                    >
                      {job.active ? '⏸ Pause' : '▶ Resume'}
                    </button>

                    <button
                  className="btn-secondary"
                  onClick={() => onEdit(job)}
                >
                  ✏️ Edit
                  </button>

                    <button
                      className="btn-danger"
                      onClick={() => handleDelete(job)}
                    >
                      🗑 Delete
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}

function AddRecurringJobForm({
  onBack,
  onSubmit,
}) {
  const today = new Date().toISOString().split('T')[0]

  const [formData, setFormData] = useState({
    title: '',

  description: '',

  location: '',

  frequencyUnit: 'month',

  frequencyInterval: 1,

  startDate: today,

  nextRunAt: today,

  active: true,
  })

  const handleScheduleChange = (value) => {
    const schedules = {
      weekly: {
        frequencyUnit: 'week',
        frequencyInterval: 1,
      },
      monthly: {
        frequencyUnit: 'month',
        frequencyInterval: 1,
      },
      quarterly: {
        frequencyUnit: 'month',
        frequencyInterval: 3,
      },
      sixMonths: {
        frequencyUnit: 'month',
        frequencyInterval: 6,
      },
      yearly: {
        frequencyUnit: 'month',
        frequencyInterval: 12,
      },
    }

    const selected = schedules[value]

    setFormData((prev) => ({
      ...prev,
      frequencyUnit: selected.frequencyUnit,
      frequencyInterval: selected.frequencyInterval,
    }))
  }

  const getScheduleValue = () => {
    if (
      formData.frequencyUnit === 'week' &&
      formData.frequencyInterval === 1
    ) {
      return 'weekly'
    }

    if (
      formData.frequencyUnit === 'month' &&
      formData.frequencyInterval === 1
    ) {
      return 'monthly'
    }

    if (formData.frequencyInterval === 3) {
      return 'quarterly'
    }

    if (formData.frequencyInterval === 6) {
      return 'sixMonths'
    }

    if (formData.frequencyInterval === 12) {
      return 'yearly'
    }

    return 'monthly'
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!formData.title.trim()) {
      window.alert('Please enter a job title.')
      return
    }

    if (!formData.description.trim()) {
      window.alert('Please enter a description.')
      return
    }

    if (!formData.startDate) {
      window.alert('Please select the first due date.')
      return
    }

   const finalData = {
        ...formData,
        location: formData.location.trim(),
        nextRunAt: formData.startDate,
      }

    onSubmit(finalData)
  }

  return (
    <>
      <div className="app-header">
        <button
          className="back-button"
          onClick={onBack}
        >
          ← Cancel
        </button>

        <h1
          className="app-title"
          onClick={onBack}
        >
          HotelKeep
        </h1>
      </div>

      <div className="form-container fade-in">
        <h2>Add Recurring Job</h2>

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label className="form-label">
              Title *
            </label>

            <input
              type="text"
              className="form-input"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  title: e.target.value,
                }))
              }
              placeholder="e.g. Test fire alarm"
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Description *
            </label>

            <textarea
              className="form-textarea"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Describe the maintenance task..."
            />
          </div>

          <div className="form-group">
              <label className="form-label">
                Location / Room (Optional)
              </label>
            
              <input
                type="text"
                className="form-input"
                value={formData.location}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    location: e.target.value,
                  }))
                }
                placeholder="e.g. Room 6, Basement, Kitchen, All Rooms"
              />
            </div>

          <div className="form-group">
            <label className="form-label">
              Repeat *
            </label>

            <select
              className="form-select"
              value={getScheduleValue()}
              onChange={(e) =>
                handleScheduleChange(e.target.value)
              }
            >
              <option value="weekly">
                Every week
              </option>

              <option value="monthly">
                Every month
              </option>

              <option value="quarterly">
                Every 3 months
              </option>

              <option value="sixMonths">
                Every 6 months
              </option>

              <option value="yearly">
                Every 12 months
              </option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">
              First Due Date *
            </label>

            <input
              type="date"
              className="form-input"
              min={today}
              value={formData.startDate}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  startDate: e.target.value,
                  nextRunAt: e.target.value,
                }))
              }
            />
          </div>

          <button
            type="submit"
            className="form-submit"
          >
            Create Recurring Job
          </button>
        </form>
      </div>
    </>
  )
}

function EditRecurringJobForm({

  job,

  onBack,

  onSubmit,

}) {

  const [formData, setFormData] = useState({

    title: job.title || '',

    description: job.description || '',

    location: job.location || '',

    frequencyUnit: job.frequencyUnit || 'month',

    frequencyInterval: Number(job.frequencyInterval || 1),

    startDate: job.startDate || job.nextRunAt || '',

    nextRunAt: job.nextRunAt || job.startDate || '',

    active: job.active !== false,

  })

  const handleScheduleChange = (value) => {

    const schedules = {

      weekly: {

        frequencyUnit: 'week',

        frequencyInterval: 1,

      },

      monthly: {

        frequencyUnit: 'month',

        frequencyInterval: 1,

      },

      quarterly: {

        frequencyUnit: 'month',

        frequencyInterval: 3,

      },

      sixMonths: {

        frequencyUnit: 'month',

        frequencyInterval: 6,

      },

      yearly: {

        frequencyUnit: 'month',

        frequencyInterval: 12,

      },

    }

    const selected = schedules[value]

    setFormData((prev) => ({

      ...prev,

      frequencyUnit: selected.frequencyUnit,

      frequencyInterval: selected.frequencyInterval,

    }))

  }

  const getScheduleValue = () => {

    if (

      formData.frequencyUnit === 'week' &&

      formData.frequencyInterval === 1

    ) {

      return 'weekly'

    }

    if (

      formData.frequencyUnit === 'month' &&

      formData.frequencyInterval === 1

    ) {

      return 'monthly'

    }

    if (formData.frequencyInterval === 3) {

      return 'quarterly'

    }

    if (formData.frequencyInterval === 6) {

      return 'sixMonths'

    }

    if (formData.frequencyInterval === 12) {

      return 'yearly'

    }

    return 'monthly'

  }

  const handleSubmit = (e) => {

    e.preventDefault()

    if (!formData.title.trim()) {

      window.alert('Please enter a job title.')

      return

    }

    if (!formData.description.trim()) {

      window.alert('Please enter a description.')

      return

    }

    if (!formData.nextRunAt) {

      window.alert('Please select the next due date.')

      return

    }

    onSubmit(job.id, {

      title: formData.title.trim(),

      description: formData.description.trim(),

      location: formData.location.trim(),

      frequencyUnit: formData.frequencyUnit,

      frequencyInterval: formData.frequencyInterval,

      startDate: formData.startDate,

      nextRunAt: formData.nextRunAt,

      active: formData.active,

    })

  }

  return (

    <>

      <div className="app-header">

        <button

          className="back-button"

          onClick={onBack}

        >

          ← Cancel

        </button>

        <h1

          className="app-title"

          onClick={onBack}

        >

          HotelKeep

        </h1>

      </div>

      <div className="form-container fade-in">

        <h2>Edit Recurring Job</h2>

        <form onSubmit={handleSubmit}>

          <div className="form-group">

            <label className="form-label">

              Title *

            </label>

            <input

              type="text"

              className="form-input"

              value={formData.title}

              onChange={(e) =>

                setFormData((prev) => ({

                  ...prev,

                  title: e.target.value,

                }))

              }

            />

          </div>

          <div className="form-group">

            <label className="form-label">

              Description *

            </label>

            <textarea

              className="form-textarea"

              value={formData.description}

              onChange={(e) =>

                setFormData((prev) => ({

                  ...prev,

                  description: e.target.value,

                }))

              }

            />

          </div>

          <div className="form-group">

            <label className="form-label">

              Location / Room

            </label>

            <input

              type="text"

              className="form-input"

              value={formData.location}

              onChange={(e) =>

                setFormData((prev) => ({

                  ...prev,

                  location: e.target.value,

                }))

              }

              placeholder="e.g. Room 6, Basement, Kitchen"

            />

          </div>

          <div className="form-group">

            <label className="form-label">

              Repeat *

            </label>

            <select

              className="form-select"

              value={getScheduleValue()}

              onChange={(e) =>

                handleScheduleChange(e.target.value)

              }

            >

              <option value="weekly">

                Every week

              </option>

              <option value="monthly">

                Every month

              </option>

              <option value="quarterly">

                Every 3 months

              </option>

              <option value="sixMonths">

                Every 6 months

              </option>

              <option value="yearly">

                Every 12 months

              </option>

            </select>

          </div>

          <div className="form-group">

            <label className="form-label">

              Next Due Date *

            </label>

            <input

              type="date"

              className="form-input"

              value={formData.nextRunAt}

              onChange={(e) =>

                setFormData((prev) => ({

                  ...prev,

                  nextRunAt: e.target.value,

                }))

              }

            />

          </div>

          <div className="form-group">

            <label className="form-label">

              Status

            </label>

            <select

              className="form-select"

              value={formData.active ? 'active' : 'paused'}

              onChange={(e) =>

                setFormData((prev) => ({

                  ...prev,

                  active: e.target.value === 'active',

                }))

              }

            >

              <option value="active">

                Active

              </option>

              <option value="paused">

                Paused

              </option>

            </select>

          </div>

          <button

            type="submit"

            className="form-submit"

          >

            Save Changes

          </button>

        </form>

      </div>

    </>

  )

}

function HandymanScheduledJobsList({
  recurringJobs,
  onBack,
  onViewJob,
}) {
  const activeJobs = (recurringJobs || [])
    .filter((job) => job.active)
    .sort((a, b) => {
      const aDate = new Date(a.nextRunAt || 0).getTime()
      const bDate = new Date(b.nextRunAt || 0).getTime()

      return aDate - bDate
    })

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return (
    <>
      <div className="app-header">
        <button
          className="back-button"
          onClick={onBack}
        >
          ← Back
        </button>

        <h1
          className="app-title"
          onClick={onBack}
        >
          HotelKeep
        </h1>
      </div>

      <div className="job-list fade-in">
        <div style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ margin: 0 }}>
            🗓️ Scheduled Jobs
          </h2>

          <p
            style={{
              marginTop: '0.4rem',
              color: '#64748b',
            }}
          >
            All active recurring maintenance tasks
          </p>
        </div>

        {activeJobs.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🗓️</div>

            <div className="empty-title">
              No Scheduled Jobs
            </div>

            <div className="empty-message">
              There are no active scheduled maintenance tasks.
            </div>
          </div>
        ) : (
          <div className="job-grid">
            {activeJobs.map((job) => {
              const locationLabel =
                job.location ||
                (job.room_number
                  ? `Room ${job.room_number}`
                  : null) ||
                (job.jobType === 'other'
                  ? 'Other Job'
                  : null)

              const nextDate = job.nextRunAt
                ? new Date(job.nextRunAt)
                : null

              const dueDate = nextDate
                ? new Date(nextDate)
                : null

              if (dueDate) {
                dueDate.setHours(0, 0, 0, 0)
              }

              const isDue =
                dueDate &&
                dueDate.getTime() === today.getTime()

              const isOverdue =
                dueDate &&
                dueDate.getTime() < today.getTime()

              return (
                <div
                  key={job.id}
                  className="job-card"
                  onClick={() => onViewJob(job)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="job-header">
                    <div className="job-title">
                      {job.title}
                    </div>

                    <span
                      className={`job-status-badge ${
                        isOverdue
                          ? 'urgent'
                          : isDue
                          ? 'todo'
                          : 'done'
                      }`}
                    >
                      {isOverdue
                        ? 'Overdue'
                        : isDue
                        ? 'Due Today'
                        : 'Upcoming'}
                    </span>
                  </div>

                  <div className="detail-description">
                    {job.description}
                  </div>

                  <div className="job-meta">
                    <span>
                      🗓️ Due:{' '}
                      {nextDate
                        ? nextDate.toLocaleDateString()
                        : 'Not set'}
                    </span>

                    <span>
                      🔁 Every {job.frequencyInterval}{' '}
                      {job.frequencyUnit}
                      {Number(job.frequencyInterval) > 1
                        ? 's'
                        : ''}
                    </span>

                    {locationLabel && (
                      <span>
                        📍 {locationLabel}
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}

function ScheduledJobDetail({
  job,
  role,
  onBack,
  onUpdate,
  goToDashboard,
}) {
  const [actionType, setActionType] = useState('')
  const [note, setNote] = useState('')

  const [isSubmitting, setIsSubmitting] = useState(false)

const calculateNextDueDate = (currentDate, interval, unit) => {
  const date = new Date(currentDate)

  if (unit === 'week') {
    date.setDate(date.getDate() + Number(interval))
  } else if (unit === 'month') {
    date.setMonth(date.getMonth() + Number(interval))
  } else if (unit === 'year') {
    date.setFullYear(date.getFullYear() + Number(interval))
  }

  return date.toISOString().split('T')[0]
}

const handleScheduledJobSubmit = async () => {
  if (actionType === 'problem' && !note.trim()) {
    window.alert('Please describe the problem.')
    return
  }

  setIsSubmitting(true)

  try {
    const now = new Date().toISOString()

    if (actionType === 'completed') {
      const nextRunAt = calculateNextDueDate(
        job.nextRunAt,
        job.frequencyInterval,
        job.frequencyUnit
      )

      await onUpdate(job.id, {
        lastResult: 'completed',
        lastNote: note.trim(),
        lastActionAt: now,
        lastCompletedAt: now,
        nextRunAt,
      })

      await createNotification({
            hotelId: 'athena',
            type: 'scheduled_completed',
            title: 'Scheduled Job Completed',
            message: job.title,
            relatedRecurringJobId: job.id,
            result: 'completed',
            note: note.trim(),
            actionAt: now,
            nextRunAt,
            location: job.location || '',
          })

      window.alert(
        `Task completed. Next due date: ${new Date(
          nextRunAt
        ).toLocaleDateString()}`
      )

      setActionType(null)
      setNote('')
      onBack()
    }

    if (actionType === 'problem') {
      await onUpdate(job.id, {
        lastResult: 'problem',
        lastNote: note.trim(),
        lastActionAt: now,
        lastProblemAt: now,
      })

      await createNotification({
          hotelId: 'athena',
          type: 'scheduled_problem',
          title: 'Problem Reported',
          message: job.title,
          relatedRecurringJobId: job.id,
          result: 'problem',
          note: note.trim(),
          actionAt: now,
          nextRunAt: job.nextRunAt || null,
          location: job.location || '',
        })

      window.alert('Problem report saved.')

      setActionType(null)
      setNote('')
      onBack()
    }
  } catch (error) {
    console.error('Could not save scheduled job action:', error)
    window.alert('Could not save. Please try again.')
  } finally {
    setIsSubmitting(false)
  }
}
  const locationLabel =
    job.location ||
    (job.room_number ? `Room ${job.room_number}` : null) ||
    (job.jobType === 'other' ? 'Other Job' : null)

  const nextDate = job.nextRunAt
    ? new Date(job.nextRunAt)
    : null

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const dueDate = nextDate
    ? new Date(nextDate)
    : null

  if (dueDate) {
    dueDate.setHours(0, 0, 0, 0)
  }

  const isDue =
    dueDate &&
    dueDate.getTime() === today.getTime()

  const isOverdue =
    dueDate &&
    dueDate.getTime() < today.getTime()

  const statusLabel = isOverdue
    ? 'Overdue'
    : isDue
    ? 'Due Today'
    : 'Upcoming'

  const statusClass = isOverdue
    ? 'urgent'
    : isDue
    ? 'todo'
    : 'done'

  const interval = Number(job.frequencyInterval || 1)
  const unit = job.frequencyUnit || 'month'

  const frequencyLabel =
    interval === 1
      ? `Every ${unit}`
      : `Every ${interval} ${unit}s`

  return (
    <>
      <div className="app-header">
        <button
          className="back-button"
          onClick={onBack}
        >
          ← Back
        </button>

        <h1
          className="app-title"
          onClick={goToDashboard}
        >
          HotelKeep
        </h1>
      </div>

<div className="job-detail fade-in">
  <div className="detail-card">
    <div className="detail-header">
      <div className="detail-title">
        {job.title}
      </div>

      <span
        className={`job-status-badge ${statusClass}`}
      >
        {statusLabel}
      </span>
    </div>

    <div className="detail-description">
      {job.description}
    </div>

<div className="detail-meta">
  {locationLabel && (
    <div>
      📍 Location: {locationLabel}
    </div>
  )}

  <div>
    🔁 Repeat: {frequencyLabel}
  </div>
</div>

  </div>

  {role === 'handyman' && (
    <>
      <div className="detail-actions">
        <button
          className={`action-btn ${
            actionType === 'completed'
              ? 'primary'
              : 'secondary'
          }`}
          onClick={() => setActionType('completed')}
        >
          ✓ Completed
        </button>

        <button
          className={`action-btn ${
            actionType === 'problem'
              ? 'danger'
              : 'secondary'
          }`}
          onClick={() => setActionType('problem')}
        >
          ⚠ Problem Found
        </button>
      </div>

      {actionType && (
        <div
          className="detail-card"
          style={{ marginTop: '1rem' }}
        >
          <div className="form-group">
            <label className="form-label">
              {actionType === 'problem'
                ? 'Describe the problem *'
                : 'Completion note (Optional)'}
            </label>

            <textarea
              className="form-textarea"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={
                actionType === 'problem'
                  ? 'Describe what is wrong or why the task could not be completed...'
                  : 'e.g. Checked all bulbs, replaced two faulty bulbs...'
              }
            />
          </div>

          <button
            className={`form-submit ${
              isSubmitting ? 'loading' : ''
            }`}
            onClick={handleScheduledJobSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting
              ? 'Saving...'
              : actionType === 'completed'
              ? 'Submit Completion'
              : 'Submit Problem Report'}
          </button>
        </div>
      )}
    </>
  )}
</div>
    </>
  )
}

function ManagerScheduledJobDetail({
  job,
  notification,
  notifications,
  onBack,
  goToDashboard,
}) {
  const locationLabel =
    notification.location ||
    job.location ||
    (job.room_number ? `Room ${job.room_number}` : null) ||
    (job.jobType === 'other' ? 'Other Job' : null)

  const interval = Number(job.frequencyInterval || 1)
  const unit = job.frequencyUnit || 'month'

  const frequencyLabel =
    interval === 1
      ? `Every ${unit}`
      : `Every ${interval} ${unit}s`

  const jobHistory = (notifications || [])
    .filter(
      (item) => item.relatedRecurringJobId === job.id
    )
    .sort((a, b) => {
      const getTime = (value) => {
        if (!value) return 0

        if (value.toDate) {
          return value.toDate().getTime()
        }

        const date = new Date(value)

        return Number.isNaN(date.getTime())
          ? 0
          : date.getTime()
      }

      return (
        getTime(b.actionAt || b.created_at) -
        getTime(a.actionAt || a.created_at)
      )
    })

  return (
    <>
      <div className="app-header">
        <button
          className="back-button"
          onClick={onBack}
        >
          ← Back
        </button>

        <h1
          className="app-title"
          onClick={goToDashboard}
        >
          HotelKeep
        </h1>
      </div>

      <div className="job-detail fade-in">
        <div className="detail-card">
          <div className="detail-header">
            <div className="detail-title">
              {job.title}
            </div>

            {notification.result && (
              <span
                className={`job-status-badge ${
                  notification.result === 'problem'
                    ? 'urgent'
                    : 'done'
                }`}
              >
                {notification.result === 'problem'
                  ? 'Problem Reported'
                  : notification.result === 'paused'
                  ? 'Paused'
                  : notification.result === 'resumed'
                  ? 'Resumed'
                  : 'Completed'}
              </span>
            )}
          </div>

          <div className="detail-description">
            {job.description}
          </div>

          <div className="detail-meta">
            {locationLabel && (
              <div>
                📍 Location: {locationLabel}
              </div>
            )}

            <div>
              🔁 Repeat: {frequencyLabel}
            </div>
          </div>

          <div>
            <h3
              style={{
                margin: '1.5rem 0 0.9rem',
                fontSize: '1.05rem',
                fontWeight: 700,
                color: '#334155',
              }}
            >
              🔔 Current Notification
            </h3>

            {notification.result === 'completed' && (
              <div>
                <strong>✅ Completed</strong>
              </div>
            )}

            {notification.result === 'problem' && (
              <div>
                <strong>⚠️ Problem Reported</strong>
              </div>
            )}

            {notification.result === 'paused' && (
              <div>
                <strong>⏸️ Paused</strong>
              </div>
            )}

            {notification.result === 'resumed' && (
              <div>
                <strong>▶️ Resumed</strong>
              </div>
            )}

            {notification.actionAt && (
              <div>
                🕒 {new Date(notification.actionAt).toLocaleString()}
              </div>
            )}

            {notification.note && (
              <div>
                📝 Handyman note: {notification.note}
              </div>
            )}

            {notification.nextRunAt &&
              notification.result === 'completed' && (
                <div>
                  🗓️ Next due:{' '}
                  {new Date(
                    notification.nextRunAt
                  ).toLocaleDateString()}
                </div>
              )}
          </div>

          <div className="activity-history-section">
            <h3>📋 Activity History</h3>

            {jobHistory.filter(
              (item) => item.id !== notification.id
            ).length === 0 ? (
              <div>No previous activity recorded.</div>
            ) : (
              jobHistory
                .filter(
                  (item) => item.id !== notification.id
                )
                .map((item) => {
                  const activityDate =
                    item.actionAt ||
                    (item.created_at?.toDate
                      ? item.created_at.toDate()
                      : item.created_at)

                  let activityIcon = '🔔'
                  let activityLabel =
                    item.title || 'Activity'

                  if (
                    item.result === 'completed' ||
                    item.type === 'scheduled_completed'
                  ) {
                    activityIcon = '✅'
                    activityLabel = 'Completed'
                  } else if (
                    item.result === 'problem' ||
                    item.type === 'scheduled_problem'
                  ) {
                    activityIcon = '⚠️'
                    activityLabel = 'Problem Reported'
                  } else if (
                    item.result === 'paused' ||
                    item.type === 'scheduled_paused'
                  ) {
                    activityIcon = '⏸️'
                    activityLabel = 'Paused'
                  } else if (
                    item.result === 'resumed' ||
                    item.type === 'scheduled_resumed'
                  ) {
                    activityIcon = '▶️'
                    activityLabel = 'Resumed'
                  }

                  return (
                    <div
                      key={item.id}
                      className="activity-history-item"
                    >
                      <div>
                        <strong>
                          {activityIcon}{' '}
                          {activityLabel}
                        </strong>
                      </div>

                      {activityDate && (
                        <div>
                          🕒{' '}
                          {new Date(
                            activityDate
                          ).toLocaleString()}
                        </div>
                      )}

                      {item.note && (
                        <div>
                          📝 {item.note}
                        </div>
                      )}

                      {item.nextRunAt &&
                        item.result === 'completed' && (
                          <div>
                            🗓️ Next due:{' '}
                            {new Date(
                              item.nextRunAt
                            ).toLocaleDateString()}
                          </div>
                        )}
                    </div>
                  )
                })
            )}
          </div>
        </div>
      </div>
    </>
  )
}
function NotificationsList({
  notifications,
  onBack,
  onOpenNotification,
}) {

  const formatNotificationTime = (createdAt) => {
    if (!createdAt) return ''

    try {
      // Firestore Timestamp
      if (createdAt.toDate) {
        return createdAt.toDate().toLocaleString()
      }

      // Normal date/string fallback
      const date = new Date(createdAt)

      if (Number.isNaN(date.getTime())) {
        return ''
      }

      return date.toLocaleString()
    } catch {
      return ''
    }
  }

  return (
    <>
      <div className="app-header">
        <button
          className="back-button"
          onClick={onBack}
        >
          ← Back
        </button>

        <h1
          className="app-title"
          onClick={onBack}
        >
          HotelKeep
        </h1>
      </div>

      <div className="job-list fade-in">
        <div style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ margin: 0 }}>
            🔔 Notifications
          </h2>

          <p
            style={{
              marginTop: '0.4rem',
              color: '#64748b',
            }}
          >
            Recent Job activity
          </p>
        </div>

        {(notifications || []).length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              🔔
            </div>

            <div className="empty-title">
              No Notifications
            </div>

            <div className="empty-message">
              Handyman activity will appear here.
            </div>
          </div>
        ) : (
          <div className="job-grid">
            {notifications.map((notification) => {
              const notificationTime =
                formatNotificationTime(
                  notification.created_at
                )

              return (
                <div
                    key={notification.id}
                    className="job-card"
                    onClick={() => onOpenNotification(notification)}
                    style={{
                      cursor: 'pointer',
                      opacity: notification.read
                        ? 0.7
                        : 1,
                      borderLeft: notification.read
                        ? '4px solid #cbd5e1'
                        : '4px solid #6366f1',
                    }}
                  >
                  <div className="job-header">
                    <div className="job-title">
                      {notification.type ===
                      'scheduled_completed'
                        ? '✅ '
                        : notification.type ===
                          'scheduled_problem'
                        ? '⚠️ '
                        : '🔔 '}

                      {notification.title}
                    </div>

                    {!notification.read && (
                      <span className="job-status-badge todo">
                        New
                      </span>
                    )}
                  </div>

                  <div className="detail-description">
                    {notification.message}
                  </div>

                  {notificationTime && (
                    <div className="job-meta">
                      <span>
                        🕒 {notificationTime}
                      </span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}


export default HotelMaintenanceApp
