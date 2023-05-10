const express = require("express")
const router = express.Router();
const { createJob, getAllJobs, updateJobs, jobDelete, jobsStats, getJobByQuery } = require("../controllers/jobsController")


const { authentication, authorization } = require('../middleware/authMiddleware')

router.post("/create-job/:userId", authentication, authorization, createJob)
router.get("/get-jobs/:userId", authentication, getAllJobs)
router.patch("/update-jobs/:id", authentication, updateJobs)
router.delete("/delete-jobs/:id", authentication, jobDelete)
//JOB STATS FILTER ||GET
router.get("/job-stats/:userId", authentication, jobsStats)
//SORTING AND PAGINATION || GET
router.get("/search-jobs/:userId", authentication, getJobByQuery)


module.exports = router;