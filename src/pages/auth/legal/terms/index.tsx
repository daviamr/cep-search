import { LegalDocumentPage } from "../components/legal-document-page"

const TERMS_SECTIONS = [
  {
    title: "Aceitação dos termos",
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
  },
  {
    title: "Descrição do serviço",
    body: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  },
  {
    title: "Conta e responsabilidades",
    body: "Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis et commodo pharetra, est eros bibendum elit, nec luctus magna felis sollicitudin mauris.",
  },
  {
    title: "Uso aceitável",
    body: "Integer in mauris eu nibh euismod gravida. Duis ac tellus et risus vulputate vehicula. Donec lobortis risus a elit. Etiam tempor. Ut ullamcorper, ligula eu tempor congue, eros est euismod turpis.",
  },
  {
    title: "Limitação de responsabilidade",
    body: "Nam congue, pede vitae dapibus aliquet, elit magna vulputate arcu, vel tempus metus leo non est. Etiam sit amet fringilla sapien. Maecenas mi libero, bibendum at, egestas nec, vulputate ut, ipsum.",
  },
  {
    title: "Alterações",
    body: "O Busca Endereço pode atualizar estes termos periodicamente. O uso continuado da plataforma após as alterações implica aceitação da versão vigente.",
  },
]

export default function TermsOfService() {
  return (
    <LegalDocumentPage
      title="Termos de Serviço"
      intro="Conteúdo placeholder. Substitua pelo texto jurídico oficial do Busca Endereço."
      sections={TERMS_SECTIONS}
    />
  )
}
