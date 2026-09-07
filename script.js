const digestiveOptions = document.querySelectorAll(
    'input[name="digestiveProblem"]'
);

const digestiveQuestions = document.getElementById(
    "digestiveQuestions"
);

digestiveOptions.forEach(function(option) {

    option.addEventListener("change", function() {

        if (this.value === "yes") {
            digestiveQuestions.style.display = "block";
        } 
        else {
            digestiveQuestions.style.display = "none";
        }

    });

});