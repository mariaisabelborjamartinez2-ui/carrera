/* ==========================================
   MANOS UNIDAS - CARRERA SOLIDARIA
   FUNCIONES JAVASCRIPT
========================================== */

document.addEventListener("DOMContentLoaded", () => {

  // ========================================
  // 1. CONFIGURACIÓN DEL EVENTO
  // ========================================

  // Fecha: 20 de junio de 2027, a las 7:00 a. m.
  // Cambia esta fecha si la organización confirma otra.
  const eventDate = new Date(2027, 5, 20, 7, 0, 0);

  // Año automático en el pie de página.
  document.getElementById("currentYear").textContent =
    new Date().getFullYear();


  // ========================================
  // 2. CUENTA REGRESIVA
  // ========================================

  const daysElement = document.getElementById("days");
  const hoursElement = document.getElementById("hours");
  const minutesElement = document.getElementById("minutes");
  const secondsElement = document.getElementById("seconds");
  const countdownMessage = document.getElementById("countdownMessage");

  function updateCountdown() {
    const now = new Date();
    const difference = eventDate.getTime() - now.getTime();

    if (difference <= 0) {
      daysElement.textContent = "000";
      hoursElement.textContent = "00";
      minutesElement.textContent = "00";
      secondsElement.textContent = "00";

      countdownMessage.textContent =
        "¡Llegó el día de nuestra carrera solidaria!";

      clearInterval(countdownInterval);
      return;
    }

    const totalSeconds = Math.floor(difference / 1000);

    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    daysElement.textContent = String(days).padStart(3, "0");
    hoursElement.textContent = String(hours).padStart(2, "0");
    minutesElement.textContent = String(minutes).padStart(2, "0");
    secondsElement.textContent = String(seconds).padStart(2, "0");

    countdownMessage.textContent =
      "¡Prepárate para correr por una gran causa!";
  }

  updateCountdown();

  const countdownInterval = setInterval(updateCountdown, 1000);


  // ========================================
  // 3. MENÚ RESPONSIVE
  // ========================================

  const menuToggle = document.getElementById("menuToggle");
  const navMenu = document.getElementById("navMenu");

  function closeMenu() {
    navMenu.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Abrir menú");
    menuToggle.textContent = "☰";
  }

  menuToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("open");

    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute(
      "aria-label",
      isOpen ? "Cerrar menú" : "Abrir menú"
    );

    menuToggle.textContent = isOpen ? "✕" : "☰";
  });

  navMenu.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 800) {
      closeMenu();
    }
  });


  // ========================================
  // 4. REFERENCIAS DEL FORMULARIO
  // ========================================

  const form = document.getElementById("registrationForm");

  const fullName = document.getElementById("fullName");
  const documentId = document.getElementById("documentId");
  const birthDate = document.getElementById("birthDate");
  const email = document.getElementById("email");
  const phone = document.getElementById("phone");
  const category = document.getElementById("category");
  const shirtSize = document.getElementById("shirtSize");
  const guardian = document.getElementById("guardian");
  const guardianGroup = document.getElementById("guardianGroup");
  const consent = document.getElementById("consent");

  const successMessage = document.getElementById("successMessage");
  const successDetails = document.getElementById("successDetails");


  // ========================================
  // 5. FUNCIONES AUXILIARES
  // ========================================

  function showError(field, message) {
    const errorElement = document.getElementById(field.id + "Error");

    if (errorElement) {
      errorElement.textContent = message;
    }

    field.classList.toggle("invalid", Boolean(message));

    if (field.type === "checkbox") {
      field.setAttribute("aria-invalid", String(Boolean(message)));
    } else {
      field.setAttribute("aria-invalid", String(Boolean(message)));
    }

    return !message;
  }

  function clearError(field) {
    showError(field, "");
  }

  function calculateAge(dateString) {
    if (!dateString) {
      return null;
    }

    const birth = new Date(dateString + "T00:00:00");
    const today = new Date();

    if (Number.isNaN(birth.getTime())) {
      return null;
    }

    let age = today.getFullYear() - birth.getFullYear();

    const birthdayNotReached =
      today.getMonth() < birth.getMonth() ||
      (
        today.getMonth() === birth.getMonth() &&
        today.getDate() < birth.getDate()
      );

    if (birthdayNotReached) {
      age--;
    }

    return age;
  }

  function validateName() {
    const value = fullName.value.trim();
    const namePattern = /^[\p{L}][\p{L}\s'-]*$/u;

    if (!value) {
      return showError(fullName, "Escribe tu nombre completo.");
    }

    if (value.length < 5) {
      return showError(
        fullName,
        "Escribe tus nombres y apellidos completos."
      );
    }

    if (!namePattern.test(value)) {
      return showError(
        fullName,
        "Utiliza letras, espacios, apóstrofes o guiones."
      );
    }

    return showError(fullName, "");
  }

  function validateDocument() {
    const value = documentId.value.trim();

    if (!value) {
      return showError(
        documentId,
        "El documento de identidad es obligatorio."
      );
    }

    if (!/^\d{5,15}$/.test(value)) {
      return showError(
        documentId,
        "Ingresa entre 5 y 15 dígitos, sin puntos ni espacios."
      );
    }

    return showError(documentId, "");
  }

  function validateBirthDate() {
    const value = birthDate.value;

    if (!value) {
      updateGuardianVisibility();
      return showError(
        birthDate,
        "Selecciona tu fecha de nacimiento."
      );
    }

    const age = calculateAge(value);

    if (age === null || age < 0 || age > 120) {
      updateGuardianVisibility();
      return showError(
        birthDate,
        "Ingresa una fecha de nacimiento válida."
      );
    }

    if (new Date(value + "T00:00:00") >= new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate() + 1
    )) {
      updateGuardianVisibility();
      return showError(
        birthDate,
        "La fecha de nacimiento no puede ser futura."
      );
    }

    const minimumAge = {
      "5 km": 12,
      "10 km": 16,
      "Familiar": 0
    };

    const selectedCategory = category.value;
    const requiredAge = minimumAge[selectedCategory];

    if (
      selectedCategory &&
      requiredAge !== undefined &&
      age < requiredAge
    ) {
      updateGuardianVisibility();

      return showError(
        birthDate,
        "La categoría seleccionada requiere una edad mínima de " +
        requiredAge + " años."
      );
    }

    updateGuardianVisibility();

    return showError(birthDate, "");
  }

  function validateEmail() {
    const value = email.value.trim();

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    if (!value) {
      return showError(
        email,
        "Ingresa tu correo electrónico."
      );
    }

    if (!emailPattern.test(value)) {
      return showError(
        email,
        "Ingresa un correo válido, por ejemplo nombre@correo.com."
      );
    }

    return showError(email, "");
  }

  function validatePhone() {
    const value = phone.value.trim();

    if (!value) {
      return showError(
        phone,
        "El teléfono celular es obligatorio."
      );
    }

    if (!/^3\d{9}$/.test(value)) {
      return showError(
        phone,
        "Ingresa un celular colombiano de 10 dígitos que comience por 3."
      );
    }

    return showError(phone, "");
  }

  function validateCategory() {
    if (!category.value) {
      return showError(
        category,
        "Selecciona la categoría en la que participarás."
      );
    }

    return showError(category, "");
  }

  function validateShirtSize() {
    if (!shirtSize.value) {
      return showError(
        shirtSize,
        "Selecciona tu talla de camiseta."
      );
    }

    return showError(shirtSize, "");
  }

  function validateGuardian() {
    const age = calculateAge(birthDate.value);

    if (age !== null && age < 18) {
      const value = guardian.value.trim();

      if (value.length < 5) {
        return showError(
          guardian,
          "Escribe el nombre del padre, madre o acudiente."
        );
      }

      if (!/^[\p{L}\s'-]+$/u.test(value)) {
        return showError(
          guardian,
          "Escribe un nombre válido."
        );
      }
    }

    return showError(guardian, "");
  }

  function validateConsent() {
    if (!consent.checked) {
      return showError(
        consent,
        "Debes aceptar esta autorización para continuar."
      );
    }

    return showError(consent, "");
  }


  // ========================================
  // 6. ACUDIENTE PARA MENORES DE EDAD
  // ========================================

  function updateGuardianVisibility() {
    const age = calculateAge(birthDate.value);
    const needsGuardian = age !== null && age < 18;

    guardianGroup.hidden = !needsGuardian;
    guardian.required = needsGuardian;

    if (!needsGuardian) {
      guardian.value = "";
      clearError(guardian);
    }
  }


  // ========================================
  // 7. SELECCIÓN RÁPIDA DE CATEGORÍA
  // ========================================

  document.querySelectorAll(".choose-category").forEach(button => {
    button.addEventListener("click", () => {
      category.value = button.dataset.category;

      validateCategory();

      if (birthDate.value) {
        validateBirthDate();
      }

      updateGuardianVisibility();
    });
  });


  // ========================================
  // 8. VALIDACIÓN AL ESCRIBIR
  // ========================================

  fullName.addEventListener("input", validateName);
  documentId.addEventListener("input", validateDocument);
  birthDate.addEventListener("change", validateBirthDate);
  email.addEventListener("input", validateEmail);
  phone.addEventListener("input", validatePhone);
  category.addEventListener("change", () => {
    validateCategory();

    if (birthDate.value) {
      validateBirthDate();
    }

    updateGuardianVisibility();
  });

  shirtSize.addEventListener("change", validateShirtSize);
  guardian.addEventListener("input", validateGuardian);
  consent.addEventListener("change", validateConsent);


  // ========================================
  // 9. ENVÍO Y CONFIRMACIÓN
  // ========================================

  form.addEventListener("submit", event => {
    event.preventDefault();

    const validations = [
      validateName(),
      validateDocument(),
      validateBirthDate(),
      validateEmail(),
      validatePhone(),
      validateCategory(),
      validateShirtSize(),
      validateConsent()
    ];

    if (calculateAge(birthDate.value) !== null &&
        calculateAge(birthDate.value) < 18) {
      validations.push(validateGuardian());
    }

    const isValid = validations.every(Boolean);

    if (!isValid) {
      successMessage.hidden = true;

      const firstInvalidField = form.querySelector(
        ".invalid"
      );

      if (firstInvalidField) {
        firstInvalidField.focus();
        firstInvalidField.scrollIntoView({
          behavior: "smooth",
          block: "center"
        });
      }

      return;
    }

    const participantName = fullName.value.trim();
    const selectedCategory = category.value;

    successDetails.textContent =
      "Gracias, " + participantName +
      ". Has completado correctamente el formulario para la categoría " +
      selectedCategory + ". Revisa los canales oficiales para conocer los " +
      "siguientes pasos de la inscripción.";

    successMessage.hidden = false;

    successMessage.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });

    // Importante:
    // Esta demostración valida los datos en el navegador.
    // Para recibir inscripciones reales, se necesita conectar
    // el formulario a un servidor o servicio de formularios.
  });

});