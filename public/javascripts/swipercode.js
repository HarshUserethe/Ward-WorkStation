var swiper = new Swiper(".mySwiper", {
    spaceBetween: 30,
    centeredSlides: true,
    autoplay: {
      delay: 2500,
      disableOnInteraction: false,
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  });



  //logout button function
  var toggle = document.querySelector(".menu");
  var logout = document.querySelector(".logout");
  var body = document.querySelector('body');

  toggle.addEventListener("click", function(event){
    // Prevent the click event from propagating to the body
    event.stopPropagation();
    logout.style.display = (logout.style.display === "none" || logout.style.display === "") ? "initial" : "none";
    console.log("Toggle clicked");
  });

  body.addEventListener('click', function(){
    logout.style.display = "none";
    console.log("Body clicked");
  });


  var flag = 1;
  var submitBtn = document.querySelector(".submitButton");
  var AddButton = document.querySelector(".updateButton");

  AddButton.addEventListener('click', function(){
      submitBtn.style.display = "initial";
  })


  function toggleActive(element) {
    // Remove 'active' class from all navigation items
    var navItems = document.querySelectorAll('.bnav');
    navItems.forEach(function(item) {
      item.classList.remove('active');
    });
    
    // Add 'active' class to the clicked item
    element.classList.add('active');
  }

  document.addEventListener("DOMContentLoaded", function() {
    const select = document.getElementById("custom-select");
    const input = document.getElementById("custom-input");
    const addButton = document.getElementById("add-custom-btn");
  
    select.addEventListener("change", function() {
      if (select.value === "custom") {
        input.style.display = "inline-block";
        addButton.style.display = "inline-block";
      } else {
        input.style.display = "none";
        addButton.style.display = "none";
      }
    });
  
    addButton.addEventListener("click", function() {
      const customOption = input.value.trim();
      if (customOption !== "") {
        const option = new Option(customOption, customOption);
        select.add(option);
        select.value = customOption;
        input.value = "";
        input.style.display = "none";
        addButton.style.display = "none";
      }
    });
  });