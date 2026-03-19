// import express from "express";
// import { protect } from "../middleware/auth.js";
// import { getProfile, updateProfile, changePassword, deleteAccount } from "../controllers/user.js";

// const router = express.Router();

// router.get("/profile", protect, getProfile);
// router.put("/profile", protect, updateProfile);
// router.put("/password", protect, changePassword);
// router.delete("/delete", protect, deleteAccount);

// export default router;


import express from "express";
import { protect } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js"; //  ADD THIS

import {
  getProfile,
  updateProfile,
  changePassword,
  deleteAccount
} from "../controllers/user.js";

const router = express.Router();

router.get("/profile", protect, getProfile);

//  ADD upload.single("profileImage")
router.put("/profile", protect, upload.single("profileImage"), updateProfile);


router.put("/password", protect, changePassword);
router.delete("/delete", protect, deleteAccount);

export default router;