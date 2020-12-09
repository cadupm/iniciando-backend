Mapeamento de Requisítos e Regras de Negócio

# Recuperação de senha (módulo do usuário)

**RF (Requisitos Funcionais)**

- O usuário deve poder recuperar sua senha informando o seu e-mail;
- O usuário deve receber um e-mail com instruções de recuperação de senha;
- O usuário deve poder resetar sua senha;

**RNF (Requisitos Não-Funcionais) -> Externo as características da aplicação**

- Utilizar Mailtrap para testar envios em ambiente de desenvolvimento;
- Utilizar o Amazon SES para envios em produção;
- O envio de e-mails deve acontecer em segundo plano (background job);
    Geralmente é feito em uma fila gerada em segundo plano, não são feitas TODAS requisições em paralelo, não é necessário;

**RN (Regras de Negócios)**

-
- O link de recuperação de senha deve expirar em 2h;
- O usuário precisa confirmar a nova senha nesse link (digitar a senha duas vezes); -> mais para validação do que RN dentro do controller dessa rota

# Atualização do perfil (módulo do usuário)

**RF**

- O usuário deve poder atualizar seu nome, email, senha;

**RNF**

- Não foi pensando em nenhum RNF;

**RN**

- O usuário não pode alterar seu e-mail para um e-mail já utilizado por outro usuário (validação);
- Para atualizar sua senha, o usuário deve informar a senha antiga;
- Para atualizar sua senha, o usuário precisa confirmar a nova senha (duas vezes);

# Painel do prestador de serviço

**RF**

- O usuário deve poder listar seus agendamentos de um dia específico;
- O prestador deve receber uma notificação sempre que houver um novo agendamento;
- O prestador deve poder visualizar as notifcações não lidas;

**RNF**

- Os agendamentos do prestador no dia devem ser armazenados em cache;
    Caso por ventura os agendamentos forem atualizados deve-se limpar essa cache para trazer as informações atualizadas;
- As notificações do prestador devem ser armazenadas no MongoDB;
- As notificações do prestador devem ser enviadas em tempo-real utilizando o Socket.io;

**RN**

- A notificação deve ter um status de lida ou não lida para que o prestador possa controlar;

# Agendamento de serviços pelo cliente

**RF**

- O usuário (cliente) deve poder listar todos os prestadores de serviço cadastrados;
- O usuário (cliente) deve poder listar os dias de um mês com pelo menos um horário disponível de um prestador de serviço;
- O usuário (cliente) deve poder listar horários disponíveis em um dia específico de um prestador de serviço;
- O usuário (cliente) deve poder realizar um novo agendamento com um prestador;

**RNF**

- A listagem de prestadores de serviço deve ser armazenada em cache;
    Toda vez que for cadastrado um novo prestador de serviço precisaremos limpar a cache;

**RN**

- Cada agendamento deve durar exatamente 1h;
- Os agendamentos devem estar disponíveis entre 8h às 18h (Primeiro horário as 8h, último as 17h);
- O usuário não pode agendar em um horário que já foi alocado;
- O usuário não pode agendar num horário que ja passou (PASSADO);
- O usuário não pode agendar serviços consigo mesmo;
