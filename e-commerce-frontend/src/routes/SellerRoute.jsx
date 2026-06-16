import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom"


const SellerRoute = ({children})=>{
   const {isAuthenticated,user}=useSelector((state)=>state.auth
)
if(!isAuthenticated){
    return <Navigate to={"/login"}/>
}
if (user?.userType?.role !== "seller") {
  return <Navigate to="/" />
}
return children
}
export default SellerRoute
