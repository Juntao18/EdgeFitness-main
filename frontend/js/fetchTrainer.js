var allTrainers;

// Fetch trainers and display them
document.addEventListener("DOMContentLoaded", function () {
    fetchTrainers();

    document.getElementById("searchInput").addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            applyFilters();
        }
    });
});

function fetchTrainers() {
    fetch('/api/user/trainer/all') // API for trainers
        .then(function (response) {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(function (data) {
            allTrainers = data;
            displayTrainers(allTrainers);
        })
        .catch(function (error) {
            console.error('Error fetching trainers:', error);
        });
}

function displayTrainers(data) {
    console.log(data);

    var trainerList = document.getElementById("trainerList");
    trainerList.innerHTML = ""; // Clear existing content

    data.forEach(function (trainer) {
        var trainerItem = document.createElement("div");
        trainerItem.classList.add("gym-item");

        trainerItem.innerHTML =
            `<img src="images/trainerplaceholder.png" alt="Trainer Photo">
             <h2>${trainer.options.StringVector[0][0]}</h2>
             <p><strong>Specialty:</strong> ${trainer.options.StringVector[0][1]}</p>
             <p><strong>Phone:</strong> ${trainer.phone}</p>
             <button onclick="showReviews('${trainer._id.$oid}')">More Info</button>`;

        trainerList.appendChild(trainerItem);
    });
}

function showReviews(trainerId) {
    console.log(trainerId);

    var selectedTrainer = allTrainers.find(function (trainer) {
        return trainer._id.$oid === trainerId;
    });

    if (!selectedTrainer) {
        console.error("Trainer not found with ID:", trainerId);
        return;
    }

    console.log();


    var reviewsContent = document.getElementById("reviewsContent");
    reviewsContent.innerHTML = "";

    if (selectedTrainer.options.StringVector[1] && selectedTrainer.options.StringVector[1].length > 0) {
        selectedTrainer.options.StringVector[1].forEach(function (review) {
            var reviewItem = document.createElement("div");
            reviewItem.classList.add("review-item");

            reviewItem.innerHTML =
                `<p><strong>Rating:</strong> ${review.rating}/5</p>
                 <p><strong>Comment:</strong> ${review.review}</p>
                 <hr>`;
            reviewsContent.appendChild(reviewItem);
        });
    } else {
        reviewsContent.innerHTML = "<p>No reviews available for this trainer.</p>";
    }

    document.getElementById("reviewSection").style.display = "block";
}

function closeReviewSection() {
    document.getElementById("reviewSection").style.display = "none";
}


// Apply filters based on search input and selected filter
function applyFilters() {
    var searchInput = document.getElementById("searchInput").value.toLowerCase();
    var filterOption = document.getElementById("filterOptions").value;

    // Filter items by search and selected condition
    var filteredList = allTrainers.filter((item) => {
        var matchesSearch =
            item.options.StringVector[0][0].toLowerCase().includes(searchInput) ||
            item.options.StringVector[0][1].toLowerCase().includes(searchInput);

        let matchesFilter = true;
        if (filterOption === "morning" && item.opening_hours) {
            matchesFilter = parseInt(item.opening_hours.split(":")[0]) < 12;
        } else if (filterOption === "evening" && item.closing_hours) {
            matchesFilter = parseInt(item.closing_hours.split(":")[0]) > 18;
        }

        return matchesSearch && matchesFilter;
    });

    displayTrainers(filteredList); // Update displayed items
}
