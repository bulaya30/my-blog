import AuthReducer from "./authReducer";
import UserReducer  from "./userReducer";
import BlogReducer from "./blogReducer";
import CategoryReducer from "./categoryReducer";
import ContactReducer from "./contactReducer";
import NotifcationReducer from "./notificationReducer";
import SubscriberReducer from "./subscriberReducer";
import DataAnalysisReducer from "./ProjectReducer";
import { combineReducers} from 'redux'


const rootReducer = combineReducers({
    notification: NotifcationReducer,
    blog: BlogReducer,
    category: CategoryReducer,
    auth: AuthReducer,
    subscriber: SubscriberReducer,
    contact: ContactReducer,
    user: UserReducer,
    project: DataAnalysisReducer,
})


export default rootReducer