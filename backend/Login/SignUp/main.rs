use axum::{routing::post, Router};
use axum::http::StatusCode;
use axum::Json;
use serde_json::json;
use std::net::SocketAddr;

mod auth;
mod db;
mod models;

// define a handler for user signup
async fn signup_handler(Json(payload): Json<models::User>) -> (StatusCode, Json<serde_json::Value>) {
    match auth::create_user(payload).await {
        Ok(_) => (StatusCode::CREATED, Json(json!({"message": "User created successfully"}))),
        Err(err) => (StatusCode::INTERNAL_SERVER_ERROR, Json(json!({"error": err.to_string()}))),
    }
}

// define a handler for user login
async fn login_handler(Json(payload): Json<models::LoginRequest>) -> (StatusCode, Json<serde_json::Value>) {
    match auth::login_user(payload).await {
        Ok(token) => (StatusCode::OK, Json(json!({"token": token}))),
        Err(err) => (StatusCode::UNAUTHORIZED, Json(json!({"error": err.to_string()}))),
    }
}

#[tokio::main]
async fn main() {
    // build the application with routes
    let app = Router::new()
        .route("/signup", post(signup_handler))
        .route("/login", post(login_handler));

    // run the application
    let addr = SocketAddr::from(([127, 0, 0, 1], 3000));
    println!("Server running at http://{}", addr);
    axum::Server::bind(&addr)
        .serve(app.into_make_service())
        .await
        .unwrap();
}
