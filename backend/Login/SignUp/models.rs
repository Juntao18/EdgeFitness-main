use serde::{Deserialize, Serialize};
use uuid::Uuid;

// define user model
#[derive(Serialize, Deserialize, Queryable)]
pub struct User {
    pub id: Uuid, // user id
    pub email: String, // user email
}

// define register user input
#[derive(Deserialize)]
pub struct RegisterUser {
    pub email: String, // input email
    pub password: String, // input password
}

// define login user input
#[derive(Deserialize)]
pub struct LoginUser {
    pub email: String, // input email
    pub password: String, // input password
}
