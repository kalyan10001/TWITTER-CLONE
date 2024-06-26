import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { commentOnPost, createPost, deletePost, getAllPosts, getFollowingPosts, getLikedPosts, getUserPosts, likeUnlikePost } from "../controllers/post.Controller.js";

const router=express.Router();

router.get("/likes/:id",protectRoute,getLikedPosts);

router.post("/create",protectRoute,createPost);

router.delete("/:id",protectRoute,deletePost);

router.post("/like/:id",protectRoute,likeUnlikePost);

router.post("/comment/:id",protectRoute,commentOnPost);

router.get("/all",protectRoute,getAllPosts);

router.get("/following",protectRoute,getFollowingPosts);

router.get("/user/:username",protectRoute,getUserPosts);


export default router;