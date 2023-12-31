import classNames from "classnames/bind";
import styles from '~/components/ResetPassword/ResetPassword.module.scss'
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import * as authServices from '~/services/authServices';
import Swal from "sweetalert2";
import config from '~/config';


const cx = classNames.bind(styles);

function ResetPassword() {
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const { token } = useParams()
    const handleResetPassword = async () => {
        const response = await authServices.apiResetPassword({ password, token })
        if (response.success) {
            await Swal.fire('Success', response.message, 'success')
            navigate(`${config.routes.login}`)
        } else Swal.fire('Oops!', response.message, 'error');
    }

    return (
        <div className={cx('wrapper')}>
            <div className={cx('wrapper-modal')}>
                <div className={cx('wrapper-one')}>
                    <div className={cx('overlay')}></div>
                    <div className={cx('modal')}>
                        <div className={cx('modal-one')}>
                            <div className={cx('modal-two')}>
                                <div className={cx('modal-start')}>
                                    <div className={cx('form')}>
                                        <div className={cx('form-one')}>
                                            <div className={cx('form-two')}>
                                                <div className={cx('form-three')}>
                                                    <div className={cx('create')}>
                                                        <div className={cx('create-one')}>
                                                            <div className={cx('create-two')}>
                                                                <div className={cx('create-three')}>
                                                                    <h1>
                                                                        <div className={cx('title')}>Create new password</div>
                                                                    </h1>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className={cx('content')}>
                                                        <p>Please enter new password:</p>
                                                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="New password" />
                                                        <button type="submit" onClick={handleResetPassword}>Next</button>

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ResetPassword;