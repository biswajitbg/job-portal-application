
const Job = require("../models/jobsModel")
const User = require("../models/userModel")
const mongoose = require("mongoose")
const moment = require("moment")


//--------------------------- CREATE JOB--------------------------------------------------

const createJob = async (req, res, next) => {
    try {
        let data = req.body;

        const { company, position, userId } = data;

        if (!(company && position && userId)) {
            next("please provide all fields")
        };
        const isUserIdExist = await User.findOne({ _id: userId })
        if (!isUserIdExist)
            return res.status(404).send({ status: false, message: "UserId not exists" })
        let jobCreated = await Job.create(data)
        res.status(201).send({ status: true, message: "job created successfully", data: jobCreated })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });

    }
};
//-------------------------------GET JOBS ---------------------------------------------------------

const getAllJobs = async (req, res, next) => {
    try {
        let userId = req.params.userId;
        if (!userId) {
            return res.status(400).send("please provide a userId")
        }
        const jobs = await Job.find({ userId: userId })
        res.status(200).send({ total: jobs.length, jobs })

    } catch (error) {
        next(error);

    }

};

//---------------------------------JOB SORTING AND SEARCHING-----------------------------------------


const getJobByQuery = async (req, res, next) => {
    try {
        const { sort } = req.query;
        //condition for searching filters

        const queryObject = {
            userId: req.params.userId
        };
        let queryResult = Job.find(queryObject)
        //sorting

        if (sort === 'a-z') {
            queryResult = queryResult.sort('-position')
        }
        if (sort === 'A-Z') {
            queryResult = queryResult.sort('position')
        }

        //paginiation 

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const jobs = await queryResult;

        queryResult = queryResult.skip(skip).limit(limit)
        //jobscount 
        const totalJObs = await Job.countDocuments(queryResult)
        const numOfPage = Math.ceil(totalJObs / limit)

        res.status(200).send({ total: totalJObs, jobs, numOfPage });

    } catch (error) {
        next(error);

    }
};



//-----------------------------UPDATE JOBS--------------------------------------------------

const updateJobs = async (req, res, next) => {
    try {
        let { id } = req.params;
        const { company, position } = req.body;
        //validation
        if (!(company && position)) {
            next("please provide all feilds")

        }
        //find jobs
        const job = await Job.findOne({ _id: id })
        if (!job) {
            next("no jobs found with this id")
        }
        
        const updateJob = await Job.findOneAndUpdate({ _id: id }, { $set: req.body }, { new: true })
        res.status(200).send({ status: true, message: "update successfully", updateJob })

    } catch (error) {
        console.log(error);

    }

};

//----------------------------DELETE JOBS----------------------------------------------------


const jobDelete = async (req, res, next) => {
    try {
        const { id } = req.params;
        const job = await Job.findOne({ _id: id })

        if (!job) {
            next("no job found with this id")
        }
        await job.deleteOne();
        res.status(200).send({ message: "successfully job delete" })


    } catch (error) {
        console.log(error)

    }
};


//----------------------------JOBS STATE AND FILTER----------------------------------------------


const jobsStats = async (req, res) => {


    const stats = await Job.aggregate([
        //search by user jobs
        {
            $match: {
                userId: new mongoose.Types.ObjectId(req.params.userId),
            },

        },

        {
            $group: {
                _id: '$status',
                count: { $sum: 1 }
            },

        },
    ]);

    //defaults stats
    const defaultStats = {
        pending: stats.pending || 0,
        reject: stats.reject || 0,
        interview: stats.interview || 0

    };

    //monthly and yearly stats

    let monthlyApplication = await Job.aggregate([

        {
            $match: {
                userId: new mongoose.Types.ObjectId(req.params.userId)

            }
        },
        {
            $group: {
                _id: {
                    year: { $year: '$createdAt' },
                    month: { $month: '$createdAt' }

                },
                count: {
                    $sum: 1

                },

            },
        },
    ]);
    monthlyApplication = monthlyApplication.map(item => {
        const { _id: { year, month }, count } = item;
        const date = moment().month(month - 1).year(year).format('MMM Y')
        return { date, count }
    });



    res.status(200).send({ totalJob: stats.length, stats, defaultStats, monthlyApplication });
};
module.exports = { createJob, getAllJobs, updateJobs, jobDelete, jobsStats, getJobByQuery };

