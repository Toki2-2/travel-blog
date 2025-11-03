import React, { useState } from 'react';

const JourneyPlans = () => {
  const [plans, setPlans] = useState([]);
  const [newPlan, setNewPlan] = useState({
    name: '',
    locations: '',
    startDate: '',
    endDate: '',
    activities: '',
    description: ''
  });

  const handleAddPlan = () => {
    const locationsArray = newPlan.locations.split(',').map(loc => loc.trim());
    const activitiesArray = newPlan.activities.split(',').map(act => act.trim());
    
    const planToAdd = {
      ...newPlan,
      id: Date.now(),
      locations: locationsArray,
      activities: activitiesArray
    };
    
    setPlans([...plans, planToAdd]);
    setNewPlan({
      name: '',
      locations: '',
      startDate: '',
      endDate: '',
      activities: '',
      description: ''
    });
  };

  const handleDeletePlan = (id) => {
    setPlans(plans.filter(plan => plan.id !== id));
  };

  return (
    <div>
      <h2>Journey Plans</h2>
      
      <div>
        <h3>Create New Plan</h3>
        <input
          type="text"
          placeholder="Plan Name"
          value={newPlan.name}
          onChange={(e) => setNewPlan({...newPlan, name: e.target.value})}
        />
        <input
          type="text"
          placeholder="Locations (comma separated)"
          value={newPlan.locations}
          onChange={(e) => setNewPlan({...newPlan, locations: e.target.value})}
        />
        <input
          type="date"
          value={newPlan.startDate}
          onChange={(e) => setNewPlan({...newPlan, startDate: e.target.value})}
        />
        <input
          type="date"
          value={newPlan.endDate}
          onChange={(e) => setNewPlan({...newPlan, endDate: e.target.value})}
        />
        <input
          type="text"
          placeholder="Activities (comma separated)"
          value={newPlan.activities}
          onChange={(e) => setNewPlan({...newPlan, activities: e.target.value})}
        />
        <textarea
          placeholder="Description"
          value={newPlan.description}
          onChange={(e) => setNewPlan({...newPlan, description: e.target.value})}
        />
        <button onClick={handleAddPlan}>Save Plan</button>
      </div>

      <div>
        <h3>Your Plans</h3>
        {plans.map(plan => (
          <div key={plan.id}>
            <h4>{plan.name}</h4>
            <p>{plan.description}</p>
            <p>Locations: {plan.locations.join(', ')}</p>
            <p>Dates: {plan.startDate} to {plan.endDate}</p>
            <p>Activities: {plan.activities.join(', ')}</p>
            <button onClick={() => handleDeletePlan(plan.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JourneyPlans;