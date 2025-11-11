// Interface define a "forma" de um objeto
export interface Chapter {
  id: number; // Identificador único
  number: number; // Número do capítulo (1, 2, 3...)
  title: string; // Título do capítulo
  excerpt: string; // Resumo curto
  content: string; // Conteúdo HTML completo
  createdAt?: string; // Data de criação (? = opcional)
  updatedAt?: string; // Data de atualização (opcional)
}
