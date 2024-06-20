import httpStatus from "http-status";
import catchAsync from "../../utils/cathAsync";
import sendResponse from "../../utils/sendResponse";
import { AuthServices } from "./auth.service";

const handleLoginUser =catchAsync(async(req,res)=>{
    const result = await AuthServices.loginUser(req.body)

    
    sendResponse(res ,{
        statusCode:httpStatus.OK,
        success:true,
        message:'User logged in successfully ',
        data: result
    })
})
const handleChangePassword =catchAsync(async(req,res)=>{
    // const user = req.he

    console.log(req.user,"ok");
    return
    const result = await AuthServices.changePassword(req.body)



    sendResponse(res ,{
        statusCode:httpStatus.OK,
        success:true,
        message:'User logged in successfully ',
        data: result
    })
})



export const AuthControllers = {
    handleLoginUser,
    handleChangePassword
}