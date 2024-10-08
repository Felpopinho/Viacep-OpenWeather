//variaveis globais
const inputCep = document.getElementById("inputCep");
const inputEstado= document.getElementById("inputEstado");
const inputCidade = document.getElementById("inputCidade");
const inputRua = document.getElementById("inputRua");
const resultadoCepGrid = document.getElementById("resultadoCepGrid");
const tituloResult = document.getElementById("tituloResult");
const cep = document.getElementById("cep");
const rua = document.getElementById('rua');
const bairro = document.getElementById('bairro');
const cidade = document.getElementById('cidade');
const uf = document.getElementById('uf');
const ibge = document.getElementById('ibge');
const historico = document.getElementById("historico");
const resultadoCont = document.getElementById("resultadoCont")
const btnHistCont = document.getElementById("btnHistCont")
const historicoContainer = document.getElementById("historicoContainer")
const main = document.getElementById("main")
const graus = document.getElementById("graus")
const clima = document.getElementById("clima")
const umidade = document.getElementById("umidade")
const vento = document.getElementById("vento")

const apiKey = "f76fba12aefcbf8cc359f32a1d24a68c";

//Array do histórcio
const historicoArr = []

//Chaves do localStorage
const itens = Object.keys(localStorage)

//Armazena dados do localStorage no array do historico
itens.forEach(item => {
    historicoArr.push(JSON.parse(localStorage.getItem(item)))
})

//Caso tenha historico executa a exibição
if (historicoArr.length > 0){
    Historico()
    btnHistCont.style.display = "block"
}


function setHistorico(callback){
    if (Array.isArray(callback)){
        callback.forEach(conteudo=>{
            var data = {
                titulo: conteudo.cep,
                rua: conteudo.logradouro,
                bairro: conteudo.bairro,
                cidade: conteudo.localidade,
                uf: conteudo.uf,
                ibge: conteudo.ibge,
                temperatura: graus.innerText,
                clima: clima.innerText,
                umidade: umidade.innerText,
                vento: vento.innerText
            }
            console.log(data)
            localStorage.setItem(callback.cep, JSON.stringify(data))
            historicoArr.push(JSON.parse(localStorage.getItem(callback.cep)))
        })
    } else{
        var data = {
            titulo: callback.cep, 
            rua: callback.logradouro,
            bairro: callback.bairro,
            cidade: callback.localidade,
            uf: callback.uf,
            ibge: callback.ibge,
            temperatura: graus.innerText,
            clima: clima.innerText,
            umidade: umidade.innerText,
            vento: vento.innerText
        }
        localStorage.setItem(callback.cep, JSON.stringify(data))
        historicoArr.push(JSON.parse(localStorage.getItem(callback.cep)))
    }
}


//Função de exibição do historico
function Historico(){
    historico.innerHTML = ""
    const historicoArrReverse = historicoArr.reverse()
    historicoArrReverse.forEach(dados => {
        var container = document.createElement('div')
        container.className = "containerHistorico"
        historico.appendChild(container)
        var cepH = document.createElement('h2');
        container.appendChild(cepH);
        cepH.innerText = "Cep: "+dados.titulo;
        var contHistorico = document.createElement('div')
        contHistorico.className = "contDadosHistorico"
        container.appendChild(contHistorico)
        var ruaH = document.createElement('p');
        var bairroH = document.createElement('p');
        var cidadeH = document.createElement('p');
        var ufH = document.createElement('p');
        var ibgeH = document.createElement('p');
        var tempH = document.createElement('p');
        var climaH = document.createElement('p');
        var umidadeH = document.createElement('p');
        var ventoH = document.createElement('p');
        contHistorico.appendChild(ruaH);
        contHistorico.appendChild(bairroH);
        contHistorico.appendChild(cidadeH);
        contHistorico.appendChild(ufH);
        contHistorico.appendChild(ibgeH);
        contHistorico.appendChild(tempH);
        contHistorico.appendChild(climaH);
        contHistorico.appendChild(umidadeH);
        contHistorico.appendChild(ventoH);
        ruaH.innerHTML=`<span style="font-weight: bold">Rua: </span>${dados.rua}`;
        bairroH.innerHTML=`<span style="font-weight: bold">Bairro: </span>${dados.bairro}`;
        cidadeH.innerHTML=`<span style="font-weight: bold">Cidade: </span>${dados.cidade}`;
        ufH.innerHTML=`<span style="font-weight: bold">Estado: </span>${dados.uf}`;
        ibgeH.innerHTML=`<span style="font-weight: bold">IBGE: </span>${dados.ibge}`;
        tempH.innerHTML=`<span style="font-weight: bold">Temperatura: </span>${dados.temperatura}`;
        climaH.innerHTML=`<span style="font-weight: bold">Clima: </span>${dados.clima}`;
        umidadeH.innerHTML=`<span style="font-weight: bold">Umidade: </span>${dados.umidade}`;
        ventoH.innerHTML=`<span style="font-weight: bold">Vento: </span>${dados.vento}`;
    });
}

//Função que limpa valores do formulário de cep.
function limpa_formulário_cep() {
    rua.innerText=("");
    bairro.innerText=("");
    cidade.innerText=("");
    uf.innerText=("");
    ibge.innerText=("");
}

async function climaData(conteudo){

    const climaURL = `https://api.openweathermap.org/data/2.5/weather?q=${conteudo.localidade}&units=metric&appid=${apiKey}&lang=pt_br`

    const res = await fetch(climaURL)
    const data = await res.json()

    graus.innerText = `${data.main.temp}°C`
    clima.innerText = `${data.weather[0].description}`
    umidade.innerText = `${data.main.humidity}%`
    vento.innerText = `${data.wind.speed}Km/h`
    setHistorico(conteudo)
    Historico();

}

//Função que recebe os dados, armazena e exibe
function callbackCep(conteudo) {
    if (!("erro" in conteudo)) {
        //Atualiza os campos com os valores.
        if (Array.isArray(conteudo)) {
            document.querySelectorAll(".resultadoLocal").forEach(result => {
                result.style.display = "none"
            })
            conteudo.forEach(data => {
                setResultCep(data)
                main.style.height = "auto";
                climaData(data)
                tituloResult.style.display = "none"
                resultadoCepGrid.style.display = "none"
                resultadoCont.style.display = "flex"
            })
        } else{
            cep.innerText=(conteudo.cep);
            rua.innerText=(conteudo.logradouro);
            bairro.innerText=(conteudo.bairro);
            cidade.innerText=(conteudo.localidade);
            uf.innerText=(conteudo.uf);
            ibge.innerText=(conteudo.ibge);
    
            climaData(conteudo)

            document.querySelectorAll(".resultadoCepGrid").forEach(resultado => {
                resultado.style.display = "none"
            })
            document.querySelectorAll(".tituloResult").forEach(titulo =>{
                titulo.style.display = "none"
            })

            tituloResult.style.display = "block"
            resultadoCepGrid.style.display = "grid"
            resultadoCont.style.display = "flex"
        }
        inputCep.value = ""
        inputCidade.value = ""
        inputEstado.value = ""
        inputRua.value = ""
    } //end if.
    else {
        //CEP não Encontrado.
        limpa_formulário_cep();
        alert("CEP não encontrado.");
    }
    if (historicoArr.length > 0){
        btnHistCont.style.display = "block"
    }
}

function setResultCep(data){
    var resultLocalContainer = document.createElement('div');
    resultLocalContainer.classList.add("resultadoCep","resultadoLocal")
    resultLocalContainer.style.marginBottom = "50px"

    var titulo = document.createElement("h1")
    titulo.innerText = "Localização:"
    titulo.classList.add("tituloResult")

    var resultLocal = document.createElement('div')
    resultLocal.classList.add("resultadoCepGrid")

    var cepDiv = document.createElement("div");
    cepDiv.classList.add("cepResult")
    var cepH = document.createElement("h2");
    cepH.innerHTML = "CEP:&nbsp;"
    var cepText = document.createElement("p")
    cepText.innerHTML = (data.cep);
    cepDiv.appendChild(cepH)
    cepDiv.appendChild(cepText)

    var ruaDiv = document.createElement("div");
    ruaDiv.classList.add("ruaResult")
    var ruaH = document.createElement("h2");
    ruaH.innerHTML = "Rua:&nbsp;"
    var ruaText = document.createElement("p")
    ruaText.innerHTML = (data.logradouro);
    ruaDiv.appendChild(ruaH)
    ruaDiv.appendChild(ruaText)

    var bairroDiv = document.createElement("div");
    bairroDiv.classList.add("bairroResult")
    var bairroH = document.createElement("h2");
    bairroH.innerHTML = "Bairro:&nbsp;"
    var bairroText = document.createElement("p")
    bairroText.innerHTML = (data.bairro);
    bairroDiv.appendChild(bairroH)
    bairroDiv.appendChild(bairroText)

    var cidadeDiv = document.createElement("div");
    cidadeDiv.classList.add("cidadeResult")
    var cidadeH = document.createElement("h2");
    cidadeH.innerHTML = "Cidade:&nbsp;"
    var cidadeText = document.createElement("p")
    cidadeText.innerHTML = (data.localidade);
    cidadeDiv.appendChild(cidadeH)
    cidadeDiv.appendChild(cidadeText)

    var estadoDiv = document.createElement("div");
    estadoDiv.classList.add("ufResult")
    var estadoH = document.createElement("h2");
    estadoH.innerHTML = "Estado:&nbsp;"
    var estadoText = document.createElement("p")
    estadoText.innerHTML = (data.estado);
    estadoDiv.appendChild(estadoH)
    estadoDiv.appendChild(estadoText)

    var ibgeDiv = document.createElement("div");
    ibgeDiv.classList.add("ibgeResult")
    var ibgeH = document.createElement("h2");
    ibgeH.innerHTML = "IBGE:&nbsp;"
    var ibgeText = document.createElement("p")
    ibgeText.innerHTML = (data.ibge);
    ibgeDiv.appendChild(ibgeH)
    ibgeDiv.appendChild(ibgeText)

    document.querySelector(".resultadoCep").appendChild(resultLocalContainer)
    resultLocalContainer.appendChild(titulo)
    resultLocalContainer.appendChild(resultLocal)
    resultLocal.appendChild(cepDiv)
    resultLocal.appendChild(ruaDiv)
    resultLocal.appendChild(bairroDiv)
    resultLocal.appendChild(cidadeDiv)
    resultLocal.appendChild(estadoDiv)
    resultLocal.appendChild(ibgeDiv)
}

function callbackCord(conteudo){
    console.log(conteudo)
}

//Função que busca os dados no webservice e chama a função de receber
function pesquisarCep() {

    var cep = inputCep.value.replace(/\D/g, '');

    if (cep != "") {

        var validacep = /^[0-9]{8}$/;

        if(validacep.test(cep)) {

            rua.innerText="...";
            bairro.innerText="...";
            cidade.innerText;
            uf.innerText="...";
            ibge.innerText="...";

            var scriptCep = document.createElement('script')
            scriptCep.src = 'https://viacep.com.br/ws/'+ cep + '/json/?callback=callbackCep';
            document.body.appendChild(scriptCep);

        }
        else {
            limpa_formulário_cep();
            alert("Formato de CEP inválido.");
        }
    }
    else {
        alert("O campo está vazio.");
        limpa_formulário_cep();
    }
};
function pesquisarLocal() {

    var estadoValue = inputEstado.value
    var cidadeValue = inputCidade.value
    var ruaValue = inputRua.value

    if (estadoValue != "" || cidadeValue != "" || ruaValue != "") {

        var scriptLocal = document.createElement('script')
        scriptLocal.src = `https://viacep.com.br/ws/${estadoValue}/${cidadeValue}/${ruaValue}/json/?callback=callbackCep`;
        document.body.appendChild(scriptLocal);
        
    }
    else {
        alert("O campo está vazio.");
    }
};

//Função que altera a exibição para mostrar o historico
function mostrarHistorico(){
    main.style.height = "auto";
    historicoContainer.style.display = "flex"
    btnHistCont.innerText = "Fechar histórico"
    btnHistCont.setAttribute('onclick', 'fecharHistorico()')
}

//Função que altera a exibição para fechar o historico
function fecharHistorico(){
    historicoContainer.style.display = "none"
    btnHistCont.innerText = "Visualizar histórico"
    btnHistCont.setAttribute('onclick', 'mostrarHistorico()')
}
