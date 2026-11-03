# Meus Plantões — projeto final para VS Code

Código-fonte da versão publicada, incluindo logo RDFP, modalidades Safety Med, adicionais, atas do Brites, totalização e acesso compartilhado com a conta da médica.

## Requisitos

- Node.js 22.13 ou superior (recomendado: Node.js 24 LTS).
- VS Code e conexão com a internet para instalar as dependências.

## 1. Abrir

Extraia este ZIP para uma pasta e abra essa pasta no VS Code em Arquivo > Abrir Pasta.
Abra Terminal > Novo Terminal. No Windows, use os comandos com `.cmd` para evitar o bloqueio de scripts do PowerShell.

## 2. Instalar e compilar

```powershell
npm.cmd run install:ci
npm.cmd run build
```

## 3. Criar o banco LOCAL de desenvolvimento

Execute uma única vez em um banco local vazio, após compilar:

```powershell
Get-ChildItem .\drizzle\*.sql | Sort-Object Name | ForEach-Object {
    node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file $_.FullName
    if ($LASTEXITCODE -ne 0) { throw "Falha ao aplicar a migração $($_.Name)" }
}
```

Esses comandos criam apenas o banco local. Não repetem ou copiam o banco de produção. Não reaplique migrações já aplicadas ao mesmo banco.

## 4. Executar

```powershell
npm.cmd run dev
```

Abra a URL Local exibida no terminal, normalmente http://127.0.0.1:5173.
Para simular o login local, abra http://127.0.0.1:5173/signin-with-chatgpt?return_to=/.
Esse login de desenvolvimento usa uma identidade de teste e não acessa os lançamentos reais.

## Onde editar

- app/dashboard.tsx: tela principal e formulário.
- app/globals.css: aparência e adaptação para celular.
- lib/calculate-shift.ts: modalidades, adicionais e total do lançamento.
- lib/shift-price.ts: regras de valor por empresa, turno e dia.
- lib/record-owner.ts: compartilhamento autorizado entre as contas.
- app/api/shifts/route.ts: leitura, gravação, edição e exclusão.
- app/frequency-panel.tsx: área de atas.
- lib/frequency-store.ts e lib/frequency-workbook.ts: atualização da ata e geração do Excel.
- lib/frequency-template.json: modelo original da ata, preservado no aplicativo.
- db/schema.ts e drizzle/: estrutura do banco e migrações.
- app/mcp/route.ts: ferramenta usada pela rotina mensal.
- public/logo-rdfp.png: logo.

## Hospedagem, banco real e envio mensal

O código usa React, TypeScript, Vinext/Vite e Cloudflare D1, com autenticação de produção fornecida pelo Sites. O manifesto .openai/hosting.json identifica a hospedagem existente.

O ZIP não contém registros do banco, tokens, senhas, node_modules nem credenciais de login. A migração foi concluída: o app publicado lê e grava no banco app-medico da conta Cloudflare do proprietário, por uma conexão Worker protegida. O banco antigo do Sites foi preservado e não é a conexão ativa da versão publicada.

O agendamento mensal e a conexão do Gmail são configurações externas do Sites/ChatGPT e não são ativados apenas ao executar este código localmente. FREQUENCY-AUTOMATION.md descreve o processo, mas não contém credenciais.

A autenticação hospedada e os cabeçalhos oai-authenticated-user-* dependem do Sites. Se hospedar toda a aplicação fora do Sites, é necessário implementar uma autenticação confiável. A conexão ao D1 particular já está implementada em db/remote-d1.ts. Não confie em cabeçalhos de identidade enviados livremente por visitantes.

A versão já publicada permanece disponível em:
https://meus-plantoes-ander.largeiris4.chatgpt.site/


## Conexão com o banco particular — versão final

- db/remote-d1.ts implementa o adaptador de conexão protegida ao D1.
- db/index.ts seleciona a conexão externa quando EXTERNAL_D1_URL e EXTERNAL_D1_SECRET estão preenchidas. Sem ambas, o desenvolvimento usa o D1 local.
- cloudflare-connection/worker.mjs é o código da conexão publicada na Cloudflare.
- cloudflare-connection/wrangler.jsonc identifica o Worker e o banco app-medico. Contém apenas identificadores públicos, não contém credenciais.

Em produção, configure no Sites:

EXTERNAL_D1_URL=https://app-medico-d1-connection.anderfelipe1.workers.dev
EXTERNAL_D1_SECRET=<chave protegida, cadastrada como segredo>

O Worker Cloudflare usa o segredo BRIDGE_SECRET com o mesmo valor de EXTERNAL_D1_SECRET. A chave não acompanha este pacote, nem precisa ser colocada no código. As configurações já cadastradas em produção continuam funcionando.

Para desenvolver localmente, siga o banco local das etapas acima. O login local é simulado e não representa as contas de produção; por isso ele começa sem os lançamentos reais. Para desenvolvimento deliberado com outra conexão externa, copie .dev.vars.example para .dev.vars e preencha os dois valores em ambiente privado. Isso não recria o login real do Sites. Não adicione esse arquivo ao Git.

## Versão do código

Commit da versão final publicada: 164a895a3413e728b63e78315fbf7a5aa685dfa8.
O pacote também inclui o código separado do Worker de conexão, já implantado na Cloudflare.
