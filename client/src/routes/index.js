import config from '~/config';
//Layouts 
import { DefaultPrivateLayout, SettingPrivateLayout, PrivateLayoutWithoutIntro } from '~/layouts';


import Login from "~/pages/Authen/Login";
import Register from "~/pages/Authen/Register";
import { EditProfile, AccountPassword, PushNotifications , CommentControl, Help, ConnectLover, ViewHistory} from '~/pages/Settings';
import { FinalRegister, ResetPassword } from '~/components';
import {ImageDiary, Todolist, DiaryPost, Anniversary} from '~/pages/PrivateCouple';

const publicRoutes = [
    { path: config.routes.login, component: Login },
    { path: config.routes.register, component: Register },
    { path: config.routes.finalregister, component: FinalRegister },
    { path: config.routes.resetpassword, component: ResetPassword },

]

const privateRoutes = [
    //private couple routes
    { path: config.routes.diarypost, component: DiaryPost, layout: DefaultPrivateLayout },
    { path: config.routes.imagesDiary, component: ImageDiary, layout: DefaultPrivateLayout },
    { path: config.routes.todolist, component: Todolist, layout: DefaultPrivateLayout },
    { path: config.routes.anniversary, component: Anniversary, layout: PrivateLayoutWithoutIntro },

    //setting routes
    { path: config.routes.settingEditProfile, component: EditProfile, layout: SettingPrivateLayout },
    { path: config.routes.settingAccountPassword, component: AccountPassword, layout: SettingPrivateLayout },
    { path: config.routes.settingPushNotifications, component: PushNotifications, layout: SettingPrivateLayout },
    { path: config.routes.settingCommentControl, component: CommentControl, layout: SettingPrivateLayout },
    { path: config.routes.settingHelp, component: Help, layout: SettingPrivateLayout },
    { path: config.routes.settingConnectLover, component: ConnectLover, layout: SettingPrivateLayout },
    { path: config.routes.settingViewConnectionsHistory, component: ViewHistory, layout: SettingPrivateLayout },
]

export { publicRoutes, privateRoutes }