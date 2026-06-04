import type { InstitutionalPageContent } from "./institutionalPages";

export const helpPages = {
  "perguntas-frequentes": {
    title: "Perguntas frequentes",
    description:
      "Respostas rápidas para as principais dúvidas sobre pedidos, produtos, pagamento e atendimento.",
    sections: [
      {
        title: "Como acompanho meu pedido?",
        paragraphs: [
          "Após a confirmação do pedido, você recebe as principais atualizações pelos dados informados no checkout.",
          "Quando o envio estiver disponível, o código de rastreamento poderá ser consultado na página de rastreamento.",
        ],
      },
      {
        title: "Os produtos têm pronta entrega?",
        paragraphs: [
          "A disponibilidade pode variar conforme o modelo, tamanho e estoque no momento da compra.",
        ],
      },
      {
        title: "Posso trocar o tamanho?",
        paragraphs: [
          "Sim, desde que o pedido esteja dentro do prazo de troca e o produto siga as condições informadas na política de trocas e devoluções.",
        ],
      },
    ],
  },
  "formas-de-pagamento": {
    title: "Formas de pagamento",
    description:
      "Veja as opções disponíveis para pagar seu pedido com segurança na Shirt Club.",
    sections: [
      {
        title: "Pagamentos disponíveis",
        paragraphs: [
          "As formas de pagamento disponíveis aparecem durante o checkout, conforme as opções liberadas pelo provedor de pagamento.",
        ],
        items: [
          "Cartão de crédito",
          "Pix",
          "Boleto, quando disponível",
          "Outras opções exibidas no checkout",
        ],
      },
      {
        title: "Confirmação do pagamento",
        paragraphs: [
          "Pedidos pagos por cartão costumam ter confirmação mais rápida. Pagamentos por Pix ou boleto podem depender da compensação do provedor.",
        ],
      },
      {
        title: "Segurança",
        paragraphs: [
          "Os dados de pagamento são processados em ambiente seguro pelo provedor responsável pela transação.",
        ],
      },
    ],
  },
  "prazos-e-entregas": {
    title: "Prazos e entregas",
    description:
      "Entenda como funcionam os prazos de postagem, transporte e recebimento do pedido.",
    sections: [
      {
        title: "Prazo de postagem",
        paragraphs: [
          "Após a confirmação do pagamento, o pedido entra em separação e preparação para envio.",
        ],
      },
      {
        title: "Prazo de entrega",
        paragraphs: [
          "O prazo de entrega pode variar de acordo com o endereço, modalidade de envio e operação da transportadora.",
        ],
      },
      {
        title: "Endereço de entrega",
        paragraphs: [
          "Confira todos os dados antes de finalizar a compra. Informações incorretas podem atrasar ou impedir a entrega.",
        ],
      },
    ],
  },
  rastreamento: {
    title: "Rastreamento",
    description:
      "Acompanhe o andamento do seu pedido e saiba o que fazer caso precise de ajuda.",
    sections: [
      {
        title: "Como rastrear",
        paragraphs: [
          "Quando o pedido for enviado, o código de rastreamento será disponibilizado para consulta.",
        ],
      },
      {
        title: "Atualização do rastreio",
        paragraphs: [
          "Algumas transportadoras podem levar algumas horas para atualizar as informações após a postagem.",
        ],
      },
      {
        title: "Pedido sem atualização",
        paragraphs: [
          "Se o rastreio ficar sem atualização por muito tempo, entre em contato com a nossa equipe informando o número do pedido.",
        ],
      },
    ],
  },
} satisfies Record<string, InstitutionalPageContent>;

export type HelpPageSlug = keyof typeof helpPages;
