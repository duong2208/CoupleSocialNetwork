// import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";

import classNames from "classnames/bind";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { faKey } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "~/pages/Authen/Login/components/LoginForm/LoginForm.module.scss";

import * as authServices from '~/services/authServices';
import * as coupleServices from '~/services/coupleServices';
import { login } from "~/store/user/userSlice"
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { getCurrentCouple } from "~/store/couple/asyncAction";
import config from "~/config";
import { useState } from "react";

const cx = classNames.bind(styles);

function LoginForm() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: Yup.object({
            email: Yup.string()
                // .email('Invalid email format')
                .matches(/^[\w\-.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Please enter a valid email')
                .required('Email is required'),
            password: Yup.string()
                // .min(6, 'Must contain at least one number and one uppercase and lowercase letter, and at least 6 characters.')
                .required('Password is required')
        }),
        onSubmit: async (values) => {
            // e.preventDefault();
            setLoading(true);
            const response = await authServices.apiLogin(values);
            if (response.success) {
                if (response.findUser.isBlocked === false) {
                    dispatch(login({
                        isLoggedIn: true, token: response.accessToken, userData: response.findUser
                    }));
                    setTimeout(async () => {
                        if (response.findUser.role === '16') {
                            const currentUserCouple = await coupleServices.apiGetCoupleByCurrentUser();
                            if (currentUserCouple.success) {
                                const usernameCouple = currentUserCouple.result.userNameCouple
                                dispatch(getCurrentCouple())
                                navigate(`/diarypost/${usernameCouple}`)
                            }
                            else { Swal.fire('Oops!', currentUserCouple.result, 'error') }
                        } else if (response.findUser.role === '22') {
                            navigate(`${config.routes.dashboard}`)
                        }
                    }, 100)
                } else {
                    Swal.fire('Warning!', 'This account has been banned', 'error')
                }
            } else Swal.fire('Oops!', response.message, 'error');
            setLoading(false);
        }
    })
    // if (loading) return <Loading />;
    return (
        <div className={cx("wrapper")}>
            {/* {loading && <Loading />} */}
            <form className={cx("login-form")}>
                <div className={cx('inputWrapper')}>
                    <div className={cx('input-box')}>
                        <input
                            name="email"
                            type="text"
                            placeholder="Email"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            required />
                        <FontAwesomeIcon className={cx('icon-login')} icon={faUser} />
                    </div>
                    {
                        formik.errors.email && formik.touched.email && (
                            <small className={cx('validate-login')}>{formik.errors.email}</small>
                        )
                    }
                </div>

                <div className={cx('inputWrapper')}>
                    <div className={cx('input-box')}>
                        <input
                            name="password"
                            type="password"
                            placeholder="Password"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            required />
                        <FontAwesomeIcon className={cx('icon-login')} icon={faKey} />
                    </div>
                    {
                        formik.errors.password && formik.touched.password && (
                            <small className={cx('validate-login')}>{formik.errors.password}</small>
                        )
                    }
                </div>
                <button type="submit" className={cx('btn-login')}
                    onClick={formik.handleSubmit}
                >
                    {loading ? 'Waiting...' : 'Login'}
                    {/* Login */}
                </button>
            </form>
        </div>
    );
}

export default LoginForm;