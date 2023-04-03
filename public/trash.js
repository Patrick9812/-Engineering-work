const butt = document.querySelector(".cart");
const cross = document.querySelector(".trashLine")
const trash = document.querySelector(".trashHidden");

const catMenu = document.querySelector(".activeCategory");
butt.addEventListener("click", () =>
{
    butt.classList.add("cartDis");
    trash.classList.add("trashActive");
    catMenu.classList.remove("activeCategory")
});
cross.addEventListener("click", () =>
{
    butt.classList.remove("cartDis");
    //catMenu.classList.remove("activeCategoryAkt")
    trash.classList.remove("trashActive");
})
