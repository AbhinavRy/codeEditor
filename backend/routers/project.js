const express = require('express');
const router = express.Router();
const projectControllers = require('../controllers/project');

router.get('/', projectControllers.getProject);
router.post('/', projectControllers.createProject);
router.delete('/', projectControllers.deleteProject);

module.exports = router;