class ValidateField
{
    #name
    #dateBirth
    #cpf
    #phone
    #cep
    #state
    #city
    #district
    #street
    #number

    constructor ()
    {
        this.#name,
        this.#dateBirth,
        this.#cpf,
        this.#phone,
        this.#cep,
        this.#state,
        this.#district,
        this.#city,
        this.#street,
        this.#number
    };
    
    setName(_name)
    {
        this.#verifyName(_name)
    };
    
    getName()
    {
        return this.#name;
    };

    setDateBirth(_date)
    {
        this.#verifyDateBirth(_date);
    };

    getDateBirth()
    {
        return this.#dateBirth;
    };

    setCpf(_cpf)
    {
        this.#verifyCPF(_cpf);
    };

    getCpf()
    {
        return this.#cpf;
    };

    setPhone(_phone)
    {
        this.#verifyPhone(_phone);
    };

    getPhone()
    {
        return this.#phone;
    };

    setCep(_cep)
    {
        this.#verifyCEP(_cep);
    };

    getCep()
    {
        return this.#cep;
    };

    setState(_state)
    {
        this.#verifyState(_state);
    };

    getState()
    {
        return this.#state;
    };
    
    setCity(_city)
    {
        this.#verifyCity(_city);
    };
    
    getCity()
    {
        return this.#city;
    };

    setDistrict(_district)
    {
        this.#verifyDistrict(_district);
    };

    getDistrict()
    {
        return this.#district;
    };

    setStreet(_street)
    {
        this.#verifyStreet(_street);
    };

    getStreet()
    {
        return this.#street;
    };

    setNumber(_number)
    {
        this.#verifyNumber(_number);
    };

    getNumber()
    {
        return this.#number;
    };

    #verifyName = (_name) =>
    {
        const name = _name;
        const result = [];
        for (let num = 0; num < 10; num++)
        {
            const test =  name.indexOf(num);
            if (test !== -1)
            {
                result.push(test);
            };
        };

        if (result.length === 0 && name.length > 2)
        {
            this.#name = true;
        }
        else
        {
            this.#name = false;
        };
    };

    #verifyDateBirth = (_date) =>
    {
        const dateString = _date;
        const letterE = dateString.toLowerCase().indexOf("e");
        const dateNumber = Number(dateString.replaceAll("/", ""));

        const validity = validityDate(dateString);

        function validityDate (_date)
        {
            const date = _date.split("/");

            const dateToday = new Date()
            const today = dateToday.toLocaleDateString();
            const splitedToday = today.split("/");

            const timestampToday = new Date (Number(splitedToday[2]), Number(splitedToday[1]) - 1, Number(splitedToday[0]))
            const timestampDate = new Date (Number(date[2]), Number(date[1]) - 1, Number(date[0]))

            if (timestampToday.getTime() >= timestampDate.getTime())
            {
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
            else
            {
                return false;
            }
        }

        if ((isNaN(dateNumber) || dateString.length !== 10) || letterE !== -1 || validity === false)
        {
            this.#dateBirth = false;
        }
        else
        {
            this.#dateBirth = true;
        };
    };

    #verifyCPF = (_cpf) =>
    {
        const cpfString = _cpf;
        const letterE = cpfString.toLowerCase().indexOf("e");
        const cpfNumber = Number(cpfString.replaceAll(".", "").replace("-", ""));
        const validityCPF = checkCPF(cpfString);

        function checkCPF (_cpfString)
        {
            const strCPF = _cpfString.replaceAll(".", "").replace("-", "");

            let sum;
            let rest;
            sum = 0;   

            if (strCPF === "00000000000")
            {
                return false;
            };
        
            for (let i = 1; i <= 9; i++)
            {
                sum = sum + parseInt(strCPF.substring(i - 1, i)) * (11 - i);
            };
        
            rest = (sum * 10) % 11;
            if ((rest === 10) || (rest === 11)) 
            {
                rest = 0;
            };
        
            if (rest !== parseInt(strCPF.substring(9, 10)))
            {
                return false;
            };
        
            sum = 0;
            for (let i = 1; i <= 10; i++)
            {       
                sum = sum + parseInt(strCPF.substring(i - 1, i)) * (12 - i);
            };
        
            rest = (sum * 10) % 11;
            if ((rest === 10) || (rest === 11)) 
            {
                rest = 0;
            };
        
            if (rest !== parseInt(strCPF.substring(10, 11)))
            {
                return false;
            }
            else
            {
                return true;
            };
        }
            
        if (isNaN(cpfNumber) || cpfString.length !== 14 || letterE !== -1 || validityCPF === false)
        {
            this.#cpf = false;
        }
        else
        {
            this.#cpf = true;
        };
    };

    #verifyPhone = (_phone) =>
    {
        const phoneString = _phone;
        const letterE = phoneString.toLowerCase().indexOf("e");
        const phoneNumber = Number(phoneString.replace("(", "").replace(")", "").replace("-", "").replaceAll(" ", ""));

        if (isNaN(phoneNumber) || (phoneString.length !== 16 && phoneString.length !== 14) || letterE !== -1)
        {
            this.#phone = false;
        }
        else
        {
            this.#phone = true;
        };
    };

    #verifyCEP = (_cep) =>
    {
        const cepString = _cep;
        const letterE = cepString.toLowerCase().indexOf("e");
        const cepNumber = Number(cepString.replace(".", "").replace("-", ""));

        if (isNaN(cepNumber) || cepString.length !== 10 || letterE !== -1)
        {
            this.#cep = false;
        }
        else
        {
            this.#cep = true;
        };
    };

    #verifyState = (_state) =>
    {
        const state = _state;
        const result = [];
        for (let num = 0; num < 10; num++)
        {
            const test =  state.indexOf(num);
            if (test !== -1)
            {
                result.push(test);
            };
        };

        if (result.length === 0 && state.length == 2)
        {
            this.#state = true;
        }
        else
        {
            this.#state = false;
        };
    };
    
    #verifyCity = (_city) =>
    {
        const city = _city;
        const result = [];
        for (let num = 0; num < 10; num++)
        {
            const test =  city.indexOf(num);
            if (test !== -1)
            {
                result.push(test);
            };
        };
        
        if (result.length === 0 && city.length > 2)
        {
            this.#city = true;
        }
        else
        {
            this.#city = false;
        };
    };

    #verifyDistrict = (_district) =>
    {
        const district = _district;

        if (district.length !== 0)
        {
            this.#district = true;
        }
        else
        {
            this.#district = false;
        };
    };
    
    #verifyStreet = (_street) =>
    {
        const street = _street;

        if (street.length !== 0)
        {
            this.#street = true;
        }
        else
        {
            this.#street = false;
        };
    };

    #verifyNumber = (_number) =>
    {
        const numberString = _number;
        const letterE = numberString.toLowerCase().indexOf("e");
        const numberNumber = Number(numberString);

        if (isNaN(numberNumber) || letterE !== -1)
        {
            this.#number = false;
        }
        else
        {
            this.#number = true;
        };
    };
}

const validate = new ValidateField();