const db = require('../config/db');

const getPlans = async (req, res) => {
  try {
    // Get basic plan info
    const [plans] = await db.query(
      'SELECT * FROM journey_plans WHERE user_id = ?',
      [req.userId]
    );

    // Get locations and activities for each plan
    for (const plan of plans) {
      const [locations] = await db.query(
        'SELECT location FROM locations WHERE plan_id = ?',
        [plan.id]
      );
      plan.locations = locations.map(l => l.location);

      const [activities] = await db.query(
        'SELECT activity FROM activities WHERE plan_id = ?',
        [plan.id]
      );
      plan.activities = activities.map(a => a.activity);
    }

    res.json(plans);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const addPlan = async (req, res) => {
  try {
    const { name, description, start_date, end_date, locations, activities } = req.body;
    
    // Start transaction
    await db.query('START TRANSACTION');

    // 1. Create the main plan
    const [planResult] = await db.query(
      'INSERT INTO journey_plans (user_id, name, description, start_date, end_date) VALUES (?, ?, ?, ?, ?)',
      [req.userId, name, description, start_date, end_date]
    );
    const planId = planResult.insertId;

    // 2. Add locations
    if (locations && locations.length > 0) {
      const locationValues = locations.map(location => [planId, location]);
      await db.query(
        'INSERT INTO locations (plan_id, location) VALUES ?',
        [locationValues]
      );
    }

    // 3. Add activities
    if (activities && activities.length > 0) {
      const activityValues = activities.map(activity => [planId, activity]);
      await db.query(
        'INSERT INTO activities (plan_id, activity) VALUES ?',
        [activityValues]
      );
    }

    // Commit transaction
    await db.query('COMMIT');
    
    res.status(201).json({ id: planId });
  } catch (err) {
    // Rollback on error
    await db.query('ROLLBACK');
    res.status(500).json({ message: err.message });
  }
};

const updatePlan = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, start_date, end_date, locations, activities } = req.body;

    // Verify plan belongs to user
    const [plans] = await db.query(
      'SELECT id FROM journey_plans WHERE id = ? AND user_id = ?',
      [id, req.userId]
    );
    
    if (plans.length === 0) {
      return res.status(404).json({ message: 'Plan not found' });
    }

    await db.query('START TRANSACTION');

    // 1. Update main plan
    await db.query(
      'UPDATE journey_plans SET name = ?, description = ?, start_date = ?, end_date = ? WHERE id = ?',
      [name, description, start_date, end_date, id]
    );

    // 2. Update locations (delete old, insert new)
    await db.query('DELETE FROM locations WHERE plan_id = ?', [id]);
    if (locations && locations.length > 0) {
      const locationValues = locations.map(location => [id, location]);
      await db.query(
        'INSERT INTO locations (plan_id, location) VALUES ?',
        [locationValues]
      );
    }

    // 3. Update activities (delete old, insert new)
    await db.query('DELETE FROM activities WHERE plan_id = ?', [id]);
    if (activities && activities.length > 0) {
      const activityValues = activities.map(activity => [id, activity]);
      await db.query(
        'INSERT INTO activities (plan_id, activity) VALUES ?',
        [activityValues]
      );
    }

    await db.query('COMMIT');
    res.json({ message: 'Plan updated successfully' });
  } catch (err) {
    await db.query('ROLLBACK');
    res.status(500).json({ message: err.message });
  }
};

const deletePlan = async (req, res) => {
  try {
    const { id } = req.params;

    // Verify plan belongs to user
    const [plans] = await db.query(
      'SELECT id FROM journey_plans WHERE id = ? AND user_id = ?',
      [id, req.userId]
    );
    
    if (plans.length === 0) {
      return res.status(404).json({ message: 'Plan not found' });
    }

    // ON DELETE CASCADE will handle related locations/activities
    await db.query('DELETE FROM journey_plans WHERE id = ?', [id]);
    
    res.json({ message: 'Plan deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getPlans, addPlan, updatePlan, deletePlan };