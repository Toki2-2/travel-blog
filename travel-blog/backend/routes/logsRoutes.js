const express = require('express');
const auth = require('../middlewares/auth');
const { getLogs, addLog } = require('../controllers/logsController');

const router = express.Router();

router.use(auth);
router.get('/', getLogs);
router.post('/', addLog);

module.exports = router;