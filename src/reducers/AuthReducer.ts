const initialState = {
        userProfile: null,
        // credentials are tokens
        credentials: null,
        is_authenticated: false,
        permissions: [],
        auth_expire_time: {},
        token_expire_time: null,
}

type Action = {
    type: string;
    payload: any;
}
export default function authReducer(state=initialState, action: Action){
    
}