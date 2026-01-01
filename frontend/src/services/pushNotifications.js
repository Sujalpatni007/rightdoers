/**
 * Push Notification Service for HI AI App
 * Sends browser notifications for ORBIT achievements and 80%+ readiness milestones
 */

// Check if browser supports notifications
export const isNotificationSupported = () => {
  return 'Notification' in window && 'serviceWorker' in navigator;
};

// Request notification permission
export const requestNotificationPermission = async () => {
  if (!isNotificationSupported()) {
    console.log('Push notifications not supported');
    return false;
  }

  const permission = await Notification.requestPermission();
  return permission === 'granted';
};

// Get current permission status
export const getNotificationPermission = () => {
  if (!isNotificationSupported()) return 'unsupported';
  return Notification.permission;
};

// Send a push notification
export const sendNotification = (title, options = {}) => {
  if (getNotificationPermission() !== 'granted') {
    console.log('Notification permission not granted');
    return null;
  }

  const defaultOptions = {
    icon: '/logo192.png',
    badge: '/logo192.png',
    vibrate: [200, 100, 200],
    requireInteraction: false,
    ...options
  };

  try {
    const notification = new Notification(title, defaultOptions);
    
    notification.onclick = () => {
      window.focus();
      notification.close();
      if (options.onClick) options.onClick();
    };

    return notification;
  } catch (error) {
    console.error('Notification error:', error);
    return null;
  }
};

// Milestone notification types
export const MilestoneNotifications = {
  // ORBIT Achievement - Highest priority
  orbitAchieved: (verticalCode, leaderName) => sendNotification(
    `🚀 ORBIT ACHIEVED - ${verticalCode}!`,
    {
      body: `${leaderName} has reached self-sustaining productivity! Time to celebrate!`,
      tag: `orbit-${verticalCode}`,
      requireInteraction: true,
      data: { type: 'orbit', vertical: verticalCode },
      actions: [
        { action: 'view', title: 'View Mission Board' },
        { action: 'celebrate', title: '🎉 Celebrate!' }
      ]
    }
  ),

  // 80% Readiness Milestone
  highReadiness: (verticalCode, percentage) => sendNotification(
    `📈 ${verticalCode} at ${percentage}% Readiness!`,
    {
      body: `Almost there! ${verticalCode} is ready for Dubai launch!`,
      tag: `readiness-${verticalCode}`,
      data: { type: 'readiness', vertical: verticalCode, percentage }
    }
  ),

  // Leader Assigned
  leaderAssigned: (verticalCode, leaderName) => sendNotification(
    `🎖️ New Leader: ${verticalCode}`,
    {
      body: `${leaderName} has been assigned to lead ${verticalCode}`,
      tag: `leader-${verticalCode}`,
      data: { type: 'leader', vertical: verticalCode }
    }
  ),

  // Kata Completion
  kataCompleted: (verticalCode, kataNumber, leaderName) => sendNotification(
    `📚 Kata ${kataNumber} Complete - ${verticalCode}`,
    {
      body: `${leaderName} has completed Kata ${kataNumber}. Progress!`,
      tag: `kata-${verticalCode}-${kataNumber}`,
      data: { type: 'kata', vertical: verticalCode, kata: kataNumber }
    }
  ),

  // Launch Countdown Milestones
  launchCountdown: (daysRemaining) => {
    if (daysRemaining <= 0) {
      return sendNotification(
        `🚀 DUBAI LAUNCH DAY!`,
        {
          body: `The moment is here! HI AI APP is launching globally!`,
          tag: 'launch-day',
          requireInteraction: true
        }
      );
    }
    return sendNotification(
      `⏰ ${daysRemaining} Days to Dubai Launch!`,
      {
        body: `Check the Mission Board to see team progress.`,
        tag: `countdown-${daysRemaining}`,
        data: { type: 'countdown', days: daysRemaining }
      }
    );
  },

  // First Win
  firstWin: (verticalCode, description) => sendNotification(
    `🏆 First Win - ${verticalCode}!`,
    {
      body: description || 'A major milestone has been achieved!',
      tag: `win-${verticalCode}`,
      data: { type: 'win', vertical: verticalCode }
    }
  ),

  // Team Expansion
  teamExpanded: (verticalCode, newSize) => sendNotification(
    `👥 Team Growing - ${verticalCode}`,
    {
      body: `Team size is now ${newSize}. Building momentum!`,
      tag: `team-${verticalCode}`,
      data: { type: 'team', vertical: verticalCode, size: newSize }
    }
  )
};

// Subscribe to mission board updates and trigger notifications
export class MissionBoardNotifier {
  constructor(apiUrl) {
    this.apiUrl = apiUrl;
    this.previousState = null;
    this.checkInterval = null;
  }

  // Start monitoring for changes
  start(intervalMs = 60000) {
    // Initial check
    this.checkForUpdates();
    
    // Set up periodic checks
    this.checkInterval = setInterval(() => {
      this.checkForUpdates();
    }, intervalMs);
  }

  // Stop monitoring
  stop() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }

  // Check for updates and send notifications
  async checkForUpdates() {
    try {
      const response = await fetch(`${this.apiUrl}/api/captain/mission-board`);
      const data = await response.json();

      if (!this.previousState) {
        this.previousState = data;
        return;
      }

      // Compare with previous state and send notifications
      data.verticals_progress.forEach((vertical, idx) => {
        const prev = this.previousState.verticals_progress[idx];

        // Check for ORBIT achievement
        if (vertical.is_orbit && !prev.is_orbit) {
          MilestoneNotifications.orbitAchieved(
            vertical.code,
            vertical.leader_name || 'Team'
          );
        }

        // Check for 80% readiness milestone
        if (vertical.readiness_percent >= 80 && prev.readiness_percent < 80) {
          MilestoneNotifications.highReadiness(
            vertical.code,
            vertical.readiness_percent
          );
        }

        // Check for new leader assignment
        if (vertical.leader_name && !prev.leader_name) {
          MilestoneNotifications.leaderAssigned(
            vertical.code,
            vertical.leader_name
          );
        }
      });

      // Check for countdown milestones
      const prevDays = this.previousState.days_to_launch;
      const currentDays = data.days_to_launch;
      
      if (currentDays !== prevDays && [7, 3, 1, 0].includes(currentDays)) {
        MilestoneNotifications.launchCountdown(currentDays);
      }

      this.previousState = data;
    } catch (error) {
      console.error('Mission board check failed:', error);
    }
  }
}

// Export singleton instance
export const missionNotifier = new MissionBoardNotifier(
  process.env.REACT_APP_BACKEND_URL
);
