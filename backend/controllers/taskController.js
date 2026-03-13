const Task = require("../models/Task");

// Helper to safely emit socket events
const emit = (event, data) => {
  if (global.io) global.io.emit(event, data);
};

// GET tasks - admin sees all, user sees own/assigned
exports.getTasks = async (req, res) => {
  try {
    let query = {};
    if (req.user.role !== "admin") {
      query = {
        $or: [{ createdBy: req.user._id }, { assignedTo: req.user._id }],
      };
    }
    const tasks = await Task.find(query)
      .populate("createdBy", "name email")
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// GET stats
exports.getStats = async (req, res) => {
  try {
    let query = {};
    if (req.user.role !== "admin") {
      query = {
        $or: [{ createdBy: req.user._id }, { assignedTo: req.user._id }],
      };
    }

    const [total, completed, inProgress, todo] = await Promise.all([
      Task.countDocuments(query),
      Task.countDocuments({ ...query, status: "completed" }),
      Task.countDocuments({ ...query, status: "in-progress" }),
      Task.countDocuments({ ...query, status: "todo" }),
    ]);

    res.json({ total, completed, inProgress, todo });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// CREATE task
exports.createTask = async (req, res) => {
  try {
    const { title, description, priority, assignedTo, dueDate } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const task = await Task.create({
      title,
      description,
      priority: priority || "medium",
      assignedTo: assignedTo || null,
      createdBy: req.user._id,
      dueDate: dueDate || null,
    });

    const populated = await task.populate([
      { path: "createdBy", select: "name email" },
      { path: "assignedTo", select: "name email" },
    ]);

    // Emit real-time event to all connected clients
    emit("taskCreated", populated);

    res.status(201).json(populated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Task creation failed" });
  }
};

// UPDATE task
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    if (req.user.role !== "admin") {
      const isAssigned =
        task.assignedTo?.toString() === req.user._id.toString() ||
        task.createdBy?.toString() === req.user._id.toString();
      if (!isAssigned) {
        return res.status(403).json({ message: "Not authorized" });
      }
      const { status } = req.body;
      task.status = status || task.status;
    } else {
      const { title, description, priority, status, assignedTo, dueDate } = req.body;
      if (title !== undefined) task.title = title;
      if (description !== undefined) task.description = description;
      if (priority !== undefined) task.priority = priority;
      if (status !== undefined) task.status = status;
      if (assignedTo !== undefined) task.assignedTo = assignedTo || null;
      if (dueDate !== undefined) task.dueDate = dueDate || null;
    }

    await task.save();
    await task.populate([
      { path: "createdBy", select: "name email" },
      { path: "assignedTo", select: "name email" },
    ]);

    // Emit real-time event
    emit("taskUpdated", task);

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: "Task update failed" });
  }
};

// DELETE task - admin only
exports.deleteTask = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admin can delete tasks" });
    }

    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    // Emit real-time event with deleted task id
    emit("taskDeleted", { _id: req.params.id });

    res.json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ message: "Task delete failed" });
  }
};
