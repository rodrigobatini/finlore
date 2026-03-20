# Contexto de retomada - Finlore

## Objetivo do produto
Construir uma plataforma de noticias financeiras com:
- Curadoria de noticias (APIs publicas e RSS)
- Correlacao de conceitos para aprendizado
- Tutor IA para explicar impacto e fundamentos

## Ponto em que paramos
- Frontend Vue funcionando e com UI redesenhada
- Feed com fallback mock para nao bloquear testes
- Navegacao basica: Noticias, Mercado, Tutor
- Repositorio criado no GitHub e sincronizado

## Proximo objetivo tecnico (curto prazo)
Conectar feed real e preparar base para tutor com contexto.

## Checklist de amanha (ordem sugerida)
- [ ] Revisar e atualizar `PLANO.md` para refletir estado atual
- [ ] Fechar schema Supabase final
- [ ] Implementar ingestao de RSS/APIs
- [ ] Persistir noticias e tags de conceito
- [ ] Exibir dados reais no `web-client`
- [ ] Definir primeiro endpoint do tutor com prompt base

## Decisoes abertas
- Quais fontes RSS/APIs entram no MVP (3-5 fontes)
- Frequencia de sincronizacao de noticias
- Estrategia inicial de correlacao (regra simples vs embedding direto)

## Criterio de sucesso da proxima sessao
- Abrir o app e ver feed real atualizado
- Clicar em uma noticia e obter explicacao contextual do tutor (mesmo que v1 simples)

