let B7Validator = {  //esse objeto vai coter várias funções
    handleSubmit:(event)=>{  //função que recebe o evento como parâmetro
        //primeira coisa que ela faz é parar o evento de submit (previne o comportamento padrão - que é enviar)
        event.preventDefault();
        //após isso, faz-se a validação e depois decide se quer enviar, dependendo do resultado da validação
        let send = true; //vai enviar o formulário? (começa como true)

        let inputs = form.querySelectorAll("input")  //selecionando todos os input que tiverem dentro do formulário
        
        B7Validator.clearErrors() // funçaõ que vai limpar os erros na hora de exibí-los no input (para não mostrar mais de uma vez)
        
        //após isso, vai fazer um loop em cada um desses campos (inputs) e verificar cada um individualmente
        for (let i=0; i<inputs.length; i++){
            let input = inputs[i];
            //verificar se cada um desses campos tem o data-rules
            let check = B7Validator.checkInput(input);
            if (check !== true){  //deu algum erro naquele campo
                send = false;
                //exibir o erro:
                B7Validator.showError(input, check); //passando o input e o erro como parâmetro

            }
        }
        

        if (send) {
            form.submit();  //envie o formulário
        }

    },

    checkInput:(input) => { //verificar cada uma das regras específicas do input (por isso recebe o input como parâmetro)
        let rules = input.getAttribute("data-rules"); //pega o data-rules daquele input, específico verifica se tem algum
       
        if (rules!== null) { //ou seja, se tem algum data-rules
            //vai verificar essas regras (do data-rules)
            rules = rules.split("&"); //separar as regras
            for (let k in rules) { //vai criar um loop passando em cada uma das regras
                let rDetails = rules[k].split("="); //pois cada uma das regras pode ter um valor associado (como exemplo, o min=2)
                switch(rDetails[0]){ //pois é o primeiro item da regra (exemplo = "min")
                    case "required":    //apenas para verificar se esse campo tem algo preenchido (pois ele é obrigatório)
                        if(input.value == "") {  //se o campo estiver vazio
                            return "Campo precisa estar preenchido.";  //vai retornar um erro
                        }
                    break
                    case "min":  //verificar a quantidade mínima de caracteres (2)
                        if (input.value.length < rDetails[1]) {  //se a quantidade de caracteres que está no campo for menor qu eo segundo item do rDetails
                            return "Campo tem que ter pelo menos "+rDetails[1]+" caracteres";
                        }
                    break
                    case "email":
                        if (input.value != "") { //primeiro verifica se esse campos está preenchido, caso esteja, vai verificar o email
                            //para fazer verificaçaõ, vai ser preciso utilizar EXPRESSÕES REGULARES:
                            let regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                            //utilza-se essa expressão para testar (através do test) o valor digitado no input
                            if (!regex.test(input.value.toLowerCase()) ) { //coloca tudo do value em minúsculo
                                //a ! no começo é porque, só vai digitar algo (erro), se não passar no teste, então o ! é sinal de negação (vai negar aquele teste)
                                return "E-mail digitado não é válido"
                            }
                        }

                    break;
                }
            }
        }

        return true; //se não tiver data-rules ja retorna o valor como true
    },

    showError:(input, error) => {  //função que exibe o erro embaixo do input
        input.style.borderColor = "#f00"; //muda a cor da borda

        let errorElement = document.createElement("div"); //cria-se uma div
        errorElement.classList.add("error");
        errorElement.innerHTML = error;  //o segundo parâmetro que a função recebe
        //após esse elemento ser criado, eu preciso adicioná-lo, para aparecer após o input
        input.parentElement.insertBefore(errorElement, input.ElementSibling);
        //com o parentElement eu vou para o elemento de cima (label)
        //o primeiro parâmetro (errorElement) é o que vai inserir e o segundo (input) é antes de quem vai ser inserido
        //por isso eu coloco o (.ElementSibling), para que, possa ficar após io input e não antes
    },

    clearErrors:() => { //essa função vai remover a class error de todas as div que tenham essa class no classlist
        
        //remover a borda vermelha
        let inputs = form.querySelectorAll("input");
        for (let i=0; i<inputs.length; i++) {
            inputs[i].style = "";
        }
        
        //remover o aviso
        let errorElements = document.querySelectorAll(".error");
        for(let i=0;i<errorElements.length;i++){
            errorElements[i].remove();
        }

    }
};

//pegar o formulário que tem a class que permite a validação
let form = document.querySelector(".b7validator");
//após pegar, vai fazer um bloqueio no envio do formulário(ja que o validador se mete no meio do envio)
form.addEventListener("submit", B7Validator.handleSubmit); //sempre que ocorrer um submit no form, vai ocorrer a função handleSubmit que está dentro do B7Validator
