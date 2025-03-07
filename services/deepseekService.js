const env = require('dotenv').config();
const OpenAI = require('openai');

// Configuração do cliente OpenAI (DeepSeek)
const openai = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: process.env.DEEPSEEK_KEY,
});

// Dados pessoais e informações do portfólio
const personal = {
  firstName: 'Wescley',
  otherName: 'Porto',
  lastName: 'de Andrade',
  subTitlePortfolio: 'Expert em Análise e Desenvolvimento de Sistemas e novas tecnologias.',
  about: [
    'Quem é Wescley?',
    'Olá, meu nome é Wescley, como já deve saber, rs!',
    'Sou uma pessoa apaixonada por desafios e movida pela curiosidade. Acredito que a tecnologia tem o poder de transformar o mundo, não apenas no campo científico, mas também impactando a vida das pessoas de maneiras profundas e significativas. Seja criando oportunidades, conectando pessoas ou até mesmo salvando vidas, a tecnologia é a ferramenta que nos permite transformar sonhos em realidade.',
    '"Posso não fazer aquilo que gosto, mas sempre vou gostar daquilo que faço."',
    'Essa mentalidade me motiva a dar o meu melhor em tudo o que me proponho a realizar, enfrentando cada desafio com dedicação, resiliência e otimismo.',
    'Sou organizado, criativo e um eterno aprendiz, sempre em busca de novos conhecimentos e experiências para compartilhar. Acredito que a colaboração e a troca de ideias são essenciais para construir soluções que realmente façam a diferença.',
    'Vamos juntos criar algo incrível?',
  ],
  extrals: [
    '+ 10 anos programando',
    '+ 1 milhão em linhas de código escritas',
    '+ 100 projetos trabalhados',
    '+ 10.000 horas programando',
    '+ 40 vídeos no Youtube',
    '+ 25.000 visualizações no Youtube',
  ],
  history: [
    {
      title: 'Como comecei na Tecnologia',
      content:
        'Minha jornada na tecnologia começou por pura curiosidade. Sempre gostei de entender como as coisas funcionam, desmontar objetos e tentar remontá-los. A primeira vez que sentei em frente a um computador foi um misto de fascínio e desafio. Não demorou muito para que eu percebesse que queria mais do que ser apenas um usuário; eu queria criar, construir e transformar. O primeiro "Olá, Mundo!" que escrevi foi mágico, e desde então não parei mais.',
    },
    {
      title: 'Minhas motivações',
      content:
        'O que me motiva todos os dias é a possibilidade de fazer a diferença. A tecnologia não é apenas código ou máquinas; é uma ponte para melhorar vidas, resolver problemas e criar conexões. Cada desafio que enfrento me motiva ainda mais, porque sei que, ao superá-lo, estarei mais perto de construir algo significativo. Além disso, ver pessoas utilizando soluções que eu criei me dá uma sensação incrível de realização.',
    },
    {
      title: 'Minha inspiração',
      content:
        'Minha maior inspiração na tecnologia é Elon Musk. O que mais admiro nele é a maneira como utiliza a tecnologia para resolver problemas reais, como a Starlink, que oferece internet para pessoas em áreas remotas, longe das grandes cidades, permitindo acesso à conectividade onde antes era impossível. Além disso, ele criou o incrível foguete reutilizável, que é capaz de pousar sozinho, quebrando a frase possivelmente mais famosa da história ("Foguete não tem ré"), agora tem rs. Revolucionando a exploração espacial e tornando o impossível acessível. Sua visão prática e ousada de como a tecnologia pode impactar a vida das pessoas me inspira a buscar soluções inovadoras e transformar desafios em oportunidades.',
    },
    {
      title: 'Desafios e lições',
      content:
        'Minha trajetória não foi isenta de desafios, e sou grato por isso. Tive momentos em que me senti sobrecarregado, projetos que não deram certo e até dúvidas sobre minha capacidade. Mas cada obstáculo me ensinou algo valioso: a importância de persistir, de aprender com os erros e de valorizar cada pequeno progresso. Hoje, vejo os desafios como oportunidades para crescer, tanto profissionalmente quanto pessoalmente.',
    },
    {
      title: 'Visão de futuro',
      content:
        'Minha visão de futuro não gira apenas em torno da tecnologia; também quero crescer como pessoa, me aperfeiçoando e me tornando alguém melhor a cada dia. Quero construir um futuro onde a tecnologia seja um meio poderoso de transformação, não apenas para facilitar a vida das pessoas, mas para literalmente mudá-la. Sonho em usar a tecnologia para melhorar o acesso a serviços essenciais, como hospitais, clínicas e iniciativas voltadas para quem mais precisa, seja pela falta de recursos ou de oportunidades. Minha missão é fazer com que a tecnologia não seja só uma ferramenta, mas um caminho de esperança e renovação para aqueles que, muitas vezes, não têm voz.',
    },
    {
      title: 'Vida fora daqui',
      content:
        'Apesar de amar o que faço, acredito no equilíbrio. Fora da tecnologia, gosto de aproveitar momentos simples, como estar com amigos, família ou simplesmente relaxar. Tenho hobbies que me ajudam a desconectar, como assistir séries de ficção ou sentar na calçada e olhar as estrelas, e sempre busco um tempo para recarregar as energias. Acredito que nossas paixões fora do trabalho também refletem em quem somos como profissionais, e tento trazer esse equilíbrio para tudo o que faço.',
    },
  ],
  hardskills: [
    'Node.js: Atuei por mais de 5 anos desenvolvendo aplicações escaláveis e de alta performance com Node.js. Desde APIs RESTful até sistemas em tempo real com WebSockets.',
    'Amazon Web Services (AWS): Experiência em projetos com EC2, S3, Lambda, RDS e VPC. Implementei soluções de infraestrutura na nuvem para garantir escalabilidade e segurança.',
    'Banco de Dados: Domínio em bancos relacionais (MySQL, PostgreSQL) e não relacionais (MongoDB). Projetos envolvendo modelagem de dados, otimização de queries e migrações.',
    'APIs e Integrações: Desenvolvimento de APIs RESTful e GraphQL, além de integrações com serviços de terceiros como PagSeguro, MercadoPago e WhatsApp.',
    'Frameworks Front-end: Experiência com React, Angular e Vue.js para criação de interfaces modernas e responsivas, com foco em performance e usabilidade.',
    'DevOps e CI/CD: Configuração de pipelines de CI/CD com GitHub Actions, Docker e Kubernetes. Automatização de processos para entrega contínua e alta disponibilidade.',
    'Segurança da Informação: Implementação de práticas de segurança como autenticação JWT, OAuth2 e criptografia de dados para proteger aplicações e APIs.',
    'Microserviços: Desenvolvimento e manutenção de arquiteturas baseadas em microserviços, garantindo escalabilidade e desacoplamento.',
    'Análise de Dados: Experiência com ferramentas de análise de dados como Pandas, NumPy e Tableau para extrair insights e tomar decisões estratégicas.',
  ],
  experience: [
    {
      duration: '01 ano',
      company: 'Bravo serviços logísticos',
      role: 'Analista de Sistemas (Promovido)',
    },
    {
      duration: '08 meses',
      company: 'Bravo serviços logísticos',
      role: 'Assistente de Sistemas II',
    },
    {
      duration: '03 anos',
      company: 'ConectD Games',
      role: 'Sócio gerente (PJ) 54.350.903/0001-21',
    },
    {
      duration: '01 ano',
      company: 'Megsone Technologies',
      role: 'Proprietário & desenvolvedor',
    },
    {
      duration: '01 ano',
      company: 'Xtreme technology',
      role: 'Proprietário e desenvolvedor',
    },
    {
      duration: '07 meses',
      company: 'Xtreme Paulínia - Cell e lan House',
      role: 'Proprietário (3 funcionários)',
    },
  ],
  projects: [
    {
      title: 'MárioBot',
      description:
        'Um dos primeiros sistemas de autoatendimento digital, nessa época poucas pessoas forneciam o serviço, e era limitado à empresas de nome, pois só havia APIs oficiais da Meta.',
    },
    {
      title: 'MárioFood',
      description:
        'Logo após o sucesso do iFood, desenvolvi um sistema ligado ao MárioBot para realizar pedidos via WhatsApp com controle via Dashboard e opcional integração ao iFood.',
    },
    {
      title: 'Redes sociais e chats',
      description: 'Diversas redes sociais e chats desenvolvidos como passa-tempo.',
    },
    {
      title: 'Coleta de informações Facebook',
      description:
        'Desenvolvido para coletar o máximo possível de informações públicas de usuários, desde o usuário de acesso da plataforma até membros de família e fotos.',
    },
    {
      title: 'Fake Mercado Livre',
      description:
        'Plataforma que utiliza de informações públicas do Mercado Livre para manipular usuários e coletar dados. Produtos reais, com preços acessíveis. Além disso, foi planejada para não deixar rastros, portanto, não faz autenticação.',
    },
    {
      title: 'Cars and People Monitor',
      description:
        'IA em Python desenvolvida para alertar movimento de pessoas e veículos.',
    },
    {
      title: 'GTA SA:MP',
      description:
        'Servidor desenvolvido em Pawn (C) para Grand Theft Auto San Andreas.',
    },
    {
      title: 'GTA V FiveM',
      description:
        'Servidor desenvolvido em Lua e Javascript (Node) para Grand Theft Auto Five.',
    },
    {
      title: 'Minecraft Server',
      description:
        'Servidor desenvolvido com ajuda de Java e scripts para Minecraft (1.5/1.7).',
    },
  ],
};

// Função para enviar mensagens ao modelo DeepSeek
async function Send(message) {
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: 'system',
        content:
          'Você é uma assistente chamada Camila que está em meu portfólio, possíveis recrutadores querem saber mais sobre mim, e fica à você passar essas informações.',
      },
      {
        role: 'system',
        content: 'Não responda nada que não seja sobre mim.',
      },
      {
        role: 'system',
        content: `Informações sobre mim: ${JSON.stringify(personal)}, retorne em json, exemplo: { result: ... }`,
      },
      {
        role: 'system',
        content:
          'Mas haja como uma IA mesmo, exemplo:\nP: Qual seu nome?\nR: Se estiver se referindo à mim, me chamo Camila e estou aqui para lhe apresentar o Wescley, é isso mesmo? ... (é um exemplo!)',
      },
      {
        role: 'system',
        content: 'responda de forma engraçada e leve sempre que possível, quero mostrar que sou uma pessoa descontraída'
      },
      {
        role: 'user',
        content: JSON.stringify(message),
      },
    ],
    model: 'deepseek-chat',
    top_p: 0.8,
    response_format: {
      type: 'json_object',
    },
  });

  return JSON.parse(completion.choices[0].message.content);
}

module.exports = { Send };