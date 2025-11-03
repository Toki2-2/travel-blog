import React, { useState } from 'react';

const TravelLogs = () => {
  const [logs, setLogs] = useState([]);
  const [newLog, setNewLog] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    tags: ''
  });

  const handleAddLog = () => {
    const tagsArray = newLog.tags.split(',').map(tag => tag.trim());
    const logToAdd = {
      ...newLog,
      id: Date.now(),
      tags: tagsArray
    };
    setLogs([...logs, logToAdd]);
    setNewLog({
      title: '',
      description: '',
      startDate: '',
      endDate: '',
      tags: ''
    });
  };

  const handleDeleteLog = (id) => {
    setLogs(logs.filter(log => log.id !== id));
  };

  return (
    <div>
      <h2>Travel Logs</h2>
      
      <div>
        <h3>Add New Log</h3>
        <input
          type="text"
          placeholder="Title"
          value={newLog.title}
          onChange={(e) => setNewLog({...newLog, title: e.target.value})}
        />
        <textarea
          placeholder="Description"
          value={newLog.description}
          onChange={(e) => setNewLog({...newLog, description: e.target.value})}
        />
        <input
          type="date"
          value={newLog.startDate}
          onChange={(e) => setNewLog({...newLog, startDate: e.target.value})}
        />
        <input
          type="date"
          value={newLog.endDate}
          onChange={(e) => setNewLog({...newLog, endDate: e.target.value})}
        />
        <input
          type="text"
          placeholder="Tags (comma separated)"
          value={newLog.tags}
          onChange={(e) => setNewLog({...newLog, tags: e.target.value})}
        />
        <button onClick={handleAddLog}>Add Log</button>
      </div>

      <div>
        <h3>Your Logs</h3>
        {logs.map(log => (
          <div key={log.id}>
            <h4>{log.title}</h4>
            <p>{log.description}</p>
            <p>Dates: {log.startDate} to {log.endDate}</p>
            <p>Tags: {log.tags.join(', ')}</p>
            <button onClick={() => handleDeleteLog(log.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TravelLogs;