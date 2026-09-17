import { LegalDocumentPage } from "../components/legal-document-page"

const PRIVACY_SECTIONS = [
  {
    title: "Informações que coletamos",
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
  },
  {
    title: "Como usamos os dados",
    body: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  },
  {
    title: "Compartilhamento de informações",
    body: "Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis et commodo pharetra, est eros bibendum elit, nec luctus magna felis sollicitudin mauris.",
  },
  {
    title: "Armazenamento e segurança",
    body: "Integer in mauris eu nibh euismod gravida. Duis ac tellus et risus vulputate vehicula. Donec lobortis risus a elit. Etiam tempor. Ut ullamcorper, ligula eu tempor congue, eros est euismod turpis.",
  },
  {
    title: "Seus direitos",
    body: "Nam congue, pede vitae dapibus aliquet, elit magna vulputate arcu, vel tempus metus leo non est. Etiam sit amet fringilla sapien. Maecenas mi libero, bibendum at, egestas nec, vulputate ut, ipsum.",
  },
  {
    title: "Contato",
    body: "Para dúvidas sobre esta política, entre em contato com o suporte do Busca Endereço pelo canal oficial indicado na plataforma.",
  },
]

export default function PrivacyPolicy() {
  return (
    <LegalDocumentPage
      title="Política de Privacidade"
      intro="Conteúdo placeholder. Substitua pelo texto jurídico oficial do Busca Endereço."
      sections={PRIVACY_SECTIONS}
    />
  )
}
