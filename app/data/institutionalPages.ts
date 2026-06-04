export type InstitutionalSection = {
  title: string;
  paragraphs: string[];
  items?: string[];
};

export type InstitutionalPageContent = {
  title: string;
  description: string;
  sections: InstitutionalSection[];
};

export const institutionalPages = {
  "sobre-nos": {
    title: "Sobre nós",
    description:
      "Conheça a Shirt Club, uma loja criada para quem vive futebol dentro e fora de campo.",
    sections: [
      {
        title: "Nossa história",
        paragraphs: [
          "A Shirt Club nasceu para aproximar torcedores das camisas que carregam memória, identidade e paixão pelo futebol.",
          "Selecionamos modelos atuais, retrôs e especiais com foco em qualidade, acabamento e uma experiência de compra simples.",
        ],
      },
      {
        title: "O que buscamos entregar",
        paragraphs: [
          "Queremos que cada compra seja clara, segura e prazerosa, desde a escolha do produto até a chegada do pedido.",
        ],
        items: [
          "Camisas com visual premium",
          "Atendimento próximo e objetivo",
          "Compra segura e acompanhamento do pedido",
          "Variedade entre clubes, seleções e modelos retrô",
        ],
      },
      {
        title: "Nossa curadoria",
        paragraphs: [
          "Organizamos o catálogo pensando em torcedores, colecionadores e em quem gosta de usar camisa de futebol no dia a dia.",
        ],
      },
    ],
  },
  contato: {
    title: "Contato",
    description:
      "Fale com a Shirt Club para tirar dúvidas sobre produtos, pedidos, pagamentos ou entregas.",
    sections: [
      {
        title: "Canais de atendimento",
        paragraphs: [
          "Você pode entrar em contato com a nossa equipe pelos canais oficiais da loja.",
        ],
        items: [
          "WhatsApp: adicione o número oficial da loja",
          "Instagram: @shirt_club_brasil",
          "E-mail: atendimento@shirtclub.com.br",
        ],
      },
      {
        title: "Horário de atendimento",
        paragraphs: [
          "Nosso atendimento funciona em dias úteis. Mensagens enviadas fora do horário comercial serão respondidas assim que possível.",
        ],
      },
      {
        title: "Antes de chamar",
        paragraphs: [
          "Para agilizar o atendimento, envie seu nome, número do pedido e uma descrição curta do que precisa.",
        ],
      },
    ],
  },
  "trocas-e-devolucoes": {
    title: "Trocas e devoluções",
    description:
      "Veja como funcionam os pedidos de troca, devolução e conferência dos produtos.",
    sections: [
      {
        title: "Prazo para solicitar",
        paragraphs: [
          "Você pode solicitar troca ou devolução em até 7 dias corridos após o recebimento do pedido.",
          "O produto precisa estar sem sinais de uso, com etiqueta e na embalagem original sempre que possível.",
        ],
      },
      {
        title: "Como solicitar",
        paragraphs: [
          "Entre em contato com nossa equipe informando o número do pedido, o motivo da solicitação e fotos do produto recebido.",
        ],
        items: [
          "Nome completo",
          "Número do pedido",
          "Fotos do produto",
          "Motivo da troca ou devolução",
        ],
      },
      {
        title: "Produtos personalizados",
        paragraphs: [
          "Produtos personalizados podem ter regras específicas de troca, principalmente quando a personalização foi produzida conforme pedido do cliente.",
        ],
      },
    ],
  },
  "politica-de-privacidade": {
    title: "Política de privacidade",
    description:
      "Entenda como coletamos, usamos e protegemos os dados informados durante sua navegação e compra.",
    sections: [
      {
        title: "Dados coletados",
        paragraphs: [
          "Coletamos apenas os dados necessários para processar pedidos, pagamentos, entregas e atendimento ao cliente.",
        ],
        items: [
          "Nome e informações de contato",
          "Endereço de entrega",
          "Dados do pedido",
          "Informações necessárias para pagamento",
        ],
      },
      {
        title: "Uso das informações",
        paragraphs: [
          "Usamos seus dados para finalizar compras, acompanhar entregas, enviar atualizações sobre pedidos e prestar suporte.",
        ],
      },
      {
        title: "Segurança",
        paragraphs: [
          "Adotamos boas práticas para proteger as informações dos clientes e não vendemos seus dados pessoais.",
        ],
      },
    ],
  },
  "termos-de-uso": {
    title: "Termos de uso",
    description:
      "Confira as regras gerais para navegação, compra e uso dos serviços da Shirt Club.",
    sections: [
      {
        title: "Uso do site",
        paragraphs: [
          "Ao navegar e comprar na Shirt Club, você concorda em usar o site de forma correta, fornecendo informações verdadeiras no cadastro e no checkout.",
        ],
      },
      {
        title: "Pedidos e pagamentos",
        paragraphs: [
          "Os pedidos ficam sujeitos à confirmação de pagamento e disponibilidade dos produtos no momento da compra.",
        ],
      },
      {
        title: "Alterações",
        paragraphs: [
          "A Shirt Club pode atualizar estes termos quando necessário para refletir melhorias no serviço, mudanças legais ou ajustes operacionais.",
        ],
      },
    ],
  },
} satisfies Record<string, InstitutionalPageContent>;

export type InstitutionalPageSlug = keyof typeof institutionalPages;
