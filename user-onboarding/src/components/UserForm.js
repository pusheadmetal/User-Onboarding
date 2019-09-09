import React, { useState, useEffect } from "react";
import { withFormik, Form, Field } from "formik";
import * as Yup from "yup";
import axios from "axios";

const FormikUserForm = withFormik({

    mapPropsToValues({ name, email, password, role, tos }) {
        return {
            name: name || "",
            email: email || "",
            password: password || "",
            role: role || "Select",
            tos: tos || false
        };
    },
    //==Validation Schema==
    validationSchema: Yup.object().shape({
        name: Yup.string()
            .required("Name is required"),
        email: Yup.string()
            .email("Email is not valid")
            .required("Email is required"),
        password: Yup.string()
            .min(6, "Password must be 6 characters or longer")
            .required("Password is required"),
        role: Yup.string()
            .test(
                "role",
                "You must select a role",
                value => value !== "Select"
            )
            .required("You must select a role"),
        tos: Yup.boolean()
            .test(
                "tos",
                "You must agree with the TOS!",
                value => value === true
            )
            .required(
                "You must agree with the TOS!"
            )
            
    }),
    //==End Schema==
    handleSubmit(values, { resetForm, setErrors, setSubmitting, setStatus }){
        if (values.email === "waffle@syrup.com") {
            setErrors({ email: "That email is already taken :(" });
        }else{
            axios
                .post("https://reqres.in/api/users_", values)
                .then( (res) => {
                    console.log(res);
                    setStatus(res.data);
                    resetForm();
                    setSubmitting(false);
                })
                .catch( (err) => {
                    console.log(err);
                    setSubmitting(false);
                });
        }
        
    }

})(UserForm);

function UserForm ({ values, errors, touched, status }) {

    const [users, setUsers] = useState([]);
    useEffect( () => {
        if (status){
            setUsers([...users, status]);
        }
    }, [status]);

    return (
        <div className = "form">
            <Form>
                <div className = "input name">
                    <p>
                        {touched.name && errors.name && <p>{errors.name}</p>}
                        <Field type = "text" name = "name" placeholder = "Name" />
                    </p>
                </div>
                <div className = "input email">
                    <p>
                        {touched.email && errors.email && <p>{errors.email}</p>}
                        <Field type = "text" name = "email" placeholder = "Email" />
                    </p>
                </div>
                <div className = "input password">
                    <p>
                        {touched.password && errors.password && <p>{errors.password}</p>}
                        <Field type = "password" name = "password" placeholder = "Password" />
                    </p>
                </div>
                <div className = "input role">
                    <p>
                        {touched.role && errors.role && <p>{errors.role}</p>}
                        <Field component = "select" name = "role">
                            <option value = "Select">Select</option>
                            <option value = "Developer">Developer</option>
                            <option value = "QA Engineer">QA Engineer</option>
                            <option value = "Data Scientist">Data Scientist</option>
                            <option value = "Web Developer">Web Developer</option>
                            <option value = "Scrum Master">Scrum Master</option>
                        </Field>
                    </p>
                </div>
                <div className = "input TOS">
                    <label>
                        {touched.tos && errors.tos && <p>{errors.tos}</p>}
                        <Field type = "checkbox" name = "tos" checked = {values.tos} />
                        Accept TOS
                    </label>
                </div>
                <div className = "button submit">
                    <p>
                        <button type = "submit">Submit</button>
                    </p>
                </div>
            </Form>

            <div className = "userCards">
                    {users.map( (item) => {
                        return(
                            <div className = "userCard">
                                <p>{item.name}</p>
                                <p>{item.email}</p>
                                <p>{item.role}</p>
                            </div>
                        )
                    })}
            </div>
        </div>
    );
}

export default FormikUserForm;