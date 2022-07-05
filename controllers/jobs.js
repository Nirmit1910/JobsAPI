const Job=require('../models/Job');
const {StatusCodes}=require('http-status-codes');
const {BadRequestError,NotFoundError}=require('../errors');


const getAllJobs=async(req,res)=>{
    const jobs=await Job.find({createdBy:req.user.userId}).sort({createdAt:-1});
    res.status(StatusCodes.OK).json({jobs,nHits:jobs.length});
}

const getJob=async(req,res)=>{
    const{user:{userId},params:{id:jobId}}=req;
    const job=await Job.findOne({_id:jobId,createdBy:userId});
    if(!job){
        throw new NotFoundError("Job not found");
    }
    res.status(StatusCodes.OK).json({job});
}

const updateJob=async(req,res)=>{
    const{body:{company,position},user:{userId},params:{id:jobId}}=req;
    if(company==='' || position===''){
        throw new BadRequestError("Company and Position are required");
    }

    const job=await Job.findOneAndUpdate({_id:jobId,createdBy:userId},{company,position},{new:true,runValidators:true});
    if(!job){
        throw new NotFoundError("Job not found");
    }
    res.status(StatusCodes.OK).json({job});
}

const createJob=async(req,res)=>{
    req.body.createdBy=req.user.userId;
    console.log(req.body);
    const job=await Job.create(req.body);
    res.status(StatusCodes.CREATED).json({job});
}

const deleteJob=async(req,res)=>{
    const{user:{userId},params:{id:jobId}}=req;
    const job=await Job.findOneAndDelete({_id:jobId,createdBy:userId});
    if(!job){
        throw new NotFoundError("Job not found");
    }
    res.status(StatusCodes.OK).json();
}

module.exports = {
    getAllJobs,
    getJob,
    updateJob,
    createJob,
    deleteJob
}