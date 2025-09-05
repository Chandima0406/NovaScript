import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaRegBell, FaCheck, FaFilter } from 'react-icons/fa';
import Notification from '../components/Notification';
import DashboardNav from '../components/DashboardNav';
import { 
  getUserNotifications, 
  markNotificationAsRead, 
  markAllNotificationsAsRead, 
  deleteNotification 
} from '../api';
import '../styles/NotificationsPage.css';

const NotificationsPage = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [unreadCount, setUnreadCount] = useState(0);  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'unread', 'read'
  
  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const onlyUnread = filter === 'unread';
      const response = await getUserNotifications(page, 15, onlyUnread);
      
      let filteredNotifications = response.data.notifications;
      
      // Filter by read status if needed and not already filtered by API
      if (filter === 'read') {
        filteredNotifications = filteredNotifications.filter(note => note.isRead);
      }
      
      setNotifications(filteredNotifications);
      setTotalPages(response.data.totalPages);
      setUnreadCount(response.data.unreadCount);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  }, [page, filter]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleMarkAsRead = async (id) => {
    try {
      await markNotificationAsRead(id);
      setNotifications(notifications.map(note => 
        note._id === id ? { ...note, isRead: true } : note
      ));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Error marking notification as read:', err);
      setError('Failed to update notification');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications(notifications.map(note => ({ ...note, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Error marking all as read:', err);
      setError('Failed to update notifications');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteNotification(id);
      const updatedNotifications = notifications.filter(note => note._id !== id);
      setNotifications(updatedNotifications);
      
      // Update unread count if deleted notification was unread
      const deletedNote = notifications.find(note => note._id === id);
      if (deletedNote && !deletedNote.isRead) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error('Error deleting notification:', err);
      setError('Failed to delete notification');
    }
  };  const handleNotificationClick = (notification) => {
    // Mark notification as read when clicked
    if (!notification.isRead) {
      handleMarkAsRead(notification._id);
    }
    
    // Handle navigation for survey notifications
    if (notification.relatedItem && notification.type === 'survey') {
      // Navigate to researcher dashboard and switch to surveys tab with specific survey ID
      navigate(`/researcher-dashboard?tab=surveys&surveyId=${notification.relatedItem}`);
    }
  };

  return (
    <div className="notifications-page">
      <DashboardNav />
      
      <div className="notifications-page-content">
        <div className="notifications-page-header">
          <div className="notifications-page-title">
            <h1>Notifications</h1>
            <span className="notifications-count">
              {unreadCount} unread
            </span>
          </div>
          
          <div className="notifications-actions">            <div className="filter-dropdown">
              <button className="filter-btn">
                <FaFilter /> Filter <span className="current-filter">{filter}</span>
              </button>
              <div className="filter-options">
                <button 
                  className={filter === 'all' ? 'active' : ''}
                  onClick={() => setFilter('all')}
                >
                  All
                </button>
                <button 
                  className={filter === 'unread' ? 'active' : ''}
                  onClick={() => setFilter('unread')}
                >
                  Unread
                </button>
                <button 
                  className={filter === 'read' ? 'active' : ''}
                  onClick={() => setFilter('read')}
                >
                  Read
                </button>
              </div>
            </div>
            
            {unreadCount > 0 && (
              <button 
                className="mark-all-read-btn" 
                onClick={handleMarkAllAsRead}
              >
                <FaCheck /> Mark all as read
              </button>
            )}
          </div>
        </div>
        
        <div className="notifications-page-list">
          {loading ? (
            <div className="notifications-loading">Loading notifications...</div>
          ) : error ? (
            <div className="notifications-error">
              <p>{error}</p>
              <button onClick={fetchNotifications}>Try Again</button>
            </div>
          ) : notifications.length === 0 ? (
            <div className="notifications-empty">
              <FaRegBell />
              <h3>No notifications</h3>
              <p>You're all caught up! We'll let you know when there's something new.</p>
            </div>
          ) : (
            notifications.map(notification => (
              <Notification
                key={notification._id}
                notification={notification}
                onMarkAsRead={handleMarkAsRead}
                onDelete={handleDelete}
                onClick={handleNotificationClick}
              />
            ))
          )}
        </div>
        
        {totalPages > 1 && (
          <div className="notifications-pagination">
            <button 
              disabled={page === 1}
              onClick={() => setPage(prev => Math.max(1, prev - 1))}
            >
              Previous
            </button>
            
            <div className="pagination-numbers">
              {[...Array(Math.min(5, totalPages)).keys()].map(i => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (page <= 3) {
                  pageNum = i + 1;
                } else if (page >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = page - 2 + i;
                }
                
                return (
                  <button
                    key={i}
                    className={page === pageNum ? 'active' : ''}
                    onClick={() => setPage(pageNum)}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            
            <button 
              disabled={page === totalPages}
              onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
