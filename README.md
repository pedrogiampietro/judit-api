Documentação do Projeto
Este projeto é uma API que interage com o serviço Judit para gerenciar processos. A API permite capturar, mover e listar processos, bem como obter e salvar respostas.

Rotas
POST /capture
Esta rota recebe um search_type e um search_key no corpo da requisição. Ela faz uma requisição POST para o serviço Judit e salva a resposta em um banco de dados local.

PUT /move/:request_id
Esta rota recebe um request_id como parâmetro e um newList no corpo da requisição. Ela busca um processo no banco de dados local pelo request_id, atualiza a lista do processo para newList e salva o processo atualizado no banco de dados.

GET /processes
Esta rota lista todos os processos salvos no banco de dados local.

GET /list/:listId
Esta rota recebe um listId como parâmetro e lista todos os processos na lista especificada.

GET /responses/:response_id
Esta rota recebe um response_id como parâmetro. Ela faz uma requisição GET para o serviço Judit para obter a resposta correspondente e salva a resposta em um banco de dados local.

GET /responses
Esta rota recebe um request_id como parâmetro de consulta. Ela faz uma requisição GET para o serviço Judit para obter a resposta correspondente.

Como usar
Para usar esta API, você precisará ter o Node.js instalado em seu sistema. Depois de clonar este repositório, você pode instalar as dependências executando npm install e iniciar o servidor executando npm start.

Variáveis de ambiente
Esta API requer a seguinte variável de ambiente:

JUDIT_API_KEY: a chave da API para o serviço Judit.
Contribuindo
Contribuições são bem-vindas! Por favor, leia as diretrizes de contribuição antes de enviar um pull request.

Licença
Este projeto está licenciado sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.
