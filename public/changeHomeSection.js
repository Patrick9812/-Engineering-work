const imgchangeS1 = document.querySelector(".banner");
let timerzap = 12000;
        let timer = timerzap;
        
        let a=1;
        let obr_tab = ["img/b1.jpg", "img/b2.jpg", "img/b3.jpg", "img/b4.jpg"]; 
        const zmtlo = () =>
        {
            imgchangeS1.style.backgroundImage = `url('${obr_tab[a++]}')`; //zmiana obrazka
            if(a>3)
            {
                a=0;
            }
        }
        const inter = setInterval(zmtlo, timer);