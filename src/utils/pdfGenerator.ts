/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas-pro';
import { Trip, Expense, Income, Language } from '../types';
import { getCategoryMeta, PAYMENT_METHODS, getIncomeSourceMeta } from '../constants/categories';

/**
 * Generates an elegant, high-resolution A4 PDF with 100% native Bengali font support.
 * Uses html2canvas to render the DOM template with 'Hind Siliguri' font,
 * preventing any broken glyphs, garbled characters, or encoding issues.
 * Supports both expenses and income / budget top-ups.
 */
export async function downloadTripPdf(
  trip: Trip,
  expenses: Expense[],
  incomes: Income[] = [],
  language: Language = 'bn'
): Promise<void> {
  const isBn = language === 'bn';
  const totalSpent = expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
  const totalIncome = incomes.reduce((sum, i) => sum + (Number(i.amount) || 0), 0);
  const baseBudget = trip.budget || 0;
  const totalFunds = baseBudget + totalIncome;
  const remainingCash = totalFunds > 0 ? totalFunds - totalSpent : (baseBudget > 0 ? baseBudget - totalSpent : null);
  const isOverBudget = totalFunds > 0 && totalSpent > totalFunds;

  // Category summary calculation
  const categoryMap: Record<string, { name: string; amount: number; count: number }> = {};
  expenses.forEach((e) => {
    const meta = getCategoryMeta(e.category);
    const catName = isBn ? meta.nameBn : meta.nameEn;
    if (!categoryMap[e.category]) {
      categoryMap[e.category] = { name: catName, amount: 0, count: 0 };
    }
    categoryMap[e.category].amount += Number(e.amount) || 0;
    categoryMap[e.category].count += 1;
  });

  const categoryRows = Object.values(categoryMap).sort((a, b) => b.amount - a.amount);

  // Formatted date
  const reportDateStr = new Date().toLocaleDateString(isBn ? 'bn-BD' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Create an off-screen container with explicit A4 print styling & Hind Siliguri font
  const container = document.createElement('div');
  container.setAttribute('id', 'pdf-render-sandbox');
  container.style.position = 'fixed';
  container.style.left = '-9999px';
  container.style.top = '0';
  container.style.width = '800px';
  container.style.backgroundColor = '#ffffff';
  container.style.color = '#0f172a';
  container.style.fontFamily = "'Hind Siliguri', 'Noto Sans Bengali', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  container.style.padding = '36px 36px 44px 36px';
  container.style.boxSizing = 'border-box';
  container.style.lineHeight = '1.5';
  container.style.zIndex = '-1000';

  // Build the complete HTML with consistent Bengali typography
  container.innerHTML = `
    <div style="font-family: 'Hind Siliguri', 'Noto Sans Bengali', sans-serif; background: #ffffff; color: #0f172a;">
      <!-- Header Banner -->
      <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #0d9488; padding-bottom: 20px; margin-bottom: 24px;">
        <div>
          <div style="display: inline-block; background-color: #f0fdfa; color: #0d9488; font-weight: 700; font-size: 13px; padding: 4px 12px; border-radius: 9999px; margin-bottom: 8px; border: 1px solid #ccfbf1;">
            ${isBn ? 'ভ্রমণ আয়-ব্যয় খতিয়ান ও বাজেট রিপোর্ট' : 'Trip Income, Expense & Budget Statement'}
          </div>
          <h1 style="font-size: 26px; font-weight: 700; margin: 0 0 6px 0; color: #0f172a; line-height: 1.3;">
            ${trip.name || (isBn ? 'ভ্রমণ হিসাব' : 'Trip Report')}
          </h1>
          <div style="font-size: 13px; color: #475569; display: flex; flex-wrap: wrap; gap: 16px;">
            <span><strong>${isBn ? 'গন্তব্য:' : 'Destination:'}</strong> ${trip.destination || (isBn ? 'উল্লেখ নেই' : 'N/A')}</span>
            ${trip.startDate ? `<span><strong>${isBn ? 'ভ্রমণের তারিখ:' : 'Dates:'}</strong> ${trip.startDate} ${trip.endDate ? `থেকে ${trip.endDate}` : ''}</span>` : ''}
          </div>
          ${trip.notes ? `<div style="font-size: 12px; color: #64748b; margin-top: 6px; font-style: italic;">${trip.notes}</div>` : ''}
        </div>

        <div style="text-align: right; min-width: 170px;">
          <div style="font-size: 12px; font-weight: 600; color: #64748b; text-transform: uppercase;">
            ${isBn ? 'রিপোর্ট তৈরির তারিখ' : 'Report Generated'}
          </div>
          <div style="font-size: 14px; font-weight: 700; color: #0f172a; margin-top: 2px;">
            ${reportDateStr}
          </div>
          <div style="font-size: 12px; color: #0d9488; font-weight: 600; margin-top: 4px;">
            ${isBn ? `খরচ: ${expenses.length} টি • আয়/ফান্ড: ${incomes.length} টি` : `Expenses: ${expenses.length} • Incomes: ${incomes.length}`}
          </div>
        </div>
      </div>

      <!-- Financial Summary Cards -->
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-bottom: 26px;">
        <!-- Total Funds & Budget -->
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 14px 16px;">
          <div style="font-size: 12px; font-weight: 600; color: #64748b; text-transform: uppercase;">
            ${isBn ? 'মোট বাজেট ও ফান্ড' : 'Total Funds & Budget'}
          </div>
          <div style="font-size: 20px; font-weight: 700; color: #0284c7; margin-top: 4px;">
            ${trip.currency} ${totalFunds.toLocaleString()}
          </div>
          <div style="font-size: 11px; color: #64748b; margin-top: 2px;">
            ${isBn ? `মূল বাজেট: ${baseBudget.toLocaleString()} + চাঁদা/আয়: ${totalIncome.toLocaleString()}` : `Base: ${baseBudget} + Income: ${totalIncome}`}
          </div>
        </div>

        <!-- Total Spent -->
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 14px 16px;">
          <div style="font-size: 12px; font-weight: 600; color: #64748b; text-transform: uppercase;">
            ${isBn ? 'সর্বমোট খরচ' : 'Total Spent'}
          </div>
          <div style="font-size: 20px; font-weight: 700; color: #e11d48; margin-top: 4px;">
            ${trip.currency} ${totalSpent.toLocaleString()}
          </div>
          <div style="font-size: 11px; color: #94a3b8; margin-top: 2px;">
            ${isBn ? 'মোট ব্যয়ের পরিমাণ' : 'Cumulative expense'}
          </div>
        </div>

        <!-- Remaining Cash / Balance -->
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 14px 16px;">
          <div style="font-size: 12px; font-weight: 600; color: #64748b; text-transform: uppercase;">
            ${isBn ? 'অবশিষ্ট নগদ তহবিল' : 'Remaining Balance'}
          </div>
          <div style="font-size: 20px; font-weight: 700; margin-top: 4px; color: ${isOverBudget ? '#dc2626' : '#16a34a'};">
            ${remainingCash !== null
              ? (isOverBudget
                  ? `-${trip.currency} ${Math.abs(remainingCash).toLocaleString()}`
                  : `${trip.currency} ${remainingCash.toLocaleString()}`)
              : '—'}
          </div>
          <div style="font-size: 11px; font-weight: 600; color: ${isOverBudget ? '#dc2626' : '#16a34a'}; margin-top: 2px;">
            ${remainingCash !== null
              ? (isOverBudget ? (isBn ? 'বাজেট অতিক্রম (ঘাটতি)' : 'Deficit') : (isBn ? 'উদ্বৃত্ত নগদ ফান্ড' : 'Surplus Cash in Hand'))
              : (isBn ? 'হিসাব সম্পন্ন' : 'Balanced')}
          </div>
        </div>
      </div>

      <!-- Income & Funds Collection Ledger (if any) -->
      ${incomes.length > 0 ? `
        <div style="margin-bottom: 26px;">
          <div style="font-size: 15px; font-weight: 700; color: #0f172a; margin-bottom: 10px; display: flex; align-items: center; gap: 6px;">
            <span>💰 ${isBn ? 'আয় ও ফান্ড সংগ্রহের তালিকা' : 'Income & Funds Collected'}</span>
          </div>
          <table style="width: 100%; border-collapse: collapse; font-size: 12px; text-align: left; border: 1px solid #cbd5e1; border-radius: 8px; overflow: hidden;">
            <thead>
              <tr style="background-color: #059669; color: #ffffff; font-weight: 700;">
                <th style="padding: 8px 10px; border-bottom: 1px solid #047857; width: 85px;">${isBn ? 'তারিখ' : 'Date'}</th>
                <th style="padding: 8px 10px; border-bottom: 1px solid #047857;">${isBn ? 'আয় বা ফান্ডের নাম' : 'Source / Title'}</th>
                <th style="padding: 8px 10px; border-bottom: 1px solid #047857; width: 140px;">${isBn ? 'উৎস' : 'Category'}</th>
                <th style="padding: 8px 10px; border-bottom: 1px solid #047857; width: 90px;">${isBn ? 'মাধ্যম' : 'Method'}</th>
                <th style="padding: 8px 10px; border-bottom: 1px solid #047857; width: 100px;">${isBn ? 'প্রদানকারী' : 'Contributor'}</th>
                <th style="padding: 8px 10px; border-bottom: 1px solid #047857; text-align: right; width: 100px;">${isBn ? 'টাকা' : 'Amount'}</th>
              </tr>
            </thead>
            <tbody>
              ${incomes.map((inc, idx) => {
                const sourceMeta = getIncomeSourceMeta(inc.source);
                const methodMeta = PAYMENT_METHODS.find((m) => m.id === inc.paymentMethod);
                const methodName = isBn ? (methodMeta?.nameBn || inc.paymentMethod) : (methodMeta?.nameEn || inc.paymentMethod);
                const rowBg = idx % 2 === 0 ? '#ffffff' : '#f0fdf4';

                return `
                  <tr style="background-color: ${rowBg}; border-bottom: 1px solid #e2e8f0;">
                    <td style="padding: 7px 10px; color: #475569; font-size: 11.5px; white-space: nowrap;">${inc.date || '-'}</td>
                    <td style="padding: 7px 10px; color: #0f172a; font-weight: 500;">
                      ${inc.title}
                      ${inc.notes ? `<div style="font-size: 10.5px; color: #64748b; font-style: italic; margin-top: 1px;">${inc.notes}</div>` : ''}
                    </td>
                    <td style="padding: 7px 10px; color: #1e293b;">
                      <span style="display: inline-block; background-color: #dcfce7; color: #166534; font-weight: 600; font-size: 11px; padding: 2px 7px; border-radius: 6px; border: 1px solid #bbf7d0;">
                        ${isBn ? sourceMeta.nameBn : sourceMeta.nameEn}
                      </span>
                    </td>
                    <td style="padding: 7px 10px; color: #475569; font-size: 11.5px;">${methodName}</td>
                    <td style="padding: 7px 10px; color: #475569; font-size: 11.5px;">${inc.contributor || '-'}</td>
                    <td style="padding: 7px 10px; font-weight: 700; color: #16a34a; text-align: right; white-space: nowrap;">
                      +${trip.currency} ${inc.amount.toLocaleString()}
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
            <tfoot>
              <tr style="background-color: #dcfce7; font-weight: 700; border-top: 2px solid #86efac;">
                <td colspan="5" style="padding: 9px 10px; text-align: right; color: #14532d; font-size: 12.5px;">
                  ${isBn ? 'মোট সংগৃহীত আয় ও চাঁদা:' : 'Total Income Collected:'}
                </td>
                <td style="padding: 9px 10px; text-align: right; color: #16a34a; font-size: 13.5px; white-space: nowrap;">
                  +${trip.currency} ${totalIncome.toLocaleString()}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      ` : ''}

      <!-- Category Breakdown Table -->
      <div style="margin-bottom: 28px;">
        <div style="font-size: 15px; font-weight: 700; color: #0f172a; margin-bottom: 10px; display: flex; align-items: center; gap: 6px;">
          <span>📊 ${isBn ? 'ক্যাটাগরি অনুযায়ী খরচের সারসংক্ষেপ' : 'Category-wise Breakdown'}</span>
        </div>
        <table style="width: 100%; border-collapse: collapse; font-size: 13px; text-align: left; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
          <thead>
            <tr style="background-color: #334155; color: #ffffff; font-weight: 600;">
              <th style="padding: 10px 14px; border-bottom: 1px solid #cbd5e1;">${isBn ? 'ক্যাটাগরি' : 'Category'}</th>
              <th style="padding: 10px 14px; border-bottom: 1px solid #cbd5e1; text-align: center;">${isBn ? 'এন্ট্রি সংখ্যা' : 'Entries'}</th>
              <th style="padding: 10px 14px; border-bottom: 1px solid #cbd5e1; text-align: right;">${isBn ? 'টাকার পরিমাণ' : 'Amount'}</th>
              <th style="padding: 10px 14px; border-bottom: 1px solid #cbd5e1; text-align: right;">${isBn ? 'মোট খরচের ভাগ' : '% Share'}</th>
            </tr>
          </thead>
          <tbody>
            ${categoryRows.map((cat, idx) => {
              const pct = totalSpent > 0 ? ((cat.amount / totalSpent) * 100).toFixed(1) : '0';
              const bgColor = idx % 2 === 0 ? '#ffffff' : '#f8fafc';
              return `
                <tr style="background-color: ${bgColor}; border-bottom: 1px solid #e2e8f0;">
                  <td style="padding: 8px 14px; font-weight: 600; color: #1e293b;">${cat.name}</td>
                  <td style="padding: 8px 14px; color: #64748b; text-align: center;">${cat.count}</td>
                  <td style="padding: 8px 14px; font-weight: 700; color: #0f172a; text-align: right;">
                    ${trip.currency} ${cat.amount.toLocaleString()}
                  </td>
                  <td style="padding: 8px 14px; color: #475569; text-align: right;">${pct}%</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>

      <!-- Detailed Expenses Ledger -->
      <div style="margin-bottom: 24px;">
        <div style="font-size: 15px; font-weight: 700; color: #0f172a; margin-bottom: 10px; display: flex; align-items: center; gap: 6px;">
          <span>📝 ${isBn ? 'খরচের পূর্ণাঙ্গ খতিয়ান তালিকা' : 'Detailed Itemized Expenses Log'}</span>
        </div>
        <table style="width: 100%; border-collapse: collapse; font-size: 12px; text-align: left; border: 1px solid #cbd5e1; border-radius: 8px; overflow: hidden;">
          <thead>
            <tr style="background-color: #0f766e; color: #ffffff; font-weight: 700;">
              <th style="padding: 9px 10px; border-bottom: 1px solid #0d9488; width: 85px;">${isBn ? 'তারিখ' : 'Date'}</th>
              <th style="padding: 9px 10px; border-bottom: 1px solid #0d9488;">${isBn ? 'খরচের বিবরণ' : 'Description'}</th>
              <th style="padding: 9px 10px; border-bottom: 1px solid #0d9488; width: 130px;">${isBn ? 'ক্যাটাগরি' : 'Category'}</th>
              <th style="padding: 9px 10px; border-bottom: 1px solid #0d9488; width: 80px;">${isBn ? 'মাধ্যম' : 'Method'}</th>
              <th style="padding: 9px 10px; border-bottom: 1px solid #0d9488; width: 90px;">${isBn ? 'পরিশোধকারী' : 'Paid By'}</th>
              <th style="padding: 9px 10px; border-bottom: 1px solid #0d9488; text-align: right; width: 100px;">${isBn ? 'টাকা' : 'Amount'}</th>
            </tr>
          </thead>
          <tbody>
            ${expenses.map((exp, idx) => {
              const meta = getCategoryMeta(exp.category);
              const catName = isBn ? meta.nameBn : meta.nameEn;
              const methodMeta = PAYMENT_METHODS.find((m) => m.id === exp.paymentMethod);
              const methodName = isBn ? (methodMeta?.nameBn || exp.paymentMethod) : (methodMeta?.nameEn || exp.paymentMethod);
              const rowBg = idx % 2 === 0 ? '#ffffff' : '#f8fafc';

              return `
                <tr style="background-color: ${rowBg}; border-bottom: 1px solid #e2e8f0;">
                  <td style="padding: 8px 10px; color: #475569; font-size: 11.5px; white-space: nowrap;">${exp.date || '-'}</td>
                  <td style="padding: 8px 10px; color: #0f172a; font-weight: 500;">
                    ${exp.description}
                    ${exp.notes ? `<div style="font-size: 10.5px; color: #64748b; font-style: italic; margin-top: 1px;">${exp.notes}</div>` : ''}
                  </td>
                  <td style="padding: 8px 10px; color: #1e293b;">
                    <span style="display: inline-block; background-color: #f1f5f9; color: #334155; font-weight: 600; font-size: 11px; padding: 2px 7px; border-radius: 6px; border: 1px solid #e2e8f0;">
                      ${catName}
                    </span>
                  </td>
                  <td style="padding: 8px 10px; color: #475569; font-size: 11.5px;">${methodName}</td>
                  <td style="padding: 8px 10px; color: #475569; font-size: 11.5px;">${exp.paidBy || '-'}</td>
                  <td style="padding: 8px 10px; font-weight: 700; color: #0f172a; text-align: right; white-space: nowrap;">
                    ${trip.currency} ${exp.amount.toLocaleString()}
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
          <tfoot>
            <tr style="background-color: #f1f5f9; font-weight: 700; border-top: 2px solid #94a3b8;">
              <td colspan="5" style="padding: 11px 12px; text-align: right; color: #1e293b; font-size: 13px;">
                ${isBn ? 'সর্বমোট খরচ (Grand Total Spent):' : 'Grand Total Spent:'}
              </td>
              <td style="padding: 11px 12px; text-align: right; color: #e11d48; font-size: 14px; white-space: nowrap;">
                ${trip.currency} ${totalSpent.toLocaleString()}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      <!-- Footer Note -->
      <div style="border-top: 1px solid #e2e8f0; padding-top: 14px; text-align: center; font-size: 11px; color: #94a3b8;">
        ${isBn
          ? 'ভ্রমণ হিসাব (TripEx) • আপনার বিশ্বস্ত ভ্রমণ খরচ, আয় ও বাজেট ট্র্যাকার • সকল হিসাব অফলাইনে সুরক্ষিত'
          : 'Generated by TripEx • Travel Expense, Income & Budget Tracker • All data stored securely offline'}
      </div>
    </div>
  `;

  document.body.appendChild(container);

  try {
    // Wait for web fonts (Hind Siliguri) to be completely ready
    if (document.fonts && document.fonts.ready) {
      await document.fonts.ready;
    }

    // Capture using html2canvas-pro with scale 2 for crisp resolution and oklch support
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      windowWidth: 800,
      onclone: (clonedDoc) => {
        // Defensive cleanup for any unsupported color functions in cloned style tags
        try {
          const styles = clonedDoc.querySelectorAll('style');
          styles.forEach((styleTag) => {
            if (styleTag.textContent && styleTag.textContent.includes('oklch')) {
              styleTag.textContent = styleTag.textContent.replace(/oklch\([^)]+\)/g, '#0d9488');
            }
          });
        } catch {
          // Ignore if error during style replacement
        }
      }
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pdfWidth = 210; // A4 width in mm
    const pdfHeight = 297; // A4 height in mm
    const margin = 10;
    const printWidth = pdfWidth - (margin * 2); // 190 mm
    const printHeight = (canvas.height * printWidth) / canvas.width;

    // Handle pagination if document height exceeds one A4 page
    const pageAvailableHeight = pdfHeight - (margin * 2);

    if (printHeight <= pageAvailableHeight) {
      // Fits on a single page
      pdf.addImage(imgData, 'JPEG', margin, margin, printWidth, printHeight);
    } else {
      // Multi-page slicing
      let heightLeft = printHeight;
      let position = margin;
      let pageNumber = 1;

      // First page
      pdf.addImage(imgData, 'JPEG', margin, position, printWidth, printHeight);
      heightLeft -= pageAvailableHeight;

      // Subsequent pages
      while (heightLeft > 0) {
        position = margin - (pageNumber * pageAvailableHeight);
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', margin, position, printWidth, printHeight);
        heightLeft -= pageAvailableHeight;
        pageNumber++;
      }
    }

    // Generate safe file name in Bengali or English
    const safeTripName = (trip.name || 'Trip')
      .replace(/[\s/\\?%*:|"<>]/g, '_')
      .slice(0, 40);

    pdf.save(`${safeTripName}_হিসাব_রিপোর্ট.pdf`);
  } finally {
    // Clean up temporary DOM element
    if (container.parentNode) {
      container.parentNode.removeChild(container);
    }
  }
}
