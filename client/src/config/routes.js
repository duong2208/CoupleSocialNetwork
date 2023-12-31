const routes = {

    //authen
    login: '/',
    register: '/register',
    finalregister: '/finalregister/:status',
    resetpassword: '/resetpassword/:token',

    //private couple
    // diarypost: '/:usernameCouple',
    diarypost: '/diarypost/:usernameCouple',
    imagesDiary: '/imagesdiary/:usernameCouple',
    todolist: '/todolist/:usernameCouple',
    anniversary: '/anniversary/:usernameCouple',

    //setting pages
    settingEditProfile: '/setting/editprofile',
    settingAccountPassword: '/setting/accountpassword',
    settingPushNotifications: '/setting/pushnotifications',
    settingCommentControl: '/setting/commentcontrol',
    settingHelp: '/setting/help',
    settingConnectLover: '/setting/connectlover',
    settingViewConnectionsHistory: '/setting/viewconnectionshistory',
    settingRequestConnection: '/setting/requestconnection',

    //public couples routes
    homepage: '/homepage',
    search: '/search',
    following: '/following',

    //admin routes
    dashboard: '/admin/dashboard',
    accounts: '/admin/accounts',
    posts: '/admin/posts',
    supports: '/admin/supports',
};

export default routes;