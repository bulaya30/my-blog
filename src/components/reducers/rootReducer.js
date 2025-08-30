import AuthReducer from "./authReducer";
import UserReducer  from "./userReducer";
import BlogReducer from "./blogReducer";
import CategoryReducer from "./categoryReducer";
import NotifcationReducer from "./notificationReducer";
import { combineReducers} from 'redux'


const rootReducer = combineReducers({
    notification: NotifcationReducer,
    blog: BlogReducer,
    category: CategoryReducer,
    auth: AuthReducer,
    user: UserReducer,
})


export default rootReducer