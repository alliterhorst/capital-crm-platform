export const MESSAGES_HELPER = {
  VALIDATION: {
    IS_NOT_EMPTY: 'Este campo não pode estar vazio.',
    IS_STRING: 'Este campo deve ser um texto.',
    IS_EMAIL: 'O formato do e-mail é inválido.',
    IS_NUMBER: 'Este campo deve ser um número.',
    MIN_LENGTH: (min: number): string => `O tamanho mínimo é de ${min} caracteres.`,
    MAX_LENGTH: (max: number): string => `O tamanho máximo é de ${max} caracteres.`,
  },
  AUTH: {
    LOGIN_SUCCESS: 'Login realizado com sucesso.',
    INVALID_CREDENTIALS: 'Credenciais inválidas. Verifique seu e-mail e senha.',
    UNAUTHORIZED: 'Acesso não autorizado.',
  },
  DATABASE: {
    CONNECT_SUCCESS: 'Conexão com o banco de dados estabelecida.',
    CONNECT_ERROR: 'Falha ao conectar ao banco de dados.',
  },
} as const;
