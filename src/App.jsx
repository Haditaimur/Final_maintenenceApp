import { useState, useEffect, useRef } from 'react'
import { subscribeToJobs, createJobInDb, updateJobInDb, deleteJobInDb } from './Jobsservice.js'

// ============================================================================
// REUSABLE HEADER COMPONENT
// ============================================================================

function AppHeader({ 
  showBackButton = false, 
  onBack = null, 
  role = null, 
  showUserMenu = false,
  setShowUserMenu = null,
  onChangeCode = null,
  onLogout = null,
  goToDashboard = null
}) {
  return (
    <div className="app-header">
      <div className="header-left">
        {showBackButton && onBack && (
          <button className="back-button" onClick={onBack}>
            ← Back
          </button>
        )}
        <img 
          src="/hotelkeep-logo.png" 
          alt="HotelKeep" 
          className="header-logo"
          onClick={goToDashboard}
        />
      </div>
      
      <div className="header-center"></div>
      
      <div className="header-right">
        {role && (
          <div className="user-menu-container">
            <button
              className="role-dropdown-button"
              onClick={() => setShowUserMenu && setShowUserMenu(!showUserMenu)}
            >
              <span className="role-name">
                {role === 'manager' ? '👨‍💼 Manager' : '🔧 Handyman'}
              </span>
              <span className="dropdown-arrow">▼</span>
            </button>
            {showUserMenu && (
              <div className="user-menu-dropdown">
                {role === 'manager' && onChangeCode && (
                  <button className="user-menu-item" onClick={() => {
                    setShowUserMenu(false)
                    onChangeCode()
                  }}>
                    🔒 Change Security Code
                  </button>
                )}
                {onLogout && (
                  <button className="user-menu-item danger" onClick={() => {
                    setShowUserMenu(false)
                    onLogout()
                  }}>
                    🚪 Logout
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================================================
// DATA
// ============================================================================

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
    title: 'Window Won\'t Close',
    description: 'Bedroom window stuck halfway open.',
    photo: null,
    status: 'Done',
    original_status: 'To Do',
    created_at: new Date('2025-11-26T10:00:00').toISOString(),
    updated_at: new Date('2025-11-27T16:00:00').toISOString(),
  }
]

// ============================================================================
// MAIN APP COMPONENT
// ============================================================================

function HotelMaintenanceApp() {
  // State
  const [isInitializing, setIsInitializing] = useState(true)
  const [currentView, setCurrentView] = useState('role-select')
  const [userRole, setUserRole] = useState(null)
  const [managerCode, setManagerCode] = useState('1234')
  const [jobs, setJobs] = useState(initialJobs)
  const [rooms] = useState(initialRooms)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedFloor, setSelectedFloor] = useState(null)
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [selectedJob, setSelectedJob] = useState(null)
  const [enlargedPhoto, setEnlargedPhoto] = useState(null)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Firebase sync
  useEffect(() => {
    const unsubscribe = subscribeToJobs((firebaseJobs) => {
      if (firebaseJobs.length > 0) {
        setJobs(firebaseJobs)
      }
    })
    return () => unsubscribe()
  }, [])

  // Loading screen
  useEffect(() => {
    const minLoadTime = setTimeout(() => {
      setIsInitializing(false)
    }, 1200)
    return () => clearTimeout(minLoadTime)
  }, [])

  // Transition helper
  const transitionToView = (newView, callback) => {
    setIsTransitioning(true)
    setTimeout(() => {
      if (callback) callback()
      setCurrentView(newView)
      setTimeout(() => {
        setIsTransitioning(false)
      }, 300)
    }, 400)
  }

  // Navigation
  const selectRole = (role) => {
    setUserRole(role)
    transitionToView('dashboard')
  }

  const logout = () => {
    transitionToView('role-select', () => {
      setUserRole(null)
      setSelectedCategory(null)
      setSelectedFloor(null)
      setSelectedRoom(null)
      setSelectedJob(null)
    })
  }

  const changeManagerCode = () => {
    const newCode = prompt('Enter new security code (4 digits):')
    if (newCode && /^\d{4}$/.test(newCode)) {
      setManagerCode(newCode)
      alert('Security code updated successfully!')
    } else if (newCode) {
      alert('Invalid code. Please enter 4 digits.')
    }
  }

  const goToDashboard = () => {
    transitionToView('dashboard', () => {
      setSelectedCategory(null)
      setSelectedFloor(null)
      setSelectedRoom(null)
      setSelectedJob(null)
    })
  }

  const viewCategory = (category) => {
    setSelectedCategory(category)
    transitionToView(category === 'Urgent' ? 'urgent-list' : 'floor-list', () => {
      setSelectedFloor(null)
      setSelectedRoom(null)
      setSelectedJob(null)
    })
  }

  const viewFloorRooms = (floor) => {
    transitionToView('room-list', () => {
      setSelectedFloor(floor)
      setSelectedRoom(null)
    })
  }

  const viewRoomJobs = (room) => {
    transitionToView('job-list', () => {
      setSelectedRoom(room)
    })
  }

  const viewJobDetail = (job) => {
    transitionToView('job-detail', () => {
      setSelectedJob(job)
    })
  }

  const addNewJob = () => {
    transitionToView('add-job')
  }

  const editJob = () => {
    transitionToView('edit-job')
  }

  // Job operations
  const createJob = async (jobData) => {
    try {
      const newJob = {
        ...jobData,
        id: Date.now(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      await createJobInDb(newJob)
      setJobs((prev) => [...prev, newJob])
      goToDashboard()
    } catch (err) {
      console.error('Error creating job:', err)
      alert('Could not create job. Please try again.')
    }
  }

  const updateJobData = async (updatedJob) => {
    try {
      const jobWithTimestamp = {
        ...updatedJob,
        updated_at: new Date().toISOString(),
      }
      await updateJobInDb(jobWithTimestamp)
      setJobs((prev) => prev.map((j) => (j.id === updatedJob.id ? jobWithTimestamp : j)))
      setSelectedJob(jobWithTimestamp)
      transitionToView('job-detail')
    } catch (err) {
      console.error('Error updating job:', err)
      alert('Could not update job. Please try again.')
    }
  }

  const deleteJob = async (jobId) => {
    try {
      await deleteJobInDb(jobId)
      setJobs((prev) => prev.filter((j) => j.id !== jobId))
      goToDashboard()
    } catch (err) {
      console.error('Error deleting job:', err)
      alert('Could not delete job. Please try again.')
      throw err
    }
  }

  // Helper functions
  const getRoomById = (roomId) => rooms.find((r) => r.id === roomId)

  const getJobsForCategory = (category) => {
    if (category === 'Urgent') return jobs.filter((j) => j.status === 'Urgent')
    if (category === 'To Do') return jobs.filter((j) => j.status === 'To Do' || j.status === 'Urgent' || j.status === 'Other')
    if (category === 'Done') return jobs.filter((j) => j.status === 'Done')
    return []
  }

  const getJobsWithRoomInfo = (jobsList) => {
    return jobsList.map((job) => ({
      ...job,
      room: getRoomById(job.room_id),
    }))
  }

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <>
      {/* Loading Screen */}
      {isInitializing && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}>
          <div style={{ textAlign: 'center' }}>
            <img 
              src="/hotelkeep-logo.png" 
              alt="HotelKeep" 
              style={{
                width: '200px',
                height: 'auto',
                display: 'block',
                margin: '0 auto 30px',
                filter: 'drop-shadow(0 10px 30px rgba(0, 0, 0, 0.3))'
              }}
            />
            <div className="loading-spinner"></div>
          </div>
        </div>
      )}

      {/* Main App */}
      {!isInitializing && (
        <div className="app-container">
          {/* Transition Overlay */}
          {isTransitioning && (
            <div className="transition-overlay">
              <div className="transition-spinner"></div>
            </div>
          )}

          {/* Photo Modal */}
          {enlargedPhoto && (
            <div className="photo-modal" onClick={() => setEnlargedPhoto(null)}>
              <div className="photo-modal-content">
                <button className="photo-modal-close" onClick={() => setEnlargedPhoto(null)}>
                  ✕
                </button>
                <img src={enlargedPhoto} alt="Job" />
              </div>
            </div>
          )}

          {/* Role Selection */}
          {currentView === 'role-select' && (
            <RoleSelector key="role-select" onSelectRole={selectRole} />
          )}

          {/* Dashboard */}
          {currentView === 'dashboard' && (
            <Dashboard
              key="dashboard"
              role={userRole}
              jobs={jobs}
              onViewCategory={viewCategory}
              onAddJob={addNewJob}
              showUserMenu={showUserMenu}
              setShowUserMenu={setShowUserMenu}
              onChangeCode={changeManagerCode}
              onLogout={logout}
              goToDashboard={goToDashboard}
            />
          )}

          {/* Urgent List */}
          {currentView === 'urgent-list' && (
            <UrgentJobsList
              key="urgent-list"
              jobs={getJobsWithRoomInfo(getJobsForCategory('Urgent'))}
              onBack={goToDashboard}
              onViewJob={viewJobDetail}
              goToDashboard={goToDashboard}
            />
          )}

          {/* Floor List */}
          {currentView === 'floor-list' && (
            <FloorList
              key="floor-list"
              category={selectedCategory}
              jobs={jobs}
              rooms={rooms}
              onBack={goToDashboard}
              onViewFloor={viewFloorRooms}
              goToDashboard={goToDashboard}
            />
          )}

          {/* Room List */}
          {currentView === 'room-list' && (
            <RoomList
              key={`room-list-${selectedFloor}`}
              floor={selectedFloor}
              category={selectedCategory}
              jobs={jobs}
              rooms={rooms}
              onBack={() => transitionToView('floor-list', () => setSelectedFloor(null))}
              onViewRoom={viewRoomJobs}
              onViewJob={viewJobDetail}
              goToDashboard={goToDashboard}
            />
          )}

          {/* Job List */}
          {currentView === 'job-list' && (
            <JobList
              key={`job-list-${selectedRoom?.id || 'none'}`}
              room={selectedRoom}
              category={selectedCategory}
              jobs={jobs}
              onBack={() => setCurrentView('room-list')}
              onViewJob={viewJobDetail}
              goToDashboard={goToDashboard}
            />
          )}

          {/* Job Detail */}
          {currentView === 'job-detail' && selectedJob && (
            <JobDetail
              key={`job-detail-${selectedJob.id}`}
              job={selectedJob}
              room={getRoomById(selectedJob.room_id)}
              role={userRole}
              onBack={() => {
                transitionToView(
                  selectedCategory === 'Urgent' ? 'urgent-list' : 'job-list',
                  () => setSelectedJob(null)
                )
              }}
              onUpdateJob={updateJobData}
              onDeleteJob={deleteJob}
              onEditJob={editJob}
              onEnlargePhoto={setEnlargedPhoto}
              goToDashboard={goToDashboard}
            />
          )}

          {/* Add Job */}
          {currentView === 'add-job' && (
            <AddJobForm
              key="add-job"
              rooms={rooms}
              onBack={goToDashboard}
              onSubmit={createJob}
              goToDashboard={goToDashboard}
            />
          )}

          {/* Edit Job */}
          {currentView === 'edit-job' && selectedJob && (
            <EditJobForm
              key={`edit-job-${selectedJob.id}`}
              job={selectedJob}
              rooms={rooms}
              onBack={() => transitionToView('job-detail')}
              onSubmit={updateJobData}
              goToDashboard={goToDashboard}
            />
          )}
        </div>
      )}
    </>
  )
}

// ============================================================================
// PAGE COMPONENTS
// ============================================================================

function RoleSelector({ onSelectRole }) {
  return (
    <div className="page-view role-selector-page">
      <div className="app-branding">
        <div className="app-logo">
          <img src="/hotelkeep-logo.png" alt="HotelKeep" className="app-logo-image" />
        </div>
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

function Dashboard({ role, jobs, onViewCategory, onAddJob, showUserMenu, setShowUserMenu, onChangeCode, onLogout, goToDashboard }) {
  const urgentCount = jobs.filter((j) => j.status === 'Urgent').length
  const todoCount = jobs.filter((j) => j.status === 'To Do' || j.status === 'Urgent' || j.status === 'Other').length
  const doneCount = jobs.filter((j) => j.status === 'Done').length

  return (
    <div className="page-view dashboard">
      <AppHeader 
        role={role}
        showUserMenu={showUserMenu}
        setShowUserMenu={setShowUserMenu}
        onChangeCode={onChangeCode}
        onLogout={onLogout}
        goToDashboard={goToDashboard}
      />
      
      <div className="dashboard-content">
        <div className="dashboard-grid">
          <div className="category-card urgent" onClick={() => onViewCategory('Urgent')}>
            <div className="category-header">
              <div className="category-title">
                <div className="category-icon">🚨</div>
                Urgent Jobs
              </div>
            </div>
            <div className="category-count">{urgentCount}</div>
            <div className="category-subtitle">Need immediate attention</div>
          </div>

          <div className="category-card todo" onClick={() => onViewCategory('To Do')}>
            <div className="category-header">
              <div className="category-title">
                <div className="category-icon">📋</div>
                To Do Jobs
              </div>
            </div>
            <div className="category-count">{todoCount}</div>
            <div className="category-subtitle">Pending tasks</div>
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
    </div>
  )
}

function UrgentJobsList({ jobs, onBack, onViewJob, goToDashboard }) {
  return (
    <div className="page-view urgent-list">
      <AppHeader 
        showBackButton={true}
        onBack={onBack}
        goToDashboard={goToDashboard}
      />

      <div className="job-grid">
        {jobs.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🎉</div>
            <div className="empty-title">All Clear!</div>
            <div className="empty-message">
              No urgent jobs at the moment. Everything is under control.
            </div>
          </div>
        ) : (
          <div className="grid-container">
            {jobs.map((job) => (
              <div key={job.id} className="job-card urgent" onClick={() => onViewJob(job)}>
                <div className="job-card-header">
                  <div className="job-card-title">
                    {job.room ? `Room ${job.room.room_number}` : 'Unknown Room'}
                  </div>
                  <div className="job-status-badge urgent">🚨 Urgent</div>
                </div>
                <div className="detail-title">{job.title}</div>
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
    </div>
  )
}

function FloorList({ category, jobs, rooms, onBack, onViewFloor, goToDashboard }) {
  const floors = ['Basement', 'Ground Floor', 'First Floor', 'Second Floor', 'Third Floor', 'Fourth Floor']

  const getJobCountForFloor = (floor) => {
    const floorRooms = rooms.filter((r) => r.floor === floor)
    const floorRoomIds = floorRooms.map((r) => r.id)
    return jobs.filter((j) => {
      if (category === 'To Do') {
        return floorRoomIds.includes(j.room_id) && (j.status === 'To Do' || j.status === 'Urgent' || j.status === 'Other')
      }
      if (category === 'Done') {
        return floorRoomIds.includes(j.room_id) && j.status === 'Done'
      }
      return floorRoomIds.includes(j.room_id)
    }).length
  }

  const getTotalJobCount = () => {
    return floors.reduce((total, floor) => total + getJobCountForFloor(floor), 0)
  }

  return (
    <div className="page-view">
      <AppHeader 
        showBackButton={true}
        onBack={onBack}
        goToDashboard={goToDashboard}
      />

      <div className="floor-list">
        {getTotalJobCount() === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              {category === 'To Do' ? '✅' : category === 'Done' ? '🎉' : '📋'}
            </div>
            <div className="empty-title">No Jobs Found</div>
            <div className="empty-message">
              {category === 'Done'
                ? 'No completed jobs yet. Great work stays ahead!'
                : 'No jobs in this category at the moment.'}
            </div>
          </div>
        ) : (
          <>
            {floors.map((floor) => {
              const jobCount = getJobCountForFloor(floor)
              if (jobCount === 0) return null

              return (
                <div key={floor} className="floor-card" onClick={() => onViewFloor(floor)}>
                  <div className="floor-info">
                    <div className="floor-name">{floor}</div>
                    <div className="floor-subtitle">
                      {rooms.filter((r) => r.floor === floor).length} rooms
                    </div>
                  </div>
                  <div className="floor-count">
                    <div className="count-number">{jobCount}</div>
                    <div className="count-label">
                      {jobCount === 1 ? 'job' : 'jobs'}
                    </div>
                  </div>
                </div>
              )
            })}
          </>
        )}
      </div>
    </div>
  )
}

function RoomList({ floor, category, jobs, rooms, onBack, onViewRoom, onViewJob, goToDashboard }) {
  const floorRooms = rooms.filter((r) => r.floor === floor)

  const getJobsForRoom = (roomId) => {
    return jobs.filter((j) => {
      if (category === 'To Do') {
        return j.room_id === roomId && (j.status === 'To Do' || j.status === 'Urgent' || j.status === 'Other')
      }
      if (category === 'Done') {
        return j.room_id === roomId && j.status === 'Done'
      }
      return j.room_id === roomId
    })
  }

  return (
    <div className="page-view">
      <AppHeader 
        showBackButton={true}
        onBack={onBack}
        goToDashboard={goToDashboard}
      />

      <div className="room-list">
        {floorRooms.map((room) => {
          const roomJobs = getJobsForRoom(room.id)
          if (roomJobs.length === 0) return null

          return (
            <div key={room.id} className="room-card" onClick={() => onViewRoom(room)}>
              <div className="room-header">
                <div className="room-number">Room {room.room_number}</div>
                <div className="room-badge">{roomJobs.length} {roomJobs.length === 1 ? 'job' : 'jobs'}</div>
              </div>
              <div className="room-notes">{room.notes}</div>
              <div className="room-jobs-preview">
                {roomJobs.map((job) => (
                  <div key={job.id} className="job-preview-item">
                    • {job.title}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function JobList({ room, category, jobs, onBack, onViewJob, goToDashboard }) {
  const roomJobs = jobs.filter((j) => {
    if (category === 'To Do') {
      return j.room_id === room.id && (j.status === 'To Do' || j.status === 'Urgent' || j.status === 'Other')
    }
    if (category === 'Done') {
      return j.room_id === room.id && j.status === 'Done'
    }
    return j.room_id === room.id
  })

  return (
    <div className="page-view">
      <AppHeader 
        showBackButton={true}
        onBack={onBack}
        goToDashboard={goToDashboard}
      />

      <div className="job-list">
        <div className="room-info-header">
          <h2>Room {room.room_number}</h2>
          <p>{room.notes}</p>
        </div>

        <div className="job-items">
          {roomJobs.map((job) => (
            <div key={job.id} className="job-item" onClick={() => onViewJob(job)}>
              <div className="job-item-header">
                <div className="job-item-title">{job.title}</div>
                <div className={`job-status-badge ${job.status.toLowerCase().replace(' ', '-')}`}>
                  {job.status === 'Urgent' && '🚨'}
                  {job.status === 'To Do' && '📋'}
                  {job.status === 'Done' && '✅'}
                  {job.status === 'Other' && '📝'}
                  {' '}{job.status}
                </div>
              </div>
              <div className="job-item-description">{job.description}</div>
              <div className="job-item-meta">
                <span>📅 {new Date(job.created_at).toLocaleDateString()}</span>
                {job.photo && <span className="job-photo-indicator">📷 Photo</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function JobDetail({ job, room, role, onBack, onUpdateJob, onDeleteJob, onEditJob, onEnlargePhoto, goToDashboard }) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleStatusChange = (newStatus) => {
    const updatedJob = { ...job, status: newStatus }
    onUpdateJob(updatedJob)
  }

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this job?')) {
      return
    }
    
    setIsDeleting(true)
    try {
      await Promise.all([
        onDeleteJob(job.id),
        new Promise(resolve => setTimeout(resolve, 500))
      ])
    } catch (error) {
      console.error('Delete error:', error)
      setIsDeleting(false)
    }
  }

  return (
    <div className="page-view">
      <AppHeader 
        showBackButton={true}
        onBack={onBack}
        goToDashboard={goToDashboard}
      />

      <div className="job-detail">
        <div className="detail-card">
          <div className="detail-header">
            <h2>Room {room ? room.room_number : 'Unknown'}</h2>
            <p className="room-type">{room ? room.notes : ''}</p>
          </div>

          <div className="detail-content">
            <h3 className="detail-title">{job.title}</h3>
            <p className="detail-description">{job.description}</p>

            {job.photo && (
              <div className="detail-photo">
                <img 
                  src={job.photo} 
                  alt="Job" 
                  onClick={() => onEnlargePhoto(job.photo)}
                />
              </div>
            )}

            <div className="detail-meta">
              <div className="meta-item">
                <span className="meta-label">Created:</span>
                <span className="meta-value">
                  {new Date(job.created_at).toLocaleDateString()} at{' '}
                  {new Date(job.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Last Updated:</span>
                <span className="meta-value">
                  {new Date(job.updated_at).toLocaleDateString()} at{' '}
                  {new Date(job.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          </div>

          {role === 'manager' && (
            <div className="detail-actions">
              <div className="status-buttons">
                <button
                  className={`status-btn ${job.status === 'Urgent' ? 'active' : ''}`}
                  onClick={() => handleStatusChange('Urgent')}
                  disabled={job.status === 'Urgent'}
                >
                  🚨 Urgent
                </button>
                <button
                  className={`status-btn ${job.status === 'To Do' ? 'active' : ''}`}
                  onClick={() => handleStatusChange('To Do')}
                  disabled={job.status === 'To Do'}
                >
                  📋 To Do
                </button>
                <button
                  className={`status-btn ${job.status === 'Done' ? 'active' : ''}`}
                  onClick={() => handleStatusChange('Done')}
                  disabled={job.status === 'Done'}
                >
                  ✅ Done
                </button>
              </div>

              <div className="action-buttons">
                <button className="btn-secondary" onClick={onEditJob}>
                  ✏️ Edit Job
                </button>
                <button 
                  className="btn-danger" 
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Deleting...' : '🗑️ Delete Job'}
                </button>
              </div>
            </div>
          )}

          {role === 'handyman' && (
            <div className="detail-actions">
              <button
                className="btn-primary full-width"
                onClick={() => handleStatusChange('Done')}
                disabled={job.status === 'Done'}
              >
                {job.status === 'Done' ? '✅ Completed' : '✅ Mark as Done'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function AddJobForm({ rooms, onBack, onSubmit, goToDashboard }) {
  const [formData, setFormData] = useState({
    room_id: '',
    title: '',
    description: '',
    status: 'To Do',
    original_status: 'To Do',
    photo: null,
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.room_id || !formData.title || !formData.description) {
      alert('Please fill in all required fields')
      return
    }
    onSubmit(formData)
  }

  const handlePhotoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, photo: reader.result }))
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="page-view">
      <AppHeader 
        showBackButton={true}
        onBack={onBack}
        goToDashboard={goToDashboard}
      />

      <div className="form-container">
        <h2>Add New Job</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Room *</label>
            <select
              value={formData.room_id}
              onChange={(e) => setFormData((prev) => ({ ...prev, room_id: parseInt(e.target.value) }))}
              required
            >
              <option value="">Select a room</option>
              {rooms.map((room) => (
                <option key={room.id} value={room.id}>
                  Room {room.room_number} - {room.notes} ({room.floor})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="e.g., Broken shower head"
              required
            />
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Describe the issue in detail..."
              rows={4}
              required
            />
          </div>

          <div className="form-group">
            <label>Status</label>
            <select
              value={formData.status}
              onChange={(e) => {
                const newStatus = e.target.value
                setFormData((prev) => ({
                  ...prev,
                  status: newStatus,
                  original_status: newStatus,
                }))
              }}
            >
              <option value="To Do">To Do</option>
              <option value="Urgent">Urgent</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label>Photo (optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
            />
            {formData.photo && (
              <div className="photo-preview">
                <img src={formData.photo} alt="Preview" />
              </div>
            )}
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onBack}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Create Job
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function EditJobForm({ job, rooms, onBack, onSubmit, goToDashboard }) {
  const [formData, setFormData] = useState({
    ...job,
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.room_id || !formData.title || !formData.description) {
      alert('Please fill in all required fields')
      return
    }
    onSubmit(formData)
  }

  const handlePhotoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, photo: reader.result }))
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="page-view">
      <AppHeader 
        showBackButton={true}
        onBack={onBack}
        goToDashboard={goToDashboard}
      />

      <div className="form-container">
        <h2>Edit Job</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Room *</label>
            <select
              value={formData.room_id}
              onChange={(e) => setFormData((prev) => ({ ...prev, room_id: parseInt(e.target.value) }))}
              required
            >
              {rooms.map((room) => (
                <option key={room.id} value={room.id}>
                  Room {room.room_number} - {room.notes} ({room.floor})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              required
            />
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              rows={4}
              required
            />
          </div>

          <div className="form-group">
            <label>Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value }))}
            >
              <option value="To Do">To Do</option>
              <option value="Urgent">Urgent</option>
              <option value="Done">Done</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label>Photo (optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
            />
            {formData.photo && (
              <div className="photo-preview">
                <img src={formData.photo} alt="Preview" />
              </div>
            )}
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onBack}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default HotelMaintenanceApp
