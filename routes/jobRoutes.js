import {
  createJob,
  getAllJobs,
  showStats,
  updateJob,
  deleteJob,
} from "../controllers/jobsController.js";

import express from "express";
const router = express.Router();

router.route("/").post(createJob).get(getAllJobs);
// below route should be above /:id route else /stats will be treated as id
router.route("/stats").get(showStats);
router.route("/:id").patch(updateJob).delete(deleteJob);

export default router;
