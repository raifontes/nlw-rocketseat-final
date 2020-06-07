// (res) => {return res.jason()}    -> função anônima para vários termos
// res => res.jason()              -> função anônima para um termo ou simples
// Consumo da API do IBGE
function populateUFs(){
    //Selecionando a tag select que possui o name uf
    const ufSelect = document.querySelector("select[name = uf]")
    fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
    .then( res =>  res.json() )
    .then( states => {
        //state é uma variável que recebe cada estado do array de states
        for(const state of states){
            ufSelect.innerHTML += `<option value='${state.id}'> ${state.nome} </option> `
        }
    })
}

populateUFs()

function getCities(event){
    const citySelect = document.querySelector("[name = city]")
    const stateInput = document.querySelector("[name = state]")

    //Recebe o valor da uf (id)
    ufValue = event.target.value;

    //alterar o value do input escondido na label state para o nome do estado
    const indexOfSelectedState = event.target.selectedIndex
    stateInput.value = event.target.options[indexOfSelectedState].text

    //Caminho para o json do município
    const url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufValue}/distritos`

    //Reseta o campo cidades, caso o usuário selecione uma opção de estado e mude para outra
    //o campo cidades será reiniciado
    citySelect.innerHTML = "<option value> Selecione a Cidade </option>"
    citySelect.disabled = true


    fetch(url)
    .then( res =>  res.json() )
    .then( cities => {
        //state é uma variável que recebe cada estado do array de states
        for(const city of cities){
            //value recebe city.nome para seja enviado o nome da cidade e não o id (URL)
            citySelect.innerHTML += `<option value="${city.nome}"> ${city.nome} </option> `
        }

        citySelect.disabled = false
    })
}

document
    .querySelector("select[name=uf]")
    //Passando a função getCities por referência
    .addEventListener("change", getCities)

//Itens de coleta (Seleção de itens)

const itemsToCollect = document.querySelectorAll(".items-grid li")

for(const item of itemsToCollect){
    item.addEventListener("click", handleSelectedItem)
}

//Seleciona o input hidden do html com nome items
const collectedItems = document.querySelector("input[name=items]")
let selectedItems = []

function handleSelectedItem(event){
    const itemLi = event.target

    //adicionar ou remover uma classe em javascript
    //itemLI.classList.add("selected") => adicionar
    //itemLI.classList.remove("selected") => remover
    //itemLI.classList.toggle("selected") =>    se a classe já exite na tag, ela será removida. 
    //                                          Se não, será criada uma classe selected.
    itemLi.classList.toggle("selected")

    const itemId = itemLi.dataset.id
    
    //Verificar se existem itens selecionados, se sim
    //pegar estes itens 

    //alreadySelected vai trazer o índice de onde está o item se exitir,
    //Se não, retorna -1
    const alreadySelected = selectedItems.findIndex(item => {
        const itemFound = item == itemId
        return itemFound
    })

    //se estiver selecionado, 
    if(alreadySelected >= 0){
        //tirar da seleção
        //filter é utilizado para "filtrar" elementos.
        //caso retorne true, o item não é excluído 
        //caso retorne false, o item é excluído
        const filteredItems = selectedItems.filter(item => {
            const itemIsDifferent = item != itemId
            return itemIsDifferent
        })

        selectedItems = filteredItems
    }
    else{
        //se não estiver selecionado, adicionar à seleção
        selectedItems.push(itemId)
    }
    //atualizar o campo escondido com os dados selecionados
    collectedItems.value = selectedItems  
}