import React from 'react'

export default function History() {

    const jobs = [
        {
            "job_no": "IN-UP",
            "job_des": "Opioid use, unsp w intoxication with perceptual disturbance",
            "working_hour": 51
          }, {
            "job_no": "GB-ENG",
            "job_des": "Disorder of iron metabolism, unspecified",
            "working_hour": 100
          }, {
            "job_no": "US-VA",
            "job_des": "Nondisplaced spiral fracture of shaft of humerus, left arm",
            "working_hour": 78
          }, {
            "job_no": "MP-U-A",
            "job_des": "Complete traumatic amp of left hand at wrist level, init",
            "working_hour": 65
          }, {
            "job_no": "US-CO",
            "job_des": "Unil primary osteoarth of first carpometacarp joint, l hand",
            "working_hour": 99
          }
      ];
    
  return (
    <div className="p-4 bg-white rounded">
      <h1 className="text-2xl">Previous Jobs</h1>
      <div className="mt-4 w-full">
        <div className="flex border my-2 p-1 font-bold shadow bg-slate-200">
            <div className="w-1/6">Job No.</div>
            <div className="w-4/6">Job Description</div>
            <div className="w-1/6">Contribute</div>
        </div>
        {jobs.map((job, index) => (
          <div key={index} className="flex border my-2 p-1 shadow hover:bg-gray-100 cursor-pointer">
            <div className="w-1/6">{job.job_no}</div>
            <div className="w-4/6">{job.job_des}</div>
            <div className="w-1/6 text-center">{job.working_hour}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
