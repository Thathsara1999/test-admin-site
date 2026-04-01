import React, { useState, useEffect } from "react";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState({
    pending: 5,
    midwives: 12,
    parents: 28,
    babies: 45,
    recentActivity: [],
    monthlyGrowth: [],
  });

  // Mock data for demonstration
  const pendingMidwives = [
    {
      id: 1,
      firstName: "Sarah",
      lastName: "Johnson",
      email: "sarah.j@hospital.com",
      phone: "+1 234-567-8900",
      licenseNumber: "MW-2024-1234",
      hospital: "City General Hospital",
      registeredAt: "2024-02-01T10:30:00",
    },
    {
      id: 2,
      firstName: "Emily",
      lastName: "Chen",
      email: "emily.chen@clinic.com",
      phone: "+1 234-567-8901",
      licenseNumber: "MW-2024-5678",
      hospital: "Sunshine Medical Center",
      registeredAt: "2024-02-02T14:20:00",
    },
    {
      id: 3,
      firstName: "Maria",
      lastName: "Rodriguez",
      email: "maria.r@healthcenter.com",
      phone: "+1 234-567-8902",
      licenseNumber: "MW-2024-9012",
      hospital: "Community Health Clinic",
      registeredAt: "2024-02-03T09:15:00",
    },
  ];

  const approvedMidwives = [
    {
      id: 101,
      firstName: "Jessica",
      lastName: "Williams",
      email: "j.williams@hospital.com",
      phone: "+1 234-567-1001",
      licenseNumber: "MW-2023-1001",
      hospital: "Memorial Hospital",
    },
    {
      id: 102,
      firstName: "Amanda",
      lastName: "Taylor",
      email: "a.taylor@clinic.com",
      phone: "+1 234-567-1002",
      licenseNumber: "MW-2023-1002",
      hospital: "Riverside Clinic",
    },
    {
      id: 103,
      firstName: "Michelle",
      lastName: "Brown",
      email: "m.brown@medical.com",
      phone: "+1 234-567-1003",
      licenseNumber: "MW-2023-1003",
      hospital: "Central Medical",
    },
  ];

  const parents = [
    {
      id: 201,
      firstName: "John",
      lastName: "Smith",
      email: "john.smith@email.com",
      phone: "+1 555-0101",
      babyCards: 1,
    },
    {
      id: 202,
      firstName: "Emma",
      lastName: "Davis",
      email: "emma.d@email.com",
      phone: "+1 555-0102",
      babyCards: 2,
    },
    {
      id: 203,
      firstName: "Michael",
      lastName: "Wilson",
      email: "mike.w@email.com",
      phone: "+1 555-0103",
      babyCards: 1,
    },
  ];

  const babyCards = [
    {
      id: 301,
      babyName: "Oliver James",
      parentName: "John & Mary Smith",
      dob: "2024-01-15",
      gender: "Boy",
      weight: "3.5",
      length: "50",
    },
    {
      id: 302,
      babyName: "Sophia Grace",
      parentName: "Emma Davis",
      dob: "2024-01-20",
      gender: "Girl",
      weight: "3.2",
      length: "48",
    },
    {
      id: 303,
      babyName: "Liam Alexander",
      parentName: "Michael Wilson",
      dob: "2024-01-25",
      gender: "Boy",
      weight: "3.8",
      length: "52",
    },
  ];

  const recentActivity = [
    {
      type: "birth",
      message: "New baby card created: Sophia Grace",
      time: "2 hours ago",
      icon: "👶",
    },
    {
      type: "approval",
      message: "Midwife approved: Dr. Jessica Williams",
      time: "5 hours ago",
      icon: "✅",
    },
    {
      type: "registration",
      message: "New parent registered: Emma Davis",
      time: "1 day ago",
      icon: "📝",
    },
    {
      type: "pending",
      message: "Midwife pending approval: Sarah Johnson",
      time: "1 day ago",
      icon: "⏳",
    },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Comfortaa:wght@300;400;600;700&family=Poppins:wght@300;400;500;600;700&display=swap');
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Poppins', sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          background-attachment: fixed;
          min-height: 100vh;
          padding: 30px;
        }

        .admin-container {
          max-width: 1400px;
          margin: 0 auto;
        }

        .admin-header {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 25px;
          padding: 35px 45px;
          margin-bottom: 30px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
          display: flex;
          justify-content: space-between;
          align-items: center;
          border: 2px solid rgba(255, 255, 255, 0.3);
        }

        .admin-title {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .admin-icon {
          width: 70px;
          height: 70px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2.5em;
          box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
        }

        .admin-title h1 {
          font-family: 'Comfortaa', cursive;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-size: 2.5em;
          font-weight: 700;
        }

        .admin-title p {
          color: #7f8c8d;
          font-size: 1em;
          margin-top: 5px;
        }

        .logout-btn {
          padding: 15px 35px;
          background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
          color: white;
          border: none;
          border-radius: 15px;
          cursor: pointer;
          font-weight: 600;
          font-size: 1.05em;
          transition: all 0.3s ease;
          box-shadow: 0 8px 25px rgba(255, 107, 107, 0.3);
        }

        .logout-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 35px rgba(255, 107, 107, 0.4);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 25px;
          margin-bottom: 35px;
        }

        .stat-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          padding: 35px;
          border-radius: 25px;
          display: flex;
          align-items: center;
          gap: 25px;
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.1);
          border: 2px solid;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          position: relative;
          overflow: hidden;
        }

        .stat-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.2) 100%);
          opacity: 0;
          transition: opacity 0.3s;
        }

        .stat-card:hover::before {
          opacity: 1;
        }

        .stat-card:hover {
          transform: translateY(-10px) scale(1.02);
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.2);
        }

        .stat-pending {
          border-color: #f093fb;
          background: linear-gradient(135deg, #fff5fb 0%, #ffe8f5 100%);
        }

        .stat-midwives {
          border-color: #4facfe;
          background: linear-gradient(135deg, #f0f9ff 0%, #e0f4ff 100%);
        }

        .stat-parents {
          border-color: #43e97b;
          background: linear-gradient(135deg, #f0fff5 0%, #e0ffe8 100%);
        }

        .stat-babies {
          border-color: #fa709a;
          background: linear-gradient(135deg, #fff5f0 0%, #ffe8e0 100%);
        }

        .stat-icon-wrapper {
          width: 80px;
          height: 80px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2.8em;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
        }

        .stat-pending .stat-icon-wrapper {
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        }

        .stat-midwives .stat-icon-wrapper {
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
        }

        .stat-parents .stat-icon-wrapper {
          background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
        }

        .stat-babies .stat-icon-wrapper {
          background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
        }

        .stat-info h2 {
          font-size: 3em;
          font-weight: 700;
          margin-bottom: 5px;
          background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .stat-info p {
          color: #7f8c8d;
          font-size: 1.05em;
          font-weight: 500;
        }

        .stat-info .trend {
          font-size: 0.85em;
          margin-top: 5px;
          font-weight: 600;
        }

        .trend-up {
          color: #43e97b;
        }

        .trend-down {
          color: #f5576c;
        }

        .dashboard-content {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 25px;
          padding: 40px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
          border: 2px solid rgba(255, 255, 255, 0.3);
        }

        .tabs {
          display: flex;
          gap: 15px;
          margin-bottom: 35px;
          border-bottom: 3px solid #e0e0e0;
          padding-bottom: 5px;
          flex-wrap: wrap;
        }

        .tab {
          padding: 15px 30px;
          background: transparent;
          border: none;
          border-bottom: 3px solid transparent;
          cursor: pointer;
          font-weight: 600;
          color: #7f8c8d;
          transition: all 0.3s ease;
          font-size: 1.05em;
          border-radius: 10px 10px 0 0;
          position: relative;
        }

        .tab::before {
          content: '';
          position: absolute;
          bottom: -8px;
          left: 0;
          width: 100%;
          height: 3px;
          background: linear-gradient(90deg, #667eea, #764ba2);
          transform: scaleX(0);
          transition: transform 0.3s ease;
        }

        .tab:hover {
          color: #667eea;
          background: rgba(102, 126, 234, 0.05);
        }

        .tab.active {
          color: #667eea;
          background: rgba(102, 126, 234, 0.1);
        }

        .tab.active::before {
          transform: scaleX(1);
        }

        .tab-content {
          animation: fadeSlideIn 0.4s ease-out;
        }

        @keyframes fadeSlideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .overview-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 30px;
          margin-bottom: 30px;
        }

        .chart-card {
          background: linear-gradient(135deg, #f8f9ff 0%, #fff5f8 100%);
          border-radius: 20px;
          padding: 30px;
          border: 2px solid rgba(102, 126, 234, 0.2);
        }

        .chart-card h3 {
          font-family: 'Comfortaa', cursive;
          color: #2c3e50;
          margin-bottom: 25px;
          font-size: 1.5em;
        }

        .activity-feed {
          background: linear-gradient(135deg, #fff8f0 0%, #fff5e8 100%);
          border-radius: 20px;
          padding: 30px;
          border: 2px solid rgba(250, 112, 154, 0.2);
        }

        .activity-feed h3 {
          font-family: 'Comfortaa', cursive;
          color: #2c3e50;
          margin-bottom: 25px;
          font-size: 1.5em;
        }

        .activity-item {
          display: flex;
          gap: 15px;
          padding: 15px;
          background: white;
          border-radius: 12px;
          margin-bottom: 12px;
          border-left: 4px solid #fa709a;
          transition: all 0.3s;
        }

        .activity-item:hover {
          transform: translateX(5px);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }

        .activity-icon {
          font-size: 1.8em;
          width: 45px;
          height: 45px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(250, 112, 154, 0.1);
          border-radius: 10px;
        }

        .activity-content {
          flex: 1;
        }

        .activity-content p {
          color: #2c3e50;
          font-weight: 500;
          margin-bottom: 5px;
        }

        .activity-time {
          color: #95a5a6;
          font-size: 0.85em;
        }

        .pending-list {
          display: grid;
          gap: 20px;
        }

        .pending-item {
          background: white;
          border: 2px solid #f093fb;
          border-radius: 20px;
          padding: 30px;
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 30px;
          align-items: center;
          box-shadow: 0 10px 30px rgba(240, 147, 251, 0.15);
          transition: all 0.3s ease;
        }

        .pending-item:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 40px rgba(240, 147, 251, 0.25);
        }

        .pending-details h4 {
          font-family: 'Comfortaa', cursive;
          color: #2c3e50;
          font-size: 1.4em;
          margin-bottom: 15px;
        }

        .pending-details p {
          color: #7f8c8d;
          margin-bottom: 8px;
          font-size: 0.95em;
        }

        .pending-details strong {
          color: #f5576c;
          font-weight: 600;
        }

        .pending-badge {
          display: inline-block;
          padding: 6px 15px;
          background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%);
          border-radius: 20px;
          font-size: 0.85em;
          font-weight: 600;
          color: #f57c00;
          margin-top: 10px;
        }

        .action-buttons {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .btn {
          padding: 14px 28px;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          font-weight: 600;
          font-size: 1em;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .btn-approve {
          background: linear-gradient(135deg, #56ab2f 0%, #a8e063 100%);
          color: white;
          box-shadow: 0 8px 20px rgba(86, 171, 47, 0.3);
        }

        .btn-approve:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 30px rgba(86, 171, 47, 0.4);
        }

        .btn-reject {
          background: linear-gradient(135deg, #eb3349 0%, #f45c43 100%);
          color: white;
          box-shadow: 0 8px 20px rgba(235, 51, 73, 0.3);
        }

        .btn-reject:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 30px rgba(235, 51, 73, 0.4);
        }

        .user-grid {
          display: grid;
          gap: 20px;
        }

        .user-card {
          background: linear-gradient(135deg, #fafafa 0%, #f0f9ff 100%);
          padding: 30px;
          border-radius: 20px;
          border-left: 6px solid #4facfe;
          box-shadow: 0 8px 25px rgba(79, 172, 254, 0.15);
          transition: all 0.3s ease;
        }

        .user-card:hover {
          transform: translateX(8px);
          box-shadow: 0 12px 35px rgba(79, 172, 254, 0.25);
        }

        .user-card h4 {
          font-family: 'Comfortaa', cursive;
          color: #2c3e50;
          font-size: 1.3em;
          margin-bottom: 15px;
        }

        .user-card p {
          color: #7f8c8d;
          margin-bottom: 8px;
          font-size: 0.95em;
        }

        .user-card strong {
          color: #4facfe;
          font-weight: 600;
        }

        .baby-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 25px;
        }

        .baby-card {
          background: linear-gradient(135deg, #fff5f7 0%, #ffe8f0 100%);
          padding: 30px;
          border-radius: 25px;
          box-shadow: 0 10px 30px rgba(255, 107, 157, 0.15);
          border: 2px solid rgba(255, 182, 193, 0.3);
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          position: relative;
          overflow: hidden;
        }

        .baby-card::before {
          content: '💝';
          position: absolute;
          top: 15px;
          right: 15px;
          font-size: 3em;
          opacity: 0.1;
        }

        .baby-card:hover {
          transform: translateY(-10px) scale(1.02);
          box-shadow: 0 20px 50px rgba(255, 107, 157, 0.25);
        }

        .baby-card h4 {
          font-family: 'Comfortaa', cursive;
          color: #c44569;
          font-size: 1.6em;
          margin-bottom: 20px;
          font-weight: 700;
        }

        .baby-card p {
          color: #555;
          margin-bottom: 10px;
          padding-left: 8px;
          border-left: 3px solid #ffb3d9;
        }

        .baby-card strong {
          color: #c44569;
          font-weight: 600;
        }

        .empty-state {
          text-align: center;
          padding: 80px 40px;
          color: #bdc3c7;
        }

        .empty-state-icon {
          font-size: 5em;
          margin-bottom: 20px;
          opacity: 0.3;
        }

        .empty-state p {
          font-size: 1.2em;
        }

        @media (max-width: 1024px) {
          .overview-grid {
            grid-template-columns: 1fr;
          }

          .stats-grid {
            grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          }
        }

        @media (max-width: 768px) {
          .admin-header {
            flex-direction: column;
            gap: 20px;
            text-align: center;
          }

          .admin-title h1 {
            font-size: 2em;
          }

          .pending-item {
            grid-template-columns: 1fr;
          }

          .action-buttons {
            flex-direction: row;
          }

          .baby-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="admin-container">
        {/* Header */}
        <div className="admin-header">
          <div className="admin-title">
            <div className="admin-icon">🔐</div>
            <div>
              <h1>Admin Dashboard</h1>
              <p>Manage your Baby Card System</p>
            </div>
          </div>
          <button className="logout-btn">Logout</button>
        </div>

        {/* Statistics Cards */}
        <div className="stats-grid">
          <div className="stat-card stat-pending">
            <div className="stat-icon-wrapper">⏳</div>
            <div className="stat-info">
              <h2>{stats.pending}</h2>
              <p>Pending Approvals</p>
              <div className="trend trend-up">↑ 2 new today</div>
            </div>
          </div>

          <div className="stat-card stat-midwives">
            <div className="stat-icon-wrapper">👩‍⚕️</div>
            <div className="stat-info">
              <h2>{stats.midwives}</h2>
              <p>Approved Midwives</p>
              <div className="trend trend-up">↑ 15% this month</div>
            </div>
          </div>

          <div className="stat-card stat-parents">
            <div className="stat-icon-wrapper">👨‍👩‍👧</div>
            <div className="stat-info">
              <h2>{stats.parents}</h2>
              <p>Registered Parents</p>
              <div className="trend trend-up">↑ 8 new this week</div>
            </div>
          </div>

          <div className="stat-card stat-babies">
            <div className="stat-icon-wrapper">👶</div>
            <div className="stat-info">
              <h2>{stats.babies}</h2>
              <p>Baby Cards</p>
              <div className="trend trend-up">↑ 12 this month</div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="dashboard-content">
          {/* Tabs */}
          <div className="tabs">
            <button
              className={`tab ${activeTab === "overview" ? "active" : ""}`}
              onClick={() => setActiveTab("overview")}
            >
              📊 Overview
            </button>
            <button
              className={`tab ${activeTab === "pending" ? "active" : ""}`}
              onClick={() => setActiveTab("pending")}
            >
              🔔 Pending ({pendingMidwives.length})
            </button>
            <button
              className={`tab ${activeTab === "midwives" ? "active" : ""}`}
              onClick={() => setActiveTab("midwives")}
            >
              👩‍⚕️ Midwives
            </button>
            <button
              className={`tab ${activeTab === "parents" ? "active" : ""}`}
              onClick={() => setActiveTab("parents")}
            >
              👨‍👩‍👧 Parents
            </button>
            <button
              className={`tab ${activeTab === "babies" ? "active" : ""}`}
              onClick={() => setActiveTab("babies")}
            >
              👶 Baby Cards
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === "overview" && (
            <div className="tab-content">
              <div className="overview-grid">
                <div className="chart-card">
                  <h3>📈 System Growth</h3>
                  <div
                    style={{
                      padding: "40px",
                      textAlign: "center",
                      color: "#7f8c8d",
                    }}
                  >
                    <div style={{ fontSize: "4em", marginBottom: "20px" }}>
                      📊
                    </div>
                    <p>Monthly growth chart would be displayed here</p>
                    <p style={{ marginTop: "10px", fontSize: "0.9em" }}>
                      Showing registrations, births, and approvals
                    </p>
                  </div>
                </div>

                <div className="activity-feed">
                  <h3>🔔 Recent Activity</h3>
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="activity-item">
                      <div className="activity-icon">{activity.icon}</div>
                      <div className="activity-content">
                        <p>{activity.message}</p>
                        <span className="activity-time">{activity.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "pending" && (
            <div className="tab-content">
              <div className="pending-list">
                {pendingMidwives.map((midwife) => (
                  <div key={midwife.id} className="pending-item">
                    <div className="pending-details">
                      <h4>
                        👩‍⚕️ {midwife.firstName} {midwife.lastName}
                      </h4>
                      <p>
                        <strong>Email:</strong> {midwife.email}
                      </p>
                      <p>
                        <strong>Phone:</strong> {midwife.phone}
                      </p>
                      <p>
                        <strong>License:</strong> {midwife.licenseNumber}
                      </p>
                      <p>
                        <strong>Hospital:</strong> {midwife.hospital}
                      </p>
                      <span className="pending-badge">
                        ⏳ Pending since{" "}
                        {new Date(midwife.registeredAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="action-buttons">
                      <button className="btn btn-approve">✓ Approve</button>
                      <button className="btn btn-reject">✗ Reject</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "midwives" && (
            <div className="tab-content">
              <div className="user-grid">
                {approvedMidwives.map((midwife) => (
                  <div key={midwife.id} className="user-card">
                    <h4>
                      👩‍⚕️ {midwife.firstName} {midwife.lastName}
                    </h4>
                    <p>
                      <strong>Email:</strong> {midwife.email}
                    </p>
                    <p>
                      <strong>Phone:</strong> {midwife.phone}
                    </p>
                    <p>
                      <strong>License:</strong> {midwife.licenseNumber}
                    </p>
                    <p>
                      <strong>Hospital:</strong> {midwife.hospital}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "parents" && (
            <div className="tab-content">
              <div className="user-grid">
                {parents.map((parent) => (
                  <div key={parent.id} className="user-card">
                    <h4>
                      👨‍👩‍👧 {parent.firstName} {parent.lastName}
                    </h4>
                    <p>
                      <strong>Email:</strong> {parent.email}
                    </p>
                    <p>
                      <strong>Phone:</strong> {parent.phone}
                    </p>
                    <p>
                      <strong>Baby Cards:</strong> {parent.babyCards}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "babies" && (
            <div className="tab-content">
              <div className="baby-grid">
                {babyCards.map((baby) => (
                  <div key={baby.id} className="baby-card">
                    <h4>👶 {baby.babyName}</h4>
                    <p>
                      <strong>Parents:</strong> {baby.parentName}
                    </p>
                    <p>
                      <strong>Date of Birth:</strong>{" "}
                      {new Date(baby.dob).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                    <p>
                      <strong>Gender:</strong> {baby.gender}
                    </p>
                    <p>
                      <strong>Weight:</strong> {baby.weight} kg
                    </p>
                    <p>
                      <strong>Length:</strong> {baby.length} cm
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
