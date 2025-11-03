const express = require('express');
const auth = require('../middlewares/auth');
const { 
  getPlans, 
  addPlan, 
  updatePlan, 
  deletePlan 
} = require('../controllers/plansController');

const router = express.Router();

router.use(auth);

router.get('/', getPlans);
router.post('/', addPlan);
router.put('/:id', updatePlan);
router.delete('/:id', deletePlan);

module.exports = router;