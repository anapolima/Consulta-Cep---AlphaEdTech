# Consulta Cep

Este projeto foi desenvolvido utilizando HTML, CSS, JavaScript e jQuery.

Seu objetivo é fazer uma consulta à uma API de CEP e autopreencher os campos do formulário de acordo com as informações recebidas pela API.

Após o autopreenchimento, esses campos não podem ser modificados.

Há também a possibilidade de o campo de CEP não ser o primeiro a ser preenchido pelo usuário na parte do formulário que diz respeito ao endereço. Neste caso, após preencher o estado, uma consulta a outra API será feita para obter os nomes de todos os municípios do estado selecionado. Os nomes estarão disponíveis para auxiliar o usuário assim que a digitação começar.

Preenchido o nome da cidade, outra requisição será feita, desta vez para obter a lista de bairros da cidade preenchida pelo usuário (esta informação pode estar faltando ou incompleta no caso de algumas cidades, especialmente pequenas cidades interioranas).

Cada vez que um dado do endereço é preenchido, uma requisição é feita à API do Google Maps para exibir na tela a localzação do endereço. O preenchimento do campo número melhora a precisão do Pin no mapa. Se notar qualquer inconsistência na localização marcada pelo Pin e a localização real, clique em **visualizar mapa ampliado** e sugira uma edição do endereço à Google.

Todos os campos contam com validação.

# Como você pode testar

Basta salvar os arquivos acima em seu computador e abrir o arquivo ***cep.html*** no navegador de sua preferência.
