import classNames from "classnames/bind";
import images from "~/assets/images";
import Post from "~/components/Post";
import styles from "~/pages/PrivateCouple/DiaryPost/DiaryPost.module.scss"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { useState } from "react";
import Modal from "react-modal";

const cx = classNames.bind(styles);

function DiaryPost() {

    const [modalIsOpen, setIsOpen] = useState(false);
    function openModal() {
        setIsOpen(true);
    }
    function closeModal() {
        setIsOpen(false);
    }
    return (
        <div className={cx('container')}>
            <div className={cx('new-diary')}>
                <div className={cx('new-diary-sub')}>
                    <div className={cx('new-diary-flex')}>
                        <div className={cx('content')}>
                            <div className={cx('avatar-new-diary')}>
                                <img src={images.login_image} alt="" />
                            </div>
                            <div className={cx('content-new-diary')} onClick={openModal}>
                                <div className={cx('title')}>
                                    <span>Are there any memories today?</span>
                                </div>
                                <div className={cx('overlay')} ></div>
                            </div>
                            {/** Modal */}
                            <Modal
                                isOpen={modalIsOpen}
                                onRequestClose={closeModal}
                            >
                                
                                <button type="submit" onClick={closeModal}>Cancel</button>
                            </Modal>
                        </div>
                    </div>
                </div>
            </div>
            <div className={cx('diary-post')}>
                <div className={cx('diary-post-sub')}>
                    <div className={cx('sub')}>
                        <div className={cx('diary-first')}>
                            <div className={cx('diary')}>
                                <Post />
                                <div className={cx('date-diary-post')}>
                                    <div className={cx('date-nd-heart')}>
                                        <div className={cx('date')}>
                                            <span>
                                                20/10/2021
                                            </span>
                                        </div>
                                    </div>
                                    <div className={cx('heart-line')}>
                                        <div className={cx('heart')}>
                                            <FontAwesomeIcon className={cx('heart-one')} icon={faHeart} />
                                        </div>
                                        <div className={cx('line')}></div>
                                    </div>
                                </div>
                            </div>
                            <div className={cx('diary')}>
                                <Post />
                                <div className={cx('date-diary-post')}>
                                    <div className={cx('date-nd-heart')}>
                                        <div className={cx('date')}>
                                            <span>
                                                20/10/2021
                                            </span>
                                        </div>
                                    </div>
                                    <div className={cx('heart-line')}>
                                        <div className={cx('heart')}>
                                            <FontAwesomeIcon className={cx('heart-one')} icon={faHeart} />
                                        </div>
                                        <div className={cx('line')}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DiaryPost;