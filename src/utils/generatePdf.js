import jsPDF from "jspdf";

export function generatePdfReport(data) {
  const doc = new jsPDF();

  doc.setFontSize(22);
  doc.text("PowerFit Member Report", 20, 20);

  doc.setFontSize(12);

  doc.text(`Name: ${data.name}`, 20, 40);
  doc.text(`Email: ${data.email}`, 20, 50);

  doc.text(`Age: ${data.age}`, 20, 60);
  doc.text(`Height: ${data.height} cm`, 20, 70);
  doc.text(`Weight: ${data.weight} kg`, 20, 80);

  doc.text(`Goal: ${data.goal}`, 20, 90);
  doc.text(`Membership: ${data.membership}`, 20, 100);

  doc.text(`Bookings: ${data.bookings}`, 20, 120);
  doc.text(`Challenges: ${data.challenges}`, 20, 130);
  doc.text(`Workouts: ${data.workouts}`, 20, 140);
  doc.text(`Attendance: ${data.attendance}`, 20, 150);

  doc.text(
    `Generated: ${new Date().toLocaleDateString()}`,
    20,
    170
  );

  doc.save("PowerFit_Report.pdf");
}