import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const downloadInvoice = (order) => {
    const doc = new jsPDF();
    
    doc.setFontSize(22);
    doc.setTextColor(255, 107, 0);
    doc.setFont("helvetica", "bold");
    doc.text("ETHIO DELIGHT", 14, 22);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.setFont("helvetica", "normal");
    doc.text(`Invoice ID: ${order._id.toUpperCase()}`, 14, 30);
    doc.text(`Date: ${new Date(order.orderedAt).toLocaleString()}`, 14, 35);

    doc.setDrawColor(240);
    doc.line(14, 42, 196, 42);

    doc.setTextColor(0);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Deliver To:", 14, 52);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(80);
    const splitAddress = doc.splitTextToSize(order.deliveryAddress || "N/A", 100);
    doc.text(splitAddress, 14, 58);

    const tableRows = order.items?.map(item => {
        const name = item.name || item.productId?.name || "Unknown Item";
        const qty = item.quantity || 0;
        const price = item.price || item.productId?.price || 0;
        const lineTotal = qty * price;

        return [
            name,
            qty,
            `${price} ETB`,
            `${lineTotal.toFixed(2)} ETB`
        ];
    }) || [];

    autoTable(doc, {
        startY: 75,
        head: [['Item', 'Qty', 'Unit Price', 'Total']],
        body: tableRows,
        headStyles: { fillColor: [255, 107, 0], fontStyle: 'bold' },
        alternateRowStyles: { fillColor: [250, 250, 250] },
        margin: { top: 10 },
    });

    const finalY = doc.lastAutoTable.finalY + 15;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0);
    doc.text(`Grand Total: ${order.totalAmount} ETB`, 14, finalY);

    doc.setFontSize(9);
    doc.setTextColor(150);
    doc.setFont("helvetica", "italic");
    doc.text("Thank you for choosing Ethio Delight!", 105, finalY + 20, { align: "center" });

    doc.save(`Invoice_${order._id.slice(-6).toUpperCase()}.pdf`);
};