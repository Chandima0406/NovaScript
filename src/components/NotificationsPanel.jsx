import React, { useEffect, useState, useCallback } from 'react';
import { FaBell, FaCheck, FaRegBell } from 'react-icons/fa';
import Notification from './Notification';
import { 
  getUserNotifications, 
  markNotificationAsRead, 
  markAllNotificationsAsRead, 
  deleteNotification 
} from '../api';
import '../styles/NotificationsPanel.css';

const NotificationsPanel = ({ onNavigate }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState(null);
  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getUserNotifications(page, 10);
      setNotifications(response.data.notifications);
      setTotalPages(response.data.totalPages);
      setUnreadCount(response.data.unreadCount);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  }, [page]);
  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen, page, fetchNotifications]);

  // Periodically check for new notifications (every 2 minutes)
  useEffect(() => {
    const checkForNewNotifications = async () => {
      try {
        const response = await getUserNotifications(1, 1, true);
        setUnreadCount(response.data.unreadCount);
      } catch (err) {
        console.error('Error checking for new notifications:', err);
      }
    };
    
    // Check initially
    checkForNewNotifications();
    
    // Set up interval
    const interval = setInterval(checkForNewNotifications, 120000); // 2 minutes
    
    return () => clearInterval(interval);
  }, []);

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
      onNavigate && onNavigate(`/researcher-dashboard?tab=surveys&surveyId=${notification.relatedItem}`);
    } else {
      // If no related item, navigate to notifications page
      onNavigate && onNavigate('/notifications');
    }
    setIsOpen(false);
  };

  const togglePanel = () => setIsOpen(!isOpen);

  return (
    <div className="notifications-container">
      <button 
        className="notifications-toggle-btn" 
        onClick={togglePanel}
        aria-label="Notifications"
      >
        {unreadCount > 0 ? (
          <>
            <FaBell />
            <span className="unread-count">{unreadCount}</span>
          </>
        ) : (
          <FaRegBell />
        )}
      </button>

      {isOpen && (
        <div className="notifications-panel">          <div className="notifications-header">
            <h3>Notifications</h3>
            <div className="notifications-header-actions">
              {notifications.length > 0 && (
                <button 
                  className="mark-all-read-btn" 
                  onClick={handleMarkAllAsRead}
                  disabled={unreadCount === 0}
                >
                  <FaCheck /> Mark all as read
                </button>
              )}
              <button 
                className="view-all-btn" 
                onClick={() => onNavigate && onNavigate('/notifications')}
              >
                View all
              </button>
            </div>
          </div>
          
          <div className="notifications-body">
            {loading ? (
              <div className="notifications-loading">Loading...</div>
            ) : error ? (
              <div className="notifications-error">{error}</div>
            ) : notifications.length === 0 ? (
              <div className="notifications-empty">
                <FaRegBell />
                <h4>No notifications</h4>
                <p>You're all caught up!</p>
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
              <span>{`Page ${page} of ${totalPages}`}</span>
              <button 
                disabled={page === totalPages}
                onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationsPanel;
