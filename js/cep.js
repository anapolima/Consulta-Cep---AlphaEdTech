$(document).ready(function ()
{
    $("#user-name").focus();

    let citiesJSON = [];

    $("#cep").mask("##.###-###", {reverse: false});
    $("#user-birth").mask("##/##/####", {reverse: false});
    $("#cpf").mask("###.###.###-##", {reverse: false});
    $("#phone").mask("(##) # ####-####", {reverse: false});

    $("#user-birth, #cpf, #phone, #cep, #number").on("keyup", function (e)
    {
        const keyCode = e.keyCode;
        
        if((keyCode < 48 || keyCode > 57) && keyCode != 8 && keyCode != 9)
        {
            e.preventDefault();
        };
    });

    $("#number").on("keydown", function (e)
    {
        const keyCode = e.keyCode;
        
        if((keyCode < 48 || keyCode > 57) && keyCode != 8 && keyCode != 9)
        {
            e.preventDefault();
        };
    });

    $("#gmap_canvas").on("load", function ()
    {  
        $("#loading").hide();
    });

    $("#cep").on("keyup", function ()
    {
        const cep = $(this).val();
        
        if(cep.length == 10)
        {
            let consultCep = cep.replace(".","").replace("-","");
            $.ajax({
                url: `https://cep.awesomeapi.com.br/json/${consultCep}`,
                method: "GET"
            })
            .done((data) =>
            {
                $("#cep-message").html("");
                $("#cep").attr("style", "");
                const address = JSON.parse(JSON.stringify(data));
                $("#street").val(address.address);
                $("#district").val(address.district);
                $("#state").val(address.state);
                $("#city").val(address.city);
                $("#street").attr("readonly", true);
                $("#district").attr("readonly", true);
                $("#state").attr("disabled", true);
                $("#city").attr("readonly", true);
        
                // const latitude = address.lat;
                // const longitsude = address.lng;

                showMap();
       
                firstCheckState();
                firstCheckCity();
                firstCheckDistrict();
                firstCheckStreet();
            })
            .fail((err) =>
            {   
                const error = JSON.parse(JSON.stringify(err));
                $("#cep-message").html("O CEP informado não foi encontrado!");
                $("#cep").css({"border-bottom":"2px solid #C7161A"});

                validate.setCep("a");
            });
        }
        else
        {
            $("#street").attr("readonly", false);
            $("#district").attr("readonly", false);
            $("#state").attr("disabled", false);
            $("#city").attr("readonly", false);
        };
    });

    $.ajax({
        url: "https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome",
        method: "GET"
    })
    .done((data) =>
    {
        const statesJSON = data;
        
        for (let index in statesJSON)
        {
            $("#state").append(`<option class="selected-state" value="${statesJSON[index].sigla}">${statesJSON[index].nome}</option>`);
        };
    });

    $("#state").on("change", function ()
    {
        $("#city-list").html("");
        $("#city").val("");
        $("#district-list").html("");
        $("#district").val("");
        $("#number").val("");

        const stateNick = $(this).val();

        $.ajax({
            url: `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${stateNick}/municipios`,
            method: "GET"
        })
        .done((data) =>
        {
            // citiesJSON.pop();
            // citiesJSON.push(data);

            citiesJSON = data;

            for (let index in citiesJSON)
            {
                $("#city-list").append(`<option class="selected-city" value="${citiesJSON[index].nome}"></option>`);
            };
        })
        .fail(() =>
        {
            $("#city-message").html("Erro ao carregar lista de cidades");
        });
    });

    $("#city").on("change", function ()
    {
        $("#district-list").html("");
        $("#district").val("");
        
        let cityCode;

        for (let index in citiesJSON)
        {
            if (citiesJSON[index].nome.toUpperCase() == $(this).val())
            {
                cityCode = citiesJSON[index].id;
            };
        };

        $.ajax({
            url: `https://servicodados.ibge.gov.br/api/v1/localidades/municipios/${cityCode}/distritos`,
            method: "GET"
        })
        .done((data) =>
        {
            const districtList = data;
            for (let index in districtList)
            {                
                $("#district-list").append(`<option class="selected-district" value="${districtList[index].nome}"></option>`);
            };
        })
        .fail(() =>
        {
            $("#district-message").html("Erro ao carregar lista de bairros")
        });
    });

    $("#user-name, #city, #street, #complement, #district").on("input", function ()
    {
        const upperCaseName = $(this).val().toUpperCase();
        $(this).val(upperCaseName);
    });

    $("#user-name, #city, #complement, #district").on("keydown", function (e)
    {
        const keyCode = e.keyCode;

        if((keyCode >= 48 && keyCode <= 57))
        {
            e.preventDefault();
        };
    });

    $("#state").on("change", showMap);
    $("#city").on("change", showMap);
    $("#street").on("change", showMap);
    $("#number").on("change", showMap);
    // $("#district").on("change", showMap);

    $("#user-name").on("change", firstCheckName);
    $("#user-name").on("blur", firstCheckName);

    $("#user-birth").on("change", firstCheckDateBirth);
    $("#user-birth").on("blur", firstCheckDateBirth);

    $("#cpf").on("change", firstCheckCPF);
    $("#cpf").on("blur", firstCheckCPF);

    $("#phone").on("change", firstCheckPhone);
    $("#phone").on("blur", firstCheckPhone);

    $("#cep").on("change", firstCheckCEP);
    $("#cep").on("blur", firstCheckCEP);

    $("#state").on("change", firstCheckState);
    $("#state").on("blur", firstCheckState);

    $("#city").on("change", firstCheckCity);
    $("#city").on("blur", firstCheckCity);

    $("#district").on("change", firstCheckDistrict);
    $("#district").on("blur", firstCheckDistrict);

    $("#street").on("change", firstCheckStreet);
    $("#street").on("blur", firstCheckStreet);

    $("#number").on("change", firstCheckNumber);

    $("#register-button").on("click", function ()
    {
        validate.setName($("#user-name").val());
        validate.setDateBirth($("#user-birth").val());
        validate.setCpf($("#cpf").val());
        validate.setPhone($("#phone").val());
        validate.setCep($("#cep").val());
        validate.setState($("#state").val());
        validate.setCity($("#city").val());
        validate.setDistrict($("#district").val());
        validate.setStreet($("#street").val());

        if ($("#number").val())
        {
            validate.setNumber($("#number").val());
        }
        else
        {
            validate.setNumber("10");
        };

        const validateResult = [
            validate.getName(),
            validate.getDateBirth(),
            validate.getCpf(),
            validate.getPhone(),
            validate.getCep(),
            validate.getState(),
            validate.getCity(),
            validate.getDistrict(),
            validate.getStreet(),
            validate.getNumber(),
        ];

        const validationResult = validateResult.indexOf(false);

        if (validationResult !== -1)
        {
            $("#register-alert").html("Os campos não foram preenchidos corretamente!");
            $("#register-alert").attr("class", "register-alert");

            validateResult.forEach((result, index) =>
            {
                if (result == false)
                {
                    switch (index)
                    {
                        case 0: // name
                            $("#name-message").html("Insira um nome válido!");
                            $("#user-name").css({"border-bottom":"2px solid #C7161A"});
                            $("#user-name").addClass("input-wrong");
                        break;

                        case 1: // birth date
                            $("#birth-message").html("Insira uma data válida!");
                            $("#user-birth").css({"border-bottom":"2px solid #C7161A"});
                            $("#user-birth").addClass("input-wrong");
                        break;

                        case 2: // cpf
                            $("#cpf-message").html("Insira um CPF válido!");
                            $("#cpf").css({"border-bottom":"2px solid #C7161A"});
                            $("#cpf").addClass("input-wrong");
                        break;

                        case 3: // phone
                            $("#phone-message").html("Insira um telefone válido!");
                            $("#phone").css({"border-bottom":"2px solid #C7161A"});
                            $("#phone").addClass("input-wrong");
                        break;

                        case 4: // cep
                            $("#cep-message").html("Insira um CEP válido!");
                            $("#cep").css({"border-bottom":"2px solid #C7161A"});
                            $("#cep").addClass("input-wrong");
                        break;

                        case 5: // state
                            $("#state-message").html("Insira um estado válido!");
                            $("#state").css({"border-bottom":"2px solid #C7161A"});
                            $("#state").addClass("input-wrong");
                        break;

                        case 6: // city
                            $("#city-message").html("Insira uma cidade válida!");
                            $("#city").css({"border-bottom":"2px solid #C7161A"});
                            $("#city").addClass("input-wrong");
                        break;

                        case 7: // district
                            $("#district-message").html("Insira um bairro válido!");
                            $("#district").css({"border-bottom":"2px solid #C7161A"});
                            $("#district").addClass("input-wrong");
                        break;

                        case 8: // street
                            $("#street-message").html("Insira um logradouro válido!");
                            $("#street").css({"border-bottom":"2px solid #C7161A"});
                            $("#street").addClass("input-wrong");
                        break;

                        case 9: // number
                            $("#number-message").html("Insira um número válido!");
                            $("#number").css({"border-bottom":"2px solid #C7161A"});
                            $("#number").addClass("input-wrong");
                        break;
                    }
                }
                else
                {
                    switch (index)
                    {
                        case 0: // name
                            $("#name-message").html("");
                            $("#user-name").attr("style", "");
                            $("#user-name").removeClass("input-wrong");
                        break;

                        case 1: // birth date
                            $("#birth-message").html("");
                            $("#user-birth").attr("style", "");
                            $("#user-birth").removeClass("input-wrong");
                        break;

                        case 2: // cpf
                            $("#cpf-message").html("");
                            $("#cpf").attr("style", "");
                            $("#cpf").removeClass("input-wrong");
                        break;

                        case 3: // phone
                            $("#phone-message").html("");
                            $("#phone").attr("style", "");
                            $("#phone").removeClass("input-wrong");
                        break;

                        case 4: // cep
                            $("#cep-message").html("");
                            $("#cep").attr("style", "");
                            $("#cep").removeClass("input-wrong");
                        break;

                        case 5: // state
                            $("#state-message").html("");
                            $("#state").attr("style", "");
                            $("#state").removeClass("input-wrong");
                        break;

                        case 6: // city
                            $("#city-message").html("");
                            $("#city").attr("style", "");
                            $("#city").removeClass("input-wrong");
                        break;

                        case 7: // district
                            $("#district-message").html("");
                            $("#district").attr("style", "");
                            $("#district").removeClass("input-wrong");
                        break;

                        case 8: // street
                            $("#street-message").html("");
                            $("#street").attr("style", "");
                            $("#street").removeClass("input-wrong");
                        break;

                        case 9: // number
                            $("#number-message").html("");
                            $("#number").attr("style", "");
                            $("#number").removeClass("input-wrong");
                        break;
                    };
                };
            });
        }
        else
        {
            $("#register-alert").html("Cadastro realizado com sucesso!");
            $("#register-alert").attr("class", "success");
        };
    });
});

function showMap ()
{
    const consultCep = $("#cep").val().replace(".","").replace("-","");
    const consultState = $("#state").val();
    const consultCity = $("#city").val().replaceAll(" ", "+");
    // const consultDistrict = $("#district").val().replaceAll(" ", "+");
    const consultStreet =  `${$("#street").val().replaceAll(" ", "+")}`;
    const consultNumber = $("#number").val();

    // const consultUrl = `https://maps.google.com/maps?q=${consultStreet},+${consultNumber}+-+${consultDistrict},+${consultCity}+-+${consultState},+${consultCep}&t=&z=18&ie=UTF8&iwloc=&output=embed`;
    const consultUrl = `https://maps.google.com/maps?q=${consultStreet},+${consultNumber},+${consultCity}+-+${consultState},+${consultCep}&t=&z=18&ie=UTF8&iwloc=&output=embed`;

    $("#gmap_canvas").attr("src", consultUrl);
};

function firstCheckName ()
{
    const name = $(this).val();

    if (name.length == 0)
    {
        $("#name-message").html("O campo é obrigatório!");
        $("#user-name").css({"border-bottom":"2px solid #C7161A"});
        $("#user-name").addClass("input-wrong");
    }
    else if (name.length < 3)
    {
        $("#name-message").html("Mínimo de 3 caracteres!");
        $("#user-name").css({"border-bottom":"2px solid #C7161A"});
        $("#user-name").addClass("input-wrong");
    }
    else
    {
        $("#name-message").html("");
        $("#user-name").attr("style", "");
    };
};

function firstCheckDateBirth ()
{
    const date = $(this).val();
    const validity = validityDate(date);

    function validityDate (_date)
    {
        const date = _date.split("/");

        switch (Number(date[1]))
        {
        case 1:
        case 3:
        case 5:
        case 7:
        case 8:
        case 10:
        case 12:
            if (Number(date[0] > 31) || Number(date[0] < 1))
            {
                return false;
            }
        break;
    
        case 4:
        case 6:
        case 9:
        case 11:
            if (Number(date[0] > 30) || Number(date[0] < 1))
            {
                return false;
            }
        break;
    
        case 2:
            if((Number(date[2]) % 4 == 0 && Number(date[2]) % 100 != 0) || (Number(date[2]) % 400 == 0)  )
            {
                if (Number(date[0] > 29) || Number(date[0] < 1))
                {
                    return false;
                }
            }
            else
            {
                if (Number(date[0] > 28) || Number(date[0] < 1))
                {
                    return false;
                }
            }
        break;
        
        default:
            return false;
        }
    }

    if (date.length == 0)
    {
        $("#birth-message").html("O campo é obrigatório!");
        $("#user-birth").css({"border-bottom":"2px solid #C7161A"});
        $("#user-birth").addClass("input-wrong");
    }
    else if (date.length < 10)
    {
        $("#birth-message").html("A data deve estar no formato DD/MM/AAAA");
        $("#user-birth").css({"border-bottom":"2px solid #C7161A"});
        $("#user-birth").addClass("input-wrong");
    }
    else if (validity == false)
    {
        $("#birth-message").html("Insira uma data válida");
        $("#user-birth").css({"border-bottom":"2px solid #C7161A"});
        $("#user-birth").addClass("input-wrong");
    }
    else
    {
        $("#birth-message").html("");
        $("#user-birth").attr("style", "");
    };
};

function firstCheckCPF ()
{
    const cpf = $(this).val();

    if (cpf.length == 0)
    {
        $("#cpf-message").html("O campo é obrigatório!");
        $("#cpf").css({"border-bottom":"2px solid #C7161A"});
        $("#cpf").addClass("input-wrong");
    }
    else if (cpf.length !== 14)
    {
        $("#cpf-message").html("CPF inválido!");
        $("#cpf").css({"border-bottom":"2px solid #C7161A"});
        $("#cpf").addClass("input-wrong");
    }
    else
    {
        $("#cpf-message").html("");
        $("#cpf").attr("style", "");
    };
};

function firstCheckPhone ()
{
    const phone = $(this).val();

    if (phone.length == 0)
    {
        $("#phone-message").html("O campo é obrigatório!");
        $("#phone").css({"border-bottom":"2px solid #C7161A"});
        $("#phone").addClass("input-wrong");
    }
    else if (phone.length !== 16 && phone.length != 14)
    {
        $("#phone-message").html("Telefone inválido!");
        $("#phone").css({"border-bottom":"2px solid #C7161A"});
        $("#phone").addClass("input-wrong");
    }
    else
    {
        $("#phone-message").html("");
        $("#phone").attr("style", "");
    };
};

function firstCheckCEP ()
{
    const cep = $("#cep").val();

    if (cep.length == 0)
    {
        $("#cep-message").html("O campo é obrigatório!");
        $("#cep").css({"border-bottom":"2px solid #C7161A"});
        $("#cep").addClass("input-wrong");
    }
    else if (cep.length < 10)
    {
        $("#cep-message").html("CEP inválido!");
        $("#cep").css({"border-bottom":"2px solid #C7161A"});
        $("#cep").addClass("input-wrong");
    }
    else
    {
        $("#cep-message").html("");
        $("#cep").attr("style", "");
    };
};

function firstCheckState ()
{
    const state = $("#state").val();

    if (state == "null")
    {
        $("#state-message").html("O campo é obrigatório!");
        $("#state").css({"border-bottom":"2px solid #C7161A"});
        $("#state").addClass("input-wrong");
    }
    else
    {
        $("#state-message").html("");
        $("#state").attr("style", "");
    };
};

function firstCheckCity ()
{
    const city = $("#city").val();

    if (city.length == 0)
    {
        $("#city-message").html("O campo é obrigatório!");
        $("#city").css({"border-bottom":"2px solid #C7161A"});
        $("#city").addClass("input-wrong");
    }
    else if (city.length < 3)
    {
        $("#city-message").html("Cidade inválida!");
        $("#city").css({"border-bottom":"2px solid #C7161A"});
        $("#city").addClass("input-wrong");
    }
    else
    {
        $("#city-message").html("");
        $("#city").attr("style", "");
    };
};

function firstCheckStreet ()
{
    const street = $("#street").val();

    if (street.length == 0)
    {
        $("#street-message").html("O campo é obrigatório!");
        $("#street").css({"border-bottom":"2px solid #C7161A"});
        $("#street").addClass("input-wrong");
    }
    else
    {
        $("#street-message").html("");
        $("#street").attr("style", "");
    };
};

function firstCheckDistrict()
{
    const district = $("#district").val();

    if (district.length == 0)
    {
        $("#district-message").html("O campo é obrigatório!");
        $("#district").css({"border-bottom":"2px solid #C7161A"});
        $("#district").addClass("input-wrong");
    }
    else
    {
        $("#district-message").html("");
        $("#district").attr("style", "");
    };
};

function firstCheckNumber ()
{
    const number = Number($("#number").val());

    if (isNaN(number))
    {
        $("#number-message").html("Insira um valor numérico!");
        $("#number").css({"border-bottom":"2px solid #C7161A"});
        $("#number").addClass("input-wrong");
    }
    else
    {
        $("#number-message").html("");
        $("#number").attr("style", "");
    };
};
