import { Router } from "express";
import {
    getCampaigns,
    getCampaign,
    createCampaign,
    updateCampaign,
    deleteCampaign, startCampaign, getCommunicationLog,
} from "../controllers/campaign.controller";



const router = Router();

router.get("/", getCampaigns);

router.post("/", createCampaign);

router.get("/:id", getCampaign);

router.put("/:id", updateCampaign);

router.delete("/", deleteCampaign);

router.put("/start/:id", startCampaign);

router.get("/log/:id", getCommunicationLog)

export default router;
