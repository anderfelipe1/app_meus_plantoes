# Atas de frequência do Brites

A conta autenticada fornece os registros. A ferramenta MCP `generate_brites_frequency` gera e arquiva uma ata por conta e competência. Sem argumento, considera o mês anterior em America/Fortaleza. Nunca combinar registros de contas diferentes.

Use apenas plantões de Hospital Brites de Albuquerque, independentemente do pagamento. Ordene as datas e remova duplicatas. A10 contém a competência; as datas começam em A14. Preserve o modelo hospitalar, DIURNO e 7h–19h. Não gerar atas vazias nem arquivos com datas futuras. Novembro de 2026 é liberado em 1º de dezembro de 2026. Dezembro de 2026 é liberado em 1º de janeiro de 2027.

A ferramenta retorna attachmentUrl (link temporário de uma hora), attachmentFilename e downloadUrl. Baixe o arquivo por attachmentUrl e envie o conteúdo binário como anexo XLSX via Gmail. Não enviar o link temporário no corpo da mensagem. Não enviar amostras nem registros sintéticos. Antes de enviar, pesquisar mensagens já enviadas para o destinatário com o mesmo assunto e competência, evitando duplicatas em tentativas repetidas. Falhas devem permanecer visíveis; não declarar envio sem confirmação do Gmail.

Ao gerar ou baixar a ata, recalcular as datas com os lançamentos atuais, refletindo inclusões, edições e exclusões. Não reenviar automaticamente um e-mail já enviado apenas porque as datas mudaram. Arquivos já baixados ou enviados não são alterados retroativamente.
