const express=require('express');
const router=express.Router()
const {getBootcamps,getBootcamp,createBootcamp,updateBootcamp,deleteBootcamp, getBootcampsInRadius, bootcampPhotoUpload}=require('../controller/bootcamps');

const advancedResults=require('../middleware/advancedResults')
const Bootcamp=require('../models/Bootcamp')
const{protect,authorize}=require('../middleware/auth')
//Include other resources router
const courseRouter=require('./courses')
const reviewRouter=require('./reviews')

//Re-Route into other resource routers
router.use('/:bootcampId/courses',courseRouter)
router.use('/:bootcampId/reviews',reviewRouter)
router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius);
router.route('/:id/photo').put(protect,authorize('publisher','admin'),bootcampPhotoUpload)
router.route('/')
.get(advancedResults(Bootcamp,'courses'), getBootcamps)
.post(protect,authorize('publisher','admin'),createBootcamp)

router.route('/:id')
.get(getBootcamp)
.put(protect,authorize('publisher','admin'),updateBootcamp)
.delete(protect,authorize('publisher','admin'),deleteBootcamp)
module.exports=router;