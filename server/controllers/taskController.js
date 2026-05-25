const Task = require('../models/Task');

// @desc    Get all user tasks (with search, filter, sort)
// @route   GET /api/tasks
// @access  Protected
const getTasks = async (req, res) => {
  try {
    const { subject, status, search, sortBy } = req.query;
    const query = { userId: req.user._id };

    // Filtering by subject
    if (subject && subject !== 'All') {
      query.subject = subject;
    }

    // Filtering by status
    if (status && status !== 'All') {
      query.status = status;
    }

    // Searching in title or description
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    let apiQuery = Task.find(query);

    // Sorting by deadline or createdAt
    if (sortBy === 'deadline-asc') {
      apiQuery = apiQuery.sort({ deadline: 1 });
    } else if (sortBy === 'deadline-desc') {
      apiQuery = apiQuery.sort({ deadline: -1 });
    } else if (sortBy === 'created-desc') {
      apiQuery = apiQuery.sort({ createdAt: -1 });
    } else {
      apiQuery = apiQuery.sort({ deadline: 1 }); // Default
    }

    const tasks = await apiQuery;
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Protected
const createTask = async (req, res) => {
  const { subject, title, description, deadline } = req.body;

  try {
    if (!subject || !title || !deadline) {
      return res.status(400).json({ message: 'Subject, Title, and Deadline are required' });
    }

    const task = await Task.create({
      userId: req.user._id,
      subject,
      title,
      description: description || '',
      deadline: new Date(deadline),
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a task (including status checkoff)
// @route   PUT /api/tasks/:id
// @access  Protected
const updateTask = async (req, res) => {
  const { id } = req.params;
  const { subject, title, description, deadline, status } = req.body;

  try {
    let task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check ownership
    if (task.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    // Update fields
    if (subject) task.subject = subject;
    if (title) task.title = title;
    if (description !== undefined) task.description = description;
    if (deadline) task.deadline = new Date(deadline);
    if (status) task.status = status;

    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Protected
const deleteTask = async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check ownership
    if (task.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    await task.deleteOne();
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
};
