import { useState } from "react"
import "./CreateCategory.css"
import axios from "axios"
import React from "react";

function CreateCategory() {

    const [formData, setFormData] = useState({
        name: "",
        description: ""
    })


    const [loading, setLoading] = useState(false);


    const handleChange = (e) => {


        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })


    }

    const handleSubmit = async (e) => {


        e.preventDefault()

        try {

            setLoading(true);

            const token = localStorage.getItem('token');
            const user = localStorage.getItem('user');

            const response = await axios.post("http://localhost:4000/api/v1/add-category",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )

            alert(response?.data?.message);

            setFormData({
                name: "",
                description: ""
            })


        } catch (error) {

            alert(
                error.response?.data?.error ||
                error.response?.data?.message ||
                "Something went wrong"
            );
        }
        finally {
            setLoading(false);
        }


    }

    return (


        <div className="createCategoryContainer">

            <div className="createCategoryCard">

                <h2>Create Category</h2>

                <p>
                    Add a new product category
                </p>

                <form
                    onSubmit={handleSubmit}
                    className="createCategoryForm"
                >

                    <div className="categoryFormGroup">

                        <label>Category Name</label>

                        <input
                            type="text"
                            name="name"
                            placeholder="Enter category name"

                            value={formData.name}

                            onChange={handleChange}
                        />

                    </div>

                    <div className="categoryFormGroup">

                        <label>Description</label>

                        <textarea
                            name="description"
                            placeholder="Enter category description"

                            value={formData.description}

                            onChange={handleChange}

                            rows="4"
                        />

                    </div>

                    <button
                        type="submit"
                        className="createCategoryBtn"
                    >
                        Create Category
                    </button>

                </form>

            </div>

        </div>


    )
}

export default CreateCategory
