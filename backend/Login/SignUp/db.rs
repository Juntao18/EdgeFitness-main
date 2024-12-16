use diesel::prelude::*;
use diesel::pg::PgConnection;
use bcrypt::{hash, verify};
use crate::models::{RegisterUser, User};
use crate::schema::users::dsl::*;
use diesel::result::Error;

// create user in database
pub fn create_user(conn: &PgConnection, new_user: RegisterUser) -> Result<User, Error> {
    // hash password with bcrypt
    let password_hash = hash(new_user.password, 4).expect("Failed to hash password");

    // insert new user record into users table
    let user = diesel::insert_into(users)
        .values((email.eq(new_user.email), password_hash.eq(password_hash)))
        .get_result(conn)?;

    // return created user
    Ok(user)
}

// verify user credentials
pub fn verify_user(conn: &PgConnection, user_email: String, user_password: String) -> Result<User, Error> {
    // find user by email
    let user = users.filter(email.eq(user_email)).first::<User>(conn)?;

    // verify password and return user if valid
    if verify(&user_password, &user.password_hash).unwrap_or(false) {
        Ok(user)
    } else {
        Err(Error::NotFound)
    }
}
