const cloudinary=require('cloudinary');
const { resolve } = require('path/win32');
cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.API_KEY, 
    api_secret: process.env.API_SECRET })


    // const cloudinaryUploadImg=async(fileToUploads)=>{
    //     return new Promise=((resolve)=>{
    //         cloudinary.uploader.upload(fileToUploads,(result)=>{
    //             resolve({
    //                 url:result.secure_url
    //             },{
    //                 resource_type:"auto"
    //             })
    //         })
    //     })
    // }

    const cloudinaryUploadImg = async (fileToUpload) => {
        return new Promise((resolve, reject) => {
            cloudinary.uploader.upload(fileToUpload, { resource_type: "auto" }, (error, result) => {
                if (error) {
                    return reject(error); // Reject the promise if there's an error
                }
                resolve({
                    url: result.secure_url // Resolve the promise with the secure URL
                });
            });
        });
    };
    

    module.exports=cloudinaryUploadImg;