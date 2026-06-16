import axiosInstance from "./axiosInstance";

export const createSellerApi = async (data) => {
    const token = localStorage.getItem("token");
    const response = await axiosInstance.post("/create-seller",
        data, { 
            headers: { Authorization: `Bearer ${ token } `}
         }
         );

return response.data; };