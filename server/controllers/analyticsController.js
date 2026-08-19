const Task = require('../models/Task');
const mongoose = require('mongoose');

// @desc    Get user analytics reports
// @route   GET /api/analytics
// @access  Protected
const getAnalytics = async (req, res) => {
  try {
    const userId = req.user._id;
    const requestTime = new Date().toISOString();
    console.log(`[Analytics] Fetching analytics for user ${userId} at ${requestTime}`);

    // 1. Basic Stats (Total, Completed, Pending, Rate)
    const totalTasks = await Task.countDocuments({ userId });
    const completedTasks = await Task.countDocuments({ userId, status: 'completed' });
    const pendingTasks = await Task.countDocuments({ userId, status: 'pending' });
    const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    console.log(`[Analytics] Summary - Total: ${totalTasks}, Completed: ${completedTasks}, Pending: ${pendingTasks}, %: ${completionPercentage}`);

    // 2. Subject-wise Stats (Total & Completed per subject)
    const subjectStats = await Task.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: '$subject',
          total: { $sum: 1 },
          completed: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] },
          },
          pending: {
            $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] },
          },
        },
      },
      {
        $project: {
          subject: '$_id',
          total: 1,
          completed: 1,
          pending: 1,
          rate: {
            $cond: [
              { $gt: ['$total', 0] },
              { $round: [{ $multiply: [{ $divide: ['$completed', '$total'] }, 100] }, 0] },
              0,
            ],
          },
        },
      },
      { $sort: { subject: 1 } },
    ]);

    console.log(`[Analytics] Subject stats computed for ${subjectStats.length} subjects`);

    // 3. Weekly Productivity (Completed tasks grouped by day of week)
    // We will look at tasks marked as completed, grouped by their updatedAt day.
    // To ensure the chart is populated even if there are few completed tasks,
    // we'll get the count of completed tasks in the last 7 days.
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const weeklyProductivityRaw = await Task.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          status: 'completed',
          updatedAt: { $gte: sevenDaysAgo },
        },
      },
      {
        $group: {
          _id: { $dayOfWeek: '$updatedAt' }, // 1 (Sun) to 7 (Sat)
          count: { $sum: 1 },
        },
      },
    ]);

    // Map day numbers (1-7) to day names (Sun-Sat) and fill missing days
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    // We want the chart to display the last 7 days chronologically
    const weeklyProductivity = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dayName = dayNames[d.getDay()];
      const dayOfWeekNum = d.getDay() + 1; // Mongo dayOfWeek is 1-indexed (1=Sun)
      
      const found = weeklyProductivityRaw.find(item => item._id === dayOfWeekNum);
      weeklyProductivity.push({
        day: dayName,
        completedCount: found ? found.count : 0,
      });
    }

    console.log(`[Analytics] Weekly productivity computed, total completed in last 7 days: ${weeklyProductivity.reduce((sum, day) => sum + day.completedCount, 0)}`);

    const responseData = {
      summary: {
        totalTasks,
        completedTasks,
        pendingTasks,
        completionPercentage,
      },
      subjectStats,
      weeklyProductivity,
    };
    
    console.log(`[Analytics] Returning analytics response for user ${userId}`);
    res.json(responseData);
  } catch (error) {
    console.error('[Analytics] Error fetching analytics:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAnalytics };
