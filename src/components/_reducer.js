//import { noop } from "react-currency-format/lib/utils";

export const initialState = {
    user: null,
    userLocation: null,
    phoneData: null,
};


//Selector
//export const getBasketTotal = (ebasket) => ebasket?.reduce((amount, item) => item.price + amount, 0);

const reducer = (state, action) => {
    //console.log(action);
    
    switch (action.type) {
        case 'UPDATE_USER':
            return {
                ...state,
                user: action.item
            }
        case "SET_USER":
            return{
                ...state,
                user: action.user
            }
        case "SET_USER_LOCATION":
            return{
                ...state,
                userLocation: action.userLocation
            }
        default: 
            return state;
    }   
}

export default reducer;