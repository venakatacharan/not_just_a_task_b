import { Router } from "express";
import {
    createAudience, deleteAudience, getAudience,
    getAudienceSize
} from "../controllers/audience.controller";


const router = Router();

router.get("/", getAudience);

router.post("/size", getAudienceSize);

router.post("/create", createAudience);

router.delete("/:id", deleteAudience);

export default router;