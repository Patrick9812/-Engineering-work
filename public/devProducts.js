const category1 = document.querySelector(".categories-js:nth-of-type(1)");
const category2 = document.querySelector(".categories-js:nth-of-type(2)");
const category3 = document.querySelector(".categories-js:nth-of-type(3)");
const category4 = document.querySelector(".categories-js:nth-of-type(4)");
const category5 = document.querySelector(".categories-js:nth-of-type(5)");
const category6 = document.querySelector(".categories-js:nth-of-type(6)");
const categoriesLineActive = document.querySelector("categoriesLineActive");
const activeCategory = document.querySelector(".activeCategory");
const cateringCat = document.querySelector(".cateringCat");
const saladCat = document.querySelector(".saladCat");
const friesCat = document.querySelector(".friesCat");
const meatCat = document.querySelector(".meatCat");
const pancakesCat = document.querySelector(".pancakesCat");
const meatsetCat = document.querySelector(".meatsetCat");
cateringCat.classList.add("activeCategory");
category1.classList.add("categoriesLineActive");

category1.addEventListener("click", () =>
{
    cateringCat.classList.add("activeCategory");
    saladCat.classList.remove("activeCategory");
    friesCat.classList.remove("activeCategory");
    meatCat.classList.remove("activeCategory");
    pancakesCat.classList.remove("activeCategory")

    category1.classList.add("categoriesLineActive");
    category2.classList.remove("categoriesLineActive");
    category3.classList.remove("categoriesLineActive");
    category4.classList.remove("categoriesLineActive");
    category5.classList.remove("categoriesLineActive");
    category6.classList.remove("categoriesLineActive");
});

category2.addEventListener("click", () =>
{
    saladCat.classList.add("activeCategory");
    cateringCat.classList.remove("activeCategory");
    friesCat.classList.remove("activeCategory");
    meatCat.classList.remove("activeCategory");
    pancakesCat.classList.remove("activeCategory");
    meatsetCat.classList.remove("activeCategory");


    category1.classList.remove("categoriesLineActive");
    category2.classList.add("categoriesLineActive");
    category3.classList.remove("categoriesLineActive");
    category4.classList.remove("categoriesLineActive");
    category5.classList.remove("categoriesLineActive");
    category6.classList.remove("categoriesLineActive");
});

category3.addEventListener("click", () =>
{
    friesCat.classList.add("activeCategory");
    saladCat.classList.remove("activeCategory");
    cateringCat.classList.remove("activeCategory");
    meatCat.classList.remove("activeCategory");
    pancakesCat.classList.remove("activeCategory");
    meatsetCat.classList.remove("activeCategory");


    category1.classList.remove("categoriesLineActive");
    category2.classList.remove("categoriesLineActive");
    category3.classList.add("categoriesLineActive");
    category4.classList.remove("categoriesLineActive");
    category5.classList.remove("categoriesLineActive");
    category6.classList.remove("categoriesLineActive");
});

category4.addEventListener("click", () =>
{
    meatCat.classList.add("activeCategory");
    saladCat.classList.remove("activeCategory");
    friesCat.classList.remove("activeCategory");
    cateringCat.classList.remove("activeCategory");
    pancakesCat.classList.remove("activeCategory");
    meatsetCat.classList.remove("activeCategory");


    category1.classList.remove("categoriesLineActive");
    category2.classList.remove("categoriesLineActive");
    category3.classList.remove("categoriesLineActive");
    category4.classList.add("categoriesLineActive");
    category5.classList.remove("categoriesLineActive");
    category6.classList.remove("categoriesLineActive");
});

category5.addEventListener("click", () =>
{
    pancakesCat.classList.add("activeCategory");
    saladCat.classList.remove("activeCategory");
    friesCat.classList.remove("activeCategory");
    meatCat.classList.remove("activeCategory");
    cateringCat.classList.remove("activeCategory");
    meatsetCat.classList.remove("activeCategory");

    category1.classList.remove("categoriesLineActive");
    category2.classList.remove("categoriesLineActive");
    category3.classList.remove("categoriesLineActive");
    category4.classList.remove("categoriesLineActive");
    category5.classList.add("categoriesLineActive");
    category6.classList.remove("categoriesLineActive");
});

category6.addEventListener("click", () =>
{
    meatsetCat.classList.add("activeCategory");
    saladCat.classList.remove("activeCategory");
    friesCat.classList.remove("activeCategory");
    meatCat.classList.remove("activeCategory");
    pancakesCat.classList.remove("activeCategory");
    cateringCat.classList.remove("activeCategory");

    category1.classList.remove("categoriesLineActive");
    category2.classList.remove("categoriesLineActive");
    category3.classList.remove("categoriesLineActive");
    category4.classList.remove("categoriesLineActive");
    category5.classList.remove("categoriesLineActive");
    category6.classList.add("categoriesLineActive");
});


