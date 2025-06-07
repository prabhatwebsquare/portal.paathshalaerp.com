export default function shareViaWhatsApp() {
    const url = encodeURIComponent('download.pdf');
    window.open(`https://web.whatsapp.com/send?text=Pdf`, '_blank');
  }
  