const express = require('express');
const router = express.Router();
const ProjectController = require('../controllers/project');
const { body } = require('express-validator');
const isAuth = require('../middleware/isAuth');


router.post('/create', isAuth, ProjectController.createProject);

router.get('/get', ProjectController.getProjects);

router.put('/update/:projectId', isAuth,
[
    body('src').notEmpty(),
    body('name').notEmpty(),
    body('url').notEmpty()
],
ProjectController.updateProject)

router.delete('/delete/:projectId', isAuth, ProjectController.deleteProject)

module.exports = router;