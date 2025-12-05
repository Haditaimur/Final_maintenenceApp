import { useState, useEffect, useRef } from 'react'

//Data
const initialRooms = [
            // Basement
            { id: 1, room_number: "51", notes: "Triple Room", floor: "Basement" },
            { id: 2, room_number: "52", notes: "Triple Room", floor: "Basement" },
            { id: 3, room_number: "53", notes: "Twin Room", floor: "Basement" },
            { id: 4, room_number: "54", notes: "Triple Room", floor: "Basement" },
            // Ground Floor
            { id: 5, room_number: "1", notes: "Single Room", floor: "Ground Floor" },
            { id: 6, room_number: "2", notes: "Family Room", floor: "Ground Floor" },
            { id: 7, room_number: "3", notes: "Double Room", floor: "Ground Floor" },
            { id: 8, room_number: "4", notes: "Double Room", floor: "Ground Floor" },
            { id: 9, room_number: "5", notes: "Twin Room", floor: "Ground Floor" },
            { id: 10, room_number: "6", notes: "Triple Room", floor: "Ground Floor" },
            { id: 11, room_number: "7", notes: "Family Room", floor: "Ground Floor" },
            // First Floor
            { id: 12, room_number: "8", notes: "Twin Room", floor: "First Floor" },
            { id: 13, room_number: "2b", notes: "Twin Room", floor: "First Floor" },
            { id: 14, room_number: "11", notes: "Quad Room", floor: "First Floor" },
            { id: 15, room_number: "12", notes: "Quad Room", floor: "First Floor" },
            { id: 16, room_number: "13", notes: "Quad Room", floor: "First Floor" },
            { id: 17, room_number: "14", notes: "Family Room", floor: "First Floor" },
            { id: 18, room_number: "15", notes: "Double Room", floor: "First Floor" },
            { id: 19, room_number: "16", notes: "Double Room", floor: "First Floor" },
            // Second Floor
            { id: 20, room_number: "9", notes: "Single Room", floor: "Second Floor" },
            { id: 21, room_number: "5b", notes: "Single Room", floor: "Second Floor" },
            { id: 22, room_number: "21", notes: "Family Room", floor: "Second Floor" },
            { id: 23, room_number: "22", notes: "Family Room", floor: "Second Floor" },
            { id: 24, room_number: "23", notes: "Family Room", floor: "Second Floor" },
            { id: 25, room_number: "24", notes: "Family Room", floor: "Second Floor" },
            { id: 26, room_number: "25", notes: "Double Room", floor: "Second Floor" },
            { id: 27, room_number: "26", notes: "Double Room", floor: "Second Floor" },
            // Third Floor
            { id: 28, room_number: "31", notes: "Quad Room", floor: "Third Floor" },
            { id: 29, room_number: "32", notes: "Family Room", floor: "Third Floor" },
            { id: 30, room_number: "33", notes: "Quad Room", floor: "Third Floor" },
            { id: 31, room_number: "34", notes: "Triple Room", floor: "Third Floor" },
            { id: 32, room_number: "35", notes: "Double Room", floor: "Third Floor" },
            { id: 33, room_number: "36", notes: "Double Room", floor: "Third Floor" },
            // Fourth Floor
            { id: 34, room_number: "41", notes: "Quad Room", floor: "Fourth Floor" },
            { id: 35, room_number: "42", notes: "Quad Room", floor: "Fourth Floor" },
            { id: 36, room_number: "43", notes: "Quad Room", floor: "Fourth Floor" },
            { id: 37, room_number: "44", notes: "Triple Room", floor: "Fourth Floor" },
            { id: 38, room_number: "45", notes: "Single Room", floor: "Fourth Floor" },
            { id: 39, room_number: "46", notes: "Single Room", floor: "Fourth Floor" },
]

const initialJobs = [
  {
    id: 1,
    room_id: 5,
    title: 'Shower Leak',
    description: 'Water dripping from shower head constantly. Needs immediate attention.',
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
  const [currentView, setCurrentView] = useState('role-select')
  const [userRole, setUserRole] = useState(null)
  const [rooms, setRooms] = useState(() => storage.get('rooms', initialRooms))
  const [jobs, setJobs] = useState(() => storage.get('jobs', initialJobs))
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedJob, setSelectedJob] = useState(null)
  const [selectedFloor, setSelectedFloor] = useState(null)
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [enlargedPhoto, setEnlargedPhoto] = useState(null)
  const [managerCode, setManagerCode] = useState(() =>
    storage.get('managerCodeHash', hashCode('1234')),
  )
  const [showUserMenu, setShowUserMenu] = useState(false)

  useEffect(() => {
    storage.set('rooms', rooms)
  }, [rooms])

  useEffect(() => {
    storage.set('jobs', jobs)
  }, [jobs])

  useEffect(() => {
    storage.set('managerCodeHash', managerCode)
  }, [managerCode])

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
      const newCode = window.prompt('Enter new security code (4-8 digits recommended):')
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
  }

  const viewCategory = (category) => {
    setSelectedCategory(category)
    if (category === 'Urgent') {
      setCurrentView('urgent-list')
    } else {
      setCurrentView('floor-list')
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

  const createJob = (jobData) => {
    if (!jobData.title || !jobData.description) {
      window.alert('Job must have a title and description')
      return
    }

    if (jobData.status !== 'Other' && !jobData.room_id) {
      window.alert('Room-based jobs must have a valid room')
      return
    }

    const newJob = {
      ...jobData,
      id: jobs.length > 0 ? Math.max(...jobs.map((j) => j.id)) + 1 : 1,
      original_status: jobData.status,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    setJobs([...jobs, newJob])
    goToDashboard()
  }

  const updateJobData = (jobId, updates) => {
    if (updates.title !== undefined && !updates.title.trim()) {
      window.alert('Job title cannot be empty')
      return
    }

    if (updates.description !== undefined && !updates.description.trim()) {
      window.alert('Job description cannot be empty')
      return
    }

    setJobs(
      jobs.map((job) =>
        job.id === jobId
          ? { ...job, ...updates, updated_at: new Date().toISOString() }
          : job,
      ),
    )
    const updatedJob = jobs.find((j) => j.id === jobId)
    if (updatedJob) {
      setSelectedJob({ ...updatedJob, ...updates, updated_at: new Date().toISOString() })
    }
    setIsEditing(false)
    setCurrentView('job-detail')
  }

  const updateJob = (jobId, updates) => {
    setJobs(
      jobs.map((job) => {
        if (job.id === jobId) {
          const newUpdates = { ...updates, updated_at: new Date().toISOString() }
          if (updates.status === 'Done' && job.status !== 'Done') {
            newUpdates.original_status = job.status === 'Other' ? 'Other' : job.status
          }
          return { ...job, ...newUpdates }
        }
        return job
      }),
    )
    if (updates.status) {
      const job = jobs.find((j) => j.id === jobId)
      const newUpdates = { ...updates, updated_at: new Date().toISOString() }
      if (updates.status === 'Done' && job.status !== 'Done') {
        newUpdates.original_status = job.status === 'Other' ? 'Other' : job.status
      }
      setSelectedJob({ ...selectedJob, ...newUpdates })
    }
  }

  const deleteJob = (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job?')) return
    setJobs(jobs.filter((job) => job.id !== jobId))
    goToDashboard()
  }

  const getJobsForCategory = (status) => {
    if (status === 'To Do') {
      return jobs.filter(
        (job) =>
          job.status === 'To Do' || job.status === 'Urgent' || job.status === 'Other',
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
          <button className="photo-modal-close" onClick={() => setEnlargedPhoto(null)}>
            ×
          </button>
          <img src={enlargedPhoto} alt="Enlarged" />
        </div>
      )}

      {currentView === 'role-select' && <RoleSelector onSelectRole={selectRole} />}

      {currentView === 'dashboard' && (
        <Dashboard
          role={userRole}
          jobs={jobs}
          onViewCategory={viewCategory}
          onAddJob={addNewJob}
          onLogout={logout}
          onChangeCode={changeManagerCode}
          showUserMenu={showUserMenu}
          setShowUserMenu={setShowUserMenu}
        />
      )}

      {currentView === 'urgent-list' && (
        <UrgentJobsList
          jobs={getJobsWithRoomInfo(getJobsForCategory('Urgent'))}
          onBack={goToDashboard}
          onViewJob={viewJobDetail}
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
        />
      )}

      {currentView === 'job-detail' && selectedJob && (
        <JobDetail
          job={selectedJob}
          room={getRoomById(selectedJob.room_id)}
          role={userRole}
          onBack={() => {
            if (selectedCategory === 'Urgent') {
              setCurrentView('urgent-list')
            } else {
              setCurrentView('job-list')
            }
          }}
          onUpdateJob={updateJob}
          onDeleteJob={deleteJob}
          onEditJob={editJob}
          onEnlargePhoto={setEnlargedPhoto}
          goToDashboard={goToDashboard}
        />
      )}

      {currentView === 'add-job' && (
        <AddJobForm
          rooms={rooms}
          onBack={goToDashboard}
          onSubmit={createJob}
          goToDashboard={goToDashboard}
        />
      )}

      {currentView === 'edit-job' && selectedJob && (
        <EditJobForm
          job={selectedJob}
          rooms={rooms}
          onBack={() => setCurrentView('job-detail')}
          onSubmit={updateJobData}
          goToDashboard={goToDashboard}
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
          <button className="role-select-btn manager" onClick={() => onSelectRole('manager')}>
            <span>👨‍💼 Manager</span>
          </button>
          <button className="role-select-btn" onClick={() => onSelectRole('handyman')}>
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
  onViewCategory,
  onAddJob,
  onLogout,
  onChangeCode,
  showUserMenu,
  setShowUserMenu,
}) {
  const urgentCount = jobs.filter((j) => j.status === 'Urgent').length
  const todoCount = jobs.filter(
    (j) => j.status === 'To Do' || j.status === 'Urgent' || j.status === 'Other',
  ).length
  const doneCount = jobs.filter((j) => j.status === 'Done').length

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
        <div className="dashboard-grid">
          <div className="category-card urgent" onClick={() => onViewCategory('Urgent')}>
            <div className="category-header">
              <div className="category-title">
                <div className="category-icon">🔥</div>
                Urgent Jobs
              </div>
            </div>
            <div className="category-count">{urgentCount}</div>
            <div className="category-subtitle">Requires immediate attention</div>
          </div>

          <div className="category-card todo" onClick={() => onViewCategory('To Do')}>
            <div className="category-header">
              <div className="category-title">
                <div className="category-icon">📋</div>
                To Do Jobs
              </div>
            </div>
            <div className="category-count">{todoCount}</div>
            <div className="category-subtitle">Scheduled maintenance tasks</div>
          </div>

          <div className="category-card done" onClick={() => onViewCategory('Done')}>
            <div className="category-header">
              <div className="category-title">
                <div className="category-icon">✅</div>
                Done Jobs
              </div>
            </div>
            <div className="category-count">{doneCount}</div>
            <div className="category-subtitle">Completed tasks</div>
          </div>
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

function UrgentJobsList({ jobs, onBack, onViewJob }) {
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
            {jobs.map((job) => (
              <div
                key={job.id}
                className="urgent-job-card"
                onClick={() => onViewJob(job)}
              >
                <div className="job-header">
                  <div className="job-title">{job.title}</div>
                  <span className="status-badge urgent">Urgent</span>
                </div>
                <div className="room-number">Room {job.room?.room_number}</div>
                <div className="detail-description">{job.description}</div>
                <div className="job-meta">
                  <span>📅 {new Date(job.created_at).toLocaleDateString()}</span>
                  {job.photo && <span className="job-photo-indicator">📷 Photo</span>}
                </div>
              </div>
            ))}
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
    return jobs.filter((j) => j.status === category && roomIds.includes(j.room_id))
      .length
  }

  const getOtherJobsCount = () => {
    if (category === 'To Do') {
      return jobs.filter((j) => j.status === 'Other').length
    } else if (category === 'Done') {
      return jobs.filter((j) => j.status === 'Done' && j.original_status === 'Other')
        .length
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
              {category === 'To Do' ? '✅' : category === 'Done' ? '🎉' : '📋'}
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
              <div className="floor-section" onClick={() => onViewFloor('Other')}>
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
                No {category === 'Done' ? 'completed' : 'pending'} non-room maintenance
                tasks
              </div>
            </div>
          ) : (
            <div className="urgent-jobs">
              {otherJobs.map((job) => (
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
                      className={`status-badge ${job.status
                        .toLowerCase()
                        .replace(' ', '')}`}
                    >
                      {job.status}
                    </span>
                  </div>
                  <div className="detail-description">{job.description}</div>
                  <div className="job-meta">
                    <span>📅 {new Date(job.created_at).toLocaleDateString()}</span>
                    {job.photo && (
                      <span className="job-photo-indicator">📷 Photo</span>
                    )}
                  </div>
                </div>
              ))}
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
          (j.status === 'To Do' || j.status === 'Urgent') && j.room_id === roomId,
      ).length
    }
    if (category === 'Done') {
      return jobs.filter(
        (j) => j.status === 'Done' && j.original_status !== 'Other' && j.room_id === roomId,
      ).length
    }
    return jobs.filter((j) => j.status === category && j.room_id === roomId).length
  }

  const roomsWithJobs = floorRooms.filter((room) => getRoomJobCount(room.id) > 0)

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
                    <div className="room-number">Room {room.room_number}</div>
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

function JobList({ room, category, jobs, onBack, onViewJob, goToDashboard }) {
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
    roomJobs = jobs.filter((j) => j.room_id === room.id && j.status === category)
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
        {roomJobs.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">✅</div>
            <div className="empty-title">No Jobs for Room {room.room_number}</div>
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
            {roomJobs.map((job) => (
              <div key={job.id} className="job-card" onClick={() => onViewJob(job)}>
                <div className="job-header">
                  <div className="job-title">{job.title}</div>
                  <span
                    className={`status-badge ${job.status
                      .toLowerCase()
                      .replace(' ', '')}`}
                  >
                    {job.status}
                  </span>
                </div>
                <div className="detail-description">{job.description}</div>
                <div className="job-meta">
                  <span>📅 {new Date(job.created_at).toLocaleDateString()}</span>
                  {job.photo && (
                    <span className="job-photo-indicator">📷 Photo</span>
                  )}
                </div>
              </div>
            ))}
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
  onBack,
  onUpdateJob,
  onDeleteJob,
  onEditJob,
  onEnlargePhoto,
  goToDashboard,
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
            <span
              className={`status-badge ${job.status.toLowerCase().replace(' ', '')}`}
            >
              {job.status}
            </span>
          </div>

          <div className="detail-room">
            Room {room?.room_number} - {room?.notes}
          </div>

          <div className="detail-description">{job.description}</div>

          {job.photo && (
            <img
              src={job.photo}
              alt="Job photo"
              className="detail-photo"
              onClick={() => onEnlargePhoto(job.photo)}
            />
          )}

          <div className="photo-upload-section">
            <label className="photo-upload-label">
              {job.photo ? 'Update Photo' : 'Add Photo'}
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
            <button className="action-btn secondary" onClick={handleReopenAsOriginal}>
              ↺ Reopen as {job.original_status || 'To Do'}
            </button>
          )}

          {role === 'manager' && (
            <button className="action-btn danger" onClick={handleDelete}>
              🗑 Delete Job
            </button>
          )}
        </div>
      </div>
    </>
  )
}

function AddJobForm({ rooms, onBack, onSubmit, goToDashboard }) {
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
    if (['1', '2', '3', '4', '5', '6', '7'].includes(num)) return 'Ground Floor'
    if (['8', '2b', '11', '12', '13', '14', '15', '16'].includes(num))
      return 'First Floor'
    if (['9', '5b', '21', '22', '23', '24', '25', '26'].includes(num))
      return 'Second Floor'
    if (['31', '32', '33', '34', '35', '36'].includes(num)) return 'Third Floor'
    if (['41', '42', '43', '44', '45', '46'].includes(num)) return 'Fourth Floor'

    return ''
  }

  const handleRoomNumberChange = (value) => {
    const floor = detectFloor(value)
    setDetectedFloor(floor)

    const matchingRoom = rooms.find(
      (r) => r.room_number.toLowerCase() === value.toLowerCase().trim(),
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
          r.room_number.toLowerCase() === formData.room_number.toLowerCase().trim(),
      )

      if (!matchingRoom) {
        window.alert(
          `Room "${formData.room_number}" not found. Please enter a valid room number.`,
        )
        return
      }

      formData.room_id = matchingRoom.id
    }

    const finalStatus = formData.jobType === 'other' ? 'Other' : formData.priority

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
              onChange={(e) => setFormData({ ...formData, jobType: e.target.value })}
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
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
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
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
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
                  onChange={(e) => handleRoomNumberChange(e.target.value)}
                  placeholder="e.g., 1, 2b, 21, 51"
                  required
                />
                <div className="room-input-helper">
                  {detectedFloor ? (
                    <span>
                      ✓ <strong>{detectedFloor}</strong> - Room {formData.room_number}
                    </span>
                  ) : formData.room_number ? (
                    <span>⚠️ Room not found. Please check the room number.</span>
                  ) : (
                    <span>
                      <strong>Available rooms:</strong> Basement (51-54), Ground (1-7),
                      First (8, 2b, 11-16), Second (9, 5b, 21-26), Third (31-36), Fourth
                      (41-46)
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
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
              <img src={formData.photo} alt="Job photo" className="detail-photo" />
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

          <button type="submit" className="form-submit">
            Create Job
          </button>
        </form>
      </div>
    </>
  )
}

function EditJobForm({ job, rooms, onBack, onSubmit, goToDashboard }) {
  const currentRoom = rooms.find((r) => r.id === job.room_id)

  const getInitialJobType = () => {
    if (job.status === 'Other' || (job.status === 'Done' && job.original_status === 'Other')) {
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
    photo: job.photo,
  })

  const fileInputRef = useRef(null)
  const cameraInputRef = useRef(null)
  const [detectedFloor, setDetectedFloor] = useState(currentRoom ? currentRoom.floor : '')

  const detectFloor = (roomNum) => {
    if (!roomNum) return ''

    const num = roomNum.toLowerCase().trim()

    if (['51', '52', '53', '54'].includes(num)) return 'Basement'
    if (['1', '2', '3', '4', '5', '6', '7'].includes(num)) return 'Ground Floor'
    if (['8', '2b', '11', '12', '13', '14', '15', '16'].includes(num))
      return 'First Floor'
    if (['9', '5b', '21', '22', '23', '24', '25', '26'].includes(num))
      return 'Second Floor'
    if (['31', '32', '33', '34', '35', '36'].includes(num)) return 'Third Floor'
    if (['41', '42', '43', '44', '45', '46'].includes(num)) return 'Fourth Floor'

    return ''
  }

  const handleRoomNumberChange = (value) => {
    const floor = detectFloor(value)
    setDetectedFloor(floor)

    const matchingRoom = rooms.find(
      (r) => r.room_number.toLowerCase() === value.toLowerCase().trim(),
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
          r.room_number.toLowerCase() === formData.room_number.toLowerCase().trim(),
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
      finalStatus = formData.jobType === 'other' ? 'Other' : formData.priority
    }

    onSubmit(job.id, {
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
                    onChange={(e) => handleRoomNumberChange(e.target.value)}
                    placeholder="e.g., 1, 2b, 21, 51"
                    required
                  />
                  <div className="room-input-helper">
                    {detectedFloor ? (
                      <span>
                        ✓ <strong>{detectedFloor}</strong> - Room {formData.room_number}
                      </span>
                    ) : formData.room_number ? (
                      <span>⚠️ Room not found. Please check the room number.</span>
                    ) : (
                      <span>
                        <strong>Available rooms:</strong> Basement (51-54), Ground (1-7),
                        First (8, 2b, 11-16), Second (9, 5b, 21-26), Third (31-36), Fourth
                        (41-46)
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
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
              <img src={formData.photo} alt="Job photo" className="detail-photo" />
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

          <button type="submit" className="form-submit">
            Update Job
          </button>
        </form>
      </div>
    </>
  )
}

export default HotelMaintenanceApp
