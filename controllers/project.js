const Project = require('../models/project');
const { validationResult } = require('express-validator');

exports.createProject = (req, res, next) => {
    const src = req.body.src;
    const url = req.body.url;
    const name = req.body.name;

    Project.findOne({url})
    .then(project => {
        console.log(project)
        
        // if (project) {
        //     res.status(500).json({ message: "Project already exists" })
        // }
        return Project.create({ src, url, name})
    })
    .then(result => {
        res.status(200).json({ message: "Project created successfully" })
    })
    .catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
          }
        next(err)
    })
}

exports.getProjects = (req, res, next) => {
    Project.find()
    .then(projects => {
        console.log(projects);
        res.status(200).json({
            message: 'Fetched projects',
            projects: projects
        })
    })
    .catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
          }
        next(err)
    })

}

exports.updateProject = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const error = new Error("Validation failed, entered data is incorrect")
        error.status = 422;
        throw error;
    }

    const projectId = req.params.projectId;
    const src = req.body.src;
    const url = req.body.url;
    const name = req.body.name;

    Project.findById(projectId)
    .then(project => {
        if (!project) {
            const error = new Error("Could not find project");
            error.statusCode = 404;
            throw error;
        }

        project.src = src;
        project.url = url;
        project.name = name;
        return project.save();
    })
    .then(result => {
        console.log(result)
        res.status(200).json({ message: "Project updated" })
    })
    .catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err)
    })

}

exports.deleteProject = (req, res, next) => {
    const projectId = req.params.projectId;
    console.log(projectId)
    // console.log(req)
    Project.findByIdAndRemove(projectId)
    .then(result => {
        // console.log(result)
        res.status(200).json({ message: "Project was deleted" })
    })
    .catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    })
}