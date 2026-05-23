import React, { useContext, useEffect, useState } from "react";
import { AdminContext } from "../../context/AdminContext";

const CrmBoard = () => {
  const { crmTasks, getCrmTasks, createCrmTask, updateCrmTask, crmSummary, getCrmSummary } = useContext(AdminContext);
  const [title, setTitle] = useState("");
  const [patientName, setPatientName] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("MEDIUM");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    getCrmTasks({ status: statusFilter });
    getCrmSummary();
  }, [statusFilter]);

  const onCreate = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    const ok = await createCrmTask({
      title: title.trim(),
      patientName: patientName.trim(),
      description: description.trim(),
      priority,
    });
    if (ok) {
      setTitle("");
      setPatientName("");
      setDescription("");
      setPriority("MEDIUM");
      getCrmTasks({ status: statusFilter });
      getCrmSummary();
    }
  };

  const onStatusChange = async (taskId, status) => {
    const ok = await updateCrmTask(taskId, { status });
    if (ok) {
      getCrmTasks({ status: statusFilter });
      getCrmSummary();
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'HIGH': return 'bg-red-50 text-red-700';
      case 'MEDIUM': return 'bg-orange-50 text-orange-700';
      case 'LOW': return 'bg-gray-50 text-gray-600';
      default: return 'bg-gray-50 text-gray-600';
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-light text-gray-900">CRM Board</h2>
        <p className="text-sm text-gray-500 mt-1">Track clinic tasks and follow-ups</p>
      </div>

      {crmSummary && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white border border-gray-100 rounded-xl p-4">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Open</p>
            <p className="text-2xl font-medium text-gray-900 mt-1">{crmSummary.open}</p>
          </div>
          <div className="bg-white border border-gray-100 rounded-xl p-4">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">In Progress</p>
            <p className="text-2xl font-medium text-gray-900 mt-1">{crmSummary.inProgress}</p>
          </div>
          <div className="bg-white border border-gray-100 rounded-xl p-4">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Done</p>
            <p className="text-2xl font-medium text-gray-900 mt-1">{crmSummary.done}</p>
          </div>
          <div className="bg-white border border-gray-100 rounded-xl p-4">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">High Priority</p>
            <p className="text-2xl font-medium text-red-600 mt-1">{crmSummary.highPriorityPending}</p>
          </div>
        </div>
      )}

      <form onSubmit={onCreate} className="bg-white border border-gray-100 rounded-xl p-5 grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-1.5">Task Title</label>
          <input 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" 
            placeholder="Call patient for follow-up" 
            required 
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-1.5">Patient Name</label>
          <input 
            value={patientName} 
            onChange={(e) => setPatientName(e.target.value)} 
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" 
            placeholder="Optional" 
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-1.5">Description</label>
          <textarea 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none" 
            rows={2} 
            placeholder="Task details..."
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-1.5">Priority</label>
          <select 
            value={priority} 
            onChange={(e) => setPriority(e.target.value)} 
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-white"
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <button className="px-6 py-2.5 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors duration-150">
            Create Task
          </button>
        </div>
      </form>

      <div className="flex items-center gap-3 mb-4">
        <p className="text-sm font-medium text-gray-700">Filter:</p>
        <select 
          value={statusFilter} 
          onChange={(e) => setStatusFilter(e.target.value)} 
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-white"
        >
          <option value="">All</option>
          <option value="OPEN">Open</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="DONE">Done</option>
        </select>
      </div>

      <div className="space-y-3">
        {crmTasks.length === 0 ? (
          <p className="text-sm text-gray-400 py-8 text-center">No CRM tasks found.</p>
        ) : (
          crmTasks.map((task) => (
            <div key={task.id} className="bg-white border border-gray-100 rounded-xl p-4 hover:border-gray-200 transition-colors">
              <div className="flex flex-wrap justify-between gap-4">
                <div className="flex-1 min-w-[200px]">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-gray-900">{task.title}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">{task.patientName || "General task"}</p>
                  {task.description && (
                    <p className="text-sm text-gray-600 mt-2">{task.description}</p>
                  )}
                </div>
                <div className="min-w-[160px]">
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">Status</label>
                  <select
                    value={task.status}
                    onChange={(e) => onStatusChange(task.id, e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-white"
                  >
                    <option value="OPEN">Open</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="DONE">Done</option>
                  </select>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CrmBoard;
