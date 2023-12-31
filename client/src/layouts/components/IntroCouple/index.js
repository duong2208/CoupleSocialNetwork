import classNames from "classnames/bind";
import styles from "~/layouts/components/IntroCouple/IntroCouple.module.scss";
import images from "~/assets/images";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faCakeCandles, faLocationDot, faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import { faTiktok, faFacebookF, faInstagram } from "@fortawesome/free-brands-svg-icons";
import { useState, useEffect } from "react";
import * as coupleServices from '../../../services/coupleServices'
import * as notifyServices from '~/services/notifyServices'
import * as authServices from '~/services/authServices'
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getCurrentUser } from '~/store/user/asyncAction';
import moment from "moment";
import { createPortal } from "react-dom";
import { Loading, ModalEditInfoCouple } from "~/components";
import config from "~/config";
import ModalEditTempLover from "~/components/ModalEditTempLover";
import Swal from "sweetalert2";
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000', {
    reconnection: true,
})

const cx = classNames.bind(styles);

function IntroCouple({ usernameCouple }) {
    const dispatch = useDispatch();
    const navigate = useNavigate()

    // const { usernameCouple } = useParams()
    const { isLoggedIn, current } = useSelector(state => state.user);
    const { couple } = useSelector(state => state.couple)
    const [infoCreatedUser, setInfoCreatedUser] = useState({})
    const [infoCouple, setInfoCouple] = useState({});
    const [infoLoverUser, setInfoLoverUser] = useState({})
    const [showModalEditInfoCouple, setShowModalEditInfoCouple] = useState(false);
    const [showModalEditTempLover, setShowModalEditTempLover] = useState(false);
    const [followed, setFollowed] = useState(false);
    const [openReportUser, setOpenReportUser] = useState(false);
    const [openReportUserTwo, setOpenReportUserTwo] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const setTimeoutId = setTimeout(() => {
            if (isLoggedIn) dispatch(getCurrentUser());

        }, 300)
        return () => { clearTimeout(setTimeoutId); }
    }, [dispatch, isLoggedIn]);

    useEffect(() => {
        async function fetchCouple() {
            setLoading(true);
            const couple = await coupleServices.apiGetCouple(usernameCouple)
            if (couple.success) setInfoCouple(couple.result)
            const createdUser = await coupleServices.apiGetCreatedUserByCouple(couple.result.createdUser)
            if (createdUser.success) setInfoCreatedUser(createdUser.result)
            if (couple.result.loverUserId) {
                const loverUser = await coupleServices.apiGetLoverUserByCouple(couple.result.loverUserId)
                if (loverUser.success) setInfoLoverUser(loverUser.result)
            } else {
                setInfoLoverUser({})
            }
            setLoading(false)
        }
        fetchCouple()
    }, [usernameCouple])

    const handleClickEditLoverUser = () => {
        if (isLoggedIn && current._id === infoLoverUser._id) {
            navigate(config.routes.settingEditProfile)
        } else if (isLoggedIn && infoCouple.isConnected === false) {
            setShowModalEditTempLover(true)
        }
    }

    const handleClickEditCurrentUser = () => {
        navigate(config.routes.settingEditProfile)
    }

    useEffect(() => {
        if (infoCouple?.followers?.find(fl => fl === current._id)) {
            setFollowed(true)
        }
    }, [infoCouple.followers, current._id])

    const handleFollow = async () => {
        setFollowed(true)
        const coupleFollow = await coupleServices.apiFollowCouple(infoCouple._id)

        const notify = {
            recipients: [coupleFollow.result.createdUser, coupleFollow.result.loverUserId],
            text: `from ${couple.nameCouple} couple has been following your couple.`,
            image: '',
            type: 'follow'
        }
        const noti = await notifyServices.apiCreateNotify(notify)
        socket.emit('notifyPublic', { notiId: noti.result._id, notification: noti.result });
    }
    const handleUnfollow = async () => {
        setFollowed(false)
        await coupleServices.apiFollowCouple(infoCouple._id)
    }
    const handleReport = async (userId) => {
        const response = await authServices.apiReportAccount(userId)
        console.log(response)
        if (!response.success) {
            Swal.fire('Oops!', response.result, 'error')
        } else {
            Swal.fire('Notify', 'You have reported this user', 'warning')
        }
    }

    const getHoroscopeImage = (horoscope) => {
        switch (horoscope) {
            case 'Aquarius':
                return images.aquarius;
            case 'Aries':
                return images.aries;
            case 'Cancer':
                return images.cancer;
            case 'Capricorn':
                return images.capricorn;
            case 'Gemini':
                return images.gemini;
            case 'Leo':
                return images.leo;
            case 'Libra':
                return images.libra;
            case 'Pisces':
                return images.pisces;
            case 'Sagittarius':
                return images.sagittarius;
            case 'Scorpio':
                return images.scorpio;
            case 'Taurus':
                return images.taurus;
            case 'Virgo':
                return images.virgo;

            default:
                return images.aries;
        }
    };
    return (
        <div className={cx('wrapper')}>
            <div className={cx('container')}>
                <div className={cx('intro')}>
                    {loading ? <Loading />
                        :
                        <>
                            <div className={cx('intro-couple')}>
                                <div className={cx('intro-cp')}>
                                    <div className={cx('text-intro-couple')}>
                                        <h2>Introduction</h2>
                                    </div>
                                    <div className={cx('info-intro-couple')}>
                                        <div className={cx('image-couple')}>
                                            {infoCouple.avatarCouple ?
                                                <div className={cx('avatar-couple')}>
                                                    <img src={infoCouple.avatarCouple} alt='' />
                                                </div>
                                                :
                                                <div className={cx('avatar-couple')}>
                                                    <img src={images.avatarCouple} alt='' />
                                                </div>
                                            }
                                            <div className={cx('name-couple')}>
                                                <h3>
                                                    {infoCouple.nameCouple}
                                                </h3>
                                                {infoCouple.isConnected &&
                                                    <div className={cx('follower')}>
                                                        <span>
                                                            {infoCouple?.followers?.length}
                                                            &nbsp;follwers</span>
                                                    </div>
                                                }
                                            </div>
                                        </div>
                                        <div className={cx('biography-couple')}>
                                            <span>
                                                {/* “Love means you never have to say you’re sorry” */}
                                                {infoCouple.biography}
                                            </span>
                                        </div>
                                        <div className={cx('love-date-couple')}>
                                            <div className={cx('heart-couple')}>
                                                <FontAwesomeIcon className={cx('icon')} icon={faHeart} />
                                                <span className={cx('text-on-icon')}>
                                                    {moment().diff(moment(infoCouple?.startLoveDate), 'days')} days
                                                </span>
                                            </div>
                                            <div className={cx('love-date')}>
                                                <span>from &nbsp;
                                                    {moment(infoCouple?.startLoveDate)?.format('DD/MM/YYYY')}
                                                </span>
                                            </div>
                                        </div>

                                        <div className={cx('follow-couple')}>
                                        </div>
                                    </div>
                                    {isLoggedIn && couple.userNameCouple === infoCouple.userNameCouple ?
                                        <>
                                            <div className={cx('edit-info-couple')}>
                                                <button onClick={() => setShowModalEditInfoCouple(true)}><span>Edit our profile</span></button>
                                            </div>
                                            {/* Modal edit info couple */}
                                            {showModalEditInfoCouple && createPortal(
                                                <ModalEditInfoCouple infoCouple={infoCouple} current={current} onClose={() => setShowModalEditInfoCouple(false)} />,
                                                document.body
                                            )}
                                        </>
                                        :
                                        <>
                                            {isLoggedIn ?
                                                followed ?
                                                    <div className={cx('edit-info-couple')}>
                                                        <button onClick={handleUnfollow}><span>Unfollow</span></button>
                                                    </div>
                                                    :
                                                    <div className={cx('edit-info-couple')}>
                                                        <button onClick={handleFollow}><span>Follow</span></button>
                                                    </div>

                                                :
                                                null
                                            }
                                        </>
                                    }
                                </div>
                            </div>
                            <div className={cx('intro-partner')}>
                                <div className={cx('intro-p')}>
                                    <div className={cx('partner')}>
                                        <div className={cx('image-partner')}>
                                            <div className={cx('avatar-partner')}>
                                                <img src={infoCreatedUser.avatar} alt="" />
                                            </div>
                                            <div className={cx('name-partner')}>
                                                <h3>{infoCreatedUser.name}</h3>

                                                <div className={cx('following')}>
                                                    <span>{infoCreatedUser?.followings?.length} followings</span>
                                                </div>
                                            </div>
                                            {current._id !== infoLoverUser._id && current._id !== infoCreatedUser._id ?
                                                <div className={cx('options')} onClick={() => { setOpenReportUser(!openReportUser) }}>
                                                    <FontAwesomeIcon className={cx('icon')} icon={faEllipsisVertical} />
                                                </div>
                                                : null}
                                            {/* Dropdown menu */}
                                            <div className={cx('dropdown-menu', `${openReportUser ? 'active' : 'inactive'}`)} onClick={() => handleReport(infoCreatedUser._id)}>
                                                Report account
                                            </div>
                                        </div>
                                        <div className={cx('dob-partner')}>
                                            <FontAwesomeIcon className={cx('sub-icon')} icon={faCakeCandles} />
                                            <div className={cx('dob')}>
                                                <span>{infoCreatedUser.dob ? moment(infoCreatedUser.dob).format('dddd, MMMM DD yyyy') : 'Null'}</span>
                                            </div>
                                        </div>
                                        <div className={cx('horoscope-partner')}>
                                            <div className={cx('horoscope-symbol')}>
                                                <img src={getHoroscopeImage(infoCreatedUser?.horoscope)} alt="" />
                                            </div>
                                            <div className={cx('horoscope-name')}>
                                                <span>{infoCreatedUser.horoscope ? infoCreatedUser.horoscope : null}</span>
                                            </div>
                                        </div>
                                        <div className={cx('address')}>
                                            <FontAwesomeIcon className={cx('sub-icon')} icon={faLocationDot} />
                                            <div className={cx('address-title')}>
                                                <span>{infoCreatedUser.address ? infoCreatedUser.address : null}</span>
                                            </div>
                                        </div>
                                        {(infoCreatedUser.tiktokLink || infoCreatedUser.facebookLink || infoCreatedUser.instagramLink) &&
                                            <>
                                                <div className={cx('tiktok')}>
                                                    <FontAwesomeIcon className={cx('sub-icon')} icon={faTiktok} />
                                                    <div className={cx('link-tiktok')}>
                                                        <a href="https://www.tiktok.com/@sea2208" target="blank" >{infoCreatedUser.tiktokLink ? infoCreatedUser.tiktokLink : null}</a>
                                                    </div>
                                                </div>
                                                <div className={cx('facebook')}>
                                                    <FontAwesomeIcon className={cx('sub-icon')} icon={faFacebookF} />
                                                    <div className={cx('link-facebook')}>
                                                        <a href="https://www.facebook.com/sea2208/" target="blank" >{infoCreatedUser.facebookLink ? infoCreatedUser.facebookLink : null}</a>
                                                    </div>
                                                </div>
                                                <div className={cx('instagram')}>
                                                    <FontAwesomeIcon className={cx('sub-icon')} icon={faInstagram} />
                                                    <div className={cx('link-instagram')}>
                                                        <a href="https://www.instagram.com/gnoud.nouz/" target="blank" >{infoCreatedUser.instagramLink ? infoCreatedUser.instagramLink : null}</a>
                                                    </div>
                                                </div>
                                            </>
                                        }
                                        {isLoggedIn
                                            && current._id === infoCreatedUser._id
                                            ?
                                            <div className={cx('edit-info-partner')}>
                                                <button onClick={handleClickEditCurrentUser}>
                                                    <span>Edit your information</span>
                                                </button>
                                            </div> : null
                                        }
                                    </div>
                                    <div className={cx('partner')}>
                                        <div className={cx('image-partner')}>
                                            <div className={cx('avatar-partner')}>
                                                {infoLoverUser.avatar ?
                                                    <img src={infoLoverUser.avatar} alt="" />
                                                    :
                                                    infoCouple.tempAvatarLover ?
                                                        <img src={infoCouple.tempAvatarLover} alt="" />
                                                        :
                                                        <img src={images.noUser} alt="" />
                                                }
                                            </div>
                                            <div className={cx('name-partner')}>
                                                <h3>{infoLoverUser.name ? infoLoverUser.name : infoCouple.tempNameLover}</h3>
                                                {infoLoverUser?.followings?.length > 0 ?
                                                    <div className={cx('following')}>
                                                        <span>{infoLoverUser?.followings?.length} followings</span>
                                                    </div>
                                                    : null
                                                }
                                            </div>
                                            {current._id !== infoLoverUser._id && current._id !== infoCreatedUser._id ?

                                                <div className={cx('options')} onClick={() => { setOpenReportUserTwo(!openReportUserTwo) }}>
                                                    <FontAwesomeIcon className={cx('icon')} icon={faEllipsisVertical} />
                                                </div>
                                                : null
                                            }
                                            {/* Dropdown menu */}
                                            <div className={cx('dropdown-menu', `${openReportUserTwo ? 'active' : 'inactive'}`)} onClick={() => handleReport(infoLoverUser?._id)}>
                                                Report account
                                            </div>
                                        </div>
                                        <div className={cx('dob-partner')}>
                                            <FontAwesomeIcon className={cx('sub-icon')} icon={faCakeCandles} />
                                            <div className={cx('dob')}>
                                                <span>{infoLoverUser.dob ? moment(infoLoverUser.dob).format('dddd, MMMM DD yyyy') : moment(infoCouple.tempDobLover).format('dddd, MMMM DD yyyy')}</span>
                                            </div>
                                        </div>
                                        <div className={cx('horoscope-partner')}>
                                            <div className={cx('horoscope-symbol')}>
                                                <img src={infoLoverUser.horoscope
                                                    ? getHoroscopeImage(infoLoverUser?.horoscope)
                                                    : getHoroscopeImage(infoCouple?.tempHoroscope)} alt="" />
                                            </div>
                                            <div className={cx('horoscope-name')}>
                                                <span>{infoLoverUser.horoscope ? infoLoverUser.horoscope : infoCouple.tempHoroscope}</span>
                                            </div>
                                        </div>
                                        {
                                            infoCouple.isConnected ?
                                                <>
                                                    <div className={cx('address')}>
                                                        <FontAwesomeIcon className={cx('sub-icon')} icon={faLocationDot} />
                                                        <div className={cx('address-title')}>
                                                            <span>{infoLoverUser.address}</span>
                                                        </div>
                                                    </div>
                                                    {(infoCreatedUser.tiktokLink || infoCreatedUser.facebookLink || infoCreatedUser.instagramLink) &&
                                                        <>
                                                            <div className={cx('tiktok')}>
                                                                <FontAwesomeIcon className={cx('sub-icon')} icon={faTiktok} />
                                                                <div className={cx('link-tiktok')}>
                                                                    <a href="https://www.tiktok.com/@sea2208" target="blank">{infoLoverUser.tiktokLink}</a>
                                                                </div>
                                                            </div>
                                                            <div className={cx('facebook')}>
                                                                <FontAwesomeIcon className={cx('sub-icon')} icon={faFacebookF} />
                                                                <div className={cx('link-facebook')}>
                                                                    <a href="https://www.facebook.com/sea2208/" target="blank" >{infoLoverUser.facebookLink}</a>
                                                                </div>
                                                            </div>
                                                            <div className={cx('instagram')}>
                                                                <FontAwesomeIcon className={cx('sub-icon')} icon={faInstagram} />
                                                                <div className={cx('link-instagram')}>
                                                                    <a href="https://www.instagram.com/gnoud.nouz/" target="blank">{infoLoverUser.instagramLink}</a>
                                                                </div>
                                                            </div>
                                                        </>
                                                    }
                                                </>
                                                : null
                                        }

                                        {/* Button edit information of loverUser when couple connected */}
                                        {isLoggedIn
                                            && current._id === infoLoverUser._id
                                            ?
                                            <div className={cx('edit-info-partner')}>
                                                <button onClick={handleClickEditLoverUser}>
                                                    <span>Edit your information</span>
                                                </button>
                                            </div> : null
                                        }

                                        {/* Button edit information of temp lover user when couple not connected */}
                                        {isLoggedIn && infoCouple.isConnected === false ?
                                            <div className={cx('edit-info-partner')}>
                                                <button onClick={handleClickEditLoverUser}>
                                                    <span>Edit your lover information</span>
                                                </button>
                                            </div> : null
                                        }
                                        {/* Modal edit info temp lover */}
                                        {showModalEditTempLover && createPortal(
                                            <ModalEditTempLover infoCouple={infoCouple} onClose={() => setShowModalEditTempLover(false)} />,
                                            document.body
                                        )}
                                    </div>
                                </div>

                            </div>
                        </>
                    }
                </div>
            </div>
        </div>
    );
}

export default IntroCouple;