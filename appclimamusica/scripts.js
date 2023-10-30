
const input = document.getElementById("input-busca")
const apiKey = 'a6cc816aa0c4292854d812a9ed03a75f'

const clientID = '4c208cefddfe4da0af9005335cf5db76'
const clientSecret = "4328fe83892a44c58aa660559c17be67"


function botaoDeBusca (){
    const inputValue = input.value;
    
    movimentoInput(inputValue);
}


function fecharInput(){
    input.style.visibility = 'hidden';
    input.style.width = '40px';
    input.style.padding = '0.5rem 0.5rem 0.5rem 2.6rem';
    input.style.transition = 'all 0.5s ease-in-out 0s'
    input.value = "";
  
}

function abrirInput(){
    input.style.visibility = 'visible';
    input.style.width = '300px';
    input.style.padding = '0.5rem 0.5rem 0.5rem 3.1rem';
    input.style.transition = 'all 0.5s ease-in-out 0s'
    input.value = "";
   
}

function movimentoInput(inputValue){
   const visibility = input.style.visibility;
    /* visibility == 'hidden' ? abrirInput() : fecharInput(); */
    //console.log(inputValue)

   inputValue && procurarCidade(inputValue) ;
    
    if (visibility == "hidden"){
        abrirInput()
    }
    else {
        fecharInput()
    }

}

input.addEventListener('keyup', function(event) {
    if(event.keyCode == 13){
        const valorInput = input.value;
        movimentoInput(valorInput)
    }
})

document.addEventListener('DOMContentLoaded', () => {
    fecharInput();
})

//https://api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}

async function procurarCidade(city){
    try{
        const dados = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=pt_br`);
       if( dados.status === 200){
       
        const resultado = await dados.json();
        

        obterTopAlbunsPorPais(resultado.sys.country);
        
        mostrarClimaNaTela(resultado);
       }
       else{
        throw new Error
       }


    } catch{
        alert('A pesquisa por cidade deu errado!')
    }
    

}

function mostrarClimaNaTela(resultado){
   
    document.querySelector(".icone-tempo").src = `../imagem/${resultado.weather[0].icon}.png`
    document.querySelector(".tempo").innerHTML = `${resultado.weather[0].description}`
    document.querySelector('.nome-cidade').innerHTML =` ${resultado.name}`;
    document.querySelector('.temperatura').innerHTML =` ${resultado.main.temp.toFixed(0)} °C `;
    document.querySelector('.maxTemperatura').innerHTML =`máx:${resultado.main.temp_max.toFixed(0)} °C|`;
    document.querySelector('.minTemperatura').innerHTML =`|min: ${resultado.main.temp_min.toFixed(0)} °C`;
  
}

async function obterAcessoToken(){
    const credentials = `${clientID}:${clientSecret}`;
    const encodedCredentials = btoa(credentials);

    const response = await fetch('https://accounts.spotify.com/api/token',{
        method: 'POST',
        headers: {
            'Authorization': `Basic ${encodedCredentials}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'grant_type=client_credentials',
    });

    const data = await response.json()

    return data.access_token;
   
}    

function obterDataAtual(){
    const currentDate = new Date ();
    const ano = currentDate.getFullYear();
    const mes = (currentDate.getMonth() + 1).toString().padStart(2, '0')
    const dia = currentDate. getDate().toString().padStart(2, '0');
    return `${ano}-${mes}-${dia}`
}   

async function obterTopAlbunsPorPais(country){
    try{
        
        const accessToken = await obterAcessoToken();
        const dataAtual = obterDataAtual();
        const url = `https://api.spotify.com/v1/browse/featured-playlists?country=${country}&timestamp=${dataAtual}T09%3A00%3A00&limit=3`;
        
        
    
        const resultado = await fetch( `${url}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            },
        });
        
       
    
    if(resultado.status == 200 ){
        const data = await resultado.json()
        const result = data.playlists.items.map(item => ({
            name: item.name,
            image: item.images[0].url
        


        }))
        mostrarMusicaNaTela(result);
        
    
    }else{
        throw new error

    }

    }catch{
        alert( ' A pesquisa por música deu errado!')








   }
    
}   
    
const  ulElement = document.querySelector('.playlist-caixa');
const  liElement = ulElement.querySelectorAll('li');
function mostrarMusicaNaTela(dados){
    liElement.forEach((liElement, index) => {
        const imgElement = liElement.querySelector('img');
        const pElement  = liElement.querySelector('p');
        

        imgElement.src = dados[index].image;
        pElement.textContent = dados[index].name;
    })

}