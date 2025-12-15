import nodemailer, { type SendMailOptions } from 'nodemailer';
import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from 'pdf-lib';

const BRAND_ACCENT = '#800000';
const BRAND_DARK = '#1a1a1a';
const BRAND_TEXT = '#171717';
const BRAND_BORDER = '#ededed';

const BRAND_ACCENT_RGB = rgb(128 / 255, 0, 0);
const BRAND_DARK_RGB = rgb(26 / 255, 26 / 255, 26 / 255);
const BRAND_TEXT_RGB = rgb(23 / 255, 23 / 255, 23 / 255);
const BRAND_MUTED_RGB = rgb(110 / 255, 110 / 255, 110 / 255);
const BRAND_BORDER_RGB = rgb(237 / 255, 237 / 255, 237 / 255);

type OrderItem = {
  title?: string;
  price?: number;
  quantity?: number;
  currency?: string;
};

type Customer = {
  name?: string;
  email?: string;
  address?: string;
  phone?: string;
};

type Order = {
  sessionId: string;
  status: string;
  createdAt: string;
  items: OrderItem[];
  customer?: Customer | Record<string, unknown> | unknown;
  raw?: Record<string, unknown> | unknown;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function readString(source: unknown, key: string): string | undefined {
  if (!isRecord(source)) return undefined;
  const value = source[key];
  return typeof value === 'string' ? value : undefined;
}

function readCustomer(source: unknown): Customer {
  return {
    name: readString(source, 'name'),
    email: readString(source, 'email'),
    phone: readString(source, 'phone'),
    address: readString(source, 'address'),
  };
}

function getTransporter() {
  const host = process.env.SMTP_HOST?.trim();
  const port = process.env.SMTP_PORT ? Number(String(process.env.SMTP_PORT).trim()) : 587;
  const user = process.env.SMTP_USER?.trim();
  // Allow either a raw app password or a space-separated version copied from UI (e.g. "abcd efgh ijkl mnop").
  const pass = process.env.SMTP_PASS ? String(process.env.SMTP_PASS).replace(/\s+/g, '') : undefined;

  if (!host || !user || !pass) {
    throw new Error('SMTP configuration missing (SMTP_HOST/SMTP_USER/SMTP_PASS)');
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

function formatOrderText(order: Order) {
  const lines: string[] = [];
  const currency = safeCurrency(order);
  const formatCurrency = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(value);
  lines.push(`Order: ${order.sessionId}`);
  lines.push(`Status: ${order.status}`);
  lines.push(`Date: ${order.createdAt}`);
  lines.push('');
  lines.push('Items:');
  let total = 0;
  for (const it of order.items || []) {
    const title = it.title || 'Item';
    const qty = Number(it.quantity || 1);
    const price = typeof it.price === 'number' ? it.price : NaN;
    const lineTotal = Number.isFinite(price) ? price * qty : NaN;
    if (Number.isFinite(lineTotal)) {
      lines.push(`- ${title} x${qty} @ ${formatCurrency(price)} = ${formatCurrency(lineTotal)}`);
      total += lineTotal;
    } else {
      lines.push(`- ${title} x${qty}`);
    }
  }
  lines.push('');
  lines.push(`Total: ${formatCurrency(total)}`);
  const customer = readCustomer(order.customer);
  if (customer.name || customer.email || customer.phone || customer.address) {
    lines.push('Customer:');
    if (customer.name) lines.push(`  ${customer.name}`);
    if (customer.email) lines.push(`  ${customer.email}`);
    if (customer.phone) lines.push(`  ${customer.phone}`);
    if (customer.address) lines.push(`  ${customer.address}`);
  }
  return lines.join('\n');
}

function escapeHtml(input: unknown) {
  const str = input == null ? '' : String(input);
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function safeCurrency(order: Order) {
  const currencyFromItems = order.items?.[0]?.currency;
  const currencyFromRaw = readString(order.raw, 'currency');
  return String(currencyFromItems || currencyFromRaw || 'USD').toUpperCase();
}

function formatDateLabel(dateLike: unknown) {
  const raw = dateLike == null ? '' : String(dateLike);
  const dt = new Date(raw);
  if (!raw || Number.isNaN(dt.getTime())) return raw;
  try {
    return dt.toLocaleString('en-GB', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return raw;
  }
}

function buildEmailShell(params: { title: string; preheader?: string; bodyHtml: string }) {
  const title = escapeHtml(params.title);
  const preheader = escapeHtml(params.preheader || '');

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="x-apple-disable-message-reformatting" />
    <title>${title}</title>
  </head>
  <body style="margin:0;padding:0;background:#ffffff;color:${BRAND_TEXT};">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">
      ${preheader}
    </div>

    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-collapse:collapse;width:100%;background:#ffffff;">
      <tr>
        <td align="center" style="padding:24px 12px;">
          <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="border-collapse:collapse;width:100%;max-width:600px;border:1px solid ${BRAND_BORDER};">
            <tr>
              <td style="padding:22px 24px 14px 24px;">
                <div style="padding-bottom:12px;border-bottom:2px solid ${BRAND_ACCENT};">
                  <div style="font-family:Georgia,'Times New Roman',serif;font-size:22px;line-height:1.2;color:${BRAND_TEXT};">
                    Art Masons
                  </div>
                  <div style="font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.5;color:${BRAND_TEXT};opacity:0.9;">
                    Museum-quality oil painting reproductions
                  </div>
                </div>
              </td>
            </tr>

            <tr>
              <td style="padding:18px 24px 26px 24px;font-family:Arial,Helvetica,sans-serif;color:${BRAND_TEXT};">
                ${params.bodyHtml}
              </td>
            </tr>

            <tr>
              <td style="padding:16px 24px;background:${BRAND_DARK};color:${BRAND_BORDER};font-family:Arial,Helvetica,sans-serif;">
                <div style="font-size:12px;line-height:1.6;">
                  Need help? Email <a href="mailto:info@artmasons.com" style="color:#ffffff;text-decoration:underline;">info@artmasons.com</a> or call +971 56 170 4788
                </div>
                <div style="font-size:11px;line-height:1.6;opacity:0.9;">
                  Trade Mark 1990/${new Date().getFullYear()} Art Masons. All rights reserved.
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function formatOrderHtml(order: Order) {
  const currency = safeCurrency(order);
  const formatCurrency = (value: number) => {
    try {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(value);
    } catch {
      return `${currency} ${value.toFixed(2)}`;
    }
  };

  const customer = readCustomer(order.customer);

  let subtotal = 0;
  const rowsHtml = (order.items || [])
    .map((it) => {
      const title = escapeHtml(it.title || 'Item');
      const qty = Number(it.quantity || 1);
      const price = typeof it.price === 'number' ? it.price : NaN;
      const hasPrice = Number.isFinite(price);
      const lineTotal = hasPrice ? price * qty : NaN;
      if (Number.isFinite(lineTotal)) subtotal += lineTotal;
      return `
        <tr>
          <td style="padding:10px 12px;border-bottom:1px solid ${BRAND_BORDER};font-size:14px;line-height:1.4;">${title}</td>
          <td align="right" style="padding:10px 12px;border-bottom:1px solid ${BRAND_BORDER};font-size:14px;">${escapeHtml(qty)}</td>
          <td align="right" style="padding:10px 12px;border-bottom:1px solid ${BRAND_BORDER};font-size:14px;white-space:nowrap;">${hasPrice ? escapeHtml(formatCurrency(price)) : '&mdash;'}</td>
          <td align="right" style="padding:10px 12px;border-bottom:1px solid ${BRAND_BORDER};font-size:14px;white-space:nowrap;">${Number.isFinite(lineTotal) ? escapeHtml(formatCurrency(lineTotal)) : '&mdash;'}</td>
        </tr>`;
    })
    .join('');

  const total = subtotal;

  const bodyHtml = `
    <div style="font-family:Arial,Helvetica,sans-serif;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:${BRAND_ACCENT};margin:0 0 8px 0;">
      Invoice
    </div>
    <div style="margin:0 0 14px 0;font-family:Georgia,'Times New Roman',serif;font-size:22px;line-height:1.25;color:${BRAND_TEXT};">
      Order ${escapeHtml(order.sessionId)}
    </div>

    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-collapse:collapse;margin:0 0 16px 0;border:1px solid ${BRAND_BORDER};">
      <tr>
        <td style="padding:12px 12px;border-bottom:1px solid ${BRAND_BORDER};font-size:13px;">
          <strong>Status</strong><br />
          <span style="color:${BRAND_TEXT};">${escapeHtml(order.status)}</span>
        </td>
        <td style="padding:12px 12px;border-bottom:1px solid ${BRAND_BORDER};font-size:13px;">
          <strong>Invoice date</strong><br />
          <span style="color:${BRAND_TEXT};">${escapeHtml(formatDateLabel(order.createdAt))}</span>
        </td>
        <td style="padding:12px 12px;border-bottom:1px solid ${BRAND_BORDER};font-size:13px;">
          <strong>Currency</strong><br />
          <span style="color:${BRAND_TEXT};">${escapeHtml(currency)}</span>
        </td>
      </tr>
      <tr>
        <td colspan="3" style="padding:12px;font-size:13px;line-height:1.6;">
          <strong>Billed to</strong><br />
          ${escapeHtml(customer.name || '')}${customer.name ? '<br />' : ''}
          ${escapeHtml(customer.email || '')}${customer.email ? '<br />' : ''}
          ${escapeHtml(customer.phone || '')}${customer.phone ? '<br />' : ''}
          ${escapeHtml(customer.address || '')}
        </td>
      </tr>
    </table>

    <div style="margin:0 0 10px 0;font-family:Georgia,'Times New Roman',serif;font-size:16px;line-height:1.3;color:${BRAND_TEXT};">Line items</div>

    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-collapse:collapse;border:1px solid ${BRAND_BORDER};">
      <tr>
        <th align="left" style="padding:10px 12px;background:${BRAND_DARK};color:#ffffff;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;">Description</th>
        <th align="right" style="padding:10px 12px;background:${BRAND_DARK};color:#ffffff;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;white-space:nowrap;">Qty</th>
        <th align="right" style="padding:10px 12px;background:${BRAND_DARK};color:#ffffff;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;white-space:nowrap;">Unit price</th>
        <th align="right" style="padding:10px 12px;background:${BRAND_DARK};color:#ffffff;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;white-space:nowrap;">Amount</th>
      </tr>
      ${rowsHtml || `
        <tr>
          <td colspan="4" style="padding:12px;font-size:14px;border-bottom:1px solid ${BRAND_BORDER};">No items found for this order.</td>
        </tr>`}
    </table>

    <div style="height:12px;line-height:12px;">&nbsp;</div>

    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-collapse:collapse;border:1px solid ${BRAND_BORDER};">
      <tr>
        <td style="padding:10px 12px;font-size:14px;border-bottom:1px solid ${BRAND_BORDER};">Subtotal</td>
        <td align="right" style="padding:10px 12px;font-size:14px;border-bottom:1px solid ${BRAND_BORDER};white-space:nowrap;">${escapeHtml(formatCurrency(subtotal))}</td>
      </tr>
      <tr>
        <td style="padding:12px;font-size:14px;"><strong>Total</strong></td>
        <td align="right" style="padding:12px;font-size:14px;white-space:nowrap;"><strong>${escapeHtml(formatCurrency(total))}</strong></td>
      </tr>
    </table>

    <div style="height:14px;line-height:14px;">&nbsp;</div>
    <div style="font-size:13px;line-height:1.6;color:${BRAND_TEXT};">
      A PDF copy of this invoice is attached for your records.
    </div>
  `;

  return buildEmailShell({
    title: `Invoice for order ${order.sessionId}`,
    preheader: `Invoice for order ${order.sessionId}. Total ${formatCurrency(total)}.`,
    bodyHtml,
  });
}

function truncateToWidth(text: string, font: PDFFont, fontSize: number, maxWidth: number) {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (!clean) return '';
  if (font.widthOfTextAtSize(clean, fontSize) <= maxWidth) return clean;
  const ellipsis = '…';
  const ellipsisWidth = font.widthOfTextAtSize(ellipsis, fontSize);
  let low = 0;
  let high = clean.length;
  while (low < high) {
    const mid = Math.ceil((low + high) / 2);
    const slice = clean.slice(0, mid);
    const w = font.widthOfTextAtSize(slice, fontSize) + ellipsisWidth;
    if (w <= maxWidth) low = mid;
    else high = mid - 1;
  }
  const clipped = clean.slice(0, Math.max(0, low));
  return clipped ? `${clipped}${ellipsis}` : ellipsis;
}

function drawKeyValueBlock(params: {
  page: PDFPage;
  x: number;
  y: number;
  width: number;
  label: string;
  value: string;
  fontLabel: PDFFont;
  fontValue: PDFFont;
  labelSize: number;
  valueSize: number;
}) {
  const { page, x, y, width, label, value, fontLabel, fontValue, labelSize, valueSize } = params;
  page.drawText(label, { x, y, size: labelSize, font: fontLabel, color: BRAND_MUTED_RGB });
  const valueY = y - (labelSize + 4);
  const safe = truncateToWidth(value, fontValue, valueSize, width);
  page.drawText(safe, { x, y: valueY, size: valueSize, font: fontValue, color: BRAND_TEXT_RGB });
  return valueY - (valueSize + 10);
}

async function generateInvoicePdf(order: Order): Promise<Buffer> {
  const currency = safeCurrency(order);
  const formatCurrency = (value: number) => {
    try {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(value);
    } catch {
      return `${currency} ${value.toFixed(2)}`;
    }
  };

  const pdfDoc = await PDFDocument.create();
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const pageSize: [number, number] = [612, 792];
  const margin = 48;
  const bodyFontSize = 11;
  const smallFontSize = 9;
  const headerFontSize = 20;

  const customer = readCustomer(order.customer);
  const invoiceDate = formatDateLabel(order.createdAt);

  const computed = (order.items || []).map((it) => {
    const title = it.title || 'Item';
    const qty = Number(it.quantity || 1);
    const unit = typeof it.price === 'number' ? it.price : NaN;
    const amount = Number.isFinite(unit) ? unit * qty : NaN;
    return { title, qty, unit, amount };
  });

  const subtotal = computed.reduce((sum, row) => (Number.isFinite(row.amount) ? sum + row.amount : sum), 0);
  const total = subtotal;

  const table = {
    x: margin,
    width: pageSize[0] - margin * 2,
    headerHeight: 20,
    rowHeight: 18,
    paddingX: 8,
    paddingY: 6,
  };

  const col = {
    item: table.x,
    qty: table.x + table.width * 0.60,
    unit: table.x + table.width * 0.72,
    amount: table.x + table.width * 0.86,
    right: table.x + table.width,
  };

  const drawHeader = (page: PDFPage, yTop: number) => {
    // Accent bar
    page.drawRectangle({ x: margin, y: yTop - 6, width: page.getWidth() - margin * 2, height: 3, color: BRAND_ACCENT_RGB });

    page.drawText('ART MASONS', {
      x: margin,
      y: yTop - 28,
      size: 14,
      font: fontBold,
      color: BRAND_TEXT_RGB,
    });
    page.drawText('INVOICE', {
      x: page.getWidth() - margin - fontBold.widthOfTextAtSize('INVOICE', headerFontSize),
      y: yTop - 38,
      size: headerFontSize,
      font: fontBold,
      color: BRAND_TEXT_RGB,
    });

    // Meta blocks
    let metaYLeft = yTop - 62;
    metaYLeft = drawKeyValueBlock({
      page,
      x: margin,
      y: metaYLeft,
      width: (page.getWidth() - margin * 2) * 0.52,
      label: 'Invoice number',
      value: order.sessionId,
      fontLabel: fontRegular,
      fontValue: fontBold,
      labelSize: smallFontSize,
      valueSize: bodyFontSize,
    });
    metaYLeft = drawKeyValueBlock({
      page,
      x: margin,
      y: metaYLeft,
      width: (page.getWidth() - margin * 2) * 0.52,
      label: 'Status',
      value: order.status,
      fontLabel: fontRegular,
      fontValue: fontRegular,
      labelSize: smallFontSize,
      valueSize: bodyFontSize,
    });

    let metaYRight = yTop - 62;
    const rightX = margin + (page.getWidth() - margin * 2) * 0.60;
    const rightWidth = (page.getWidth() - margin * 2) * 0.40;
    metaYRight = drawKeyValueBlock({
      page,
      x: rightX,
      y: metaYRight,
      width: rightWidth,
      label: 'Invoice date',
      value: invoiceDate,
      fontLabel: fontRegular,
      fontValue: fontRegular,
      labelSize: smallFontSize,
      valueSize: bodyFontSize,
    });
    metaYRight = drawKeyValueBlock({
      page,
      x: rightX,
      y: metaYRight,
      width: rightWidth,
      label: 'Currency',
      value: currency,
      fontLabel: fontRegular,
      fontValue: fontRegular,
      labelSize: smallFontSize,
      valueSize: bodyFontSize,
    });

    // Billed to
    const billedToY = Math.min(metaYLeft, metaYRight) - 6;
    page.drawText('Billed to', { x: margin, y: billedToY, size: smallFontSize, font: fontRegular, color: BRAND_MUTED_RGB });
    let y = billedToY - 14;
    const lines = [customer.name, customer.email, customer.phone, customer.address].filter(Boolean).map(String);
    if (!lines.length) lines.push('');
    for (const line of lines) {
      const safe = truncateToWidth(line, fontRegular, bodyFontSize, (page.getWidth() - margin * 2) * 0.52);
      page.drawText(safe, { x: margin, y, size: bodyFontSize, font: fontRegular, color: BRAND_TEXT_RGB });
      y -= 14;
    }

    return y - 10;
  };

  const drawTableHeader = (page: PDFPage, yTop: number) => {
    // Header background
    page.drawRectangle({ x: table.x, y: yTop - table.headerHeight, width: table.width, height: table.headerHeight, color: BRAND_DARK_RGB });

    const headerY = yTop - table.headerHeight + 6;
    page.drawText('Description', { x: col.item + table.paddingX, y: headerY, size: smallFontSize, font: fontBold, color: rgb(1, 1, 1) });
    page.drawText('Qty', {
      x: col.unit - 8 - fontBold.widthOfTextAtSize('Qty', smallFontSize),
      y: headerY,
      size: smallFontSize,
      font: fontBold,
      color: rgb(1, 1, 1),
    });
    page.drawText('Unit', {
      x: col.amount - 8 - fontBold.widthOfTextAtSize('Unit', smallFontSize),
      y: headerY,
      size: smallFontSize,
      font: fontBold,
      color: rgb(1, 1, 1),
    });
    page.drawText('Amount', {
      x: col.right - table.paddingX - fontBold.widthOfTextAtSize('Amount', smallFontSize),
      y: headerY,
      size: smallFontSize,
      font: fontBold,
      color: rgb(1, 1, 1),
    });
    return yTop - table.headerHeight;
  };

  const drawTotals = (page: PDFPage, yTop: number) => {
    const boxWidth = table.width * 0.44;
    const x = table.x + table.width - boxWidth;
    const lineHeight = 16;
    const boxHeight = lineHeight * 3 + 14;

    page.drawRectangle({ x, y: yTop - boxHeight, width: boxWidth, height: boxHeight, borderColor: BRAND_BORDER_RGB, borderWidth: 1 });

    let y = yTop - 18;
    page.drawText('Subtotal', { x: x + 10, y, size: bodyFontSize, font: fontRegular, color: BRAND_TEXT_RGB });
    page.drawText(formatCurrency(subtotal), {
      x: x + boxWidth - 10 - fontRegular.widthOfTextAtSize(formatCurrency(subtotal), bodyFontSize),
      y,
      size: bodyFontSize,
      font: fontRegular,
      color: BRAND_TEXT_RGB,
    });
    y -= lineHeight;
    page.drawText('Total', { x: x + 10, y, size: bodyFontSize, font: fontBold, color: BRAND_TEXT_RGB });
    const totalLabel = formatCurrency(total);
    page.drawText(totalLabel, {
      x: x + boxWidth - 10 - fontBold.widthOfTextAtSize(totalLabel, bodyFontSize),
      y,
      size: bodyFontSize,
      font: fontBold,
      color: BRAND_TEXT_RGB,
    });

    return yTop - boxHeight - 14;
  };

  const drawFooter = (page: PDFPage) => {
    const footerText = 'info@artmasons.com  |  +971 56 170 4788';
    page.drawText(footerText, {
      x: margin,
      y: margin - 18,
      size: 9,
      font: fontRegular,
      color: BRAND_MUTED_RGB,
    });
  };

  let page = pdfDoc.addPage(pageSize);
  let y = page.getHeight() - margin;
  y = drawHeader(page, y);

  // Table
  y -= 6;
  y = drawTableHeader(page, y);
  y -= 6;

  for (const row of computed) {
    const safeTitle = truncateToWidth(row.title, fontRegular, bodyFontSize, col.qty - col.item - table.paddingX * 2);
    const qtyText = String(row.qty);
    const unitText = Number.isFinite(row.unit) ? formatCurrency(row.unit) : '—';
    const amountText = Number.isFinite(row.amount) ? formatCurrency(row.amount) : '—';

    const rowMinY = y - table.rowHeight;
    if (rowMinY < margin + 120) {
      drawFooter(page);
      page = pdfDoc.addPage(pageSize);
      y = page.getHeight() - margin;
      y = drawHeader(page, y);
      y -= 6;
      y = drawTableHeader(page, y);
      y -= 6;
    }

    // Row separator
    page.drawLine({ start: { x: table.x, y }, end: { x: table.x + table.width, y }, thickness: 1, color: BRAND_BORDER_RGB });

    const textY = y - table.paddingY - bodyFontSize;
    page.drawText(safeTitle, { x: col.item + table.paddingX, y: textY, size: bodyFontSize, font: fontRegular, color: BRAND_TEXT_RGB });
    page.drawText(qtyText, {
      x: col.unit - table.paddingX - fontRegular.widthOfTextAtSize(qtyText, bodyFontSize),
      y: textY,
      size: bodyFontSize,
      font: fontRegular,
      color: BRAND_TEXT_RGB,
    });
    page.drawText(unitText, {
      x: col.amount - table.paddingX - fontRegular.widthOfTextAtSize(unitText, bodyFontSize),
      y: textY,
      size: bodyFontSize,
      font: fontRegular,
      color: BRAND_TEXT_RGB,
    });
    page.drawText(amountText, {
      x: col.right - table.paddingX - fontRegular.widthOfTextAtSize(amountText, bodyFontSize),
      y: textY,
      size: bodyFontSize,
      font: fontRegular,
      color: BRAND_TEXT_RGB,
    });

    y -= table.rowHeight;
  }

  // Bottom border for the table
  page.drawLine({ start: { x: table.x, y }, end: { x: table.x + table.width, y }, thickness: 1, color: BRAND_BORDER_RGB });

  y -= 18;
  if (y < margin + 90) {
    drawFooter(page);
    page = pdfDoc.addPage(pageSize);
    y = page.getHeight() - margin;
    y = drawHeader(page, y);
    y -= 18;
  }

  drawTotals(page, y);
  drawFooter(page);

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}

export async function sendOrderInvoice(order: Order, to?: string) {
  const from = process.env.MAIL_FROM || process.env.SMTP_USER;
  if (!to) throw new Error('No recipient specified');
  const transporter = getTransporter();
  const subject = `Invoice — Order ${order.sessionId} (${order.status})`;
  const text = formatOrderText(order);
  const html = formatOrderHtml(order);

  // generate PDF invoice and attach
  type MailAttachment = NonNullable<SendMailOptions['attachments']>[number];
  const attachments: MailAttachment[] = [];
  try {
    const pdfBuffer = await generateInvoicePdf(order);
    attachments.push({ filename: `invoice-${order.sessionId}.pdf`, content: pdfBuffer, contentType: 'application/pdf' });
  } catch (e) {
    // if pdf generation fails, continue without attachment
    console.error('Failed to generate PDF invoice', e);
  }

  const info = await transporter.sendMail({
    from,
    to,
    subject,
    text,
    html,
    attachments,
  });

  return info;
}
