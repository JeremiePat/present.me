FROM pandoc/latex:latest
# We need more than just the pandoc/latex to output
# pdf/slides with any code syntax highlighting
RUN tlmgr install framed
