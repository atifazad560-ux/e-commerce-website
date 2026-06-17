import axios from "axios";
import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./CreateDeliveryBoy.css";

function CreateDeliveryBoy() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        mobile: "",
        vehicleNumber: "",
        vehicleType: ""
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            const token = localStorage.getItem("token");

            const res = await axios.post(
                "http://localhost:4000/api/v1/create-delivery-boy",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            toast.success(res.data.message);

            setFormData({
                name: "",
                email: "",
                mobile: "",
                vehicleNumber: "",
                vehicleType: ""
            });
        } catch (error) {
            console.log(error);
            toast.error(
                error.response?.data?.message ||
                "Something went wrong"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="create-delivery-container">
            <div className="delivery-form-card">
                <h2>Create Delivery Boy</h2>

                <form className="delivery-form" onSubmit={handleSubmit}>
                    <input
                        name="name"
                        type="text"
                        placeholder="Delivery Boy Name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />

                    <input
                        name="email"
                        type="email"
                        placeholder="Enter Email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />

                    <input
                        name="mobile"
                        type="tel"
                        placeholder="Mobile No."
                        value={formData.mobile}
                        onChange={handleChange}
                        required
                    />

                    <input
                        name="vehicleNumber"
                        type="text"
                        placeholder="Vehicle Number"
                        value={formData.vehicleNumber}
                        onChange={handleChange}
                        required
                    />

                    <select
                        name="vehicleType"
                        value={formData.vehicleType}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Vehicle Type</option>
                        <option value="Bike">Bike</option>
                        <option value="Scooter">Scooter</option>
                        <option value="Cycle">Cycle</option>
                        <option value="Walking">Walking</option>
                        <option value="4 Wheeler">4 Wheeler</option>
                    </select>

                    <button type="submit" disabled={loading}>
                        {loading ? "Creating..." : "Create Delivery Boy"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default CreateDeliveryBoy;