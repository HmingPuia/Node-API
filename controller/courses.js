const ErrorResponse=require('../utils/ErrorResponse');
const asyncHandler=require('../middleware/async')
const Course=require('../models/Course')
const Bootcamp=require('../models/Bootcamp')

//@desc     GET courses
//@route    Get/api/v1/courses
//@route    Get/api/v1/:bootcamps/:bootcampsId/courses
//@access   public

exports.getCourses=asyncHandler(async(req,res,next)=>{
    
    if(req.params.bootcampId){
      const courses=await Course.find({bootcamp:req.params.bootcampId});
      return res.status(200).json({
          success:true,
          count:courses.length,
          data: courses
        
      })

    }else{
        
        res.status(200).json(res.advancedResults)
    }
    
})
//@desc     GET single courses
//@route    Get/api/v1/courses/:id
//@access   public

exports.getCourse=asyncHandler(async(req,res,next)=>{
    const course= await Course.findById(req.params.id).populate({
        path:"bootcamp",
        select:'name description'
    })
    if(!course){
        return next(new ErrorResponse(`No course with the id of ${req.params.id}`),404)
    }
  
    res.status(200).json({
        success:true,
        
        data:course
    })
})
//@desc     Add courses
//@route    POST/api/v1/bootcamps/:bootcampId/courses
//@access   private

exports.addCourse=asyncHandler(async(req,res,next)=>{
    req.body.bootcamp=req.params.bootcampId;
    req.body.user=req.user.id;

    const bootcamp= await Bootcamp.findById(req.params.bootcampId)
    if(!bootcamp){
        return next(new ErrorResponse(`No bootcamp with the id of ${req.params.bootcampId}`),404)
    }

    //MAKE SURE USER IS BOOTCAMP OWNER
    if(bootcamp.user.toString()!==req.user.id && req.user.role !== 'admin'){
        return next(new ErrorResponse(`User ${req.user.id} is not authorized to add a course to bootcamp ${bootcamp._id}`, 401))
    }
    const course=await Course.create(req.body);
  
    res.status(200).json({
        success:true,
        
        data:course
    })
})
//@desc     update courses
//@route    put/api/v1/:id
//@access   private

exports.updateCourse=asyncHandler(async(req,res,next)=>{
    
    let course= await Course.findById(req.params.id)
    if(!course){
        return next(new ErrorResponse(`No course with the id of ${req.params.id}`),404)
    }
    //MAKE SURE USER IS BOOTCAMP OWNER
    if(course.user.toString()!==req.user.id && req.user.role !== 'admin'){
        return next(new ErrorResponse(`User ${req.user.id} is not authorized to update a course to bootcamp ${course._id}`, 401))
    }

    course=await Course.findByIdAndUpdate(req.params.id, req.body,{
        new:true,
        runValidators:true
    })
  
    res.status(200).json({
        success:true,
        
        data:course
    })
})
//@desc     DELETE courses
//@route    put/api/v1/:id
//@access   private

exports.deleteCourse=asyncHandler(async(req,res,next)=>{
    
   const course= await Course.findById(req.params.id)
    if(!course){
        return next(new ErrorResponse(`No course with the id of ${req.params.id}`),404)
    }

    //MAKE SURE USER IS BOOTCAMP OWNER
    if(course.user.toString()!==req.user.id && req.user.role !== 'admin'){
        return next(new ErrorResponse(`User ${req.user.id} is not authorized to delete a course to bootcamp ${course._id}`, 401))
    }
    await course.remove()
    res.status(200).json({
        success:true,
        
        data:{}
    })
})