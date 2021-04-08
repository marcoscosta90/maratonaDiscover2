const Job = require('../model/Job');
const Profile = require('../model/Profile');
const JobUtils = require('../utils/jobUtils')

module.exports = {
    index(req, res) {
        const jobs = Job.get();
        const profile = Profile.get();

        let statusCount = {
            progress: 0,
            done: 0,
            total: jobs.length
        }

        //total de horas por dia de cada job em progresso
        let jobTotalHours = 0

        const updatedJobs = jobs.map((job) => {

            const remaining = JobUtils.remainingDays(job);
            const status = remaining <= 0 ? 'done' : 'progress';

            //somando a quantidade de status
            statusCount[status] += 1;

            //total de horas por dia de cada job em progresso
            jobTotalHours = status == 'progress' ?  jobTotalHours + Number(job["daily-hours"]) : jobTotalHours;      

            return {
                ...job,
                remaining,
                status,
                budget: JobUtils.calculateBudget(job, profile["value-hour"]),
            };
        });

        //quantidade de horas que quero trabalha MENOS quantidade de horas de cada job em progress
        const freeHours = profile["hours-per-day"] - jobTotalHours;


        res.render("index", { jobs: updatedJobs, profile: profile, statusCount: statusCount, freeHours: freeHours });
    }
}