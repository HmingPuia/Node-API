const ErrorResponse=require('../utils/ErrorResponse');
const asyncHandler=require('../middleware/async')
const Review=require('../models/Review')
const Bootcamp=require('../models/Bootcamp')

//@desc     GET Review
//@route    Get/api/v1/reviews
//@route    Get/api/v1/:bootcamps/:bootcampsId/reviews
//@access   public

exports.getReviews=asyncHandler(async(req,res,next)=>{
    
    if(req.params.bootcampId){
      const reviews=await Review.find({bootcamp:req.params.bootcampId});
      return res.status(200).json({
          success:true,
          count:reviews.length,
          data: reviews
        
      })

    }else{
        
        res.status(200).json(res.advancedResults)
    }
    
});
//@desc     GET Single reviews
//@route    Get/api/v1/reviews/:id

//@access   public

exports.getReview=asyncHandler(async(req,res,next)=>{
    
    const review=await (await Review.findById(req.params.id)).populated({
        path:'bootcamp',
        select:'name description'
    });
    if(!review){
        return next(new ErrorResponse(`No review found with the id of ${req.params.id}`,404 ))
    }
    res.status(200).json({
        success:true,
        data:review
    })
});
//@desc     Aadd reviews
//@route   Post/api/v1/bootcamps/:bootcampId/reviews

//@access   privae

exports.addReview=asyncHandler(async(req,res,next)=>{
    req.body.bootcamp=req.params.bootcampId;
    req.body.user=req.user.id;

    const bootcamp=await Bootcamp.findById(req.params.bootcampId);

    if(!bootcamp){
        return next(
            new ErrorResponse(
                `No bootcamp with the id of ${req.params.bootcampId}`,404
            )
        )
    }
    const review=await Review.create(req.body);
    
    res.status(201).json({
        success:true,
        data:review
    })
});
//@desc     Updatereviews
//@route   Put/api/v1/reviews/:id

//@access   privae

exports.updateReview=asyncHandler(async(req,res,next)=>{
    
    let review=await Review.findById(req.params.id);

    if(!review){
        return next(
            new ErrorResponse(
                `No reviews with the id of ${req.params.id}`,404
            )
        )
    }
//Make sure review belong to user or user is an admin

    if(review.user.toString() !== req.user.id && req.user.role !== 'admin'){
        return next(
            new ErrorResponse(
                `No auhtorized to update review`,401
            )
        )
    }
    review=await Review.findByIdAndUpdate(req.params.id, req.body,{
        new:true,
        runValidators:true
    })
    
    res.status(200).json({
        success:true,
        data:review
    })
});
//@desc     DELETE reviews
//@route   Put/api/v1/reviews/:id

//@access   privae

exports.deleteReview=asyncHandler(async(req,res,next)=>{
    
   const review=await Review.findById(req.params.id);

    if(!review){
        return next(
            new ErrorResponse(
                `No reviews with the id of ${req.params.id}`,404
            )
        )
    }
//Make sure review belong to user or user is an admin

    if(review.user.toString() !== req.user.id && req.user.role !== 'admin'){
        return next(
            new ErrorResponse(
                `No auhtorized to update review`,401
            )
        )
    }
    await review.remove();

    res.status(200).json({
        success:true,
        data:{}
    })
});
