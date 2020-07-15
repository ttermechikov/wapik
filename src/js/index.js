function main() {
  function scrollHandler() {
    var headerElem = document.querySelector(".header");

    if (document.body.scrollTop > 50) {
      headerElem.style.display = "none";
    } else {
      headerElem.style.display = "";
    }
  }

  document.body.addEventListener("scroll", scrollHandler);
}

main();
