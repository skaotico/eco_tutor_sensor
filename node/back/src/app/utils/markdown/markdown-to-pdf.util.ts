import * as mdToPdf from 'md-to-pdf';

/**
 * Utilitario para convertir un Buffer de Markdown a PDF.
 * @param markdownBuffer El Buffer que contiene el contenido Markdown.
 * @returns El Buffer del PDF generado.
 */
// export async function convertMarkdownBufferToPdf(markdownBuffer: Buffer): Promise<Buffer> {
//   try {
//     // Convierte el Buffer de Markdown a texto
//     const markdownContent = markdownBuffer.toString('utf-8');

//     // Usa md-to-pdf para convertir el contenido Markdown a PDF
//     // const pdf = await mdToPdf({ content: markdownContent });

//     // Retorna el PDF generado como un Buffer
//     return pdf.content;
//   } catch (error) {
//     throw new Error('Error al convertir Markdown a PDF: ' + error.message);
//   }
// }