import classNames from "classnames/bind";
import styles from "~/layouts/components/IntroCouple/IntroCouple.module.scss";
import images from "~/assets/images";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faCakeCandles, faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { faTiktok, faFacebookF, faInstagram } from "@fortawesome/free-brands-svg-icons";

const cx = classNames.bind(styles);

function IntroCouple() {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('container')}>
                <div className={cx('intro')}>
                    <div className={cx('intro-couple')}>
                        <div className={cx('intro-cp')}>
                            <div className={cx('text-intro-couple')}>
                                <h2>Introduction</h2>
                            </div>
                            <div className={cx('info-intro-couple')}>
                                <div className={cx('image-couple')}>
                                    <div className={cx('avatar-couple')}>
                                        <img src={images.login_image} alt='' />
                                    </div>
                                    <div className={cx('name-couple')}>
                                        <h3>Name couple </h3>
                                    </div>
                                </div>
                                <div className={cx('biography-couple')}>
                                    <span>
                                        “Love means you never have to say you’re sorry”
                                    </span>
                                </div>
                                <div className={cx('love-date-couple')}>
                                    <div className={cx('heart-couple')}>
                                        <FontAwesomeIcon className={cx('icon')} icon={faHeart} />
                                        <span className={cx('text-on-icon')}>900 days</span>
                                    </div>
                                    <div className={cx('love-date')}>
                                        <span>from 07/03/2020</span>
                                    </div>
                                </div>

                                <div className={cx('follow-couple')}>
                                    <div className={cx('following')}>
                                        <span> 900 followings</span>
                                    </div>
                                    <div className={cx('follower')}>
                                        <span> 1023 follwers</span>
                                    </div>
                                    <div className={cx('like')}>
                                        <span> 100k likes</span>
                                    </div>
                                </div>
                            </div>
                            <div className={cx('edit-info-couple')}>
                                <button><span>Edit our profile</span></button>
                            </div>
                        </div>

                    </div>
                    <div className={cx('intro-partner')}>
                        <div className={cx('intro-p')}>
                            <div className={cx('partner')}>
                                <div className={cx('image-partner')}>
                                    <div className={cx('avatar-partner')}>
                                        <img src={images.login_image} alt="" />
                                    </div>
                                    <div className={cx('name-partner')}>
                                        <h3>Thùy Dương</h3>
                                    </div>
                                </div>
                                <div className={cx('dob-partner')}>
                                    <FontAwesomeIcon className={cx('sub-icon')} icon={faCakeCandles} />
                                    <div className={cx('dob')}>
                                        <span>22/08/2001</span>
                                    </div>
                                </div>
                                <div className={cx('horoscope-partner')}>
                                    <div className={cx('horoscope-symbol')}>
                                        <img src={images.leo} alt="" />
                                    </div>
                                    <div className={cx('horoscope-name')}>
                                        <span>Leo</span>
                                    </div>
                                </div>
                                <div className={cx('address')}>
                                    <FontAwesomeIcon className={cx('sub-icon')} icon={faLocationDot} />
                                    <div className={cx('address-title')}>
                                        <span>Lao Cai</span>
                                    </div>
                                </div>
                                <div className={cx('tiktok')}>
                                    <FontAwesomeIcon className={cx('sub-icon')} icon={faTiktok} />
                                    <div className={cx('link-tiktok')}>
                                        <a href="https://www.tiktok.com/@sea2208" target="blank" >Thùy Dương</a>
                                    </div>
                                </div>
                                <div className={cx('facebook')}>
                                    <FontAwesomeIcon className={cx('sub-icon')} icon={faFacebookF} />
                                    <div className={cx('link-facebook')}>
                                        <a href="https://www.facebook.com/sea2208/" target="blank" >Thùy Dương</a>
                                    </div>
                                </div>
                                <div className={cx('instagram')}>
                                    <FontAwesomeIcon className={cx('sub-icon')} icon={faInstagram} />
                                    <div className={cx('link-instagram')}>
                                        <a href="https://www.instagram.com/gnoud.nouz/" target="blank" >Thùy Dương</a>
                                    </div>
                                </div>
                                {/* <div className={cx('hobby')}>Hobby</div> */}
                                <div className={cx('edit-info-partner')}>
                                    <button>
                                        <span>Edit your Infomation</span>
                                    </button>
                                </div>
                            </div>
                            <div className={cx('partner')}>
                                <div className={cx('image-partner')}>
                                    <div className={cx('avatar-partner')}>
                                        <img src={images.login_image} alt="" />
                                    </div>
                                    <div className={cx('name-partner')}>
                                        <h3>Thùy Dương</h3>
                                    </div>
                                </div>
                                <div className={cx('dob-partner')}>
                                    <FontAwesomeIcon className={cx('sub-icon')} icon={faCakeCandles} />
                                    <div className={cx('dob')}>
                                        <span>16/09/2001</span>
                                    </div>
                                </div>
                                <div className={cx('horoscope-partner')}>
                                    <div className={cx('horoscope-symbol')}>
                                        <img src={images.virgo} alt="" />
                                    </div>
                                    <div className={cx('horoscope-name')}>
                                        <span>Virgo</span>
                                    </div>
                                </div>
                                <div className={cx('address')}>
                                    <FontAwesomeIcon className={cx('sub-icon')} icon={faLocationDot} />
                                    <div className={cx('address-title')}>
                                        <span>Ha Noi</span>
                                    </div>
                                </div>
                                <div className={cx('tiktok')}>
                                    <FontAwesomeIcon className={cx('sub-icon')} icon={faTiktok} />
                                    <div className={cx('link-tiktok')}>
                                        <a href="https://www.tiktok.com/@sea2208" target="blank">Thùy Dương</a>
                                    </div>
                                </div>
                                <div className={cx('facebook')}>
                                    <FontAwesomeIcon className={cx('sub-icon')} icon={faFacebookF} />
                                    <div className={cx('link-facebook')}>
                                        <a href="https://www.facebook.com/sea2208/" target="blank" >Thùy Dương</a>
                                    </div>
                                </div>
                                <div className={cx('instagram')}>
                                    <FontAwesomeIcon className={cx('sub-icon')} icon={faInstagram} />
                                    <div className={cx('link-instagram')}>
                                        <a href="https://www.instagram.com/gnoud.nouz/" target="blank">Thùy Dương</a>
                                    </div>
                                </div>
                                {/* <div className={cx('hobby')}>Hobby</div> */}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default IntroCouple;