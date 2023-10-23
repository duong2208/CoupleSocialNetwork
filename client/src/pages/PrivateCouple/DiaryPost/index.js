import classNames from "classnames/bind";
import images from "~/assets/images";
import { ModalNewDiary, Post } from "~/components";
import styles from "~/pages/PrivateCouple/DiaryPost/DiaryPost.module.scss"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useParams } from "react-router-dom";
import * as postServices from '~/services/postServices'
import moment from "moment";

const cx = classNames.bind(styles);

function DiaryPost() {
    const { usernameCouple } = useParams()
    const [postsByCouple, setPostsByCouple] = useState([])

    const [showModalNewDiary, setShowModalNewDiary] = useState(false);
    useEffect(() => {
        async function fetchPostByCouple() {
            const response = await postServices.apiGetPostsByCouple(usernameCouple)
            if (response.success) setPostsByCouple(response.result)
            console.log(response)
        }
        fetchPostByCouple()
    }, [usernameCouple])
    return (
        <div className={cx('container')}>
            <div className={cx('new-diary')}>
                <div className={cx('new-diary-sub')}>
                    <div className={cx('new-diary-flex')}>
                        <div className={cx('content')}>
                            <div className={cx('avatar-new-diary')}>
                                <img src={images.login_image} alt="" />
                            </div>
                            <div className={cx('content-new-diary')} onClick={() => setShowModalNewDiary(true)}>
                                <div className={cx('title')}>
                                    <span>Are there any memories today?</span>
                                </div>
                                <div className={cx('overlay')} ></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal new diary */}
            {showModalNewDiary && createPortal(
                <ModalNewDiary onClose={() => setShowModalNewDiary(false)} />,
                document.body
            )}

            {/* Show list diary */}
            <div className={cx('diary-post')}>
                <div className={cx('diary-post-sub')}>
                    <div className={cx('sub')}>
                        <div className={cx('diary-first')}>
                            {postsByCouple.length > 0 ?
                                postsByCouple.map((post, index) => (
                                    <div className={cx('diary')} key={index}>
                                        <Post post={post} />
                                        <div className={cx('date-diary-post')}>
                                            <div className={cx('date-nd-heart')}>
                                                <div className={cx('date')}>
                                                    <span>
                                                        {moment(post?.dateAnni)?.format('DD-MM-YYYY')}
                                                        {/* 20/10/2021 */}
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
                                ))


                                : <><div>No posts found</div></>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DiaryPost;