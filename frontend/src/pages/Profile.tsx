import React from 'react'

const Profile = () => {
  return (
    <div  className="bg-gray-100 min-h-screen pb-4 dark:bg-gray-950">
        {/* Header */}
        <div className="bg-primary/40 py-3">
            <div className="text-xl text-secondary text-center font-semibold uppercase">
                {categoryDetails?.title ? categoryDetails.title : "Loading..."}
            </div>
        </div>
    </div>
  )
}

export default Profile