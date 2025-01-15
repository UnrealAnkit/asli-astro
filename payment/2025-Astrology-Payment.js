document.querySelectorAll(".accordion-header").forEach((button) => {
  button.addEventListener("click", () => {
    const accordionContent = button.nextElementSibling;
    const arrow = button.querySelector(".fa-chevron-down");

    // Close all other accordions
    document.querySelectorAll(".accordion-content").forEach((content) => {
      if (content !== accordionContent) {
        content.style.maxHeight = null;
        content.classList.remove("active");
        content.previousElementSibling
          .querySelector(".fa-chevron-down")
          .classList.remove("rotate-180");
      }
    });

    // Toggle current accordion
    button.classList.toggle("active");
    if (accordionContent.style.maxHeight) {
      accordionContent.style.maxHeight = null;
      arrow.classList.remove("rotate-180");
    } else {
      accordionContent.style.maxHeight = accordionContent.scrollHeight + "px";
      arrow.classList.add("rotate-180");
    }
  });
});

const phoneNumber = document.getElementById("phoneNumber");
const whatsappNumber = document.getElementById("whatsappNumber");
const sameNumberCheckbox = document.getElementById("same-number");

sameNumberCheckbox.addEventListener("change", function () {
  if (this.checked) {
    whatsappNumber.value = phoneNumber.value;
    whatsappNumber.disabled = true;
  } else {
    whatsappNumber.disabled = false;
  }
});

phoneNumber.addEventListener("input", function () {
  if (sameNumberCheckbox.checked) {
    whatsappNumber.value = this.value;
  }
});

function initAutocomplete() {
  const input = document.getElementById("place-of-birth");
  const autocomplete = new google.maps.places.Autocomplete(input, {
    types: ["(cities)"],
    fields: ["place_id", "geometry", "name"],
  });

  autocomplete.addListener("place_changed", function () {
    const place = autocomplete.getPlace();
    if (!place.geometry) {
      window.alert("No details available for input: '" + place.name + "'");
      return;
    }
    console.log("Selected place: ", place.name);
  });
}

google.maps.event.addDomListener(window, "load", initAutocomplete);

function validateForm() {
  const form = document.getElementById("2025-Astro-form");
  const requiredFields = form.querySelectorAll("[required]");
  let isValid = true;

  // Remove all existing error messages
  const existingErrorMessages = form.querySelectorAll(".error-message");
  existingErrorMessages.forEach((el) => el.remove());

  // Remove error styles from all inputs
  form
    .querySelectorAll(".error-input")
    .forEach((el) => el.classList.remove("error-input"));

  requiredFields.forEach((field) => {
    if (!field.value.trim()) {
      isValid = false;
      field.classList.add("error-input");
      const errorMessage = document.createElement("p");
      errorMessage.classList.add("error-message");
      const fieldName = field.name.replace(/([A-Z])/g, " $1").toLowerCase();
      errorMessage.textContent = `${
        fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
      } is required`;

      if (field.id === "phoneNumber" || field.id === "whatsappNumber") {
        const container = field.closest(".mt-4");
        container.appendChild(errorMessage);
      } else {
        field.parentNode.insertBefore(errorMessage, field.nextSibling);
      }
    }
  });

  // Additional validations
  const phoneNumber = document.getElementById("phoneNumber");
  const whatsappNumber = document.getElementById("whatsappNumber");

  if (phoneNumber.value && !isValidPhoneNumber(phoneNumber.value)) {
    isValid = false;
    showError(phoneNumber, "Please enter a valid 10-digit phone number");
  }

  if (whatsappNumber.value && !isValidPhoneNumber(whatsappNumber.value)) {
    isValid = false;
    showError(whatsappNumber, "Please enter a valid 10-digit WhatsApp number");
  }

  return isValid;
}

function showError(input, message) {
  input.classList.add("error-input");
  const errorMessage = document.createElement("p");
  errorMessage.classList.add("error-message");
  errorMessage.textContent = message;
  const container = input.closest(".mt-4");
  container.appendChild(errorMessage);
}

function isValidPhoneNumber(phoneNumber) {
  const regex = /^\d{10}$/;
  return regex.test(phoneNumber);
}

const proceedToPaymentButton = document.getElementById(
  "proceedToPaymentButton"
);
proceedToPaymentButton.addEventListener("click", function (event) {
  event.preventDefault(); // Always prevent default to handle form submission manually
  if (validateForm()) {
    console.log("Form is valid. Proceeding to payment...");
    initiateRazorpayPayment();
  }
});

// Separate function for API call using async/await
async function submitFormData(formData) {
  try {
    console.log("Submitting form data to the server:", formData);

    const response = await fetch("https://backend.asliastro.com/submit-form", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    // Check if the response is successful
    if (response.status === 200) {
      console.log("Data saved successfully!");
      // alert("Form submitted successfully!");
    } else {
      const errorData = await response.json();
      console.error("Error response from server:", errorData);
      // alert("There was an error submitting the form. Please try again.");
    }
  } catch (error) {
    console.error("Error submitting form:", error.message);
    // alert(
    //   "There was an error submitting the form. Please check your connection and try again."
    // );
  }
}

var failed_saved = false;
async function submitFailedPaymentFormData(formData) {
  try {
    console.log("Submitting form data to the server:", formData);

    const response = await fetch(
      "https://backend.asliastro.com/failed-payments",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      }
    );

    // Check if the response is successful
    if (response.status === 201) {
      console.log("Data saved successfully!");
      failed_saved = true;
    } else {
      const errorData = await response.json();
      console.error("Error response from server:", errorData);
    }
  } catch (error) {
    console.error("Error submitting form:", error.message);
    // alert(
    //   "There was an error submitting the form. Please check your connection and try again."
    // );
  }
}

// const razorpayKey = "rzp_test_hugMDo9CN4UElb";
function initiateRazorpayPayment() {
  const razorpayKey = "rzp_test_hugMDo9CN4UElb"; // Replace with your Razorpay key
  const options = {
    key: razorpayKey,
    amount: 1000, // Amount in paise (e.g., 100 rupees = 10000 paise)
    currency: "INR",
    name: "KETAN",
    description: "Child Astrology",
    handler: function (response) {
      //handle payment success
      console.log(response);
      // Gather form data into an object
      const formData = {
        firstName: document.getElementById("firstName").value,
        lastName: document.getElementById("lastName").value,
        dateOfBirth: document.getElementById("dateOfBirth").value,
        gender: document.getElementById("gender").value,
        timeOfBirth: document.getElementById("timeOfBirth").value || null, // Optional field
        placeOfBirth: document.getElementById("place-of-birth").value,
        phoneNumber: document.getElementById("phoneNumber").value,
        whatsappNumber: document.getElementById("whatsappNumber").value,
        maritalStatus: document.getElementById("maritalStatus").value || null, // Optional field
        hasKids: document.getElementById("hasKids").value || null, // Optional field
        requests: document.getElementById("additionalQuestions").value || null, // Optional field
        referralSource: document.getElementById("referralSource").value || null, // Optional field
      };

      // Call the function to handle the API request
      submitFormData(formData);
    },
    prefill: {
      name: "kee",
      email: "ketan22@kk.ll",
      contact: "999888800",
    },
    theme: {
      color: "#F37254",
    },
  };
  // Create a new Razorpay instance with the options
  const rzp = new Razorpay(options);
  rzp.on("payment.failed", function (response) {
    //handle payment failure
    console.log(response, "failRes");
    const formData = {
      first_name: document.getElementById("firstName").value,
      last_name: document.getElementById("lastName").value,
      number: document.getElementById("phoneNumber").value,
      whatsapp_number: document.getElementById("whatsappNumber").value,
    };

    // Call the function to handle the API request
    if (!failed_saved) submitFailedPaymentFormData(formData);
  });
  // Open the Razorpay payment dialog
  rzp.open();
}
