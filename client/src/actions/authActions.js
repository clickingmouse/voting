//import { TEST_DISPATCH } from "./types";
import { GET_ERRORS } from "./types";
import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";

//Register User
export const registerUser = (userData, history) => dispatch => {
  axios
    .post("/api/users/register", userData)
    .then(res => history.push("/login"))
    //    .then(res => console.log(res.data))
    //.catch(err => this.setState({ errors: err.response.data }));
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
  //dispatch to reducer
  /*return {
    type: TEST_DISPATCH,
    payload: userData
  };*/
};

//Login - get user token
export const loginUser = userData => dispatch => {
  axios
    .post("/api/users/login", userData)
    .then(res => {
      //Save to local Storage
      const { token } = res.data;
      //SEt token to local storge
      localStorage.setItem("jwtToken", token);
      //Set token to Auth header
      setAuthToken(token);
      //decode token to get userdata
      const decoded = jwt_decode(token);
      //Se cuurrent usr
      dispatch(setCurrentUser(decoded));
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

Set logged in user
export const setCurrentUser =(decoded)=>{
  return{
    type:SET_CURRENT_USER,
    payload:decod
  }
}
